# 10 — Roadmap

状态：**V1 Release Freeze — TraditionalPatternResult Spec Review Active**  
最后更新：2026-08-23

## 0. Roadmap Boundary

Source of Truth：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`
4. `docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`（当前 Proposed / Review）
5. `docs/09_CURRENT_STATE.md`
6. `docs/10_ROADMAP.md`
7. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

项目执行流程：`docs/21_AI_PROJECT_OPERATING_SYSTEM.md`。

本文件只描述下一步。

## 1. V1 Objective

```text
Homepage
→ Birth
→ deterministic Bazi calculation
→ Traditional Structure / Pattern judgment
→ evidence-backed Public Personality translation
→ fixed Character IP
→ full dominant Personality Dossier
→ Share Card
→ friend opens website and tests
```

## 2. 当前 P0 顺序

1. ✅ Traditional Bazi Rule Audit — COMPLETE
2. ✅ Rule Profile Research / Specification — COMPLETE
3. ✅ Owner Approval OA-01 ～ OA-07 — COMPLETE
4. ✅ `ziping-v1.0.0` Rule Profile Freeze — COMPLETE
5. ✅ TraditionalPatternResult Spec + Implementation Plan draft — COMPLETE
6. **TraditionalPatternResult Spec Review + Freeze — NEXT / ACTIVE**
7. `TraditionalPatternResult` Production Implementation — BLOCKED UNTIL #6
8. Public Personality authoritative translation
9. isolate / retire legacy engineering personality authority
10. Character routing / formal asset completion
11. Result / Share Card translation integration
12. mobile browser QA
13. full CI
14. PR #16 Ready
15. merge main
16. Vercel Production
17. final public smoke test

## 3. P0.1 — Traditional Bazi Rule Audit

状态：**COMPLETE**。

Source：`docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`。

核心结论继续有效：

- production 尚无真正 Traditional Pattern adjudication；
- legacy support ratio / 0.58 / 0.42 / month ×1.5 / candidate ranking 属 experimental；
- `personality-map/0.2.0` 不得承担 Traditional Pattern authority。

## 4. P0.2 — Traditional Bazi Rule Profile V1

状态：**APPROVED / LOCKED**。

Source：`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`。

正式版本：

```text
rule_profile_version = ziping-v1.0.0
```

冻结内容包括：

```text
YEAR_BOUNDARY = EXACT_LICHUN_INSTANT
MONTH_BOUNDARY = EXACT_JIE_INSTANT
DAY_BOUNDARY = LOCAL_CIVIL_MIDNIGHT_00_00
LATE_ZI = NIGHT_ZI / ZI_ZHENG_SPLIT_PROFILE
TIME_STANDARD = HISTORICAL_IANA_CIVIL_TIME
TRUE_SOLAR_TIME = NOT_AUTO_APPLIED_IN_V1

MONTH_HOST_BASE = month branch
→ ordered hidden qi (main > middle > residual)
→ exposure
→ base Pattern Host

DAY_MASTER_STRENGTH = QUALITATIVE_EVIDENCE_PROFILE
YANGREN = FIVE_YANG_STEMS_ONLY
FOLLOW FINAL = STRICT_FOLLOW_WEALTH + STRICT_FOLLOW_KILLING
```

Rule Profile 不在当前 Spec Review 中重新讨论。

## 5. P0.3 — TraditionalPatternResult Spec V1

状态：**READY FOR REVIEW / PROPOSED**。

Source：

`docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`

Proposed schema version：

```text
pattern_schema_version = traditional-pattern-result/1.0.0
```

### 5.1 Proposed Architecture

```text
BirthProfile
+ BaziChart
+ CalculationMetadata
+ Relations
↓
modules/bazi/traditional-pattern/**
↓
TraditionalPatternResult
```

Traditional layer 不读取：

```text
BaziDerivedFeatures numeric authority
PersonalityDimensions
ArchetypeCandidate
candidate_score
Public Personality
LLM output
```

### 5.2 Proposed Result

至少包含：

```text
engine_version
rule_profile_version
pattern_schema_version
patternStatus
baseMonthHost
primaryPattern
secondaryPatterns[]
candidates[]
formationState
strengthContext
followStructure
keyCombinations[]
evidence[]
counterEvidence[]
ambiguities[]
evidenceSufficiency
```

### 5.3 Proposed Pattern Status

```text
clear_single
primary_with_secondary
mixed
no_stable_single_pattern
follow_structure
ambiguous
```

### 5.4 Proposed Pattern Enum

```text
8 regular patterns
+ Jianlu
+ Yuejie
+ Yangren
+ Follow Wealth
+ Follow Killing
```

没有 `UNKNOWN / NONE` sentinel；无法稳定归类时使用：

```text
primaryPattern = null
+ explicit patternStatus
```

### 5.5 Evidence Contract

first-class：

```text
evidence[]
counterEvidence[]
ambiguities[]
```

每个正式结论必须能追到 deterministic fact + stable ruleId + `ziping-v1.0.0`。

V1 Evidence contract 不提供 numeric traditional weight。

### 5.6 Proposed Review Decisions TP-01 ～ TP-07

Review 必须明确批准 / 修改：

```text
TP-01 Bazi Traditional Layer owns result
TP-02 exclude BaziDerivedFeatures from traditional authority input
TP-03 pattern_schema_version = traditional-pattern-result/1.0.0
TP-04 no UNKNOWN/NONE Pattern sentinel
TP-05 categorical evidence sufficiency; no numeric traditional confidence
TP-06 approximate-time ambiguity does not invent ±minute window
TP-07 first phase keeps result independent from required BaziCalculationResult field for shadow migration
```

这些是 Contract / architecture decision，不改变 `ziping-v1.0.0`。

## 6. P0.3 Review + Freeze Gate — ACTIVE

当前唯一 P0：

> **Review + Freeze `docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`。**

通过条件：

```text
1. TP-01 ～ TP-07 approved / modified
2. Contract consistency review passes
3. Rule Profile compliance review passes
4. Legacy migration review passes
5. Testing / Golden strategy accepted
6. Decision Log records Approved contract
7. Current State marks Spec LOCKED
8. Roadmap moves Production Implementation to ACTIVE
```

未经该 Gate：

```text
DO NOT BUILD TraditionalPatternResult production code
```

## 7. P0.4 — TraditionalPatternResult Implementation

状态：**BLOCKED — Spec not frozen**。

Spec Freeze 后按以下 phases 开发。

### Phase 1 — Contract + Profile Guard

- `types/domain/traditional-pattern.ts`
- shared enums / result types
- `pattern_schema_version`
- `modules/bazi/traditional-pattern/**` skeleton
- `ziping-v1.0.0` profile guard
- no Interpretation imports

### Phase 2 — Ziping Calendar Compatibility + Structural Evidence

- versioned `ziping-v1.0.0` calculation path
- night-Zi hour-stem convention
- exact LiChun / Jie
- historical IANA / DST
- boundary ambiguity
- Month Host / exposure
- roots
- qualitative strength
- 三合 / 三会 / 刑 / 破
- transformation state

### Phase 3 — Pattern Candidates

- 8 regular
- Jianlu
- Yuejie
- five-yang Yangren

### Phase 4 — Pattern-specific Formation

逐格实现：

```text
required formation
support
damage
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

禁止 generic weighted scoring。

### Phase 5 — Mixed + Follow

```text
primary_with_secondary
mixed
no_stable_single_pattern
strict Follow Wealth
strict Follow Killing
```

其他 follow 不得 final。

### Phase 6 — Result Assembly + Shadow Integration

- complete `TraditionalPatternResult`
- deterministic IDs
- canonical ordering
- evidence integrity
- shadow compare only
- 不切 Public Personality authority

### Phase 7 — QA / Golden Review

- unit tests
- golden cases
- boundary cases
- determinism
- rule review
- debug trace review
- shadow compare

## 8. Implementation Test Gate

### Calendar

```text
LiChun -1s / exact / +1s
Jie -1s / exact / +1s
22:59 / 23:00 / 23:59 / 00:00 / 00:59 / 01:00
DST gap / overlap
unknown / approximate time
```

### Month Host

```text
main exposed
middle exposed fallback
residual exposed fallback
none exposed -> main fallback
multiple exposure
base Host survives later final-verdict change
```

### Pattern / Formation

- 8 regular 清格；
- Jianlu / Yuejie / Yangren；
- clear / impure / failed / broken / rescued / ambiguous；
- primary + secondary；
- mixed；
- no stable single；
- strict Follow Wealth / Killing；
- follow rejected。

### Evidence integrity

必须自动断言：

```text
primary has evidence
broken has damage evidence
broken_rescued has damage + rescue
confirmed follow is only wealth / killing
ambiguous has material/blocking ambiguity
all ruleIds resolve
all evidence references resolve
```

### Architecture

```text
modules/bazi/traditional-pattern/**
MUST NOT import modules/interpretation/**
```

## 9. Golden Cases

推荐：

```text
tests/fixtures/traditional-pattern/
  classic/
  textbook/
  boundary/
  regression/
```

来源等级：

```text
A. 古籍明确案例
B. 有明确作者 / 版本的传统教材案例
C. synthetic boundary fixture
D. regression fixture
```

每个 fixture 必须记录来源、规则版本、schema 版本和 expected evidence；C 类不能冒充传统正确性证据。

## 10. Legacy Migration

当前 public authority：

```text
calculateBazi
→ Interpretation
→ personality-map/0.2.0
→ ArchetypeCandidate
→ Public Personality
```

迁移：

```text
A. TraditionalPatternResult independent
B. Shadow Compare
C. Translation Layer
D. Authority Cutover
E. Legacy retirement
```

Shadow Compare 不得用用户反馈反向修改传统规则。

只有 Authority Cutover + regression 全通过后，旧 candidate 才能退出 authority。

切换后禁止 silent fallback 到 legacy candidate 作为 Traditional verdict。

## 11. P0.5 — Public Personality Translation

只有 TraditionalPatternResult implementation Review + Freeze 后进入。

未来：

```text
TraditionalPatternResult
→ explicit Translation Layer
→ Public Personality
```

Public Personality 不得反向修改传统格局。

## 12. Personality Percentage Policy

继续禁止：

```text
candidate_score -> personality percentage
tenGodDistribution -> personality percentage
```

V1 只表达：主导 / 明显副倾向 / 辅助 / 混合 / 清晰 / 歧义。

## 13. Character P0

传统 authority cutover 后继续：

```text
10 Public Personality
→ 10 fixed official Characters
→ public/characters/v1/{ten_god}.webp
```

用户性别不改变 Character identity。

## 14. Final Product QA

最终仍需：

- traditional evidence 与 public translation 一致性；
- Character mapping；
- Share Card；
- mobile browser QA；
- 390 / 430 / 768 / 1440 viewport；
- full CI；
- PR #16 Ready；
- production smoke test。

## 15. Post-V1 / Deferred

仍 PARKED：

- Payment；
- AI Advisor / Chat；
- Supabase Live；
- Auth / Account；
- compatibility；
- referral；
- community；
- gamification；
- ranking / rarity；
- 流月 / 流日等进一步预测功能。

Rule Profile V1 Deferred 继续保持：

- auto true-solar-time authority；
- exact commander-day table authority；
- 假从 final；
- 从儿 / 从势 / 专旺 final；
- 完整化气；
- 外格 / 奇格全集；
- 神煞 / 纳音格局；
- 独立调候 / 盲派 profile。

## 16. Project Operating Rule

```text
PRODUCT
→ ROADMAP
→ CURRENT_STATE
→ TASK
→ BUILD
→ REVIEW
→ FREEZE
→ CURRENT_STATE
```

当前顺序：

```text
Rule Profile = LOCKED
→ TraditionalPatternResult Spec = READY FOR REVIEW
→ Spec Review / Freeze = ACTIVE
→ Implementation = BLOCKED
```

## 17. Release Rule

> **不扩 Scope，不降质量，不自造命理。**

先冻结 Contract，再写 production code；不得边写边重新发明规则。
