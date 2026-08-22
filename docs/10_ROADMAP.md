# 10 — Roadmap

状态：**V1 Release Freeze — Rule Profile Lock Active**  
最后更新：2026-08-22

## 0. Roadmap boundary

Source of Truth：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/09_CURRENT_STATE.md`
4. `docs/10_ROADMAP.md`
5. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

项目执行流程见 `docs/21_AI_PROJECT_OPERATING_SYSTEM.md`。

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
2. **Rule Profile / School Choice Lock — NEXT / ACTIVE**
3. 建立 `TraditionalPatternResult + Evidence + Counter Evidence + Ambiguity`
4. 重构 Public Personality authoritative mapping
5. 降级 / 隔离现有 engineering personality ranking
6. 移除伪精确 Personality Mix 百分比要求
7. Refactor legacy gender-based Character routing
8. 10 / 10 formal Character Masters
9. Result / Share Card translation integration
10. mobile browser QA
11. full CI
12. PR #16 Ready
13. merge main
14. Vercel Production
15. final public smoke test

## 3. P0.1 — Traditional Bazi Rule Audit

状态：**COMPLETE**。

结果：`docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`

- 审计 43 条重要规则 / 能力；
- `TRADITIONAL_CORE`：13；
- `SCHOOL_CHOICE`：9；
- `IMPLEMENTATION_DETAIL`：7；
- `EXPERIMENTAL`：14；
- 可直接保留或 non-authority 保留：15；
- `TraditionalPatternResult Readiness`：**NOT READY**；
- production logic 未修改；
- GitHub Actions `ci` run #259：**SUCCESS**。

核心结论：`personality-map/0.2.0` 的 52 / 18 / 22 / 8 candidate ranking 属于实验工程逻辑，不得承担正式传统格局或公网主人格的最终判断权。

## 4. P0.2 — Rule Profile / School Choice Lock

状态：**NEXT / HIGHEST BLOCKER**。

本轮目标不是开发完整格局引擎，而是先冻结本产品采用的传统规则体系。

必须明确：

### Calendar Profile

- 立春年界；
- 日界；
- 晚子时；
- 真太阳时；
- 未知时辰处理。

### Traditional Reference

- 子平主参考体系；
- 主来源与辅助来源；
- 传统来源冲突时的裁决原则。

### Month Command / Host Selection

- 月令取格；
- 透干 / 藏干优先级；
- 月令司权；
- 根气；
- 建禄 / 月劫；
- 阳刃定义与 V1 范围。

### Strength Profile

- 得令、得地、得势；
- 根、透、制化；
- 当前 support ratio 与 0.58 / 0.42 实验阈值如何退出正式判断链。

### Formation Profile

- 成格；
- 败格；
- 破格；
- 救应；
- 兼格；
- 混合格局；
- 不成单一格。

### Follow / Special Structures

- 从格；
- 假从；
- 特殊格局；
- 哪些 V1 暂不自动判定。

### Ambiguity Policy

- 流派分歧何时返回 ambiguity；
- 证据不足何时不强判；
- evidence strength / confidence 如何表达；
- Rule Profile 如何版本化。

### Authority Handoff

未来正式链路必须是：

```text
TraditionalPatternResult
→ Translation Layer
→ Public Personality
```

而不是由旧 candidate score 直接决定主人格。

本轮完成后必须 Review，并把正式 Rule Profile 写入 Contract / Decision Log 后 Freeze。

## 5. P0.3 — TraditionalPatternResult

只有 P0.2 Freeze 后才开始。

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
confidence_or_evidence_strength
```

必须能表达成格、不纯、兼格、破格 / 救应、从格、不成格、流派分歧与证据不足。

## 6. P0.4 — Public Personality Translation

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

## 7. Personality percentage policy

当前禁止把 `candidate_score` 或 `tenGodDistribution` 直接转成 Public Personality 百分比。

V1 可表达：主导 / 明显 / 辅助 / 弱 / 结构混合度。

未来恢复百分比必须经过传统依据、规则版本化、命例验证与审核。

## 8. Character P0

传统判断链完成后继续：

```text
10 Public Personality
→ 10 fixed official Characters
→ public/characters/v1/{ten_god}.webp
```

用户性别不决定 Character。

## 9. QA Gate

最终覆盖：

- 典型清格命例；
- 混合格局；
- 不成格；
- 从格候选；
- 未知出生时间；
- 同盘重复计算稳定性；
- traditional evidence 与 public translation 一致性；
- Character mapping；
- Share Card；
- 390 / 430 / 768 / 1440 viewport；
- full CI。

## 10. Post-V1

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

## 11. Project Operating Rule

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

当前唯一 P0 Task 是 Rule Profile / School Choice Lock。

## 12. Release rule

> **不扩 Scope，不降质量，不自造命理。**

先保证传统判断链可信，再把现代人格体验做漂亮。
