# 05 — Database Schema

状态：Foundation schema 已实现于 `db/schema.sql`（PR #1），**尚未应用到任何真实 Supabase / Production 数据库**。

## 1. 实现原则

- 数据模型围绕“用户 → 出生信息 → 命盘 → 派生特征 → 报告 → 顾问对话 → 支付/次数”设计。
- 排盘原始输入、计算结果和版本均可追溯。
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

## 3. 当前 Schema 表

### `users`
应用用户状态、locale、timezone。

### `profiles`
用户展示资料。

### `birth_profiles`
出生日期、出生时间精度、时区、地点、传统规则所需性别字段，以及原始输入 JSONB。

### `bazi_charts`
确定性排盘结果。命盘正文与 calculation metadata 使用 JSONB，同时单独保存：

- `engine_version`
- `rule_profile_version`

### `bazi_derived_features`
五行、十神、旺衰、结构标签等派生特征 JSONB，同时保存 engine/rule/mapping 版本。

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

## 4. 关系与约束

- `birth_profiles.user_id → users.id`
- `bazi_charts.birth_profile_id → birth_profiles.id`
- `bazi_derived_features.chart_id → bazi_charts.id`
- `reports → chart + derived features`
- `conversations → user + optional report`
- `messages → conversation + user`
- `credit_ledger → wallet + optional order/message`
- `purchases → order`

关键唯一约束包括：

- 同一 BirthProfile + engine/rule 版本不重复生成同一 chart
- 同一 chart + mapping version 不重复派生
- order / ledger 使用唯一 `idempotency_key`
- provider + provider_order_id 唯一
- 同一用户 active memory key 唯一

## 5. RLS 基线

Foundation 已为主要表开启 Row Level Security。

当前允许用户读取/维护自己的安全范围数据；对以下敏感数据没有开放直接客户端写权限：

- charts / derived features
- reports
- wallets / credit ledger
- purchases
- analytics ingestion

这些写入应由后续可信服务端逻辑执行。

## 6. 当前未冻结事项

以下内容在真实 Provider / API 实现前保持 TBD：

- 是否采用 ORM，或直接使用 Supabase/Postgres migrations
- 匿名免费测试是否持久化
- 支付 Provider Webhook 的最终事件审计表结构
- Full Report entitlement 是否需要独立 relational table
- 用户数据导出/删除策略
- Advisor 对话保留期限
- 生产数据库连接池与备份策略

当支付窗口开始实现 Webhook 时，必须补足 Provider event id 的幂等审计结构，不能只依赖前端支付成功页。

最后更新：2026-08-17
