# 09 — Current State

状态：**V1 Release Freeze — Traditional Rule Audit Required Before Personality Finalization**  
最后更新：2026-08-22

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
