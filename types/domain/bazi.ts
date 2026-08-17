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

export interface WeightedElementScore {
  element: FiveElement;
  score: number;
}

export interface WeightedTenGodScore {
  tenGod: TenGod;
  score: number;
}

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
