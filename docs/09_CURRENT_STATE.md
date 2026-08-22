# 09 — Current State

状态：**V1 Release Freeze — Traditional Rule Audit Required Before Personality Finalization**  
最后更新：2026-08-22（+ Mobile UI Design Pilot V1 on `design/mobile-ui-pilot-v1`）

## 0. Source of Truth

优先级：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/09_CURRENT_STATE.md`
4. `docs/10_ROADMAP.md`
5. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

本文件只记录当前事实。

## 1. 当前产品方向

产品正式定义为：

**传统八字判断 + 现代人格翻译 + 10 固定官方 IP + 免费完整 Dossier + 分享传播 + 后续专业付费报告。**

最高原则：

> **传统命理负责判断，现代产品负责翻译。**

## 2. Repository / PR

- Branch：`release/v1-personality-rc`
- Draft PR：`#16 release: V1 public personality experience`
- Base：`main`
- Production：`bazi-ai-advisor.vercel.app`

PR 继续保持 Draft，直到传统判断链、固定 10-IP、最终 QA 均完成。

## 3. 已完成的确定性基础

现有核心链：

```text
Birth
→ Bazi Engine
→ Interpretation
```

现有 Bazi Engine 已具备：

- 四柱计算；
- 节气边界；
- 十神映射；
- 藏干；
- 五行分布；
- 十神分布；
- 基础关系；
- 日主强弱 baseline；
- 大运基础结构。

这些代码具有 deterministic / reproducible 基础价值。

## 4. 当前发现的核心风险

当前 `personality-map/0.2.0` 的主人格候选排序使用现代工程化组合权重，包括：

```text
52% canonical Ten-God score
18% family score
22% personality dimension fit
8% strength fit
```

这属于产品/工程假设，不是传统命理标准。

因此当前状态正式标记为：

**PROVISIONAL / EXPERIMENTAL FOR PROFESSIONAL USE**。

不得把该 candidate ranking 继续包装为“传统八字算出来的准确人格”。

同时此前计划的 10 人格精确百分比暂停实现；不得直接把 `tenGodDistribution` 或 `candidate_score` 转成公网人格百分比。

## 5. Traditional Pattern 缺口

当前完整、可用于专业报告的 `TraditionalPatternResult` 尚未 Production-ready。

仍需明确处理：

- 月令取格；
- 透干 / 藏干 / 根气；
- 格局候选；
- 成格 / 败格 / 破格 / 救应；
- 从格 / 假从；
- 兼格 / 不成单一格；
- 流派规则选择；
- evidence / ambiguity。

这已经成为当前人格系统可信度的核心 blocker。

## 6. 10 Public Personalities — LOCKED

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

10 个名字继续锁定，但语义更新为：

> **传统十神 / 格局原型的现代人格翻译标签。**

它们不等于传统格局本身，也不允许通过自造评分反向决定传统格局。

## 7. Character System — LOCKED

正式 contract：

```text
10 Public Personality = 10 fixed official Character IPs
public/characters/v1/{ten_god}.webp
```

取消男女双角色映射。

当前正式 Character binary：**0 / 10**。

Style 继续 LOCKED：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

## 8. Public Experience 当前状态

已有：

- Homepage；
- Birth；
- Result Dossier；
- second personality；
- 15 dimensions；
- Share Card rendering；
- professional evidence section 基础 UI。

但 Result 的人格 authoritative source 仍需在 Traditional Rule Audit 后调整。

15 dimensions 可以保留为现代行为解释辅助，但不得反向决定传统格局。

### 8.1 Mobile UI Design Pilot V1（branch `design/mobile-ui-pilot-v1`）

2026-08-22 完成一轮 Mobile UI Pilot，只改 presentation，不动 Engine / Interpretation / Character contract：

- 分支：`design/mobile-ui-pilot-v1`（base `release/v1-personality-rc`），未合并。
- 覆盖页面：`/`、`/birth`、`/result`；viewport 基准 390×844 与 430×932。
- 视觉系统：冷白 / 中性灰底 + 墨黑主字 + 每个人格专属低饱和 accent（`lib/personality-accent.ts`）。
- Character 处理：`app/_components/character-slot.tsx` 运行时探测 `/characters/v1/{ten_god}.webp`；正式资产到位前显示清晰预留位，不伪造角色、不使用 CSS 人形 / silhouette fallback。
- Birth 改为 4 步 onboarding ritual：date → time → place → verify，时间用 tactile wheel（`time-wheel.tsx`）；「大运性别」保留为排盘数据字段，不再承担角色选择语义。
- Result 采用 editorial blocks：巨大人格名 hero、主导 / 明显副倾向 mix bar、A 面（dark block）/ 翻车面（accent block）、dimension chart、8 张 mode 卡、professional evidence fold、9 人格横向 carousel、share card preview。
- 动效全部受 `prefers-reduced-motion` 约束。
- 验收截图：`docs/ui-pilot/{home,birth,result}-{390,430}.png`（另有 `-full.png` 全页版本）。
- 校验状态：typecheck clean；lint 0 errors；4/4 test suites pass；`next build` 成功；390 与 430 视口均无水平 overflow。
- 已知限制：console 中的 `/characters/v1/*.webp` 404 属于预期资产 gate 行为；Share Card 在正式资产到位前会显式失败并给出提示文案（符合 character README 的 fail-visibly 要求）。

该分支是 Pilot，不是 Design Freeze。视觉方向等待 Product Owner 审核。

### 8.2 Pilot 外部审查结论与处置（2026-08-22）

外部远程审查（针对 `7e811cb`）结论：**REQUEST CHANGES**，唯一必须修复项为
「Result mix bar 的『辅助』直接复制主人格，属于伪造第三层结构」。

处置（commit `9dcd42e`）：

1. **辅助层伪造 → 已修复**。Engine 当前只产出 dominant + secondary 两层；
   自造第三层只能来自 `tenGodDistribution` 工程排序，违反 docs/18 §2 与
   docs/13 §4。现 mix bar 只渲染「主导 / 明显副倾向」两列，并在代码注释中
   说明第三层必须等 TraditionalPatternResult 落地后才允许出现。
2. **首页移动端 10 人格区接近纵向卡片目录 → 同 commit 一并修复**。移动端改为
   「前 2 张全宽 feature 卡 + 后 8 张横向 snap strip」，桌面端保留非对称 grid。

审查给出的视觉加分项（记录为下一轮候选，未经 Product Owner 批准不实施）：

- 正式 Character 到位后：人物越界、重叠、大裁切、文字穿插等更强编辑排版；
- 年轻东亚文化感的视觉表达可以比当前更大胆（目前主要由文案承担）。

状态：等待审查方在 `9dcd42e` 复核；复核通过后由 Product Owner 决定是否合并回
`release/v1-personality-rc`。

### 8.3 Pilot 复核结论（2026-08-22，最终）

外部审查在 HEAD `b92d5b3` 完成复核，结论：**APPROVE**。

- Result mix bar 两层修复 → PASS；
- 首页移动端 feature 卡 + 横向 strip 结构 → PASS（PARTIAL 升级）;
- 其余首轮 PASS 项全部维持。

审查方确认「`b92d5b3` 可进入后续合并流程」。

**合并决策待 Product Owner 批准**：批准后由 `design/mobile-ui-pilot-v1` 合入
`release/v1-personality-rc`；本分支不直接部署 Production。视觉方向仍不宣布
Design Freeze —— 正式 Character 资产到位后需再做一轮编辑排版增强（见 §8.2
下一轮候选清单）。

## 9. 当前最大 Release Blockers

当前 blocker 顺序已改变：

1. **Traditional Bazi Rule Audit**；
2. 锁定传统 rule profile / school choices；
3. 建立 `TraditionalPatternResult + Evidence`；
4. 将 Public Personality 改为传统结果的 translation layer；
5. 清理 legacy engineering personality authority；
6. legacy gender Character routing refactor；
7. 10 / 10 Character Masters；
8. Result / Share integration QA；
9. mobile / CI / production QA。

## 10. 当前不做

仍不作为首发 blocker：

- Payment；
- AI Advisor；
- AI Chat；
- Supabase Live；
- Auth / Account；
- compatibility；
- referral；
- ranking / rarity；
- community / gamification。

## 11. Product integrity rule

V1 可以年轻、好笑、传播性强，但不能通过自造命理算法换取“看起来很准”。

当前发布标准调整为：

> **命理判断来源讲得清楚，现代人格翻译讲得好看。**
