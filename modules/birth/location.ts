import type { GeoPoint } from "../../types/domain/common";
import { BirthNormalizationError } from "./errors.ts";
import type {
  BirthNormalizationInput,
  LocationCandidate,
  LocationProvider,
  LocationSearchInput,
  StaticLocationRecord,
} from "./types.ts";

const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;

function normalizeSearchText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeCountryCode(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (!COUNTRY_CODE_PATTERN.test(normalized)) {
    throw new BirthNormalizationError(
      "INVALID_LOCATION_RESULT",
      "Location provider returned an invalid ISO 3166-1 alpha-2 country code.",
      { field: "countryCode", details: { value } },
    );
  }
  return normalized;
}

export function assertCoordinates(coordinates: GeoPoint): void {
  if (
    !Number.isFinite(coordinates.latitude) ||
    !Number.isFinite(coordinates.longitude) ||
    coordinates.latitude < -90 ||
    coordinates.latitude > 90 ||
    coordinates.longitude < -180 ||
    coordinates.longitude > 180
  ) {
    throw new BirthNormalizationError(
      "INVALID_LOCATION_RESULT",
      "Location provider returned invalid coordinates.",
      { field: "coordinates", details: { coordinates } },
    );
  }
}

function normalizeCandidate(candidate: LocationCandidate): LocationCandidate {
  if (!candidate.providerLocationId.trim()) {
    throw new BirthNormalizationError(
      "INVALID_LOCATION_RESULT",
      "Location provider returned an empty location id.",
      { field: "providerLocationId" },
    );
  }
  assertCoordinates(candidate.coordinates);
  const city = {
    zhHans: candidate.city.zhHans?.trim() || undefined,
    en: candidate.city.en?.trim() || undefined,
  };
  const country = {
    zhHans: candidate.country.zhHans?.trim() || undefined,
    en: candidate.country.en?.trim() || undefined,
  };
  if (!city.zhHans && !city.en) {
    throw new BirthNormalizationError(
      "INVALID_LOCATION_RESULT",
      "Location provider must return at least one canonical city name.",
      { field: "city" },
    );
  }
  if (!country.zhHans && !country.en) {
    throw new BirthNormalizationError(
      "INVALID_LOCATION_RESULT",
      "Location provider must return at least one canonical country/region name.",
      { field: "country" },
    );
  }
  return {
    ...candidate,
    city,
    country,
    countryCode: normalizeCountryCode(candidate.countryCode),
    timezone: candidate.timezone?.trim() || undefined,
    aliases: candidate.aliases?.map((alias) => alias.trim()).filter(Boolean),
  };
}

export async function resolveLocation(
  input: BirthNormalizationInput,
  provider: LocationProvider,
): Promise<LocationCandidate> {
  const city = normalizeSearchText(input.city);
  const country = normalizeSearchText(input.country);
  if (!city || !country) {
    throw new BirthNormalizationError(
      "INVALID_LOCATION_QUERY",
      "Both birth city and country/region are required.",
      { field: !city ? "city" : "country" },
    );
  }

  let countryCode: string | undefined;
  if (input.countryCode) {
    countryCode = input.countryCode.trim().toUpperCase();
    if (!COUNTRY_CODE_PATTERN.test(countryCode)) {
      throw new BirthNormalizationError(
        "INVALID_LOCATION_QUERY",
        "countryCode must use ISO 3166-1 alpha-2 format.",
        { field: "countryCode" },
      );
    }
  }

  let results: readonly LocationCandidate[];
  try {
    results = await provider.search({ city, country, countryCode });
  } catch (cause) {
    if (cause instanceof BirthNormalizationError) throw cause;
    throw new BirthNormalizationError("LOCATION_NOT_FOUND", "Location provider request failed.", {
      details: { provider: provider.providerName },
      cause,
    });
  }

  const normalized = results.map(normalizeCandidate);
  if (normalized.length === 0) {
    throw new BirthNormalizationError("LOCATION_NOT_FOUND", "No matching birth location was found.", {
      details: { city, country, provider: provider.providerName },
    });
  }

  if (input.locationId) {
    const locationId = input.locationId.trim();
    const selected = normalized.find((candidate) => candidate.providerLocationId === locationId);
    if (!selected) {
      throw new BirthNormalizationError(
        "LOCATION_SELECTION_NOT_FOUND",
        "The selected location is not present in the provider results.",
        { field: "locationId", details: { locationId } },
      );
    }
    return selected;
  }

  if (normalized.length > 1) {
    throw new BirthNormalizationError(
      "LOCATION_AMBIGUOUS",
      "Multiple birth locations matched. A provider location id must be selected.",
      {
        field: "locationId",
        details: {
          candidates: normalized.map(
            ({ providerLocationId, city: names, country: region, countryCode: code, coordinates }) => ({
              providerLocationId,
              city: names,
              country: region,
              countryCode: code,
              coordinates,
            }),
          ),
        },
      },
    );
  }

  return normalized[0];
}

export class FunctionLocationProvider implements LocationProvider {
  readonly providerName: string;
  private readonly lookup: (input: LocationSearchInput) => Promise<readonly LocationCandidate[]>;

  constructor(
    providerName: string,
    lookup: (input: LocationSearchInput) => Promise<readonly LocationCandidate[]>,
  ) {
    this.providerName = providerName;
    this.lookup = lookup;
  }

  search(input: LocationSearchInput): Promise<readonly LocationCandidate[]> {
    return this.lookup(input);
  }
}

export class StaticLocationProvider implements LocationProvider {
  readonly providerName: string;
  private readonly records: readonly StaticLocationRecord[];

  constructor(records: readonly StaticLocationRecord[], providerName = "static") {
    this.records = records;
    this.providerName = providerName;
  }

  async search(input: LocationSearchInput): Promise<readonly LocationCandidate[]> {
    const cityQuery = normalizeSearchText(input.city).toLocaleLowerCase("en-US");
    const countryQuery = normalizeSearchText(input.country).toLocaleLowerCase("en-US");
    const countryCode = input.countryCode?.trim().toUpperCase();

    return this.records.filter((record) => {
      const cities = [record.city.zhHans, record.city.en, ...(record.aliases ?? [])]
        .filter((value): value is string => Boolean(value))
        .map((value) => normalizeSearchText(value).toLocaleLowerCase("en-US"));
      const countries = [record.country.zhHans, record.country.en, record.countryCode]
        .filter((value): value is string => Boolean(value))
        .map((value) => normalizeSearchText(value).toLocaleLowerCase("en-US"));
      return (
        cities.includes(cityQuery) &&
        countries.includes(countryQuery) &&
        (!countryCode || record.countryCode.toUpperCase() === countryCode)
      );
    });
  }
}
