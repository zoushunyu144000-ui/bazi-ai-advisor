// Boundary: deterministic chart calculation only. No LLM-based chart calculation belongs here.
export { calculateBazi } from './engine';
export { ENGINE_VERSION, MAPPING_VERSION, RULE_PROFILE_VERSION } from './constants';
export { solarTermInstantMs } from './adapters/tyme4ts-adapter';
export type { BaziEngineResult, BaziLuckStructure, BaziRelation } from './types';
export type { BaziCalculationMetadata, BaziChart, BaziDerivedFeatures, BirthProfile } from '../../types/domain';
