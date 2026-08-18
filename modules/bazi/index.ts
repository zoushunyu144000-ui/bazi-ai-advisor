// Boundary: deterministic chart calculation only. No LLM-based chart calculation belongs here.
export { calculateBazi } from './engine';
export { ENGINE_VERSION, MAPPING_VERSION, RULE_PROFILE_VERSION } from './constants';
export { solarTermInstantMs } from './adapters/tyme4ts-adapter';
export type {
  BaziCalculationContext,
  BaziCalculationMetadata,
  BaziCalculationResult,
  BaziChart,
  BaziDerivedFeatures,
  BaziLuckStructure,
  BaziRelation,
  BirthProfile,
} from '../../types/domain';
