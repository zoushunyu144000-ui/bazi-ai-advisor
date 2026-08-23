import type { BirthProfile } from "./birth";
import type {
  BaziCalculationMetadata,
  BaziChart,
  BaziPillarPosition,
  BaziRelation,
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
} from "./bazi";
import type { ISODateTime, UUID } from "./common";

export type TraditionalPattern =
  | "zheng_guan"
  | "qi_sha"
  | "zheng_cai"
  | "pian_cai"
  | "zheng_yin"
  | "pian_yin"
  | "shi_shen"
  | "shang_guan"
  | "jian_lu"
  | "yue_jie"
  | "yang_ren"
  | "follow_wealth"
  | "follow_killing";

export type TraditionalPatternStatus =
  | "clear_single"
  | "primary_with_secondary"
  | "mixed"
  | "no_stable_single_pattern"
  | "follow_structure"
  | "ambiguous";

export type TraditionalFormationState =
  | "formed_clear"
  | "formed_impure"
  | "failed"
  | "broken"
  | "broken_rescued"
  | "not_formed"
  | "ambiguous";

export type TraditionalStrengthBand =
  | "strong"
  | "lean_strong"
  | "balanced_mixed"
  | "lean_weak"
  | "weak"
  | "ambiguous";

export type TraditionalEvidenceSufficiency =
  | "sufficient"
  | "partial"
  | "insufficient"
  | "indeterminate";

export interface TraditionalPatternInput {
  birthProfile: BirthProfile;
  chart: BaziChart;
  calculationMetadata: BaziCalculationMetadata;
  relations: BaziRelation[];
}

export type HiddenQiLayer = "main" | "middle" | "residual";

export type MonthHostKind =
  | "regular_ten_god"
  | "jian_lu"
  | "yue_jie"
  | "yang_ren";

export interface TraditionalBaseMonthHost {
  monthBranch: EarthlyBranch;
  hostKind: MonthHostKind;
  patternCandidate: TraditionalPattern;
  selectedStem: HeavenlyStem;
  selectedTenGod: TenGod;
  selectedLayer: HiddenQiLayer;
  exposureState: "exposed" | "unexposed_main_fallback";
  exposurePillars: BaziPillarPosition[];
  competingExposedPatterns: TraditionalPattern[];
  evidenceKeys: string[];
  ambiguityKeys: string[];
}

export type TraditionalCandidateState =
  | "candidate"
  | "formed"
  | "rejected"
  | "ambiguous";

export interface TraditionalPatternCandidate {
  pattern: TraditionalPattern;
  origin:
    | "base_month_host"
    | "competing_month_exposure"
    | "self_rooted_structure"
    | "follow_candidate";
  state: TraditionalCandidateState;
  formationState: TraditionalFormationState;
  evidenceKeys: string[];
  counterEvidenceKeys: string[];
  ambiguityKeys: string[];
}

export type TraditionalStrengthFactorType =
  | "seasonal_command"
  | "root_support"
  | "visible_support"
  | "resource_support"
  | "peer_support"
  | "output_drain"
  | "wealth_drain"
  | "officer_killing_pressure"
  | "combination_effect";

export type TraditionalStrengthDirection =
  | "supports_day_master"
  | "weakens_day_master"
  | "mixed"
  | "neutral"
  | "unresolved";

export interface TraditionalStrengthFactor {
  type: TraditionalStrengthFactorType;
  direction: TraditionalStrengthDirection;
  evidenceKeys: string[];
  counterEvidenceKeys: string[];
}

export interface TraditionalStrengthContext {
  band: TraditionalStrengthBand;
  factors: TraditionalStrengthFactor[];
  evidenceKeys: string[];
  counterEvidenceKeys: string[];
  ambiguityKeys: string[];
}

export type TraditionalEvidenceType =
  | "calendar_boundary"
  | "month_command"
  | "hidden_qi_main"
  | "hidden_qi_middle"
  | "hidden_qi_residual"
  | "visible_stem"
  | "root_main_qi"
  | "root_middle_qi"
  | "root_residual_qi"
  | "seasonal_support"
  | "visible_support"
  | "resource_support"
  | "peer_support"
  | "output_drain"
  | "wealth_drain"
  | "officer_killing_pressure"
  | "generates"
  | "controls"
  | "stem_combination"
  | "branch_combination"
  | "clash"
  | "punishment"
  | "harm"
  | "break"
  | "three_harmony"
  | "three_meeting"
  | "transformation_validated"
  | "transformation_unresolved"
  | "formation_support"
  | "formation_damage"
  | "rescue"
  | "follow_condition"
  | "follow_blocker";

export interface TraditionalEvidenceSource {
  pillar?: BaziPillarPosition;
  stem?: HeavenlyStem;
  branch?: EarthlyBranch;
  hiddenQiLayer?: HiddenQiLayer;
  relationId?: string;
  factKey?: string;
}

export type TraditionalCombinationType =
  | "shang_guan_generates_wealth"
  | "shi_shen_generates_wealth"
  | "shi_shen_controls_qi_sha"
  | "resource_transforms_qi_sha"
  | "qi_sha_generates_resource"
  | "officer_generates_resource"
  | "resource_protects_officer"
  | "wealth_generates_officer"
  | "shang_guan_with_resource";

export type TraditionalFollowCandidateKind =
  | "follow_wealth"
  | "follow_killing"
  | "follow_output"
  | "follow_momentum"
  | "follow_strong"
  | "specialized_strength"
  | "fake_follow"
  | "other_deferred";

export interface TraditionalEvidenceTarget {
  pattern?: TraditionalPattern;
  combination?: TraditionalCombinationType;
  strengthFactor?: TraditionalStrengthFactorType;
  formationState?: TraditionalFormationState;
  followKind?: TraditionalFollowCandidateKind;
}

export type TraditionalEvidenceEffect =
  | "establishes"
  | "supports"
  | "qualifies"
  | "damages"
  | "blocks"
  | "rescues"
  | "context"
  | "unresolved";

export interface TraditionalPatternEvidence {
  id: string;
  type: TraditionalEvidenceType;
  effect: TraditionalEvidenceEffect;
  source: TraditionalEvidenceSource;
  target: TraditionalEvidenceTarget;
  ruleId: string;
  descriptionCode: string;
}

export type TraditionalCounterEvidenceType =
  | "officer_damaged_by_shang_guan"
  | "officer_qi_sha_mixed"
  | "resource_damaged_by_wealth"
  | "shi_shen_blocked_by_resource"
  | "wealth_contested_by_peers"
  | "qi_sha_control_transform_compete"
  | "follow_broken_by_root"
  | "follow_broken_by_resource_peer_support"
  | "required_formation_missing"
  | "competing_pattern_material"
  | "transformation_unresolved";

export interface TraditionalPatternCounterEvidence {
  id: string;
  type: TraditionalCounterEvidenceType;
  source: TraditionalEvidenceSource;
  targetPattern: TraditionalPattern;
  effect: "damages" | "blocks" | "competes" | "unresolved";
  ruleId: string;
  descriptionCode: string;
  evidenceKeys: string[];
}

export type TraditionalPatternAmbiguityCode =
  | "insufficient_birth_time"
  | "approximate_time_unbounded"
  | "solar_term_boundary_uncertain"
  | "late_zi_boundary"
  | "school_sensitivity_late_zi"
  | "true_solar_time_boundary"
  | "multiple_pattern_candidates"
  | "month_command_transformation_unresolved"
  | "relation_transformation_unresolved"
  | "follow_structure_uncertain"
  | "school_disagreement"
  | "insufficient_evidence";

export type TraditionalAmbiguitySeverity =
  | "informational"
  | "material"
  | "blocking";

export type TraditionalPatternAffectedField =
  | "year_pillar"
  | "month_pillar"
  | "day_pillar"
  | "hour_pillar"
  | "base_month_host"
  | "primary_pattern"
  | "secondary_patterns"
  | "primary_formation_state"
  | "strength_context"
  | "follow_structure"
  | "key_combinations";

export interface TraditionalPatternAmbiguity {
  id: string;
  code: TraditionalPatternAmbiguityCode;
  severity: TraditionalAmbiguitySeverity;
  affectedFields: TraditionalPatternAffectedField[];
  messageCode: string;
  evidenceKeys: string[];
}

export type TraditionalTransformationState =
  | "validated"
  | "unresolved"
  | "not_transformed";

export interface TraditionalRelationFact {
  id: string;
  kind: string;
  participants: unknown[];
  transformationState: TraditionalTransformationState;
  transformedElement?: FiveElement;
  evidenceKeys: string[];
  ambiguityKeys: string[];
}

export type TraditionalCombinationState =
  | "candidate"
  | "validated"
  | "blocked"
  | "ambiguous";

export interface TraditionalKeyCombination {
  id: string;
  type: TraditionalCombinationType;
  state: TraditionalCombinationState;
  hostPattern: TraditionalPattern;
  actorPattern?: TraditionalPattern;
  targetPattern?: TraditionalPattern;
  evidenceKeys: string[];
  counterEvidenceKeys: string[];
  ambiguityKeys: string[];
}

export type TraditionalFollowStatus =
  | "none"
  | "candidate"
  | "confirmed"
  | "rejected"
  | "ambiguous";

export interface TraditionalFollowStructure {
  status: TraditionalFollowStatus;
  candidateKind?: TraditionalFollowCandidateKind;
  confirmedPattern?: "follow_wealth" | "follow_killing";
  materialRootEvidenceKeys: string[];
  resourcePeerSupportEvidenceKeys: string[];
  evidenceKeys: string[];
  counterEvidenceKeys: string[];
  ambiguityKeys: string[];
}

export interface TraditionalPatternResult {
  id: UUID;
  chartId: UUID;
  engine_version: string;
  rule_profile_version: "ziping-v1.0.0";
  pattern_schema_version: "traditional-pattern-result/1.0.0";
  patternStatus: TraditionalPatternStatus;
  baseMonthHost: TraditionalBaseMonthHost | null;
  primaryPattern: TraditionalPattern | null;
  secondaryPatterns: TraditionalPattern[];
  candidates: TraditionalPatternCandidate[];
  primaryFormationState: TraditionalFormationState | null;
  strengthContext: TraditionalStrengthContext;
  followStructure: TraditionalFollowStructure;
  keyCombinations: TraditionalKeyCombination[];
  evidence: TraditionalPatternEvidence[];
  counterEvidence: TraditionalPatternCounterEvidence[];
  ambiguities: TraditionalPatternAmbiguity[];
  evidenceSufficiency: TraditionalEvidenceSufficiency;
  /** Non-semantic audit metadata. Excluded from deterministic identity/equality. */
  computedAt: ISODateTime;
}
