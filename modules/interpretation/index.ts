// Boundary: deterministic mapping from structured BaziChart data to modern behavioral interpretation.
// No birth-date calculation and no LLM scoring belongs here.
export {
  INTERPRETATION_MAPPING_VERSION,
  INTERPRETATION_RULE_PROFILE_VERSION,
  deriveBaziFeatures,
  deriveTenGod,
  interpretBaziChart,
  mapPersonalityProfile,
} from "./engine";
export type {
  ContributorDirection,
  DerivedFeatureSignals,
  DimensionContributor,
  InterpretationDerivedFeatures,
  InterpretationOptions,
  InterpretationResult,
  PersonalityDimensionDetail,
  PersonalityDimensionKey,
} from "./engine";
export type { PersonalityProfile, Report } from "@/types/domain";
