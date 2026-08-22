# 20 — Traditional Bazi Rule Audit

状态：**COMPLETED AUDIT / RULE PROFILE LOCK REQUIRED**  
日期：2026-08-22  
Repository：`zoushunyu144000-ui/bazi-ai-advisor`  
Branch：`release/v1-personality-rc`  
Draft PR：`#16 release: V1 public personality experience`  
审计基线 HEAD：`90046f55361e722d183ce53754081bcbafdddc19`

> 本文只审计当前已有规则及缺口，不实现新的 `TraditionalPatternResult`，不修改 production logic。
>
> 最高原则：**传统命理负责判断，现代产品负责翻译。**

---

## 1. Executive Summary（执行摘要）

### 1.1 总体结论

当前代码的传统八字链可以分成三段：

1. **Calendar / Chart Facts（历法与排盘事实）**：整体基础较好，具备可复现性、IANA 时区 / DST 处理、节气边界、四柱、十神、藏干等可靠工程基础；但年界、晚子时、真太阳时等必须正式进入版本化 Rule Profile（规则体系）而不能被当成“唯一传统答案”。
2. **Structural Facts（命盘结构事实）**：十神映射、藏干表、基础合冲害关系可继续使用；但当前 `elementDistribution`、`tenGodDistribution`、日主强弱、藏干权重、月支额外权重等大量数值只是工程建模，并不等于传统气势、旺衰或格局判断。
3. **Pattern Judgment（格局判断）**：**当前 production 尚未实现真正的 TraditionalPatternResult（传统格局结果）**。月令取格、透干取用、建禄/月劫、成败破救、兼格、从格、假从、特殊格局、流派歧义等均未形成 production deterministic rule engine（确定性规则引擎）。

当前最大 authority（判定权）风险不是“某个传统规则写错一点”，而是：

```text
Birth
→ Bazi Engine
→ BaziDerivedFeatures
→ Interpretation / 15 Personality Dimensions
→ personality-map/0.2.0 candidate_score
→ dominant_ten_god / secondary_ten_god
→ Public Personality
```

`personality-map/0.2.0` 当前以：

```text
52% canonical Ten-God score
18% family score
22% personality dimension fit
8% strength fit
```

直接选出公网 dominant / secondary personality。该公式在代码和旧 Machine Contract 中明确属于工程假设，**没有传统格局判定依据，因此必须分类为 `EXPERIMENTAL`，并退出正式 Traditional Pattern / Public Personality 的 authority 链。**

### 1.2 Readiness

```text
TraditionalPatternResult Readiness: NOT READY
```

原因：

- production 没有月令格局 adjudication；
- 没有 host / 宾主方向；
- 没有透干、根气、月令司权的正式证据模型；
- 没有成格 / 败格 / 破格 / 救应；
- 没有兼格 / 不成单一格 / ambiguity；
- 从格 / 假从 / 特殊格局尚未定义 profile；
- 当前 day-master strength 是实验数值模型，不足以直接承担传统强弱依据；
- 当前公网 authority 仍由实验 candidate ranking 决定。

因此下一步应先完成 **Rule Profile / School Choice Lock（规则体系 / 流派选择冻结）**，再开发 `TraditionalPatternResult + Evidence + Ambiguity`。

### 1.3 审计分类统计

本矩阵共审计 **43 条重要规则 / 规则能力**：

- `TRADITIONAL_CORE`：13
- `SCHOOL_CHOICE`：9
- `IMPLEMENTATION_DETAIL`：7
- `EXPERIMENTAL`：14

其中当前实现可直接保留，或在明确“仅为非权威描述 / 工程基础”的前提下保留：**15 条**。

---

## 2. Existing Architecture（现有架构）

### 2.1 当前真实 production path

```text
Birth input
↓
modules/birth/normalize.ts
IANA timezone + DST + resolved instant
↓
modules/bazi/engine.ts
四柱 / 十神 / 藏干 / relations / derivedFeatures
↓
modules/interpretation/engine.ts
15 Personality Dimensions
↓
modules/interpretation/archetypes.ts
personality-map/0.2.0 candidate ranking
↓
app/birth/page.tsx
selectArchetypeCandidate(...)
↓
lib/public-result.ts
ArchetypeCandidate persisted in session
↓
app/result/page.tsx
archetype_seed.dominant_ten_god
↓
lib/public-personalities.ts
10 Public Personality
```

### 2.2 哪些是真正传统事实

目前可以视为传统事实基础的主要是：

```text
四柱干支
日主
十神关系
藏干表
月支
基础天干五合存在性
六合存在性
六冲存在性
六害存在性
```

注意：这里的“存在性”不等于“已经完成是否合化、是否成立、力量如何、是否改变月令/格局”的判断。

### 2.3 哪些是现代工程逻辑

```text
藏干 0.6 / 0.3 / 0.1 等权重
月支 × 1.5
visible stem = 1
五行 / 十神 normalization to 100
support_ratio
0.58 / 0.42 身强弱阈值
15 Personality Dimensions
family score
strength fit
candidate_score
archetype intensity
archetype confidence
```

这些可以作为历史实验、行为解释或 analytics，但不得被包装为传统格局规则。

### 2.4 当前缺失的一层

正确架构应变成：

```text
Birth
↓
Bazi Calendar / Chart Facts
↓
Traditional Structural Facts
↓
Traditional Pattern Engine
↓
TraditionalPatternResult
+ Evidence
+ Counter Evidence
+ Ambiguity
+ rule_profile_version
↓
Modern Personality Translation
↓
Public Personality
```

---

## 3. Rule Audit Matrix（规则审计矩阵）

说明：

- `KEEP`：可以保留在当前语义下。
- `KEEP NON-AUTHORITY`：可以保留为描述 / analytics，但不能决定传统格局。
- `REVISE`：需要改语义或补证据后才能进入传统 authority。
- `REMOVE FROM AUTHORITY`：可以保留历史代码，但必须退出正式传统 / 主人格判定链。
- `RESEARCH / LOCK`：下一轮 Rule Profile 必须明确选择。

| ID | Rule | Code Location / Function | Current Logic | Classification | Traditional Basis / Audit Basis | Risk | Action |
|---|---|---|---|---|---|---|---|
| C01 | IANA timezone / DST 解析 | `modules/birth/timezone.ts` `resolveIanaLocalDateTime` | 由 runtime IANA 数据解析 local time；DST gap fail closed；overlap 需 offset | `IMPLEMENTATION_DETAIL` | 时区是历法输入工程事实，不是命理流派规则 | runtime ICU / tzdata 版本会影响极少数历史边界 | **KEEP** |
| C02 | 已确认 UTC instant + offset 下游重放 | `modules/birth/normalize.ts`; `modules/bazi/timezone.ts` `replayResolvedBirthInstant` | 已解析出生瞬间被持久化并精确重放 | `IMPLEMENTATION_DETAIL` | 保证同一输入可复现 | legacy profile 若缺字段会走 fallback | **KEEP** |
| C03 | 年柱以立春瞬间换年 | `modules/bazi/engine.ts` `baziYearAt`; `RULES.md` | `instant >= 立春` 后进入新八字年 | `SCHOOL_CHOICE` | 子平实践中立春换年为主流做法，但并非所有民间体系都如此 | 文档若称“唯一正确年界”会掩盖流派选择 | **RESEARCH / LOCK** 当前实现可作为候选 profile |
| C04 | 月柱以“节”换月 | `modules/bazi/engine.ts` `MONTH_JIE`, `monthOffsetAt` | 立春起寅月，其后惊蛰、清明等 `节` 精确换月 | `TRADITIONAL_CORE` | 子平体系以月令 / 节令为提纲；《渊海子平》亦强调“月为提纲” | 仍需区分“节界事实”与“月令司权” | **KEEP** |
| C05 | 日柱按出生地 local civil date 取日 | `modules/bazi/engine.ts` `dayPillarForCivilDate` | 以解析后的当地公历日期送入 tyme4ts | `SCHOOL_CHOICE` | 日界与晚子时、真太阳时规则有关 | 23:00 前后可与其他排盘口径不同 | **RESEARCH / LOCK** |
| C06 | 时支：子时 23:00–00:59，其后两小时一支 | `modules/bazi/rules.ts` `hourPillar` | `floor((hour+1)/2)%12` | `TRADITIONAL_CORE` | 十二时辰基础规则 | 分钟只在整点边界起作用；与真太阳时 profile 联动 | **KEEP** |
| C07 | 晚子时 23:00–23:59 不换日 | `modules/bazi/engine.ts`; `RULES.md`; `reference-vectors.test.ts` | 23:xx 时支为子，但日柱仍为 civil date 当日 | `SCHOOL_CHOICE` | 晚子时是否换日存在明确传统 / 现代排盘分歧 | 可导致整张命盘日主、十神全部改变 | **RESEARCH / LOCK**，必须进入版本号 |
| C08 | 不做真太阳时 / 经度修正 | `modules/bazi/engine.ts` metadata warning; `RULES.md` | 使用 civil local time，不用出生经度校正 | `SCHOOL_CHOICE` | 不同命理实践对真太阳时采用不同 | 极靠近时辰边界的出生时间可能换时柱 | **RESEARCH / LOCK** |
| C09 | 出生时间未知 | `modules/bazi/timezone.ts`; `modules/bazi/engine.ts` | 内部以 local noon 仅解析年/月/日边界；`hour=null` | `IMPLEMENTATION_DETAIL` | 未知时辰不应伪造时柱 | 下游若误读 noon 为真实出生时辰会污染结果 | **KEEP**，继续保证 hour null |
| C10 | tyme4ts Adapter / 节气 CST→UTC 转换 | `modules/bazi/adapters/tyme4ts-adapter.ts` | 第三方历法 primitive 经 Adapter 封装；节气时间减 8h 转 UTC | `IMPLEMENTATION_DETAIL` | Reuse First；传统语义不由库决定 | 依赖 tyme4ts 的 wall-clock 语义与版本；不能当格局 oracle | **KEEP**，继续 golden-vector 验证 |
| S01 | 十神映射 | `modules/bazi/rules.ts` `tenGodFor` | 日主与目标干的五行生克 + 阴阳同异映射十神 | `TRADITIONAL_CORE` | 子平十神基本定义 | 当前只测试甲日全表；应补 10 日干 exhaustive fixture | **KEEP** |
| S02 | 十二支藏干及主/中/余顺序 | `modules/bazi/constants.ts` `HIDDEN_STEMS` | 固定藏干表 | `TRADITIONAL_CORE` | 子平结构的基础资料 | 不同资料对个别“司令/余气”语义会分歧；表本身不能等于月令司权 | **KEEP**，Rule Profile 另定司权 |
| S03 | 藏干数值权重 | `modules/bazi/rules.ts` `pillarFromRef` | 1藏干=1；2藏干=0.7/0.3；3藏干=0.6/0.3/0.1 | `EXPERIMENTAL` | `RULES.md` 已明确是 scoring weights，不是传统统一百分比 | 当前会进入五行 / 十神分布并继续影响人格 | **REMOVE FROM AUTHORITY** |
| S04 | 月支额外 ×1.5 | `modules/bazi/derived.ts` `deriveFeatures` | month hidden-stem branch budget 乘 1.5 | `EXPERIMENTAL` | 是工程强化“月令重要性”的近似，不是传统月令判格公式 | 用一个系数代替月令、司令、旺衰与透干 | **REMOVE FROM AUTHORITY** |
| S05 | 明透天干统一 weight=1 | `modules/bazi/derived.ts` | 每个可见干固定 +1 | `EXPERIMENTAL` | 位置、根、月令、制化并非传统上完全等权 | 生成的 distribution 被误读时会伪装成“气势比例” | **REMOVE FROM AUTHORITY** |
| S06 | `elementDistribution` 归一化为 0–100 | `modules/bazi/derived.ts` | 对工程 elementScores normalize | `IMPLEMENTATION_DETAIL` | 只是数据表示方式 | 数字像百分比，容易被误称“五行真实占比” | **KEEP NON-AUTHORITY**，命名 / 文档必须提示 engineering distribution |
| S07 | `tenGodDistribution` 归一化为 0–100 | `modules/bazi/derived.ts` | 对工程 tenGodScores normalize | `IMPLEMENTATION_DETAIL` | 描述性工程统计，不等于格局 | 当前被 personality-map/0.2.0 直接消费，形成 authority 风险 | **KEEP NON-AUTHORITY** |
| S08 | 身强弱 support formula | `modules/bazi/derived.ts` | `(同元素 + 生我元素) / elementTotal` | `EXPERIMENTAL` | 传统旺衰涉及得令、得地、得势、根、透、制化等，不能只用二类元素占比 | 会把工程分布包装为日主强弱 | **REMOVE FROM AUTHORITY / RESEARCH** |
| S09 | 身强 / 平衡 / 身弱阈值 0.58 / 0.42 | `modules/bazi/derived.ts` | `>=.58 strong`, `<=.42 weak`, else balanced | `EXPERIMENTAL` | 未发现当前采用传统体系中的对应固定阈值 | 边界盘被伪精确切三段 | **REMOVE FROM AUTHORITY** |
| S10 | `derived.confidence` = .72/.62/.50 | `modules/bazi/derived.ts` | 只按出生时间 exact / approximate / unknown 给固定置信度 | `EXPERIMENTAL` | 输入完整度可影响证据质量，但这些常数无传统依据 | 下游 archetype confidence 将其当数值证据 | **REMOVE FROM TRADITIONAL AUTHORITY**；可改为 input quality metadata |
| S11 | 天干五合“存在性” | `modules/bazi/relations.ts` | 甲己、乙庚、丙辛、丁壬、戊癸成对即 emit | `TRADITIONAL_CORE` | 五合关系是传统结构基础 | 当前不判断合化、争合、妒合、得令得地 | **KEEP existence only** |
| S12 | 地支六合“存在性” | `modules/bazi/relations.ts` | 六组 pair match | `TRADITIONAL_CORE` | 六合是传统关系基础 | 当前不判断合化成立条件 | **KEEP existence only** |
| S13 | 地支六冲“存在性” | `modules/bazi/relations.ts` | 六组 pair match | `TRADITIONAL_CORE` | 六冲是传统关系基础 | 当前无位置、力量、解冲等判断 | **KEEP existence only** |
| S14 | 地支六害“存在性” | `modules/bazi/relations.ts` | 六组 pair match | `TRADITIONAL_CORE` | 六害为传统关系之一 | 不应在证据中与冲、刑自动同权 | **KEEP existence only** |
| S15 | `seasonalStrength()` 旺相休囚死 | `modules/bazi/traditional.ts` | 只按 `monthElement` 五行生克给旺相休囚死 | `EXPERIMENTAL` | 旺相休囚死概念传统存在，但当前实现把整个月令压成单一 `BRANCH_ELEMENT` | 土月、月令藏干、节气深浅、司令等被忽略；且目前不在 public calculateBazi 主链 | **RESEARCH / DO NOT USE AS AUTHORITY** |
| P01 | 月令是格局第一坐标 | 当前 **未实现**；研究见 `TRADITIONAL_PATTERN_TAXONOMY.md` | production 无 `primary_pattern` adjudication | `TRADITIONAL_CORE` | 《子平真诠》研究主线；《渊海子平》“月为提纲” | 现有系统用全盘 distribution + candidate ranking 代替 | **IMPLEMENT AFTER RULE LOCK** |
| P02 | 月令藏干 / 透干 / 司令如何选择 host | 当前 **未实现** | 无 `month_commander`, `exposure_basis`, host-direction | `SCHOOL_CHOICE` | 子平内部对杂气、司令、透干优先级存在细节差异 | 如果不冻结，开发会把作者个人偏好写成“传统标准” | **RESEARCH / LOCK** |
| P03 | 八个常规格：正官、七杀、正财、偏财、正印、偏印、食神、伤官 | 当前 **未实现 pattern judgment** | 只有 Ten-God labels 和 Archetype candidates | `TRADITIONAL_CORE` | 子平月令格局主干分类 | “Ten-God 出现/占比高”不能等于“成该格” | **IMPLEMENT** |
| P04 | 建禄 | 当前 **未实现** | 公网 `bi_jian` 文案暂写“V1 展示代理 建禄”，但无 traditional result | `TRADITIONAL_CORE` | 研究：月建逢日主禄位；之后仍需另取财官煞食等承接 | 展示代理容易被用户误读为已经判出建禄格 | **IMPLEMENT / REMOVE PROXY AUTHORITY** |
| P05 | 月劫 | 当前 **未实现** | 公网 `jie_cai` 文案暂写“V1 展示代理 月劫”，但无 traditional result | `TRADITIONAL_CORE` | 月劫 / 禄劫体系传统存在，不能由全盘劫财 score 代替 | 同 P04 | **IMPLEMENT / REMOVE PROXY AUTHORITY** |
| P06 | 羊刃 / 阳刃定义 | 当前 **未实现** | 无 explicit profile | `SCHOOL_CHOICE` | 《三命通会》记录不同传统说法；其中明确记载子平“五阳干有刃、五阴干无刃” | 偷偷选十干皆刃或五阳真刃会产生不同结果 | **RESEARCH / LOCK** |
| P07 | 成格 / 败格 / 破格 / 救应 | 当前 **未实现** | 无 supporting / counter evidence adjudication | `SCHOOL_CHOICE` | 概念传统核心，但具体顺逆用、救应优先级需按选定体系编码 | 只给格名会把“见某神”误当“格局成立” | **RESEARCH / LOCK, THEN IMPLEMENT** |
| P08 | 兼格 / 混合格 / 不成单一格 | 当前 **未实现** | 只有 candidate runner-up，没有 traditional ambiguity semantics | `TRADITIONAL_CORE` | 真实命盘不能要求每盘纯型；研究已要求 clear/mixed/indeterminate | candidate top2 不能冒充传统兼格 | **IMPLEMENT** |
| P09 | 从格 / 假从 | 当前 **未实现** | 无 follow-structure rule | `SCHOOL_CHOICE` | 不同体系对“真从 / 假从 / 从势”条件分歧显著 | 若直接套现代数值阈值会重犯自造公式问题 | **RESEARCH / LOCK** |
| P10 | 特殊格局 / 化气 / 专旺等 scope | 当前 **未实现** | research 明确未混入当前 profile | `SCHOOL_CHOICE` | 传统体系范围很广，各书 / 流派分类不同 | V1 若贪全会引入大量未经验证分支 | **RESEARCH / SCOPE LOCK** |
| I01 | 15 Personality Dimensions 规则权重 | `modules/interpretation/engine.ts` `DEFINITIONS`, `scoreDimension` | 十神 / 五行 / 强弱 / 阴阳等经人工权重得到 0–100 行为维度 | `EXPERIMENTAL` | 现代行为翻译模型，不是传统命理事实 | 维度目前又参与主人格 candidate ranking，形成循环工程权重 | **REMOVE FROM TRADITIONAL AUTHORITY**；可留 translation experiment |
| I02 | `candidate_score` 52/18/22/8 | `modules/interpretation/archetypes.ts` `selectArchetypeCandidate` | 十神 + family + dimensions + strength 加权排序 | `EXPERIMENTAL` | `PERSONALITY_ARCHETYPE_SPEC.md` 自己称 versioned engineering hypotheses；新 Translation Contract 明确禁止作为 traditional authority | 当前直接决定 public dominant / secondary | **REMOVE FROM AUTHORITY** |
| I03 | family score | `modules/interpretation/archetypes.ts` `familyTotals` | peer/output/wealth/authority/resource 两两合并后参与候选 | `EXPERIMENTAL` | 是现代 taxonomy 聚合，不是传统格局判定 | 建禄/月劫尤其不能等于 peer family max | **REMOVE FROM AUTHORITY** |
| I04 | `strengthFit` 固定分值 | `modules/interpretation/archetypes.ts` `scoreStrengthFit` | weak peer/resource=70 等；strong output/wealth/authority=66 等 | `EXPERIMENTAL` | 人工产品假设 | 又依赖实验 dayMasterStrength，叠加两层假设 | **REMOVE FROM AUTHORITY** |
| I05 | Archetype intensity 阈值 | `modules/interpretation/archetypes.ts` | family ≥28 或候选领先 ≥8 为 HIGH | `EXPERIMENTAL` | 产品表现阈值 | 容易被理解为传统“格局强度” | **PRESENTATION / ANALYTICS ONLY** |
| I06 | Archetype confidence 公式 | `modules/interpretation/archetypes.ts` | input confidence、candidate gap、family、dimension confidence 加权 | `EXPERIMENTAL` | 工程 confidence，不是传统 evidence strength | 会给实验排序制造“科学确定度”外观 | **PRESENTATION ONLY / REVISE SEMANTICS** |
| I07 | 公网 dominant / secondary 由 candidate_score 直接选 | `app/birth/page.tsx`; `lib/public-result.ts`; `app/result/page.tsx` | `selectArchetypeCandidate` → `archetype_seed.dominant_ten_god` → public result | `EXPERIMENTAL` | 没有 TraditionalPatternResult 上游证据 | 当前最大 authority 风险 | **REMOVE FROM AUTHORITY** after TraditionalPatternResult exists |
| I08 | Ten-God key → 10 Public Personality copy registry | `lib/public-personalities.ts` | 固定公网标签与文案映射 | `IMPLEMENTATION_DETAIL` | 属于现代产品翻译，不应反向决定传统结构 | 当前上游输入不权威；部分“展示代理 建禄/月劫”容易越界 | **KEEP AS TRANSLATION ONLY**，输入改为 evidence-backed translation |

---

## 4. Keep List（可保留）

以下 **15 条当前能力**可以保留；其中 `IMPLEMENTATION_DETAIL` 与 distribution 必须保持非传统 authority 语义：

1. IANA timezone / DST 基础解析；
2. resolved birth instant + UTC offset 精确重放；
3. 以“节”作为月柱换月边界的当前子平基础；
4. 十二时辰基础时支划分；
5. 未知出生时间保持 `hour=null`；
6. tyme4ts Adapter 边界与 golden-vector 思路；
7. 十神五行 + 阴阳映射；
8. 藏干表与主 / 中 / 余顺序；
9. `elementDistribution` 作为**非权威工程统计**；
10. `tenGodDistribution` 作为**非权威工程统计**；
11. 天干五合的存在性检测；
12. 六合存在性检测；
13. 六冲存在性检测；
14. 六害存在性检测；
15. 10 Public Personality registry 作为**纯翻译层**。

特别说明：

- “保留”不等于“足以判格”。
- `tenGodDistribution` 允许存在，不允许 `max()` 后称为格局，也不允许 normalize 成 Public Personality 百分比。
- relation existence 不等于合化 / 解冲 / 制化已经成立。

---

## 5. School Choice List（流派待决）

共 **9 项**：

### SC-01 年界

当前：精确立春瞬间换年。  
待决：正式冻结为 V1 rule profile，还是支持其他 profile。

### SC-02 日界

当前：local civil midnight 换日。  
待决：是否与子初换日体系分 profile。

### SC-03 晚子时

当前：23:00–23:59 不换日。  
待决：晚子时换日 / 不换日选择。

### SC-04 真太阳时

当前：不校正。  
待决：V1 是否坚持 civil time，还是提供 opt-in / 专业模式 profile。

### SC-05 月令藏干 / 透干 / 司令 host selection

当前：未实现。  
待决：杂气月、本中余气、司令深浅、透干优先级。

### SC-06 阳刃 / 羊刃定义

当前：未实现。  
待决：例如采用“子平五阳真刃”还是其他明确 convention。

### SC-07 成败破救 adjudication

当前：未实现。  
待决：以何文本体系作为顺用 / 逆用、破格 / 救应的主规则来源及优先级。

### SC-08 从格 / 假从

当前：未实现。  
待决：从强、从弱、真从、假从等最小 V1 范围与成立条件。

### SC-09 特殊格局范围

当前：未实现。  
待决：V1 是否只做八格 + 建禄/月劫，还是纳入阳刃 / 化气 / 专旺等；禁止一次混入不同体系。

---

## 6. Experimental List（实验规则）

共 **14 项**，均不得决定正式 `TraditionalPatternResult`：

1. 藏干 `1 / .7-.3 / .6-.3-.1` 数值权重；
2. 月支 hidden budget × `1.5`；
3. 每个明透天干统一 `+1`；
4. `(同类 + 印星)/总分` 的 support ratio；
5. `0.58 / 0.42` 身强弱阈值；
6. `.72 / .62 / .50` derived confidence；
7. `seasonalStrength()` 的 branch-element-only 旺相休囚死算法；
8. 15 Personality Dimensions 的人工权重；
9. `52% Ten-God + 18% family + 22% dimensions + 8% strength`；
10. family score 作为人格候选 authority；
11. `strengthFit` 固定分数；
12. HIGH / MODERATE 的 `28 / 8` 阈值；
13. Archetype confidence 组合公式；
14. 由上述 candidate ranking 直接决定公网 dominant / secondary personality。

允许保留的方式只有：

```text
historical experiment
shadow analytics
modern behavior translation
non-authoritative UI / calibration
```

禁止：

```text
EXPERIMENTAL
→ TraditionalPatternResult
```

---

## 7. Missing Traditional Capabilities（当前缺失）

Production-ready `TraditionalPatternResult` 至少还缺以下能力。

### 7.1 月令 / 取格证据

- `month_command` / 月令明确对象；
- 月令藏干层级；
- 透干位置；
- 本气 / 中气 / 余气证据；
- 若采用：月令司权 / 节气深浅；
- root / 根气 evaluator；
- host candidate 与 competing candidate。

### 7.2 旺衰

当前只有实验 support ratio，尚缺一套明确传统 profile 下可解释、可测试的：

- 得令；
- 得地；
- 得势；
- 根；
- 透；
- 生扶 / 泄耗 / 克制；
- 合化后是否改变有效力量；
- evidence，而不是只有 strong / balanced / weak 三个标签。

### 7.3 关系

当前 production 只有：

- 天干五合存在性；
- 六合；
- 六冲；
- 六害。

缺：

- 刑；
- 破；
- 三合；
- 三会；
- 半合 / 拱合（若 profile 采用）；
- 天干合化条件；
- 地支合化条件；
- 冲合并见；
- 位置 / 月令 / 力量条件；
- 关系是否真正影响 host / 格局的证据语义。

### 7.4 常规格局

缺 production adjudication：

- 正官；
- 七杀；
- 正财；
- 偏财；
- 正印；
- 偏印；
- 食神；
- 伤官；
- 建禄；
- 月劫；
- 阳刃 / 羊刃（若 profile 启用）。

### 7.5 格局状态

缺：

- clear / 成格；
- mixed / 兼格 / 不纯；
- 败格；
- 破格；
- 救应；
- counter evidence；
- 不成单一格；
- indeterminate；
- disputed / 流派分歧。

### 7.6 从格 / 特殊格局

缺：

- 从格；
- 假从；
- 是否支持从势 / 从强等细分；
- 化气；
- 专旺；
- 其他特殊格局的 V1 scope policy。

### 7.7 Evidence Contract

当前 `BaziDerivedFeatures` 不足以表达完整格局证据。需要至少能表达：

```text
rule_profile_version
pattern_status
primary_pattern
secondary_patterns[]
formation_state
follow_structure
strength_context
key_combinations[]
evidence[]
counter_evidence[]
ambiguities[]
evidence_strength / confidence semantic
```

其中 `confidence` 必须是“当前 rule profile 下证据支持程度”，不能复用当前 `.72/.62/.50` 或 archetype confidence。

### 7.8 Golden Fixtures

当前测试很好地覆盖了：

- 立春；
- 节界；
- 晚子时当前 profile；
- DST gap / overlap；
- cross-library 四柱 reference vectors；
- deterministic replay；
- Ten-God basics；
- 现有 engineering ranking behavior。

但 Production Traditional Pattern 还缺：

- 每个格局 clear fixture；
- mixed fixture；
- counter-evidence fixture；
- no-sufficient-evidence fixture；
- host-direction fixtures；
- Rule Profile dispute fixtures；
- 从 / 假从 fixtures；
- 建禄 / 月劫 / 阳刃 fixtures；
- 合化 / 冲刑破与格局交互 fixtures。

---

## 8. Recommended Rule Profile Decisions

下一轮负责人需要明确确认以下决定；本审计不代替负责人拍板。

### RP-01 — Calendar Profile

确认：

```text
Year boundary = exact Li Chun?
Month boundary = exact Jie?
Day boundary = civil midnight or Zi-beginning?
Late Zi = same day or next day?
True solar time = off / opt-in / required?
```

### RP-02 — Pattern School Source

建议延续现有研究方向，把 V1 主 profile 明确写成类似：

```text
Zi Ping month-command pattern method
primary reference: 《子平真诠》体系
cross-reference: 《三命通会》 / 《渊海子平》
```

但必须明确：现代注解、开源项目只用于工程参考，不能混成匿名“传统算法”。

### RP-03 — Month Host Selection

必须冻结：

- 月令本 / 中 / 余气如何候选；
- 透干优先级；
- 杂气月处理；
- 是否实现司令 / 分日用事；
- 会合改变月令语义的条件。

### RP-04 — Day-master Strength Profile

必须决定：

- V1 格局判定究竟需要多细的旺衰；
- 得令 / 得地 / 得势如何结构化；
- 是否允许数值化；
- 若数值化，每个值必须有明确规则出处与 evidence，而不能沿用当前 support ratio。

### RP-05 — Jian Lu / Yue Jie / Yang Ren

确认：

- 建禄、月劫作为 self-rooted host，后续另取何用；
- 阳刃是否 V1 启用；
- 若启用，采用哪一明确 convention。

### RP-06 — Formation / Break / Rescue

明确：

- 八格各自成格关键条件；
- counter evidence；
- 破格；
- 救应；
- directional modifier：例如“正官佩印”与“印绶用官”不可合并。

### RP-07 — Mixed / Ambiguity Policy

必须允许：

```text
clear
mixed
indeterminate
disputed
```

不得用 candidate tie-break 强制每盘只落一个纯人格。

### RP-08 — Follow / Special Scope

决定 V1：

- 从格 / 假从做到什么程度；
- 是否暂缓化气 / 专旺 / 其他外格；
- 未覆盖的情况返回 `indeterminate` / `unsupported`，不要猜。

### RP-09 — Translation Authority Cutover

在 `TraditionalPatternResult` 未完成前：

```text
personality-map/0.2.0 = legacy / experimental authority
```

切换时必须做到：

```text
TraditionalPatternResult evidence
→ explicit translation rule
→ Public Personality
```

而不是：

```text
TraditionalPatternResult
+ 旧 candidate_score
→ 再混成一个新分数
```

---

## 9. TraditionalPatternResult Readiness

```text
NOT READY
```

### 9.1 可以复用的地基

- Birth normalization；
- IANA timezone / DST；
- resolved instant replay；
- tyme4ts calendar adapter；
- 四柱；
- 月支 / 节界；
- 十神；
- 藏干表；
- basic relations；
- deterministic IDs / version fields；
- 现有 Bazi test harness。

### 9.2 不能复用为 Traditional authority 的部分

- 当前藏干数值权重；
- month ×1.5；
- support ratio；
- 0.58 / 0.42；
- 15 dimensions；
- family score；
- strength fit；
- candidate score；
- archetype confidence；
- candidate score 直接决定公网人格。

### 9.3 开发 Gate

下一步正确顺序：

```text
Traditional Bazi Rule Audit   ✅ 本文
↓
Rule Profile / School Choice Lock
↓
TraditionalPatternResult Contract
↓
Golden Fixtures
↓
Pattern Engine implementation
↓
Shadow / dual-run validation
↓
Public Personality translation cutover
```

**当前可以开始 Rule Profile Lock；不建议在 Rule Profile 未冻结时直接开始 production TraditionalPatternResult 规则实现。**

---

## 10. Source / Evidence Notes

### Repository evidence

重点实际代码：

- `modules/birth/normalize.ts`
- `modules/birth/timezone.ts`
- `modules/bazi/adapters/tyme4ts-adapter.ts`
- `modules/bazi/constants.ts`
- `modules/bazi/rules.ts`
- `modules/bazi/engine.ts`
- `modules/bazi/derived.ts`
- `modules/bazi/relations.ts`
- `modules/bazi/luck.ts`
- `modules/bazi/traditional.ts`
- `modules/interpretation/engine.ts`
- `modules/interpretation/archetypes.ts`
- `modules/interpretation/PERSONALITY_ARCHETYPE_SPEC.md`
- `app/birth/page.tsx`
- `lib/public-result.ts`
- `lib/public-personalities.ts`
- `app/result/page.tsx`

重点测试：

- `tests/bazi/engine.test.ts`
- `tests/bazi/rules.test.ts`
- `tests/bazi/timezone.test.ts`
- `tests/bazi/reference-vectors.test.ts`
- `tests/birth/**`
- `tests/interpretation/engine.test.ts`
- `tests/interpretation/public-personalities.test.ts`

### Traditional research basis

本审计不声称“传统八字只有一个流派”。当前仓库研究已经明确：

- 主研究线：子平月令格局法；
- 主要结构参考：《子平真诠》及相关评注；
- 交叉传统参考：《三命通会》《渊海子平》；
- 羊刃等争议必须显式 profile 化；
- 开源实现只作 reference / engineering evidence，不作传统最终权威。

外部文本交叉核验亦支持：

- 《渊海子平》明确“以日为主，月为提纲”，并先看月令、强弱与整体配合；
- 《三命通会·论羊刃》明确记载子平“五阳干有刃、五阴干无刃”的一种传统口径，同时其卷内保留更广旧说，足以证明该问题不应被当成无争议单一规则。

---

## 11. Audit Review（自检）

### 1. 是否遗漏重要八字规则？

已覆盖用户指定 Calendar / Structural / Pattern / Numeric Rules，并额外指出刑、破、三合、三会、合化、根气、司令等缺失能力。

### 2. 是否把工程权重误认为传统规则？

没有。藏干权重、月支 1.5、support ratio、0.58/0.42、dimensions、52/18/22/8 等全部标为 `EXPERIMENTAL` 或非权威工程表示。

### 3. 是否区分“十神分布”和“格局判断”？

是。`tenGodDistribution` 仅为工程统计；Traditional Pattern 必须从月令 / 透干 / host / strength / formation evidence 判定。

### 4. 是否区分“传统事实”和“现代人格翻译”？

是。10 Public Personality registry 仅允许作为 translation layer。

### 5. 是否明确标记流派争议？

是。共标记 9 项 `SCHOOL_CHOICE`，包括立春年界、日界、晚子时、真太阳时、司令 / 透干、羊刃、成败破救、从格、特殊格局范围。

### 6. 是否追踪实际代码位置？

是。关键规则均追踪到具体 file / function。

### 7. 是否指出 `personality-map/0.2.0` authority 风险？

是。确认它当前通过 `app/birth/page.tsx → selectArchetypeCandidate → app/result/page.tsx` 实际决定公网 dominant / secondary personality，并标为最高 P0 authority 风险。

### 8. 是否越权修改正式算法？

没有。本轮只新增本文档，不修改任何 production logic，不修改 Public Personality mapping，不 Merge PR #16。
