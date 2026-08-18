# 05 — Database Schema

状态：Foundation schema 已存在于 `db/schema.sql`；Wave 1.5 已冻结 Birth / Bazi calculation persistence 的共享 Contract，**尚未应用到任何真实 Supabase / Production 数据库**。

## 1. 实现原则

- 数据模型围绕“用户 → 出生信息 → 命盘 → 派生特征 → 报告 → 顾问对话 → 支付/次数”设计。
- 排盘原始输入、已解析出生 instant、计算结果和版本均可追溯。
- 复杂命理结构允许 JSONB；用户、支付、消息、钱包、账本保持 relational schema。
- AI 生成内容记录版本字段。
- 金额使用整数 minor units，不使用浮点金额。
- 顾问次数以整数 wallet + append-style credit ledger 追踪。
- 敏感写入由可信服务端完成，客户端不直接修改钱包、账本或生成结果。

## 2. Auth 与用户根记录

Supabase `auth.users` 作为认证身份的 canonical source。

应用层：

- `public.users`：应用用户根记录，一对一引用 `auth.users(id)`
- `public.profiles`：展示资料与地区/营销同意等扩展信息

`handle_new_auth_user()` trigger 负责为新 Auth 用户初始化 `public.users`、`public.profiles`、`public.wallets`。

## 3. Wave 1.5 Birth persistence contract

`birth_profiles` 除 Foundation 字段外，必须能够保存并恢复：

- `resolved_birth_instant timestamptz null`
- `utc_offset_minutes_at_birth integer null`

对应 Domain：

- `BirthProfile.resolvedBirthInstant?`
- `BirthProfile.utcOffsetMinutesAtBirth?`

语义：

- 当 03 Birth 已经对 DST overlap 完成 disambiguation 时，`resolved_birth_instant` 是 canonical UTC instant。
- `utc_offset_minutes_at_birth` 保存该 occurrence 当时的 UTC offset（minutes east of UTC）。
- 08 的 mapper / repository 必须 round-trip 两字段，不允许只塞进临时 metadata 后丢失。
- unknown birth time 或 legacy record 可以为 null。

## 4. Wave 1.5 Bazi calculation persistence contract

### `bazi_charts`

除现有：

- `chart jsonb`
- `calculation_metadata jsonb`
- `engine_version`
- `rule_profile_version`

还必须持久化：

- `relations jsonb`：shared `BaziRelation[]`
- `luck jsonb`：shared `BaziLuckStructure`

建议 migration 形态：

```sql
relations jsonb not null default '[]'::jsonb,
luck jsonb not null
```

当前没有 Production 数据，因此 Wave 1.5 不为历史线上数据设计复杂 backfill；真正 migration 仍由 08 Supabase 窗口在其 feature branch 完成并测试。

### `bazi_derived_features`

继续单独保存 canonical `BaziDerivedFeatures`，并保留：

- `engine_version`
- `rule_profile_version`
- `mapping_version`

其中：

- `elementDistribution[].score` = 0–100 percentage
- `tenGodDistribution[].score` = 0–100 percentage
- `confidence` = 0–1

禁止数据库中混存两种分布 scale。

## 5. Repository read/write contract

保存路径与读取路径必须对称。

### Calculation context

Repository 必须能 round-trip：

```text
BaziCalculationContext
= BaziChart
+ BaziCalculationMetadata
+ BaziRelation[]
+ BaziLuckStructure
```

最低要求：

- 保存 chart 时一并保存 metadata / relations / luck
- 标准 read path 能同时读回 metadata / relations / luck
- 不再出现“数据库保存 calculation_metadata，但 `getById()` 永远只返回 `BaziChart`”的状态

### Calculation result

服务层 / repository 组合读取应能够恢复：

```text
BaziCalculationResult
= BaziCalculationContext
+ canonical BaziDerivedFeatures
```

这样未来 04 / 07 不需要重新推导数据库里已经保存的传统命理事实。

## 6. 当前 Schema 表

### `users`
应用用户状态、locale、timezone。

### `profiles`
用户展示资料。

### `birth_profiles`
出生日期、出生时间精度、时区、地点、传统规则所需性别字段、已解析出生 instant / offset，以及原始输入 JSONB。

### `bazi_charts`
确定性排盘结果。命盘正文、calculation metadata、relations、luck 使用 JSONB，同时单独保存 engine/rule versions。

### `bazi_derived_features`
canonical 五行、十神、旺衰、季节结构、结构标签等派生特征 JSONB，同时保存 engine/rule/mapping versions。

### `reports`
人格/报告结构 JSONB，保存完整五类版本字段：

- `engine_version`
- `rule_profile_version`
- `mapping_version`
- `prompt_version`
- `report_schema_version`

### `conversations`
AI 顾问会话元数据、模型信息、`prompt_version`。

### `messages`
会话消息、结构化 payload、模型信息、credit cost。

### `user_memories`
用于后续 Advisor 的用户偏好、目标、限制、事实与顾问笔记；值允许 JSONB，可撤销/编辑。

### `wallets`
每位用户当前顾问次数、累计购买次数和乐观并发 `version`。

### `credit_ledger`
每次购买、使用、退款、调整、奖励对应一条整数变动记录，并有唯一 `idempotency_key`。

### `orders`
支付订单。金额为 `amount_minor bigint`，记录 provider、provider order id、状态、产品与幂等键。

### `purchases`
已形成的购买记录，与订单分离，并预留 entitlement JSONB 用于交付信息。

### `analytics_events`
产品事件与 JSONB properties，支持已登录 user 或 anonymous id。

## 7. 关系与约束

- `birth_profiles.user_id → users.id`
- `bazi_charts.birth_profile_id → birth_profiles.id`
- `bazi_derived_features.chart_id → bazi_charts.id`
- `reports → chart + derived features`
- `conversations → user + optional report`
- `messages → conversation + user`
- `credit_ledger → wallet + optional order/message`
- `purchases → order`

关键唯一约束继续包括：

- 同一 BirthProfile + engine/rule 版本不重复生成同一 chart
- 同一 chart + mapping version 不重复派生
- order / ledger 使用唯一 `idempotency_key`
- provider + provider_order_id 唯一
- 同一用户 active memory key 唯一

## 8. RLS 基线

Foundation 已为主要表开启 Row Level Security。

对以下敏感数据不开放直接客户端写权限：

- charts / derived features
- reports
- wallets / credit ledger
- purchases
- analytics ingestion

这些写入应由可信服务端逻辑执行。

## 9. Wave 1.5 对 PR #6 的最小返工要求

08 Supabase 窗口在合并前必须：

1. migration 添加 Birth resolved instant / offset 字段
2. migration 添加 Bazi relations / luck 持久化
3. `BirthProfileRow`、mapper、create/update repository round-trip 新 Birth 字段
4. `ChartRow`、mapper、repository round-trip `BaziCalculationMetadata`、relations、luck
5. 提供明确 calculation context/result read path
6. 保留统一 root test scripts，不再覆盖 `npm test` 为 backend-only
7. 增加 backend tests 证明 round-trip 不丢字段

## 10. 当前未冻结事项

以下内容仍保持 TBD：

- 匿名免费测试是否持久化
- 支付 Provider Webhook 的最终事件审计表结构
- Full Report entitlement 是否需要独立 relational table
- 用户数据导出/删除策略
- Advisor 对话保留期限
- 生产数据库连接池与备份策略

当支付窗口开始实现 Webhook 时，必须补足 Provider event id 的幂等审计结构，不能只依赖前端支付成功页。

最后更新：2026-08-18
