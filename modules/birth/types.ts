import type { BirthProfile, BirthTimePrecision, TraditionalRuleSex } from "../../types/domain/birth";
import type { GeoPoint } from "../../types/domain/common";

export interface LocalizedLocationName {
  zhHans?: string;
  en?: string;
}

export interface LocationCandidate {
  providerLocationId: string;
  city: LocalizedLocationName;
  country: LocalizedLocationName;
  countryCode: string;
  coordinates: GeoPoint;
  timezone?: string;
  aliases?: string[];
}

export interface LocationSearchInput {
  city: string;
  country: string;
  countryCode?: string;
}

export interface LocationProvider {
  readonly providerName: string;
  search(input: LocationSearchInput): Promise<readonly LocationCandidate[]>;
}

export interface TimezoneResolveInput {
  location: LocationCandidate;
  birthDate: string;
  birthTime: string | null;
  birthTimePrecision: BirthTimePrecision;
  utcOffsetMinutes?: number;
}

export type LocalTimeDisambiguation = "unique" | "offset" | "unknown";

export interface TimezoneResolution {
  timezone: string;
  source: string;
  offsetMinutes: number | null;
  isDst: boolean | null;
  observesDstThisYear: boolean;
  localTimeDisambiguation: LocalTimeDisambiguation;
  resolvedInstant: string | null;
  timezoneName: string | null;
}

export interface TimezoneResolver {
  readonly resolverName: string;
  resolve(input: TimezoneResolveInput): Promise<TimezoneResolution | null>;
}

export interface BirthNormalizationInput {
  id?: string;
  userId?: string;
  label?: string;
  birthDate: string;
  birthTime?: string | null;
  birthTimePrecision: BirthTimePrecision;
  city: string;
  country: string;
  countryCode?: string;
  locationId?: string;
  utcOffsetMinutes?: number;
  sexForTraditionalRules?: TraditionalRuleSex;
}

export interface BirthNormalizationDependencies {
  locationProvider: LocationProvider;
  timezoneResolver: TimezoneResolver;
  now?: () => Date;
  createId?: () => string;
}

export interface BirthNormalizationMetadata {
  locationProvider: string;
  timezoneResolver: string;
  location: LocationCandidate;
  timezone: TimezoneResolution;
  warnings: string[];
}

export interface BirthNormalizationResult {
  profile: BirthProfile;
  metadata: BirthNormalizationMetadata;
}

export type StaticLocationRecord = LocationCandidate;
