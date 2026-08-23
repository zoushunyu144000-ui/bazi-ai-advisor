# 09 — Current State

状态：**V1 Release Freeze — TraditionalPatternResult Implementation ACTIVE / Phase 2A Month Host COMPLETE IN DRAFT PR #19**
最后更新：2026-08-23

## 0. Source of Truth

优先级：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`
4. `docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`
5. `docs/09_CURRENT_STATE.md`
6. `docs/10_ROADMAP.md`
7. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

项目执行流程：`docs/21_AI_PROJECT_OPERATING_SYSTEM.md`。

本文件只记录当前真实状态。

## 1. 当前产品方向

产品正式定义为：

**传统八字判断 + 现代人格翻译 + 10 固定官方 IP + 免费完整 Dossier + 分享传播 + 后续专业付费报告。**

最高原则：

> **传统命理负责判断，现代产品负责翻译。**

## 2. Repository / PR

- Release Branch：`release/v1-personality-rc`
- Release Draft PR：`#16 release: V1 public personality experience`
- Traditional Implementation Branch：`feature/traditional-pattern-result-v1`
- Traditional Draft PR：`#19 feat: establish ziping TraditionalPatternResult foundation`
- PR #19 scope：Phase 1 foundation + Phase 2 structural evidence implementation
- Production：`bazi-ai-advisor.vercel.app`

PR #16 与 PR #19 均继续保持 Draft。TraditionalPatternResult 在 PR #19 中开发与 Review；公网 authority 在 Authority Cutover 前仍保持 legacy，不得提前切换。

## 3. Traditional Bazi Rule Audit — DONE

Source：`docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`。

核心结论继续有效：

```text
legacy support_ratio
0.58 / 0.42
month × 1.5
hidden-stem numeric scoring
52 / 18 / 22 / 8 candidate ranking
```

均不得承担正式 Traditional Pattern authority。

## 4. Traditional Bazi Rule Profile V1 — LOCKED

```text
rule_profile_version = ziping-v1.0.0
status = LOCKED / ACTIVE
```

Source：`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`。

OA-01 ～ OA-07 已冻结：

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

YANGREN = FIVE_YANG_STEMS_ONLY
DAY_MASTER_STRENGTH = QUALITATIVE_EVIDENCE_PROFILE
FOLLOW FINAL = STRICT_FOLLOW_WEALTH + STRICT_FOLLOW_KILLING
```

## 5. TraditionalPatternResult Spec V1 — LOCKED

Source：

`docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`

正式版本：

```text
pattern_schema_version = traditional-pattern-result/1.0.0
status = LOCKED / ACTIVE
```

Owner 已批准 TP-01 ～ TP-07，并完成四项 Required Revisions。

### TP-01 ～ TP-07

```text
TP-01 APPROVED
Bazi Traditional Layer owns TraditionalPatternResult.

TP-02 APPROVED
Legacy BaziDerivedFeatures excluded from Traditional Pattern authority input.

TP-03 APPROVED
pattern_schema_version = traditional-pattern-result/1.0.0

TP-04 APPROVED
No UNKNOWN / NONE TraditionalPattern sentinel.
Use primaryPattern = null + Pattern Status.

TP-05 APPROVED
Evidence sufficiency categorical only.

TP-06 APPROVED
Approximate birth time does not invent arbitrary ±minute range.

TP-07 APPROVED WITH CONDITION
Independent result allowed only in Phase A/B shadow migration;
before Authority Cutover it must enter the canonical Bazi/traditional-result boundary.
```

### Four Required Revisions

```text
1. baseMonthHost: TraditionalBaseMonthHost | null
   null requires material/blocking ambiguity.

2. primaryFormationState: TraditionalFormationState | null
   primaryPattern != null => state != null
   primaryPattern == null => state == null

3. computedAt = non-semantic audit metadata
   excluded from deterministic ID / canonical hash / canonical equality.

4. Legacy BaziDerivedFeatures authority semantics superseded / clarified.
```

## 6. Legacy BaziDerivedFeatures Governance Clarification

Bazi Engine 继续是 deterministic Bazi facts 的 canonical owner。

但当前 legacy：

```text
dayMasterStrength
elementDistribution
tenGodDistribution
support-ratio-derived semantics
confidence
```

只可继续作为：

```text
compatibility
analytics
Interpretation support
```

它们不是：

```text
TraditionalPatternResult authority input
ziping-v1.0.0 qualitative strength authority
Month Host authority
formation / follow authority
```

Decision Log D-021 已明确 supersede D-010 中对应 authority 语义，同时保留 D-010 的 Bazi Engine ownership / Interpretation anti-duplication 原则。

`types/domain/bazi.ts` 只更新了注释说明；legacy fields / type shape 未删除、未改运行逻辑。

## 7. Current Production Reality / Fail-Closed Prerequisite

当前 production 仍是：

```text
Birth
→ calculateBazi (civil-local-jieqi-v1)
→ BaziDerivedFeatures
→ Interpretation
→ personality-map/0.2.0
→ ArchetypeCandidate
→ Public Personality
```

`TraditionalPatternResult` production implementation 已在 Draft PR #19 开始，但尚未合并到 release / main，也尚未完成 Authority Cutover。

PR #19 当前已完成并通过本地 Review 的 implementation slice：

```text
Phase 1 shared contract + profile guard
→ versioned calculateBaziZipingV1 path
→ frozen late-Zi semantics
→ exact LiChun / Jie compatibility
→ Month Host / exposure evaluator
→ exact Jianlu mappings
→ five-yang Yangren mappings
→ month-command JieCai Yuejie host
→ peer-exposure anti-promotion / fail-closed ambiguity
```

公网运行链仍未消费 TraditionalPatternResult。

当前最重要的 prerequisite：

```text
production calculation profile = civil-local-jieqi-v1
required Traditional Pattern profile = ziping-v1.0.0
```

并且当前 23:00–23:59 hour stem 仍按 same civil-day day stem 起时，不符合 frozen night-Zi split semantics。

因此：

```text
Production Build = ALLOWED
TraditionalPatternResult authority on legacy profile = FAIL CLOSED / BLOCKED
```

Build 必须先建立 versioned `ziping-v1.0.0` calculation path，包括 frozen late-Zi hour-stem behavior；不得 silent reinterpret legacy chart。

## 8. Current Implementation Gaps

PR #19 implementation status：

```text
✅ shared TraditionalPatternResult contract
✅ profile guard
✅ versioned ziping-v1.0.0 calculation path
✅ frozen night-Zi semantics
✅ exact LiChun / Jie compatibility
✅ Month Host / exposure evaluator
✅ exact Jianlu / month-command Yuejie / five-yang Yangren host rules
✅ structured Month Host evidence + peer fail-closed ambiguity

NEXT:
1. boundary ambiguity generation for unknown / approximate / near-boundary cases
2. root evaluator
3. qualitative strength evaluator
4. 三合 / 三会 / 刑 / 破 existence facts
5. transformation state
6. 8 regular + Jianlu / Yuejie / Yangren PatternCandidate assembly
7. pattern-specific formation / damage / rescue
8. Mixed / No Stable / strict Follow
9. complete Evidence / Counter Evidence / Ambiguity integration
10. canonical semantic determinism
11. Golden / boundary / regression fixtures
```

Month Host safety invariant implemented in this slice：

```text
BiJian selected outside approved Jianlu / Yangren mapping
!= silently coerce to Yuejie
=> baseMonthHost = null
+ blocking insufficient_evidence ambiguity
```

This is a fail-closed implementation of the locked taxonomy, not a new Traditional Pattern type。

## 9. Current P0 — TraditionalPatternResult Implementation

当前唯一 P0：

> **严格按 `docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md` 开始 TraditionalPatternResult Production Implementation。**

实施顺序与当前进度：

```text
Phase 1 Contract + profile guard = COMPLETE IN PR #19
Phase 2 ziping calculation path + structural evidence = ACTIVE
  calendar prerequisite = COMPLETE
  Month Host / exposure = COMPLETE
  next = boundary ambiguity + roots
Phase 3 pattern candidates = PENDING
Phase 4 pattern-specific formation = PENDING
Phase 5 mixed + strict follow = PENDING
Phase 6 result assembly + shadow = PENDING
Phase 7 QA / golden review = PENDING
```

Phase A/B 可以 independent shadow result；Authority Cutover 前必须完成 canonical Bazi / traditional-result boundary integration。

## 10. Legacy Personality Authority Risk

当前 `personality-map/0.2.0`：

```text
52% Ten-God score
18% family score
22% dimensions
8% strength fit
```

仍属于 `EXPERIMENTAL`。

迁移路径继续锁定：

```text
A. Independent TraditionalPatternResult
B. Shadow Compare
C. Translation Layer + canonical boundary integration
D. Authority Cutover
E. Legacy retirement
```

Shadow Compare 不得用用户“更像不像”反向修改传统规则。

Authority Cutover 前不删除 legacy；Cutover 后不得 silent fallback 到 legacy candidate 作为 Traditional verdict。

## 11. 10 Public Personalities — LOCKED

| key | Public Personality |
| --- | --- |
| `bi_jian` | 犟种 |
| `jie_cai` | 撒币 |
| `shi_shen` | 享乐主义 |
| `shang_guan` | 天生反骨 |
| `zheng_cai` | 抠抠搜搜 |
| `pian_cai` | 搞钱圣体 |
| `zheng_guan` | 老干部 |
| `qi_sha` | 狠人 |
| `zheng_yin` | 活菩萨 |
| `pian_yin` | 道长 |

它们属于 Translation Layer，不等于 Traditional Pattern enum。

## 12. Character System — LOCKED

```text
10 Public Personality = 10 fixed official Character IPs
public/characters/v1/{ten_god}.webp
```

用户性别不改变 Character identity。

Style Source of Truth：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

## 13. Current Release Blockers

当前顺序：

1. ✅ Traditional Bazi Rule Audit
2. ✅ Rule Profile Research / Owner Approval / Freeze
3. ✅ TraditionalPatternResult Spec Review / Revision / Freeze
4. **TraditionalPatternResult Production Implementation + Golden QA — NEXT / ACTIVE**
5. Public Personality authoritative Translation Layer
6. canonical boundary + authority cutover
7. isolate / retire legacy engineering authority
8. Character asset / routing completion
9. Result / Share integration QA
10. mobile browser QA
11. full CI
12. PR #16 Ready
13. merge main
14. Vercel Production
15. final public smoke test

## 14. Current Out of Scope

仍 PARKED：

- Payment；
- AI Advisor / Chat；
- Supabase Live；
- Auth / Account；
- compatibility；
- referral；
- ranking / rarity；
- community / gamification；
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

当前阶段：

```text
Rule Audit = DONE
→ Rule Profile = LOCKED
→ TraditionalPatternResult Spec = LOCKED
→ Production Implementation = NEXT / ALLOWED
```

## 16. Product Integrity Rule

> **命理判断来源讲得清楚，现代人格翻译讲得好看。**

不扩 Scope，不降质量，不自造命理，不使用 legacy numeric model 填补传统规则空白。
