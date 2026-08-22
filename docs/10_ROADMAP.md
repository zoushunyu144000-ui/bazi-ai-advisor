# 10 — Roadmap

状态：**V1 Release Freeze — Rule Profile PROPOSED / Owner Approval Gate**  
最后更新：2026-08-22

## 0. Roadmap boundary

Source of Truth：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/09_CURRENT_STATE.md`
4. `docs/10_ROADMAP.md`
5. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

项目执行流程见 `docs/21_AI_PROJECT_OPERATING_SYSTEM.md`。

当前 Traditional Rule Profile 提案：

`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`

本文件只描述接下来做什么。

## 1. V1 objective

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
3. **Owner Approval + Rule Profile Freeze — NEXT / ACTIVE**
4. `TraditionalPatternResult + Evidence + Counter Evidence + Ambiguity` — BLOCKED UNTIL #3
5. 重构 Public Personality authoritative mapping
6. 降级 / 隔离现有 engineering personality ranking
7. 移除伪精确 Personality Mix 百分比要求
8. Refactor legacy gender-based Character routing
9. 10 / 10 formal Character Masters
10. Result / Share Card translation integration
11. mobile browser QA
12. full CI
13. PR #16 Ready
14. merge main
15. Vercel Production
16. final public smoke test

## 3. P0.1 — Traditional Bazi Rule Audit

状态：**COMPLETE**。

结果：`docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`

- 审计 43 条重要规则 / 能力；
- `TRADITIONAL_CORE`：13；
- `SCHOOL_CHOICE`：9；
- `IMPLEMENTATION_DETAIL`：7；
- `EXPERIMENTAL`：14；
- 可直接保留或 non-authority 保留：15；
- 审计时 `TraditionalPatternResult Readiness`：**NOT READY**；
- production logic 未修改。

核心结论：`personality-map/0.2.0` 的 52 / 18 / 22 / 8 candidate ranking 属于实验工程逻辑，不得承担正式传统格局或公网主人格的最终判断权。

## 4. P0.2 — Traditional Bazi Rule Profile V1

### Research / Specification Status

```text
COMPLETE
```

提案文档：

`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`

提议版本：

```text
ziping-v1.0.0
```

核心提案：

### Traditional Reference

```text
子平月令格局法为主体
《子平真诠》= 格局结构主来源
《渊海子平》+《三命通会》= 传统交叉参考
```

### Calendar

```text
Year = exact LiChun
Month = exact Jie
Timezone / DST = historical IANA facts
Day = proposed local civil midnight 00:00
Late Zi = proposed night-Zi / Zi-zheng split profile
True Solar Time = proposed OFF by default
```

### Month Command / Host Selection

```text
month branch
→ ordered hidden qi: main / middle / residual
→ exposed month qi
→ main > middle > residual
→ if none exposed, main-qi unexposed fallback
→ self-rooted routing
→ unresolved transformation => ambiguity
```

明确不采用：

```text
month branch × 1.5
Ten-God max
candidate score
exact day-count 人元司令 table as V1 authority
```

### Strength

```text
得令
+ 得地 / 根
+ 得势 / 得助
+ 生克制化
→ qualitative strength context
```

不使用人格式百分比或新的隐藏 numeric threshold。

### Pattern Scope

```text
8 regular patterns
+ 建禄
+ 月劫
+ proposed 五阳阳刃
```

### Formation / Mixed / Follow

```text
pattern-specific support / damage / rescue
mixed / no stable single pattern allowed
strict 从财 / strict 从杀 proposed as only final follow verdicts
other follow / special structures conservative candidate / deferred
```

### Evidence

```text
evidence[]
counter_evidence[]
ambiguities[]
```

均为 first-class contract requirements。

## 5. P0.2 Freeze Gate — ACTIVE

Rule Profile 当前状态：

```text
PROPOSED — OWNER APPROVAL REQUIRED
```

Owner 必须明确裁决：

1. **OA-01 Day Boundary**：推荐 `00:00` local civil midnight；备选 `23:00` 子初；
2. **OA-02 Late Zi**：推荐 night-Zi / Zi-zheng split profile，并接受历史结果兼容影响；
3. **OA-03 True Solar Time**：推荐 V1 civil time default，不自动校正；
4. **OA-04 Month Host**：推荐 hidden-qi hierarchy + exposure，不启用精确人元司令日表 authority；
5. **OA-05 Yangren**：推荐五阳有刃 / 五阴无真刃，作为 special self-rooted host；
6. **OA-06 Strength**：推荐 qualitative evidence profile，不采用 percentage / thresholds；
7. **OA-07 Follow Structures**：推荐仅 strict 从财 / strict 从杀可 final，其他 candidate / ambiguous / deferred。

Owner Approval 后必须：

```text
Decision Log → Approved / Locked
Current State → Rule Profile LOCKED
Roadmap → TraditionalPatternResult Implementation ACTIVE
```

未经该 Gate：

```text
DO NOT BUILD TraditionalPatternResult
```

## 6. P0.3 — TraditionalPatternResult

状态：**BLOCKED — Rule Profile not LOCKED**。

只有 P0.2 Owner Approval + Freeze 后才开始。

目标至少包含：

```text
pattern_status
primary_pattern
secondary_patterns[]
formation_state
follow_structure
strength_context
key_combinations[]
evidence[]
counter_evidence[]
rule_profile_version
ambiguities[]
```

必须能表达：

- clear formation；
- formed but impure；
- failed / broken / rescued；
- primary + secondary；
- mixed；
- no stable single pattern；
- strict follow；
- special candidate / deferred；
- school disagreement；
- evidence insufficiency。

Implementation 前至少需要补齐 production facts：

- month host / exposure / roots；
- qualitative strength context；
- 三合 / 三会 existence；
- 刑 / 破 existence；
- relation transformation state；
- formation support / damage / rescue rules。

## 7. P0.4 — Public Personality Translation

完成 TraditionalPatternResult 后，建立翻译规则，而不是再造一套命理算法。

例如：

```text
传统伤官结构
+ 财星明显 / 伤官生财
↓
主 Public Personality：天生反骨
明显副倾向：搞钱圣体
```

要求：

- 标签可回溯到 evidence；
- Public Personality 不覆盖传统格局；
- 不为了 10 类均衡而调结果；
- 混合结构允许混合表达；
- 15 dimensions 只用于现代行为解释，不能反向决定传统格局。

## 8. Personality percentage policy

当前禁止把 `candidate_score` 或 `tenGodDistribution` 直接转成 Public Personality 百分比。

V1 可表达：主导 / 明显 / 辅助 / 弱 / 结构混合度。

未来恢复百分比必须经过传统依据、规则版本化、命例验证与审核。

## 9. Character P0

传统判断链完成后继续：

```text
10 Public Personality
→ 10 fixed official Characters
→ public/characters/v1/{ten_god}.webp
```

用户性别不决定 Character。

## 10. QA Gate

TraditionalPatternResult future implementation 至少覆盖：

- exact LiChun / Jie boundary；
- late-Zi profile；
- 8 个 regular host 的 main / middle / residual / unexposed cases；
- 建禄 / 月劫 / 阳刃；
- formed / impure / broken / rescued / ambiguous；
- 正官佩印 != 印绶用官；
- 杀用印 != 印绶逢杀；
- 财逢食生 != 食神生财；
- primary + secondary；
- 官杀混杂；
- no stable single pattern；
- strict follow / follow failed；
- unknown birth time；
- same input repeatability；
- traditional evidence 与 public translation 一致性。

最终产品 QA 仍覆盖：

- Character mapping；
- Share Card；
- 390 / 430 / 768 / 1440 viewport；
- full CI。

## 11. Post-V1

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

Rule Profile V1 同时 deferred：

- 真太阳时 authority profile；
- 精确人元司令日数表 authority；
- 假从 final；
- 从儿 / 从势 / 专旺 final；
- 化气 final；
- 完整外格 / 杂格全集；
- 纳音 / 神煞格局；
- 独立调候 / 盲派 rule profiles。

## 12. Project Operating Rule

每轮必须执行：

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

当前唯一 P0 Task：

> **Owner Review / Approval of Traditional Bazi Rule Profile V1。**

不是 `TraditionalPatternResult` Build。

## 13. Release rule

> **不扩 Scope，不降质量，不自造命理。**

先把 Rule Profile 真正冻结，再实现传统判断链。
