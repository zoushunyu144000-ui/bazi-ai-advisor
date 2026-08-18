# Traditional Pattern / 格局人格骨架研究

状态：Research only / 非生产规则  
分支：`research/traditional-pattern-taxonomy`  
日期：2026-08-18  
适用后续讨论：`personality-map/0.3.0` 候选，不代表已批准实现

> 本文研究“传统子平格局是否适合作为现代人格 Archetype 的上游骨架”。它不是科学心理学结论，也不是临床测量。本文不修改现有 `feature/interpretation-v1` / Archetype v0.2，不把研究假设写入生产算法。

---

## 0. Executive conclusion

本轮最重要的结论不是“再增加一批格局名字”，而是**重新明确传统事实层与人格解释层的边界**。

推荐未来数据流：

```text
02 Deterministic Bazi / Traditional Facts
  BaziChart
  + BaziDerivedFeatures
  + TraditionalPatternResult   ← 若批准，应由传统事实层产生
                  ↓
04 Interpretation
  InterpretationSignals
                  ↓
  PersonalityDimensions
                  ↓
  ArchetypeCandidate
                  ↓
05 / Product
  public personality name
  + meme copy
  + character asset
```

核心理由：传统子平格局不是“哪个十神占比最高”的别名。以《子平真诠》体系为主线时，月令是取格的第一坐标，还涉及月令藏干、透干、宾主、会合变化、强弱以及配合先后。**04 不能从现有十神百分比重新倒推出一套格局事实，否则会重新制造第二套传统命理事实。**

因此建议：

1. `TraditionalPatternResult` 若进入产品，应由 02/传统事实层以独立 `rule_profile_version` 产生；04 只消费。
2. 格局在人格模型里应作为 **prior / skeleton（一级骨架）**，不能直接等于最终人格。
3. 组合结构应优先表示为 **directional modifier**，不要把所有组合都硬编码成互斥的新格局。
4. 日主应作为 **temperament context**，不是“木=温柔、火=热情、金=冷酷”之类固定标签。
5. 现有 Archetype v0.2 不需要推翻；未来只需把 `TraditionalPatternResult` 放到它的上游证据链。

---

# 1. Research scope and source discipline

## 1.1 本轮主线流派

为了避免把民间不同体系混成一套，V1 研究主线选择：

**子平月令格局法，以《子平真诠》及其徐乐吾评注为主要结构参考。**

同时使用：

- 《三命通会》：用于观察更早、更广的传统条目与流派差异，例如羊刃定义；
- 开源项目：只作为“现代工程如何编码”的证据，不作为传统正确性的最终权威；
- 本项目现有 02 canonical facts contract：作为未来工程边界。

不在本轮把以下体系混入同一个规则 profile：

- 盲派制用体系；
- 调候派完整用神体系；
- 神煞格局；
- 纳音格局；
- 从格、化气格、专旺格的完整体系；
- 各类民间“外格”“奇格”全集。

这些可以作为未来独立研究 profile，但不能偷偷混进一个 `traditional-pattern/0.1.x`。

## 1.2 证据等级

### Tier A — 传统主线文本

优先：

- 《子平真诠》论用神、用神变化、格局高低、正官、财、印绶、食神、偏官、伤官、阳刃、建禄月劫；
- 《三命通会·论羊刃》作为羊刃流派差异的对照。

在线转录来源用于工程研究便利，不把网站的现代白话解释当作古籍原文。正文中引用观点时需区分“沈氏原文 / 徐注 / 网站现代解释”。

### Tier B — 开源工程实现

用于研究：

- 数据结构；
- 证据链；
- 月令、透干、建禄/月刃如何编码；
- 测试与可解释性策略。

开源实现不能替代传统 source-of-truth。

### Tier C — 多流派混合项目

只做 sanity/reference。若代码把《子平真诠》、盲派、调候、现代人格文案混在同一判定函数，**不得直接复制为本项目的 deterministic rule profile**。

---

# 2. 传统格局的核心共识、常见规则与争议

## 2.1 核心共识：月令不是普通的“一个十神”

《子平真诠·论用神》的主线是：

- 先以日干配月令；
- 月令是当旺之气，是格局的第一坐标；
- 财、官、印、食、煞、伤、劫、刃的“顺用/逆用”要看整体配合；
- 建禄、月劫月令本身不能简单充当普通用神，需要再从四柱取财官煞食等结构。

工程含义：

```text
DO NOT:
max(tenGodDistribution) -> primary_pattern

DO:
month-command/month-branch basis
+ exposure / hidden-stem basis
+ canonical strength/context
+ formations / transformation if supported
+ supporting and counter evidence
-> pattern candidate/status
```

## 2.2 核心共识：同样两个十神同时出现，不代表同一种结构

《子平真诠》明确批评“只看到两个标签就合并命名”的做法。典型区别：

- **正官佩印**：月令/host 是正官，印的角色可能是护官、制伤；
- **印绶用官**：host 是印，官的角色是生印或作为另取之用；
- **煞格逢食又露印** 与 **印绶逢煞** 不能都叫“杀印相生”；
- **财格透食** 与 **食神生财** 虽都出现财+食，其宾主和喜忌不同；
- **煞格逢刃** 与 **阳刃露煞** 的 host 相反。

这对机器模型非常重要：modifier 必须**带方向/host**。

错误设计：

```text
HAS_OFFICER_AND_RESOURCE
HAS_QI_SHA_AND_RESOURCE
```

更好的研究方向：

```text
primary = ZHENG_GUAN
modifier = RESOURCE_PROTECTS_OFFICER

primary = RESOURCE
modifier = OFFICER_GENERATES_RESOURCE

primary = QI_SHA
modifier = RESOURCE_TRANSFORMS_QI_SHA

primary = RESOURCE
modifier = QI_SHA_GENERATES_RESOURCE
```

最终命名可以再简化给产品，但 deterministic evidence 不应丢失方向。

## 2.3 核心共识：格局“清/杂、成/败、有情/无情、有力/无力”比名字本身重要

《子平真诠·论用神格局高低》强调，同名格局高下会因配合是否有情、有力而变化；《论四吉神能破格》也明确说明财官印食并非固定“好”，放错结构同样会破格。

对本项目的启发不是实现“吉凶等级”，而是：

- `primary_pattern` 只回答骨架；
- `evidence_keys` 回答为什么成立；
- `counter_evidence_keys` 回答哪里存在相反证据；
- `pattern_status` 回答结构是否清晰；
- personality 的 `positive_mode / stress_mode` 可以消费“配合顺畅 vs 受阻”的结构信息，但不能把古代富贵贫贱结论直接翻译成人格价值判断。

---

# 3. 常见格局分类研究

下面把“传统结构事实”和“未来人格骨架假设”分开写。

## 3.1 正官 `ZHENG_GUAN`

### 传统结构

主线：月令取正官，或月令体系中正官成为明确 host。常见配合包括：

- 财生官；
- 印护官 / 正官佩印；
- 官要清，官杀混杂常被视为需要取清；
- 伤官直接损官是典型 counter evidence，但是否构成真正破格仍须看印、合、位置、强弱等。

### 人格骨架研究假设

可以作为 `AUTHORITY` family 的一个子型 prior：

- 结构/标准感；
- 对角色责任与规则的敏感；
- 规划与可预测性偏好。

但不能直接推出“守规矩”“体制内”“保守”。如果同时有强输出、偏财机会结构、弱结构维度等，现实人格可能完全不同。

## 3.2 七杀 / 偏官 `QI_SHA`

### 传统结构

常见关键关系：

- 食神制杀；
- 杀印相生 / 煞用印；
- 官杀混杂作为 counter evidence；
- 制杀与化杀并见时，在不同体系中有细致取舍，不可简单累加“食神+印=更强”。

《子平真诠·偏官取运》进一步说明食制的轻重、日主根气、印夺食等会改变结构。

### 人格骨架研究假设

仍属于 `AUTHORITY`，但应与正官分离：

- 对压力、竞争、强约束的反应方式；
- 快速决策/边界执行的潜在 prior；
- 在 `QI_SHA_WITH_RESOURCE` 与 `SHI_SHEN_CONTROLS_QI_SHA` 下，现实表达可能明显不同。

不能直接写成“霸气、狠、领导力强”。

## 3.3 正财 `ZHENG_CAI` / 偏财 `PIAN_CAI`

### 传统结构

《论财》强调财往往不是孤立使用：

- 财生官；
- 食伤生财；
- 比劫夺财需看有无护化；
- 身弱是否能任财也是结构条件之一。

古典章节常把正偏财合论，但本项目机器层仍有理由保留正财/偏财，因为 02 canonical Ten-God 已区分，两者可在现代行为层形成不同 candidate evidence。

### 人格骨架研究假设

`WEALTH` family 不应翻译成“爱钱”。更合适的行为 prior 是：

- 资源配置；
- 现实交换/机会识别；
- 结果与可兑现性；
- 与 planning / risk / social adaptation 等现代维度组合。

正偏差异必须由数据与传统结构共同决定，不先写成“正财稳定、偏财投机”的网络标签。

## 3.4 正印 `ZHENG_YIN` / 偏印 `PIAN_YIN`

### 传统结构

《论印绶》在传统章节里常把正偏印一起讨论，常见组合：

- 官生印 / 官印结构；
- 杀生印；
- 印旺以食伤泄；
- 财破印在特定 host 下构成 counter evidence。

尤其需要注意：

```text
primary = RESOURCE + officer
!=
primary = OFFICER + resource
```

### 人格骨架研究假设

`RESOURCE` family 可以给出：

- 框架吸收、学习、内化；
- 解释/模式发现；
- 信息处理方式。

但不能写成“正印善良、偏印孤僻”。偏正差异需要和 novelty、sensitivity、learning、structure 等 dimensions 共同落地。

## 3.5 食神 `SHI_SHEN`

### 传统结构

常见：

- 食神生财；
- 食神制杀；
- 印/枭对食神的影响需要看 host、强弱与位置；
- 食神格并不等于只要出现食神。

### 人格骨架研究假设

`OUTPUT` family：

- 生成/表达/输出；
- 把内部能力转成作品、服务或结果；
- 与 social adaptation、learning、expression dimensions 联动。

不能直接等于“会享受、佛系、吃货”。

## 3.6 伤官 `SHANG_GUAN`

### 传统结构

《子平真诠》认为伤官格变化尤其多，常见：

- 伤官生财；
- 伤官佩印/印制伤官；
- 伤官见官的判断高度依赖 host、季节、配合与救应；
- 伤官带杀还有制化问题。

### 人格骨架研究假设

`OUTPUT` family，但可能更强调：

- 独立表达；
- 对既有结构的质疑/重构；
- novelty 与 autonomy 的潜在 prior。

**禁止**：`伤官旺 = 叛逆`。

人格输出必须经过 modifier + strength/context + modern dimensions。

---

# 4. SELF / PEER：建禄、月劫、羊刃为什么不能简单当“比劫格”

## 4.1 建禄 `JIAN_LU`

《子平真诠》：月建逢日主禄位为建禄；建禄月劫本身还要“别取财官煞食为用”。

这意味着在人格机器层，建禄更像一个 **host / self-rooted context**，而不是完整终点 persona。

建议 family 名研究为：

```text
SELF_ROOTED
```

而不是只叫 `PEER`。

因为一个建禄结构可以进一步表现为：

```text
JIAN_LU + OFFICER
JIAN_LU + WEALTH_WITH_OUTPUT
JIAN_LU + QI_SHA_CONTROLLED_BY_OUTPUT
```

这些比“比肩高”更能解释行为骨架。

## 4.2 月劫 `YUE_JIE`

月令为劫/禄劫体系时，同样要看后续财官煞食的承接。对于人格层：

- 可以提供自主/同侪竞争/自我驱动的 prior；
- 但绝不能直接把 `月劫 = 争夺型人格`；
- 其最终表达高度依赖“用官、用财带食、用杀带制”等次级结构。

因此未来可考虑：

```text
primary_pattern = YUE_JIE
secondary_pattern = ZHENG_GUAN | ZHENG_CAI | QI_SHA | OUTPUT...
```

或把这些放在 `pattern_modifier[]`。

## 4.3 羊刃 / 阳刃 `YANG_REN`

这里存在明确流派/文本差异，必须打 `disputed` 标签，而不是悄悄选一派。

- 《子平真诠》及徐注强调“惟五阳有之”，即甲丙戊庚壬五阳干的阳刃；
- 《三命通会·论羊刃》收录的论述中又可见十干“极盛之地”的更广表述，并混有更早命书材料；
- 现代项目也有“阳干才有真刃，阴干按劫财”与“十干皆配置羊刃位”的不同实现。

### 本研究建议

V1 最小格局不要为了数量强行统一羊刃。

若未来必须支持：

```text
pattern_status = disputed
rule_profile_version = explicit convention
```

例如 profile 可以明确“ziping-zhenquan-five-yang”而不是假装这是所有流派共识。

在没有 explicit profile 前，04 人格层不应自行把某月支推成 `YANG_REN`。

---

# 5. 组合结构 / Pattern Modifier 研究

## 5.1 为什么需要 modifier

同一个 host pattern，配合不同，会产生非常不同的传统结构和现代行为解释空间。

建议未来结构：

```ts
TraditionalPatternResult {
  primary_pattern
  secondary_pattern?
  pattern_family
  pattern_modifiers[]
  ...
}
```

而不是把所有组合都变成互斥 primary 枚举。

## 5.2 推荐研究 modifier

### `RESOURCE_PROTECTS_OFFICER`

传统对应：正官佩印/印护官。

条件方向：

```text
primary = ZHENG_GUAN
resource protects / mediates officer structure
```

人格意义研究：规则/责任骨架被学习、解释、缓冲机制调节；可能比裸官结构更重框架理解，而不是简单服从。

### `OFFICER_GENERATES_RESOURCE`

传统对应：印绶 host 下见官。

```text
primary = ZHENG_YIN / PIAN_YIN
secondary = ZHENG_GUAN
```

与上一个 modifier 不能合并。

### `SHI_SHEN_CONTROLS_QI_SHA`

传统对应：食神制杀。

人格研究：压力/竞争骨架通过技能、输出、方法论进行处理；与裸七杀的“直接承压/对抗”表达不同。

### `RESOURCE_TRANSFORMS_QI_SHA`

传统对应：七杀 host 取印化/杀印配合。

人格研究：高压/约束信号通过学习、框架、资质或内在模型被吸收。

### `QI_SHA_GENERATES_RESOURCE`

传统对应：印绶 host 逢煞生印。

与上一个方向不同，host 是 resource。

### `WEALTH_GENERATES_OFFICER`

传统对应：财生官。

人格研究：资源/结果导向向责任、制度、角色承担输送，不等于“赚钱后当领导”。

### `SHANG_GUAN_GENERATES_WEALTH`

传统对应：伤官生财。

人格研究：非标准表达/创新输出有现实兑现出口；可降低“只反结构、不落地”的单一伤官 stereotype。

### `SHANG_GUAN_WITH_RESOURCE`

传统对应：伤官佩印/印制伤官（具体命名仍需 host 与强弱确认）。

人格研究：高表达/质疑能力被框架、学习、自我审查或结构化能力调节。

### `SHI_SHEN_GENERATES_WEALTH`

传统对应：食神生财。

人格研究：生成/服务/作品有稳定的现实转换路径。

## 5.3 Counter modifiers / counter evidence

未来不要只保存“成立的漂亮组合”。还应保存：

```text
OFFICER_DAMAGED_BY_SHANG_GUAN
OFFICER_QI_SHA_MIXED
QI_SHA_CONTROL_AND_TRANSFORM_COMPETE
RESOURCE_DAMAGED_BY_WEALTH
SHI_SHEN_BLOCKED_BY_RESOURCE
WEALTH_CONTESTED_BY_PEERS
```

这些不是人格“缺点标签”，而是用于：

- 降低 pattern confidence；
- 标记 `mixed`；
- 调节 positive/stress mode；
- 解释为什么同一 primary pattern 现实表达差异很大。

---

# 6. TraditionalPatternResult 机器模型草案

## 6.1 推荐数据结构

研究草案：

```ts
type TraditionalPatternStatus =
  | "clear"
  | "mixed"
  | "disputed"
  | "indeterminate";

type TraditionalPatternFamily =
  | "authority"
  | "wealth"
  | "resource"
  | "output"
  | "self_rooted";

interface TraditionalPatternBasis {
  month_branch: EarthlyBranch;
  month_commander_stem?: HeavenlyStem;
  selected_month_stem?: HeavenlyStem;
  selected_ten_god?: TenGod;
  exposure_basis?:
    | "month_commander_exposed"
    | "month_main_qi_exposed"
    | "month_middle_qi_exposed"
    | "month_residual_qi_exposed"
    | "month_main_qi_unexposed"
    | "exact_lu_position"
    | "exact_yang_ren_position";
  day_master_strength: DayMasterStrength;
  source_structural_tags?: string[];
}

interface TraditionalPatternModifier {
  code: string;
  confidence: number;
  evidence_keys: string[];
  counter_evidence_keys: string[];
}

interface TraditionalPatternResult {
  primary_pattern: string;
  secondary_pattern?: string;
  pattern_family: TraditionalPatternFamily;
  basis: TraditionalPatternBasis;
  confidence: number;
  evidence_keys: string[];
  counter_evidence_keys: string[];
  pattern_modifiers: TraditionalPatternModifier[];
  pattern_status: TraditionalPatternStatus;
  rule_profile_version: string;
}
```

本轮**不修改 `types/domain/**`**。这是未来 Contract Change Request 的研究草案。

## 6.2 为什么 `basis` 建议结构化，而不是只存一句话

只存：

```text
"月令取伤官格"
```

无法做：

- 稳定测试；
- 跨版本 diff；
- 争议 profile 双跑；
- analytics；
- 解释“为什么变格”。

结构化 `basis` 可以生成自然语言 explanation，但 natural-language basis 不应反过来成为 source of truth。

## 6.3 `confidence` 的语义

`confidence` 应表示：

> 在当前 `rule_profile_version` 下，现有 canonical evidence 对这个 pattern classification 的支持程度。

它**不表示**：

- 命好不好；
- 人格预测科学准确率；
- 成功概率；
- 富贵程度。

建议 confidence 因素：

```text
input completeness
+ month-command evidence specificity
+ exposed/hidden evidence agreement
+ rule-profile agreement
+ strength/context completeness
- material counter evidence
- unresolved school dispute
```

## 6.4 `pattern_status`

### `clear`

- primary anchor 明确；
- 关键 evidence 同方向；
- 无足以改变 host 的竞争候选。

### `mixed`

- primary 仍可选，但有强 secondary / counter structure；
- 例如官杀混杂、两个透干 candidate 接近、modifier 之间竞争。

### `disputed`

- 不同已知流派/规则 profile 会得到不同 pattern；
- 例如羊刃定义、月令司权算法、某些会合变化优先级。

### `indeterminate`

- canonical input 不足；
- 当前 engine 未输出判定所需的月令司权/透干等证据；
- 不应靠 04 猜测补齐。

---

# 7. 判定规则研究：未来 deterministic pipeline

注意：以下是研究流程，不是本轮生产实现。

## Step 1 — 只读取 canonical traditional facts

需要至少：

- day master stem / polarity；
- month branch；
- month hidden stems 与层级；
- visible stems；
- Ten-God relation；
- canonical day-master strength；
- canonical formations / transformed monthly qi（若 02 支持）；
- month commander（若采用司权 profile）。

**当前 `BaziDerivedFeatures` 的百分比分布本身不足以完整判格。**

## Step 2 — 建立 host candidate

先处理月令 special host：

- exact 建禄；
- exact 月劫；
- explicit-profile 阳刃。

再处理八个 regular candidate：

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

候选证据来自月令/透干，不来自全盘 Ten-God max。

## Step 3 — 对 competing candidate 保留 evidence

不要马上丢弃第二候选。

例如：

```text
primary_pattern = SHANG_GUAN
secondary_pattern = PIAN_CAI
evidence_keys = [...]
counter_evidence_keys = [...]
pattern_status = mixed
```

## Step 4 — 识别 directional modifiers

modifier 在 host 之后判定：

```text
host -> supporting relation -> counter relation -> status
```

这能避免“官印双全”和“印绶用官”被压成同一个袋装标签。

## Step 5 — 流派分歧显式化

如果两个被批准的 profile 对同一盘给出不同结果：

```text
pattern_status = disputed
```

不要用随机 tie-break 或某个作者的个人分数静默决定。

---

# 8. 开源项目如何实现：Reuse First 结论

## 8.1 `mingyu-core` — REFERENCE ONLY / 部分逻辑可 ADAPT

来源：

- Repo: https://github.com/Brhiza/mingyu
- Pattern strategy: https://github.com/Brhiza/mingyu/blob/main/packages/core/src/bazi/baziPatternStrategy.ts
- Package: `mingyu-core@0.1.29`（本轮核查）
- License: MIT

### 值得学习

`baziPatternStrategy.ts` 已实现：

- 月令藏干候选；
- 本气/中气/余气顺序；
- 透干优先；
- 同层级时再考虑透干次数和位置；
- 建禄 exact lu position；
- 月刃 exact ren position；
- `basis` 字符串记录“为什么取这个格”；
- 专旺/从格另行处理。

这说明一个成熟实现不会只看 Ten-God distribution max。

### 不建议直接 runtime reuse 的原因

1. 本项目已明确 02 是 canonical traditional fact owner；04 若再直接调用 `mingyu-core` 会制造第二传统事实源。
2. mingyu 的 pattern profile 包含其自己的月令司权、特殊格和力量判断选择；不能假定与本项目 02 rule profile 一致。
3. 其公开 `PatternAnalysis` 当前核心仍是 `pattern + isSpecial + basis`，缺少我们需要的 `evidence_keys / counter_evidence_keys / status / rule_profile_version`。
4. 它本身依赖 `tyme4ts`，不能当成独立历法 oracle。

### Decision

```text
REFERENCE ONLY now
ADAPT concepts / tests after approval
DO NOT call from 04 production directly
```

## 8.2 `tyme4ts` — REUSE calendar primitives, NOT pattern taxonomy

来源：https://github.com/6tail/tyme4ts

当前仓库活跃，MIT，提供公历/农历、干支、节气等成熟基础能力。

它适合 02 Adapter 层继续提供 calendar / Ganzhi primitives；它**不是格局 taxonomy 的传统语义权威**。

Decision：

```text
REUSE in 02 for calendar primitives
DO NOT USE as pattern classifier source
```

## 8.3 `jiwenxu025-boop/bazi-engine` — REFERENCE ONLY

来源：

- Repo: https://github.com/jiwenxu025-boop/bazi-engine
- Pattern code: https://github.com/jiwenxu025-boop/bazi-engine/blob/main/scripts/bazi_engine/pattern.py
- License: MIT

### 值得学习

- `determine_pattern()` 明确采用月令本气/中气/余气透干优先级；
- 建禄 / 羊刃特殊处理；
- `validate_pattern()` 将 supports/issues 分开；
- 正官、七杀、财、印、食神、伤官等分别验证；
- 有成格/破格/带忌/不成格四档概念。

这些都支持我们设计 `evidence_keys + counter_evidence_keys + pattern_status`。

### 为什么不能复制

这个文件顶部明确把多套来源混在一个生产判定：

- 《子平真诠》；
- 段建业盲派的“制得干净”阈值；
- 陆致极强弱思路；
- 梁湘润/《穷通宝鉴》调候。

代码中还出现诸如 `制力 >= 杀 1.5倍` 的工程阈值。这可以作为“如何编码可解释规则”的参考，但不是我们当前选择的纯子平月令 profile。

Decision：

```text
REFERENCE ONLY
DO NOT COPY numeric thresholds
DO NOT mix its multi-school profile into V1
```

## 8.4 其他 Bazi repos

本轮发现的其他项目可以继续用于 golden-vector / feature matrix，但在以下条件满足前不进入 dependency：

- License 可核验；
- 活跃维护；
- pattern rule profile 有明确出处；
- 测试能覆盖月令、透干、建禄/月劫/羊刃和组合结构；
- 能通过 Adapter 隔离第三方 domain；
- 不把 LLM 参与 deterministic pattern classification。

没有达到这些条件的统一标为 `REFERENCE ONLY` 或 `DO NOT USE`。

---

# 9. 推荐 V1 最小格局范围

## 9.1 Core regular patterns — 推荐 V1

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

理由：

- 与当前 Ten-God domain 可以对齐；
- 在子平月令体系中有稳定讨论框架；
- 足以支持 Authority / Wealth / Resource / Output 四类人格骨架；
- 可以做 deterministic evidence tests。

## 9.2 Self-rooted host — 推荐 V1

```text
JIAN_LU
YUE_JIE
```

但不要把它们当成最终人格。

未来应有 secondary/modifier 去说明“建禄/月劫之后以何结构承接”。

## 9.3 `YANG_REN` — 研究通过，V1 默认暂不自动启用

原因不是它“不重要”，而是：

- 定义存在明显流派边界；
- 必须先让 02 rule profile 明确采用五阳真刃还是更广配置；
- 当前人格产品不值得为了一个有争议的传统分类牺牲可复现性。

建议：

```text
support in taxonomy
feature-gated by rule profile
status = disputed when convention unresolved
```

## 9.4 V1 modifier 推荐

优先六个用户要求且传统结构相对清晰的：

```text
RESOURCE_PROTECTS_OFFICER
SHI_SHEN_CONTROLS_QI_SHA
RESOURCE_TRANSFORMS_QI_SHA
WEALTH_GENERATES_OFFICER
SHANG_GUAN_WITH_RESOURCE
SHANG_GUAN_GENERATES_WEALTH
```

同时为了避免 host 方向丢失，建议研究增加：

```text
OFFICER_GENERATES_RESOURCE
QI_SHA_GENERATES_RESOURCE
SHI_SHEN_GENERATES_WEALTH
```

不建议 V1 一次实现所有传统组合。

---

# 10. 格局 → 人格骨架映射草案

## 10.1 Family 重新整理建议

现有 Archetype v0.2 family：

```text
PEER
OUTPUT
WEALTH
AUTHORITY
RESOURCE
```

传统格局加入后建议研究为：

```text
AUTHORITY
  ZHENG_GUAN
  QI_SHA

WEALTH
  ZHENG_CAI
  PIAN_CAI

RESOURCE
  ZHENG_YIN
  PIAN_YIN

OUTPUT
  SHI_SHEN
  SHANG_GUAN

SELF_ROOTED
  JIAN_LU
  YUE_JIE
  [YANG_REN under explicit profile]
```

`SELF_ROOTED` 比 `PEER` 更适合做格局层名称，因为建禄/月劫并不等于“全盘比劫最高”。

现有 v0.2 的 `PEER` 不必删除：它仍可作为 Ten-God/archetype evidence family，只是在未来 TraditionalPattern 层不要强行一一对应。

## 10.2 Skeleton 只提供 prior，不是 verdict

未来可以概念化为：

```text
TraditionalPattern        = behavior prior / skeleton
DayMasterContext          = temperament modulation
TenGod structure          = behavior channel
Strength + modifiers      = constructive / stress expression
PersonalityDimensions     = observed-behavior landing layer
```

关键约束：**PersonalityDimensions 必须有能力纠正/削弱传统 prior。**

例如：

```text
primary_pattern = SHANG_GUAN
```

不能无条件推出：

```text
autonomy = 90
conflict_style = 85
```

如果 canonical structure 有强印配、行为维度实际显示 structure_need 高、conflict_style 中等，则最终 archetype 应呈现“高输出但结构化”，而不是网络刻板“叛逆型”。

## 10.3 Family 的现代行为研究方向

### AUTHORITY

研究维度：

- structure_need
- planning_orientation
- control_need
- competition_drive
- decision_speed

正官与七杀必须分别建模。

### WEALTH

研究维度：

- planning_orientation
- risk_tolerance
- social_adaptation
- decision_speed
- control_need

不要使用“爱钱/抠门/投机”等标签。

### RESOURCE

研究维度：

- learning_orientation
- structure_need
- emotional_sensitivity
- novelty_seeking
- decision_speed（可能表现为反向/缓冲）

### OUTPUT

研究维度：

- expression_drive
- autonomy
- novelty_seeking
- social_adaptation
- conflict_style

### SELF_ROOTED

研究维度：

- autonomy
- competition_drive
- external_validation_need
- conflict_style

但 secondary pattern 的影响应非常高，否则建禄/月劫容易被错误人格化。

---

# 11. 日主作为“气质层”的研究结论

## 11.1 不采用五行固定形容词字典

明确禁止：

```text
木 = 温柔
火 = 热情
土 = 老实
金 = 冷酷
水 = 敏感
```

这既粗糙，也会和同一五行在不同季节、强弱、格局、十神关系中的差异冲突。

## 11.2 推荐 `DayMasterContext`，而不是 `DayMasterPersonality`

研究结构：

```ts
DayMasterContext {
  stem
  element
  polarity
  strength
  seasonal_context
  pattern_relation_context
}
```

04 可把它作为 modifier 输入，但最终人格形容词仍由现代 dimensions 决定。

## 11.3 为什么“甲木+伤官 / 庚金+伤官 / 癸水+伤官”可以不同

共同骨架：

```text
primary = SHANG_GUAN
family = OUTPUT
```

但不是因为要硬编码：

```text
甲木 = A性格
庚金 = B性格
癸水 = C性格
```

真正产生差异的应该是：

1. 伤官对应的实际五行通道不同；
2. 该输出元素在出生季节的状态不同；
3. 日主 canonical strength 不同；
4. 是否有财、印、官、杀形成 modifier 不同；
5. 全盘 element/Ten-God distribution 不同；
6. visible polarity / relations 不同；
7. 最终 personality dimensions 不同。

因此日主的作用是“关系坐标 + 气质调制”，而不是一个五行 horoscope 标签。

## 11.4 未来实现建议

即使进入 v0.3，也建议日主只提供**小到中等权重的调制**，不要比 TraditionalPattern 与 modern dimensions 更强。

如果两个用户：

```text
TraditionalPattern
BaziDerivedFeatures
PersonalityDimensions
```

都非常接近，仅日主不同，不应因为日主元素就得到完全相反的人格文案。

---

# 12. 与现有 Archetype v0.2 的兼容 / 迁移方案

## 12.1 不推翻现有输出

继续保留：

```text
archetype_code
archetype_seed
dominant_pattern
secondary_pattern
personality_dimensions
confidence
positive_mode
stress_mode
```

## 12.2 v0.3 候选数据流

```text
TraditionalPatternResult
        ↓
InterpretationSignals
        ↓
PersonalityDimensions
        ↓
ArchetypeCandidate
```

`TraditionalPatternResult` 是新增上游证据，不是用来替换 `ArchetypeCandidate`。

## 12.3 不现在锁定新的 archetype_code 格式

研究示意：

```text
DM_WOOD
+ PATTERN_SHANG_GUAN
+ MODIFIER_WITH_RESOURCE
+ HIGH_AUTONOMY
```

但本轮明确**不锁格式**。

原因：

- 05 已可能开始用 v0.2 stable code 绑定角色；
- code 格式一旦进入资产 registry，迁移成本高；
- TraditionalPattern 最终 ownership/contract 尚未批准；
- modifier direction 还需要规则 profile 验证。

推荐未来采用 compatibility registry：

```text
legacy_archetype_code_v0_2
traditional_pattern_result
new_archetype_code_v0_3
asset_binding_aliases[]
```

避免一次升级把 05 已做角色资产全部失效。

## 12.4 对现有 `dominant_pattern` 的处理

v0.2 的 `dominant_pattern` 是 Ten-God candidate ranking，不应未来偷偷改语义成“传统格局”。

建议如果实现 v0.3：

```text
traditional_pattern.primary_pattern   // 新字段/上游对象
dominant_pattern                      // 继续指 archetype candidate evidence
```

或者显式改名并提供 migration，而不是 silent semantic change。

---

# 13. 与 05 / Product 的边界

04/02 机器层负责：

```text
traditional_pattern
pattern_modifiers
archetype_code
archetype_seed
confidence
positive_mode
stress_mode
```

05 / Product 负责：

```text
public personality name
年轻化热梗
角色长相
男女/其他视觉 variant
服装
姿势
画风
品牌文案
localized copy
```

未来绑定：

```text
traditional_pattern
        ↓
stable archetype_code
        ↓
05 public personality name
        ↓
character asset registry
```

性别不得回流到格局、人设评分或 personality dimension 算法。

---

# 14. 推荐 evidence key taxonomy

为了以后可测试、可解释，研究建议提前约定命名方向，但本轮不写 shared Contract。

示例：

```text
pattern.month_branch.youx
pattern.month_main_qi.xin
pattern.month_commander.xin
pattern.month_qi.exposed.month_stem
pattern.month_qi.exposed.hour_stem
pattern.exposure.main_qi_priority
pattern.jian_lu.exact_lu_match
pattern.yue_jie.month_peer_rooted
pattern.yang_ren.explicit_profile_match

modifier.resource_protects_officer
modifier.officer_generates_resource
modifier.shi_shen_controls_qi_sha
modifier.resource_transforms_qi_sha
modifier.qi_sha_generates_resource
modifier.wealth_generates_officer
modifier.shang_guan_generates_wealth
modifier.shang_guan_with_resource

counter.officer_qi_sha_mixed
counter.officer_damaged_by_shang_guan
counter.resource_damaged_by_wealth
counter.shi_shen_blocked_by_resource
counter.qi_sha_control_transform_compete
counter.rule_profile_disagreement.yang_ren
```

这些 key 只记录规则事实，不直接包含“富贵/贫贱/好坏人格”。

---

# 15. Test strategy for a future implementation

如果总指挥以后批准 `traditional-pattern/0.1.x`，至少需要：

## 15.1 Unit fixtures

每个 core pattern 至少：

- clear positive fixture；
- mixed fixture；
- counter-evidence fixture；
- no-sufficient-evidence fixture。

## 15.2 Host-direction fixtures

必须专门证明：

```text
正官佩印 != 印绶用官
七杀用印 != 印绶逢杀
财逢食生 != 食神生财
煞格逢刃 != 阳刃露煞
```

## 15.3 School-dispute fixtures

同一个 raw chart 在不同明确 profile 下允许：

```text
result A != result B
```

但必须：

- deterministic；
- 两边都有 `rule_profile_version`；
- `pattern_status=disputed` 或提供 cross-profile comparison；
- 不存在 silent fallback。

## 15.4 Cross-engine benchmark

可以把 mingyu-core / 其他开源引擎作为 reference oracle 之一，但**不能多数投票决定传统真理**。

对每个 mismatch 记录：

```text
source rule
month-command policy
hidden-stem policy
strength policy
formation policy
reason for accepting/rejecting difference
```

---

# 16. REUSE / ADAPT / REFERENCE ONLY / DO NOT USE matrix

| Source / project | Decision | Why |
|---|---|---|
| 《子平真诠》月令格局主线 | **REFERENCE / RULE SOURCE** | 本研究 V1 选择的传统规则主线；需要版本化工程化，不直接复制现代注解结论 |
| 《三命通会》 | **REFERENCE ONLY** | 适合交叉验证历史术语与羊刃等争议；体系更广，不直接混入同一 profile |
| `mingyu-core` | **REFERENCE ONLY → selective ADAPT** | MIT、活跃、有 pattern strategy/basis；但自有 rule choices，且 04 直接调用会违反 canonical ownership |
| `tyme4ts` | **REUSE via 02 Adapter** | 成熟历法/干支/节气基础；不负责格局语义 |
| `jiwenxu025-boop/bazi-engine` | **REFERENCE ONLY** | MIT、实现丰富、supports/issues 很有参考价值；但同一函数混合子平/盲派/调候并使用自定义数值阈值 |
| 未核验 license/维护/测试的 Bazi repos | **DO NOT USE as dependency** | 可阅读，但不得进入 production dependency 或成为唯一 oracle |
| LLM 自由判断格局 | **DO NOT USE** | 格局属于 deterministic traditional fact；LLM 只可解释已计算结果 |
| “Ten-God max = 格局” | **DO NOT USE** | 与月令/透干/宾主体系冲突，会制造错误传统事实 |
| “五行=固定性格形容词” | **DO NOT USE** | 过度简化、不可校准、无法解释同格异质 |

---

# 17. Contract / ownership recommendation

本轮最重要的未来 Contract Change Request：

**不要把 `TraditionalPatternResult` 直接塞进 04 私有算法后长期存在。**

若产品批准格局升级，应由 00/01 协调 02 与 04：

```text
02 owns deterministic TraditionalPatternResult
04 consumes it for personality interpretation
```

原因：

- 格局本身属于传统命理事实；
- 判定依赖月令、透干、藏干、strength、formation 等 canonical source；
- 04 不应再次计算这些传统事实；
- 未来 DB / report / AI 也需要同一格局结果可复现。

当前 shared `BaziDerivedFeatures` 只有 distribution / strength / seasonalContext / structuralTags 等，不足以安全表达完整月令格局 evidence。因此在 Contract 扩展前，04 应保持 v0.2，不自行猜格局。

---

# 18. 推荐下一步（等待总指挥，不在本 Research PR 实现）

如果本研究验收通过，建议下一阶段不是马上写 `personality-map/0.3.0`，而是：

1. **ARCH / Contract review**：确认 `TraditionalPatternResult` ownership 在 02 traditional facts layer；
2. **02 Research prototype**：在独立实验代码中实现最小八格 + 建禄/月劫 evidence，不碰 production engine；
3. **Golden fixtures**：至少 30–50 个有明确 source/basis 的 pattern fixtures；
4. **Dual-run**：与 mingyu-core / 另一独立 reference 实现对比 mismatch；
5. **争议 profile**：先解决羊刃、月令司权、杂气透干优先级；
6. **04 shadow mapping**：TraditionalPattern 只作为 shadow feature，不改变用户结果；
7. 收集真实用户行为反馈后，再决定是否把 pattern prior 正式加入 `personality-map/0.3.0`。

这样可以避免“传统格局刚接入，就直接改变所有人格角色”的高风险升级。

---

# 19. Source registry

## Traditional texts / transcriptions

- 《子平真诠·论用神》：https://www.luckclub.cn/bazi/002/010/
- 《子平真诠·论用神变化》：https://www.luckclub.cn/bazi/002/012/
- 《子平真诠·论用神格局高低》：https://www.luckclub.cn/bazi/002/014/
- 《子平真诠·论四吉神能破格》：https://www.luckclub.cn/bazi/002/020/
- 《子平真诠·论星辰无关格局》：https://www.luckclub.cn/bazi/002/023/
- 《子平真诠·论财》：https://www.luckclub.cn/bazi/002/035/
- 《子平真诠·论印绶》：https://www.luckclub.cn/bazi/002/037/
- 《子平真诠·论食神》：https://www.luckclub.cn/bazi/002/039/
- 《子平真诠·论偏官取运》：https://www.luckclub.cn/bazi/002/042/
- 《子平真诠·论伤官取运》：https://www.luckclub.cn/bazi/002/044/
- 《子平真诠·论建禄月劫》：https://www.luckclub.cn/bazi/002/047/
- 《子平真诠·论阳刃》另一转录：https://www.diancangwang.cn/xuanxuewushu/03cf53eede8a/e3aa7167db9a.html
- 《三命通会·论羊刃》Chinese Text Project：https://ctext.org/wiki.pl?chapter=868825

## Open source / engineering references

- Mingyu：https://github.com/Brhiza/mingyu
- Mingyu pattern strategy：https://github.com/Brhiza/mingyu/blob/main/packages/core/src/bazi/baziPatternStrategy.ts
- Mingyu core package：https://github.com/Brhiza/mingyu/blob/main/packages/core/package.json
- Tyme4ts：https://github.com/6tail/tyme4ts
- jiwenxu bazi-engine：https://github.com/jiwenxu025-boop/bazi-engine
- jiwenxu pattern implementation：https://github.com/jiwenxu025-boop/bazi-engine/blob/main/scripts/bazi_engine/pattern.py

---

# 20. Final recommendation

本轮研究支持用户提出的核心假设，但需要做一个工程修正：

```text
格局 = 人格大骨架          ✅ 可作为 future prior
日主 = 气质               ✅ 但应是 context/modulator，不是五行标签
十神组合 = 行为方式        ✅ 需要 host-direction + modifiers
强弱 / 配合 = 正向与压力表达 ✅ 适合影响 positive/stress mode
现代人格维度 = 现实行为落点 ✅ 应保留较高校准权重
```

最终推荐架构：

```text
TraditionalPatternResult (02-owned deterministic fact)
        +
BaziDerivedFeatures
        +
DayMasterContext
        ↓
InterpretationSignals
        ↓
PersonalityDimensions
        ↓
ArchetypeCandidate
        ↓
05 public name + character assets
```

**不推荐**：

```text
伤官格 -> 一个固定人格
七杀格 -> 一个固定人格
甲木 -> 一个固定气质
```

格局应提高人格模型的结构解释力，而不是把旧的“十神一对一人格”换成新的“格局一对一人格”。
