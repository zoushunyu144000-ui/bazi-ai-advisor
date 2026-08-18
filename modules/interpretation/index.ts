// Boundary: deterministic mapping from canonical Bazi facts to modern behavioral interpretation.
// Traditional facts (element/Ten-God distributions, day-master strength, seasonal facts) belong to 02.
// No birth-date calculation, duplicated Bazi fact derivation, gender branch, or LLM scoring belongs here.
export {
  INTERPRETATION_MAPPING_VERSION,
  INTERPRETATION_RULE_PROFILE_VERSION,
  deriveInterpretationSignals,
  interpretBaziChart,
  mapPersonalityProfile,
} from "./engine";
export { selectArchetypeCandidate } from "./archetypes";
export type {
  ContributorDirection,
  DimensionContributor,
  InterpretationResult,
  InterpretationSignals,
  PersonalityDimensionDetail,
  PersonalityDimensionKey,
  PersonalityMappingResult,
} from "./engine";
export type {
  ArchetypeCandidate,
  ArchetypeDimensionBand,
  ArchetypeIntensity,
  ArchetypePattern,
  ArchetypePatternFamily,
  ArchetypeSeed,
} from "./archetypes";
export type { PersonalityProfile, Report } from "@/types/domain";
