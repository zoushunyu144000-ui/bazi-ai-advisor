# 10 — Roadmap

状态：**V1 Release Freeze — Traditional Bazi Authenticity Gate First**  
最后更新：2026-08-22

## 0. Roadmap boundary

Source of Truth：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/09_CURRENT_STATE.md`
4. `docs/10_ROADMAP.md`
5. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

本文件只描述接下来做什么。

## 1. V1 objective

V1 最终链路：

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

## 2. 新 P0 顺序

当前严格按以下顺序执行：

1. **Traditional Bazi Rule Audit**
2. 锁定 rule profile / school choices
3. 建立 `TraditionalPatternResult + Evidence + Ambiguity`
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

状态：**NEXT / HIGHEST BLOCKER**。

逐条审计：

### Calendar / Chart facts

- 年界；
- 月界；
- 日柱；
- 时柱；
- 节气；
- 真太阳时选择；
- 晚子时规则。

### Structural facts

- 十神映射；
- 藏干；
- 月令；
- 根气；
- 旺衰；
- 合冲刑害。

### Pattern judgment

- 月令取格；
- 透干取用；
- 格局候选；
- 成格；
- 败格；
- 破格；
- 救应；
- 兼格；
- 从格 / 假从；
- 不成单一格；
- 特殊格局。

### Existing numeric rules

重点检查当前：

- 藏干权重；
- 月支额外权重；
- 身强弱阈值；
- `tenGodDistribution` 语义；
- `personality-map/0.2.0` candidate weights；
- 15 dimensions 对主人格的影响。

每条规则归类：

```text
TRADITIONAL_CORE
SCHOOL_CHOICE
IMPLEMENTATION_DETAIL
EXPERIMENTAL
```

任何 `EXPERIMENTAL` 规则不得决定正式传统格局。

## 4. P0.2 — Rule Profile / School Lock

传统命理本身存在流派差异，所以不能假装只有一个“天然算法”。

必须明确：

- 本产品采用哪套核心取格逻辑；
- 哪些问题存在不同传统意见；
- 本产品在哪些分歧处选择哪一套；
- 哪些情况返回 ambiguity，而不是强判。

规则必须版本化。

## 5. P0.3 — TraditionalPatternResult

目标 contract 至少包含：

```text
pattern_status
primary_pattern
secondary_patterns[]
formation_state
follow_structure
strength_context
key_combinations[]
evidence[]
rule_profile_version
ambiguities[]
confidence_or_evidence_strength
```

具体字段由审计后定稿，但必须能够表达：

- 成格；
- 不纯；
- 兼格；
- 破格 / 救应；
- 从格；
- 不成格；
- 流派分歧。

## 6. P0.4 — Public Personality Translation

完成 TraditionalPatternResult 后，建立**翻译规则**，不是新算法。

例如：

```text
传统伤官结构
+ 财星明显 / 伤官生财
↓
主 Public Personality：天生反骨
明显副倾向：搞钱圣体
```

要求：

- 每个标签可回溯到 evidence；
- Public Personality 不覆盖传统格局；
- 不为了 10 类均衡而调结果；
- 混合结构允许混合表达。

## 7. Personality percentage policy

当前暂停实现精确 Public Personality 百分比。

禁止：

```text
candidate_score → normalize to 100% → call it personality percentage
```

也禁止：

```text
tenGodDistribution → directly call it Public Personality percentage
```

V1 可使用：

- 主导；
- 明显；
- 辅助；
- 弱；
- 结构混合 / 清晰。

未来若恢复百分比，必须经过传统依据与命例验证 Gate。

## 8. Character P0

传统判断链完成后继续：

```text
10 Public Personality
→ 10 fixed official Characters
→ public/characters/v1/{ten_god}.webp
```

现有 5 男 + 5 女的 canonical cast 不变。

用户性别不决定 Character。

### 8.1 Mobile UI Pilot（已完成，外部审查 APPROVE，待 Owner 批准合并）

2026-08-22 在 `design/mobile-ui-pilot-v1` 分支完成一轮 Mobile Editorial UI Pilot：

- 只覆盖 `/`、`/birth`、`/result` 三个页面；viewport 基准 390×844 / 430×932。
- Character 使用 `character-slot.tsx` 预留位方案，正式资产到位后无需改代码即可替换。
- 验收截图在 `docs/ui-pilot/`，typecheck / lint / tests / build 全部通过。
- 外部审查两轮：首轮 REQUEST CHANGES（辅助层伪造），修复于 `9dcd42e`；
  复核于 HEAD `b92d5b3` 给出 **APPROVE**。详见 docs/09_CURRENT_STATE.md §8.2–8.3。

当前状态（等 Product Owner 指令）：

1. **待办：Owner 批准后把 pilot 合并回 `release/v1-personality-rc`**（不直接进 Production）；
2. 正式 Character 资产到位后，做一轮编辑排版增强（人物越界、重叠、大裁切、文字穿插），
   同时保持「不宣布 Design Freeze」—— 那是资产到位后的下一轮 Pilot；
3. 本轮不扩展其他页面（report / advisor / account 等）。

## 9. QA Gate

最终必须覆盖：

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

## 11. Release rule

> **不扩 Scope，不降质量，不自造命理。**

先保证传统判断链可信，再把现代人格体验做漂亮。
