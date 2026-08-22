# 23 — TraditionalPatternResult V1 Spec + Implementation Plan

状态：**READY FOR REVIEW / PROPOSED CONTRACT**  
日期：2026-08-23  
Repository：`zoushunyu144000-ui/bazi-ai-advisor`  
Branch：`release/v1-personality-rc`  
Rule Profile：`ziping-v1.0.0` **LOCKED**  
Proposed Pattern Schema：`traditional-pattern-result/1.0.0`

> 本文把已冻结的 `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md` 翻译成可实现、可测试、可审计的 `TraditionalPatternResult` Contract（传统格局结果契约）与 Implementation Plan（实现计划）。
>
> 本文 **不修改** `ziping-v1.0.0`，不实现 production code（生产代码），不切换 Public Personality authority（公网人格判定权）。
>
> 最高原则：**传统命理负责判断，现代产品负责翻译。**

---

# 1. Purpose（目的）

`TraditionalPatternResult` 回答一个问题：

> **在 `ziping-v1.0.0` 已冻结的子平规则体系中，这张命盘的传统结构 / 格局结论是什么，为什么成立，为什么其他候选没有成立，以及哪里存在不能安全消除的歧义？**

它不是：

- Public Personality；
- 人格百分比；
- `personality-map/0.2.0` 的新版 candidate score；
- LLM interpretation；
- 五行 / 十神工程分布的另一种归一化；
- 吉凶 / 富贵等级；
- 为 10 类人格服务的分类器。

正确链路：

```text
BirthProfile
↓
Bazi calendar / chart facts
↓
Traditional structural evaluators
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

# 2. Architecture Ownership（架构归属）

## 2.1 Owner

正式提议：

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
  owns chart facts + traditional structural facts + TraditionalPatternResult

modules/interpretation
  consumes TraditionalPatternResult
  does NOT recalculate pattern / strength / host

LLM
  never adjudicates TraditionalPatternResult
```

## 2.2 Forbidden dependency direction

必须保持：

```text
modules/bazi/traditional-pattern
  MUST NOT import modules/interpretation
```

`TraditionalPatternResult` 不允许读取：

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

## 2.3 Do not silently reuse legacy `BaziDerivedFeatures`

当前 `BaziDerivedFeatures` 中存在：

```text
legacy dayMasterStrength
engineering elementDistribution
engineering tenGodDistribution
support_ratio-derived context
```

这些可继续作为 legacy / analytics / Interpretation 输入，但不得成为 `TraditionalPatternResult` authority。

因此 V1 `TraditionalPatternInput` **不接收 `BaziDerivedFeatures`**。

---

# 3. Input Contract（输入契约）

## 3.1 Proposed input

```ts
export interface TraditionalPatternInput {
  birthProfile: BirthProfile;
  chart: BaziChart;
  calculationMetadata: BaziCalculationMetadata;
  relations: BaziRelation[];
}
```

为什么需要 `BirthProfile`：

- `birthTimePrecision` 用于 unknown / approximate ambiguity；
- `birthTime` 用于 23:00 / 00:00 边界；
- `birthPlace.coordinates` 可用于未来仅做 true-solar-time boundary comparator（边界比较器），不改变 V1 authority；
- `resolvedBirthInstant` / historical offset 用于可复现性与 DST ambiguity。

为什么不直接只传 `BaziCalculationResult`：

- `BaziCalculationResult` 当前不保留完整 birth precision / coordinates；
- `derivedFeatures` 含 legacy numeric model，不应成为该函数的隐式输入；
- `luck` 不属于本轮格局判断必需输入。

## 3.2 Input profile guard

正式实现必须有 fail-closed（失败关闭）守卫：

```text
calculationMetadata.rule_profile_version
MUST equal
ziping-v1.0.0
```

否则：

```text
DO NOT silently reinterpret legacy chart
DO NOT auto-upgrade civil-local-jieqi-v1
```

推荐抛出 typed error：

```text
RULE_PROFILE_MISMATCH
```

## 3.3 Current implementation prerequisite

当前 production `modules/bazi/engine.ts` 仍输出：

```text
civil-local-jieqi-v1
```

且当前 23:00–23:59 hour stem 仍从 same civil-day day stem 推导。

这与已冻结：

```text
ziping-v1.0.0
NIGHT_ZI / ZI_ZHENG_SPLIT_PROFILE
```

不完全一致。

因此下一轮 Build 在真正调用 `TraditionalPatternResult` 前，必须先建立 **versioned ziping calculation path（版本化子平排盘路径）**，并保留 legacy result 可识别性。

这是 implementation prerequisite，不是重新打开 Rule Profile 讨论。

---

# 4. Output Contract（输出契约）

## 4.1 Proposed shared TypeScript contract

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

export interface TraditionalPatternResult {
  id: UUID;
  chartId: UUID;

  engine_version: string;
  rule_profile_version: "ziping-v1.0.0";
  pattern_schema_version: "traditional-pattern-result/1.0.0";

  patternStatus: TraditionalPatternStatus;
  baseMonthHost: TraditionalBaseMonthHost;

  primaryPattern: TraditionalPattern | null;
  secondaryPatterns: TraditionalPattern[];
  candidates: TraditionalPatternCandidate[];

  formationState: TraditionalFormationState;
  strengthContext: TraditionalStrengthContext;
  followStructure: TraditionalFollowStructure;
  keyCombinations: TraditionalKeyCombination[];

  evidence: TraditionalPatternEvidence[];
  counterEvidence: TraditionalPatternCounterEvidence[];
  ambiguities: TraditionalPatternAmbiguity[];

  evidenceSufficiency: TraditionalEvidenceSufficiency;
  generatedAt: ISODateTime;
}
```

## 4.2 Why no `UNKNOWN` / `NONE` Pattern enum

V1 提议：

```text
primaryPattern = null
```

配合：

```text
patternStatus = no_stable_single_pattern | mixed | ambiguous
```

表达“没有稳定主格 / 不能判断”。

不把：

```text
UNKNOWN
NONE
```

伪装成一个 Traditional Pattern。

## 4.3 Deterministic identity

`TraditionalPatternResult.id` 必须确定性生成，建议基于：

```text
chartId
+ engine_version
+ rule_profile_version
+ pattern_schema_version
```

不得把 `Date.now()` 混入 identity。

`generatedAt` 沿用 deterministic calculation audit timestamp 或明确、可复现的上游 timestamp；若未来需要真实执行时间，应拆成另一个非 identity audit 字段。

---

# 5. Base Month Host Contract（月令基础 Host 契约）

`baseMonthHost` 是 `ziping-v1.0.0` 的 first-class result，因为 Owner 已明确：

> base Host 只负责起点，不等于 final pattern verdict。

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

不允许：

```text
baseMonthHost.patternCandidate
=> directly copy to primaryPattern
```

必须经过：

```text
relations / transformation
roots / strength
formation support
formation damage
rescue
mixed / follow adjudication
```

---

# 6. Pattern Enums（格局枚举）

## 6.1 V1 final-capable patterns

```text
ZHENG_GUAN
QI_SHA
ZHENG_CAI
PIAN_CAI
ZHENG_YIN
PIAN_YIN
SHI_SHEN
SHANG_GUAN
JIAN_LU
YUE_JIE
YANG_REN
FOLLOW_WEALTH
FOLLOW_KILLING
```

Machine serialization 使用 lower snake case：

```text
zheng_guan
qi_sha
...
```

## 6.2 Public Personality names forbidden here

以下不得进入 Traditional Pattern enum：

```text
犟种
撒币
享乐主义
天生反骨
抠抠搜搜
搞钱圣体
老干部
狠人
活菩萨
道长
```

这些属于 Translation Layer。

## 6.3 Deferred special structures

从儿、从势、从强、专旺、假从、化气等可出现在：

```text
followStructure candidateKind
ambiguities
structured evidence
```

但 **不得** 在 `ziping-v1.0.0` 作为 final `TraditionalPattern` 扩枚举，除非未来 bump rule profile。

---

# 7. Pattern Status（格局状态）

## 7.1 `clear_single`

条件语义：

- 一个 final primary pattern 成立；
- 没有独立到足以成为 secondary 的竞争结构；
- material ambiguity 不影响主格结论。

Contract invariant：

```text
primaryPattern != null
secondaryPatterns.length = 0
```

## 7.2 `primary_with_secondary`

- 一个 primary 有明确 Host + formation 优先级；
- 至少一个 secondary 有独立传统结构依据；
- secondary 不是“第二高分”。

Invariant：

```text
primaryPattern != null
secondaryPatterns.length >= 1
```

## 7.3 `mixed`

- 至少两个 material candidates 形成实质竞争；
- 当前 profile 不允许以任意 tie-break 强制纯化。

推荐 invariant：

```text
primaryPattern = null
candidates.length >= 2
```

## 7.4 `no_stable_single_pattern`

- 有结构 facts，但没有候选能安全成为稳定 final primary；
- 不等于“没有十神”。

Invariant：

```text
primaryPattern = null
```

## 7.5 `follow_structure`

仅允许：

```text
primaryPattern = follow_wealth | follow_killing
followStructure.status = confirmed
```

## 7.6 `ambiguous`

只有 **material ambiguity 会改变 pattern verdict** 时才把整体 status 提升为 `ambiguous`。

存在 non-material ambiguity 不必强制整盘变成 `ambiguous`；可在 `ambiguities[]` 保留，同时维持 clear / primary_with_secondary。

---

# 8. Pattern Candidate Contract（候选格局契约）

为了回答“为什么不是另一个格”，必须保存结构化 candidate，而不是只保存 winner。

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

数组顺序不是“力量排名”。

建议 canonical serialization 按固定 enum order 排序，避免把 array order 误读成 numeric strength。

---

# 9. Formation State（成败破救）

## 9.1 `formed_clear`

Host 明确；该 pattern 的 required structural conditions 成立；没有 material damage 足以改变结构。

## 9.2 `formed_impure`

格局基本成立，但存在：

- competing structure；
- mixed qi；
- material-but-not-fatal counter evidence；
- 需要保留的不纯因素。

## 9.3 `failed`

候选 Host 存在，但 **从未满足成格所需的关键正向条件**。

关键词：

```text
candidate never reached stable formation
```

## 9.4 `broken`

候选曾满足基本 formation 条件，但存在明确 `FORMATION_DAMAGE`，使其不能继续作为成立格局。

关键词：

```text
formed basis exists
+ material damage invalidates it
```

因此：

```text
FAILED != BROKEN
```

## 9.5 `broken_rescued`

必须同时存在：

```text
FORMATION_DAMAGE evidence
+
RESCUE evidence
```

且 rescue rule 是该 pattern 在 `ziping-v1.0.0` / source catalog 中明确允许的结构救应，不是“另一个吉神出现”。

Invariant：

```text
at least one damage evidence key
at least one rescue evidence key
```

## 9.6 `not_formed`

该候选不满足基本 pattern candidate / host requirements，或结果层没有稳定 final formation。

## 9.7 `ambiguous`

输入不足、relation transformation unresolved、school-sensitive fact 或 V1 rule coverage 不足，导致 formation 无法安全裁决。

## 9.8 Pattern-specific evaluator requirement

禁止实现：

```text
all good evidence +1
all bad evidence -1
score >= X => formed
```

推荐接口：

```ts
interface PatternRuleSet {
  pattern: TraditionalPattern;
  candidateRules: RuleId[];
  requiredFormationRules: RuleId[];
  supportingRules: RuleId[];
  damageRules: RuleId[];
  rescueRules: RuleId[];
}

type RuleOutcome =
  | "matched"
  | "not_matched"
  | "unresolved"
  | "not_applicable";
```

Formation state 由 **规则条件逻辑** 产生，不由加权总分产生。

---

# 10. Strength Context（旺衰上下文）

## 10.1 Contract

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

## 10.2 Locked semantics

必须看：

```text
得令
得地 / 通根
得势 / 得助
生克制化
```

禁止：

```text
support_ratio authority
0.58 / 0.42
63.7% 身强
month × 1.5
hidden qi numeric percentage authority
```

## 10.3 Root evidence

根气必须保留层级：

```text
ROOT_MAIN_QI
ROOT_MIDDLE_QI
ROOT_RESIDUAL_QI
```

层级是结构分类，不转换成人造权重。

---

# 11. Evidence Contract（证据契约）

## 11.1 Principle

每一个 final conclusion 都必须可追踪到：

```text
deterministic chart fact
+
ruleId
+
ziping-v1.0.0
```

Evidence 不使用 free-form prose 作为 authority。

## 11.2 Vocabulary

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
```

## 11.3 Structured source / target

```ts
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
```

## 11.4 Evidence record

```ts
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

## 11.5 No authority weight in V1 evidence

V1 shared Evidence contract **不提供 numeric `weight` 字段**。

如果 UI 将来需要排序，可以在 presentation layer 使用：

```text
displayPriority
```

但该字段不得进入 Traditional Pattern authority，也不得存成“传统权重”。

## 11.6 Evidence IDs

建议 deterministic：

```text
hash / deterministicUuid(
  chartId
  + rule_profile_version
  + pattern_schema_version
  + ruleId
  + evidence type
  + structured source
  + structured target
)
```

---

# 12. Counter Evidence Contract（反证契约）

Counter Evidence 是 first-class data，不是一个 `reason: string`。

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

用途：

- Debug：为什么不是这个格；
- QA：候选为什么 rejected / broken；
- 专业报告：展示可读传统依据；
- Rule Audit：回溯 ruleId；
- Translation：理解结构复杂度，但不得修改传统结论。

---

# 13. Ambiguity Contract（歧义契约）

## 13.1 Codes

至少支持：

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
```

`school_sensitivity_late_zi` 来自 locked Rule Profile；`late_zi_boundary` 用于实际时间精度跨 23:00 / 00:00 边界的输入不确定性。

## 13.2 Severity

```ts
export type TraditionalAmbiguitySeverity =
  | "informational"
  | "material"
  | "blocking";
```

定义：

- `informational`：记录流派敏感性，但不改变当前 profile verdict；
- `material`：可能改变 secondary / formation / combination，但当前 primary 仍可保留；
- `blocking`：可能改变 primary pattern / chart facts，必须阻止 final verdict。

## 13.3 Affected fields

```ts
export type TraditionalPatternAffectedField =
  | "year_pillar"
  | "month_pillar"
  | "day_pillar"
  | "hour_pillar"
  | "base_month_host"
  | "primary_pattern"
  | "secondary_patterns"
  | "formation_state"
  | "strength_context"
  | "follow_structure"
  | "key_combinations";
```

## 13.4 Record

```ts
export interface TraditionalPatternAmbiguity {
  id: string;
  code: TraditionalPatternAmbiguityCode;
  severity: TraditionalAmbiguitySeverity;
  affectedFields: TraditionalPatternAffectedField[];
  messageCode: string;
  evidenceKeys: string[];
}
```

## 13.5 Approximate time policy

当前 `BirthTimePrecision = approximate` 没有 `±N minutes` uncertainty interval。

因此 V1 implementation **不得自行发明 ±15 / ±30 / ±60 分钟**。

提议：

```text
approximate time with no explicit uncertainty range
=> approximate_time_unbounded
```

若该不确定性会影响 hour / day / Jie / LiChun 等关键边界，则 severity 升为 material / blocking。

该项属于 Contract implementation policy，需 Spec Review 时确认。

---

# 14. Relation / Transformation Contract（合冲刑害与合化状态）

## 14.1 Current gap

当前 `BaziRelationKind` 只有：

```text
stem_combination
branch_combination
branch_clash
branch_harm
```

`ziping-v1.0.0` implementation 至少还需要：

```text
three_harmony
three_meeting
punishment
break
```

## 14.2 Existence != transformation

必须拆开：

```ts
export type TraditionalTransformationState =
  | "validated"
  | "unresolved"
  | "not_transformed";
```

关系存在不能默认等于已经合化。

推荐未来扩展 relation fact：

```ts
interface TraditionalRelationFact {
  id: string;
  kind: ...;
  participants: ...;
  transformationState: TraditionalTransformationState;
  transformedElement?: FiveElement;
  evidenceKeys: string[];
  ambiguityKeys: string[];
}
```

`transformationState = unresolved` 必须可传播到 Pattern ambiguity。

---

# 15. Combination Contract（组合结构契约）

## 15.1 Directional enum

严格保留 `ziping-v1.0.0` 已冻结的 Host direction：

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
```

## 15.2 Result

```ts
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

## 15.3 Direction invariants

必须测试：

```text
RESOURCE_PROTECTS_OFFICER
!=
OFFICER_GENERATES_RESOURCE

RESOURCE_TRANSFORMS_QI_SHA
!=
QI_SHA_GENERATES_RESOURCE

SHANG_GUAN_GENERATES_WEALTH
!=
wealth host receiving output generation
```

不能因为同样两个 Ten Gods 出现就折叠成无方向组合。

---

# 16. Follow Structure Contract（从格契约）

## 16.1 Status

```ts
export type TraditionalFollowStatus =
  | "none"
  | "candidate"
  | "confirmed"
  | "rejected"
  | "ambiguous";
```

## 16.2 Candidate kinds

```ts
export type TraditionalFollowCandidateKind =
  | "follow_wealth"
  | "follow_killing"
  | "follow_output"
  | "follow_momentum"
  | "follow_strong"
  | "specialized_strength"
  | "fake_follow"
  | "other_deferred";
```

只有：

```text
follow_wealth
follow_killing
```

允许 `status = confirmed` 并进入 final `TraditionalPattern`。

其他 candidate kind：

```text
candidate / ambiguous / rejected only
never final primaryPattern in ziping-v1.0.0
```

## 16.3 Contract

```ts
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

## 16.4 Confirmed invariants

`confirmed` 至少要求：

- 无 material root 足以破从；
- 无有效印比形成自立；
- 所从方向形成连续主导结构；
- transformation / formation evidence 不逆向；
- 无 material mixed evidence 破坏结论。

不得通过 numeric weakness threshold 自动 confirm。

---

# 17. Evidence Sufficiency（证据充分度）

V1 不建议使用 0–1 `confidence` 数字，因为很容易被误解为：

```text
“这个格局有 83% 概率”
```

提议使用：

```text
sufficient
partial
insufficient
indeterminate
```

语义只代表：

> **当前 frozen rules + available deterministic facts 是否足够支持该结论。**

它不是命理概率，也不是人格准确率。

---

# 18. Versioning（版本）

必须拆分：

```text
engine_version
rule_profile_version
pattern_schema_version
```

分别回答：

- `engine_version`：哪个 deterministic engine implementation；
- `rule_profile_version`：采用哪一套传统规则；
- `pattern_schema_version`：结果 JSON / TypeScript contract 结构版本。

V1 提议：

```text
rule_profile_version = ziping-v1.0.0
pattern_schema_version = traditional-pattern-result/1.0.0
```

禁止：

```text
latest
final
new
```

## 18.1 Compatibility rule

任何改变传统判定语义：

```text
bump rule_profile_version
```

只改变 result field / serialization，不改变命理语义：

```text
bump pattern_schema_version
```

Engine refactor 但结果语义不变：

```text
bump engine_version when appropriate
```

---

# 19. Shared Domain Impact（共享契约影响）

下一轮 Build 建议新增：

```text
types/domain/traditional-pattern.ts
```

并从：

```text
types/domain/index.ts
```

export。

建议 shared types：

```text
TraditionalPatternResult
TraditionalPattern
TraditionalPatternStatus
TraditionalFormationState
TraditionalStrengthContext
TraditionalPatternEvidence
TraditionalPatternCounterEvidence
TraditionalPatternAmbiguity
TraditionalKeyCombination
TraditionalFollowStructure
TraditionalBaseMonthHost
```

## 19.1 Do not immediately break `BaziCalculationResult`

V1 第一阶段不建议直接把 `traditionalPattern` 设为 `BaziCalculationResult` required field，因为：

- existing tests / persistence / public session bundle 都依赖当前 shape；
- legacy results 仍是 `civil-local-jieqi-v1`；
- shadow compare 需要新旧结果并存。

推荐先独立生成：

```text
TraditionalPatternResult(chartId keyed)
```

后续可新增组合 read model：

```ts
interface TraditionalBaziAnalysisResult {
  calculation: BaziCalculationResult;
  traditionalPattern: TraditionalPatternResult;
}
```

是否最终把它纳入 `BaziCalculationResult` required contract，留到 persistence / consumer integration Review 再决定。

## 19.2 Future consumers

### Bazi Engine

producer / authority。

### Supabase persistence

未来建议 first-class persistence，以：

```text
chart_id
+ rule_profile_version
+ pattern_schema_version
```

可追踪；本轮和下一核心 Build 不要求 Supabase Live。

### Interpretation

只消费结果；不得重算 pattern。

### AI ContextAssembler

未来只把 structured TraditionalPatternResult + selected evidence packet 提供给 LLM；LLM 不可修改 verdict。

### Result UI

只消费 translation layer / professional evidence view，不直接把 raw debug trace 全展示公网。

---

# 20. Rule Trace / Observability（调试轨迹）

Evidence 已承担 durable explainability（持久可解释性）。

仍建议提供 **module-local debug trace**，但不进入 shared Public Result contract：

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

推荐 API：

```ts
calculateTraditionalPattern(input)
// production result only

evaluateTraditionalPatternDebug(input)
// { result, ruleTrace }
```

`ruleTrace`：

- 可用于 tests / local debug / QA；
- 不默认持久化；
- 不发给公网用户；
- 不允许包含 Personality / LLM reasoning。

---

# 21. Rule ID Contract（规则编号）

为了 Evidence 可审计，下一轮 Build 必须建立稳定 rule IDs。

建议 namespace：

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

示例：

```text
ZP-HOST-001 main-qi-exposed
ZP-HOST-002 middle-qi-exposed-when-main-unexposed
ZP-HOST-003 residual-qi-exposed-fallback
ZP-HOST-004 unexposed-main-fallback
ZP-FOLLOW-001 material-root-breaks-follow
```

Rule ID 不是文案 code；改变规则语义需要 profile/version review。

---

# 22. Legacy Isolation / Migration（旧逻辑隔离 / 迁移）

当前公网真实路径仍是：

```text
calculateBazi
→ interpretBaziChart
→ selectArchetypeCandidate
→ personality-map/0.2.0
→ dominant_ten_god
→ Public Personality
```

不能在新 engine 第一天删除旧逻辑。

## Phase A — Independent Traditional Result

```text
new ziping calculation path
→ TraditionalPatternResult
```

- 独立生成；
- 不接 Public Personality；
- legacy public experience 继续工作；
- 新结果不得读取 legacy candidate。

## Phase B — Shadow Compare（影子对比）

对同一 fixture / opt-in dev flow 同时生成：

```text
new TraditionalPatternResult
vs
legacy ArchetypeCandidate
```

比较目的：

- 找 migration impact；
- 找旧 authority 漂移；
- 找代码 bug。

禁止：

```text
“哪个更像用户反馈” -> 修改 traditional verdict
```

Shadow disagreement 不是新规则的失败证据。

## Phase C — Translation Layer

建立：

```text
TraditionalPatternResult
→ explicit translation rule
→ Public Personality
```

此阶段才允许 Public Personality 开始消费新结果。

## Phase D — Authority Cutover

满足以下 Gate 后：

- Rule / Golden tests 通过；
- Spec 已 Freeze；
- TraditionalPatternResult implementation Review 通过；
- Public translation mapping Review 通过；
- Result / Share regression 通过；

才把公网 authoritative source 从：

```text
ArchetypeCandidate.dominant_ten_god
```

切到：

```text
TraditionalPatternResult
→ Translation Layer
```

## Phase E — Legacy retirement

旧 `personality-map/0.2.0` 可以：

- 保留作 historical experiment；
- 只继续支撑非 authority modern dimensions；
- 或在确认无 consumer 后删除。

**只有 Authority Cutover + regression 完成后才允许删除。**

切换后禁止 fallback：

```text
TraditionalPatternResult unavailable
=> silently use old candidate as traditional answer
```

应明确返回 unavailable / ambiguous，而不是恢复旧 authority。

---

# 23. Implementation Plan（实现计划）

本节是下一轮 Build 的顺序，不代表本轮已实现。

## Phase 1 — Contract + Profile Guard

目标：只建立 shared contract 和不可越过的版本边界。

计划：

1. 新增 `types/domain/traditional-pattern.ts`；
2. export shared types；
3. 增加 `PATTERN_SCHEMA_VERSION = traditional-pattern-result/1.0.0`；
4. 建 `modules/bazi/traditional-pattern/` skeleton；
5. 建 `assertZipingRuleProfile()`；
6. 编译期 / unit tests 证明 traditional layer 不 import Interpretation；
7. 不接公网。

## Phase 2 — Ziping Calendar Compatibility + Structural Evidence

目标：保证输入 chart 本身符合 locked profile，并建立基础传统 facts。

计划：

1. 建立 versioned `ziping-v1.0.0` calculation path；
2. 实现 00:00 day boundary + night-Zi hour-stem convention；
3. 保持 exact LiChun / exact Jie；
4. 保持 historical IANA / DST；
5. unknown / approximate / boundary ambiguity；
6. Month Host evaluator；
7. exposure evaluator；
8. root evaluator；
9. qualitative strength evaluator；
10. 扩展 relations existence：三合 / 三会 / 刑 / 破；
11. 增加 transformation state；
12. 所有 facts 输出 Evidence。

注意：此阶段不能把 legacy support ratio 重新包装成 strength。

## Phase 3 — Pattern Candidates

目标：生成传统候选，不做人格。

顺序：

```text
8 regular patterns
→ Jianlu
→ Yuejie
→ five-yang Yangren
```

每个 candidate 必须有：

```text
origin
evidenceKeys
counterEvidenceKeys
ambiguityKeys
```

## Phase 4 — Pattern-specific Formation

逐格建立：

```text
candidate requirements
required formation
support
material damage
rescue
```

输出：

```text
formed_clear
formed_impure
failed
broken
broken_rescued
not_formed
ambiguous
```

必须以显式 rules + boolean / tri-state outcomes 实现；不得用总分。

## Phase 5 — Mixed + Follow Structures

先实现：

```text
primary_with_secondary
mixed
no_stable_single_pattern
```

再实现严格：

```text
follow_wealth
follow_killing
```

其他 follow 只能 candidate / ambiguous / deferred。

## Phase 6 — Result Assembly

组装完整：

```text
TraditionalPatternResult
```

实现 invariants：

- version guard；
- patternStatus consistency；
- evidence integrity；
- deterministic IDs；
- canonical array ordering；
- no numeric authority fields。

Phase A shadow integration 可以在这里加入，但仍不切 Public Personality。

## Phase 7 — QA / Golden Review

- unit tests；
- golden cases；
- boundary fixtures；
- determinism；
- rule review；
- debug trace review；
- shadow compare。

本 Phase 结束仍然：

```text
Public Personality authority = NOT YET CUT OVER
```

下一独立 Task 才是 Translation Layer / Authority Cutover。

---

# 24. Testing Matrix（测试矩阵）

## 24.1 Calendar Boundaries

必须覆盖：

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
DST overlap occurrence A / B
unknown birth time
approximate birth time
unknown / approximate on LiChun day
unknown / approximate on Jie day
```

Night Zi 必须明确断言：

```text
23:xx day pillar = current civil day
23:xx hour branch = zi
23:xx hour stem = starts from next civil day's day stem
00:xx day pillar = new civil day
00:xx hour branch = zi
00:xx hour stem = starts from new civil day's day stem
```

并保留旧 `civil-local-jieqi-v1` vector，证明不是 silent migration。

## 24.2 Month Host

至少覆盖：

```text
main qi exposed
main unexposed + middle exposed
main/middle unexposed + residual exposed
none exposed -> unexposed main fallback
multiple exposed -> main > middle > residual base Host
competing exposure retained
base Host unchanged even when final verdict changes later
```

八个 regular patterns 均应至少有清晰 Host fixture。

## 24.3 Self-rooted

- 10 Jianlu mappings；
- Yuejie representative fixtures；
- 五阳 Yangren exact mappings；
- 五阴日主不得 auto-Yangren；
- 比肩出现但非建禄；
- 劫财出现但非月劫；
- 劫财出现但非阳刃。

## 24.4 Strength

至少覆盖：

- 得令但无根；
- 失令但多根 / 多助；
- 根被有效关系改变的 unresolved case；
- resource / peer support；
- output / wealth drain；
- officer / killing pressure；
- mixed evidence；
- ambiguous transformation。

断言只能检查 qualitative band + evidence，不检查百分比。

## 24.5 Eight Regular Patterns

每类至少：

```text
clear formation
formed impure
failed
broken
broken rescued
ambiguous
```

形成规则要逐格 fixture，不用一个 generic scoring fixture 套全部。

## 24.6 Mixed

- primary + secondary；
- 官杀混杂；
- 两个 material candidate 无法安全定主；
- no stable single pattern；
- multiple candidates ambiguity。

## 24.7 Follow

- strict Follow Wealth confirmed；
- strict Follow Killing confirmed；
- material root breaks follow；
- effective Resource / Peer support breaks follow；
- mixed structure rejects follow；
- fake-follow candidate never final；
- deferred follow candidate never becomes final enum。

## 24.8 Combination Direction

必须证明：

```text
RESOURCE_PROTECTS_OFFICER != OFFICER_GENERATES_RESOURCE
RESOURCE_TRANSFORMS_QI_SHA != QI_SHA_GENERATES_RESOURCE
SHI_SHEN_CONTROLS_QI_SHA retains host direction
SHANG_GUAN_GENERATES_WEALTH retains host direction
```

## 24.9 Evidence integrity invariants

自动化 invariant tests：

```text
primaryPattern != null
=> evidenceKeys for that pattern exist

formationState = broken
=> formation_damage exists

formationState = broken_rescued
=> formation_damage + rescue both exist

followStructure.status = confirmed
=> confirmedPattern is follow_wealth or follow_killing

patternStatus = ambiguous
=> at least one material/blocking ambiguity

patternStatus = primary_with_secondary
=> primary != null and secondary.length >= 1

patternStatus = mixed
=> candidates >= 2

all evidence.ruleId resolve in rule catalog
all evidence ids unique
all counterEvidence references valid evidence keys
all ambiguity evidenceKeys resolve
```

## 24.10 Architecture integrity

- `modules/bazi/traditional-pattern/**` has no import from `modules/interpretation/**`；
- result serializer contains no `candidate_score` / Personality Dimension inputs；
- same input + same engine + same rule profile + same schema => byte-stable result。

---

# 25. Golden Cases（黄金命例）

推荐目录：

```text
tests/fixtures/traditional-pattern/
  manifest.ts
  classic/
  textbook/
  boundary/
  regression/
```

或采用同等现有 TypeScript fixture 结构，但必须保持 provenance metadata（来源元数据）。

## 25.1 Fixture metadata

每个 Golden Case 至少记录：

```ts
interface TraditionalPatternGoldenCase {
  id: string;
  sourceClass:
    | "classic_text"
    | "traditional_textbook"
    | "synthetic_boundary"
    | "regression";

  sourceTitle: string;
  sourceSection?: string;
  sourceReference?: string;
  notes?: string;

  rule_profile_version: "ziping-v1.0.0";
  pattern_schema_version: "traditional-pattern-result/1.0.0";

  input: BirthProfile | explicit chart fixture;
  expected: {
    patternStatus?: TraditionalPatternStatus;
    baseMonthHost?: Partial<TraditionalBaseMonthHost>;
    primaryPattern?: TraditionalPattern | null;
    formationState?: TraditionalFormationState;
    requiredEvidenceTypes?: TraditionalEvidenceType[];
    requiredCounterEvidenceTypes?: TraditionalCounterEvidenceType[];
    ambiguityCodes?: TraditionalPatternAmbiguityCode[];
  };
}
```

## 25.2 Source classes

### A. 古籍明确案例

优先来自项目已采用主线：

- 《子平真诠》；
- 《渊海子平》；
- 《三命通会》。

只存必要的命例事实、章节引用与 expected rules；不把现代网站长篇转录复制进 fixture。

### B. 已知传统教材案例

使用明确作者 / 版本 / 页码或章节来源。

对仍受版权保护的现代教材，只记录 bibliographic reference + 最少必要事实，不复制长段正文。

### C. Artificial Boundary Fixture（人工边界样例）

只用于验证：

- LiChun / Jie；
- 23:00 / 00:00；
- DST；
- unknown / approximate；
- specific relation existence。

不得把 C 类当“传统格局正确性”证据。

### D. Regression Fixture（回归样例）

来自真实 bug / previously verified output。

必须记录：

```text
regression reason
fix commit / issue
expected rule behavior
```

---

# 26. Persistence / Serialization Plan（持久化与序列化）

本轮不改 Supabase。

未来建议：

```text
TraditionalPatternResult
= first-class versioned result keyed by chartId
```

不要只把它塞进 free-form JSON report。

Session-only V1 migration 时：

- Phase A/B 可在 dev / shadow bundle 临时并存；
- 真正 Public Result cutover 时必须 bump `PUBLIC_RESULT_SCHEMA_VERSION`；
- old session bundle 应 fail safely，而不是把 legacy archetype 当新 result。

Supabase schema / migration 属后续独立 task，不应阻塞 deterministic core tests。

---

# 27. Risks（风险）

## R1 — Current chart profile mismatch

当前 `calculateBazi` 仍是 `civil-local-jieqi-v1`，尤其 late-Zi hour stem 与 locked profile 不同。

Mitigation：versioned ziping calculation path + profile guard + dual golden vectors。

## R2 — Approximate time has no uncertainty range

`BirthTimePrecision = approximate` 没有 ±分钟字段。

Mitigation：不自造窗口；输出 `approximate_time_unbounded`；若影响关键边界则 material / blocking。

## R3 — True solar ambiguity comparator not implemented

V1 不自动真太阳时，但 near-boundary ambiguity 需要能在有坐标时识别 alternative bucket difference。

Mitigation：把 comparator 作为 auxiliary ambiguity detector，不让它改变 authority；无坐标时不伪造结论。

## R4 — Relations are existence-only and incomplete

当前无 三合 / 三会 / 刑 / 破，也无 transformation state。

Mitigation：Phase 2 补 structural facts，再允许 formation final。

## R5 — Pattern-specific formation can scope-explode

若一次实现所有古籍细节会失控。

Mitigation：只实现 `ziping-v1.0.0` supported patterns；每个 rule 必须有 ruleId + source reference；unsupported condition => ambiguity / deferred，不临时发明规则。

## R6 — Legacy D-010 wording

历史 D-010 / `BaziDerivedFeatures` comment 把 legacy dayMasterStrength 描述为 canonical traditional structure fact，现已被 Audit + Rule Profile 限定为 non-authority legacy model。

Mitigation：Build 时通过新的 shared TraditionalPattern contract 和必要的 superseding documentation 明确语义；不要删除历史 decision。

## R7 — Public site migration regression

当前 `PublicResultBundle` required `archetype`，Result UI 仍读 legacy dominant Ten God。

Mitigation：Phase A/B 不切 public；Phase C/D 单独做 schema + translation cutover；切换前不删除 legacy。

---

# 28. Proposed Decisions Requiring Owner Review（需要 Owner Review 的新架构决定）

以下不是对 `ziping-v1.0.0` 的修改，而是 **Result Contract / implementation architecture** 新决定：

## TP-01 — Ownership

```text
TraditionalPatternResult owner = modules/bazi/traditional-pattern
Interpretation = consumer only
```

## TP-02 — Input isolation

```text
TraditionalPatternInput
= BirthProfile + BaziChart + CalculationMetadata + Relations

BaziDerivedFeatures = excluded from traditional authority input
```

## TP-03 — Schema version

```text
pattern_schema_version = traditional-pattern-result/1.0.0
```

与 `rule_profile_version` 独立。

## TP-04 — No sentinel Pattern

```text
no UNKNOWN / NONE pattern enum
primaryPattern = null + explicit patternStatus
```

## TP-05 — Evidence sufficiency is categorical

```text
sufficient / partial / insufficient / indeterminate
```

不使用 0–1 traditional confidence。

## TP-06 — Approximate-time policy

没有明确 uncertainty interval 时不自造 ±分钟窗口；使用 `approximate_time_unbounded` ambiguity，并在影响关键边界时升级 material / blocking。

## TP-07 — Shared result composition

第一阶段不把 `TraditionalPatternResult` 设为 `BaziCalculationResult` required field；以 `chartId` 独立版本化，支持 shadow migration。后续 consumer cutover 再决定组合 read model / persistence shape。

在 Owner / Review Gate 批准前，以上均为 **PROPOSED**。

---

# 29. Build Gate（开发门）

本文完成后状态：

```text
Rule Audit = DONE
Rule Profile = LOCKED
TraditionalPatternResult Spec = READY FOR REVIEW
Implementation = NOT STARTED
```

只有以下完成后才允许 production Build：

```text
1. Review TP-01 ～ TP-07
2. Spec corrections if needed
3. Decision Log => Approved / Spec LOCKED
4. Current State => Spec LOCKED
5. Roadmap => Implementation ACTIVE
6. then Build Phase 1
```

在此之前禁止：

- 写 production TraditionalPatternResult；
- 改现有 Bazi algorithm；
- 改 Public Personality mapping；
- 改 `personality-map/0.2.0`；
- 删除 legacy candidate；
- 改 UI / Share Card / Character；
- Merge PR #16。

---

# 30. Review Checklist（审核清单）

- [x] Contract 能表达 clear single pattern；
- [x] 能表达 primary + secondary；
- [x] 能表达 mixed；
- [x] 能表达 no stable single pattern；
- [x] 能表达 failed / broken / rescued；
- [x] 能表达 follow candidate / confirmed / rejected / ambiguous；
- [x] 所有 final verdict 可通过 Evidence 回溯；
- [x] Counter Evidence 为 first-class；
- [x] Ambiguity 为 typed first-class；
- [x] Strength 无百分比 / numeric threshold authority；
- [x] Directional combinations 不丢 Host；
- [x] `ziping-v1.0.0` 未被重新讨论或修改；
- [x] legacy `personality-map/0.2.0` 有安全 migration path；
- [x] 当前 production logic 未修改；
- [x] Build Gate 明确阻止 Spec 未 Freeze 时直接开发。

---

# 31. Final Proposed Contract Summary

```text
TraditionalPatternResult

OWNER:
Bazi Traditional Layer

INPUT:
BirthProfile
+ BaziChart
+ BaziCalculationMetadata
+ BaziRelation[]
(no BaziDerivedFeatures authority)

VERSIONS:
engine_version
rule_profile_version = ziping-v1.0.0
pattern_schema_version = traditional-pattern-result/1.0.0

STATUS:
clear_single
primary_with_secondary
mixed
no_stable_single_pattern
follow_structure
ambiguous

PATTERNS:
8 regular
+ Jianlu
+ Yuejie
+ Yangren
+ strict Follow Wealth
+ strict Follow Killing

FORMATION:
formed_clear
formed_impure
failed
broken
broken_rescued
not_formed
ambiguous

STRENGTH:
qualitative only

EXPLAINABILITY:
baseMonthHost
candidates[]
evidence[]
counterEvidence[]
ambiguities[]
keyCombinations[]
followStructure

MIGRATION:
independent result
→ shadow compare
→ translation layer
→ authority cutover
→ legacy retirement

BUILD:
BLOCKED UNTIL SPEC REVIEW + FREEZE
```
