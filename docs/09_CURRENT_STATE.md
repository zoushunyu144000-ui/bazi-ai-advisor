# 09 — Current State

最后更新：2026-08-18

> 本文件描述“现在真实做到哪里”。只有实际存在于仓库 / 分支 / PR / CI / 部署环境或已明确 Approved 的事项才写为已完成。

## 1. Repository / baseline

- GitHub：`zoushunyu144000-ui/bazi-ai-advisor`
- Default branch：`main`
- PR #11 Billing Contract：**Merged / Closed**
- PR #11 Merge Commit / 本次 07 分支基线：`94a16b4ec1bfd4c3699f32d8b51a0264a9895539`
- Formal AI branch：`feature/ai-system-v1`
- Formal AI Draft PR：#13 `ai: implement formal report and advisor v1`

PR #11 的 merge 只冻结 Shared Billing Contract；它没有实现真实 Billing RPC / Provider。

## 2. Wave 1 核心技术链：已完成并进入 main

```text
Birth
→ Bazi Engine
→ Interpretation
→ Supabase Persistence
```

已合并：PR #4 Birth、PR #5 Bazi Engine、PR #3 Interpretation V0.2、PR #6 Supabase Core。

Wave 1 累计基线：

- Birth：14 tests
- Bazi：22 tests
- Interpretation：9 tests
- Backend：19 tests
- skipped：0

统一 CI：

```text
npm ci
→ lint
→ typecheck
→ npm test
→ build
```

## 3. Supabase

**Supabase Core Code Layer 已进入 main。**

已存在 migration history、Auth bootstrap、RLS、browser/SSR/server-only clients、user-scoped repositories、Birth/Bazi calculation persistence、reports/conversations/messages/user_memories 与 billing foundation tables。

**Supabase Live Integration 仍未完成**：真实 project link、remote migration、live Auth/RLS/CRUD/E2E 仍 pending。

## 4. Research knowledge base

已合并：

- PR #8 AI Benchmark Research — knowledge only
- PR #9 Traditional Pattern Research — knowledge only
- PR #10 Payment / Credits Research — knowledge only

Research merge 不自动成为 production implementation。

## 5. Billing Contract

PR #11：**Merged**。

已冻结：

- Provider Event Inbox identity `(provider, provider_event_id)`
- relational ReportEntitlement `(user_id, product_code, resource_id)`
- shared first-class `Purchase`
- `AdvisorRequest` state `reserved → committed | released`
- immutable committed ledger + wallet projection
- stable ledger reason/reference vocabulary
- ProductCode 保持 `personality_report` / `advisor_10`
- Browser 不能 set paid / grant credits / unlock report
- LLM 不得被长 DB transaction 包住

仍未完成：

- 08 forward Billing migration / atomic RPC
- 09 BillingService / Provider Adapter / verified webhook fulfillment
- 真实 Stripe / PayPal / merchant integration

## 6. Formal AI Report / Advisor V1

状态：**Implementation exists on Draft PR #13 / not merged main**。

已实现于 branch：

- provider-independent `AIProvider` Port
- server-only Vercel AI SDK structured-output adapter
- ContextAssembler typed evidence packet
- versioned scenario prompts
- strict report/advisor schemas
- evidence + safety validation
- bounded retry / repair
- Full Report runtime
- Advisor runtime
- bounded memory / recent conversation / conversation summary
- existing repository persistence adapter
- `AdvisorBillingPort` + thin delegation adapter
- `tests/ai/**` + root `test:ai`

硬边界：

```text
BaziCalculationResult + PersonalityProfile
→ ContextAssembler
→ LLM explanation only
```

07 没有：

- 修改 shared Domain Contract
- 修改 DB / migrations
- 修改 wallet / credit ledger
- 接真实 Billing transaction
- 接真实 Provider credential
- 修改 UI / Payment Provider

## 7. AI Billing flow

Draft PR #13 runtime：

```text
persist user question
→ reserve AdvisorRequest
→ AI outside DB transaction
→ validate / repair
→ persist assistant message
→ commit AdvisorRequest
```

Terminal failure：

```text
reserved → released
```

真实 reserve / commit / release atomic semantics 仍由未来 08/09 implementation 提供；07 只消费 Port。

## 8. 当前仍未完成

- PR #13 review / merge
- 真实 AI Provider / Gateway / model / production secret 配置
- 真实 AI provider compatibility / cost / latency benchmark
- 08 Billing DB migration / RPC
- 09 Billing service / Payment Provider integration
- Supabase Live Integration
- Traditional Pattern production algorithm
- 05 Visual acceptance / merge
- Production deployment / end-to-end commercial flow

## 9. 当前阶段

**Wave 2 Active — Formal AI code layer on Draft PR #13; live Billing / Provider / Supabase integrations pending.**
