import type { BirthProfile, BirthTimePrecision, TraditionalRuleSex } from "../../types/domain/birth";
import { BirthNormalizationError } from "./errors.ts";
import { assertCoordinates, normalizeCountryCode, resolveLocation } from "./location.ts";
import { canonicalizeIanaTimeZone, partsAtInstant } from "./timezone.ts";
import type {
  BirthNormalizationDependencies,
  BirthNormalizationInput,
  BirthNormalizationResult,
  LocationCandidate,
  TimezoneResolution,
} from "./types.ts";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

function assertUuid(value: string, field: string): void {
  if (!UUID_PATTERN.test(value)) {
    throw new BirthNormalizationError("INVALID_UUID", `${field} must be an RFC 4122 UUID.`, { field });
  }
}

function normalizeDate(value: string): string {
  const match = DATE_PATTERN.exec(value.trim());
  if (!match) {
    throw new BirthNormalizationError("INVALID_BIRTH_DATE", "birthDate must use YYYY-MM-DD.", {
      field: "birthDate",
    });
  }
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new BirthNormalizationError("INVALID_BIRTH_DATE", "birthDate is not a real Gregorian date.", {
      field: "birthDate",
    });
  }
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function normalizeTime(value: string): string {
  const match = TIME_PATTERN.exec(value.trim());
  if (!match) {
    throw new BirthNormalizationError("INVALID_BIRTH_TIME", "birthTime must use HH:mm or HH:mm:ss.", {
      field: "birthTime",
    });
  }
  const [hour, minute, second] = [Number(match[1]), Number(match[2]), Number(match[3] ?? "0")];
  if (hour > 23 || minute > 59 || second > 59) {
    throw new BirthNormalizationError("INVALID_BIRTH_TIME", "birthTime is outside the valid clock range.", {
      field: "birthTime",
    });
  }
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
}

function normalizeBirthTime(
  value: string | null | undefined,
  precision: BirthTimePrecision,
): string | null {
  if (!(precision === "exact" || precision === "approximate" || precision === "unknown")) {
    throw new BirthNormalizationError("INVALID_TIME_PRECISION", "Unsupported birthTimePrecision.", {
      field: "birthTimePrecision",
    });
  }
  if (precision === "unknown") {
    if (value != null && value.trim() !== "") {
      throw new BirthNormalizationError(
        "INVALID_BIRTH_TIME",
        "birthTime must be omitted when birthTimePrecision is unknown.",
        { field: "birthTime" },
      );
    }
    return null;
  }
  if (value == null || value.trim() === "") {
    throw new BirthNormalizationError(
      "INVALID_BIRTH_TIME",
      `birthTime is required when birthTimePrecision is ${precision}.`,
      { field: "birthTime" },
    );
  }
  return normalizeTime(value);
}

function preferredCity(location: LocationCandidate): string {
  return location.city.en ?? location.city.zhHans ?? "Unknown city";
}

function birthPlaceLabel(location: LocationCandidate): string {
  const city =
    location.city.zhHans && location.city.en
      ? `${location.city.zhHans} / ${location.city.en}`
      : preferredCity(location);
  const country =
    location.country.zhHans && location.country.en
      ? `${location.country.zhHans} / ${location.country.en}`
      : (location.country.en ?? location.country.zhHans);
  return country ? `${city}, ${country}` : city;
}

function validateTraditionalRuleSex(value: TraditionalRuleSex): TraditionalRuleSex {
  if (!(value === "male" || value === "female" || value === "unspecified")) {
    throw new BirthNormalizationError(
      "INVALID_TRADITIONAL_RULE_SEX",
      "sexForTraditionalRules must be male, female, or unspecified.",
      { field: "sexForTraditionalRules" },
    );
  }
  return value;
}

function assertBirthNotInFuture(
  birthDate: string,
  timezone: string,
  resolution: TimezoneResolution,
  now: Date,
): void {
  if (resolution.resolvedInstant) {
    if (Date.parse(resolution.resolvedInstant) > now.getTime()) {
      throw new BirthNormalizationError(
        "BIRTH_DATE_IN_FUTURE",
        "Birth date/time cannot be in the future.",
        { field: "birthDate" },
      );
    }
    return;
  }
  const parts = partsAtInstant(now, timezone);
  const localDate = `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
  if (birthDate > localDate) {
    throw new BirthNormalizationError("BIRTH_DATE_IN_FUTURE", "Birth date cannot be in the future.", {
      field: "birthDate",
    });
  }
}

function defaultCreateId(): string {
  return crypto.randomUUID();
}

export async function normalizeBirthProfile(
  input: BirthNormalizationInput,
  dependencies: BirthNormalizationDependencies,
): Promise<BirthNormalizationResult> {
  const birthDate = normalizeDate(input.birthDate);
  const birthTime = normalizeBirthTime(input.birthTime, input.birthTimePrecision);
  if (input.id) assertUuid(input.id, "id");
  if (input.userId) assertUuid(input.userId, "userId");

  const location = await resolveLocation(input, dependencies.locationProvider);
  let resolution: TimezoneResolution | null;
  try {
    resolution = await dependencies.timezoneResolver.resolve({
      location,
      birthDate,
      birthTime,
      birthTimePrecision: input.birthTimePrecision,
      utcOffsetMinutes: input.utcOffsetMinutes,
    });
  } catch (cause) {
    if (cause instanceof BirthNormalizationError) throw cause;
    throw new BirthNormalizationError("TIMEZONE_RESOLUTION_FAILED", "Timezone resolution failed.", {
      details: { resolver: dependencies.timezoneResolver.resolverName },
      cause,
    });
  }
  if (!resolution) {
    throw new BirthNormalizationError("TIMEZONE_NOT_FOUND", "No IANA timezone could be resolved.", {
      details: {
        resolver: dependencies.timezoneResolver.resolverName,
        coordinates: location.coordinates,
      },
    });
  }

  const timezone = canonicalizeIanaTimeZone(resolution.timezone);
  assertCoordinates(location.coordinates);
  const countryCode = normalizeCountryCode(location.countryCode);
  const nowDate = (dependencies.now ?? (() => new Date()))();
  assertBirthNotInFuture(birthDate, timezone, resolution, nowDate);
  const id = input.id ?? (dependencies.createId ?? defaultCreateId)();
  assertUuid(id, "id");

  const warnings: string[] = [];
  if (input.birthTimePrecision === "approximate") {
    warnings.push(
      "Birth time is approximate; downstream hour-sensitive calculations must preserve this uncertainty.",
    );
  }
  if (input.birthTimePrecision === "unknown") {
    warnings.push(
      "Birth time is unknown; timezone offset, DST state, resolved instant, and hour pillar cannot be determined from this profile alone.",
    );
  }
  if (resolution.isDst == null && input.birthTimePrecision !== "unknown") {
    warnings.push(
      "Timezone offset changes this year, but the selected instant could not be reliably labeled as DST or standard time.",
    );
  }

  const now = nowDate.toISOString();
  const profile: BirthProfile = {
    id,
    ...(input.userId ? { userId: input.userId } : {}),
    label: input.label?.trim() || `${preferredCity(location)} · ${birthDate}`,
    calendar: "gregorian",
    birthDate,
    birthTime,
    birthTimePrecision: input.birthTimePrecision,
    timezone,
    birthPlace: {
      label: birthPlaceLabel(location),
      countryCode,
      locality: preferredCity(location),
      coordinates: { ...location.coordinates },
    },
    sexForTraditionalRules: validateTraditionalRuleSex(
      input.sexForTraditionalRules ?? "unspecified",
    ),
    createdAt: now,
    updatedAt: now,
  };

  return {
    profile,
    metadata: {
      locationProvider: dependencies.locationProvider.providerName,
      timezoneResolver: dependencies.timezoneResolver.resolverName,
      location,
      timezone: { ...resolution, timezone },
      warnings,
    },
  };
}
