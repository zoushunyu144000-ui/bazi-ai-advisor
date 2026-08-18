import type {
  LocalizedLocationName,
  LocationCandidate,
  LocationProvider,
  LocationSearchInput,
} from "../types.ts";

type FetchLike = typeof fetch;

interface OpenCageComponents {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state_district?: string;
  state?: string;
  country?: string;
  country_code?: string;
  _normalized_city?: string;
}

interface OpenCageResult {
  formatted?: string;
  geometry?: { lat?: number; lng?: number };
  components?: OpenCageComponents;
  annotations?: {
    timezone?: { name?: string };
    wikidata?: string;
  };
}

interface OpenCageResponse {
  results?: OpenCageResult[];
}

export interface OpenCageLocationProviderOptions {
  apiKey: string;
  fetcher?: FetchLike;
  endpoint?: string;
  language?: string;
  limit?: number;
  noRecord?: boolean;
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

function pickCity(components: OpenCageComponents): string | null {
  return (
    components._normalized_city ??
    components.city ??
    components.town ??
    components.municipality ??
    components.village ??
    components.county ??
    components.state_district ??
    null
  );
}

function mapResult(
  result: OpenCageResult,
  input: LocationSearchInput,
  index: number,
): LocationCandidate | null {
  const city = result.components ? pickCity(result.components) : null;
  const country = result.components?.country;
  const countryCode = result.components?.country_code;
  const latitude = result.geometry?.lat;
  const longitude = result.geometry?.lng;
  if (
    !city ||
    !country ||
    !countryCode ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return null;
  }

  const timezone = result.annotations?.timezone?.name;
  const providerLocationId =
    result.annotations?.wikidata?.trim() ||
    `${latitude.toFixed(6)},${longitude.toFixed(6)}:${index}`;

  return {
    providerLocationId: `opencage:${providerLocationId}`,
    city: localizedName(city, input.city),
    country: localizedName(country, input.country),
    countryCode: countryCode.toUpperCase(),
    coordinates: { latitude, longitude },
    ...(timezone && timezone.includes("/") ? { timezone } : {}),
    aliases: [result.formatted, input.city].filter((value): value is string => Boolean(value)),
  };
}

export class OpenCageLocationProvider implements LocationProvider {
  readonly providerName = "opencage";
  private readonly apiKey: string;
  private readonly fetcher: FetchLike;
  private readonly endpoint: string;
  private readonly language: string;
  private readonly limit: number;
  private readonly noRecord: boolean;

  constructor(options: OpenCageLocationProviderOptions) {
    if (!options.apiKey.trim()) {
      throw new Error("OpenCageLocationProvider requires an API key.");
    }
    this.apiKey = options.apiKey;
    this.fetcher = options.fetcher ?? fetch;
    this.endpoint = options.endpoint ?? "https://api.opencagedata.com/geocode/v1/json";
    this.language = options.language ?? "en";
    this.limit = options.limit ?? 8;
    this.noRecord = options.noRecord ?? true;
  }

  async search(input: LocationSearchInput): Promise<readonly LocationCandidate[]> {
    const url = new URL(this.endpoint);
    url.searchParams.set("q", `${input.city}, ${input.country}`);
    url.searchParams.set("key", this.apiKey);
    url.searchParams.set("language", this.language);
    url.searchParams.set("limit", String(this.limit));
    if (this.noRecord) url.searchParams.set("no_record", "1");
    if (input.countryCode) url.searchParams.set("countrycode", input.countryCode.toLowerCase());

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new Error(`OpenCage request failed with HTTP ${response.status}.`);
    }
    const payload = (await response.json()) as OpenCageResponse;
    return (payload.results ?? [])
      .map((result, index) => mapResult(result, input, index))
      .filter((candidate): candidate is LocationCandidate => candidate !== null);
  }
}
