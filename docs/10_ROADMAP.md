# 10 — Roadmap

状态：**TraditionalPatternResult ACTIVE + Presentation V2 COMPLETE / RELEASE QA PENDING**
最后更新：2026-08-26

## 0. Roadmap Boundary

Source of Truth：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`
4. `docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`
5. `docs/24_CHARACTER_STYLE_LOCK_V2.md`
6. `docs/09_CURRENT_STATE.md`
7. `docs/10_ROADMAP.md`
8. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

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
5. ✅ TraditionalPatternResult Spec + Implementation Plan — COMPLETE
6. ✅ TP-01 ～ TP-07 Review / Required Revisions / Spec Freeze — COMPLETE
7. **TraditionalPatternResult Production Implementation + Golden QA — NEXT / ACTIVE**
8. Public Personality authoritative Translation Layer
9. canonical Bazi / traditional-result boundary + Authority Cutover
10. isolate / retire legacy engineering personality authority
11. ✅ Character V2 routing / 10 formal canonical assets — COMPLETE
12. ✅ City Observation Editorial UI / Result / Share Card integration — COMPLETE ON `feature/ip-system-v2`
13. ✅ mobile / preview browser QA — COMPLETE ON DRAFT PR #20
14. **manual share-card download confirmation + PR Review — NEXT FOR PRESENTATION**
15. ✅ full CI — PASS ON DRAFT PR #20
16. PR #16 Ready
17. merge main
18. Vercel Production
19. final public smoke test

## 3. P0.1 — Traditional Bazi Rule Audit

状态：**COMPLETE**。

Source：`docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`。

核心结论：

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

冻结：

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

Rule Profile 不再在 implementation 中重新讨论。

## 5. P0.3 — TraditionalPatternResult Spec V1

状态：**APPROVED / LOCKED / ACTIVE**。

Source：`docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`。

正式版本：

```text
pattern_schema_version = traditional-pattern-result/1.0.0
```

### TP-01 ～ TP-07

```text
TP-01 APPROVED
Bazi Traditional Layer owns result.

TP-02 APPROVED
Legacy BaziDerivedFeatures excluded from authority input.

TP-03 APPROVED
traditional-pattern-result/1.0.0

TP-04 APPROVED
No UNKNOWN/NONE Pattern sentinel.

TP-05 APPROVED
Categorical evidence sufficiency only.

TP-06 APPROVED
No invented approximate-time ±minute window.

TP-07 APPROVED WITH CONDITION
Independent result is Phase A/B shadow-only;
before Authority Cutover it must enter canonical Bazi/traditional-result boundary.
```

### Required Contract Revisions — COMPLETE

```text
baseMonthHost: TraditionalBaseMonthHost | null
primaryFormationState: TraditionalFormationState | null
computedAt: non-semantic audit metadata
legacy BaziDerivedFeatures authority semantics superseded / clarified
```

## 6. P0.4 — TraditionalPatternResult Production Implementation

状态：**NEXT / ACTIVE / ALLOWED**。

重要区分：

```text
Production Build = ALLOWED
TraditionalPatternResult authority on legacy civil-local-jieqi-v1 = BLOCKED / FAIL CLOSED
```

当前 production `calculateBazi` 仍是：

```text
civil-local-jieqi-v1
```

而 TraditionalPatternResult 必须消费：

```text
ziping-v1.0.0
```

因此 Build 的第一优先级不是直接判格，而是建立 versioned ziping calculation path 与 profile guard。

### Phase 1 — Contract + Profile Guard

状态：**COMPLETE IN DRAFT PR #19**。

- ✅ `types/domain/traditional-pattern.ts`
- ✅ shared enums / result types
- ✅ `pattern_schema_version`
- ✅ `modules/bazi/traditional-pattern/**` skeleton
- ✅ `assertZipingRuleProfile()`
- ✅ architecture test：no Interpretation imports
- ✅ no public cutover

### Phase 2 — Ziping Calculation Path + Structural Evidence

状态：**ACTIVE**。

- ✅ versioned `ziping-v1.0.0` calculation path
- ✅ frozen night-Zi hour-stem behavior
- ✅ exact LiChun / Jie
- ✅ historical IANA / DST primitive reuse
- **NEXT：boundary ambiguity generation**
- ✅ Month Host / exposure
- ✅ exact Jianlu / month-command Yuejie / five-yang Yangren Host rules
- ✅ Month Host structured evidence + fail-closed unsupported peer ambiguity
- ⏳ root evaluator
- ⏳ qualitative strength
- ⏳ 三合 / 三会 / 刑 / 破
- ⏳ transformation state
- ⏳ broader Evidence generation

Phase 2 完成前：

```text
legacy chart -> RULE_PROFILE_MISMATCH
```

不得 silent reinterpret。

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

### Phase 5 — Mixed + Strict Follow

```text
primary_with_secondary
mixed
no_stable_single_pattern
strict follow_wealth
strict follow_killing
```

其他 follow 不得 final。

### Phase 6 — Result Assembly + Shadow

- complete `TraditionalPatternResult`
- nullable Host invariant
- nullable primary formation invariant
- deterministic IDs
- canonical semantic serializer excludes `computedAt`
- evidence integrity
- shadow compare only
- no Public Personality cutover

### Phase 7 — QA / Golden Review

- unit tests
- golden cases
- boundary cases
- canonical determinism
- rule review
- debug trace review
- shadow compare

## 7. Implementation Test Gate

### Calendar

```text
LiChun -1s / exact / +1s
Jie -1s / exact / +1s
22:59 / 23:00 / 23:59 / 00:00 / 00:59 / 01:00
DST gap / overlap
unknown / approximate time
```

### Contract Invariants

```text
baseMonthHost == null
=> material/blocking ambiguity explains it

primaryPattern != null
=> primaryFormationState != null

primaryPattern == null
=> primaryFormationState == null

broken => damage evidence
broken_rescued => damage + rescue evidence
confirmed follow => only wealth / killing
ambiguous => material/blocking ambiguity
all ruleIds / evidence refs resolve
```

### Determinism

```text
same semantic input
+ same engine version
+ same rule profile
+ same schema version
=
same canonical semantic TraditionalPatternResult
```

`computedAt` 不进入 canonical hash / equality / deterministic ID。

### Architecture

```text
modules/bazi/traditional-pattern/**
MUST NOT import modules/interpretation/**
```

## 8. Golden Cases

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

每个 fixture 必须记录来源、`ziping-v1.0.0`、`traditional-pattern-result/1.0.0` 和 expected evidence。

## 9. Legacy Migration

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
A. Independent TraditionalPatternResult
B. Shadow Compare
C. Translation Layer + canonical boundary integration
D. Authority Cutover
E. Legacy retirement
```

Phase A/B independent result 只是迁移策略，不是永久架构。

Authority Cutover 前必须形成 one canonical Bazi / Traditional Result boundary。

Shadow Compare 不得用用户反馈反向修改传统规则。

Cutover 后禁止 silent fallback 到 legacy candidate 作为 Traditional verdict。

## 10. P0.5 — Public Personality Translation

只有 TraditionalPatternResult implementation Review + Freeze 后进入。

未来：

```text
TraditionalPatternResult
→ explicit Translation Layer
→ Public Personality
```

Public Personality 不得反向修改传统格局。

## 11. Personality Percentage Policy

继续禁止：

```text
candidate_score -> personality percentage
tenGodDistribution -> personality percentage
```

V1 只表达：主导 / 明显副倾向 / 辅助 / 混合 / 清晰 / 歧义。

## 12. Character P0

传统 authority cutover 后继续：

```text
10 Public Personality
→ 10 fixed official Characters
→ public/characters/v2/{ten_god}.png
```

用户性别不改变 Character identity。

## 13. Final Product QA

最终仍需：

- traditional evidence 与 public translation 一致性；
- Character mapping；
- Share Card；
- mobile browser QA；
- 390 / 430 / 768 / 1440 viewport；
- full CI；
- PR #16 Ready；
- production smoke test。

## 14. Post-V1 / Deferred

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

## 15. Project Operating Rule

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
Rule Audit = DONE
→ Rule Profile = LOCKED
→ TraditionalPatternResult Spec = LOCKED
→ TraditionalPatternResult Implementation = ACTIVE
   Phase 1 = COMPLETE
   Phase 2 calendar + Month Host = COMPLETE
   next = boundary ambiguity generation
   then = roots
```

## 16. Release Rule

> **不扩 Scope，不降质量，不自造命理。**

Traditional 分支下一轮只实现 frozen Contract；Presentation V2 分支不得提前宣称 Authority Cutover，也不得伪造 Payment / AI / Auth live 状态。
