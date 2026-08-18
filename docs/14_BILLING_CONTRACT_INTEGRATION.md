# 14 — Wave 2 Billing Contract Integration

状态：Approved Contract Gate / implementation pending

日期：2026-08-18

Branch：`feature/billing-contract-integration`

基线：Payment / Credits Research PR #10 已进入 `main`；本文件把 `CCR-09-001` ～ `CCR-09-006` 从 Research 建议提升为正式 Shared Contract。

> 本 Gate 只冻结 Contract、事务边界、幂等边界与模块 ownership。它不接 Stripe、不实现 Payment Provider、不写 Checkout UI、不修改 Billing production service，也不修改 Bazi / Interpretation。

## 1. 不变量

### Browser 永远不是 Billing authority

Browser 不得直接：

- 把 Order 标记为 paid
- 创建 Purchase
- grant credits
- deduct credits
- unlock / revoke report
- 改写 immutable credit ledger
- reserve / commit / release advisor credit state

所有敏感写入必须通过 trusted server-side path，并最终由数据库约束 / transaction / RPC 保证并发与幂等。

### Payment fulfillment

```text
Verified Provider Event
↓
Provider Event Inbox
↓
Order
↓
Purchase
├─ personality_report → ReportEntitlement
└─ advisor_10 → CreditLedger purchase_grant + Wallet projection
```

Browser success / return URL 只用于展示状态，不能触发权益发放。

### Advisor credit

```text
reserve
↓
AI call outside DB transaction
↓
validate + persist output
↓
commit
```

失败或超时：

```text
reserved → released
```

不得用长时间数据库 transaction 包住 LLM 调用。

---

# 2. CCR 最终裁决

## CCR-09-001 — Provider Event Inbox

**裁决：APPROVED**

正式要求新增 durable provider-event inbox / audit identity，数据库唯一键：

```text
(provider, provider_event_id)
```

`orders.idempotency_key`、`(provider, provider_order_id)` 与 provider event replay 是三个不同幂等层，不能互相替代。

目标表名：

```text
payment_provider_events
```

最小 DB 字段：

```text
id
provider
provider_event_id
event_type
status                received | processed | ignored | failed
order_id?              nullable
normalized_payload?    jsonb / implementation detail
received_at
processed_at?
last_error?
```

约束：

- unique `(provider, provider_event_id)`
- raw Provider DTO 不进入 shared Domain
- signature verification / provider normalization 在进入 fulfillment transaction 前完成
- event 被标记 `processed` 与对应本地 fulfillment 写入必须属于同一个数据库事务
- duplicate delivery 对已 `processed` / `ignored` event 返回幂等成功，不重复 fulfillment
- `failed` 可在 provider replay / trusted retry 后重新尝试，成功后进入 `processed`

该 inbox 是 09 Billing webhook service 与 08 persistence/RPC 的集成边界，不需要成为 UI-facing shared Domain model。

---

## CCR-09-002 — Report Entitlement Identity

**裁决：APPROVED**

V1 不再以 `purchases.entitlement jsonb` 作为 report access authority。

正式 entitlement identity：

```text
(user_id, product_code, resource_id)
```

其中：

```text
product_code = personality_report
resource_id = reports.id
```

目标表名：

```text
report_entitlements
```

唯一约束：

```text
unique (user_id, product_code, resource_id)
```

V1 invariant：

```text
同一个 user
+ 同一个 report
+ personality_report
→ 只有一个 entitlement identity
```

Entitlement 状态：

```text
active | revoked
```

退款后是否 revoke 由 Business Rule 决定，但 schema / Domain 已支持 revoke。后续重新购买同一 report 时应复用同一个 entitlement identity 并重新激活，而不是制造多个互相冲突的 active entitlement。

`Purchase` 继续保存历史购买事实；`ReportEntitlement` 才是 report gating authority。

---

## CCR-09-003 — Advisor Reservation / Request

**裁决：MODIFIED**

研究给出的 `advisor_requests` / `credit_reservations` 二选一，正式选择：

```text
advisor_requests
```

V1 **不新增通用 `credit_reservations` 表**。

原因：当前只有 Advisor 消耗 credits；`advisor_requests` 同时承载业务请求 identity、retry identity、reservation 生命周期与最终 assistant message / ledger linkage，避免为了一个用例先抽象出过度通用的 reservation subsystem。

状态机固定为：

```text
reserved
├─→ committed
└─→ released
```

`committed` 与 `released` 都是 terminal state，不得重新回到 `reserved`。

V1 每个 Advisor request：

```text
credits_reserved = 1
```

并发规则：

- unique `(user_id, idempotency_key)`
- 多标签页使用不同 request idempotency key 时必须竞争真实 available credits
- 同一 retry key 返回同一个 durable advisor request，不再次 reserve
- reservation 有 `reservation_expires_at`
- expired reservation 不允许之后再 commit；必须 release / recovery

Wallet 语义：

```text
wallet.advisor_credits = 已 committed 的当前余额 projection
```

Reservation **不立即写 -1 ledger**，也不立即减少 wallet committed balance。

Reserve transaction 中的可用额度：

```text
available
= wallet.advisor_credits
- SUM(current non-expired reserved advisor_requests.credits_reserved)
```

只有 `reserved → committed` 时才：

1. wallet `-1`
2. append immutable `advisor_usage` ledger fact
3. request → committed

三者必须在同一 short DB transaction 中完成。

`reserved → released` 不产生 `+1` ledger，因为 reservation 从未形成最终 debit。

---

## CCR-09-004 — Credit Ledger Vocabulary

**裁决：MODIFIED**

现有 `entry_type` 已进入 shared Domain、schema、migration history：

```text
purchase
usage
refund
adjustment
bonus
```

这些粗分类 **保留，不做无收益重命名**。

新增正式精确 vocabulary：

### reason

```text
purchase_grant
advisor_usage
refund_reversal
manual_adjustment
promo_bonus
```

### reference_type

```text
purchase
advisor_request
order
ledger_entry
manual_adjustment
promotion
```

### reference_id

```text
string
```

`reference_id` 不限制为 UUID，以允许人工调整 ticket / promotion key 等稳定业务 identity。

标准映射：

| entry_type | reason | reference_type | 说明 |
|---|---|---|---|
| purchase | purchase_grant | purchase | Advisor pack verified purchase grants credits |
| usage | advisor_usage | advisor_request | committed Advisor request consumes 1 credit |
| refund | refund_reversal | ledger_entry / order | reverse a prior grant under approved refund policy |
| adjustment | manual_adjustment | manual_adjustment | trusted operator/system adjustment |
| bonus | promo_bonus | promotion | promotional credit grant |

Ledger 规则：

- ledger 是 immutable committed fact stream
- wallet 是 ledger 的 projection/cache
- 不允许 update/delete 旧 ledger fact 来“修正”余额
- correction 使用新的 reversal / adjustment fact
- wallet update + ledger append 必须同 transaction
- new production writes 必须带 `reason + reference_type + reference_id + idempotency_key`

Shared `CreditLedgerEntry` 在 Gate 分支为兼容当前 Wave 1 repository，新增字段暂时 optional；新增 `CreditLedgerFactInput` 对所有新 production write 强制 required。08 完成 migration / mapper 后应把 read path 收敛到这些字段始终存在。

现有 `order_id` / `message_id` 是 legacy narrow references。08 migration 后 generic reference 成为 canonical；不要长期维护两套等价引用语义。

---

## CCR-09-005 — Purchase Domain

**裁决：APPROVED**

新增 first-class shared `Purchase` read model。

正式语义：

```text
Order = 支付尝试 / 状态
Purchase = 已形成的历史购买事实
ReportEntitlement = 当前 report access authority
CreditLedgerEntry = committed credit fact
```

Shared `Purchase` 使用 discriminated union：

```text
ReportPurchase
  productCode = personality_report
  resourceId = report id (required)

AdvisorCreditPurchase
  productCode = advisor_10
  resourceId 不存在
```

用途：

- account billing history
- Report / entitlement traceability
- 06 / 07 / 09 downstream read contract

注意：06 的 report gating 应读取 `ReportEntitlement`，不是只看 `Purchase`。

---

## CCR-09-006 — Product Code

**裁决：REJECTED（拒绝改名；正式冻结现有 codes）**

正式 serialized `ProductCode` 保持：

```text
personality_report
advisor_10
```

不迁移到：

```text
REPORT_FULL
ADVISOR_10_CREDITS
```

原因：

1. 当前 codes 已进入 shared Domain。
2. 已进入 `db/schema.sql` 与 Supabase migration history。
3. 已被 repositories / tests / order/purchase storage 使用。
4. 新命名不会提供额外运行时安全性，却会增加 migration、API、历史数据与并行分支冲突成本。
5. 当前 codes 只要把语义写死即可长期稳定。

正式语义：

```text
personality_report
= concrete report 的完整付费人格报告 entitlement
= 不代表 free result

advisor_10
= 每 quantity=1 的 verified Purchase grant exactly +10 advisor credits
```

价格不编码进 ProductCode。历史订单以 `currency + amount_minor` 保存真实成交金额。

禁止长期保留第二套 uppercase serialized alias。

---

# 3. 最终 Shared Domain Contract

本 Gate 修改 `types/domain/billing.ts`，新增 / 冻结：

```text
PRODUCT_CODES
ProductCode

CreditLedgerEntryType
CreditLedgerReason
CreditLedgerReferenceType
CreditLedgerEntry
CreditLedgerFactInput

Purchase
ReportPurchase
AdvisorCreditPurchase

ReportEntitlement
ReportEntitlementStatus

AdvisorRequest
AdvisorRequestState
AdvisorRequestReleaseReason
```

关键含义：

- Purchase 是历史 acquisition read model。
- ReportEntitlement 是 report access read model。
- AdvisorRequest 是 reservation / retry / commit 的 durable aggregate。
- CreditLedgerFactInput 是 trusted write contract；final ledger facts 必须有 reason/reference。
- Provider raw event / Stripe DTO 不进入 shared Domain。

---

# 4. 最终 DB Contract

> 本节是 08 的 migration target，不代表本 Gate 已修改数据库。

## 4.1 `payment_provider_events` — NEW

最低约束：

```text
unique(provider, provider_event_id)
```

trusted server write only。默认不提供 browser-facing mutation；原则上也无需普通用户读取 provider payload。

## 4.2 `report_entitlements` — NEW

目标字段：

```text
id uuid PK
user_id uuid FK users
product_code text = personality_report
resource_id uuid FK reports
source_purchase_id uuid FK purchases
status active|revoked
granted_at
revoked_at nullable
updated_at
```

约束：

```text
unique(user_id, product_code, resource_id)
```

用户可 select 自己的 entitlement；任何 grant/revoke 仅 trusted server。

## 4.3 `advisor_requests` — NEW

目标字段：

```text
id uuid PK
user_id uuid FK users
conversation_id uuid FK conversations
user_message_id uuid FK messages
assistant_message_id uuid nullable FK messages
credits_reserved integer = 1
state reserved|committed|released
idempotency_key text
reservation_expires_at timestamptz
commit_ledger_entry_id uuid nullable FK credit_ledger
release_reason text nullable
created_at
updated_at
committed_at nullable
released_at nullable
```

关键约束：

```text
unique(user_id, idempotency_key)
credits_reserved = 1
```

并增加 user/state、reserved expiry 等必要索引。用户若需要 UI 状态可 select 自己的 request；所有 state mutation 仅 trusted server / RPC。

## 4.4 `purchases` — MODIFY

增加 relational：

```text
resource_id uuid nullable
```

V1 consistency：

```text
product_code = personality_report → resource_id required
product_code = advisor_10         → resource_id null
```

`entitlement jsonb` 不再作为权限 authority；08 可按安全 migration 路径 deprecate / remove，不应继续让 UI 用 JSONB 做 access check。

`order_id unique` 继续作为 purchase fulfillment idempotency gate。

## 4.5 `credit_ledger` — MODIFY

保留：

```text
entry_type
```

增加：

```text
reason
reference_type
reference_id
```

新 production row 必须非空，并保留 `idempotency_key unique`。

当前 `order_id` / `message_id` 应在 repository 全部迁移到 generic references 后 deprecate；若需要短期 backfill compatibility 可以暂存，但 generic reference 是最终 canonical contract。

## 4.6 `wallets` — KEEP COMMITTED PROJECTION

不新增 `reserved_credits` 列作为第二份可漂移余额。

`advisor_credits` 只代表 committed balance。Reservation availability 在原子 reserve operation 内结合 active `advisor_requests` 计算。

## 4.7 `orders` — KEEP CORE IDENTITY

继续保留：

```text
orders.idempotency_key unique
unique(provider, provider_order_id)
```

Order transition 必须由 trusted service / RPC 做 monotonic guard：

```text
pending → paid | failed | expired
paid → refunded
```

late `failed` / `expired` event 不得覆盖已确认 `paid`。

---

# 5. Ownership Matrix

| Area | 01 Architecture | 08 Supabase/DB | 09 Billing/Payment | 07 AI Advisor |
|---|---|---|---|---|
| Shared billing Domain | **Owner** | Consumer | Consumer | Consumer |
| DB migration / constraints / indexes | Contract only | **Owner** | Consumer | Consumer |
| RLS | Contract only | **Owner** | Consumer | Consumer |
| Atomic SQL/RPC for fulfillment / credit | Boundary | **Owner** | Calls/orchestrates | Calls advisor credit API |
| Payment Provider adapter | Boundary only | No | **Owner** | No |
| Webhook signature / normalization | Boundary only | No | **Owner** | No |
| Order / Purchase fulfillment orchestration | Contract | DB primitives | **Owner** | No |
| Advisor reserve/commit/release persistence | Contract | **DB/RPC owner** | Billing API owner | **Runtime consumer** |
| LLM call / structured validation | No | No | No | **Owner** |
| Report entitlement UI gating | Contract | read path | service read | No direct mutation |

任何窗口不得把 browser-facing repository 变成 sensitive billing mutation authority。

---

# 6. Transaction Boundaries

## 6.1 Payment event receive

事务外：

1. verify provider signature
2. parse provider payload
3. normalize into project-owned event facts

不得在 DB transaction 内等待 Provider network call。

## 6.2 Payment fulfillment transaction

一个 short DB transaction / atomic RPC 内：

1. acquire / inspect provider event inbox identity
2. lock event + related Order as needed
3. if already processed/ignored → idempotent no-op
4. apply monotonic Order transition
5. ensure Purchase exists once
6. fulfill exactly once:
   - report → activate `ReportEntitlement`
   - advisor pack → append purchase_grant ledger + update Wallet
7. mark event `processed`
8. commit

若 transaction rollback，则不得留下“event processed 但权益没发”或“权益已发但 event 仍可再次发”的半完成状态。

处理异常可在 rollback 后记录 `failed / last_error`，后续 provider replay / trusted retry 再尝试。

## 6.3 Advisor reserve transaction

一个 short transaction / RPC：

1. resolve `(user_id, idempotency_key)` existing request
2. lock wallet / serialization scope
3. compute non-expired active reservations
4. assert available credits >= 1
5. insert `advisor_requests(state=reserved)`
6. commit

然后退出 DB transaction，再调用 AI。

## 6.4 Advisor commit transaction

AI 成功 + structured validation + assistant output persistence 后：

1. lock advisor request + wallet
2. ensure request is still `reserved` and not expired
3. append one `usage / advisor_usage` ledger fact
4. wallet `advisor_credits -= 1`
5. request → `committed` and link ledger / assistant message
6. commit

重复 commit 使用同一 request identity / ledger idempotency key，必须返回已完成结果，不重复扣款。

## 6.5 Advisor release transaction

terminal AI/provider/validation/server failure：

```text
reserved → released
```

Wallet 不变；Ledger 不新增 compensating `+1`。

---

# 7. Idempotency Boundaries

| Boundary | Canonical identity |
|---|---|
| Checkout / create Order intent | `orders.idempotency_key` |
| Provider payment object | `(provider, provider_order_id)` |
| Provider webhook delivery | `(provider, provider_event_id)` |
| Purchase creation | `purchases.order_id unique` |
| Report entitlement | `(user_id, product_code, resource_id)` |
| Advisor pack credit grant | `purchase:{purchase_id}:grant` or equivalent stable key |
| Advisor request / retry | `(user_id, advisor_requests.idempotency_key)` |
| Advisor usage ledger | `advisor_request:{advisor_request_id}:commit` or equivalent stable key |
| Release | idempotent request state transition; no ledger fact |

不要用一个全局 idempotency key 试图替代所有边界。

---

# 8. Advisor Credit State Machine

```text
                    AI / validation success
reserved --------------------------------------> committed
   |
   | provider error / timeout / invalid output
   | server error / reservation expiry
   v
released
```

Invariant：

```text
reserved   = temporary capacity claim, no ledger debit
committed  = exactly one -1 ledger fact + wallet projection update
released   = no permanent credit loss
```

多标签页安全依赖 reserve transaction 对 wallet + active reservations 的原子检查，而不是前端看到的余额。

Retry 安全依赖 durable advisor request idempotency key，而不是重新发送一条全新 debit。

如果 assistant output 已成功落库，但最终 commit 遭遇 terminal unrecoverable failure，系统宁可 release / 给用户一次免费成功结果，也不得造成“输出失败但永久扣 credit”的状态；transient commit failure 应优先按同一 idempotency identity 重试。

---

# 9. Payment Fulfillment State Machine

## Provider event inbox

```text
received
├─→ processed
├─→ ignored
└─→ failed ── trusted retry/replay ──→ processed | ignored | failed
```

## Order

```text
pending
├─→ paid
├─→ failed
└─→ expired

paid
└─→ refunded
```

`paid` 是强状态；late failure / expiry 不得倒退覆盖。

## Verified paid fulfillment

### `personality_report`

```text
verified paid event
→ Order paid
→ Purchase once
→ ReportEntitlement active for (user, personality_report, report)
→ provider event processed
```

### `advisor_10`

```text
verified paid event
→ Order paid
→ Purchase once
→ immutable purchase_grant +10 × quantity
→ Wallet projection update
→ provider event processed
```

重复 webhook / fulfillment retry 读取既有 records 并返回 success，不重复 grant。

---

# 10. Migration Plan

01 本 Gate **不写 migration**。08 后续必须以当前 migration history 为基线新增 forward-only migration，不修改既有历史 migration。

建议顺序：

1. 新建 `payment_provider_events`。
2. 新建 `report_entitlements`。
3. 新建 `advisor_requests`。
4. `purchases` 增加 `resource_id` + consistency constraints。
5. `credit_ledger` 增加 reason/reference vocabulary。
6. 为现有开发数据按可证明规则 backfill ledger reason/reference；无法证明的开发旧数据显式处理，不猜语义。
7. 更新 rows / mappers / repositories，删除 `server/repositories/models.ts` 中重复的 local `Purchase`，改用 shared `Purchase`。
8. 为新表启用 RLS；用户最多 select own，敏感 mutation 无 browser policy。
9. 实现 trusted atomic RPC / service primitives：payment fulfillment、advisor reserve、advisor commit、advisor release。
10. 迁移稳定后再移除/deprecate `purchases.entitlement` authority 与 ledger narrow legacy refs。
11. 增加并发、重复 webhook、retry、timeout、refund/reversal tests。

当前 Supabase Live Integration 尚未完成，因此不需要为线上生产数据设计复杂 zero-downtime backfill；但 migration 必须能够从已进入 main 的 migration history clean apply。

---

# 11. 08 / 09 / 07 Implementation Handoff

## 08 — Supabase / Database

必须：

- 实现本文件第 4 节 DB Contract
- forward migration，不编辑旧 migration
- RLS：browser read own only where required；sensitive mutation server-only
- DB unique constraints 真正承担 provider event / entitlement / advisor request 幂等底线
- 原子 transaction / RPC：
  - payment fulfillment primitives
  - advisor reserve
  - advisor commit
  - advisor release
- wallet + ledger 同 transaction
- migration / repository tests 覆盖并发与 replay
- Purchase repository 改用 shared `Purchase`

不得：

- 在 client RLS policy 开放 wallet / ledger / entitlement / order status mutation
- 把 LLM call 放入 DB transaction

## 09 — Billing / Payment / Credits

必须：

- 基于本 Contract 实现 BillingService
- Provider 选择与 Adapter 必须继续遵守 `docs/12_REUSE_AND_REFERENCES.md` 与 payment research
- webhook 先 verify，再 normalize，再调用 DB fulfillment
- raw Provider DTO 不泄漏到 shared Domain
- browser return page 只查状态，不 fulfillment
- order transitions monotonic
- duplicate provider event / purchase grant / entitlement grant 都幂等
- refund/reversal 使用 immutable ledger / entitlement revoke 语义，不修改历史 fact

本 Gate **不授权直接接真实 Stripe**；真实 Provider implementation 需由 09 独立实现与验收。

## 07 — AI Advisor Runtime

必须：

- 在 LLM 前调用 trusted `reserveAdvisorRequest(...)`
- reserve 成功后退出 transaction 再调 AI
- validated success 后调用 `commitAdvisorRequest(...)`
- terminal failure / timeout / invalid structured output 调用 `releaseAdvisorRequest(...)`
- retry 使用同一 advisor request idempotency key
- 不直接写 Wallet / CreditLedger
- 不自己实现并发 credit deduction

---

# 12. 仍未冻结但不阻塞本 Gate 的产品决策

以下事项 **不阻塞 Shared Billing Contract**，但在真实 Payment / Refund 上线前必须由 00 / 产品决策冻结：

1. Full report entitlement 在退款后是否立即 revoke，以及历史访问策略。
2. Advisor credits 是否过期。
3. Advisor credit pack 是否允许无限叠加购买。
4. 已消费部分 Advisor credits 后发生全额退款时的策略：只退剩余 credits、允许负余额、人工审核或其他方案。当前 V1 Wallet Contract 不允许负余额。
5. Production merchant / Provider 的真实 onboarding 与该产品类别审批。

Shared Contract 已为这些策略留出明确边界，不需要等待它们才能推进 08 / 09 / 07 的基础实现。

---

# 13. Scope Confirmation

本 Gate 没有：

- 接真实 Stripe / PayPal
- 写 Payment Provider
- 写 Checkout UI
- 修改 Supabase migration
- 修改 `modules/billing/**` production implementation
- 修改 Bazi / Interpretation
- 部署 Production

本文件是 Wave 2 Billing Contract 的 integration source of truth；若后续修改 serialized ProductCode、ledger vocabulary、entitlement identity 或 Advisor state machine，必须再次走 shared Contract / Decision Log 审批。
