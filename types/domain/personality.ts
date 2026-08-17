import type { ISODateTime, UUID } from "./common";

export interface PersonalityDimension {
  key: string;
  label: string;
  score: number;
  confidence: number;
  evidenceKeys: string[];
}

export interface PersonalityProfile {
  id: UUID;
  userId?: UUID;
  chartId: UUID;
  mapping_version: string;
  summary: string;
  dimensions: PersonalityDimension[];
  strengths: string[];
  growthEdges: string[];
  behaviorSuggestions: string[];
  generatedAt: ISODateTime;
}
