import type { BaziChart, BaziDerivedFeatures, FiveElement, TenGod } from "@/types/domain";
import type { InterpretationSignals, PersonalityDimensionDetail, PersonalityDimensionKey } from "./engine";

const ARCHETYPE_MAPPING_VERSION = "personality-map/0.2.0";

export type ArchetypePatternFamily = "peer" | "output" | "wealth" | "authority" | "resource";
export type ArchetypeIntensity = "HIGH" | "MODERATE";
export type ArchetypeDimensionBand = "high" | "balanced" | "low";

export interface ArchetypePattern {
  family: ArchetypePatternFamily;
  ten_god: TenGod;
  canonical_ten_god_score: number;
  family_score: number;
  dimension_fit: number;
  strength_fit: number;
  candidate_score: number;
}

export interface ArchetypeSeed {
  day_master_element: FiveElement;
  day_master_stem: BaziChart["dayMaster"]["stem"];
  day_master_strength: BaziDerivedFeatures["dayMasterStrength"];
  dominant_ten_god: TenGod;
  secondary_ten_god: TenGod;
  dominant_family: ArchetypePatternFamily;
  dimension_signature: Array<{
    key: PersonalityDimensionKey;
    score: number;
    band: ArchetypeDimensionBand;
  }>;
}

export interface ArchetypeCandidate {
  archetype_code: string;
  archetype_seed: ArchetypeSeed;
  dominant_pattern: ArchetypePattern;
  secondary_pattern: ArchetypePattern;
  personality_dimensions: Array<{
    key: PersonalityDimensionKey;
    score: number;
    confidence: number;
  }>;
  confidence: number;
  positive_mode: string[];
  stress_mode: string[];
  mapping_version: string;
}

interface PatternDefinition {
  family: ArchetypePatternFamily;
  dimensionWeights: Partial<Record<PersonalityDimensionKey, number>>;
  positive: string;
  stress: string;
}

const TEN_GODS: TenGod[] = [
  "bi_jian", "jie_cai", "shi_shen", "shang_guan", "pian_cai",
  "zheng_cai", "qi_sha", "zheng_guan", "pian_yin", "zheng_yin",
];

const PATTERN_DEFINITIONS: Record<TenGod, PatternDefinition> = {
  bi_jian: {
    family: "peer",
    dimensionWeights: { autonomy: 1, competition_drive: 0.8, external_validation_need: -0.6, decision_speed: 0.3 },
    positive: "更容易依靠内部标准推进，并在同侪环境中保持自我位置。",
    stress: "压力下可能把独立判断扩大为不愿让步或过度自我参照。",
  },
  jie_cai: {
    family: "peer",
    dimensionWeights: { competition_drive: 1, risk_tolerance: 0.8, conflict_style: 0.7, autonomy: 0.6 },
    positive: "面对竞争、资源争取和需要快速结盟的场景时更容易被激活。",
    stress: "压力下可能过度比较、争夺或把合作问题转化为输赢问题。",
  },
  shi_shen: {
    family: "output",
    dimensionWeights: { expression_drive: 1, social_adaptation: 0.7, learning_orientation: 0.4, conflict_style: -0.4 },
    positive: "更容易通过稳定输出、分享和创造形成影响力。",
    stress: "压力下可能用舒适输出回避更高约束或更直接的冲突。",
  },
  shang_guan: {
    family: "output",
    dimensionWeights: { expression_drive: 1, novelty_seeking: 0.9, autonomy: 0.8, structure_need: -0.7, conflict_style: 0.5 },
    positive: "更容易发现规则之外的表达空间，并提出不同做法。",
    stress: "压力下可能把质疑、表达和突破本身当成目标，增加摩擦。",
  },
  zheng_cai: {
    family: "wealth",
    dimensionWeights: { planning_orientation: 1, control_need: 0.7, social_adaptation: 0.6, structure_need: 0.4 },
    positive: "更容易关注可持续资源、现实责任与长期可交付结果。",
    stress: "压力下可能过度计算得失或把稳定维护放在探索之前。",
  },
  pian_cai: {
    family: "wealth",
    dimensionWeights: { risk_tolerance: 0.9, social_adaptation: 0.8, novelty_seeking: 0.8, decision_speed: 0.4 },
    positive: "更容易扫描机会、连接资源并在变化中寻找可用空间。",
    stress: "压力下可能被即时机会牵动，降低长期聚焦。",
  },
  zheng_guan: {
    family: "authority",
    dimensionWeights: { structure_need: 1, planning_orientation: 0.8, external_validation_need: 0.6, control_need: 0.5, conflict_style: -0.3 },
    positive: "更容易在明确规则、责任与评价体系中建立稳定表现。",
    stress: "压力下可能过度依赖标准、身份或正确流程来获得安全感。",
  },
  qi_sha: {
    family: "authority",
    dimensionWeights: { decision_speed: 0.9, competition_drive: 1, conflict_style: 0.8, control_need: 0.5, risk_tolerance: 0.4 },
    positive: "面对压力、期限和高要求场景时更容易进入行动状态。",
    stress: "压力下可能把强度继续推高，形成急迫、对抗或过度控制。",
  },
  zheng_yin: {
    family: "resource",
    dimensionWeights: { learning_orientation: 1, structure_need: 0.8, planning_orientation: 0.6, decision_speed: -0.5, emotional_sensitivity: 0.3 },
    positive: "更容易通过可信框架、系统学习与稳定吸收建立判断。",
    stress: "压力下可能继续收集信息和寻求确定框架，延后行动。",
  },
  pian_yin: {
    family: "resource",
    dimensionWeights: { learning_orientation: 0.9, novelty_seeking: 0.8, emotional_sensitivity: 0.8, energy_variability: 0.5, social_adaptation: -0.2 },
    positive: "更容易捕捉非典型模式，并形成个人化的理解路径。",
    stress: "压力下可能过度内化、跳跃联想或脱离现实验证。",
  },
};

export function selectArchetypeCandidate(
  chart: BaziChart,
  derived: BaziDerivedFeatures,
  signals: InterpretationSignals,
  dimensions: PersonalityDimensionDetail[],
): ArchetypeCandidate {
  if (chart.id !== derived.chartId) throw new Error("Archetype input mismatch between chart and canonical derived features.");
  const dimensionMap = new Map(dimensions.map((item) => [item.key, item]));
  const tenGodScores = canonicalTenGodScores(derived);
  const familyScores = familyTotals(tenGodScores);

  const ranked = TEN_GODS.map((tenGod) => {
    const definition = PATTERN_DEFINITIONS[tenGod];
    const dimensionFit = scoreDimensionFit(definition.dimensionWeights, dimensionMap);
    const strengthFit = scoreStrengthFit(definition.family, derived.dayMasterStrength);
    const candidateScore = round2(
      tenGodScores[tenGod] * 0.52 +
      familyScores[definition.family] * 0.18 +
      dimensionFit * 0.22 +
      strengthFit * 0.08,
    );
    return {
      family: definition.family,
      ten_god: tenGod,
      canonical_ten_god_score: round2(tenGodScores[tenGod]),
      family_score: round2(familyScores[definition.family]),
      dimension_fit: round2(dimensionFit),
      strength_fit: round2(strengthFit),
      candidate_score: candidateScore,
    } satisfies ArchetypePattern;
  }).sort((a, b) => b.candidate_score - a.candidate_score || b.canonical_ten_god_score - a.canonical_ten_god_score || a.ten_god.localeCompare(b.ten_god));

  const dominant = ranked[0];
  const secondary = ranked[1];
  if (!dominant || !secondary) throw new Error("Archetype taxonomy requires at least two candidate patterns.");

  const intensity: ArchetypeIntensity = dominant.family_score >= 28 || dominant.candidate_score - secondary.candidate_score >= 8 ? "HIGH" : "MODERATE";
  const signature = [...dimensions]
    .sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50) || a.key.localeCompare(b.key))
    .slice(0, 4)
    .map((item) => ({ key: item.key, score: item.score, band: band(item.score) }));
  const confidence = round3(clamp01(
    derived.confidence * 0.6 +
    Math.min(1, Math.max(0, dominant.candidate_score - secondary.candidate_score) / 20) * 0.2 +
    Math.min(1, dominant.family_score / 45) * 0.1 +
    averageDimensionConfidence(signature.map((item) => item.key), dimensionMap) * 0.1,
  ));
  const topPositive = [...dimensions]
    .sort((a, b) => salience(b) - salience(a) || a.key.localeCompare(b.key))
    .slice(0, 2)
    .map((item) => item.positiveExpression);
  const topStress = [...dimensions]
    .sort((a, b) => salience(b) - salience(a) || a.key.localeCompare(b.key))
    .slice(0, 2)
    .map((item) => item.stressExpression);

  return {
    archetype_code: buildArchetypeCode(chart.dayMaster.element, dominant, intensity),
    archetype_seed: {
      day_master_element: chart.dayMaster.element,
      day_master_stem: chart.dayMaster.stem,
      day_master_strength: derived.dayMasterStrength,
      dominant_ten_god: dominant.ten_god,
      secondary_ten_god: secondary.ten_god,
      dominant_family: dominant.family,
      dimension_signature: signature,
    },
    dominant_pattern: dominant,
    secondary_pattern: secondary,
    personality_dimensions: dimensions.map((item) => ({ key: item.key, score: item.score, confidence: item.confidence })),
    confidence,
    positive_mode: [PATTERN_DEFINITIONS[dominant.ten_god].positive, ...topPositive],
    stress_mode: [PATTERN_DEFINITIONS[dominant.ten_god].stress, ...topStress],
    mapping_version: ARCHETYPE_MAPPING_VERSION,
  };
}

function buildArchetypeCode(element: FiveElement, pattern: ArchetypePattern, intensity: ArchetypeIntensity): string {
  return `DM_${element.toUpperCase()}_${pattern.family.toUpperCase()}_${pattern.ten_god.toUpperCase()}_${intensity}`;
}

function canonicalTenGodScores(derived: BaziDerivedFeatures): Record<TenGod, number> {
  const record = Object.fromEntries(TEN_GODS.map((tenGod) => [tenGod, 0])) as Record<TenGod, number>;
  for (const item of derived.tenGodDistribution) record[item.tenGod] += item.score;
  return record;
}

function familyTotals(scores: Record<TenGod, number>): Record<ArchetypePatternFamily, number> {
  return {
    peer: scores.bi_jian + scores.jie_cai,
    output: scores.shi_shen + scores.shang_guan,
    wealth: scores.zheng_cai + scores.pian_cai,
    authority: scores.zheng_guan + scores.qi_sha,
    resource: scores.zheng_yin + scores.pian_yin,
  };
}

function scoreDimensionFit(
  weights: Partial<Record<PersonalityDimensionKey, number>>,
  dimensions: Map<PersonalityDimensionKey, PersonalityDimensionDetail>,
): number {
  let weighted = 0;
  let weightTotal = 0;
  for (const [key, weight] of Object.entries(weights) as Array<[PersonalityDimensionKey, number]>) {
    const dimension = dimensions.get(key);
    if (!dimension) continue;
    const orientation = weight >= 0 ? dimension.score : 100 - dimension.score;
    const absoluteWeight = Math.abs(weight);
    weighted += orientation * absoluteWeight;
    weightTotal += absoluteWeight;
  }
  return weightTotal === 0 ? 50 : weighted / weightTotal;
}

function scoreStrengthFit(family: ArchetypePatternFamily, strength: BaziDerivedFeatures["dayMasterStrength"]): number {
  if (strength === "unknown" || strength === "balanced") return 55;
  if (strength === "weak") return family === "peer" || family === "resource" ? 70 : 48;
  return family === "output" || family === "wealth" || family === "authority" ? 66 : 50;
}

function averageDimensionConfidence(
  keys: PersonalityDimensionKey[],
  dimensions: Map<PersonalityDimensionKey, PersonalityDimensionDetail>,
): number {
  const values = keys.map((key) => dimensions.get(key)?.confidence).filter((value): value is number => value !== undefined);
  return values.length === 0 ? 0.5 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function band(score: number): ArchetypeDimensionBand { return score >= 60 ? "high" : score <= 40 ? "low" : "balanced"; }
function salience(item: PersonalityDimensionDetail): number { return Math.abs(item.score - 50) * item.confidence; }
function clamp01(value: number): number { return Math.min(1, Math.max(0, value)); }
function round2(value: number): number { return Math.round(value * 100) / 100; }
function round3(value: number): number { return Math.round(value * 1000) / 1000; }
