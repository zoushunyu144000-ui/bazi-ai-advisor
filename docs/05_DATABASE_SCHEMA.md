# 05 — Database Schema

状态：Wave 1 Supabase Core schema / migrations 已进入 `main`；Wave 2 Billing Contract Gate 已冻结目标 DB Contract，但本 Gate **不修改 migration，也未应用到任何真实 Supabase / Production 数据库**。

## 1. 实现原则

- 数据模型围绕“用户 → 出生信息 → 命盘 → 派生特征 → 报告 → 顾问对话 → 支付/次数”设计。
- 排盘原始输入、已解析出生 instant、计算结果和版本均可追溯。
- 复杂命理结构允许 JSONB；用户、支付、消息、钱包、账本保持 relational schema。
- AI 生成内容记录版本字段。
- 金额使用整数 minor units，不使用浮点金额。
- 顾问次数以 integer wallet projection + immutable credit ledger 追踪。
- 敏感写入由可信服务端完成，客户端不直接修改订单 paid 状态、Purchase、entitlement、wallet、ledger 或 Advisor reservation。

## 2. Auth 与用户根记录

Supabase `auth.users` 作为认证身份的 canonical source。

应用层：

- `public.users`：应用用户根记录，一对一引用 `auth.users(id)`
- `public.profiles`：展示资料与地区/营销同意等扩展信息

`handle_new_auth_user()` trigger 负责为新 Auth 用户初始化 `public.users`、`public.profiles`、`public.wallets`。

## 3. Birth persistence contract

`birth_profiles` 必须能够保存并恢复：

- `resolved_birth_instant timestamptz null`
- `utc_offset_minutes_at_birth integer null`

对应 Domain：

- `BirthProfile.resolvedBirthInstant?`
- `BirthProfile.utcOffsetMinutesAtBirth?`

当 Birth 已完成 DST overlap disambiguation 时，`resolved_birth_instant` 是 canonical UTC instant；mapper / repository 必须 round-trip 两字段。

## 4. Bazi calculation persistence contract

`bazi_charts` 必须持久化：

- `chart jsonb`
- `calculation_metadata jsonb`
- `relations jsonb`
- `luck jsonb`
- `engine_version`
- `rule_profile_version`

`bazi_derived_features` 单独保存 canonical `BaziDerivedFeatures` 与 engine/rule/mapping versions。

Repository 标准 read path 必须能够恢复完整 `BaziCalculationContext` / `BaziCalculationResult`，不允许保存 metadata / relations / luck 后又在 read path 丢失。

## 5. 当前已进入 main 的核心表

- `users`
- `profiles`
- `birth_profiles`
- `bazi_charts`
- `bazi_derived_features`
- `reports`
- `conversations`
- `messages`
- `user_memories`
- `wallets`
- `credit_ledger`
- `orders`
- `purchases`
- `analytics_events`

### `wallets`

当前保存 committed `advisor_credits`、累计购买 credits 与 optimistic `version`。

### `credit_ledger`

当前保存 `delta`、`balance_after`、`entry_type`、`idempotency_key` 以及 narrow order/message references。

### `orders`

当前保存 provider、provider order id、ProductCode、状态、currency、integer `amount_minor` 与 idempotency key。

### `purchases`

当前保存已形成的购买历史，`order_id` unique；现有 `entitlement jsonb` 在 Wave 2 后不再作为 report access authority。

## 6. Wave 2 Billing DB Contract

详细 source of truth：`docs/14_BILLING_CONTRACT_INTEGRATION.md`。

### 6.1 `payment_provider_events` — NEW target

用途：Webhook / Provider event durable inbox 与 replay gate。

最低 identity：

```text
unique(provider, provider_event_id)
```

建议状态：

```text
received | processed | ignored | failed
```

Provider event 被标记 `processed` 与本地 fulfillment 必须在同一个 short DB transaction 内形成一致事实。普通 Browser 不获得 mutation authority。

### 6.2 `report_entitlements` — NEW target

Report access authority 使用稳定 relational identity：

```text
(user_id, product_code, resource_id)
```

其中 V1：

```text
product_code = personality_report
resource_id = reports.id
```

目标唯一约束：

```text
unique(user_id, product_code, resource_id)
```

状态：

```text
active | revoked
```

Purchase 是历史购买事实；ReportEntitlement 是当前权限事实。不得再以 `purchases.entitlement jsonb` 模糊推断 access。

### 6.3 `advisor_requests` — NEW target

V1 选择 business-specific `advisor_requests`，不建立通用 `credit_reservations`。

目标字段至少包括：

- user / conversation / user message identity
- optional assistant message identity
- `credits_reserved = 1`
- state：`reserved | committed | released`
- `idempotency_key`
- `reservation_expires_at`
- optional committed ledger entry identity
- release reason
- timestamps

关键约束：

```text
unique(user_id, idempotency_key)
credits_reserved = 1
```

Wallet 不增加另一份 `reserved_credits` projection。Reserve 时在原子 DB operation 内按：

```text
available = wallet.advisor_credits - active non-expired reservations
```

检查可用额度。

### 6.4 `purchases` — MODIFY target

增加 relational `resource_id`：

```text
personality_report → resource_id required
advisor_10         → resource_id null
```

`order_id unique` 继续作为 Purchase fulfillment 幂等底线。

### 6.5 `credit_ledger` — MODIFY target

保留现有 `entry_type`：

```text
purchase | usage | refund | adjustment | bonus
```

增加 canonical：

```text
reason
reference_type
reference_id
```

新 production fact 必须有 reason/reference/idempotency identity。

Canonical reasons：

```text
purchase_grant
advisor_usage
refund_reversal
manual_adjustment
promo_bonus
```

Canonical reference types：

```text
purchase
advisor_request
order
ledger_entry
manual_adjustment
promotion
```

Ledger 是 immutable fact stream；修正使用新的 reversal / adjustment row，不 update/delete 历史事实。

### 6.6 `wallets` — committed projection

`advisor_credits` 继续只代表 committed balance。只有 Advisor `reserved → committed` 时才在同一 transaction：

1. append `usage/advisor_usage` ledger fact
2. wallet `-1`
3. advisor request → committed

Reservation release 不产生补偿 ledger，因为 reservation 从未形成 committed debit。

### 6.7 ProductCode storage

Serialized ProductCode 正式冻结：

```text
personality_report
advisor_10
```

不迁移为 uppercase 第二套 codes。价格不编码在 ProductCode；历史真实成交金额继续由 Order / Purchase 的 currency + integer minor amount 记录。

## 7. 关键关系与唯一约束

继续保留：

- `birth_profiles.user_id → users.id`
- `bazi_charts.birth_profile_id → birth_profiles.id`
- `bazi_derived_features.chart_id → bazi_charts.id`
- `reports → chart + derived features`
- `conversations → user + optional report`
- `messages → conversation + user`
- `purchases.order_id unique`
- `orders.idempotency_key unique`
- `credit_ledger.idempotency_key unique`
- `unique(provider, provider_order_id)`

Wave 2 新增 target：

- provider event：`unique(provider, provider_event_id)`
- report entitlement：`unique(user_id, product_code, resource_id)`
- advisor request：`unique(user_id, idempotency_key)`

这些唯一约束是业务幂等的数据库底线，不能只依赖 application `SELECT` 后再 `INSERT`。

## 8. RLS / trusted write boundary

已进入 main 的基线继续有效：用户可以读取自己被允许读取的 wallet / ledger / order / purchase 等数据，但不能直接 mutation 敏感 billing state。

Wave 2 新表同样遵守：

- `report_entitlements`：用户可 select own；grant/revoke trusted server only
- `advisor_requests`：如 UI 需要可 select own；reserve/commit/release trusted server/RPC only
- `payment_provider_events`：默认 internal server table，不向用户暴露 provider payload / mutation

Browser 永远不能通过 RLS policy 直接：set paid、grant/deduct credits、unlock report。

## 9. Transaction boundaries

### Payment fulfillment

Provider signature verify / normalization 在事务外完成；本地 event/order/purchase/entitlement/ledger/wallet fulfillment 使用 short transaction / atomic RPC。

不得在 DB transaction 内等待 Provider 网络调用。

### Advisor

```text
short reserve transaction
→ AI outside transaction
→ validation / persistence
→ short commit transaction
```

失败：short release transaction。

绝对禁止长 transaction 包住 LLM 调用。

## 10. 08 Migration Ownership

本 Billing Contract Gate 不修改 migration。08 后续负责：

1. 基于当前 `supabase/migrations/**` 新增 forward-only migration，不重写既有 migration history。
2. 实现 `payment_provider_events` / `report_entitlements` / `advisor_requests`。
3. 修改 purchases / credit_ledger 到最终 Contract。
4. RLS / indexes / constraints。
5. 实现 atomic trusted RPC / DB primitives。
6. 更新 rows / mappers / repositories，并把 local Purchase read model 收敛到 shared `Purchase`。
7. 增加 replay、duplicate、concurrency、timeout 与 round-trip tests。

## 11. 仍未冻结事项

以下仍保持 Product / Operations TBD，不阻塞 Shared Billing Contract：

- 匿名免费测试是否持久化
- Report refund 后具体访问/revoke 策略
- Advisor credits expiry
- Advisor pack stacking policy
- 部分 credits 已消费后的 full-refund policy；当前 wallet 不允许负余额
- 用户数据导出/删除策略
- Advisor 对话保留期限
- Production DB 连接池 / 备份策略
- 真实 Payment Provider merchant onboarding / category approval

此前“Webhook event audit table 是否需要”“Full Report entitlement 是否需要独立 relational table”已经被 Wave 2 Billing Contract Gate 正式裁决，不再是 TBD。

最后更新：2026-08-18
