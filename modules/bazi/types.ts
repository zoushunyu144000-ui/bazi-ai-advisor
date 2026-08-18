export type {
  BaziCalculationContext,
  BaziCalculationResult,
  BaziLuckStructure,
  BaziRelation,
} from '../../types/domain';

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
