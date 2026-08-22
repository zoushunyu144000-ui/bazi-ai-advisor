# 23 — TraditionalPatternResult V1 Spec + Implementation Plan

状态：**LOCKED / ACTIVE**  
Freeze Date：2026-08-23  
Repository：`zoushunyu144000-ui/bazi-ai-advisor`  
Branch：`release/v1-personality-rc`  
Rule Profile：`ziping-v1.0.0` **LOCKED**  
Pattern Schema：`traditional-pattern-result/1.0.0` **LOCKED**

> 本文把已冻结的 `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md` 翻译成可实现、可测试、可审计的 `TraditionalPatternResult` Contract（传统格局结果契约）与 Implementation Plan（实现计划）。
>
> Owner 已完成 TP-01 ～ TP-07 Review，并批准四项 Required Revisions（强制修订）。本文现正式 Freeze。
>
> 本文 **不修改** `ziping-v1.0.0`，不等于 production implementation 已完成，也不切换 Public Personality authority（公网人格判定权）。
>
> 最高原则：**传统命理负责判断，现代产品负责翻译。**

---

# 1. Purpose（目的）

`TraditionalPatternResult` 回答：

> **在 `ziping-v1.0.0` 已冻结的子平规则体系中，这张命盘的传统结构 / 格局结论是什么，为什么成立，为什么其他候选没有成立，以及哪里存在不能安全消除的歧义？**

它不是：

- Public Personality；
- 人格百分比；
- `personality-map/0.2.0` 的新版 candidate score；
- LLM interpretation；
- 五行 / 十神工程分布的另一种归一化；
- 吉凶 / 富贵等级；
- 为 10 类人格服务的分类器。

正式目标链路：

```text
BirthProfile
↓
Bazi calendar / chart facts
↓
Bazi Traditional Layer
↓
TraditionalPatternResult
  + Evidence
  + Counter Evidence
  + Ambiguity
  + ziping-v1.0.0
↓
Interpretation / Translation
↓
Public Personality
```

---

# 2. Architecture Ownership（架构归属）— TP-01 APPROVED

```text
OWNER = BAZI_TRADITIONAL_LAYER
LOCATION = modules/bazi/traditional-pattern/**
SHARED CONTRACT = types/domain/traditional-pattern.ts
```

职责边界：

```text
modules/birth
  owns birth normalization / timezone resolution

modules/bazi
  owns deterministic Bazi facts
  owns traditional structural facts
  owns TraditionalPatternResult

modules/interpretation
  consumes TraditionalPatternResult
  does NOT recalculate pattern / strength / host

LLM
  never adjudicates TraditionalPatternResult
```

硬依赖规则：

```text
modules/bazi/traditional-pattern/**
MUST NOT import modules/interpretation/**
```

传统层不得读取：

```text
PersonalityDimensions
ArchetypeCandidate
candidate_score
family_score
dimension_fit
strength_fit
Public Personality name
Character
share-card data
conversion analytics
LLM output
```

---

# 3. Legacy `BaziDerivedFeatures` Authority Clarification — TP-02 APPROVED

Bazi Engine 继续是 deterministic Bazi facts（确定性八字事实）的 canonical owner（规范所有者）。

但当前 legacy `BaziDerivedFeatures` 中以下字段 / 语义：

```text
dayMasterStrength
elementDistribution
tenGodDistribution
support-ratio-derived semantics
confidence
month multiplier / hidden-stem numeric scoring inputs
```

已经由 Rule Audit + `ziping-v1.0.0` 明确限定为：

```text
legacy engineering / compatibility / analytics / Interpretation support
```

它们 **不是**：

```text
Traditional Pattern authority
qualitative traditional strength authority
Month Host authority
formation / follow verdict authority
```

因此：

```text
TraditionalPatternInput MUST NOT accept BaziDerivedFeatures
```

历史 D-010 中关于“canonical traditional facts”的 authority 语义由本 Spec 对应的 Approved Decision supersede / clarify；D-010 中“Bazi Engine owns deterministic facts，Interpretation 不建立第二套计算”的 ownership / anti-duplication 原则继续有效。

本轮不删除任何 legacy fields。

---

# 4. Input Contract（输入契约）

```ts
export interface TraditionalPatternInput {
  birthProfile: BirthProfile;
  chart: BaziChart;
  calculationMetadata: BaziCalculationMetadata;
  relations: BaziRelation[];
}
```

需要 `BirthProfile` 的原因：

- `birthTimePrecision` 用于 unknown / approximate ambiguity；
- `birthTime` 用于 23:00 / 00:00 boundary reasoning；
- `resolvedBirthInstant` / historical offset 用于 DST 可复现性；
- 未来若 source 明确提供 uncertainty range，可由专门字段 / adapter 进入，不从 `approximate` 自造窗口；
- `birthPlace.coordinates` 仅可供 future true-solar-time boundary comparator，不改变 V1 authority。

当前不直接用整个 `BaziCalculationResult` 作为 authority input，因为：

- 它隐含 legacy `derivedFeatures`；
- `luck` 不属于本轮格局判断必要输入；
- Phase A/B 需要独立 shadow migration。

---

# 5. Rule Profile Guard（规则版本守卫）

Production implementation 必须 fail closed：

```text
calculationMetadata.rule_profile_version
MUST equal
ziping-v1.0.0
```

否则：

```text
RULE_PROFILE_MISMATCH
```

并且：

```text
DO NOT silently reinterpret civil-local-jieqi-v1
DO NOT auto-upgrade legacy chart
DO NOT label legacy result as ziping-v1.0.0
```

当前 production `calculateBazi` 仍输出：

```text
civil-local-jieqi-v1
```

当前 23:00–23:59 hour stem 仍按 same civil-day day stem 起时，与 frozen night-Zi split semantics 不一致。

所以 **Production Build 已允许开始，但 authority runtime 在 versioned `ziping-v1.0.0` calculation path 建立前必须继续被 guard 阻断。**

Build 的前置实现包括：

```text
versioned ziping-v1.0.0 calculation path
+ frozen late-Zi hour-stem behavior
+ preserved legacy profile identity
```

这属于 implementation prerequisite，不重新打开 Rule Profile。

---

# 6. Output Contract（输出契约）

## 6.1 Enums

```ts
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
```

## 6.2 Locked Result Contract

```ts
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

  // Non-semantic audit metadata only.
  computedAt: ISODateTime;
}
```

---

# 7. Required Revision 1 — Nullable Base Month Host

冻结为：

```ts
baseMonthHost: TraditionalBaseMonthHost | null;
```

原因：unknown / approximate birth time 可能跨 exact Jie boundary，使 month branch / month command 无法安全确定。

硬 invariant：

```text
baseMonthHost = null
=> at least one ambiguity exists where:
   severity = material | blocking
   AND affectedFields includes base_month_host or month_pillar
```

禁止：

```text
UNKNOWN_HOST
NONE_HOST
fake fallback month host
```

若月令无法确定，应显式保留 null + Ambiguity。

---

# 8. Required Revision 2 — Primary Formation State

顶层不再使用：

```text
formationState
```

冻结为：

```ts
primaryFormationState: TraditionalFormationState | null;
```

硬 invariants：

```text
primaryPattern != null
=> primaryFormationState != null

primaryPattern == null
=> primaryFormationState == null
```

候选级仍保留：

```ts
candidate.formationState: TraditionalFormationState;
```

这使：

```text
mixed
no_stable_single_pattern
ambiguous with no primary
```

不再被迫拥有一个虚假的 top-level formation state。

---

# 9. Required Revision 3 — Determinism vs Execution Timestamp

`TraditionalPatternResult` 的 canonical semantics（规范语义）必须确定性。

`computedAt` 只作为 non-semantic audit metadata（非语义审计元数据）。

明确禁止 `computedAt` 参与：

```text
deterministic ID generation
canonical equality
canonical hash
semantic snapshot comparison
byte-stability assertions
```

推荐 deterministic ID 输入：

```text
chartId
+ engine_version
+ rule_profile_version
+ pattern_schema_version
```

Canonical semantic projection（规范语义投影）定义为：

```text
TraditionalPatternResult minus computedAt
```

Testing rule 冻结为：

```text
same semantic input
+ same engine_version
+ same rule_profile_version
+ same pattern_schema_version
=
same canonical semantic TraditionalPatternResult
```

不同 execution 的 `computedAt` 可以不同。

---

# 10. TP-03 — Versioning APPROVED

冻结：

```text
rule_profile_version = ziping-v1.0.0
pattern_schema_version = traditional-pattern-result/1.0.0
```

三层版本职责：

```text
engine_version
  = deterministic implementation version

rule_profile_version
  = traditional rule semantics version

pattern_schema_version
  = TraditionalPatternResult JSON / TypeScript shape version
```

Compatibility：

```text
traditional verdict semantics change
=> bump rule_profile_version

result shape / serialization change only
=> bump pattern_schema_version

engine implementation changes when appropriate
=> bump engine_version
```

禁止 `latest / final / new` 作为版本语义。

---

# 11. TP-04 — No UNKNOWN / NONE Pattern Sentinel APPROVED

Traditional Pattern enum 不包含：

```text
UNKNOWN
NONE
```

无法稳定确定主格时：

```text
primaryPattern = null
+ typed patternStatus
+ evidence / counterEvidence / ambiguities
```

合法状态包括：

```text
mixed
no_stable_single_pattern
ambiguous
```

null 表示“没有安全 final primary”，不是一个传统格局类型。

---

# 12. Pattern Status（格局状态）

## `clear_single`

```text
primaryPattern != null
secondaryPatterns.length = 0
primaryFormationState != null
```

## `primary_with_secondary`

```text
primaryPattern != null
secondaryPatterns.length >= 1
primaryFormationState != null
```

secondary 必须有独立传统结构 evidence，不是第二高分。

## `mixed`

典型：多个 material candidates 竞争，强判单一格会丢失结构事实。

推荐：

```text
primaryPattern = null
primaryFormationState = null
candidates.length >= 2
```

若未来某 mixed case 仍能明确 primary，应通过 schema / rule review 后调整，不能随意破 invariant。

## `no_stable_single_pattern`

```text
primaryPattern = null
primaryFormationState = null
```

表示有结构 facts，但没有候选可安全成为 final primary。

## `follow_structure`

只允许：

```text
primaryPattern = follow_wealth | follow_killing
primaryFormationState != null
followStructure.status = confirmed
```

## `ambiguous`

material / blocking ambiguity 影响 final primary 时使用。

若无 final primary：

```text
primaryPattern = null
primaryFormationState = null
```

informational ambiguity 本身不强制整个 result 变 ambiguous。

---

# 13. Base Month Host Contract（月令基础 Host）

```ts
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
```

`ziping-v1.0.0` base Host 路径：

```text
month branch
→ ordered hidden qi main > middle > residual
→ exposure
→ base Host
```

但：

```text
base Host != final pattern verdict
```

后续必须继续检查：

```text
relations / transformation
roots / qualitative strength
formation support
formation damage
rescue
mixed / follow adjudication
```

---

# 14. Pattern Candidate Contract（候选格局）

```ts
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
```

数组顺序不得代表“力量排名”。Canonical serialization 应使用固定 enum order / deterministic ordering。

---

# 15. Formation State（成败破救）

```text
formed_clear
formed_impure
failed
broken
broken_rescued
not_formed
ambiguous
```

语义：

- `formed_clear`：Host / required formation 成立，无足以改变结构的 material damage；
- `formed_impure`：基本成立，但存在 competing / impure / material-but-not-fatal evidence；
- `failed`：候选存在，但从未满足关键 formation requirements；
- `broken`：已经存在 formation basis，后被 material damage 破坏；
- `broken_rescued`：存在 material damage，同时存在该 pattern 允许的明确传统 rescue；
- `not_formed`：不满足基本 candidate / formation requirements；
- `ambiguous`：输入、transformation 或 coverage 不足，无法安全裁决。

硬 invariant：

```text
candidate.formationState = broken
=> formation_damage evidence exists

candidate.formationState = broken_rescued
=> formation_damage evidence exists
AND rescue evidence exists
```

禁止：

```text
good evidence +1
bad evidence -1
score >= threshold => formed
```

Formation 必须 pattern-specific。

---

# 16. Strength Context（旺衰上下文）— TP-05 RELATED

```ts
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
```

必须依据：

```text
得令
得地 / 通根
得势 / 得助
生克制化
```

根气保留：

```text
ROOT_MAIN_QI
ROOT_MIDDLE_QI
ROOT_RESIDUAL_QI
```

禁止作为 Traditional authority：

```text
support_ratio
0.58 / 0.42
numeric strength percentage
month × 1.5
hidden qi numeric percentage
legacy confidence
```

---

# 17. Evidence Contract（证据契约）

每个 final conclusion 必须可追踪到：

```text
deterministic fact
+ stable ruleId
+ ziping-v1.0.0
```

```ts
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
```

V1 Evidence shared contract **不提供 numeric weight**。

Evidence ID 必须 deterministic，推荐包含：

```text
chartId
+ rule_profile_version
+ pattern_schema_version
+ ruleId
+ evidence type
+ structured source
+ structured target
```

---

# 18. Counter Evidence Contract（反证契约）

```ts
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
```

用途：Debug、QA、专业报告、Rule Audit，以及解释“为什么不是另一个格”。

Counter Evidence 不是人格缺点标签。

---

# 19. Ambiguity Contract（歧义契约）

```ts
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
```

Severity：

- `informational`：记录流派敏感性，不改变本 profile verdict；
- `material`：可能改变 secondary / formation / combination；
- `blocking`：可能改变 chart fact / base Host / primary，必须阻止 final verdict。

---

# 20. TP-06 — Approximate Birth Time APPROVED

`BirthTimePrecision = approximate` 本身不代表任何确定的 `±N minutes`。

禁止自行发明：

```text
±15
±30
±60 minutes
```

冻结规则：

```text
explicit uncertainty range supplied by user/source
=> use that explicit range

no explicit range
=> approximate_time_unbounded
```

如果不确定性可能跨：

```text
hour boundary
day boundary
LiChun
Jie
```

则 ambiguity 升级为 material / blocking。

---

# 21. Relation / Transformation Contract

当前 `BaziRelationKind` 只有：

```text
stem_combination
branch_combination
branch_clash
branch_harm
```

`ziping-v1.0.0` Build 至少需要补：

```text
three_harmony
three_meeting
punishment
break
```

关系存在与合化必须拆开：

```ts
export type TraditionalTransformationState =
  | "validated"
  | "unresolved"
  | "not_transformed";
```

推荐 structural fact：

```ts
interface TraditionalRelationFact {
  id: string;
  kind: string;
  participants: unknown[];
  transformationState: TraditionalTransformationState;
  transformedElement?: FiveElement;
  evidenceKeys: string[];
  ambiguityKeys: string[];
}
```

`unresolved` 必须传播到 Ambiguity；关系存在不能默认等于完成合化。

---

# 22. Combination Contract（组合结构）

严格保留 Host direction：

```ts
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
```

必须证明：

```text
RESOURCE_PROTECTS_OFFICER != OFFICER_GENERATES_RESOURCE
RESOURCE_TRANSFORMS_QI_SHA != QI_SHA_GENERATES_RESOURCE
SHANG_GUAN_GENERATES_WEALTH preserves host direction
SHI_SHEN_CONTROLS_QI_SHA preserves host direction
```

---

# 23. Follow Structure Contract（从格）

```ts
export type TraditionalFollowStatus =
  | "none"
  | "candidate"
  | "confirmed"
  | "rejected"
  | "ambiguous";

export type TraditionalFollowCandidateKind =
  | "follow_wealth"
  | "follow_killing"
  | "follow_output"
  | "follow_momentum"
  | "follow_strong"
  | "specialized_strength"
  | "fake_follow"
  | "other_deferred";

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
```

只有：

```text
follow_wealth
follow_killing
```

允许 `confirmed` + final primaryPattern。

Material root、有效印比、自立条件、mixed evidence 均可否决从格。

禁止 numeric weakness threshold 自动确认从格。

---

# 24. TP-05 — Evidence Sufficiency APPROVED

冻结：

```text
sufficient
partial
insufficient
indeterminate
```

只表示：

> 当前 `ziping-v1.0.0` + available deterministic facts 是否足够支持该结论。

它不是：

```text
格局概率
准确率
人格概率
0-1 confidence
percentage
```

---

# 25. Rule Trace / Observability（调试轨迹）

Durable explainability 由 Evidence / Counter Evidence / Ambiguity 承担。

Module-local 可以另有 debug trace：

```ts
export interface TraditionalPatternRuleTraceEntry {
  sequence: number;
  ruleId: string;
  stage:
    | "calendar_guard"
    | "month_host"
    | "roots"
    | "strength"
    | "relations"
    | "candidate"
    | "formation"
    | "follow"
    | "assembly";
  outcome: "matched" | "not_matched" | "unresolved" | "not_applicable";
  evidenceKeys: string[];
  counterEvidenceKeys: string[];
  ambiguityKeys: string[];
}
```

Debug trace：

- 不进入 Public Result shared contract；
- 不默认持久化；
- 不发给公网用户；
- 不包含 Personality / LLM chain-of-thought。

Rule ID namespace 建议：

```text
ZP-CAL-xxx
ZP-HOST-xxx
ZP-ROOT-xxx
ZP-STR-xxx
ZP-REL-xxx
ZP-PAT-<pattern>-xxx
ZP-FORM-<pattern>-xxx
ZP-FOLLOW-xxx
ZP-AMB-xxx
```

---

# 26. TP-07 — Shared Result Composition APPROVED WITH CONDITION

Phase A / Phase B 允许：

```text
BaziCalculationResult (legacy-compatible)
+
independent TraditionalPatternResult keyed by chartId
```

目的仅限：

```text
Phase A independent generation
Phase B shadow compare
```

这不是永久架构。

**Before Authority Cutover（权威切换前）必须完成 canonical boundary integration（规范边界整合）。**

最终架构不得保留两个永久平行 authority trees：

```text
legacy calculation tree
vs
traditional result tree
```

在 Phase C / D 前必须冻结并实现一个 canonical Bazi + Traditional Result boundary，例如：

```ts
interface TraditionalBaziAnalysisResult {
  calculation: BaziCalculationResult;
  traditionalPattern: TraditionalPatternResult;
}
```

或者通过后续 Shared Domain Review 将 `traditionalPattern` 纳入 canonical calculation/result boundary。

无论采用哪种 shape，Authority Cutover 前必须满足：

```text
one canonical deterministic Bazi/traditional-result boundary
one rule-profile identity chain
no parallel competing authority
```

Supabase persistence shape 可后续独立设计，不阻塞 deterministic core implementation。

---

# 27. Legacy Migration（旧逻辑迁移）

当前公网：

```text
calculateBazi
→ interpretBaziChart
→ selectArchetypeCandidate
→ personality-map/0.2.0
→ dominant_ten_god
→ Public Personality
```

## Phase A — Independent Traditional Result

```text
versioned ziping calculation path
→ TraditionalPatternResult
```

- 不接 Public Personality；
- legacy site 继续工作；
- 新结果不读取 legacy candidate。

## Phase B — Shadow Compare

同时生成：

```text
TraditionalPatternResult
vs
legacy ArchetypeCandidate
```

仅用于：migration impact、authority drift、bug detection。

禁止：

```text
user says legacy feels more accurate
=> change traditional rules
```

## Phase C — Translation Layer + Canonical Boundary Integration

建立：

```text
TraditionalPatternResult
→ explicit translation rules
→ Public Personality
```

同时完成 TP-07 要求的 canonical Bazi / Traditional Result boundary。

## Phase D — Authority Cutover

Gate：

- Rule / Golden tests pass；
- Spec LOCKED；
- TraditionalPatternResult implementation Review passes；
- canonical boundary integrated；
- Translation mapping Review passes；
- Result / Share regression passes。

然后才把公网 authority 从 legacy candidate 切到：

```text
TraditionalPatternResult
→ Translation Layer
```

## Phase E — Legacy Retirement

Authority Cutover + regression 后才允许：

- 保留 legacy 作为 historical experiment；
- 仅用于 non-authority modern analytics；
- 或删除无 consumer 部分。

切换后禁止：

```text
TraditionalPatternResult unavailable
=> silently fallback to legacy candidate as traditional verdict
```

---

# 28. Implementation Plan（实现计划）

Spec 已 Freeze。下一轮 Production Build 按以下顺序执行。

## Phase 1 — Contract + Profile Guard

1. 新增 `types/domain/traditional-pattern.ts`；
2. export shared types；
3. `PATTERN_SCHEMA_VERSION = traditional-pattern-result/1.0.0`；
4. 建 `modules/bazi/traditional-pattern/**` skeleton；
5. `assertZipingRuleProfile()`；
6. architecture test：traditional layer 不 import Interpretation；
7. 不接公网。

## Phase 2 — Versioned Ziping Calculation + Structural Evidence

1. 建立 versioned `ziping-v1.0.0` calculation path；
2. 00:00 day boundary；
3. frozen night-Zi hour-stem semantics；
4. exact LiChun / exact Jie；
5. historical IANA / DST；
6. unknown / approximate / boundary ambiguity；
7. Month Host evaluator；
8. exposure evaluator；
9. root evaluator；
10. qualitative strength evaluator；
11. 三合 / 三会 / 刑 / 破 existence；
12. transformation state；
13. all facts emit structured evidence。

**在 Phase 2 的 ziping profile path 完成前，TraditionalPatternResult authority evaluation 必须被 profile guard fail closed。**

## Phase 3 — Pattern Candidates

```text
8 regular
→ Jianlu
→ Yuejie
→ five-yang Yangren
```

每个 candidate 必须有 evidence / counter / ambiguity refs。

## Phase 4 — Pattern-specific Formation

逐格建立：

```text
candidate requirements
required formation
support
damage
rescue
```

禁止 generic weighted score。

## Phase 5 — Mixed + Strict Follow

实现：

```text
primary_with_secondary
mixed
no_stable_single_pattern
strict follow_wealth
strict follow_killing
```

其他 follow 不能 final。

## Phase 6 — Result Assembly + Shadow

组装完整 `TraditionalPatternResult`：

- version guard；
- baseMonthHost nullable invariant；
- primaryFormationState nullable invariant；
- evidence integrity；
- deterministic IDs；
- canonical ordering；
- canonical semantic serializer excludes computedAt；
- shadow only；
- 不切 Public Personality。

## Phase 7 — QA / Golden Review

- unit tests；
- golden cases；
- boundary fixtures；
- canonical determinism；
- rule review；
- debug trace review；
- shadow compare。

完成后才进入独立 Translation / Authority Cutover Task。

---

# 29. Testing Matrix（测试矩阵）

## Calendar

```text
LiChun -1s / exact / +1s
Jie -1s / exact / +1s
22:59
23:00
23:59
00:00
00:59
01:00
DST gap
DST overlap occurrence A/B
unknown birth time
approximate birth time
unknown / approximate crossing LiChun / Jie
```

Night Zi 必须断言：

```text
23:xx day pillar = current civil day
23:xx hour branch = zi
23:xx hour stem = next civil-day day-stem based
00:xx day pillar = new civil day
00:xx hour branch = zi
00:xx hour stem = new civil-day day-stem based
```

保留 legacy `civil-local-jieqi-v1` vectors，证明不是 silent migration。

## Month Host

```text
main qi exposed
main unexposed + middle exposed
main/middle unexposed + residual exposed
none exposed -> unexposed main fallback
multiple exposure -> main > middle > residual
base Host remains evidence even if final verdict later differs
blocking Jie ambiguity -> baseMonthHost = null
```

## Self-rooted

- 10 Jianlu mappings；
- Yuejie；
- five-yang Yangren；
- five-yin no auto-Yangren；
- BiJian present != Jianlu；
- JieCai present != Yuejie / Yangren。

## Strength

- 得令无根；
- 失令多根 / 多助；
- resource / peer support；
- output / wealth drain；
- officer / killing pressure；
- mixed evidence；
- transformation unresolved。

只断言 qualitative band + evidence。

## Pattern / Formation

8 regular + Jianlu / Yuejie / Yangren 至少覆盖：

```text
formed_clear
formed_impure
failed
broken
broken_rescued
ambiguous
```

## Mixed / Follow

- primary + secondary；
- 官杀混杂；
- mixed；
- no stable single；
- strict Follow Wealth；
- strict Follow Killing；
- root breaks follow；
- Resource / Peer support breaks follow；
- fake-follow never final。

## Directional Combination

```text
RESOURCE_PROTECTS_OFFICER != OFFICER_GENERATES_RESOURCE
RESOURCE_TRANSFORMS_QI_SHA != QI_SHA_GENERATES_RESOURCE
SHI_SHEN_CONTROLS_QI_SHA retains direction
SHANG_GUAN_GENERATES_WEALTH retains direction
```

## Contract Invariants

```text
baseMonthHost == null
=> material/blocking ambiguity explains it

primaryPattern != null
=> primaryFormationState != null

primaryPattern == null
=> primaryFormationState == null

candidate.formationState = broken
=> formation_damage evidence exists

candidate.formationState = broken_rescued
=> formation_damage + rescue evidence exist

followStructure.status = confirmed
=> confirmedPattern is follow_wealth or follow_killing

patternStatus = ambiguous
=> material/blocking ambiguity exists

patternStatus = primary_with_secondary
=> primaryPattern != null and secondaryPatterns.length >= 1

all ruleIds resolve
all evidence references resolve
all evidence IDs unique
```

## Determinism

测试：

```text
same semantic input
+ same engine version
+ same rule profile
+ same schema version
=
same canonical semantic TraditionalPatternResult
```

Canonical comparison / canonical hash / deterministic ID 必须排除 `computedAt`。

不再要求包含 execution timestamp 的 raw object byte-identical。

## Architecture

```text
modules/bazi/traditional-pattern/**
MUST NOT import modules/interpretation/**
```

Result contract / serializer 不得消费 legacy candidate score / Personality Dimensions。

---

# 30. Golden Cases（黄金命例）

推荐：

```text
tests/fixtures/traditional-pattern/
  manifest.ts
  classic/
  textbook/
  boundary/
  regression/
```

每例至少记录：

```text
id
sourceClass
sourceTitle
sourceSection / sourceReference
notes
rule_profile_version = ziping-v1.0.0
pattern_schema_version = traditional-pattern-result/1.0.0
input
expected status / host / primary / formation / evidence / ambiguity
```

来源：

### A. Classic Text

优先《子平真诠》《渊海子平》《三命通会》。

### B. Traditional Textbook

必须有明确作者 / 版本 / 页码或章节。

### C. Synthetic Boundary

用于 LiChun / Jie / 23:00 / 00:00 / DST / unknown / approximate / relation existence。

C 类不得冒充传统格局正确性证据。

### D. Regression

记录真实 bug / verified output / fix commit / issue。

---

# 31. Persistence / Serialization

本 Spec 不要求当前 Supabase Live。

未来 `TraditionalPatternResult` 应 first-class versioned persistence，不塞进 free-form report JSON。

Phase A/B 可以 session/dev shadow 并存。

Authority Cutover 时：

- canonical Bazi / Traditional Result boundary 必须完成；
- Public Result schema 必须 bump；
- old session bundle fail safely；
- 不允许 silent legacy fallback。

`computedAt` 是 audit metadata，不参与 canonical semantic hash / equality。

---

# 32. Risks（风险）

## R1 — Current Profile Mismatch

Current `calculateBazi = civil-local-jieqi-v1`。

Mitigation：versioned ziping path + profile guard + dual golden vectors。

## R2 — Approximate Time Has No Range

Mitigation：不自造 ±分钟；无明确范围 -> `approximate_time_unbounded`。

## R3 — True Solar Comparator Not Implemented

V1 不自动真太阳时；future comparator 只产生 boundary ambiguity，不改变 authority。

## R4 — Relations Incomplete

当前缺三合 / 三会 / 刑 / 破 / transformation state。

Mitigation：Phase 2 补 structural facts 后才允许 final formation verdict。

## R5 — Formation Scope Explosion

只实现 `ziping-v1.0.0` supported scope；unsupported -> ambiguity / deferred。

## R6 — Legacy Authority Wording

D-010 / legacy `BaziDerivedFeatures` comment 可能被误读为 numeric fields 是传统 authority。

Mitigation：Approved Decision 显式 supersede authority semantics；domain comment 更新为 legacy non-authority clarification；字段保留兼容。

## R7 — Permanent Parallel Tree

TP-07 只允许 Phase A/B independent result。

Mitigation：Authority Cutover 前必须 canonical boundary integration。

## R8 — Timestamp Breaks Determinism

Mitigation：`computedAt` non-semantic；canonical semantic projection 排除它。

---

# 33. TP-01 ～ TP-07 Final Owner Decisions

```text
TP-01 APPROVED
Bazi Traditional Layer owns TraditionalPatternResult.

TP-02 APPROVED
Legacy BaziDerivedFeatures excluded from Traditional Pattern authority input.

TP-03 APPROVED
pattern_schema_version = traditional-pattern-result/1.0.0

TP-04 APPROVED
No UNKNOWN / NONE pattern sentinel.
Use primaryPattern = null + typed Pattern Status.

TP-05 APPROVED
Evidence sufficiency categorical only:
sufficient / partial / insufficient / indeterminate.

TP-06 APPROVED
No arbitrary approximate-time ±minute window.
Use explicit range only when supplied by user/source.

TP-07 APPROVED WITH CONDITION
Independent result allowed in Phase A/B shadow migration only.
Before Authority Cutover it MUST join the canonical Bazi/traditional-result boundary.
```

---

# 34. Required Revisions Final State

```text
Revision 1 — Nullable Base Month Host
DONE
baseMonthHost: TraditionalBaseMonthHost | null

Revision 2 — Primary Formation State
DONE
primaryFormationState: TraditionalFormationState | null

Revision 3 — Determinism vs Execution Timestamp
DONE
computedAt = non-semantic audit metadata
excluded from ID / hash / canonical equality / semantic determinism

Revision 4 — Legacy BaziDerivedFeatures Authority Supersession
DONE
Bazi Engine ownership remains
legacy numeric derived fields are non-authority for TraditionalPatternResult
Decision Log supersession / clarification required and recorded
```

---

# 35. Build Gate（开发门）

Spec Freeze 后状态：

```text
Rule Audit = DONE
Rule Profile ziping-v1.0.0 = LOCKED
TraditionalPatternResult Spec traditional-pattern-result/1.0.0 = LOCKED
TraditionalPatternResult Implementation = NEXT / ALLOWED
```

Production Build **可以开始**。

但 runtime authority 仍有 fail-closed prerequisite：

```text
legacy civil-local-jieqi-v1 chart
!=
ziping-v1.0.0 chart
```

因此：

```text
Build Phase 1 / Phase 2 = ALLOWED
TraditionalPatternResult authority on legacy profile = BLOCKED
Authority Cutover = BLOCKED until implementation + review + canonical boundary integration
```

下一轮禁止顺手做：

- Public Personality authority cutover；
- 删除 `personality-map/0.2.0`；
- UI / Share Card / Character 改造；
- Payment / AI；
- Merge PR #16。

---

# 36. Freeze Review Checklist

- [x] TP-01 ～ TP-07 Owner decisions incorporated；
- [x] `baseMonthHost` nullable invariant；
- [x] `primaryFormationState` nullable invariant；
- [x] candidate formation state retained；
- [x] `computedAt` non-semantic semantics；
- [x] canonical determinism excludes execution timestamp；
- [x] D-010 / legacy derived authority semantics superseded / clarified；
- [x] no numeric strength / confidence authority；
- [x] no `UNKNOWN / NONE` pattern sentinel；
- [x] Evidence / Counter Evidence / Ambiguity first-class；
- [x] directional combination preserved；
- [x] TP-07 prevents permanent parallel authority tree；
- [x] current profile mismatch remains fail closed；
- [x] `ziping-v1.0.0` unchanged；
- [x] production implementation not started in this Freeze round。

---

# 37. Final Locked Contract Summary

```text
OWNER:
Bazi Traditional Layer

INPUT:
BirthProfile
+ BaziChart
+ BaziCalculationMetadata
+ BaziRelation[]
(no legacy BaziDerivedFeatures authority input)

VERSIONS:
engine_version
rule_profile_version = ziping-v1.0.0
pattern_schema_version = traditional-pattern-result/1.0.0

OUTPUT CORE:
patternStatus
baseMonthHost | null
primaryPattern | null
secondaryPatterns[]
candidates[]
primaryFormationState | null
strengthContext
followStructure
keyCombinations[]
evidence[]
counterEvidence[]
ambiguities[]
evidenceSufficiency
computedAt (non-semantic audit metadata)

PATTERNS:
8 regular
+ Jianlu
+ Yuejie
+ five-yang Yangren
+ strict Follow Wealth
+ strict Follow Killing

DETERMINISM:
canonical semantic result excludes computedAt

MIGRATION:
Phase A independent
→ Phase B shadow
→ Phase C translation + canonical boundary integration
→ Phase D authority cutover
→ Phase E legacy retirement

BUILD:
IMPLEMENTATION NEXT / ALLOWED
RUNTIME FAIL-CLOSED UNTIL ziping-v1.0.0 calculation path exists
```
