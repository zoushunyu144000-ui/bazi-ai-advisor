# 09 — Current State

最后更新：2026-08-18

> 本文件描述“现在真实做到哪里”。只有实际存在于仓库 / 分支 / PR / CI / 部署环境或已明确 Approved 的事项才写为已完成。

## 1. Repository / current integration baseline

- GitHub：`zoushunyu144000-ui/bazi-ai-advisor`
- Visibility：Private
- Default branch：`main`
- Wave 2 Billing Contract branch：`feature/billing-contract-integration`
- Billing Contract Draft PR：#11 `arch: freeze Wave 2 billing contracts`
- 本 branch 创建时最新 `main` HEAD：`1f13068e9f6d63e5c0692a94fcedb58f03693f95`
- 该 `main` HEAD 为 PR #10 Payment / Credits Research Merge Commit。

PR #11 当前只做 Shared Contract / docs / contract tests，**尚未 merge main**，也不接真实 Payment Provider。

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

最终 Wave 1 累计验收口径：

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

**Supabase Core Code Layer 已完成并进入 main。**

已包含：

- migration history
- Auth bootstrap
- RLS
- browser / SSR / server-only client boundary
- user-scoped repositories
- Birth / Bazi calculation persistence and read-back
- billing foundation tables：wallets / orders / purchases / credit_ledger

但 **Supabase Live Integration 仍未完成**：真实 Project link、remote migration apply、Auth/live RLS/live CRUD 验证仍属于后续工作。

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
- 研究推荐 Stripe Checkout 仅为 conditional candidate；尚未选择/接入真实 Provider，也未完成 merchant/category approval。

## 5. Wave 2 Billing Contract Gate

状态：**Shared Contract implemented on Draft PR #11 / not merged**。

当前正式裁决：

- CCR-09-001：APPROVED — Provider Event Inbox，unique `(provider, provider_event_id)`
- CCR-09-002：APPROVED — relational ReportEntitlement identity `(user_id, product_code, resource_id)`
- CCR-09-003：MODIFIED — V1 使用 `advisor_requests`；`reserved → committed | released`
- CCR-09-004：MODIFIED — 保留现有 ledger `entry_type`，新增 reason/reference vocabulary
- CCR-09-005：APPROVED — first-class shared `Purchase` read model
- CCR-09-006：REJECTED rename — ProductCode 保持 `personality_report` / `advisor_10`

Shared Domain branch 已新增：

- `Purchase`
- `ReportEntitlement`
- `AdvisorRequest`
- `CreditLedgerReason`
- `CreditLedgerReferenceType`
- `CreditLedgerFactInput`
- stable runtime vocabulary constants

详细 source of truth：`docs/14_BILLING_CONTRACT_INTEGRATION.md`。

本 Gate **没有**：

- 修改 Supabase migration
- 实现 BillingService
- 实现 Provider Adapter
- 接 Stripe / PayPal
- 写 Checkout UI
- 修改 Bazi / Interpretation

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

## 7. Ownership after Billing Contract Gate

### 01 Architecture

负责 Shared Contract、DB target、transaction/idempotency boundaries；不实现 Provider / migration。

### 08 Supabase / DB

待 PR #11 合并后：实现 forward migration、RLS、constraints/indexes 与 atomic billing RPC / transaction primitives。

### 09 Billing / Payment

待 PR #11 + 08 DB primitives：实现 BillingService、Provider Adapter、webhook verify/normalize、fulfillment flow。

### 07 AI Advisor

待 reservation API：在 LLM 前 reserve，成功后 commit，terminal failure release；不得直接写 Wallet / Ledger。

## 8. 05 Visual / UX

PR #2 仍独立处理视觉验收；不因 Billing Contract Gate 自动获得 merge 资格。

## 9. 当前仍未完成

- PR #11 Billing Contract 尚未 merge
- 08 Billing DB migration / RPC
- 09 real Billing service / Provider integration
- 07 Formal AI Advisor runtime
- Supabase Live Integration
- Traditional Pattern production algorithm
- 05 Visual acceptance / merge
- Production deployment / end-to-end live commercial flow

## 10. Blocking product decisions

没有产品决策阻塞 **Shared Billing Contract Gate 本身**。

真实支付/退款上线前仍需冻结：

- Report refund 后 entitlement revoke / historical access policy
- Advisor credit expiry
- credit pack stacking
- 已消费部分 credits 后全额退款策略；当前 wallet 不允许负余额
- Production merchant / Provider onboarding 与 product-category approval

当前阶段：**Wave 2 Active — Billing Contract Draft Gate**。
