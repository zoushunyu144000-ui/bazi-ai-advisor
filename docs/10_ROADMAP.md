# 10 — Roadmap

状态：**V1 Release Freeze — Rule Profile LOCKED / TraditionalPatternResult Active Next**  
最后更新：2026-08-23

## 0. Roadmap Boundary

Source of Truth：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`
4. `docs/09_CURRENT_STATE.md`
5. `docs/10_ROADMAP.md`
6. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

项目执行流程见：

`docs/21_AI_PROJECT_OPERATING_SYSTEM.md`

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
5. **TraditionalPatternResult + Evidence + Counter Evidence + Ambiguity — NEXT / ACTIVE**
6. Public Personality authoritative translation
7. 降级 / 隔离 legacy engineering personality ranking
8. Character routing / formal asset completion
9. Result / Share Card translation integration
10. mobile browser QA
11. full CI
12. PR #16 Ready
13. merge main
14. Vercel Production
15. final public smoke test

## 3. P0.1 — Traditional Bazi Rule Audit

状态：**COMPLETE**。

结果：

`docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`

核心结论：

- production 尚无真正 Traditional Pattern adjudication；
- legacy support ratio / 0.58 / 0.42 / month ×1.5 / candidate ranking 属 experimental；
- `personality-map/0.2.0` 不得承担 Traditional Pattern authority。

## 4. P0.2 — Traditional Bazi Rule Profile V1

状态：**APPROVED / LOCKED**。

Source of Truth：

`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`

正式版本：

```text
rule_profile_version = ziping-v1.0.0
```

### Locked Calendar

```text
YEAR_BOUNDARY = EXACT_LICHUN_INSTANT
MONTH_BOUNDARY = EXACT_JIE_INSTANT
DAY_BOUNDARY = LOCAL_CIVIL_MIDNIGHT_00_00
LATE_ZI = NIGHT_ZI / ZI_ZHENG_SPLIT_PROFILE
TIME_STANDARD = HISTORICAL_IANA_CIVIL_TIME
TRUE_SOLAR_TIME = NOT_AUTO_APPLIED_IN_V1
```

Near-boundary cases preserve ambiguity。

### Locked Month Host

```text
month branch
→ ordered hidden qi (main > middle > residual)
→ exposure
→ base Pattern Host
```

重要：这里只决定 **base Host**。最终 pattern judgment 仍必须继续检查 transformation、formation、damage / rescue、roots、strength、mixed / follow structure。

禁止：

```text
month numeric multiplier authority
exact commander-day table authority
Ten-God max authority
candidate score authority
```

### Locked Strength

```text
DAY_MASTER_STRENGTH = QUALITATIVE_EVIDENCE_PROFILE
```

使用：

```text
得令
+ 得地 / 通根
+ 得势 / 得助
+ 生克制化
```

不使用人格百分比或 numeric threshold authority。

### Locked Pattern Scope

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

### Locked Follow Scope

```text
FINAL = STRICT_FOLLOW_WEALTH + STRICT_FOLLOW_KILLING
```

其他 follow structures：candidate / evidence-only / ambiguous / deferred。

## 5. P0.3 — TraditionalPatternResult Implementation

状态：**NEXT / ACTIVE**。

Rule Profile prerequisite 已满足。

本阶段目标：

> **把 `ziping-v1.0.0` 已冻结规则实现成 deterministic、可测试、可解释的 TraditionalPatternResult。**

### 5.1 Implementation 顺序

必须遵守：

```text
Spec
→ Implementation Plan
→ Build
→ Unit / Golden Tests
→ Rule Review
→ Freeze
```

不得一边 Build 一边重新发明 Rule Profile。

### 5.2 Minimum Result Contract

至少包含：

```text
rule_profile_version
pattern_status
primary_pattern
secondary_patterns[]
base_month_host
formation_state
strength_context
follow_structure
key_combinations[]
evidence[]
counter_evidence[]
ambiguities[]
```

### 5.3 Required Traditional Facts / Evaluators

至少实现或补齐：

#### Calendar / Time

- `ziping-v1.0.0` exact LiChun / Jie；
- local civil midnight day boundary；
- night-Zi / Zi-zheng split；
- historical IANA / DST；
- near-boundary ambiguity。

#### Month Host

- ordered hidden qi；
- exposure evidence；
- base Host selection；
- multiple exposure competing evidence；
- base Host 与 final verdict 分离。

#### Roots / Strength

- main / middle / residual root evidence；
- 得令 / 得地 / 得势；
- qualitative strength band；
- no numeric threshold authority。

#### Relations

至少补：

```text
三合 existence
三会 existence
刑 existence
破 existence
transformation_state = validated | unresolved | not_transformed
```

现有六合 / 六冲 / 六害 / 天干五合只可作为 existence facts，不能默认等于完成合化。

#### Formation

逐格实现：

```text
support
damage
rescue
```

输出：

```text
FORMED_CLEAR
FORMED_IMPURE
FAILED
BROKEN
BROKEN_RESCUED
NOT_FORMED
AMBIGUOUS
```

#### Mixed

支持：

```text
PRIMARY_WITH_SECONDARY
MIXED
NO_STABLE_SINGLE_PATTERN
```

#### Follow

仅：

```text
STRICT_FOLLOW_WEALTH
STRICT_FOLLOW_KILLING
```

允许 final verdict。

其他 follow 不得偷偷 final。

### 5.4 Directional Combination Requirements

优先支持：

```text
SHANG_GUAN_GENERATES_WEALTH
SHI_SHEN_GENERATES_WEALTH
SHI_SHEN_CONTROLS_QI_SHA
RESOURCE_TRANSFORMS_QI_SHA
QI_SHA_GENERATES_RESOURCE
WEALTH_GENERATES_OFFICER
RESOURCE_PROTECTS_OFFICER
OFFICER_GENERATES_RESOURCE
SHANG_GUAN_WITH_RESOURCE
```

必须证明 Host direction 不丢失：

```text
正官佩印 != 印绶用官
杀用印 != 印绶逢杀
财逢食生 != 食神生财
杀格逢刃 != 阳刃露杀
```

### 5.5 Evidence Contract

必须 first-class：

```text
evidence[]
counter_evidence[]
ambiguities[]
```

不得最终只输出：

```text
pattern = SHANG_GUAN
```

而没有依据。

### 5.6 Forbidden Inputs

TraditionalPatternResult 不得读取：

```text
PersonalityDimensions
ArchetypeCandidate
candidate_score
public personality name
Character
growth / conversion analytics
LLM free-form judgment
```

## 6. P0.3 Test Gate

至少覆盖：

### Calendar

- LiChun ±1s；
- Jie ±1s；
- 22:59 / 23:00 / 23:59 / 00:00 / 00:59 / 01:00；
- night-Zi day pillar / hour stem；
- DST gap / overlap；
- unknown / approximate time near boundaries。

### Month Host

每个 regular pattern：

- main qi exposed；
- main unexposed + middle exposed；
- residual exposed；
- none exposed；
- multiple exposed；
- final verdict changed by later formation without rewriting base Host evidence。

### Self-rooted

- 10 Jianlu mappings；
- Yuejie；
- five Yangren mappings；
- five Yin stems must not auto-Yangren。

### Formation

每种 V1 pattern 至少：

```text
formed_clear
formed_impure
failed
broken
broken_rescued
ambiguous
```

### Mixed / Follow

- primary + secondary；
- 官杀混杂；
- no stable single pattern；
- strict Follow Wealth；
- strict Follow Killing；
- root breaks follow；
- fake-follow candidate does not become final。

### Determinism

- same input + same rule profile = same result；
- all results carry `ziping-v1.0.0`；
- old `civil-local-jieqi-v1` results are not silently reinterpreted。

## 7. P0.4 — Public Personality Translation

只有 TraditionalPatternResult implementation Review + Freeze 后进入。

未来链路：

```text
TraditionalPatternResult
→ Translation Layer
→ Public Personality
```

例如：

```text
primary = SHANG_GUAN
modifier = SHANG_GUAN_GENERATES_WEALTH
↓
主 Public Personality：天生反骨
明显副倾向：搞钱圣体
```

要求：

- 所有标签可回溯到 evidence；
- Public Personality 不覆盖传统格局；
- 不为了 10 类均衡而调结果；
- Mixed 允许混合表达；
- 15 dimensions 只负责现代行为解释，不反向决定格局。

## 8. Personality Percentage Policy

继续禁止：

```text
candidate_score -> personality percentage
tenGodDistribution -> personality percentage
```

V1 只表达：

```text
主导
明显副倾向
辅助
混合 / 清晰 / 歧义
```

未来恢复百分比需要独立传统依据、版本化与验证。

## 9. Character P0

传统判断链完成后继续：

```text
10 Public Personality
→ 10 fixed official Characters
→ public/characters/v1/{ten_god}.webp
```

用户性别不改变 Character identity。

## 10. Final Product QA

最终仍需：

- traditional evidence 与 public translation 一致性；
- Character mapping；
- Share Card；
- mobile browser QA；
- 390 / 430 / 768 / 1440 viewport；
- full CI；
- PR #16 Ready；
- production smoke test。

## 11. Post-V1 / Deferred

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

Rule Profile V1 Deferred：

- auto true-solar-time authority；
- exact commander-day table authority；
- 假从 final；
- 从儿 / 从势 / 专旺 final；
- 完整化气；
- 外格 / 奇格全集；
- 神煞 / 纳音格局；
- 独立调候 / 盲派 profile。

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

当前唯一 P0：

> **TraditionalPatternResult Spec / Plan → Implementation。**

## 13. Release Rule

> **不扩 Scope，不降质量，不自造命理。**

Rule Profile 已冻结。现在按冻结规则实现，不重新混入实验数学权重。
