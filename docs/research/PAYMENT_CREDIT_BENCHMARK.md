# Payment / Credits Benchmark — V1 Research

Status: Research only / no production payment implementation

Last verified: 2026-08-18

Repository baseline: `main` at `6a19acb7a0f1e3ed27d26084a4bc0299e0bb0bac`

## 1. V1 commercial requirements

The V1 funnel is intentionally small:

```text
Free personality test
→ full personality report (CNY ¥9.9 equivalent)
→ AI Advisor 10-credit pack (CNY ¥29.9 equivalent)
```

Two products have different entitlement semantics:

1. **Full report** is a durable purchase entitlement tied to a concrete report/resource. It is not a credit balance.
2. **Advisor pack** grants exactly `+10` integer advisor credits after a verified successful payment.
3. A successful Advisor answer consumes exactly `-1` credit.
4. Provider error, timeout, invalid structured output, server exception, or otherwise failed answer must not cause a permanent credit loss.
5. The browser success/return page is never authoritative for payment fulfillment.

Current shared architecture already establishes important invariants: integer minor-unit money, integer wallet credits, append-style ledger, server-only sensitive writes, RLS read-only access for users, unique order and ledger idempotency keys, and separate `orders` / `purchases` / `wallets` / `credit_ledger` tables.

## 2. Current repository baseline inspected

Research reviewed the current `main` project memory, `db/schema.sql`, Wave 1 Supabase migration history, billing Domain Contract, and billing repositories.

Existing billing schema already provides:

- `wallets.advisor_credits`
- `wallets.lifetime_credits_purchased`
- optimistic `wallets.version`
- `credit_ledger.delta`
- `credit_ledger.balance_after`
- unique `credit_ledger.idempotency_key`
- `orders.amount_minor bigint`
- unique `orders.idempotency_key`
- unique `(provider, provider_order_id)`
- `purchases.order_id unique`
- RLS allowing users to select their own wallet / ledger / orders / purchases
- no ordinary client mutation policy for wallet / ledger / purchases

The existing schema is a good Foundation, but this research identifies several production-hardening changes that should be handled as explicit Contract / schema change requests rather than silently added in this Research PR.

## 3. Payment Provider benchmark

### 3.1 Stripe

Official sources reviewed:

- https://stripe.com/global
- https://stripe.com/en-my/pricing
- https://stripe.com/en-my/pricing/local-payment-methods
- https://stripe.com/en-my/legal/ssa/my
- https://docs.stripe.com/payments/payment-methods/payment-method-support
- https://docs.stripe.com/payments/fpx/accept-a-payment
- https://docs.stripe.com/payments/grabpay
- https://docs.stripe.com/payments/alipay/accept-a-payment
- https://docs.stripe.com/payments/wechat-pay
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/api/idempotent_requests
- https://stripe.com/legal/restricted-businesses

#### Country / merchant support

- Stripe officially supports Malaysia.
- Malaysia Stripe Services Agreement permits businesses including sole proprietors / individual traders located in Malaysia to apply, subject to identity, business, tax, website, bank-account and risk verification.
- A business opening an account in another country generally needs a legal entity/tax ID/location/phone/bank account in that country.
- Exact onboarding requirements remain subject to Stripe verification and may change.

#### Pricing observed for Malaysia

At verification time, Malaysia standard pricing showed:

- domestic cards: `3% + RM1.00`
- international cards: additional `+1%`
- currency conversion: additional `+2%` when applicable
- FPX: `3% + RM1.00`
- Alipay: `2.9% + RM1.00`
- GrabPay: `3%`
- card dispute received fee: `RM90`, with a separate countered fee shown by Stripe's Malaysia pricing page

These fees are time-sensitive and must be rechecked before production launch.

#### Checkout / SDK / deployment fit

- Stripe Checkout provides a hosted payment page.
- Official Node SDK and Checkout fit Next.js server routes cleanly.
- No special Supabase coupling is required: payment state can be written by trusted Vercel server routes/functions into Supabase/PostgreSQL.
- Test mode is first-class.
- Webhook signing is first-class.
- Stripe explicitly documents duplicate webhook handling and recommends storing processed Event IDs.
- Stripe API POST requests support idempotency keys.
- Refunds and disputes are supported; support differs by payment method.

#### Payment methods relevant to V1

For a Malaysia-based Stripe account:

- Cards: **Yes**
- Apple Pay: **Yes where Apple/Stripe eligibility is satisfied; best exposed through Stripe's wallet/card surface rather than custom code**
- Google Pay: **Yes where Google/Stripe eligibility is satisfied**
- FPX: **Yes, MYR, Malaysia, one-time; refunds supported; no recurring payments**
- GrabPay: **Yes, MYR for Malaysia; one-time; refunds/partial refunds supported; no recurring payments**
- Alipay: **Yes for supported Malaysia-presented currency including MYR; one-time; no subscription mode**
- WeChat Pay: **Do not promise for a Malaysia Stripe V1**. Current Stripe business-location/currency support does not list Malaysia as a normal WeChat Pay business location in the same way as FPX/GrabPay/Alipay.
- Touch 'n Go: Stripe's Malaysia market page lists Touch 'n Go as popular in Malaysia, but this research did **not** verify a first-class Stripe Touch 'n Go payment-method integration in the current Stripe payment-method support documentation. Treat as **not available / not committed for V1** until a current official integration path is verified.

#### Subscription

Stripe supports subscriptions generally, but the two V1 products are one-time purchases and do not need Billing subscriptions. FPX, GrabPay and Alipay are not suitable as recurring subscription methods in the reviewed Checkout support.

#### License / commercial use

Stripe is a commercial payment service governed by its Services Agreement, not an OSS dependency used under a software license. Official SDK licenses must be checked at implementation time, but provider usage is governed primarily by Stripe account/service terms.

#### Risk specific to this product

The project category is Bazi / personality / behavioral guidance. Stripe maintains global and jurisdiction-specific restricted-business rules and independently reviews each account. The reviewed jurisdiction-specific list did not show Malaysia with the explicit psychic/fortune-teller prohibition shown for some other jurisdictions such as Japan, Mexico and Thailand; however, that is **not approval**. Production launch must obtain real onboarding approval for the actual website copy, product description and merchant entity before Stripe is considered commercially available.

### 3.2 PayPal

Official sources reviewed:

- https://www.paypal.com/my/webapps/mpp/merchant-fees
- https://developer.paypal.com/api/rest/webhooks
- https://developer.paypal.com/api/rest/reference/idempotency/
- https://developer.paypal.com/payment-methods
- https://developer.paypal.com/docs/checkout/apm/
- https://developer.paypal.com/docs/checkout/apm/apple-pay/
- https://developer.paypal.com/docs/checkout/apm/google-pay/

#### Country / merchant support

- PayPal merchant services and Malaysia merchant fee schedules are available.
- Mainland China also has PayPal merchant fee documentation, but merchant availability / account features vary by market and should be validated for the actual entity used.

#### Pricing observed for Malaysia

At verification time, PayPal Malaysia merchant pricing showed:

- domestic commercial transactions for MY/SG: `3.90% + fixed fee`
- fixed fee for MYR: `RM2.00`
- international transactions can add cross-border pricing depending on seller/buyer market

For very low-ticket products (roughly ¥9.9 equivalent), the fixed fee is materially more expensive than Stripe Malaysia's observed fixed card/FPX fee and GrabPay percentage-only pricing. Fees must be rechecked at launch.

#### Checkout / SDK / deployment fit

- PayPal Checkout / Orders API supports one-time payments.
- Sandbox is available.
- Webhooks are available and PayPal retries failed deliveries (official docs describe repeated attempts over multiple days).
- Webhook authenticity must be verified; PayPal documents signature verification and a verification API.
- REST API supports `PayPal-Request-Id` for idempotency on supported POST endpoints.
- Refunds and disputes are supported according to funding/payment method.
- Integration is compatible with Next.js/Vercel server routes and independent of Supabase.

#### Payment methods relevant to V1

- PayPal wallet: **Yes; primary PayPal value proposition**
- Cards: **Yes depending on Checkout/Expanded Checkout eligibility**
- Apple Pay / Google Pay: PayPal current APM documentation supports them in a country list that includes China and Singapore but **does not list Malaysia** in the reviewed availability list; do not promise these via PayPal Malaysia without a current account-specific check.
- Alipay: PayPal has a current/beta integration path, but the reviewed docs are not a clean Malaysia-seller V1 path.
- GrabPay: PayPal documentation includes limited seller-country patterns; the reviewed current/beta material does not justify treating Malaysia GrabPay as a PayPal V1 capability.
- FPX: no verified first-class PayPal V1 path found in the official material reviewed.
- Touch 'n Go: no verified first-class PayPal V1 path found.
- WeChat Pay: available only in constrained regions/products; not a Malaysia V1 assumption.

#### Positioning

PayPal is useful as a **secondary / fallback provider** for overseas users who strongly prefer PayPal and for geographic diversification. It is not the preferred primary V1 rail for a Malaysia-oriented microtransaction funnel because current local-method coverage and observed low-ticket fee economics are weaker than Stripe Malaysia.

### 3.3 China / Malaysia / Southeast Asia local methods

#### FPX

**ADAPT through Stripe Checkout for Malaysia V1.** It is a major local bank redirect, MYR-only for Malaysia, one-time, and supported by Stripe Checkout.

#### GrabPay

**ADAPT through Stripe Checkout for Malaysia V1.** One-time MYR wallet payment, no subscription requirement for this project.

#### Alipay

**ADAPT through Stripe Checkout as an optional V1 method** if the Stripe Malaysia account exposes it after onboarding. It directly improves overseas-Chinese / Chinese-traveler coverage without a second provider integration.

#### WeChat Pay

**REFERENCE ONLY for V1.** Do not block launch on it. Re-evaluate only after checking current business-location eligibility for the production merchant.

#### Touch 'n Go eWallet

**REFERENCE ONLY / DO NOT IMPLEMENT for V1** unless an official provider integration is verified for the production merchant. Popularity in Malaysia is not the same as a supported API path.

#### Standalone local payment gateways

Not selected in this research round. Adding a third payment provider solely to obtain Touch 'n Go or one additional wallet would increase reconciliation, webhook, refund, operational, KYC and support complexity before the product has conversion data.

## 4. Recommendation

### Primary V1 provider

**Stripe Checkout, conditional on successful Malaysia merchant onboarding and product-category approval.**

Why:

1. Fastest hosted-checkout implementation path.
2. One integration can expose cards + FPX + GrabPay + Alipay for a Malaysia merchant.
3. Strong webhook / idempotency / test-mode documentation.
4. Fits Next.js + Vercel + Supabase cleanly behind a provider adapter.
5. Better fit for low-ticket Malaysia payments than the reviewed PayPal fee schedule.
6. V1 does not need subscription complexity.

### Secondary provider

**PayPal: Phase 1.1 / conversion fallback, not required to launch V1.**

Add it after first real traffic if payment analytics show meaningful demand from users who prefer PayPal or if Stripe merchant approval becomes a blocker.

### Recommended V1 payment methods

Start with the methods that Stripe can expose from one hosted Checkout integration:

```text
Cards
+ Apple Pay / Google Pay where eligible
+ FPX (MYR)
+ GrabPay (MYR)
+ Alipay (if enabled for production account)
```

Do not delay V1 for:

```text
Touch 'n Go
WeChat Pay
standalone local gateway
subscriptions
```

## 5. REUSE / ADAPT / REFERENCE ONLY / DO NOT USE

### REUSE

- Stripe-hosted Checkout
- Stripe official server SDK (implementation phase, exact version to be pinned then)
- Stripe webhook signing
- Stripe API idempotency
- Supabase/PostgreSQL transaction / RPC capability for billing state
- current server-only Supabase client boundary

### ADAPT

Create a project-owned `PaymentProvider` boundary, e.g.:

```text
PaymentProvider
  createCheckout(input)
  retrievePayment(providerPaymentId)
  verifyWebhook(rawBody, headers)
  normalizeEvent(event)
  refund(paymentRef, amount?)
```

Provider DTOs stay inside adapter code. Shared domain should only see normalized payment facts.

### REFERENCE ONLY

- PayPal Checkout as secondary/fallback provider
- WeChat Pay
- Touch 'n Go
- additional SEA local payment aggregators

### DO NOT USE

- custom card-number / CVV collection
- browser-only payment-success fulfillment
- client-side wallet mutation
- a payment gateway written in-house
- raw provider event objects as shared Domain Contract
- direct provider-specific tables leaking through the whole app

## 6. Provider Adapter architecture

Recommended runtime boundary:

```text
Browser
  ↓ create checkout request
Trusted Next.js/Vercel server
  ↓
BillingService
  ↓
PaymentProvider adapter (Stripe first)
  ↓
Hosted Checkout

Provider
  ↓ signed webhook
Webhook Route
  ↓ verify signature + normalize
BillingWebhookService
  ↓ transaction / idempotency gate
Order
  ↓
Purchase entitlement OR credit grant
  ↓
Immutable credit ledger
  ↓
Wallet projection
```

Critical rule:

> The success URL can display status but cannot unlock a report or add credits.

Only a verified webhook or trusted server-side provider verification can cause fulfillment.

## 7. Order state machine

Recommended conceptual states:

```text
created/pending
  ├─→ paid
  ├─→ failed
  └─→ expired

paid
  ├─→ partially_refunded (future optional)
  └─→ refunded
```

The current shared `OrderStatus` is:

```text
pending | paid | failed | refunded | expired
```

This is enough for simple V1 full-refund behavior, but production implementation should keep provider event history so a provider's richer state is not lost.

State transitions must be monotonic and guarded. For example, a late `failed` event must not overwrite a previously verified `paid` order.

## 8. Purchase entitlement

A report purchase is not a wallet grant.

Recommended semantic record:

```text
purchase
  user_id
  product_code
  resource_id        // report id / future entitlement resource
  order_id
  status
  purchased_at
```

V1 invariant:

```text
one user + one report + REPORT_FULL
→ at most one active paid entitlement
```

Page refreshes and repeated `checkout.session.completed` delivery must read the existing entitlement and return success instead of charging/granting again.

The current schema has `orders.report_id` plus `purchases.entitlement jsonb`; this can carry the concept, but a relational uniqueness constraint is preferable for a production-grade report entitlement.

## 9. Product code design

Desired long-lived semantic product identifiers:

```text
REPORT_FULL
ADVISOR_10_CREDITS
```

Current shared Domain / DB uses:

```text
personality_report
advisor_10
```

**Research recommendation:** do not change production Contract in this PR. Before Billing implementation, either:

A. keep the existing stable codes and document their semantics permanently, or
B. approve a coordinated Contract migration to the more explicit codes above.

Do not introduce both naming systems in production at the same time.

Price is not encoded in the product code. Historical orders store actual currency + amount minor units.

## 10. Immutable credit ledger

The ledger is the auditable fact stream. Wallet balance is a projection/cache.

Recommended reason taxonomy:

```text
purchase_grant    +10
advisor_usage      -1
refund_reversal    -N or entitlement-specific reversal
failure_release    +1 only if a reservation was materialized as a debit
manual_adjustment  +/-N
promo_bonus        +N
```

Each final ledger fact should at minimum support:

```text
id
user_id
amount/delta
reason
reference_type
reference_id
idempotency_key
created_at
```

Useful additional fields:

```text
balance_after
order_id
message_id / advisor_request_id
metadata
actor/service
```

Current table is append-style and already has `delta`, `balance_after`, `entry_type`, `idempotency_key`, `order_id`, `message_id`, `metadata`. It is a strong base but its reason/reference vocabulary is narrower than the production design recommended here.

### Ledger integrity

Never implement a logical credit change as only:

```text
wallet.advisor_credits = wallet.advisor_credits - 1
```

The balance update and ledger append must occur in the same trusted database operation.

## 11. Wallet projection

`wallet.advisor_credits` is a fast current projection, not the sole accounting source.

Required invariants:

```text
wallet balance >= 0
integer only
ledger delta is integer and non-zero for finalized credit movements
wallet update + ledger insert are atomic
idempotency key is unique
```

`wallet.version` can support optimistic concurrency, but production credit mutation is better centralized in a database function / transaction using row locking or conditional update semantics rather than implemented as multiple client-visible calls.

## 12. Advisor deduction transaction design

### Pattern A — deduct after successful AI answer

Flow:

```text
check credits >= 1
→ call AI
→ validate final answer
→ deduct 1
```

Advantages:

- intuitive: no debit exists if AI fails
- simple sequential happy path

Problems:

- unsafe under concurrent tabs/windows: multiple requests can all observe the same remaining credit before any deduction
- a user with 1 credit can launch several expensive AI calls concurrently
- post-success deduction can fail after the AI cost is already incurred
- retries need a separate advisor-request idempotency gate

Conclusion: **not recommended as the sole V1 production strategy.**

### Pattern B — reserve → AI call → commit; failure → release

Recommended flow:

```text
1. create advisor_request with stable request id / idempotency key
2. atomically reserve 1 available credit
3. call AI outside the DB transaction
4. validate structured output and persist assistant message
5. atomically commit reservation as advisor usage
6. on terminal failure, release reservation
```

Advantages:

- concurrency-safe
- prevents overspending from multiple tabs
- allows network retries to attach to the same request
- cleanly separates provider timeout from confirmed failure
- does not keep a database transaction open across a long LLM call

Important implementation point:

**Do not hold a PostgreSQL transaction open while waiting for the LLM.** Reservation must be a durable short DB transaction, followed by the external AI call, followed by a short commit/release transaction.

### Recommended reservation representation

Best production shape is a dedicated reservation/request state, e.g. `credit_reservations` or an `advisor_requests` record containing:

```text
request_id
user_id
amount = 1
status = reserved | committed | released
idempotency_key
expires_at
message_id?
created_at
updated_at
```

Finalized usage is still written to immutable `credit_ledger`.

Alternative if V1 wants fewer tables: represent reserve as a ledger debit and failure as a compensating `+1` reversal. This is auditable and can work, but it makes the visible ledger noisier and requires explicit reason codes so a failed request never looks like genuine usage.

**Recommendation: dedicated reservation/request state + ledger only for finalized economic facts.**

## 13. Failure / refund / retry

### AI failure

Terminal failures include:

- provider error
- timeout after retry policy concludes
- invalid structured output after repair/retry policy concludes
- server exception
- persistence failure that prevents a valid final answer from being committed

Result: reservation released; no finalized `advisor_usage -1` ledger entry.

### Ambiguous AI timeout

Do not immediately create a second billable request. Retry using the same `advisor_request_id` / idempotency key or reconcile the original provider generation if the provider supports it.

### Payment webhook retry

Repeated verified webhooks are expected behavior. They must be acknowledged safely after checking the provider event id and business idempotency key.

### Refund

Refund processing is a second business event, not a deletion of the original purchase.

For a credit pack, refund policy must be frozen before production. Open product questions include:

- refund only if 10/10 credits unused?
- prorated refund allowed?
- what if balance is already below the granted amount?

Until policy is approved, production code should not silently invent negative-balance behavior.

For a report purchase, refund should update entitlement status through an explicit rule; deleting the purchase would destroy audit history.

## 14. Idempotency strategy

Idempotency is layered; provider idempotency alone is not enough.

### A. Checkout/order creation

Client creates a stable `checkout_attempt_id` (or server creates one and returns it).

Database unique key example:

```text
checkout:{user_id}:{product_code}:{resource_id?}:{attempt_uuid}
```

Provider API call uses the same logical attempt via Stripe `Idempotency-Key` / PayPal `PayPal-Request-Id` where supported.

### B. Webhook events

Store provider event identity in a dedicated event-inbox/audit table:

```text
provider
provider_event_id
received_at
verified_at
processed_at
status
payload_hash / minimal normalized metadata
```

Unique:

```text
(provider, provider_event_id)
```

Stripe explicitly warns that duplicate events can be delivered and recommends logging processed event IDs.

### C. Purchase fulfillment

Unique business idempotency key, e.g.:

```text
purchase:{order_id}
```

and a relational uniqueness constraint for the report entitlement identity.

### D. Credit grant

```text
grant:{order_id}:advisor_credits
```

Unique in ledger. A webhook replay sees the existing ledger entry and does not add +10 again.

### E. Advisor usage

```text
advisor:{advisor_request_id}:usage
```

Only one final usage ledger entry can exist for a request.

### F. Refund/reversal

```text
refund:{provider_refund_id}:credits
refund:{provider_refund_id}:report_entitlement
```

A repeated refund webhook cannot reverse twice.

## 15. Security / RLS

### Secrets

Server-only:

- Stripe secret key / PayPal client secret
- webhook signing secret / webhook verification credentials
- Supabase service-role/server secret

Never expose these through `NEXT_PUBLIC_*`, browser bundles, client components or logs.

### Browser permissions

User may read their own:

- orders
- purchases
- wallet
- credit ledger

Ordinary authenticated browser code must not:

- set an order to paid
- insert/update purchases
- increment/decrement wallet
- append credit ledger facts
- forge provider identifiers
- directly unlock reports

The current RLS baseline already follows this read-only pattern for wallet/ledger/orders/purchases and should be preserved.

### Webhook handler

Required sequence:

```text
read raw request body
→ verify provider signature
→ reject/ignore untrusted event
→ insert/check event inbox idempotency
→ normalize provider event
→ verify expected order/product/amount/currency/user binding
→ transactional fulfillment
→ mark event processed
→ return 2xx
```

Do not trust metadata alone if authoritative provider fields disagree.

## 16. Recommended V1 minimum implementation

After research approval, the smallest production implementation should be:

1. Stripe as first provider behind `PaymentProvider` adapter.
2. Stripe Checkout hosted payment page only; do not collect card details ourselves.
3. Two one-time product definitions only.
4. Server-side checkout creation.
5. Signed webhook endpoint.
6. Provider event inbox / dedupe record.
7. Atomic paid-order → purchase fulfillment.
8. Report entitlement uniqueness.
9. Atomic paid-order → +10 ledger grant + wallet projection.
10. Advisor reservation/commit/release flow.
11. Refund event reconciliation.
12. Billing tests covering duplicate webhook, duplicate checkout, duplicate credit grant, concurrent advisor requests, AI failure release and refund replay.
13. Production merchant/KYC/category approval before considering Stripe available.

Not in V1 minimum:

- subscriptions
- custom card form
- Touch 'n Go-specific gateway
- multiple local gateway integrations
- automated currency FX pricing engine
- complex promotion engine

## 17. Contract Change Requests

This Research PR does **not** modify shared Domain or production schema. The following changes should be reviewed by the project coordinator before Billing implementation.

### CCR-09-001 — Provider event inbox / webhook audit identity

Need a durable uniqueness gate on `(provider, provider_event_id)`. Current order idempotency alone is insufficient because provider event replay and business fulfillment are different idempotency layers.

### CCR-09-002 — Report entitlement relational identity

Current `purchases.entitlement jsonb` + `orders.report_id` can represent entitlement but does not provide the clean recommended uniqueness of:

```text
(user_id, product_code, resource_id)
```

Recommend a first-class resource binding / uniqueness rule before production.

### CCR-09-003 — Advisor reservation/request state

Current wallet/ledger schema has no durable reserved-credit state. Add `advisor_requests` / `credit_reservations` or approve a compensating-ledger reservation model with explicit reason codes.

### CCR-09-004 — Ledger reason/reference vocabulary

Current `CreditLedgerEntryType` is:

```text
purchase | usage | refund | adjustment | bonus
```

Current row has only `order_id` / `message_id` first-class references. Production implementation would benefit from stable reason/reference semantics such as `purchase_grant`, `advisor_usage`, `reversal`, `reference_type`, `reference_id`.

Do not change this Contract until approved because it affects shared types, migrations, repositories and tests.

### CCR-09-005 — Purchase Domain read model

Current shared billing Domain exposes `Order`, `Wallet`, and `CreditLedgerEntry`; purchase persistence exists but a first-class shared `Purchase` / entitlement read model is not present in `types/domain/billing.ts`. Report gating may need this shared read model.

### CCR-09-006 — Product-code naming

Decide once whether to retain current stable codes:

```text
personality_report
advisor_10
```

or migrate to explicit semantic codes:

```text
REPORT_FULL
ADVISOR_10_CREDITS
```

No change made in research.

## 18. Production implementation plan

Suggested sequence after coordinator approval:

### Phase 1 — Contract / schema hardening

- approve/reject CCRs
- migration for provider event inbox
- entitlement uniqueness
- reservation/request state
- billing mutation database functions/RPC
- tests for RLS and concurrency

### Phase 2 — Stripe adapter

- install/pin official Stripe SDK
- server-only provider config
- create Checkout Session
- normalized webhook events
- signature verification
- refund adapter
- provider test mode fixtures

### Phase 3 — fulfillment

- order creation
- webhook dedupe
- paid transition verification
- report purchase fulfillment
- +10 credit grant
- wallet projection

### Phase 4 — Advisor credits

- reserve
- AI call
- output validation
- commit usage
- failure release
- retry/idempotency tests

### Phase 5 — launch verification

- real Stripe merchant onboarding/category approval
- live test payment with approved merchant account
- refund test
- webhook replay test
- RLS verification
- Vercel Preview → Production secret separation
- payment-failure analytics

### Phase 6 — optional PayPal

Only add PayPal after real conversion/payment-method data or provider-risk evidence justifies a second integration.

## 19. Final research decision

```text
Provider: Stripe Checkout first, conditional on merchant/category approval
Secondary: PayPal later if conversion/provider-risk data justifies it
Credits: reserve → AI → commit; failure → release
Ledger: immutable final fact stream; wallet is projection
Fulfillment source of truth: verified server-side provider event/verification only
V1 methods: cards + eligible Apple/Google Pay + FPX + GrabPay + optional Alipay
Not V1: Touch 'n Go-specific integration, WeChat Pay dependency, subscriptions
```

No production Billing logic, UI, Domain Contract or production DB schema is modified by this Research PR.
