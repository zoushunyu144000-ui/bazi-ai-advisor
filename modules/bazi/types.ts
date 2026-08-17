import type { BaziCalculationMetadata, BaziChart, BaziDerivedFeatures, StemBranchRef } from '../../types/domain';
import type { PillarName } from './constants';

export type BaziRelationKind = 'stem_combination' | 'branch_combination' | 'branch_clash' | 'branch_harm';
export interface BaziRelation {
  kind: BaziRelationKind;
  leftPillar: PillarName;
  rightPillar: PillarName;
  left: string;
  right: string;
}

export type LuckDirection = 'forward' | 'reverse' | 'unknown';
export interface BaziLuckCyclePeriod {
  index: number;
  pillar: StemBranchRef;
  startAgeYears: number;
  endAgeYears: number;
}
export interface BaziLuckStructure {
  direction: LuckDirection;
  startAgeYears: number | null;
  boundaryTerm: string | null;
  boundaryInstant: string | null;
  method: 'three_days_one_year';
  cycles: BaziLuckCyclePeriod[];
  warnings: string[];
}

export interface BaziEngineResult {
  engine_version: string;
  rule_profile_version: string;
  chart: BaziChart;
  calculationMetadata: BaziCalculationMetadata;
  derivedFeatures: BaziDerivedFeatures;
  relations: BaziRelation[];
  luck: BaziLuckStructure;
}

export interface ResolvedBirthInstant {
  instantMs: number;
  local: { year:number; month:number; day:number; hour:number; minute:number; second:number };
  warnings: string[];
  birthTimeKnown: boolean;
}

export interface JieBoundary {
  name: string;
  instantMs: number;
  gregorianYear: number;
  termIndex: number;
}
