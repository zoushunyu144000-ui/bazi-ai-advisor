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
  /**
   * Canonical UTC instant selected by the Birth normalization layer.
   *
   * When present, deterministic downstream engines MUST use this instant as
   * the source of truth instead of resolving an ambiguous civil time again.
   * It is normally absent when the birth time is unknown and may be absent on
   * legacy records created before Wave 1.5 contract integration.
   */
  resolvedBirthInstant?: ISODateTime;
  /**
   * UTC offset, in minutes east of UTC, that corresponds to
   * resolvedBirthInstant (for example +480 for UTC+08:00).
   *
   * This preserves the selected occurrence during DST fall-back overlaps and
   * provides an audit value for persistence/replay.
   */
  utcOffsetMinutesAtBirth?: number;
  birthPlace?: BirthPlace;
  sexForTraditionalRules: TraditionalRuleSex;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
