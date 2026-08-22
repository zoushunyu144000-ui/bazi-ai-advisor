# 22 — Traditional Bazi Rule Profile V1

状态：**APPROVED / LOCKED**  
Freeze Date：2026-08-23  
Repository：`zoushunyu144000-ui/bazi-ai-advisor`  
Branch：`release/v1-personality-rc`  
Rule Profile Version：`ziping-v1.0.0`

> 本文是 `docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md` 之后正式冻结的 Traditional Bazi Rule Profile（传统八字规则体系）。
>
> Owner 已于 2026-08-23 批准 OA-01 ～ OA-07。本文从此前 `PROPOSED` 状态正式进入 `LOCKED`。
>
> 最高原则：**传统命理负责判断，现代产品负责翻译。**

---

# 1. Scope

`ziping-v1.0.0` 只定义 V1 传统结构判断采用的规则体系：

```text
Birth time / calendar convention
→ Four Pillars
→ Month Command / base Pattern Host
→ Day Master qualitative strength context
→ Regular Pattern candidates
→ Jianlu / Yuejie / Yangren
→ Formation state
→ Mixed structures
→ Follow-structure policy
→ Special-pattern policy
→ Directional combinations
→ Evidence / Counter Evidence / Ambiguity
```

明确不属于 Traditional Pattern authority（传统格局判定权）的内容：

- `personality-map/0.2.0` candidate score；
- 52 / 18 / 22 / 8 工程权重；
- `max(tenGodDistribution)`；
- 15 Personality Dimensions（人格维度）；
- Character IP；
- 产品转化数据；
- LLM / AI 自由判断格局；
- 为保证 10 类人格分布均匀而调整命理结果。

---

# 2. Doctrine

## 2.1 Core School

正式采用：

```text
CORE_SCHOOL = ZIPING_MONTH_COMMAND
PRIMARY_PATTERN_TEXT = ZI_PING_ZHEN_QUAN
CROSS_REFERENCE = YUAN_HAI_ZI_PING + SAN_MING_TONG_HUI
```

即：

> **以子平法为主体，以月令 / 提纲为主要结构坐标；以《子平真诠》的月令取用、用神变化、成败救应作为主要格局结构线；以《渊海子平》《三命通会》作传统交叉参考与流派差异来源。**

这里的“用神”优先按《子平真诠》月令格局语境理解，不与现代网络上“缺什么补什么”的扶抑用神混为一谈。

## 2.2 Source Discipline

规则证据层级：

```text
A. 原典 / 传统文本
B. 明确作者的传统注解
C. 后世系统整理
D. 现代研究 / 软件实现
E. 本项目工程实现
```

D / E 只能帮助实现与测试，不能自动升级为传统依据。

## 2.3 Structural Principles

正式冻结：

```text
月令 = 结构优先级，不是数字 multiplier
十神数量多 != 格局
格局 Host != Public Personality
现代人格翻译不得反向修改传统结果
```

禁止：

```text
month branch × 1.5 -> pattern
max(tenGodDistribution) -> pattern
candidate_score -> pattern
PersonalityDimensions -> pattern
LLM -> pattern verdict
```

---

# 3. Sources

## 3.1 Primary Traditional Sources

### 《子平真诠》

主要用于：

- 月令为提纲；
- 用神 / 月令结构；
- 用神变化；
- 格局成败救应；
- 十干得时不旺、失时不弱；
- 正官、财、印、食神、偏官、伤官；
- 建禄月劫；
- 杂格边界。

研究转录包括：

- https://www.donglishuzhai.net/chapter/3721.html
- https://www.luckclub.cn/bazi/002/008/
- https://www.luckclub.cn/bazi/002/011/
- https://www.luckclub.cn/bazi/002/012/
- https://www.luckclub.cn/bazi/002/047/
- https://www.luckclub.cn/bazi/002/049/

### 《渊海子平》

主要用于：

- 日主与月令框架；
- 人元藏干；
- 旺衰 / 根气传统语义；
- 阳刃“五阳有刃、五阴无刃”口径；
- 对外格不可滥立的边界提醒。

### 《三命通会》

主要用于：

- 子时 / 日界历史材料交叉验证；
- 羊刃 / 禄刃材料；
- 会合等传统材料；
- 流派差异对照。

## 3.2 Later Systematic Reference

### 袁树珊《命理探原》

用于 V1 night-Zi / Zi-zheng split（夜子 / 子正分段）规则的明确工程化口径。

其示例明确体现：

```text
夜子 23:00–23:59：日柱仍属前一民用日；
时支为子；
时干按次日日干起子时。

子正 00:00–00:59：日柱进入新民用日；
时支仍为子；
时干按该新日日干起子时。
```

因此同一跨午夜子时段的时干保持连续。

## 3.3 Modern Engineering References

- `tyme4ts`：历法 / 干支 / 节气 primitive，继续 Adapter reuse；不是格局 authority。
- `Brhiza/mingyu`：reference only。
- `jiwenxu025-boop/bazi-engine`：reference only，不复制其多流派混合及 numeric thresholds。

---

# 4. School Choice Lock Summary

上一轮 Audit 的 9 项 `SCHOOL_CHOICE` 已全部处理：

| ID | Decision | `ziping-v1.0.0` Selected Rule | Status |
| --- | --- | --- | --- |
| SC-01 | Year Boundary | exact 立春 instant | LOCKED |
| SC-02 | Day Boundary | local civil midnight `00:00` | LOCKED / OA-01 |
| SC-03 | Late Zi | night-Zi / Zi-zheng split | LOCKED / OA-02 |
| SC-04 | True Solar Time | historical IANA civil time; no auto TST | LOCKED / OA-03 |
| SC-05 | Month Host | month branch → ordered hidden qi → exposure → base Host | LOCKED / OA-04 |
| SC-06 | Yangren | five Yang stems only | LOCKED / OA-05 |
| SC-07 | Formation State | pattern-specific support / damage / rescue | LOCKED |
| SC-08 | Follow Structure | strict Follow Wealth + strict Follow Killing final only | LOCKED / OA-07 |
| SC-09 | Special Patterns | narrow whitelist; most special patterns evidence-only / deferred | LOCKED |

```text
RULE_PROFILE_STATUS = LOCKED
RULE_PROFILE_VERSION = ziping-v1.0.0
```

---

# 5. Calendar Profile

## 5.1 Year Boundary

```text
YEAR_BOUNDARY = EXACT_LICHUN_INSTANT
```

规则：

- 精确立春时刻前：上一干支年；
- 精确立春时刻及之后：新干支年；
- 不以公历 1 月 1 日换年；
- 不以春节 / 农历正月初一作为八字年界。

若出生时间不精确且可能跨立春：必须输出 ambiguity，不得用内部 noon placeholder 冒充确定答案。

## 5.2 Month Boundary

```text
MONTH_BOUNDARY = EXACT_JIE_INSTANT
```

十二“节”切月：

```text
立春 寅
惊蛰 卯
清明 辰
立夏 巳
芒种 午
小暑 未
立秋 申
白露 酉
寒露 戌
立冬 亥
大雪 子
小寒 丑
```

不使用农历初一切八字月。

## 5.3 Day Boundary — OA-01 APPROVED

```text
DAY_BOUNDARY = LOCAL_CIVIL_MIDNIGHT_00_00
```

即：

```text
23:59:59 = previous civil-day pillar
00:00:00 = next civil-day pillar
```

不采用 `23:00` 子初自动换日。

## 5.4 Late Zi — OA-02 APPROVED

```text
LATE_ZI = NIGHT_ZI / ZI_ZHENG_SPLIT_PROFILE
```

V1 精确定义：

### 23:00:00–23:59:59 Night Zi

```text
day pillar = current / previous civil day
hour branch = ZI
hour-stem effective day stem = NEXT civil day's day stem
```

### 00:00:00–00:59:59 Zi Zheng

```text
day pillar = new civil day
hour branch = ZI
hour-stem effective day stem = current new civil day's day stem
```

因此，跨午夜的同一子时段使用连续一致的 Zi-hour stem，但日柱在 `00:00` 切换。

Implementation 必须把三件事分开：

```text
day boundary
hour branch boundary
hour-stem effective day convention
```

不得再由单个 `hourPillar(dayStem, hour)` 隐式代表全部规则。

其他子初换日流派可能得到不同结果，因此 23:00–00:59 可保留：

```text
SCHOOL_SENSITIVITY_LATE_ZI
```

## 5.5 Time Standard — OA-03 APPROVED

```text
TIME_STANDARD = HISTORICAL_IANA_CIVIL_TIME
TRUE_SOLAR_TIME = NOT_AUTO_APPLIED_IN_V1
```

- 使用出生地历史 IANA timezone；
- 使用出生时历史 UTC offset / DST；
- DST gap fail closed；
- DST overlap 必须明确 occurrence / offset；
- resolved instant 一旦确认，下游不得重新猜；
- V1 不自动经度修正、不自动 Equation of Time 修正。

### Near-boundary ambiguity

如果 civil-time 与未来可计算的 solar-time alternative 会跨越：

- 时支边界；
- 00:00 日界；
- 立春；
- 月令“节”边界；

则必须保留：

```text
TRUE_SOLAR_TIME_BOUNDARY
```

V1 不因此自动切换到真太阳时结果。

---

# 6. Month Command Profile — OA-04 APPROVED WITH CONDITION

## 6.1 Base Host Rule

正式冻结：

```text
MONTH_HOST_BASE =
month branch
→ ordered hidden qi (main > middle > residual)
→ exposure
→ base Pattern Host
```

禁止：

```text
numeric month multiplier
exact commander-day table as ziping-v1.0.0 authority
```

## 6.2 Deterministic Base Host Decision Tree

对月支藏干按仓库 canonical ordering：

```text
main qi
middle qi (if present)
residual qi (if present)
```

然后检查这些月令藏干是否透于年干 / 月干 / 时干。

### Selection

```text
1. main qi exposed -> main-qi candidate is base Host
2. main not exposed, middle exposed -> middle-qi candidate may be base Host
3. main/middle not exposed, residual exposed -> residual-qi candidate may be base Host
4. none exposed -> return to unexposed main qi as base Host basis
5. multiple exposed -> main > middle > residual selects base Host;
   competing exposed candidates remain secondary / competing evidence
```

“透干位置”和“透出次数”可以作为 evidence metadata，但在 V1 不允许以自造积分推翻 `main > middle > residual` 的 base Host hierarchy。

## 6.3 Critical Condition: Base Host != Final Pattern Verdict

Owner 明确批准以下限制：

> **上述 hierarchy 只选择 base Pattern Host。**

最终传统格局判断仍必须继续检查：

```text
later exposure context
combination / transformation
formation
support / damage
rescue
root / strength context
mixed structure
follow / special conditions
```

因此禁止：

```text
base Host selected
=> immediately final primary_pattern
```

## 6.4 Exact Commander-Day Table

```text
EXACT_MONTH_COMMANDER_DAY_TABLE_AUTHORITY = DEFERRED
```

可以作为 future research / alternate profile evidence，但不得在 `ziping-v1.0.0` 中静默决定 Host。

---

# 7. Strength Profile — OA-06 APPROVED

```text
DAY_MASTER_STRENGTH = QUALITATIVE_EVIDENCE_PROFILE
```

禁止 numeric percentage / threshold authority。

现有：

```text
support_ratio
0.58 / 0.42
month × 1.5
hidden 0.6 / 0.3 / 0.1 scoring
```

只能作为 legacy engineering statistics / analytics，不得决定 Traditional Pattern。

## 7.1 Required Evidence

至少检查：

### 得令

日主及生扶一方在月令中的季节基础。

### 得地 / 通根

记录日主及相关十神在各支是否有根，并区分：

```text
main-qi root
middle-qi root
residual-qi root
```

但不转成伪传统百分比。

### 得势 / 得助

查看印比等明透 / 扎根是否形成有效助力，同时查看财官食伤等泄耗克制结构。

### 生克制化

只采用已验证的关系 / transformation state；不能把“关系存在”直接等于“已经合化”。

## 7.2 Output Vocabulary

```text
STRONG
LEAN_STRONG
BALANCED_MIXED
LEAN_WEAK
WEAK
AMBIGUOUS
```

结果必须附 evidence，而不是只给标签。

---

# 8. Regular Pattern Rules

V1 regular patterns：

```text
ZHENG_GUAN
QI_SHA
ZHENG_CAI
PIAN_CAI
ZHENG_YIN
PIAN_YIN
SHI_SHEN
SHANG_GUAN
```

Pattern Candidate 必须来自月令 Host / 月令变化链，不来自全盘十神分布最大值。

`primary_pattern` 只能在 base Host 经过 formation / transformation / counter-evidence adjudication 后产生。

`secondary_patterns[]` 用于保留明显竞争结构。

---

# 9. Jianlu / Yuejie

## 9.1 Jianlu

```text
JIAN_LU = month branch exactly equals Day Master's Lu position
```

禄位：

```text
甲寅 乙卯 丙巳 丁午 戊巳
己午 庚申 辛酉 壬亥 癸子
```

因此：

```text
比肩出现 != 建禄
比肩数量最大 != 建禄
```

建禄是 self-rooted month Host；后续仍需看财官杀食等承接结构。

## 9.2 Yuejie

月劫必须是明确的 **月令劫财 Host / 禄劫结构**，不能用“全盘劫财 score 高”代替。

因此：

```text
劫财出现 != 月劫
劫财数量最大 != 月劫
```

建禄 / 月劫都允许进一步形成 secondary structure / directional modifier。

---

# 10. Yangren — OA-05 APPROVED

```text
YANGREN = FIVE_YANG_STEMS_ONLY
```

正式映射：

```text
甲 → 卯
丙 → 午
戊 → 午
庚 → 酉
壬 → 子
```

五阴干不自动论“真阳刃”。

V1 taxonomy 可以将 Yangren 作为 explicit special self-rooted Pattern Host / structural context，但不得因为劫财出现就自动判阳刃。

---

# 11. Formation State

V1 采用《子平真诠》成败救应主线，但工程上使用清晰可测试的状态 vocabulary：

```text
FORMED_CLEAR
FORMED_IMPURE
FAILED
BROKEN
BROKEN_RESCUED
NOT_FORMED
AMBIGUOUS
```

规则：

- `FORMED_CLEAR`：Host 明确，关键 supporting relation 成立，无足以改变结构的 material damage；
- `FORMED_IMPURE`：基本成格，但有明显 competing / impure structure；
- `FAILED`：候选 Host 存在，但形成格所需关键条件不足；
- `BROKEN`：已经形成的结构遭 material counter evidence 破坏；
- `BROKEN_RESCUED`：存在破坏，同时有传统上可成立的明确救应；
- `NOT_FORMED`：无法建立该候选格；
- `AMBIGUOUS`：证据不足或当前 profile 无法安全裁决。

必须 pattern-specific（逐格）定义 support / damage / rescue。

禁止统一“吉神加分 / 凶神扣分”。

---

# 12. Mixed Structures

系统必须允许现实命盘不是纯型。

合法输出：

```text
PRIMARY_WITH_SECONDARY
MIXED
NO_STABLE_SINGLE_PATTERN
```

### Primary + Secondary

base Host 与 formation evidence 仍明显占主导，但另一结构有独立、实质传统依据。

### Mixed

多个结构竞争，任何单一格强判都会丢失 material evidence。

### No Stable Single Pattern

没有足够证据建立稳定单一主格。

禁止为了 Public Personality 强制纯化。

---

# 13. Follow Structures — OA-07 APPROVED

```text
FOLLOW_STRUCTURE_FINAL_VERDICT =
STRICT_FOLLOW_WEALTH
+
STRICT_FOLLOW_KILLING
```

只有严格满足条件的从财 / 从杀可以在 V1 得到 final verdict。

至少要求：

- 日主确属极弱 / 无有效自立条件；
- 无 material root 足以破从；
- 无有效印比形成真正救助；
- 所从一方形成明确、连续、主导结构；
- transformation / formation evidence 与所从方向一致；
- 不存在足以改变结论的 mixed evidence。

其他：

```text
从儿
从势
从强
专旺
假从
其他 follow variants
```

统一：

```text
candidate
or evidence-only
or ambiguous
or deferred
```

`假从` V1 不自动给 final verdict。

---

# 14. Special Patterns

V1 原则：

> **宁可少而可解释，不要多而不可验证。**

## V1 Supported / Automatic Scope

```text
8 regular patterns
Jianlu
Yuejie
five-yang Yangren structural host
strict Follow Wealth
strict Follow Killing
```

## Evidence Only / Candidate

```text
三合 / 三会导致的可能月令变化
从儿
从势
从强 / 专旺
化气候选
其他高争议 special structure
```

## Deferred

```text
假从 final
完整化气 final
飞天禄马
倒冲
井栏叉
大量外格 / 奇格全集
纳音格
神煞格
独立调候体系
盲派制用体系
```

---

# 15. Combination Structures

组合结构默认不是新的互斥 Primary Pattern，而是 **directional Key Combination / Pattern Modifier**。

必须保留 Host direction。

示例：

```text
primary = ZHENG_GUAN
modifier = RESOURCE_PROTECTS_OFFICER
// 正官佩印

primary = ZHENG_YIN / PIAN_YIN
modifier = OFFICER_GENERATES_RESOURCE
// 印绶用官
```

二者不能合并成一个无方向的“官印相生”。

V1 优先支持：

```text
SHANG_GUAN_GENERATES_WEALTH      伤官生财
SHI_SHEN_GENERATES_WEALTH        食神生财
SHI_SHEN_CONTROLS_QI_SHA         食神制杀
RESOURCE_TRANSFORMS_QI_SHA       杀用印 / 杀印配合
OFFICER_GENERATES_RESOURCE       印绶用官
RESOURCE_PROTECTS_OFFICER        正官佩印 / 印护官
WEALTH_GENERATES_OFFICER         财生官
SHANG_GUAN_WITH_RESOURCE         伤官配印 / 印制伤官（按 Host 方向表达）
QI_SHA_GENERATES_RESOURCE        印绶逢杀方向
```

组合成立条件必须读取真实结构 evidence，而不是“两个十神同时出现”即可。

---

# 16. Evidence Vocabulary

未来 `TraditionalPatternResult` 必须使用结构化 evidence。

至少包含：

```text
CALENDAR_BOUNDARY
MONTH_COMMAND
MONTH_MAIN_QI
MONTH_MIDDLE_QI
MONTH_RESIDUAL_QI
VISIBLE_STEM
HIDDEN_STEM
ROOT_MAIN_QI
ROOT_MIDDLE_QI
ROOT_RESIDUAL_QI
SEASONAL_SUPPORT
DAY_MASTER_STRENGTH
GENERATES
CONTROLS
STEM_COMBINATION
BRANCH_COMBINATION
CLASH
PUNISHMENT
HARM
BREAK
THREE_HARMONY
THREE_MEETING
TRANSFORMATION_VALIDATED
TRANSFORMATION_UNRESOLVED
FORMATION_SUPPORT
FORMATION_DAMAGE
RESCUE
FOLLOW_CONDITION
```

每条 evidence 至少应能说明：

```text
code
source pillar / branch / stem
target pattern or modifier
rule basis
```

---

# 17. Counter Evidence

必须 first-class 支持：

```text
counter_evidence[]
```

用途：解释“为什么某个候选没有成立”。

示例：

```text
伤官明显
BUT month command is not Shang Guan Host
AND officer structure has stronger host evidence
```

典型 counter vocabulary：

```text
OFFICER_DAMAGED_BY_SHANG_GUAN
OFFICER_QI_SHA_MIXED
RESOURCE_DAMAGED_BY_WEALTH
SHI_SHEN_BLOCKED_BY_RESOURCE
WEALTH_CONTESTED_BY_PEERS
QI_SHA_CONTROL_TRANSFORM_COMPETE
FOLLOW_BROKEN_BY_ROOT
FOLLOW_BROKEN_BY_RESOURCE_PEER_SUPPORT
```

Counter Evidence 不是人格“缺点标签”。

---

# 18. Ambiguity Policy

系统不得假装永远确定。

至少支持：

```text
LATE_ZI_BOUNDARY
SCHOOL_SENSITIVITY_LATE_ZI
TRUE_SOLAR_TIME_BOUNDARY
SOLAR_TERM_BOUNDARY_UNCERTAIN
MULTIPLE_PATTERN_CANDIDATES
MONTH_COMMAND_TRANSFORMATION_UNRESOLVED
SCHOOL_DISAGREEMENT
FOLLOW_STRUCTURE_UNCERTAIN
INSUFFICIENT_BIRTH_TIME
INSUFFICIENT_BIRTH_TIME_FOR_YEAR_BOUNDARY
INSUFFICIENT_BIRTH_TIME_FOR_MONTH_BOUNDARY
RELATION_TRANSFORMATION_UNRESOLVED
```

原则：

- input 不足：返回 ambiguity；
- school 差异：记录 disagreement；
- special structure 规则未进入 V1：candidate / deferred；
- 不得用随机 tie-break；
- 不得用 Personality / LLM 帮传统层“猜一个”。

---

# 19. Deferred Rules

`ziping-v1.0.0` 明确 Deferred：

- 自动真太阳时 authority；
- exact 人元司令日数表 authority；
- 假从 final verdict；
- 从儿 / 从势 / 专旺 final verdict；
- 完整化气格；
- 外格 / 奇格全集；
- 神煞格局；
- 纳音格局；
- 独立调候派 profile；
- 盲派制用 profile；
- 自造 numeric strength / personality percentages。

未来如启用，必须新的 Rule Profile version 或明确兼容版本升级，不得 silent change。

---

# 20. Rule Profile Version

正式冻结：

```text
rule_profile_version = ziping-v1.0.0
status = LOCKED
```

旧：

```text
civil-local-jieqi-v1
```

只能代表此前 Bazi Engine calendar / baseline semantics。

不得把旧 profile 名静默改成 `ziping-v1.0.0` 的新传统语义。

历史结果必须保留原 `rule_profile_version`。

---

# 21. Implementation Contract

Owner Freeze 后，`TraditionalPatternResult` implementation **可以开始**。

## 21.1 Ownership

```text
modules/bazi / traditional facts layer
owns TraditionalPatternResult
```

Interpretation 只能 consume，不能重新取格。

## 21.2 Minimum Result Shape

```ts
TraditionalPatternResult {
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
}
```

## 21.3 Required Facts Before Final Adjudication

至少补齐：

- month-host evidence；
- exposure evidence；
- root evidence；
- qualitative strength context；
- 三合 / 三会 existence；
- 刑 / 破 existence；
- relation transformation state：`validated / unresolved / not_transformed`；
- formation support / damage / rescue rules。

## 21.4 Forbidden Inputs

不得读取：

```text
PersonalityDimensions
ArchetypeCandidate
candidate_score
public personality name
character asset
growth analytics
conversion data
LLM free-form judgment
```

## 21.5 Required Tests

### Calendar

- exact LiChun ±1s；
- exact Jie ±1s；
- 22:59 / 23:00 / 23:59 / 00:00 / 00:59 / 01:00；
- night-Zi day pillar vs hour-stem effective day；
- DST gap / overlap；
- unknown / approximate time near solar-term boundary。

### Pattern Host

8 regular patterns 至少覆盖：

- main qi exposed；
- main unexposed + middle exposed；
- residual exposed；
- none exposed；
- multiple exposed；
- later transformation changes final verdict without rewriting base Host evidence。

### Self-rooted

- 10 Jianlu mappings；
- Yuejie fixtures；
- five Yangren mappings；
- five Yin day masters must not auto-Yangren。

### Formation

每种支持 pattern 至少：

```text
formed_clear
formed_impure
failed
broken
broken_rescued
ambiguous
```

### Direction

必须证明：

```text
正官佩印 != 印绶用官
杀用印 != 印绶逢杀
财逢食生 != 食神生财
杀格逢刃 != 阳刃露杀
```

### Mixed / Follow

- primary + secondary；
- 官杀混杂；
- no stable single pattern；
- strict Follow Wealth；
- strict Follow Killing；
- material root breaks follow；
- 假从 candidate must not auto-final。

## 21.6 No Silent Migration

任何规则语义改变：

```text
must bump rule_profile_version
```

---

# 22. Owner Approval Record — LOCKED

2026-08-23 Owner 明确批准：

```text
OA-01 APPROVED
DAY_BOUNDARY = LOCAL_CIVIL_MIDNIGHT_00_00

OA-02 APPROVED
LATE_ZI = NIGHT_ZI / ZI_ZHENG_SPLIT_PROFILE

OA-03 APPROVED
TIME_STANDARD = HISTORICAL_IANA_CIVIL_TIME
TRUE_SOLAR_TIME = NOT_AUTO_APPLIED_IN_V1
Near-boundary cases preserve ambiguity.

OA-04 APPROVED WITH CONDITION
MONTH_HOST_BASE =
month branch
→ ordered hidden qi (main > middle > residual)
→ exposure
→ base Pattern Host

No numeric month multiplier.
No exact commander-day table authority in ziping-v1.0.0.
The hierarchy selects the base Host only; later traditional structure rules may modify the final verdict.

OA-05 APPROVED
YANGREN = FIVE_YANG_STEMS_ONLY
甲→卯
丙→午
戊→午
庚→酉
壬→子

OA-06 APPROVED
DAY_MASTER_STRENGTH = QUALITATIVE_EVIDENCE_PROFILE
No personality percentage or numeric threshold authority.

OA-07 APPROVED
FOLLOW_STRUCTURE_FINAL_VERDICT =
STRICT_FOLLOW_WEALTH
+
STRICT_FOLLOW_KILLING

Other follow structures = candidate / evidence-only / ambiguous / deferred.
```

---

# 23. Freeze Result

```text
Traditional Bazi Rule Audit = DONE
Traditional Bazi Rule Profile = LOCKED
rule_profile_version = ziping-v1.0.0
TraditionalPatternResult Implementation = ALLOWED TO BEGIN
```

本 Freeze **不等于 TraditionalPatternResult 已经实现**。

下一阶段必须遵守：

```text
Spec / locked rules
→ Implementation Plan
→ Build
→ Tests / Review
→ Freeze implementation contract
→ Public Personality Translation
```

当前仍禁止在传统层使用：

```text
experimental numeric weights
Personality Dimensions
candidate score
LLM judgment
product balancing
```
