import type { ISODateTime, JsonValue, LocalizedText, UUID } from "./common";
import type { PersonalityProfile } from "./personality";
import type { VersionFields } from "./versions";

export type InterpretationTier = "tier_1" | "tier_2" | "tier_3";
export type ReportStatus = "draft" | "ready" | "failed";

export interface ReportSection {
  id: string;
  title: LocalizedText;
  body: string;
  structuredData?: JsonValue;
}

export interface Report extends VersionFields {
  id: UUID;
  userId: UUID;
  chartId: UUID;
  derivedFeaturesId: UUID;
  tier: InterpretationTier;
  status: ReportStatus;
  personalityProfile: PersonalityProfile;
  sections: ReportSection[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
