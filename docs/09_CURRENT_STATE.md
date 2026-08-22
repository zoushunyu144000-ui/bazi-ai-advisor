# 09 — Current State

状态：**V1 Release Freeze — Traditional Rule Profile PROPOSED / Owner Approval Required**  
最后更新：2026-08-22

## 0. Source of Truth

优先级：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/09_CURRENT_STATE.md`
4. `docs/10_ROADMAP.md`
5. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

项目执行流程见：

`docs/21_AI_PROJECT_OPERATING_SYSTEM.md`

当前 Traditional Rule Profile 提案见：

`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`

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

## 4. Traditional Bazi Rule Audit — COMPLETE

2026-08-22 已完成正式 Traditional Bazi Rule Audit：

`docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`

审计 Commit：

`cb8d55f1cbe7e50046c3fa872a765b4beb07cbc2`

审计结论：

- 共审计 43 条重要规则 / 能力；
- `TRADITIONAL_CORE`：13；
- `SCHOOL_CHOICE`：9；
- `IMPLEMENTATION_DETAIL`：7；
- `EXPERIMENTAL`：14；
- 当前可直接保留或以 non-authority 工程统计保留：15 条；
- 审计时 `TraditionalPatternResult Readiness`：**NOT READY**。

Audit 本身没有修改 production logic。

## 5. 当前核心风险

当前 `personality-map/0.2.0` 的主人格候选排序使用现代工程化组合权重，包括：

```text
52% canonical Ten-God score
18% family score
22% personality dimension fit
8% strength fit
```

审计已确认：这属于 `EXPERIMENTAL`，不是传统命理标准。

因此：

- 不得继续把该 candidate ranking 包装为“传统八字算出来的准确人格”；
- 不得让它继续承担未来正式 `TraditionalPatternResult` authority；
- 不得把 `tenGodDistribution` 或 `candidate_score` 转成公网人格百分比；
- 15 dimensions 可作为现代行为解释辅助，但不得反向决定传统格局。

## 6. Traditional Pattern 当前缺口

当前完整、可用于专业报告的 `TraditionalPatternResult` 尚未 Production-ready。

仍缺 production implementation：

- 月令 Host Selection；
- 透干 evidence；
- 根气 evidence；
- 定性旺衰 context；
- 格局候选与主 / 副结构；
- 成格 / 败格 / 破格 / 救应；
- 兼格 / 混合格局；
- 从格 / 特殊格局；
- evidence / counter evidence；
- ambiguity；
- relation transformation state。

当前身强弱的 support ratio 与 0.58 / 0.42 阈值仍属于实验工程模型，不能直接承担传统旺衰 authority。

## 7. Traditional Bazi Rule Profile V1 — PROPOSED

本轮已完成 Rule Profile research / specification 提案：

`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`

提议版本：

```text
rule_profile_version = ziping-v1.0.0
status = PROPOSED
```

核心提案：

```text
子平月令格局法
《子平真诠》作为主要格局结构来源
《渊海子平》+《三命通会》作传统交叉参考

Year = exact LiChun
Month = exact Jie
Month Host = ordered hidden qi + exposure
Strength = 得令 / 得地 / 得势 / 制化的定性 evidence
Patterns = 八个 regular + 建禄 + 月劫 + proposed 阳刃
Formation = pattern-specific 成败 / damage / rescue
Mixed / no stable single pattern = first-class results
Follow = strict whitelist
Evidence / Counter Evidence / Ambiguity = first-class
```

Rule Profile **尚未 LOCKED**。

需要 Owner 明确批准：

1. OA-01：日界采用 local civil midnight `00:00`，还是子初 `23:00`；
2. OA-02：晚子时采用 night-Zi / Zi-zheng split profile；
3. OA-03：V1 默认 civil time，不自动真太阳时校正；
4. OA-04：月令 host 采用 hidden-qi hierarchy + exposure，不启用精确人元司令日表 authority；
5. OA-05：阳刃采用五阳有刃、五阴无真刃，并作为 special self-rooted host；
6. OA-06：旺衰采用定性 evidence profile，不恢复 numeric percentage / threshold；
7. OA-07：从格 final verdict 仅 strict 从财 / strict 从杀，其余 candidate / ambiguous / deferred。

Owner Approval 之前：

```text
TraditionalPatternResult Implementation = BLOCKED
```

## 8. 10 Public Personalities — LOCKED

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

10 个名字继续锁定，语义为：

> **传统十神 / 格局原型的现代人格翻译标签。**

它们不等于传统格局本身，也不允许通过自造评分反向决定传统格局。

## 9. Character System — LOCKED

正式 contract：

```text
10 Public Personality = 10 fixed official Character IPs
public/characters/v1/{ten_god}.webp
```

取消用户性别驱动的男女双角色映射。

当前正式 Character binary：**0 / 10**。

Style 继续 LOCKED：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

## 10. Public Experience 当前状态

已有：

- Homepage；
- Birth；
- Result Dossier；
- second personality；
- 15 dimensions；
- Share Card rendering；
- professional evidence section 基础 UI。

但 Result 的人格 authoritative source 仍需在 Rule Profile LOCK + TraditionalPatternResult 后调整。

## 11. 当前 Release Blockers

当前顺序：

1. **Owner review / approval of `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md` OA-01 ～ OA-07**；
2. 将 `ziping-v1.0.0` Rule Profile 正式 LOCK；
3. 建立 `TraditionalPatternResult + Evidence + Counter Evidence + Ambiguity`；
4. 将 Public Personality 改为传统结果的 translation layer；
5. 降级 / 隔离 legacy engineering personality authority；
6. Refactor legacy gender-based Character routing；
7. 10 / 10 Character Masters；
8. Result / Share integration QA；
9. mobile browser QA；
10. full CI；
11. PR #16 Ready；
12. merge main；
13. Vercel Production；
14. final public smoke test。

已完成 Gate：

- ✅ Traditional Bazi Rule Audit；
- ✅ Rule Profile Research / Specification；
- ⏳ Rule Profile Owner Approval / Freeze。

## 12. 当前不做

仍不作为首发 blocker：

- Payment；
- AI Advisor；
- AI Chat；
- Supabase Live；
- Auth / Account；
- compatibility；
- referral；
- ranking / rarity；
- community / gamification；
- 流月 / 流日等进一步预测功能。

同时在 Rule Profile Freeze 前明确禁止：

- 实现 `TraditionalPatternResult`；
- 修改 Bazi production algorithm；
- 修改 Personality authoritative mapping。

## 13. Project Operating Rule

所有 Agent 强制执行：

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

完整规则：`docs/21_AI_PROJECT_OPERATING_SYSTEM.md`。

## 14. Product integrity rule

V1 可以年轻、好笑、传播性强，但不能通过自造命理算法换取“看起来很准”。

当前发布标准：

> **命理判断来源讲得清楚，现代人格翻译讲得好看。**
