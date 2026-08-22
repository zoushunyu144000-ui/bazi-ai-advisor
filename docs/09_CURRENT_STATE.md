# 09 — Current State

状态：**V1 Release Freeze — Traditional Rule Profile LOCKED / TraditionalPatternResult Next**  
最后更新：2026-08-23

## 0. Source of Truth

优先级：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`
4. `docs/09_CURRENT_STATE.md`
5. `docs/10_ROADMAP.md`
6. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

项目执行流程见：

`docs/21_AI_PROJECT_OPERATING_SYSTEM.md`

本文件只记录当前真实状态。

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

PR 继续保持 Draft，直到传统判断链、固定 Character IP、最终 QA 均完成。

## 3. 已完成的确定性基础

现有核心链：

```text
Birth
→ Bazi Engine
→ Interpretation
```

现有 Bazi Engine 已具备：

- 四柱计算；
- 精确节气边界；
- 十神映射；
- 藏干；
- 五行 / 十神工程分布；
- 基础关系；
- legacy 日主强弱 baseline；
- 大运基础结构。

其中工程分布与 legacy strength 可以保留作历史 / analytics，但不得承担 `ziping-v1.0.0` Traditional Pattern authority。

## 4. Traditional Bazi Rule Audit — DONE

审计文档：

`docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`

审计结论：

- `TRADITIONAL_CORE`：13；
- `SCHOOL_CHOICE`：9；
- `IMPLEMENTATION_DETAIL`：7；
- `EXPERIMENTAL`：14；
- 审计时 `TraditionalPatternResult Readiness = NOT READY`；
- Audit 本身没有修改 production logic。

核心风险仍成立：

```text
personality-map/0.2.0
52% Ten-God
18% family
22% dimensions
8% strength
```

属于 `EXPERIMENTAL`，不得承担正式传统格局判定权。

## 5. Traditional Bazi Rule Profile V1 — LOCKED

2026-08-23 Owner 已批准 OA-01 ～ OA-07，正式冻结：

```text
rule_profile_version = ziping-v1.0.0
status = LOCKED
```

Source of Truth：

`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`

核心体系：

```text
子平月令格局法
《子平真诠》作为主要格局结构来源
《渊海子平》+《三命通会》作传统交叉参考
```

### Calendar Lock

```text
YEAR_BOUNDARY = EXACT_LICHUN_INSTANT
MONTH_BOUNDARY = EXACT_JIE_INSTANT
DAY_BOUNDARY = LOCAL_CIVIL_MIDNIGHT_00_00
LATE_ZI = NIGHT_ZI / ZI_ZHENG_SPLIT_PROFILE
TIME_STANDARD = HISTORICAL_IANA_CIVIL_TIME
TRUE_SOLAR_TIME = NOT_AUTO_APPLIED_IN_V1
```

Near-boundary cases 必须保留 ambiguity。

### Month Host Lock

```text
month branch
→ ordered hidden qi (main > middle > residual)
→ exposure
→ base Pattern Host
```

重要限制：该 hierarchy 只选择 **base Host**。最终 pattern verdict 仍需继续检查 exposure context、combination / transformation、formation、damage / rescue、root / strength、mixed / follow structure。

明确禁止：

```text
month numeric multiplier authority
exact commander-day table authority
Ten-God max authority
candidate score authority
```

### Strength Lock

```text
DAY_MASTER_STRENGTH = QUALITATIVE_EVIDENCE_PROFILE
```

看：得令、得地 / 通根、得势 / 得助、生克制化；不使用 personality percentage 或 numeric threshold authority。

### Pattern Scope Lock

```text
8 regular patterns
+ Jianlu
+ Yuejie
+ five-yang Yangren structural host
```

Yangren：

```text
甲→卯
丙→午
戊→午
庚→酉
壬→子
```

### Follow Lock

```text
FINAL = STRICT_FOLLOW_WEALTH + STRICT_FOLLOW_KILLING
```

其他从格：candidate / evidence-only / ambiguous / deferred。

### Structural Lock

- Pattern-specific 成 / 败 / damage / rescue；
- Primary + Secondary / Mixed / No Stable Single Pattern 均为合法结果；
- directional combinations 必须保留 Host direction；
- Evidence / Counter Evidence / Ambiguity 必须 first-class；
- LLM / Personality Dimensions 不得参与 Traditional verdict。

## 6. TraditionalPatternResult 当前状态

```text
Rule Profile prerequisite = SATISFIED
Implementation status = NOT STARTED / NEXT P0
```

现在允许进入 `TraditionalPatternResult` implementation，但尚未实现。

实现前 / 实现中至少需要补齐：

- base month-host evidence；
- exposure evidence；
- root evidence；
- qualitative strength context；
- 三合 / 三会 existence；
- 刑 / 破 existence；
- relation transformation state；
- pattern-specific formation support / damage / rescue；
- primary / secondary / mixed adjudication；
- strict follow adjudication；
- evidence / counter evidence / ambiguities。

## 7. 下一 P0 — TraditionalPatternResult Implementation

当前新的最高优先级：

> **按 `ziping-v1.0.0` 实现 deterministic TraditionalPatternResult。**

必须先做 Implementation Plan（实现计划），再 Build；不得重新开放已经 Freeze 的 Rule Profile 讨论，除非发现真正 blocker 并通过 Superseding Decision。

未来正式链路：

```text
Birth
→ Bazi Calendar / Chart Facts
→ Traditional Structural Facts
→ TraditionalPatternResult
  + Evidence
  + Counter Evidence
  + Ambiguity
  + ziping-v1.0.0
→ Modern Personality Translation
→ Public Personality
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

这些名字是现代翻译标签，不等于 Traditional Pattern 本身。

## 9. Character System — LOCKED

正式 contract：

```text
10 Public Personality = 10 fixed official Character IPs
public/characters/v1/{ten_god}.webp
```

用户性别不改变 Character identity。

Style Source of Truth：

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

但 Result 当前 authoritative personality source 仍需在 `TraditionalPatternResult` 完成后切换。

## 11. 当前 Release Blockers

当前顺序：

1. ✅ Traditional Bazi Rule Audit；
2. ✅ Rule Profile Research / Specification；
3. ✅ Owner Approval OA-01 ～ OA-07；
4. ✅ `ziping-v1.0.0` Rule Profile Freeze；
5. **TraditionalPatternResult Implementation — NEXT P0**；
6. Public Personality authoritative translation；
7. 隔离 legacy engineering personality authority；
8. Character asset completion / routing cleanup；
9. Result / Share integration QA；
10. mobile browser QA；
11. full CI；
12. PR #16 Ready；
13. merge main；
14. Vercel Production；
15. final public smoke test。

## 12. 当前不做

仍不作为首发 blocker：

- Payment；
- AI Advisor / Chat；
- Supabase Live；
- Auth / Account；
- compatibility；
- referral；
- ranking / rarity；
- community / gamification；
- 流月 / 流日等进一步预测功能。

Rule Profile V1 同时继续 Deferred：

- 自动真太阳时 authority；
- exact 人元司令日表 authority；
- 假从 final；
- 从儿 / 从势 / 专旺 final；
- 完整化气格；
- 外格 / 奇格全集；
- 独立调候 / 盲派 rule profile。

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

当前阶段顺序：

```text
Rule Profile = FROZEN
→ TraditionalPatternResult Spec / Plan
→ Build
→ Review
→ Freeze implementation
```

## 14. Product Integrity Rule

V1 可以年轻、好笑、传播性强，但不能通过自造命理算法换取“看起来很准”。

当前发布标准：

> **命理判断来源讲得清楚，现代人格翻译讲得好看。**
