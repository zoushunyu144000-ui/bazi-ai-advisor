# AI Bazi / Skill / MCP Benchmark

状态：Research only / **不构成 07 AI System 正式实现批准**

最后核查：2026-08-18

研究分支：`research/ai-bazi-benchmark`

## 0. Executive conclusion

本轮最重要的结论不是“找到一个现成八字大模型直接接上”，而是确认了一个相当稳定的工程共识：

```text
确定性排盘 / 规则计算
→ typed facts / evidence packet
→ 只选择与当前问题有关的上下文
→ LLM 做解释、组织、建议
→ structured output
→ validation / rendering
```

**不建议把八字知识、所有流派规则、全部命盘、大运流年、历史对话和安全规则塞进一个巨大 System Prompt。**

更值得复用的是：

- deterministic engine 与 LLM 的 source-of-truth 隔离；
- Evidence / Fact 层；
- topic + fortune scope 的上下文选择；
- Tool / MCP 的 typed input-output 边界；
- structured output + deterministic validation；
- report 与 advisor 使用不同 prompt template；
- memory 放在应用层，不放进排盘 engine；
- 每次只取与当前问题相关的历史与岁运，而不是全量塞入上下文。

这与本项目已经进入 `main` 的 Wave 1.5 Contract 高度一致：

```text
BirthProfile
→ BaziCalculationResult
  ├─ chart
  ├─ calculationMetadata
  ├─ derivedFeatures
  ├─ relations
  └─ luck
→ Interpretation
→ future AI Report / Advisor
```

因此 07 的正式实现不应重做排盘，也不应为了“AI 化”再引入第二套传统命理事实。

---

## 1. Research scope and constraints

本研究覆盖：

- GitHub repositories
- npm packages
- MCP servers
- Agent / Claude / Codex Skills
- structured fortune-telling / report-generation patterns
- 商业产品的公开产品流程与信息架构

明确不做：

- 不接真实 AI Provider；
- 不修改 `modules/ai/**` 生产实现；
- 不修改 Domain Contract；
- 不修改数据库；
- 不修改 UI；
- 不修改支付；
- 不复制商业产品品牌、文案、图片、报告正文或专有内容；
- 不把公开可见但无 License 的代码当作可商业复用代码。

License 结论仅用于工程选型筛查，不替代正式法律意见。

---

## 2. Project baseline: what 07 already has to consume

根据当前项目 `docs/04_TECH_ARCHITECTURE.md`、`docs/06_AI_SYSTEM.md` 与 Wave 1.5 Contract，07 未来应把以下数据当成可信上游，而不是自行计算：

### 2.1 Canonical calculation facts

来自 02 / persistence read path：

- `BaziChart`
- `BaziCalculationMetadata`
- `BaziDerivedFeatures`
- `BaziRelation[]`
- `BaziLuckStructure`

### 2.2 Interpretation facts

来自 04：

- personality / behavior signals
- dimensions
- evidence keys
- confidence
- module-local contributors / positive mode / stress mode 等解释证据

### 2.3 AI responsibilities

07 适合负责：

- 选择相关证据；
- 将传统结构翻译成现代年轻用户语言；
- 组织免费 / 完整报告；
- 结合当前大运与问题进行上下文化解释；
- 连续问答；
- 给出低风险、可执行建议；
- 结构化返回结果并保留 prompt / model / schema version。

07 不适合负责：

- 从出生年月日重新算四柱；
- 重新算十神、五行、日主强弱；
- 自己生成大运；
- 重新判断 canonical relations；
- 用 LLM 推翻上游 deterministic facts。

---

## 3. Benchmark shortlist

| Project | Type | Verified signal | License | Maintenance snapshot | Decision in this research |
|---|---|---|---|---|---|
| `Brhiza/mingyu` / `mingyu-core` | TS core + prompt/evidence + MCP + skill | `mingyu-core` 0.1.29；有 Bazi prompt builder、evidence types、fortune scope；MCP tools | **`packages/core` MIT**；repo root GitHub metadata 未识别统一 License | main pushed 2026-08-17；约 333 stars / 91 forks | **ADAPT**, selective API spike only |
| `jinchenma94/bazi-skill` | Agent Skill + deterministic Python chart script | 先运行脚本，再以 stdout 作为四柱/大运/流年事实；Skill 编排分析流程 | MIT | pushed 2026-08-17；约 2.5k stars / 427 forks | **REFERENCE / ADAPT workflow** |
| `xuemian168/bazi-skill` | Codex / Claude Skill + orchestrator + report workflow | fact package、evidence package、planner / master / validator 分层、structured report validation | **No License found** | repo updated 2026-08-17；约 45 stars | **REFERENCE ONLY** |
| `cantian-ai/bazi-mcp` | MCP server | Zod tool schema；`getBaziDetail` / reverse lookup / calendar；JSON tool result | ISC | 約 422 stars / 162 forks；last push 2025-10-11 | **REFERENCE ONLY / maintenance caution** |
| `openfate-ai/openfate-mcp` | deterministic Bazi MCP + Agent Skill | deterministic packages → stable JSON → agent explanation；policy as first-class output | MIT | created 2026-06；updated 2026-08；约 130 stars | **ADAPT MCP/tool boundary** |
| `shunshi-ai/bazi-reader-mcp` | TS core + thin MCP wrapper | production calculation core and MCP share engine；parity tests；true solar time | MIT | updated 2026-08；约 10 stars | **REFERENCE / benchmark oracle candidate** |
| `gaoxin492/bazi-skill` | Skill + local chart persistence | chart JSON save/load/list/delete demonstrates memory separated from calculation | **No License found** | last push 2026-03；约 26 stars | **REFERENCE ONLY** |
| 测测 | Commercial app | report + AI Q&A + recommended questions + profile/context usage | Proprietary | current public product / policy pages checked | **REFERENCE ONLY** |
| 问真 / App Store listings under this name | Commercial apps | chart workspace + deep analysis + 大运/流年/流月/流日 hierarchy | Proprietary | current App Store listings checked | **REFERENCE ONLY** |

### 3.1 Important License nuance: Mingyu

GitHub repository root metadata did not expose a repo-wide license, while `packages/core/package.json` explicitly declares `MIT` and `packages/core/LICENSE` contains the MIT license.

Research consequence:

- `mingyu-core` package APIs/source under the package directory can be evaluated as MIT-covered material；
- do **not** assume every asset, product page, root-level content, prompt copy, branding or unrelated directory is automatically covered by the same permission；
- if formally adopting any specific file outside `packages/core`, re-check that path’s licensing before merge。

### 3.2 Important License nuance: public Skill ≠ reusable Skill

`xuemian168/bazi-skill` and `gaoxin492/bazi-skill` are publicly readable but no license was found in the current repository metadata / root contents checked during this research.

Therefore：

```text
public source visibility
≠
permission to copy into a commercial product
```

Their architecture can inform our independent design, but prompt text / source code should not be copied into production unless the author adds a suitable license or gives permission.

---

# 4. Answer 1 — How do deterministic engines hand data to LLMs?

The strongest projects do **not** ask the model to calculate first and interpret second in one free-form prompt.

There are three recurring patterns.

## Pattern A — direct structured result → prompt builder

Mingyu is the clearest example.

Its Bazi prompt builder accepts a typed `BaziChartResult` and constructs a prompt from separate sections. It can additionally receive：

- topic；
- school / schools；
- fortune scope；
- fortune focus；
- selected fortune context；
- current question。

The important point is that the **chart result already exists before prompt construction**.

This is directly compatible with our architecture：

```text
BaziCalculationResult
+ Interpretation result
→ ContextAssembler
→ PromptTemplate
→ LLM
```

## Pattern B — deterministic engine exposed as a tool / MCP

OpenFate, Cantian and Shunshi expose deterministic calculation as typed tools.

Typical MCP sequence：

```text
agent receives user intent
→ tool call calculate/get chart
→ deterministic JSON
→ model explains JSON
```

OpenFate explicitly treats calculation policy as data, e.g. timezone / true solar time / day-boundary policy, rather than hiding those assumptions in prose.

This is excellent for a general external agent ecosystem.

For **our own web backend**, however, 07 already has direct access to the application’s persisted canonical result. Adding MCP between our own 02/08 and 07 would usually be an unnecessary transport layer.

Recommendation：

- internal app: direct typed service / repository call；
- future external agent integration: MCP can wrap **our** canonical service later；
- do not make MCP mandatory for the core V1 report path。

## Pattern C — script output is declared authoritative

`jinchenma94/bazi-skill` uses a very explicit workflow：run the deterministic chart script first, then analysis must obey the script output.

The reusable principle is not the script itself; it is this invariant：

> AI may interpret confirmed facts, but may not silently replace them with its own recalculation.

That should become a 07 testable invariant.

---

# 5. Answer 2 — What does prompt input usually contain?

Across the stronger implementations, prompt input is **layered**, not a single wall of instructions.

A mature input package normally contains five groups.

## 5.1 Stable policy

Small, mostly static：

- AI role / product purpose；
- do-not-recalculate invariant；
- uncertainty language；
- safety constraints；
- answer style；
- source hierarchy。

This should be short enough to version and review.

## 5.2 Deterministic chart facts

Only facts required for the task：

- four pillars；
- day master；
- hidden stems / ten gods where relevant；
- canonical derived features；
- relevant relations；
- calculation policy / metadata when important。

Do not pass raw birth datetime as an invitation to recalculate when canonical chart facts already exist.

## 5.3 Evidence package

This is the most valuable reusable pattern from Mingyu.

Mingyu models evidence explicitly with levels such as：

- primary evidence；
- supporting evidence；
- counter-evidence；
- limitations；
- timing evidence。

Its natal evidence implementation also stores sources, limitations and fact keys instead of turning every chart field directly into a personality claim.

For our project, the equivalent should use **existing evidence keys / canonical fact IDs**, not copy Mingyu’s domain types wholesale.

Recommended internal concept：

```ts
AdvisorEvidence {
  factKey
  role: primary | supporting | counter | limitation | timing
  summary
  confidence?
  sourceKeys[]
}
```

This is an **07 module-local design candidate**, not a proposal to change shared Domain Contract in this research.

## 5.4 Task scope

Strong prompt builders specify what the model is answering now：

- topic: career / relationship / wealth / growth / recent etc.；
- horizon；
- natal vs current fortune；
- selected Da Yun / year / month；
- current question。

Mingyu’s `fortuneScope` pattern is particularly useful：`natal | full | dayun | year | month | day`.

Our version should not necessarily copy this enum, but should adopt the principle：**scope the context before generation**.

## 5.5 Output contract

The model should receive an explicit structured-output contract：

- schema version；
- required fields；
- evidence references；
- confidence / caveat fields where needed；
- allowed recommendation style；
- no raw chain-of-thought requirement。

---

# 6. Answer 3 — Tool calling, MCP, structured output, memory?

## 6.1 Tool calling

Yes, mature AI-agent projects commonly expose deterministic calculation via tools.

Use cases：

- calculate chart；
- detect relations；
- true solar time；
- reverse Bazi lookup；
- calendar / almanac；
- fetch calculation policy。

For our app V1, the model does not need to call `calculate_bazi` if the backend already supplies `BaziCalculationResult`.

A better future tool set for 07 would be **read-only context tools** if context becomes too large：

```text
get_current_chart_context
get_current_luck_context
get_report_section_summary
search_conversation_memory
```

But this should only be introduced when real context-size / orchestration needs justify it.

## 6.2 MCP

Yes. OpenFate, Cantian, Shunshi and Mingyu all demonstrate the MCP pattern.

The main reusable design is：

```text
thin MCP transport
→ deterministic core library/service
→ stable JSON result
```

Do not put business interpretation truth inside MCP descriptions.

### Recommendation for us

- V1 website internal path: **no MCP required**；
- future “让 Claude/Codex/other agents 调用我们的八字引擎”: expose a thin MCP adapter over the same canonical service；
- MCP should never become a second calculation implementation。

## 6.3 Structured output

Yes, and it is one of the strongest patterns worth adopting.

Examples：

- MCP schemas use Zod / typed inputs；
- tool results are serialized stable JSON；
- `xuemian168/bazi-skill` has a structured `AnalysisResult` and a deterministic validation script；
- OpenFate includes both data and calculation policy / attribution in the output shape。

For us：

- Report generation should return a schema, not final markdown as the only source of truth；
- Advisor can return a compact structured object that the UI renders；
- schema must be versioned with `report_schema_version`；
- validation happens before persistence / rendering。

## 6.4 Memory

Memory is much less standardized than chart calculation.

The useful pattern is **separation of concerns**：

```text
chart persistence
conversation history / user memory
LLM prompt context
```

should be separate layers.

`gaoxin492/bazi-skill` demonstrates local chart JSON storage outside the calculation function. Commercial AI products also publicly disclose that conversational AI may use user-provided profile/context and message content.

Our project already has database concepts for：

- conversations；
- messages；
- user memories；
- reports；
- calculation result persistence。

Therefore do not adopt an external memory framework just because it exists. 07 should first consume our own DB read paths through a ContextAssembler.

---

# 7. Answer 4 — How are reports divided into chapters?

There is no single open-source standard, but the product pattern is stable：

```text
identity / summary
→ explanation of why
→ life-domain modules
→ time / luck context
→ actions
→ conversational continuation
```

Our existing `docs/06_AI_SYSTEM.md` already proposes 10 chapters：

1. 核心人格结构
2. 优势与天然能力
3. 容易卡住的模式
4. 情绪与压力反应
5. 人际与亲密关系
6. 工作方式与事业方向
7. 金钱与风险倾向
8. 大运 / 阶段性背景
9. 近期可执行建议
10. 可继续向 AI 顾问追问的问题

Benchmark suggests **keeping this direction**, but presenting it in a hierarchy rather than one long generated essay.

Recommended report information architecture：

### Layer 1 — Snapshot

- 1–3 sentence identity summary；
- core archetype / key dimensions；
- top strengths；
- top friction pattern。

### Layer 2 — Why this result

- evidence cards；
- relevant chart / derived facts；
- confidence / limitation；
- user can expand technical details instead of seeing a wall of metaphysics terms。

### Layer 3 — Life domains

- personality / stress；
- relationship；
- work / career；
- money / risk；
- growth / decision style。

### Layer 4 — Timing

- current Da Yun；
- only relevant recent year/month context；
- explain themes, not guaranteed events。

### Layer 5 — Action + Ask AI

- 3–5 practical actions；
- contextual suggested questions；
- “ask about this section” entry preserves report context automatically。

This structure borrows **information architecture**, not any external report copy.

---

# 8. Answer 5 — How should AI dialogue obtain chart, luck, history and current question?

The cleanest approach is a **ContextAssembler** owned by 07 application logic.

Recommended flow：

```text
user sends question
    ↓
resolve active BirthProfile / calculationResultId
    ↓
load BaziCalculationResult from 08 repository
    ↓
load Interpretation result / report summaries
    ↓
classify question intent + time horizon
    ↓
select relevant chart evidence
    ↓
select relevant Da Yun / year / month only
    ↓
retrieve relevant conversation summaries / user memories
    ↓
build typed AdvisorContextPackage
    ↓
LLM generation with structured output
```

## 8.1 Proposed module-local context package

This is a research recommendation, **not a Domain Contract change**：

```ts
AdvisorContextPackage {
  meta: {
    locale
    currentTime
    engineVersion
    ruleProfileVersion
    mappingVersion
    promptVersion
    outputSchemaVersion
  }

  chartFacts: {
    // selected canonical BaziCalculationResult facts
  }

  interpretationEvidence: {
    // selected 04 signals / evidence keys / confidence
  }

  fortuneContext: {
    currentDaYun?
    relevantYear?
    relevantMonth?
    relevantRelations?
  }

  reportContext: {
    reportSummary?
    relevantSectionSummaries?
  }

  memoryContext: {
    stableUserFacts[]
    relevantConversationSummaries[]
  }

  question: {
    text
    topic
    horizon?
  }

  outputContract: {
    schemaVersion
  }
}
```

## 8.2 Retrieval rules

### Chart

Always load by trusted server-side repository path. Do not rely on the browser sending a complete chart as truth.

### Luck

Do not send all lifetime Da Yun + every annual/monthly item for every question.

Examples：

- “我适合什么工作？” → natal + interpretation, current Da Yun optional；
- “我今年适合换工作吗？” → natal + current Da Yun + current/relevant year；
- “下个月关系怎么样？” → natal + current Da Yun + current year + selected month；
- “解释我的命盘” → natal, no need for full 100-year timeline。

### Conversation history

Use：

```text
recent turns
+
relevant summaries
+
selected stable user memory
```

not the entire raw chat log.

### Current question

Always keep it as a first-class field, separated from chart facts. This makes evaluation and caching easier.

---

# 9. Answer 6 — Which Skill / Prompt structures are worth borrowing?

## 9.1 Mingyu: sectioned prompt builder — ADAPT

Worth adopting：

- prompt composed from independent sections；
- question topic explicit；
- current time explicit；
- chart facts explicit；
- fortune scope explicit；
- task explicit；
- multi-school context optional rather than always loaded。

Do **not** copy its large prompt text wholesale. Rebuild templates around our canonical Contract and product voice.

## 9.2 Mingyu: evidence bundle — ADAPT strongly

Most useful concept in this benchmark：

```text
fact
→ source
→ evidence role
→ limitation
→ prompt-ready representation
```

This would reduce generic fortune-telling and make “为什么这么判断” traceable.

## 9.3 OpenFate / Shunshi: calculation policy as first-class data — ADAPT

Useful for：

- rule-profile explainability；
- debugging conflicting charts；
- support cases；
- preventing LLM from guessing DST / true-solar-time / boundary rules。

Our `calculationMetadata` already provides the correct home for this principle.

## 9.4 `xuemian168/bazi-skill`: skill → planner → specialist → validator — REFERENCE ONLY

Architecture is interesting for **report-grade complex synthesis**：

```text
scenario skill
→ planner selects evidence / methods
→ optional specialist analyses in parallel
→ orchestrator synthesizes
→ validator checks contract
```

But：

- repository has no verified license；
- runtime multi-agent would add latency / cost / inconsistency；
- V1 does not need “大师会诊” for every answer。

Recommendation：keep the **planner / validator idea**, not the prompt text or multi-agent fan-out by default.

## 9.5 `jinchenma94/bazi-skill`: confirmation gate + deterministic source of truth — ADAPT principle

Good workflow principle：

- confirm inputs；
- run deterministic calculation；
- treat tool result as authoritative；
- only then interpret。

Our 03 + 02 + 08 pipeline already improves on this by persisting resolved instant and canonical calculation result.

---

# 10. Answer 7 — Which licenses allow commercial use?

| Source | License finding | Commercial screening result |
|---|---|---|
| `mingyu-core` (`packages/core`) | MIT | Generally permits commercial use, modification and redistribution subject to MIT notice/terms |
| `jinchenma94/bazi-skill` | MIT | Generally commercial-friendly subject to MIT terms |
| `cantian-ai/bazi-mcp` | ISC | Generally commercial-friendly subject to ISC terms |
| `openfate-ai/openfate-mcp` | MIT | Generally commercial-friendly subject to MIT terms |
| `shunshi-ai/bazi-reader-mcp` | MIT | Generally commercial-friendly subject to MIT terms |
| `xuemian168/bazi-skill` | no license found | **Do not copy code / prompt into commercial product without permission** |
| `gaoxin492/bazi-skill` | no license found | **Do not copy code / prompt into commercial product without permission** |
| 测测 / 问真 | proprietary commercial product | product-flow reference only; no copying of proprietary content |

Additional caution：

- A permissive license does not prove metaphysics correctness；
- a package license does not automatically grant rights to unrelated brand assets, datasets or third-party content；
- classic-text excerpts embedded in repositories may have separate provenance questions even when surrounding code is MIT；
- before production adoption, dependency tree licenses must also be checked。

---

# 11. Answer 8 — What code is worth directly reusing?

The surprising result is：**07 itself should directly copy very little Bazi-specific code.**

Our project already owns the most important integration boundary：`BaziCalculationResult`.

## Worth evaluating for direct dependency / isolated reuse

### A. `mingyu-core` selected APIs — conditional

Potentially useful：

- prompt formatting helpers；
- evidence-formatting patterns；
- Bazi evidence utilities as an independent oracle during tests；
- capability / prompt sections if a spike proves they can stay behind an adapter。

But do not import Mingyu domain types into `types/domain/**`.

**Decision：ADAPT first; direct dependency only after a small compatibility spike.**

### B. External engines as golden-test oracle — useful, not runtime dependency

OpenFate / Shunshi / Cantian can be used during engineering to compare：

- pillars；
- true solar time；
- day-boundary behavior；
- relations；
- luck timing。

This is more valuable than routing every production request through them.

### C. MCP SDK patterns — only if/when we expose MCP

If a later product requirement says external agents should call our engine, reuse the official MCP SDK and a thin tool wrapper pattern rather than designing a custom protocol.

Not needed for 07 V1 report generation.

---

# 12. Answer 9 — What should only be architecture reference?

Reference only：

- external giant prompt bodies；
- unlicensed Skill prompt text；
- “multi-school master persona” wording；
- external report copy；
- proprietary commercial report hierarchy details beyond generic IA；
- external user-memory storage implementations；
- external chart Domain types；
- external “吉凶评分 / 事件概率” systems without transparent validated methodology；
- any external health / wealth deterministic claim layer。

The strongest architecture patterns can be independently reimplemented with our own contracts and product language.

---

# 13. Answer 10 — Where should our differentiation be?

The calculation layer alone will not be a durable differentiation. Accurate deterministic calculation is a prerequisite and increasingly reusable.

Our differentiation should sit **above** deterministic facts.

## 13.1 “Traditional facts → modern behavior” bridge

We already have a unique architectural opportunity：

```text
02 canonical traditional facts
→ 04 deterministic interpretation signals
→ 07 natural-language personalized advisor
```

Most open-source projects jump directly from chart facts to a master-style prompt.

We can make the middle layer more explicit and testable.

## 13.2 Evidence-backed explanations

Every important AI conclusion should be able to answer：

- 哪几个命盘 / Interpretation signal 支持？
- 有没有反证？
- confidence 是多少？
- 哪部分只是建议，不是命盘事实？

This can become a product feature such as “为什么这么说”, without exposing chain-of-thought.

## 13.3 Young overseas-Chinese language layer

Not “大师批命” prose.

Differentiation can be：

- Chinese-first but globally usable；
- modern behavior / decision language；
- archetype / meme-friendly surface；
- technical evidence hidden one layer deeper；
- avoids fatalism and fear-selling。

## 13.4 Contextual AI continuation

AI entry should know where the user came from：

- from personality section → ask personality / stress questions；
- from career section → load career evidence automatically；
- from current luck section → load current Da Yun + relevant time context；
- from relationship section → load relevant evidence, not all report text。

This is more valuable than a generic “Ask AI” empty chat box.

## 13.5 Memory with provenance

Long-term advisor value can come from remembering：

- user’s stated goals；
- recurring decision constraints；
- previously discussed concerns；
- report sections already explained。

But memory should never overwrite deterministic chart facts.

Recommended source hierarchy：

```text
canonical calculation facts
>
validated interpretation facts
>
explicit user-provided reality facts
>
conversation summaries / memory
>
LLM inference
```

## 13.6 Evaluation as a product moat

Create evaluation sets for：

- fact contradiction rate；
- evidence citation correctness；
- generic-language rate；
- cross-turn consistency；
- current-luck scope correctness；
- safety / fatalism violations；
- report usefulness / conversion signals。

A well-evaluated prompt stack is harder to copy than a single prompt string.

---

# 14. Recommended 07 architecture after this research

No implementation in this branch. Proposed direction only：

```text
┌──────────────────────────────────┐
│ BaziCalculationResult (02 / 08)  │
│ canonical source of truth        │
└────────────────┬─────────────────┘
                 │
┌────────────────▼─────────────────┐
│ Interpretation result (04)       │
│ behavior signals + evidence keys │
└────────────────┬─────────────────┘
                 │
┌────────────────▼─────────────────┐
│ ContextAssembler (future 07)     │
│ - intent                         │
│ - time horizon                   │
│ - evidence selection             │
│ - luck selection                 │
│ - report summary retrieval       │
│ - memory retrieval               │
└────────────────┬─────────────────┘
                 │
┌────────────────▼─────────────────┐
│ Prompt Stack                     │
│ 1. short stable policy           │
│ 2. scenario template             │
│ 3. dynamic evidence packet       │
│ 4. output schema                 │
└────────────────┬─────────────────┘
                 │
┌────────────────▼─────────────────┐
│ Provider Adapter / AI SDK        │
│ provider selected later          │
└────────────────┬─────────────────┘
                 │
┌────────────────▼─────────────────┐
│ Structured Output Validator      │
│ + evidence consistency checks    │
└────────────────┬─────────────────┘
                 │
┌────────────────▼─────────────────┐
│ Persist + Render                 │
└──────────────────────────────────┘
```

## 14.1 Prompt stack, not giant System Prompt

Recommended split：

### P0 — Stable invariant prompt

Very small：

- role；
- source-of-truth rule；
- uncertainty / safety；
- no recalculation；
- style principles。

### P1 — Scenario template

Separate templates：

- free report；
- full personality report；
- AI advisor；
- current-luck question；
- relationship / career topic if needed。

### P2 — Dynamic context

Typed facts / evidence / relevant memory.

### P3 — Output schema

Provider-native structured output / schema validation.

This makes each layer independently versionable and testable.

---

# 15. Report generation: recommended execution pattern

For full paid reports, avoid a single request that writes everything from scratch.

A better pipeline：

```text
1. deterministic evidence selection
2. report plan / section evidence map
3. generate sections from bounded evidence
4. cross-section consistency check
5. schema validation
6. render final report
```

The “report plan” does not need a separate expensive model initially; it can be deterministic based on section definitions and evidence availability.

Each generated section should save：

- section key；
- prompt version；
- schema version；
- model id；
- evidence keys used；
- generation status；
- text / structured payload。

Persistence schema changes are **out of scope for this research** and must be handled by the proper contract/database process if later approved.

---

# 16. Advisor memory strategy

## 16.1 Three memory classes

### A. Immutable / authoritative context

- canonical chart；
- calculation metadata；
- luck structure；
- validated interpretation result。

Not “memory” in the conversational sense. Always retrieved from source-of-truth storage.

### B. Stable user facts

Examples：

- user explicitly says they are studying / working in a field；
- current relationship status；
- goals；
- constraints。

Should have provenance and user ownership / deletion semantics.

### C. Conversation working memory

- recent messages；
- summarized previous decisions；
- relevant earlier Q&A。

Should expire / compress and be retrieved by relevance.

## 16.2 What not to store as truth

Do not promote these automatically into authoritative memory：

- model speculation；
- predicted events；
- inferred diagnosis；
- inferred financial facts；
- a generated personality sentence without evidence provenance。

---

# 17. Commercial product references

## 17.1 测测 — learn the continuation loop

Public product descriptions show a combination of：

- personal reports；
- AI intelligent Q&A；
- personalized suggested questions；
- AI agents / virtual consultants；
- broader profile/context use in AI interaction。

What to learn：

```text
result/report
→ contextual AI entry
→ suggested questions
→ continued conversation
```

What **not** to copy：

- brand；
- report wording；
- AI persona wording；
- community design；
- images；
- proprietary tests / reports。

Our V1 explicitly does not need its community / human-consultant marketplace scope.

## 17.2 问真 — learn the chart/time hierarchy

Current App Store listings using the “问真” name show product patterns around：

- Four Pillars chart workspace；
- compatibility / themed analysis；
- deep analysis；
- time hierarchy across 大运 / 流年 / 流月 / 流日；
- knowledge / reference tools。

What to learn：

- the user should be able to move from the chart to a **specific analysis object**；
- time context is hierarchical, not a giant lifetime dump；
- professional raw chart detail and consumer interpretation can be separate layers。

Caution：multiple current App Store listings use the “问真” name and may have different publishers / provenance. This benchmark treats them only as **observable product-pattern evidence**, not as technical or brand authority.

---

# 18. REUSE / ADAPT / REFERENCE ONLY / DO NOT USE

## REUSE

1. **Our existing `BaziCalculationResult` as the only 07 chart source of truth.**
2. **Our existing Interpretation output / evidence keys** rather than recalculating personality facts in LLM prompts.
3. **Existing Vercel AI SDK foundation** already approved in the repository, once provider work formally starts.
4. Permissively licensed deterministic libraries already approved by their owning modules; 07 consumes their outputs, it does not bypass 02.
5. Official schema validation / typed-data mechanisms already in the TypeScript stack.

External direct reuse is intentionally conservative. No external Bazi AI package is approved in this research as a drop-in replacement for our 07 stack.

## ADAPT

1. Mingyu’s **sectioned prompt builder** pattern.
2. Mingyu’s **evidence bundle** pattern: primary / supporting / counter / limitation / timing.
3. Mingyu’s **topic + fortune-scope selection** pattern.
4. OpenFate / Shunshi’s **deterministic core → thin tool/MCP → stable JSON** boundary.
5. Calculation policy / provenance as first-class metadata.
6. Skill-style **information completeness gate** before precise analysis.
7. Separate **report template vs advisor template**.
8. Structured output + deterministic validation before persistence/rendering.
9. Application-layer memory retrieval instead of model-owned permanent memory.
10. Optional planner / evidence selector for complex reports, without default multi-agent fan-out.

## REFERENCE ONLY

1. `xuemian168/bazi-skill` orchestration / multi-school architecture — no verified license.
2. `gaoxin492/bazi-skill` local chart storage pattern — no verified license.
3. `jinchenma94/bazi-skill` master-style analysis content and classic-text prompt wording — even though MIT, not aligned with our consumer tone and canonical contract.
4. `cantian-ai/bazi-mcp` transport/tool design — useful but maintenance is less active and our internal app does not need MCP as an extra hop.
5. OpenFate / Shunshi / Cantian engine outputs as **benchmark oracles**, not production source-of-truth replacements.
6. 测测 / 问真 product flow, IA, report hierarchy and AI entry points only.
7. External multi-school “大师 persona” prompts.

## DO NOT USE

1. **One giant System Prompt** containing all Bazi rules, classic texts, user chart, full luck timeline, full report and entire conversation.
2. LLM recalculation from raw birth datetime.
3. A second copy of five-element / ten-god / day-master-strength logic inside 07.
4. MCP as a mandatory internal hop just because MCP is fashionable.
5. Full lifetime fortune data in every advisor request.
6. Full raw conversation history in every request.
7. Unlicensed public Skill code / prompt text in the commercial product.
8. Proprietary commercial app copy, images, report text or branded interaction design.
9. External library types leaking into `types/domain/**`.
10. Multi-agent “大师会诊” for every ordinary question.
11. LLM-generated claims being written back as canonical chart facts.
12. Fear-based deterministic health, death, legal or investment predictions.
13. “吉凶概率 / 财富幅度 / 疾病概率” invented from evidence counts without a validated model.
14. Provider-specific prompt design before provider benchmarking and evaluation criteria are approved.

---

# 19. Recommended next research / implementation gate for 07

This branch should stop at research.

Before formal 07 implementation, recommended approval sequence：

```text
A. Freeze 07 input ownership
   BaziCalculationResult + Interpretation + DB memory read paths

B. Define module-local ContextAssembler contract
   no shared Domain change unless proven necessary

C. Define two output schemas
   report
   advisor

D. Build evaluation fixtures first
   contradiction / evidence / genericness / safety / consistency

E. Benchmark 2–3 model providers behind existing AI SDK adapter
   quality / structured output / latency / cost / Chinese writing

F. Implement layered prompt stack
   small policy + scenario + evidence + schema

G. Only then decide whether tool calling is actually needed

H. MCP remains a separate future external-agent capability
```

Formal AI Provider selection is explicitly **not performed in this benchmark**.

---

# 20. Source registry

Verified on 2026-08-18 unless otherwise noted.

## Open source / npm / MCP / Skill

- Mingyu: https://github.com/Brhiza/mingyu
- `mingyu-core`: https://www.npmjs.com/package/mingyu-core
- Mingyu core package metadata / License: `packages/core/package.json`, `packages/core/LICENSE`
- Mingyu Bazi prompt builder: `packages/core/src/prompt/bazi.ts`
- Mingyu prompt evidence types: `packages/core/src/prompt-evidence/types.ts`
- Mingyu natal evidence: `packages/core/src/bazi/natalEvidence.ts`
- Cantian Bazi MCP: https://github.com/cantian-ai/bazi-mcp
- OpenFate Bazi MCP: https://github.com/openfate-ai/openfate-mcp
- Shunshi Bazi core / MCP: https://github.com/shunshi-ai/bazi-reader-mcp
- Jinchen Bazi Skill: https://github.com/jinchenma94/bazi-skill
- Xuemian Bazi Skill: https://github.com/xuemian168/bazi-skill
- Gaoxin Bazi Skill: https://github.com/gaoxin492/bazi-skill

## Commercial-product public sources

- 测测 product page: https://www2.cece.com/product/
- 测测 current user agreement / AI disclosure pages under `cece.com`
- 测测 Google Play listing: `com.lingocc.cc5`
- 问真-related current public App Store listings searched on 2026-08-18; due publisher ambiguity, only generic product patterns are used.

---

# 21. Final research decision

The 07 implementation should be designed as a **context-and-evidence orchestration system**, not as “a very clever fortune-telling prompt.”

Our strongest path is：

```text
reliable deterministic facts
+
explicit modern interpretation signals
+
scoped timing context
+
retrieved user reality / history
+
small versioned prompt templates
+
structured output validation
=
trustworthy personalized AI advisor
```

That is a stronger and more defensible product architecture than copying any existing “大师 Prompt”.
