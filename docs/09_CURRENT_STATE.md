# 09 — Current State

最后更新：2026-08-18

> 本文件描述“现在真实做到哪里”。只有实际存在于仓库 / 分支 / PR / CI / 部署环境或已明确 Approved 的事项才写为已完成。

## 1. Repository / current integration baseline

- GitHub：`zoushunyu144000-ui/bazi-ai-advisor`
- Visibility：Private
- Default branch：`main`
- 最新已核验 `main` HEAD：`94a16b4ec1bfd4c3699f32d8b51a0264a9895539`
- 该 HEAD 为 PR #11 Billing Contract Integration merge commit。
- Wave 2 Billing DB branch：`feature/billing-db-live-v1`
- Billing DB Draft PR：#12 `feat: harden Wave 2 billing database contracts`

PR #12 当前是 **Draft / Open / not merged**。本 branch 只实现 Billing DB code layer、RLS、transactional RPC 与 repository boundary；不接真实 Payment Provider，也不把未完成的 Supabase Live 描述为已完成。

## 2. Wave 1 核心技术链：已完成并进入 main

```text
Birth
→ Bazi Engine
→ Interpretation
→ Supabase Persistence
```

已确认：

- PR #4 Birth：Merged
- PR #5 Bazi Engine：Merged
- PR #3 Interpretation V0.2：Merged
- PR #6 Supabase Core：Merged

Wave 1 累计验收基线：

- Birth：14/14 passed
- Bazi：22/22 passed
- Interpretation：9/9 passed
- Backend：19/19 passed
- skipped：0

统一 CI contract：

```text
npm ci
→ npm run lint
→ npm run typecheck
→ npm test
→ npm run build
```

共享不变量继续有效：Birth resolved facts → deterministic Bazi → canonical BaziDerivedFeatures → Interpretation；LLM 不参与原始排盘。

## 3. Supabase 状态

### Core Code Layer

**已完成并进入 main。**

包含：

- migration history
- Auth bootstrap
- RLS
- browser / SSR / server-only client boundary
- user-scoped repositories
- Birth / Bazi calculation persistence and read-back
- Wave 1 billing foundation：wallets / orders / purchases / credit_ledger

### Wave 2 Billing DB Hardening

**Draft PR #12 已实现并通过 CI，但尚未 merge main。**

新增 forward migration：

- `supabase/migrations/20260818010600_billing_contract_hardening.sql`

Draft implementation 包含：

- durable `payment_provider_events` inbox，stable identity `(provider, provider_event_id)`
- relational `report_entitlements`，stable identity `(user_id, product_code, resource_id)`
- `advisor_requests`：`reserved → committed | released`
- Purchase `resource_id` consistency hardening
- credit ledger canonical `reason / reference_type / reference_id`
- immutable ledger trigger；Wallet 保持 committed mutable projection
- service-role-only transactional billing RPC
- own-row billing RLS reads + sensitive write privilege revocation
- ordinary read repository / trusted billing RPC repository 分离

PR #12 CI #191：

- Birth：14/14 passed，skipped 0
- Bazi：22/22 passed，skipped 0
- Interpretation：9/9 passed，skipped 0
- Backend：36/36 passed，skipped 0
- lint：passed
- typecheck：passed
- build：passed

### Supabase Live Integration

**仍未完成。**

当前环境没有可用的 hosted Supabase project connection / real project ref / secrets，因此尚未真实执行：

- `supabase link`
- remote migration apply / `db push`
- hosted Auth verification
- hosted RLS verification
- hosted CRUD smoke test

在真实 Project / Secret 可用前，不得把 backend 描述为 Production-connected。

## 4. Research knowledge base

### Traditional Pattern Research

PR #9：**Merged / Closed**

- Merge Commit：`a529e3c04d8b8fb8fd7f3f20c735cdc842d59b87`
- Research 已进入知识库。
- 不代表 Traditional Pattern production algorithm 已实现。
- 不自动启用 `personality-map/0.3.0`。

### AI Benchmark Research

PR #8：**Merged / Closed**

- Merge Commit：`6a19acb7a0f1e3ed27d26084a4bc0299e0bb0bac`
- AI / Skill / MCP benchmark 已进入知识库。
- 不代表 `modules/ai/**` 正式 Production System 已完成。

### Payment / Credits Research

PR #10：**Merged / Closed**

- Merge Commit：`1f13068e9f6d63e5c0692a94fcedb58f03693f95`
- Research 文档：`docs/research/PAYMENT_CREDIT_BENCHMARK.md`
- Research 提出了 `CCR-09-001` ～ `CCR-09-006`。
- Stripe Checkout 仍只是后续 Provider implementation 的 conditional candidate；本轮未选择或接入真实 Provider。

## 5. Wave 2 Billing Contract Gate

状态：**Completed / Merged**。

PR #11：`chore: integrate Wave 2 billing contract`

- Merged：Yes
- Merge Commit / 当前 baseline：`94a16b4ec1bfd4c3699f32d8b51a0264a9895539`

正式裁决：

- CCR-09-001：APPROVED — Provider Event Inbox，unique `(provider, provider_event_id)`
- CCR-09-002：APPROVED — relational ReportEntitlement identity `(user_id, product_code, resource_id)`
- CCR-09-003：MODIFIED — V1 使用 `advisor_requests`；`reserved → committed | released`
- CCR-09-004：MODIFIED — 保留现有 ledger `entry_type`，新增 reason/reference vocabulary
- CCR-09-005：APPROVED — first-class shared `Purchase` read model
- CCR-09-006：REJECTED rename — ProductCode 保持 `personality_report` / `advisor_10`

Shared Domain 已进入 main：

- `Purchase`
- `ReportEntitlement`
- `AdvisorRequest`
- `CreditLedgerReason`
- `CreditLedgerReferenceType`
- `CreditLedgerFactInput`
- stable runtime vocabulary constants

详细 source of truth：`docs/14_BILLING_CONTRACT_INTEGRATION.md`。

## 6. Billing architecture frozen by Gate

### Payment

```text
Verified Provider Event
→ Provider Event Inbox
→ Order
→ Purchase
→ ReportEntitlement OR Credit Grant
```

Browser success / return page 不是 fulfillment authority。

### Advisor

```text
reserve 1 credit capacity
→ AI outside DB transaction
→ validate
→ commit -1
```

Terminal failure：

```text
reserved → released
```

Reservation 不是 ledger debit；release 不产生 compensating `+1`。

Ledger 是 immutable committed fact stream；Wallet 是 committed projection。

## 7. Wave 2 ownership / active handoff

### 01 Architecture

Shared Billing Contract 已完成并进入 main；继续负责 shared contract / cross-module architecture gate。

### 08 Supabase / DB

当前 Draft PR #12 已实现 forward migration、RLS、constraints/indexes、atomic billing RPC / transaction primitives 与 trusted repository boundary。

仍缺：真实 Supabase Live apply / verification。

### 09 Billing / Payment

待 08 primitives 评审/合并后：实现 BillingService、Provider Adapter、webhook verify/normalize、fulfillment orchestration。不得把 Provider signature verification 放入 DB RPC。

### 07 AI Advisor

待 trusted reservation API：在 LLM 前 reserve，成功后 commit，terminal failure release；不得直接写 Wallet / Ledger。

## 8. 05 Visual / UX

PR #2 继续独立处理视觉验收；不因 Billing DB Draft 自动获得 merge 资格。

## 9. 当前仍未完成

- PR #12 Billing DB Hardening 尚未 merge
- Supabase Live Integration
- 09 real BillingService / Provider integration
- 07 Formal AI Advisor runtime
- Traditional Pattern production algorithm
- 05 Visual acceptance / merge
- Production payment / checkout
- Production deployment / end-to-end live commercial flow

## 10. Blocking external configuration / product decisions

### Supabase Live external configuration

仍需真实：

- hosted Supabase project ref
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`（或 legacy service-role key）
- remote DB credential（如 CLI 所需 `SUPABASE_DB_PASSWORD`）
- production Auth site / redirect URLs
- production SMTP / email Auth configuration（如启用）

### Real payment / refund launch decisions

上线前仍需冻结：

- Report refund 后 entitlement revoke / historical access policy
- Advisor credit expiry
- credit pack stacking
- 已消费部分 credits 后全额退款策略；当前 wallet 不允许负余额
- Production merchant / Provider onboarding 与 product-category approval

当前阶段：**Wave 2 Active — Billing DB Hardening Draft / Supabase Live Pending**。
