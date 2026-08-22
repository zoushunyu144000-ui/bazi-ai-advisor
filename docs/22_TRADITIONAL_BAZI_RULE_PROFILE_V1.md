# 22 — Traditional Bazi Rule Profile V1

状态：**PROPOSED — OWNER APPROVAL REQUIRED**  
日期：2026-08-22  
Repository：`zoushunyu144000-ui/bazi-ai-advisor`  
Branch：`release/v1-personality-rc`  
Rule Profile Version（提议）：`ziping-v1.0.0`

> 本文是 `docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md` 之后的 Rule Profile / School Choice Lock（规则体系 / 流派选择冻结）提案。
>
> 本轮只做 **Research + Specification + Decision（研究 + 规范 + 决策）**，不实现 `TraditionalPatternResult`，不修改任何 production algorithm（生产算法）。
>
> 最高原则：**传统命理负责判断，现代产品负责翻译。**

---

# 1. Scope（范围）

本 Rule Profile 只定义 V1 判断以下内容时采用的传统规则：

```text
Birth time / calendar convention
→ Four Pillars
→ Month Command / Pattern Host
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

明确不属于本 Rule Profile authority（判定权）的内容：

- `personality-map/0.2.0` candidate score；
- 52% / 18% / 22% / 8% 工程权重；
- `tenGodDistribution` 最大值；
- 15 Personality Dimensions（人格维度）；
- 用户反馈 / 转化率；
- Character IP；
- LLM / AI 自由取格；
- 为了 10 类结果均衡而调算法。

---

# 2. Doctrine（体系原则）

## 2.1 V1 主体体系

V1 提议采用：

> **子平法为主体，以月令 / 提纲为 Pattern Host（格局宿主），以《子平真诠》的月令取用、用神变化、成败救应为主要格局结构线；以《渊海子平》《三命通会》作传统交叉参考与流派差异来源。**

简写：

```text
CORE_SCHOOL = ZIPING_MONTH_COMMAND
PRIMARY_PATTERN_TEXT = ZI_PING_ZHEN_QUAN
CROSS_REFERENCE = YUAN_HAI_ZI_PING + SAN_MING_TONG_HUI
```

这里的“用神”按《子平真诠》语境理解为月令格局结构中的核心取用，不与现代网络上“缺什么补什么”的扶抑用神概念混为一谈。

## 2.2 规则层级

规则来源按以下优先级处理：

```text
A. 原典 / 传统文本
B. 明确标注作者的传统注解
C. 民国以来系统整理
D. 现代研究 / 软件实现
E. 本项目工程实现
```

D / E 只能帮助编码、验证、发现边界；不能因为软件“能算”就升级为传统依据。

## 2.3 月令不是权重

V1 明确禁止：

```text
month branch × 1.5
→ 当作月令格局
```

月令是 **结构优先级**，不是一个人为浮点 multiplier（乘数）。

## 2.4 格局不是十神数量最大值

明确禁止：

```text
max(tenGodDistribution)
→ primary_pattern
```

一个十神在全盘出现多，不代表它就是月令 Pattern Host。

---

# 3. Sources（来源与证据纪律）

## 3.1 Tier A — Traditional Rule Sources（传统规则来源）

### 《子平真诠》

核心采用章节：

- 论用神：月令为提纲，先以日干配月令；
- 论用神变化：月令藏干层级、透干、会合导致 host 变化；
- 论用神成败救应：成、败、带忌、救应；
- 论十干得时不旺失时不弱：月令重要但不可只凭得令判断强弱；
- 论建禄月劫；
- 论杂格；
- 论星辰无关格局。

研究转录：

- https://www.donglishuzhai.net/chapter/3721.html
- https://www.luckclub.cn/bazi/002/008/
- https://www.luckclub.cn/bazi/002/011/
- https://www.luckclub.cn/bazi/002/012/
- https://www.luckclub.cn/bazi/002/023/
- https://www.luckclub.cn/bazi/002/047/
- https://www.luckclub.cn/bazi/002/049/
- https://ctext.org/wiki.pl?chapter=974137

### 《渊海子平》

本 Profile 主要取其：

- 日主为主；
- 月为提纲；
- 人元藏干；
- 旺衰 / 根气传统框架；
- 阳刃“五阳有刃、五阴无刃”的明确传统口径；
- 对大量外格不可滥立的提醒。

研究转录：

- https://zh.wikisource.org/zh-hant/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3%E5%A4%A7%E5%85%A8

### 《三命通会》

本 Profile 用于：

- 羊刃 / 禄刃历史材料交叉验证；
- 时刻、会合等传统材料参照；
- 不作为把多个体系全部混入 V1 的理由。

研究转录：

- https://ctext.org/wiki.pl?chapter=117077

## 3.2 Tier B — Later Systematic Commentary（后世系统整理）

### 徐乐吾《子平真诠评注》

用途：帮助工程化理解“根、旺衰、成败、会合”的后世解释。

限制：徐注属于后世解释，不得与沈氏原文混成同一证据等级。

### 袁树珊《命理探原》

用途：晚子时 / 子正的明确现代命理口径，以及民国时期规则整理。

研究转录：

- https://ctext.org/wiki.pl?chapter=435028&if=gb&remap=gb

限制：这是民国系统化选择，不是所有古典子平共同标准。

## 3.3 Astronomy / Timekeeping References（天文与计时参考）

这些来源只定义现代天文时间，不构成传统命理权威：

- NIST Solar Time：
  https://www.nist.gov/pml/time-and-frequency-division/popular-links/time-frequency-z/time-and-frequency-z-s-so
- USNO Equation of Time：
  https://aa.usno.navy.mil/faq/eqtime

它们用于清楚区分：

```text
Civil Time
Local Mean Solar Time
Local Apparent / True Solar Time
```

## 3.4 Modern Software References（现代软件参考）

### `tyme4ts`

用途：历法 / 干支 / 节气 primitives（基础能力）。

Decision：

```text
REUSE VIA ADAPTER
NOT A PATTERN AUTHORITY
```

### `Brhiza/mingyu`

用途：参考现代代码如何记录月令、透干、建禄 / 月刃、会局、特殊结构。

Decision：

```text
REFERENCE ONLY
DO NOT COPY ITS SCHOOL CHOICES AS TRUTH
```

### `jiwenxu025-boop/bazi-engine`

用途：参考 evidence / pattern validation / true-solar-time engineering。

Decision：

```text
REFERENCE ONLY
DO NOT COPY MULTI-SCHOOL OR NUMERIC THRESHOLDS
```

---

# 4. Decision Summary（9 项 SCHOOL_CHOICE 总表）

| ID | Decision | Selected Rule | Status |
| --- | --- | --- | --- |
| SC-01 | Year Boundary | exact 立春 instant | READY TO FREEZE |
| SC-02 | Day Boundary | local civil midnight `00:00` | **OWNER APPROVAL REQUIRED** |
| SC-03 | Late Zi | split late-Zi convention; 23:00–23:59 stays previous day, hour branch 子；hour stem follows selected late-Zi convention described below | **OWNER APPROVAL REQUIRED** |
| SC-04 | True Solar Time | civil local time default; no automatic solar correction | **OWNER APPROVAL REQUIRED** |
| SC-05 | Month Host | month branch + ordered hidden qi + exposure; no numeric month weight; no day-count commander authority in V1 | **OWNER APPROVAL REQUIRED** |
| SC-06 | Yangren | five-yang-only; exact blade position; support as explicit special self-rooted host | **OWNER APPROVAL REQUIRED** |
| SC-07 | Formation State | pattern-specific 成 / 败 / damage / rescue rules from 《子平真诠》; conservative incomplete cases return ambiguity | READY IN PRINCIPLE / OWNER APPROVAL REQUIRED FOR PROFILE |
| SC-08 | Follow Structure | strict 从财 / 从杀 only; other follow structures candidate / deferred | **OWNER APPROVAL REQUIRED** |
| SC-09 | Special Patterns | narrow whitelist; most 外格 / 化气 / 专旺 deferred | READY IN PRINCIPLE / OWNER APPROVAL REQUIRED FOR PROFILE |

整体状态：

```text
RULE_PROFILE_STATUS = PROPOSED
```

在 Owner 明确批准前，不得写成 `LOCKED`。

---

# 5. Calendar Profile（历法规则）

## 5.1 YEAR_BOUNDARY

### Decision

```text
YEAR_BOUNDARY = EXACT_LICHUN_INSTANT
```

### Selected Rule

- 以太阳节气 **立春的精确交节时刻** 为八字年柱切换点；
- 立春 instant 之前仍属上一干支年；
- 到达立春 instant 及之后进入新干支年；
- 不使用公历 1 月 1 日；
- 不使用农历正月初一 / 春节作为八字年界。

### Traditional / Historical Basis

现代子平体系长期采用立春年界，《千里命稿》等系统排盘文本明确以立春为年柱标准；《渊海子平》的节令 / 月令体系也以立春进入寅月为核心季节坐标。

### Alternative Views

- 春节 / 农历正月初一作为民俗生肖年界；
- 公历 1 月 1 日作为现代行政年界。

两者都不选为八字年柱界。

### Boundary Policy

若出生时间：

- exact：直接与交节 instant 比较；
- approximate 且不确定范围可能跨立春：`SOLAR_TERM_BOUNDARY_UNCERTAIN`；
- unknown 且生日当天存在立春交节：不得把内部假设的 12:00 当 authoritative answer（权威答案），应标 `INSUFFICIENT_BIRTH_TIME_FOR_YEAR_BOUNDARY`。

### Implementation Consequence

现有 exact-LiChun 行为可保留；未来需修复“未知时刻以中午推断边界后仍当确定结果”的 authority 语义。

---

## 5.2 MONTH_BOUNDARY

### Decision

```text
MONTH_BOUNDARY = EXACT_JIE_INSTANT
```

使用十二“节”切月：

```text
立春 → 寅
惊蛰 → 卯
清明 → 辰
立夏 → 巳
芒种 → 午
小暑 → 未
立秋 → 申
白露 → 酉
寒露 → 戌
立冬 → 亥
大雪 → 子
小寒 → 丑
```

不使用农历初一切月。

### Boundary Policy

unknown / approximate time 可能跨节时，规则同年界：保留 ambiguity，不用 noon placeholder 冒充确定结果。

---

## 5.3 DAY_BOUNDARY

### Recommended Selection

```text
DAY_BOUNDARY = LOCAL_CIVIL_MIDNIGHT_00_00
```

即：

```text
23:59:59 = previous day pillar
00:00:00 = next day pillar
```

### Why Selected

1. 历史历法存在“分日始于子半 / 夜半”的明确传统材料；
2. 民国《命理探原》明确区分夜子与子正，夜半前后分属前后日；
3. 该规则与现代 IANA timezone / DST 的 exact local civil date 可稳定复现；
4. 相比直接把现代 23:00 当绝对日界，更容易把“日界”和“子时开始”分开表达。

### Alternative View

```text
DAY_BOUNDARY = ZI_INITIAL_23_00
```

即子初（23:00）换日。这是现代八字实践中重要的另一派，不能称其错误。

### Status

**PROPOSED — OWNER APPROVAL REQUIRED**。

此项一旦冻结，必须用新的 `rule_profile_version` 保护历史结果。

---

## 5.4 LATE_ZI_HOUR

### Recommended Selection

```text
23:00:00–23:59:59
day pillar = previous civil day
hour branch = ZI
hour treatment = LATE_ZI_SPLIT_PROFILE
```

V1 提议采用《命理探原》系统化的“夜子 / 子正分段”口径：

- 夜子仍属于前一日；
- 子正后属于新一日；
- 子时 branch 本身横跨午夜；
- **晚子时 hour stem 采用该 split-Zi profile 的专门起法，不得继续把“当前 civil day stem → hour stem”当成无争议传统规则。**

换言之，未来 implementation 必须把：

```text
day-pillar boundary
hour-branch boundary
late-Zi hour-stem convention
```

拆成三个明确规则，不允许一个 `hourPillar(dayStem, hour)` 隐式包办全部语义。

### Current Compatibility Impact

当前 production 规则：

```text
23:00–23:59
same civil day
+ hour stem derived from same day stem
```

新提议若批准，将使一部分 `23:00–23:59` 命盘的时干发生变化。

必须：

- bump `rule_profile_version`；
- 保留旧结果版本；
- 建 golden vectors；
- 不静默改历史 result。

### Ambiguity

即使 profile 已选定，若用户出生在 23:00–00:59，也可记录：

```text
SCHOOL_SENSITIVITY_LATE_ZI
```

表示其他流派可能给出不同日 / 时柱，不等于本 profile 本身不确定。

---

## 5.5 TIMEZONE / DST

### Decision

```text
TIMEZONE = IANA_ZONE_AT_BIRTH
DST = HISTORICAL_OFFSET_AT_BIRTH
```

- 使用出生地对应 IANA timezone；
- 使用历史 offset，不使用今天的 offset 推测历史；
- DST gap：fail closed；
- DST overlap：必须有 resolved instant / explicit offset disambiguation；
- 下游不得重新猜 occurrence。

该部分属于可靠工程事实，不是命理流派选择。

---

## 5.6 TRUE_SOLAR_TIME

### Recommended Selection

```text
DEFAULT_TIME_BASIS = LOCAL_CIVIL_TIME
TRUE_SOLAR_TIME_CORRECTION = OFF_BY_DEFAULT
```

### Definitions

```text
Civil Time
= 当地法定标准时间，含历史 timezone / DST

Local Mean Solar Time
= 按经度相对标准经线修正后的地方平太阳时

Local Apparent / True Solar Time
= Local Mean Solar Time + Equation of Time
```

现代天文学上，apparent solar time 与 mean solar time 的差可达约十余分钟；同一时区内经度偏离标准经线还会额外产生每度约 4 分钟的地方时差。

### Why Civil Time Is Selected For V1

1. 传统文本并没有提供一套“现代时区 + DST + 经度 + Equation of Time”的统一八字公式；
2. 自动套现代真太阳时公式，会把现代天文工程选择包装成“古法唯一标准”；
3. 出生证明 / 用户记忆记录的通常是当地 civil time；
4. V1 优先追求 rule transparency（规则透明）和 reproducibility（可复现）。

### Advanced Profile

V1 不开放另一个并列 authority profile。

未来可研究：

```text
ziping-solar-time-v1.x
```

但必须独立版本化，不得偷偷改变 `ziping-v1.0.0`。

### Ambiguity Policy Near Boundaries

若未来系统能够计算 solar-time alternative，并且：

```text
civil-time chart bucket
!=
solar-time chart bucket
```

例如跨越：

- 时支边界；
- 午夜日界；
- 立春 / 节气边界；

则记录：

```text
TRUE_SOLAR_TIME_BOUNDARY
```

不需要人为设“±15 分钟”一类阈值；直接比较两个明确 profile 的结果是否不同。

---

# 6. Month Command Profile（月令 / 提纲规则）

这是 V1 Traditional Pattern 的核心。

## 6.1 Fundamental Rule

```text
PATTERN_HOST_SOURCE = MONTH_COMMAND
```

月令优先级来自结构语义，不来自数值权重。

## 6.2 Terminology

V1 固定区分：

```text
MONTH_BRANCH
月柱地支

MONTH_HIDDEN_QI
月支藏干：main / middle / residual

EXPOSED_MONTH_QI
月支某藏干在年 / 月 / 时天干透出

MONTH_HOST_STEM
当前 Rule Profile 选定的月令 host stem

PATTERN_HOST
MONTH_HOST_STEM 与日主建立十神关系后对应的格局宿主
```

`month commander` 不等于“月支元素”。

## 6.3 Hidden Qi Order

保留 current canonical hidden-stem table 的传统顺序：

```text
main qi
→ middle qi
→ residual qi
```

但：

- **删除它们作为传统 authority 的 0.6 / 0.3 / 0.1 或 0.7 / 0.3 百分比含义**；
- 这些浮点权重可作为 legacy engineering analytics，但不得参与 pattern adjudication（格局裁决）。

## 6.4 Human-Regent / Day-Count Commander Tables（人元司令日表）

《渊海子平》等传统材料存在按节后天数划分司令的歌诀。

V1 决定：

```text
DAY_COUNT_MONTH_COMMANDER = NOT AUTHORITY IN ziping-v1.0.0
```

原因：

- 不同整理存在表格 / 日数差异；
- 《子平真诠》主线更适合以月令藏气层级、透干、会合变化组织 pattern host；
- 若同时启用“司令日表 + 透干优先”，会制造两个 competing host source。

未来若要研究，必须开独立 profile，不得混入 V1。

## 6.5 Host Selection Decision Tree（确定性决策树）

### Step 0 — Validate calendar facts

必须先有：

- exact / adequately resolved month branch；
- canonical hidden stems；
- day master；
- visible year / month / hour stems；
- birth-time uncertainty metadata。

若月令本身因未知出生时间跨节而不确定：

```text
RETURN AMBIGUOUS
```

禁止继续强判。

### Step 1 — Check self-rooted special hosts

依次检查：

```text
exact JIAN_LU
exact YANG_REN (if approved)
```

它们是月支位置事实，不由全盘 Ten-God 数量决定。

### Step 2 — Collect exposed month-hidden candidates

只从月支藏干产生 host candidates。

Exposure positions：

```text
year stem
month stem
hour stem
```

日干是 reference / day master，不作为“月令藏干透出”的 candidate exposure。

### Step 3 — Select by hidden-qi hierarchy

规则：

```text
main qi exposed
→ choose main qi

main not exposed + middle exposed
→ choose middle qi

main/middle not exposed + residual exposed
→ choose residual qi

none exposed
→ fall back to main qi as unexposed month basis
```

这直接对应《子平真诠》“本主不透，而次气透出可作主”的结构思想。

### Step 4 — Multiple exposure

如果 main / middle / residual 多个同时透出：

```text
main > middle > residual
```

V1 **不使用**：

- 透出次数；
- 月干 > 时干 > 年干的人为 score；
- 全盘出现数量；

去推翻藏气层级。

其他透出的 month qi 进入：

```text
secondary_pattern_candidate[]
```

而不是丢失。

### Step 5 — Convert host stem to Ten God

将 `MONTH_HOST_STEM` 相对于 day master 转成：

```text
ZHENG_GUAN
QI_SHA
ZHENG_CAI
PIAN_CAI
ZHENG_YIN
PIAN_YIN
SHI_SHEN
SHANG_GUAN
BI_JIAN
JIE_CAI
```

### Step 6 — Route self-type host

若 host = `BI_JIAN / JIE_CAI`：

- exact lu position → `JIAN_LU`；
- exact five-yang blade position → `YANG_REN`（若批准）；
- selected month qi = `JIE_CAI` 且不属于 Yangren host → `YUE_JIE`；
- 其他 self-qi 情形不得伪造成建禄，返回 `SELF_MONTH_HOST / NO_STABLE_REGULAR_PATTERN`，再看是否有传统上可明确承接的财官煞食结构。

### Step 7 — Formation / transformation check

《子平真诠》明确存在三合 / 会支导致月令结构变化。

但当前 production relation engine 尚没有足够的：

- 三合 / 三会；
- conditional transformation；
- transformation validity；

因此 `ziping-v1.0.0` 规定：

```text
FULL_FORMATION_EXISTS
→ record evidence

IF transformation would change Pattern Host
AND transformation validity is not fully supported by locked relation rules
→ MONTH_COMMAND_TRANSFORMATION_UNRESOLVED
→ pattern_status cannot be CLEAR
```

禁止为了“先跑起来”直接把见三支就当作已化。

---

# 7. Strength Profile（日主旺衰）

## 7.1 Principle

当前：

```text
support_ratio >= 0.58 → strong
support_ratio <= 0.42 → weak
```

正式退出 Traditional Pattern authority。

V1 不创建新的“63.7% 身强”。

## 7.2 Traditional Evidence Axes

V1 使用四组 qualitative evidence（定性证据）：

```text
DE_LING   得令
DE_DI     得地 / 通根
DE_SHI    得势 / 得助
ZHI_HUA   制化 / 泄耗 / 生扶关系
```

### DE_LING

记录：

- 月令 / host qi 与日主的季节关系；
- 同类 / 印生是否得时；
- 输出 / 财 / 官杀是否使日主处退气、泄耗或受制状态。

不得仅凭“出生在某月”直接结束强弱判断。

### DE_DI / ROOT

根气采用 categorical vocabulary（类别证据），不使用浮点：

```text
ROOT_MAIN_QI
ROOT_MIDDLE_QI
ROOT_RESIDUAL_QI
NO_ROOT
```

同时记录 pillar position，不把位置偷偷换成权重。

### DE_SHI

记录：

- visible 比劫；
- visible 印；
- 它们是否自身有根；
- 对立的财官食伤是否成势 / 有根 / 有有效会局。

### ZHI_HUA

记录：

- 生；
- 克；
- 泄；
- 制；
- 合；
- 冲；
- 已验证的 transformation。

未验证的“合化”不得作为已发生的 strength fact。

## 7.3 Material Evidence（关键证据）

V1 不用 numeric weight，改用结构门槛：

以下可视为 material（足以改变判断的关键证据）：

- month command / host qi；
- main-qi root；
- visible stem + confirmed root；
- complete validated formation；
- 直接改变 Pattern Host / support chain 的生克制化；
- 对 Pattern Host 的 material clash / combination damage。

孤立、无根、无结构承接的单个天干，只记录，不自动升级为 dominant force（主导力量）。

## 7.4 Output Labels

```text
STRONG
LEAN_STRONG
BALANCED_MIXED
LEAN_WEAK
WEAK
AMBIGUOUS
```

## 7.5 Conservative Decision Logic

### STRONG

满足：

```text
得令支持日主
AND
至少有 material 得地 / 得势证据
AND
无同等级 opposing structure 足以推翻
```

### LEAN_STRONG

例如：

- 得令，但财官食伤成势形成明显反证；
- 失令，但通根与有根印比形成清晰支持。

### WEAK

满足：

```text
失令 / 月令明显泄耗克制
AND
无 material root
AND
无有根印比救助
AND
对立结构明确成立
```

### LEAN_WEAK

失令 / 受制为主，但仍有不可忽略的根或支持。

### BALANCED_MIXED

支持与对立两侧都有 material evidence，并且当前 profile 没有传统结构优先规则可把一侧清掉。

### AMBIGUOUS

以下任一成立：

- 未知时柱可能实质改变根 / 合 / 冲 / pattern support；
- unresolved transformation；
- follow-structure borderline；
- 两个传统规则 profile 会反转强弱结论。

## 7.6 Important Limitation

此 Profile 冻结的是：

> **旺衰看什么证据，以及怎样保守表达。**

不是宣称已经有一套跨流派统一的绝对强弱数学算法。

未来 implementation 若为了方便又把这些 evidence 转成隐藏的 0–100 score 决定结论，视为违反本 Rule Profile。

---

# 8. Regular Pattern Rules（普通格局）

V1 支持 8 个 regular month-host patterns：

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

另有 self-rooted：

```text
JIAN_LU
YUE_JIE
YANG_REN  // if owner approves SC-06
```

## 8.1 Candidate Generation

Pattern Candidate 必须来自：

```text
month command / month hidden qi / exposure
```

而不是：

```text
tenGodDistribution
```

## 8.2 Primary Pattern

`primary_pattern` = 在 Month Command Profile 下得到的稳定 host。

只有在：

- host evidence 明确；
- 无 unresolved transformation；
- 无跨 profile material disagreement；

时才能标成 clear primary。

## 8.3 Secondary Pattern

`secondary_pattern` 允许存在，当且仅当它：

- 来自另一月令藏气且明确透出；或
- 是对 primary pattern 有方向性的、已经成立的结构承接；或
- 是足够 material 的 competing traditional structure。

Secondary 不是“candidate_score 第二名”。

---

# 9. Jianlu / Yuejie（建禄 / 月劫）

## 9.1 JIAN_LU

### Definition

```text
JIAN_LU = month branch == day master's Lu branch
```

V1 Lu mapping：

```text
甲寅 乙卯
丙巳 丁午
戊巳 己午
庚申 辛酉
壬亥 癸子
```

这是月令位置条件，不是“比肩出现很多”。

### Structure Rule

建禄本身不能直接等于一个最终行为人格。

后续必须另看：

```text
透官 + 财/印承接
透财 + 食伤承接
透煞 + 制化
或其他明确的财官煞食结构
```

## 9.2 YUE_JIE

### Definition

```text
YUE_JIE = selected month host qi is JIE_CAI
AND not classified as approved YANG_REN host
```

即：

```text
“劫财出现” != 月劫
```

必须是 **月令 host**。

### Structure Rule

同建禄：月劫只是 self-rooted host，必须再看四柱财官煞食如何承接。

## 9.3 Public Proxy Warning

现有：

```text
比肩 → 犟种 / 建禄 proxy
劫财 → 撒币 / 月劫 proxy
```

只属于 presentation legacy（展示遗留）。

它不得反向定义：

```text
Traditional JIAN_LU
Traditional YUE_JIE
```

---

# 10. Yangren / Yang Blade（阳刃 / 羊刃）

## 10.1 Recommended Rule

```text
YANG_REN_CONVENTION = FIVE_YANG_ONLY
```

采用《渊海子平》明确口径：

```text
甲 丙 戊 庚 壬
```

五阳干论刃；五阴干不自动配置真阳刃。

V1 exact blade positions：

```text
甲 → 卯
丙 → 午
戊 → 午
庚 → 酉
壬 → 子
```

## 10.2 Role

提议：

```text
YANG_REN = SPECIAL_SELF_ROOTED_PATTERN_HOST
```

而不是普通“劫财很高”的 modifier。

原因：《子平真诠》本身对阳刃单列成败与官杀制刃结构；若只把它藏成一个无权重 tag，会丢失主线传统结构。

## 10.3 Yin Stems

```text
乙 丁 己 辛 癸
→ no automatic YANG_REN
```

若月令为劫财，按 `YUE_JIE` / month host 规则处理。

## 10.4 Alternative Views

存在：

- 十干皆设羊刃位；
- 阴干也按某种逆行帝旺 / 劫财定义刃；
- 阳刃只作神煞，不作格局。

这些不混入 `ziping-v1.0.0`。

### Status

**PROPOSED — OWNER APPROVAL REQUIRED**。

---

# 11. Formation State（成败破救）

## 11.1 V1 State Vocabulary

提议：

```text
FORMED_CLEAR
FORMED_IMPURE
FAILED
BROKEN
BROKEN_RESCUED
NOT_FORMED
AMBIGUOUS
```

### Traditional-semantic warning

《子平真诠》原文核心词是：

```text
成
败
带忌
救应
```

“FAILED vs BROKEN” 是为了机器可解释性作的 **V1 implementation semantic split（工程语义拆分）**：

```text
FAILED
= formation prerequisites 从未满足，或直接命中明确“败”条件

BROKEN
= 已存在 formation support chain，但被 material counter evidence 破坏
```

不得宣称古籍在所有章节都严格按这两个英文状态区分。

## 11.2 Formation Rule Principle

每一个 pattern 必须有自己的：

```text
support_rules[]
damage_rules[]
rescue_rules[]
```

禁止做：

```text
“吉神 +1 / 凶神 -1”
```

## 11.3 V1 Clear Formation Signatures

以下只锁最清晰、可测试的主线签名；未覆盖的复杂组合返回 `AMBIGUOUS`，不自由发挥。

### ZHENG_GUAN

Support：

- 财生官；
- 印护官 / 官印配合；
- 财印并见但不互相直接破坏。

Damage：

- 伤官 material 克官；
- 官星被 material 冲 / 合去而失用；
- 官杀混杂且未取清。

Rescue：

- 印制伤护官；
- 合杀留官；
- validated 会合解冲。

### WEALTH — ZHENG_CAI / PIAN_CAI

Support：

- 财生官；
- 食神生财，且 day master strength context 能任；
- 财 / 印位置与关系不互破的明确结构。

Damage：

- 比劫 material 争财；
- 财党七杀而无制；
- 财印直接破坏 host support chain。

Rescue：

- 食伤化劫生财；
- 官制劫护财；
- 合去 material 七杀而存财。

### RESOURCE — ZHENG_YIN / PIAN_YIN

V1 clear support：

- 官生印；
- 七杀生印且形成明确化杀链；
- 身印均强时有食伤泄秀（仅在 strength evidence clear 时）。

Damage：

- 财 material 破印；
- 结构已经过旺却再由杀生印，形成明确反向链。

复杂“印多用财”只在根气 / strength 证据足够时裁决；否则 ambiguity。

### SHI_SHEN

Support：

- 食神生财；
- 食神制杀且无财党杀。

Damage：

- 枭印 material 夺食；
- 食生财而又财党杀。

Rescue：

- 财制枭护食；
- 满足严格条件时弃食就杀 / 印化杀。

### QI_SHA

Support：

- day master 有承载能力，食神有效制杀；
- 或杀印结构明确、印能化杀。

Damage：

- 财生杀而无制；
- 制杀与化杀互相破坏；
- 官杀混杂未清。

### SHANG_GUAN

Support：

- 身能任：伤官生财；
- 身偏弱：伤官佩印且印有根；
- 伤官驾杀且无财党杀的明确结构。

Damage：

- material 伤官见官；
- 生财又带杀导致财党杀；
- 佩印但印被财破。

“金水伤官见官”的调候例外 V1 不自动泛化；若命中此争议情形返回 ambiguity / deferred 调候 evidence。

### JIAN_LU / YUE_JIE

Support：

- 透官 + 财 / 印；
- 透财 + 食伤；
- 透杀 + 有效制伏。

Damage：

- 无财官，杀印反增 self-rooted 势而无制；
- 官被伤；
- 财带杀且无解。

Rescue：

- 合伤存官；
- 合杀存财；
- 其他明确 directional rescue。

### YANG_REN

Support：

- 官 / 杀有效制刃；
- 财 / 印能支持该官杀链且不相碍。

Damage：

- 无官杀；
- 官杀被食伤破坏 / 合去而失制刃作用。

Rescue：

- 重印护官杀等明确 rescue chain。

## 11.4 FORMED_IMPURE

Primary formation 已成立，但存在：

- non-fatal competing structure；
- counter evidence 尚不足以破格；
- secondary pattern material；
- 结构有病但尚未直接摧毁 host chain。

返回：

```text
FORMED_IMPURE
+ counter_evidence[]
```

而不是伪装成 `FORMED_CLEAR`。

---

# 12. Mixed Structures（兼格 / 混合结构）

## 12.1 Output Modes

V1 必须支持：

```text
PRIMARY_WITH_SECONDARY
MIXED
NO_STABLE_SINGLE_PATTERN
```

## 12.2 PRIMARY_WITH_SECONDARY

当：

- 月令主 host 清楚；
- 另一个结构 material；
- secondary 不足以推翻 host；

输出：

```text
primary_pattern
secondary_patterns[]
pattern_status = PRIMARY_WITH_SECONDARY
```

## 12.3 MIXED

以下可触发：

- 官杀并透 / 并有根且未取清；
- 多个月令藏气 candidate 同时透出并通过后续结构形成实质竞争；
- host + transformation candidate 竞争；
- 两个 formation chain 都 material，现 profile 无传统优先规则可清掉一侧。

## 12.4 NO_STABLE_SINGLE_PATTERN

当：

- 月令为 self-qi，但无法稳定进入建禄 / 月劫 / 阳刃，且四柱也没有足够明确的承接；
- unresolved transformation 会改变 host；
- pattern evidence 明显互相冲突；
- 关键出生时间缺失导致两个不同传统结果均成立。

禁止为了 Public Personality 强制选一个。

---

# 13. Follow Structures（从格 / 假从）

## 13.1 Policy

从格是高风险 adjudication。

V1 采用：

> **Strict whitelist（严格白名单） + candidate + ambiguity。**

## 13.2 V1_SUPPORTED_STRICT

### FOLLOW_WEALTH_STRICT（严格从财）

只在以下传统证据同时满足时允许 final verdict：

```text
day master has NO material root
AND no rooted peer/resource can restore self
AND wealth structure is structurally dominant / coherent
AND no competing officer/kill structure forces a different host
AND no unresolved transformation
```

若印星有 material root 或比劫形成有效 self-support，则不从。

### FOLLOW_QI_SHA_STRICT（严格从杀）

只在：

```text
day master has NO material root
AND officer/kill structure is coherent and dominant
AND no material output control breaks kill structure
AND no rooted resource turns structure into ordinary kill-resource configuration
AND no unresolved transformation
```

时可 final verdict。

## 13.3 V1_EVIDENCE_ONLY / CANDIDATE

以下只输出：

```text
FOLLOW_STRUCTURE_CANDIDATE
```

不自动 final：

- 从儿 / 从食伤；
- 泛化从弱；
- 从强；
- 专旺；
- 从势；
- 复杂 multi-element follow。

## 13.4 FAKE_FOLLOW（假从）

```text
FAKE_FOLLOW = DEFERRED / AMBIGUOUS IN V1
```

原因：

“有微根但能否弃、某根是否受制到可忽略、某印是否虚浮”等在不同体系中高度依赖精细强弱判断。

V1 不用人为 score 猜假从。

## 13.5 Failed Follow

若出现：

- material root；
- rooted peer/resource；
- 有效 rescue self；

必须记录：

```text
FOLLOW_CONDITION_FAILED
```

而不是“差一点所以给假从”。

---

# 14. Special Patterns（特殊格局）

## 14.1 V1_SUPPORTED

```text
8 regular month-host patterns
JIAN_LU
YUE_JIE
YANG_REN  // pending approval
FOLLOW_WEALTH_STRICT
FOLLOW_QI_SHA_STRICT
```

## 14.2 V1_EVIDENCE_ONLY

只记录候选证据：

- complete 三合 / 三会 potentially changing host；
- 专旺 / 一行得气；
- 从儿；
- 从势；
- 化气 candidate。

## 14.3 V1_DEFERRED

不自动裁决：

- 假从；
- 完整专旺五格（曲直 / 炎上 / 稼穑 / 从革 / 润下）的 final classification；
- 化气格 final classification；
- 飞天禄马；
- 倒冲；
- 井栏叉；
- 合禄 / 刑合 / 遥合；
- 六乙鼠贵等外格；
- 纳音格；
- 神煞格；
- 调候派独立格局；
- 盲派独立格局体系。

Traditional basis：

《子平真诠》本身强调“月令有用则不先求外格”；《渊海子平》也批评滥立若干格局名称。

V1 选择：

> **少而可解释，不多而不可验证。**

---

# 15. Combination Structures（组合结构）

## 15.1 General Rule

组合结构默认不是新的 mutually-exclusive primary pattern（互斥主格）。

它们应进入：

```text
PATTERN_MODIFIER
or
KEY_COMBINATION
```

并可作为：

```text
FORMATION_SUPPORT
FORMATION_DAMAGE
RESCUE
```

## 15.2 Directional Vocabulary

### 正官 host

```text
ZHENG_GUAN + RESOURCE
→ RESOURCE_PROTECTS_OFFICER
（正官佩印 / 印护官）
```

### 印 host

```text
RESOURCE + ZHENG_GUAN
→ OFFICER_GENERATES_RESOURCE
（印绶用官 / 官生印）
```

二者不可合并成无方向的 `HAS_OFFICER_AND_RESOURCE`。

### 七杀 host

```text
QI_SHA + RESOURCE
→ RESOURCE_TRANSFORMS_QI_SHA
```

### 印 host + 七杀

```text
RESOURCE + QI_SHA
→ QI_SHA_GENERATES_RESOURCE
```

### 食神 host / 食神结构

```text
SHI_SHEN + QI_SHA
→ SHI_SHEN_CONTROLS_QI_SHA
```

### 财生官

```text
WEALTH + OFFICER
→ WEALTH_GENERATES_OFFICER
```

### 伤官生财

```text
SHANG_GUAN + WEALTH
→ SHANG_GUAN_GENERATES_WEALTH
```

### 食神生财

```text
SHI_SHEN + WEALTH
→ SHI_SHEN_GENERATES_WEALTH
```

### 伤官配印

```text
SHANG_GUAN + RESOURCE
→ SHANG_GUAN_WITH_RESOURCE
```

是否为“佩印成格”仍需 strength / root / damage rules 验证。

## 15.3 Do Not Flatten Host Direction

禁止：

```text
官 + 印 = 官印相生（不管谁是 host）
杀 + 印 = 杀印相生（不管谁是 host）
财 + 食 = 食神生财（不管月令是谁）
```

host direction 是 Traditional Pattern evidence 的一部分。

---

# 16. Evidence Vocabulary（证据词汇）

未来 `TraditionalPatternResult` 至少应支持以下 machine-readable evidence codes。

## 16.1 Calendar Evidence

```text
CALENDAR.YEAR_BOUNDARY_LICHUN
CALENDAR.MONTH_BOUNDARY_JIE
CALENDAR.DAY_BOUNDARY_MIDNIGHT
CALENDAR.LATE_ZI
CALENDAR.TIMEZONE_IANA
CALENDAR.DST_OFFSET
CALENDAR.BIRTH_TIME_UNKNOWN
CALENDAR.BIRTH_TIME_APPROXIMATE
```

## 16.2 Month Command Evidence

```text
MONTH.BRANCH
MONTH.MAIN_QI
MONTH.MIDDLE_QI
MONTH.RESIDUAL_QI
MONTH.QI_EXPOSED_YEAR
MONTH.QI_EXPOSED_MONTH
MONTH.QI_EXPOSED_HOUR
MONTH.HOST_SELECTED_MAIN
MONTH.HOST_SELECTED_MIDDLE
MONTH.HOST_SELECTED_RESIDUAL
MONTH.HOST_MAIN_UNEXPOSED_FALLBACK
MONTH.SELF_QI
```

## 16.3 Root / Strength Evidence

```text
ROOT.MAIN_QI
ROOT.MIDDLE_QI
ROOT.RESIDUAL_QI
ROOT.NONE
STRENGTH.DE_LING
STRENGTH.LOSE_LING
STRENGTH.DE_DI
STRENGTH.DE_SHI
STRENGTH.SUPPORT_ROOTED
STRENGTH.OPPOSITION_ROOTED
```

## 16.4 Relation Evidence

```text
RELATION.GENERATES
RELATION.CONTROLS
RELATION.STEM_COMBINATION
RELATION.BRANCH_LIUHE
RELATION.BRANCH_CLASH
RELATION.BRANCH_HARM
RELATION.BRANCH_PUNISHMENT
RELATION.BRANCH_BREAK
RELATION.THREE_HARMONY
RELATION.THREE_MEETING
RELATION.TRANSFORMATION_VALIDATED
RELATION.TRANSFORMATION_UNRESOLVED
```

## 16.5 Pattern Evidence

```text
PATTERN.CANDIDATE
PATTERN.PRIMARY_HOST
PATTERN.SECONDARY_HOST
PATTERN.JIAN_LU_EXACT
PATTERN.YUE_JIE_MONTH_HOST
PATTERN.YANG_REN_EXACT
PATTERN.FORMATION_SUPPORT
PATTERN.FORMATION_DAMAGE
PATTERN.RESCUE
PATTERN.FOLLOW_CONDITION
PATTERN.FOLLOW_CONDITION_FAILED
```

## 16.6 Evidence Object Contract（未来实现建议）

```ts
interface TraditionalEvidence {
  code: string;
  effect: "support" | "counter" | "context";
  rule_id: string;
  pillar?: "year" | "month" | "day" | "hour";
  stem?: HeavenlyStem;
  branch?: EarthlyBranch;
  ten_god?: TenGod;
  related_pillars?: string[];
  source_ref: string;
  note?: string;
}
```

`source_ref` 指向 Rule Profile rule ID，不存一段 LLM 自由解释作为事实。

---

# 17. Counter Evidence（反证体系）

每个 primary / secondary candidate 都必须保留：

```text
evidence[]
counter_evidence[]
```

典型 counter codes：

```text
COUNTER.HOST_NOT_MONTH_DERIVED
COUNTER.HOST_QI_NOT_EXPOSED
COUNTER.OFFICER_DAMAGED_BY_OUTPUT
COUNTER.OFFICER_QI_SHA_MIXED
COUNTER.WEALTH_CONTESTED_BY_PEER
COUNTER.RESOURCE_DAMAGED_BY_WEALTH
COUNTER.FOOD_BLOCKED_BY_RESOURCE
COUNTER.QI_SHA_UNCONTROLLED
COUNTER.CONTROL_TRANSFORM_COMPETE
COUNTER.FORMATION_CLASHED
COUNTER.HOST_TRANSFORMATION_UNRESOLVED
COUNTER.FOLLOW_HAS_ROOT
COUNTER.FOLLOW_HAS_RESOURCE_SUPPORT
```

示例：

```text
Candidate: SHANG_GUAN
Evidence:
- month hidden shang_guan exposed

Counter:
- month main qi is zheng_guan and remains valid host
- no host-changing transformation

Result:
SHANG_GUAN cannot replace ZHENG_GUAN primary
```

---

# 18. Ambiguity Policy（歧义策略）

## 18.1 Ambiguity Is First-Class

系统允许：

```text
TraditionalPatternResult != always certain
```

## 18.2 Vocabulary

至少：

```text
INSUFFICIENT_BIRTH_TIME
APPROXIMATE_BIRTH_TIME
SOLAR_TERM_BOUNDARY_UNCERTAIN
LATE_ZI_SCHOOL_DISAGREEMENT
TRUE_SOLAR_TIME_BOUNDARY
MULTIPLE_PATTERN_CANDIDATES
MONTH_COMMAND_TRANSFORMATION_UNRESOLVED
RELATION_TRANSFORMATION_UNRESOLVED
OFFICER_QI_SHA_MIXED
FOLLOW_STRUCTURE_UNCERTAIN
SPECIAL_PATTERN_DEFERRED
SCHOOL_DISAGREEMENT
INSUFFICIENT_PATTERN_EVIDENCE
```

## 18.3 Deterministic Profile vs Ambiguity

即使 selected profile 本身确定，也可以记录：

```text
SCHOOL_DISAGREEMENT
```

例如 late Zi：

- 本 profile 给一个 deterministic result；
- 但 metadata 告诉专业层，另一已知流派会得到不同结果。

这不是“随机置信度”，而是规则来源差异。

## 18.4 Unknown Hour

unknown hour：

- 时柱必须为 null；
- 若 pattern host 完全由年月日可稳定判断，可继续给 pattern；
- 但若时干可能是唯一月令透干、唯一救应、唯一破格因素、唯一 material root / relation，则 formation state 必须降为 ambiguity；
- 不允许内部 noon placeholder 变成传统 evidence。

---

# 19. Deferred Rules（V1 延后规则）

`ziping-v1.0.0` 明确不自动裁决：

```text
人元司令精确日数表作为 authority
真太阳时自动校正
所有会合见即化
完整三刑 / 六破后的吉凶级别
假从
从儿 final
专旺 final
化气 final
全部外格 / 杂格
纳音格局
神煞格局
调候派独立用神体系
盲派制用体系
富贵贫贱等级
人格百分比
```

这些不是“不存在”，而是 V1 rule profile 不把它们混进同一 authority。

---

# 20. Rule Decision Records（逐项决策记录）

## RP-01 — Year Boundary

```text
Decision:
Year pillar boundary

Selected Rule:
Exact LiChun instant

Traditional Source:
Zi Ping seasonal / Jieqi tradition; later systematic Zi Ping manuals explicitly use LiChun

Alternative Views:
Lunar New Year; Gregorian Jan 1

Why Selected:
Matches Zi Ping seasonal month framework and existing deterministic astronomical boundary

Known Limitations:
Unknown/approximate birth time can straddle boundary

Implementation Consequence:
Keep exact instant; add ambiguity instead of noon authority

Version:
ziping-v1.0.0
```

## RP-02 — Day Boundary

```text
Selected Rule:
Local civil midnight 00:00

Alternative:
Zi-initial 23:00

Why Selected:
Historical calendrical “zi-half / midnight” evidence + later split-Zi systematic practice + modern deterministic timezone handling

Known Limitation:
Major school disagreement

Status:
OWNER APPROVAL REQUIRED
```

## RP-03 — Late Zi

```text
Selected Rule:
Night-Zi / Zi-zheng split profile

Alternative:
23:00 next-day day pillar; or current same-day + same-day hour-stem software convention

Why Selected:
Explicit later Zi Ping systematic rule, keeps day boundary distinct from hour branch start

Known Limitation:
Not universal ancient consensus; changes some current 23:xx hour stems

Status:
OWNER APPROVAL REQUIRED
```

## RP-04 — Time Basis

```text
Selected Rule:
Historical local civil time (IANA), no automatic true solar correction

Alternative:
Local mean solar time; local apparent solar time

Why Selected:
Traditional texts do not define one modern timezone/DST/longitude/EoT correction standard; civil records are reproducible

Known Limitation:
Solar-time schools can change edge cases

Status:
OWNER APPROVAL REQUIRED
```

## RP-05 — Month Host

```text
Selected Rule:
Month branch + hidden qi hierarchy + exposure

Alternative:
Exact day-count commander table; Ten-God max; numeric month weighting

Why Selected:
Directly follows Zi Ping Zhen Quan month-command / hidden-qi / exposure structure while avoiding competing authorities

Known Limitation:
Host-changing branch transformations require relation profile maturity

Status:
OWNER APPROVAL REQUIRED
```

## RP-06 — Yangren

```text
Selected Rule:
Five-yang-only, exact blade position, special self-rooted host

Traditional Source:
Yuan Hai Zi Ping + Zi Ping Zhen Quan pattern treatment

Alternative:
Ten-stem blade; modifier-only; evidence-only

Known Limitation:
Traditional/modern school disagreement remains

Status:
OWNER APPROVAL REQUIRED
```

## RP-07 — Strength

```text
Selected Rule:
Qualitative evidence: de-ling + roots + support/opposition + transformations

Alternative:
0.58/0.42 support ratio; other numerical strength systems

Why Selected:
Traditional sources explicitly warn “得时不旺、失时不弱” and require root / party / seasonal context

Known Limitation:
Some mixed cases must remain ambiguous

Status:
OWNER APPROVAL REQUIRED FOR PROFILE
```

## RP-08 — Formation State

```text
Selected Rule:
Pattern-specific support/damage/rescue signatures from Zi Ping Zhen Quan

Alternative:
Generic good/bad scoring

Why Selected:
Formation is directional and host-dependent

Known Limitation:
V1 only claims clear signatures; complex cases ambiguous

Status:
READY IN PRINCIPLE
```

## RP-09 — Follow Structures

```text
Selected Rule:
Strict From-Wealth / From-Kill only; other follow types candidate/deferred

Alternative:
Broad from-weak/from-strong/fake-follow classifier

Why Selected:
Classical strict examples exist; broad fake-follow boundaries are highly school-dependent

Known Limitation:
Requires reliable root / strength / relation evidence

Status:
OWNER APPROVAL REQUIRED
```

## RP-10 — Special Patterns

```text
Selected Rule:
Narrow whitelist; external/special patterns mostly deferred

Alternative:
Implement full ancient catalog

Why Selected:
Zi Ping mainline prioritizes month command and warns against unnecessary external patterns

Known Limitation:
Some valid rare charts will return SPECIAL_PATTERN_DEFERRED rather than a final name

Status:
READY IN PRINCIPLE
```

---

# 21. Rule Profile Version（版本）

提议正式 version：

```text
rule_profile_version = "ziping-v1.0.0"
```

该版本必须至少锁住：

```text
calendar convention
month command convention
hidden-qi priority
strength evidence vocabulary
regular pattern set
jianlu/yuejie/yangren convention
formation-state rules
follow-structure scope
special-pattern scope
relation transformation policy
evidence vocabulary
ambiguity vocabulary
```

现有：

```text
civil-local-jieqi-v1
```

只能理解为旧 Bazi Engine calendar / baseline rule profile，不能悄悄升级语义后仍用原版本名。

---

# 22. Implementation Contract（未来实现契约）

本节只是 contract，不是本轮 Build。

## 22.1 Ownership

```text
modules/bazi / traditional facts layer
owns TraditionalPatternResult
```

Interpretation 只能 consume（消费），不能自己取格。

## 22.2 Proposed Result Shape

未来至少需要：

```ts
TraditionalPatternResult {
  rule_profile_version
  pattern_status
  primary_pattern
  secondary_patterns[]
  formation_state
  strength_context
  follow_structure
  key_combinations[]
  evidence[]
  counter_evidence[]
  ambiguities[]
}
```

## 22.3 Required New Facts Before Pattern Adjudication

production implementation 前至少补齐：

- month host evidence；
- exposure evidence；
- root evidence；
- qualitative strength context；
- 三合 / 三会 existence；
- 刑 / 破 existence；
- relation transformation state：`validated / unresolved / not_transformed`；
- formation support/damage/rescue rules。

## 22.4 Forbidden Inputs

TraditionalPatternResult 不得读取：

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

## 22.5 Tests Required

至少覆盖：

### Calendar

- exact LiChun ±1s；
- exact Jie ±1s；
- 23:00 / 23:59 / 00:00 / 00:59；
- DST gap / overlap；
- unknown time on solar-term day。

### Pattern Host

每个 8 regular pattern：

- main qi exposed；
- main unexposed + middle exposed；
- residual exposed；
- none exposed；
- multiple exposed。

### Self-rooted

- 10 Jianlu mappings；
- Yuejie fixtures；
- five Yangren mappings；
- five Yin day masters must not auto-Yangren。

### Formation

每种 V1 pattern 至少：

```text
formed
formed_impure
damaged
rescued
ambiguous
```

### Host Direction

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
- strict from wealth；
- strict from kill；
- root breaks follow；
- fake-follow candidate must not auto-final。

## 22.6 No Silent Migration

任何未来 rule change：

```text
must bump rule_profile_version
```

历史结果必须能知道自己是：

```text
civil-local-jieqi-v1
or
ziping-v1.0.0
or future profile
```

---

# 23. Decisions Ready to Freeze（已有充分依据的部分）

从研究证据看，以下原则已经足够稳定，可由 Owner 一次批准后直接冻结：

1. 子平月令格局法为主体系；
2. 立春精确时刻换年；
3. 节气“节”切月；
4. 十神映射 / 藏干表作为传统结构 facts；
5. 月令不是数值权重；
6. `max(tenGodDistribution)` 不得取格；
7. 月令藏气 hierarchy + 透干是 V1 host 主线；
8. 建禄必须 exact Lu month position；
9. 月劫必须 month-host 劫财，不是全盘劫财多；
10. 旺衰不用百分比，至少看得令 / 得地 / 得势 / 制化；
11. 成败救应必须 pattern-specific；
12. combination 必须有 host direction；
13. Mixed / Ambiguous 是合法结果；
14. LLM / Personality Dimensions 不得进入 traditional verdict；
15. 外格 / 特殊格采用 narrow whitelist。

---

# 24. Owner Approval Required（负责人必须明确批准）

在 `ziping-v1.0.0` 正式 LOCKED 前，Owner 需要明确批准以下选择：

### OA-01 — 日界

```text
推荐：00:00 local civil midnight
备选：23:00 zi-initial
```

### OA-02 — 晚子时

```text
推荐：night-Zi / Zi-zheng split profile
```

并接受其对现有 23:00–23:59 时柱的兼容影响。

### OA-03 — 真太阳时

```text
推荐：V1 civil time default
不自动 TST correction
```

### OA-04 — 月令取格

```text
推荐：hidden-qi hierarchy + exposure
不启用 exact day-count commander table authority
```

### OA-05 — 阳刃

```text
推荐：五阳有刃 / 五阴无真刃
作为 special self-rooted Pattern Host
```

### OA-06 — 旺衰

```text
推荐：qualitative evidence profile
不采用 numeric percentage / threshold
```

### OA-07 — 从格

```text
推荐：只 strict 从财 / strict 从杀 final
其余 candidate / ambiguous / deferred
```

Owner Approval 未完成前：

```text
TraditionalPatternResult Implementation = BLOCKED
```

---

# 25. Final Proposed Profile（最终提案摘要）

```text
rule_profile_version = ziping-v1.0.0
status = PROPOSED

CORE:
Zi Ping month-command pattern method
Primary structural source = Zi Ping Zhen Quan
Cross reference = Yuan Hai Zi Ping + San Ming Tong Hui

CALENDAR:
year = exact LiChun
month = exact Jie
local timezone = historical IANA / DST
day = proposed local midnight 00:00
late Zi = proposed split profile
true solar time = off by default

MONTH HOST:
month branch
→ ordered hidden qi
→ exposed main / middle / residual hierarchy
→ unexposed main fallback
→ self-rooted special routing
→ transformation evidence / ambiguity

STRENGTH:
de-ling
+ roots
+ rooted support/opposition
+ validated transformations
→ qualitative band
(no percentage)

PATTERNS:
8 regular
+ Jianlu
+ Yuejie
+ proposed five-yang Yangren

FORMATION:
pattern-specific support / damage / rescue

MIXED:
primary + secondary
mixed
no stable single pattern
all allowed

FOLLOW:
strict from-wealth / from-kill only
others candidate/deferred

SPECIAL:
narrow whitelist
most external patterns deferred

EVIDENCE:
first-class evidence + counter evidence + ambiguities

FORBIDDEN:
Ten-God max
engineering candidate score
Personality Dimensions
LLM pattern judgment
product balancing
```

---

# 26. Freeze Gate（冻结门）

本文当前不是 Approved Decision。

正式进入下一阶段前必须：

```text
Owner reviews OA-01 ~ OA-07
→ Owner approves / modifies choices
→ docs/08_DECISION_LOG.md marks Rule Profile APPROVED / LOCKED
→ docs/09_CURRENT_STATE.md Rule Profile = LOCKED
→ docs/10_ROADMAP.md P0 moves to TraditionalPatternResult Implementation
→ only then Build
```

在此之前：

```text
DO NOT IMPLEMENT TraditionalPatternResult
DO NOT MODIFY production Bazi algorithm
DO NOT MODIFY Public Personality authority
```
