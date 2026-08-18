import { IanaHintTimezoneResolver } from "../timezone.ts";
import type {
  LocalizedLocationName,
  LocationCandidate,
  LocationProvider,
  LocationSearchInput,
  TimezoneResolution,
  TimezoneResolveInput,
  TimezoneResolver,
} from "../types.ts";

type FetchLike = typeof fetch;

interface GeoNamesSearchResult {
  geonameId?: number;
  name?: string;
  toponymName?: string;
  countryName?: string;
  countryCode?: string;
  lat?: string | number;
  lng?: string | number;
  timezone?: { timeZoneId?: string; timezoneId?: string };
}

interface GeoNamesSearchResponse {
  geonames?: GeoNamesSearchResult[];
}

interface GeoNamesTimezoneResponse {
  timezoneId?: string;
  status?: { message?: string; value?: number };
}

export interface GeoNamesLocationProviderOptions {
  username: string;
  fetcher?: FetchLike;
  endpoint?: string;
  language?: string;
  maxRows?: number;
}

export interface GeoNamesTimezoneResolverOptions {
  username: string;
  fetcher?: FetchLike;
  endpoint?: string;
}

const HAN_PATTERN = /\p{Script=Han}/u;

function localizedName(value: string, sourceInput: string): LocalizedLocationName {
  const canonical = value.trim();
  const source = sourceInput.trim();
  const canonicalIsHan = HAN_PATTERN.test(canonical);
  const sourceIsHan = HAN_PATTERN.test(source);
  return {
    ...(canonicalIsHan ? { zhHans: canonical } : { en: canonical }),
    ...(source && source !== canonical
      ? sourceIsHan
        ? { zhHans: source }
        : { en: source }
      : {}),
  };
}

export class GeoNamesLocationProvider implements LocationProvider {
  readonly providerName = "geonames";
  private readonly username: string;
  private readonly fetcher: FetchLike;
  private readonly endpoint: string;
  private readonly language: string;
  private readonly maxRows: number;

  constructor(options: GeoNamesLocationProviderOptions) {
    if (!options.username.trim()) {
      throw new Error("GeoNamesLocationProvider requires a GeoNames username.");
    }
    this.username = options.username;
    this.fetcher = options.fetcher ?? fetch;
    this.endpoint = options.endpoint ?? "https://secure.geonames.org/searchJSON";
    this.language = options.language ?? "en";
    this.maxRows = options.maxRows ?? 8;
  }

  async search(input: LocationSearchInput): Promise<readonly LocationCandidate[]> {
    const url = new URL(this.endpoint);
    url.searchParams.set("q", `${input.city} ${input.country}`);
    url.searchParams.set("username", this.username);
    url.searchParams.set("lang", this.language);
    url.searchParams.set("maxRows", String(this.maxRows));
    url.searchParams.set("style", "FULL");
    url.searchParams.set("featureClass", "P");
    url.searchParams.set("isNameRequired", "true");
    if (input.countryCode) url.searchParams.set("country", input.countryCode.toUpperCase());

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new Error(`GeoNames search failed with HTTP ${response.status}.`);
    }
    const payload = (await response.json()) as GeoNamesSearchResponse;

    return (payload.geonames ?? []).flatMap((result) => {
      const city = result.name ?? result.toponymName;
      const country = result.countryName;
      const countryCode = result.countryCode;
      const latitude = Number(result.lat);
      const longitude = Number(result.lng);
      if (
        result.geonameId == null ||
        !city ||
        !country ||
        !countryCode ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return [];
      }
      const timezone = result.timezone?.timeZoneId ?? result.timezone?.timezoneId;
      const candidate: LocationCandidate = {
        providerLocationId: `geonames:${result.geonameId}`,
        city: localizedName(city, input.city),
        country: localizedName(country, input.country),
        countryCode: countryCode.toUpperCase(),
        coordinates: { latitude, longitude },
        ...(timezone ? { timezone } : {}),
        aliases: [result.toponymName, input.city].filter(
          (value): value is string => Boolean(value),
        ),
      };
      return [candidate];
    });
  }
}

export class GeoNamesTimezoneResolver implements TimezoneResolver {
  readonly resolverName = "geonames-timezone+iana-runtime";
  private readonly username: string;
  private readonly fetcher: FetchLike;
  private readonly endpoint: string;
  private readonly ianaResolver = new IanaHintTimezoneResolver();

  constructor(options: GeoNamesTimezoneResolverOptions) {
    if (!options.username.trim()) {
      throw new Error("GeoNamesTimezoneResolver requires a GeoNames username.");
    }
    this.username = options.username;
    this.fetcher = options.fetcher ?? fetch;
    this.endpoint = options.endpoint ?? "https://secure.geonames.org/timezoneJSON";
  }

  async resolve(input: TimezoneResolveInput): Promise<TimezoneResolution | null> {
    if (input.location.timezone) {
      const result = await this.ianaResolver.resolve(input);
      return result ? { ...result, source: this.resolverName } : null;
    }

    const url = new URL(this.endpoint);
    url.searchParams.set("lat", String(input.location.coordinates.latitude));
    url.searchParams.set("lng", String(input.location.coordinates.longitude));
    url.searchParams.set("username", this.username);

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new Error(`GeoNames timezone lookup failed with HTTP ${response.status}.`);
    }
    const payload = (await response.json()) as GeoNamesTimezoneResponse;
    if (!payload.timezoneId) {
      if (payload.status?.message) {
        throw new Error(`GeoNames timezone lookup failed: ${payload.status.message}`);
      }
      return null;
    }

    const result = await this.ianaResolver.resolve({
      ...input,
      location: { ...input.location, timezone: payload.timezoneId },
    });
    return result ? { ...result, source: this.resolverName } : null;
  }
}
