import { BirthNormalizationError } from "./errors.ts";
import type {
  LocalTimeDisambiguation,
  TimezoneResolution,
  TimezoneResolveInput,
  TimezoneResolver,
} from "./types.ts";

interface DateTimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export function canonicalizeIanaTimeZone(value: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: value }).resolvedOptions().timeZone;
  } catch (cause) {
    throw new BirthNormalizationError("INVALID_TIMEZONE", `Invalid IANA timezone: ${value}`, {
      field: "timezone",
      cause,
    });
  }
}

function formatter(timeZone: string, timeZoneName?: "long"): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    ...(timeZoneName ? { timeZoneName } : {}),
  });
}

export function partsAtInstant(date: Date, timeZone: string): DateTimeParts {
  const values = new Map(
    formatter(timeZone)
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return {
    year: Number(values.get("year")),
    month: Number(values.get("month")),
    day: Number(values.get("day")),
    hour: Number(values.get("hour")),
    minute: Number(values.get("minute")),
    second: Number(values.get("second")),
  };
}

function parseLocalParts(date: string, time: string): DateTimeParts {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second] = time.split(":").map(Number);
  return { year, month, day, hour, minute, second };
}

function sameParts(left: DateTimeParts, right: DateTimeParts): boolean {
  return Object.keys(left).every(
    (key) => left[key as keyof DateTimeParts] === right[key as keyof DateTimeParts],
  );
}

export function getTimeZoneOffsetMinutes(timeZoneInput: string, instant: Date): number {
  const timeZone = canonicalizeIanaTimeZone(timeZoneInput);
  const parts = partsAtInstant(instant, timeZone);
  const representedUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return Math.round((representedUtc - instant.getTime()) / 60_000);
}

function getTimeZoneName(timeZone: string, instant: Date): string | null {
  return (
    formatter(timeZone, "long")
      .formatToParts(instant)
      .find((item) => item.type === "timeZoneName")?.value ?? null
  );
}

function offsetsForYear(timeZone: string, year: number): Set<number> {
  const offsets = new Set<number>();
  for (let month = 0; month < 12; month += 1) {
    offsets.add(getTimeZoneOffsetMinutes(timeZone, new Date(Date.UTC(year, month, 15, 12))));
  }
  return offsets;
}

function inferDst(
  timeZone: string,
  instant: Date,
): { isDst: boolean | null; observesDstThisYear: boolean } {
  const offsets = offsetsForYear(timeZone, instant.getUTCFullYear());
  if (offsets.size <= 1) return { isDst: false, observesDstThisYear: false };
  const name = getTimeZoneName(timeZone, instant)?.toLowerCase() ?? "";
  if (name.includes("daylight") || name.includes("summer")) {
    return { isDst: true, observesDstThisYear: true };
  }
  if (name.includes("standard")) return { isDst: false, observesDstThisYear: true };
  return { isDst: null, observesDstThisYear: true };
}

function localInstantCandidates(date: string, time: string, timeZone: string) {
  const target = parseLocalParts(date, time);
  const localAsUtc = Date.UTC(
    target.year,
    target.month - 1,
    target.day,
    target.hour,
    target.minute,
    target.second,
  );
  const offsets = new Set<number>();
  for (let hourDelta = -48; hourDelta <= 48; hourDelta += 6) {
    offsets.add(
      getTimeZoneOffsetMinutes(timeZone, new Date(localAsUtc + hourDelta * 3_600_000)),
    );
  }
  return [...offsets]
    .map((offsetMinutes) => ({
      offsetMinutes,
      instant: new Date(localAsUtc - offsetMinutes * 60_000),
    }))
    .filter((candidate) => sameParts(partsAtInstant(candidate.instant, timeZone), target))
    .sort((left, right) => left.instant.getTime() - right.instant.getTime());
}

export function resolveIanaLocalDateTime(
  date: string,
  time: string,
  timeZoneInput: string,
  utcOffsetMinutes?: number,
): Omit<TimezoneResolution, "source"> {
  const timeZone = canonicalizeIanaTimeZone(timeZoneInput);
  const candidates = localInstantCandidates(date, time, timeZone);
  if (candidates.length === 0) {
    throw new BirthNormalizationError(
      "NONEXISTENT_LOCAL_TIME",
      "The entered local birth time did not exist because of a timezone clock change.",
      { field: "birthTime", details: { date, time, timezone: timeZone } },
    );
  }

  let selected = candidates[0];
  let disambiguation: LocalTimeDisambiguation = "unique";
  if (candidates.length > 1) {
    if (utcOffsetMinutes == null) {
      throw new BirthNormalizationError(
        "AMBIGUOUS_LOCAL_TIME",
        "The entered local birth time occurred twice; utcOffsetMinutes is required.",
        {
          field: "utcOffsetMinutes",
          details: { validOffsets: candidates.map((candidate) => candidate.offsetMinutes) },
        },
      );
    }
    const match = candidates.find((candidate) => candidate.offsetMinutes === utcOffsetMinutes);
    if (!match) {
      throw new BirthNormalizationError(
        "AMBIGUOUS_LOCAL_TIME",
        "utcOffsetMinutes does not match either valid occurrence of the local birth time.",
        {
          field: "utcOffsetMinutes",
          details: { validOffsets: candidates.map((candidate) => candidate.offsetMinutes) },
        },
      );
    }
    selected = match;
    disambiguation = "offset";
  } else if (utcOffsetMinutes != null && utcOffsetMinutes !== selected.offsetMinutes) {
    throw new BirthNormalizationError(
      "TIMEZONE_RESOLUTION_FAILED",
      "utcOffsetMinutes conflicts with the timezone offset for the entered local birth time.",
      {
        field: "utcOffsetMinutes",
        details: { utcOffsetMinutes, expectedOffset: selected.offsetMinutes },
      },
    );
  }

  const dst = inferDst(timeZone, selected.instant);
  return {
    timezone: timeZone,
    offsetMinutes: selected.offsetMinutes,
    isDst: dst.isDst,
    observesDstThisYear: dst.observesDstThisYear,
    localTimeDisambiguation: disambiguation,
    resolvedInstant: selected.instant.toISOString(),
    timezoneName: getTimeZoneName(timeZone, selected.instant),
  };
}

export class IanaHintTimezoneResolver implements TimezoneResolver {
  readonly resolverName = "iana-location-hint";

  async resolve(input: TimezoneResolveInput): Promise<TimezoneResolution | null> {
    if (!input.location.timezone) return null;
    const timezone = canonicalizeIanaTimeZone(input.location.timezone);
    if (input.birthTime == null) {
      const year = Number(input.birthDate.slice(0, 4));
      return {
        timezone,
        source: this.resolverName,
        offsetMinutes: null,
        isDst: null,
        observesDstThisYear: offsetsForYear(timezone, year).size > 1,
        localTimeDisambiguation: "unknown",
        resolvedInstant: null,
        timezoneName: null,
      };
    }
    return {
      ...resolveIanaLocalDateTime(
        input.birthDate,
        input.birthTime,
        timezone,
        input.utcOffsetMinutes,
      ),
      source: this.resolverName,
    };
  }
}

export class FunctionTimezoneResolver implements TimezoneResolver {
  readonly resolverName: string;
  private readonly lookup: (input: TimezoneResolveInput) => Promise<TimezoneResolution | null>;

  constructor(
    resolverName: string,
    lookup: (input: TimezoneResolveInput) => Promise<TimezoneResolution | null>,
  ) {
    this.resolverName = resolverName;
    this.lookup = lookup;
  }

  resolve(input: TimezoneResolveInput): Promise<TimezoneResolution | null> {
    return this.lookup(input);
  }
}

export class CompositeTimezoneResolver implements TimezoneResolver {
  readonly resolverName: string;
  private readonly resolvers: readonly TimezoneResolver[];

  constructor(resolvers: readonly TimezoneResolver[]) {
    if (resolvers.length === 0) {
      throw new Error("CompositeTimezoneResolver requires a resolver.");
    }
    this.resolvers = resolvers;
    this.resolverName = `composite:${resolvers.map((resolver) => resolver.resolverName).join(",")}`;
  }

  async resolve(input: TimezoneResolveInput): Promise<TimezoneResolution | null> {
    for (const resolver of this.resolvers) {
      const result = await resolver.resolve(input);
      if (result) return result;
    }
    return null;
  }
}
