// Boundary: deterministic chart calculation only. No LLM-based chart calculation belongs here.
export { calculateBazi, calculateBaziZipingV1 } from './engine';
export { ENGINE_VERSION, MAPPING_VERSION, RULE_PROFILE_VERSION } from './constants';
export { solarTermInstantMs } from './adapters/tyme4ts-adapter';
export {
  PATTERN_SCHEMA_VERSION,
  RULE_PROFILE_MISMATCH,
  TraditionalPatternRuleProfileMismatchError,
  ZIPING_RULE_PROFILE_VERSION,
  assertZipingRuleProfile,
} from './traditional-pattern';
export type {
  BaziCalculationContext,
  BaziCalculationMetadata,
  BaziCalculationResult,
  BaziChart,
  BaziDerivedFeatures,
  BaziLuckStructure,
  BaziRelation,
  BirthProfile,
  TraditionalPatternInput,
  TraditionalPatternResult,
} from '../../types/domain';
