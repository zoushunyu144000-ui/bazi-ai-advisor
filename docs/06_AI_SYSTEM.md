# 06 — AI System

状态：**Formal V1 implemented on Draft PR #13 / real provider configuration pending**

最后更新：2026-08-18

## 1. 不可变原则

AI 层只负责解释、报告组织、上下文化建议与连续问答。

LLM **永远不得重新排八字**。07 唯一可消费的命理事实来源是：

```text
BaziCalculationResult
+
PersonalityProfile
```

因此禁止把原始出生日期 / 时间交给模型并要求它自行计算：

- 四柱
- 天干地支
- 藏干
- 十神
- 五行分布
- 日主强弱
- 干支关系
- 大运
- 节气边界

这些事实继续由 deterministic Birth / Bazi / Interpretation 链负责。

## 2. Formal V1 数据流

```text
BaziCalculationResult + PersonalityProfile
                ↓
          ContextAssembler
                ↓
       typed evidence packet
                ↓
     versioned scenario prompt
                ↓
          AI Provider Port
                ↓
          structured output
                ↓
 deterministic schema/evidence/safety validation
                ↓
       retry / repair（最多 2 次）
                ↓
        Report / Advisor persist
```

核心代码位于：

- `modules/ai/context-assembler.ts`
- `modules/ai/prompts.ts`
- `modules/ai/schemas.ts`
- `modules/ai/generation.ts`
- `modules/ai/report-runtime.ts`
- `modules/ai/advisor-runtime.ts`
- `modules/ai/memory.ts`

Server adapters 位于 `server/ai/**`。

## 3. Provider Boundary

`modules/ai/contracts.ts` 定义 provider-independent `AIProvider` Port。

正式 V1 server adapter：

`server/ai/vercel-ai-sdk-provider.ts`

当前采用已经登记过的 Vercel AI SDK Foundation，通过 `generateText + Output.object + jsonSchema` 做 structured output。Provider 内部默认 retry 被关闭，统一由 07 的 bounded retry / repair orchestration 管理。

边界：

- Provider model 由 server composition root 注入；
- `modules/ai` 不绑定 OpenAI / Anthropic / Google 等具体厂商；
- API Secret 不进入 browser；
- 本 PR 不提交真实 Provider credential，也不冻结生产 model id；
- 更换 Provider 不应改 Report / Advisor 业务逻辑。

## 4. ContextAssembler

V1 ContextAssembler 输出 `AIContextPacket`，版本：

`ai-context/1.0.0`

输入：

- `BaziCalculationResult`
- `PersonalityProfile`
- 可选且显式选择的 luck cycle indexes
- structured `UserMemory[]`
- recent conversation
- conversation summary
- current question

它不会把完整 DB row / 完整对象 JSON 无脑塞给模型。

当前限制：

- Ten-God context：按 canonical score 选 Top 5
- structural tags：最多 8
- relations：最多 8
- explicit luck cycles：最多 3；未指定则不注入
- structured memories：最多 6
- recent conversation：只保留 user / assistant，最多 8 turns
- 单条 recent message：最多 1200 chars
- conversation summary：最多 2000 chars

Context packet 不包含 `birthProfileId`、raw birth datetime、`sourceTimezone`、`calculatedAt` 等会诱导重新排盘或与解释无关的 persistence 细节。

模型只允许引用 packet 中真实存在的 evidence key。

## 5. Full Personality Report V1

Prompt：

`ai-report/full-personality/1.0.0`

Schema：

`ai-report-schema/full-personality/1.0.0`

正式固定 8 章，顺序不可由模型改变：

1. 一句话认识自己
2. 核心驱动力
3. 性格 AB 面
4. 天赋使用说明书
5. 工作与学习模式
6. 成长环境与关系模式
7. 容易卡住的地方
8. 现实行为建议

每章 structured fields：

- `code`
- `title`
- `body`
- `evidenceKeys[]`
- `actions[]`
- `confidence`

整体还包含 `followUpQuestions[]`。

Report runtime 将结果映射回现有 shared `ReportSection[]` 并通过 `FullReportPersistencePort` 持久化；server adapter 复用现有 `ReportRepository`，不新增 DB schema。

## 6. Structured Validation / Repair

模型返回 JSON 并不等于可接受。

V1 经过两层检查：

1. AI SDK JSON Schema structured generation
2. 07 deterministic semantic validator

Validator 检查：

- schema version
- 8 章数量与顺序
- required fields
- confidence 0–1
- evidence key 必须真实存在于当前 context packet
- Advisor key points 同样必须 evidence-grounded
- 恐吓式 / 宿命式 / 心理疾病诊断语言

无效输出最多进行 1 次 repair，即每次业务请求最多 2 个 generation attempts。Provider failure / timeout 同样使用 bounded retry；最终失败由 runtime 明确分类。

## 7. Advisor Runtime V1

Prompt：

`ai-advisor/general/1.0.0`

Schema：

`ai-advisor-schema/general/1.0.0`

流程：

```text
load bounded context
→ persist user message
→ reserve
→ ContextAssembler
→ AI
→ validate / repair
→ persist assistant message
→ commit
→ update bounded conversation summary (best effort)
```

Terminal failure：

```text
reserved
→ release(provider_error | timeout | invalid_output | server_error)
```

07 只消费 shared `AdvisorRequest` aggregate，不直接写 Wallet / CreditLedger。

## 8. Billing Boundary

`AdvisorBillingPort` 只暴露：

- `reserve(...) -> AdvisorRequest`
- `commit(AdvisorRequest, assistantMessageId) -> AdvisorRequest`
- `release(AdvisorRequest, reason) -> AdvisorRequest`

`server/ai/advisor-billing-adapter.ts` 是薄 delegation boundary；其中没有：

- wallet mutation
- ledger write
- balance calculation
- SQL
- transaction implementation

真实 atomic reserve / commit / release 仍由 08/09 Billing implementation 提供。

## 9. Memory V1

使用现有 `user_memories` / `messages` persistence，不修改 DB Contract。

模型上下文分为：

```text
structured active memories
+ bounded conversation summary
+ latest 8 user/assistant turns
+ current question
```

Conversation summary V1 使用 deterministic bounded running summary，不额外调用第二个 LLM；它属于可重建的 advisor context，不是 canonical Bazi fact。

Summary memory key：

`conversation_summary:<conversationId>`

类型使用现有 `advisor_note`，并从普通 structured memory selection 中排除，防止重复注入。

## 10. Safety

禁止：

- 恐吓式预测
- “你注定 / 必然 / 一定会”式人生结论
- 大灾、血光、死亡寿命确定性判断
- 心理疾病诊断
- 把八字替代医疗 / 法律 / 财务专业判断

允许：

- 行为倾向
- 优势与代价
- 环境匹配
- 压力模式
- 低风险现实建议
- 明确不确定性与信息边界

## 11. Tests / CI Contract

`tests/ai/**` 已进入 root `npm test`。

至少覆盖：

- LLM 不排盘 / prompt 无 raw birth persistence data
- canonical facts preservation
- ContextAssembler selection bounds
- memory / recent conversation boundaries
- structured validation
- unknown evidence rejection
- invalid output repair
- provider failure retry + release
- timeout retry + release
- safety language rejection
- successful reserve → persist → commit

AI suite 使用 compile-then-test，避免 Node 22 strip-only TypeScript syntax 限制。

## 12. 尚未完成的真实 Provider 配置

Formal V1 代码边界已经存在，但生产 Provider 仍未完成：

- 未冻结真实 Provider / Gateway
- 未冻结 production model id
- 未配置生产 API credential
- 未做真实模型 structured-output compatibility / latency / cost benchmark
- 未完成 Vercel production env 配置
- 未完成 provider-level observability / rate-limit policy

因此 Draft PR #13 代表 **Formal AI code layer**，不是“真实生产 AI Provider 已上线”。
