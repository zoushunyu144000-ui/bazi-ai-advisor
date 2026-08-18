# 10 — Roadmap

状态：**V1 Roadmap — Wave 1 Core Chain Complete / Wave 2 Active / Billing Contract Gate Draft**

最后更新：2026-08-18

## Phase 0 — 项目记忆与工程治理

状态：**Completed / continuously maintained**

已建立：

- `AGENTS.md`
- 项目索引 / Blueprint / Product Spec / Design System
- Tech Architecture / Database / AI / Business Rules
- Decision Log / Current State / Roadmap
- ChatGPT Project Instructions / Handoff
- `docs/12_REUSE_AND_REFERENCES.md`
- `docs/13_WAVE1_CONTRACT_INTEGRATION.md`
- `docs/14_BILLING_CONTRACT_INTEGRATION.md`（当前 Draft PR #11）

项目级 **Research Before Build / Reuse First** 持续生效。

## Phase 1 — Foundation

状态：**Completed / Merged**

- Foundation PR #1 已进入 `main`。
- Next.js / TypeScript / App Router / Tailwind / shadcn/ui 基础工程已建立。
- PostgreSQL / Supabase foundation schema、shared Domain Contracts、CI 与版本字段体系已建立。

## Wave 1.5 — Shared Contract Integration

状态：**Completed / Merged**

PR #7 已完成 shared Contract 收敛：

- canonical `BaziDerivedFeatures`
- Birth resolved instant / UTC offset
- shared calculation context / result
- unified root test contract
- Reuse First governance

Wave 1.5 已完成历史使命，不再是当前开发 Gate。

## Wave 1 — Core Technical Chain

状态：**Completed / Merged to main**

核心链：

```text
Birth
→ Bazi Engine
→ Interpretation
→ Supabase Persistence
```

### Completed merges

- PR #4 Birth normalization — Merged
- PR #5 Bazi Engine V1 — Merged
- PR #3 Interpretation V0.2 — Merged
- PR #6 Supabase Core — Merged

Wave 1 cumulative acceptance：

- Birth：14/14 passed
- Bazi：22/22 passed
- Interpretation：9/9 passed
- Backend：19/19 passed
- skipped：0

统一验收流程：

```text
npm ci
→ lint
→ typecheck
→ npm test
→ build
```

## Wave 2 — Integration / Productization

状态：**Active**

Wave 2 从已经进入 main 的 deterministic / persistence 核心链继续向真实产品闭环推进。

### A. Supabase Live Integration

状态：**Pending**

Supabase Core Code Layer 已完成，但真实 Supabase Project 尚未完成：link / remote migration apply / Auth / RLS / live CRUD / end-to-end verification。

完成这些之前，不得把 backend 描述为 Production-connected。

### B. Traditional Pattern / 格局

状态：**Research merged / Production implementation pending**

PR #9 已合并知识库：

- taxonomy / ownership research 已归档
- 不自动变成 production algorithm
- 不使用 `max(Ten-God distribution)` 直接等同传统格局
- `TraditionalPatternResult` 若实现，应由 deterministic Bazi layer 产生并带 explicit rule profile
- `personality-map/0.3.0` 不因 research merge 自动启用

### C. AI System

状态：**Research merged / Formal implementation pending**

PR #8 已合并知识库。

正式 AI System 仍需单独实现：provider/gateway、versioned prompt、context assembler、structured validation、report runtime、Advisor runtime、memory、failure/retry/safety。

`BaziCalculationResult` 继续是 deterministic source of truth；LLM 不排盘。

### D. 05 Visual / UX

状态：**Independent iteration / acceptance pending**

PR #2 仍独立视觉验收，不因技术或 Billing Contract 自动 merge。

### E. Payment / Commercial Entitlement

状态：**Research merged → Shared Contract Gate Draft**

Payment / Credits Research PR #10 已合并知识库。

当前进行：

```text
PR #11
feature/billing-contract-integration
```

本 Gate 已冻结：

- Provider Event Inbox：unique `(provider, provider_event_id)`
- relational ReportEntitlement：`(user_id, product_code, resource_id)`
- Advisor request reservation：`reserved → committed | released`
- immutable ledger + committed wallet projection
- stable ledger reason/reference vocabulary
- first-class shared Purchase read model
- serialized ProductCode 保持 `personality_report` / `advisor_10`
- Browser 不能 set paid / grant/deduct credits / unlock report
- AI 调用不能被长 DB transaction 包住

PR #11 不写 migration、不接 Stripe、不写 Checkout / Provider implementation。

#### Billing Contract Gate 后的实现顺序

建议：

```text
Billing Contract PR #11
↓
08 Billing DB migration / RLS / atomic RPC
↓
09 BillingService / Provider Adapter / payment fulfillment
↓
07 Advisor runtime consume reserve/commit/release API
↓
06/UI consume ReportEntitlement / billing read models
```

08 / 09 / 07 不得互相越权复制职责。

### E1. Billing Contract Gate acceptance

PR #11 合并前至少要求：

- shared Domain compile
- billing contract tests
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- CI success
- Draft review confirms no Provider / migration / Checkout implementation sneaked into Gate

### E2. Real Payment launch decisions still pending

这些不阻塞 Shared Contract，但上线前必须冻结：

- Report refund 后 entitlement revoke / historical access policy
- Advisor credit expiry
- pack stacking
- partial-consumption + full-refund policy；当前 wallet 不允许负余额
- production Provider merchant onboarding / product-category approval

## Phase 2 — Free Bazi Test Product Loop

目标：

```text
Birth input
→ normalization
→ deterministic Bazi
→ interpretation
→ result UI
```

核心 Engine / Interpretation 已进入 main；仍需真实 UI、live persistence 与端到端流程。

验收：可复现、Mobile/Desktop 可用、内容与 canonical facts 一致、无 LLM 自由排盘。

## Phase 3 — Paid Full Personality Report

商业基准：¥9.9 等值。

仍需：

- Full Report Schema / formal AI report generation
- 08 ReportEntitlement persistence
- 09 payment fulfillment
- locked/unlocked UI 只消费 trusted entitlement read path
- refund/failure recovery

## Phase 4 — AI Advisor 10-credit Pack

商业基准：¥29.9 等值 / 10 credits。

已冻结的 Billing 语义：

- verified `advisor_10` Purchase 每 quantity grant +10
- one successful committed Advisor request consumes -1
- reserve before AI
- terminal failure release

仍需：

- 08 atomic reservation / commit / release persistence
- 09 trusted Billing API
- 07 Advisor production runtime / UI / context / structured validation
- conversation / memory / safety / retry integration

## Phase 5 — Analytics / Conversion Optimization

状态：Pending

- funnel events
- report conversion
- payment failure
- advisor usage / repurchase
- CTA / pricing / content experiments

## Phase 6 — V1 Stable Launch

状态：Pending

至少验收：

- live Supabase / Auth
- production payment
- permissions / RLS
- Mobile / Desktop
- report generation recovery
- advisor credit accuracy under concurrency/retry
- provider event replay safety
- privacy / terms
- monitoring
- Vercel production deployment

## V1 范围不变

当前仍只做：**八字**。

在商业闭环得到数据验证前，不提前加入紫微、奇门、塔罗、面相、手相、风水、社区或真人大师平台。
