import type { GeoPoint, IANATimeZone, ISODate, ISODateTime, ISOTime, UUID } from "./common";

export type BirthTimePrecision = "exact" | "approximate" | "unknown";
export type TraditionalRuleSex = "male" | "female" | "unspecified";
export type CalendarType = "gregorian";

export interface BirthPlace {
  label?: string;
  countryCode?: string;
  locality?: string;
  coordinates?: GeoPoint;
}

export interface BirthProfile {
  id: UUID;
  userId?: UUID;
  label: string;
  calendar: CalendarType;
  birthDate: ISODate;
  birthTime: ISOTime | null;
  birthTimePrecision: BirthTimePrecision;
  timezone: IANATimeZone;
  birthPlace?: BirthPlace;
  sexForTraditionalRules: TraditionalRuleSex;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
