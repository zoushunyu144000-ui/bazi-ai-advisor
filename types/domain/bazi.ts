import type { ISODateTime, UUID } from "./common";

export type FiveElement = "wood" | "fire" | "earth" | "metal" | "water";
export type YinYang = "yin" | "yang";
export type HeavenlyStem = "jia" | "yi" | "bing" | "ding" | "wu" | "ji" | "geng" | "xin" | "ren" | "gui";
export type EarthlyBranch = "zi" | "chou" | "yin" | "mao" | "chen" | "si" | "wu" | "wei" | "shen" | "you" | "xu" | "hai";
export type TenGod =
  | "bi_jian"
  | "jie_cai"
  | "shi_shen"
  | "shang_guan"
  | "pian_cai"
  | "zheng_cai"
  | "qi_sha"
  | "zheng_guan"
  | "pian_yin"
  | "zheng_yin";

export type BaziPillarPosition = "year" | "month" | "day" | "hour";

export interface StemBranchRef {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
}

export interface HiddenStem {
  stem: HeavenlyStem;
  weight?: number;
  tenGod?: TenGod;
}

export interface BaziPillar extends StemBranchRef {
  stemElement: FiveElement;
  stemPolarity: YinYang;
  branchElement: FiveElement;
  hiddenStems: HiddenStem[];
  tenGod?: TenGod;
}

export interface BaziChart {
  id: UUID;
  birthProfileId: UUID;
  pillars: {
    year: BaziPillar;
    month: BaziPillar;
    day: BaziPillar;
    hour: BaziPillar | null;
  };
  dayMaster: {
    stem: HeavenlyStem;
    element: FiveElement;
    polarity: YinYang;
  };
  calculatedAt: ISODateTime;
}

export interface BaziCalculationMetadata {
  engine_version: string;
  rule_profile_version: string;
  sourceTimezone: string;
  calendarConversion: "none" | "gregorian_to_solar_terms";
  birthTimeWasKnown: boolean;
  calculatedAt: ISODateTime;
  warnings: string[];
}

export type DayMasterStrength = "weak" | "balanced" | "strong" | "unknown";

/**
 * Semantic percentage on an inclusive 0-100 scale for the legacy engineering
 * distribution model.
 *
 * TypeScript cannot encode the numeric bounds, so producers MUST validate the
 * range in deterministic tests. These percentages may remain for compatibility,
 * analytics and Interpretation consumption; they are NOT Traditional Pattern
 * authority under ziping-v1.0.0.
 */
export type BaziPercentageScore = number;

export interface WeightedElementScore {
  element: FiveElement;
  score: BaziPercentageScore;
}

export interface WeightedTenGodScore {
  tenGod: TenGod;
  score: BaziPercentageScore;
}

/**
 * Legacy engineering derived features produced by the deterministic Bazi Engine.
 *
 * The Bazi Engine remains the canonical owner of deterministic Bazi facts and
 * Interpretation must not independently recreate a competing feature model.
 * However, the current dayMasterStrength, elementDistribution,
 * tenGodDistribution and confidence semantics are compatibility / analytics /
 * Interpretation fields only. They are NOT authority inputs for
 * TraditionalPatternResult and do NOT define ziping-v1.0.0 Month Host,
 * qualitative strength, formation or follow-structure verdicts.
 *
 * See docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md,
 * docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md and
 * docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md.
 */
export interface BaziDerivedFeatures {
  id: UUID;
  chartId: UUID;
  engine_version: string;
  rule_profile_version: string;
  mapping_version: string;
  dayMasterStrength: DayMasterStrength;
  elementDistribution: WeightedElementScore[];
  tenGodDistribution: WeightedTenGodScore[];
  seasonalContext: string;
  structuralTags: string[];
  confidence: number;
  derivedAt: ISODateTime;
}

export type BaziRelationKind =
  | "stem_combination"
  | "branch_combination"
  | "branch_clash"
  | "branch_harm";

interface BaziRelationBase {
  leftPillar: BaziPillarPosition;
  rightPillar: BaziPillarPosition;
}

export type BaziRelation =
  | (BaziRelationBase & {
      kind: "stem_combination";
      left: HeavenlyStem;
      right: HeavenlyStem;
    })
  | (BaziRelationBase & {
      kind: "branch_combination" | "branch_clash" | "branch_harm";
      left: EarthlyBranch;
      right: EarthlyBranch;
    });

export type BaziLuckDirection = "forward" | "reverse" | "unknown";

export interface BaziLuckCyclePeriod {
  index: number;
  pillar: StemBranchRef;
  startAgeYears: number;
  endAgeYears: number;
}

export interface BaziLuckStructure {
  direction: BaziLuckDirection;
  startAgeYears: number | null;
  boundaryTerm: string | null;
  boundaryInstant: ISODateTime | null;
  method: "three_days_one_year";
  cycles: BaziLuckCyclePeriod[];
  warnings: string[];
}

/**
 * Persistable calculation context that must survive the 02 -> 08 -> 07 path.
 * Derived features live in their own canonical table but are joined back into
 * BaziCalculationResult at the repository/service boundary.
 */
export interface BaziCalculationContext {
  chart: BaziChart;
  calculationMetadata: BaziCalculationMetadata;
  relations: BaziRelation[];
  luck: BaziLuckStructure;
}

export interface BaziCalculationResult extends BaziCalculationContext {
  derivedFeatures: BaziDerivedFeatures;
}
