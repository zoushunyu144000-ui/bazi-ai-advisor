# 05 — Database Schema

状态：Logical Draft。数据库供应商和最终字段将在实现时冻结。

## 1. 原则

- 数据模型围绕“用户 → 命盘 → 报告 → 权益 → 顾问对话 → 支付”设计
- 排盘原始输入与计算结果都应可追溯
- AI 生成内容需记录版本
- 支付与权益分离，避免只用订单状态判断所有权限
- 时间统一使用明确时区/UTC 存储策略，具体实现时冻结

## 2. 建议核心实体

### users

建议字段：
- id
- email / auth_provider_id
- locale
- created_at
- updated_at

### birth_profiles

一位用户未来可能有多个命盘，但 V1 可以先围绕本人主命盘设计。

建议字段：
- id
- user_id
- display_name (optional)
- birth_date
- birth_time
- birth_place_text
- latitude / longitude (optional, if required)
- timezone
- gender (if calculation requires)
- input_precision / unknown_time flag
- created_at
- updated_at

### bazi_charts

建议字段：
- id
- birth_profile_id
- calculation_version
- year_pillar
- month_pillar
- day_pillar
- hour_pillar
- structured_chart_json
- created_at

`structured_chart_json` 可保存十神、五行、藏干、大运等结构化派生结果，但核心高频字段可在实际查询需求明确后拆列。

### reports

建议字段：
- id
- user_id
- chart_id
- report_type (`free` / `full`)
- report_schema_version
- prompt_version
- model_id
- content_json / content_text
- status
- created_at
- updated_at

### entitlements

建议字段：
- id
- user_id
- entitlement_type (`full_report` / `advisor_credits`)
- source_order_id
- quantity_granted
- quantity_remaining
- status
- created_at
- expires_at (nullable)

### advisor_conversations

建议字段：
- id
- user_id
- chart_id
- report_id (nullable)
- status
- created_at
- updated_at

### advisor_messages

建议字段：
- id
- conversation_id
- role
- content
- prompt_version (for assistant generations)
- model_id
- credit_cost
- created_at

### orders

建议字段：
- id
- user_id
- product_type
- amount
- currency
- provider
- provider_order_id
- status
- created_at
- paid_at

### payment_events

用于支付 Webhook 幂等与审计。

建议字段：
- id
- provider
- provider_event_id (unique)
- event_type
- payload_json
- processed_at
- created_at

## 3. 关键约束

- `provider_event_id` 应唯一，防止 Webhook 重复处理
- 顾问次数扣减应具备事务/原子性保障
- Full Report 权益应能明确绑定用户及对应产品/报告
- AI 输出应可追溯 prompt/model/version
- 不在客户端可信任地维护剩余次数

## 4. 隐私与安全

出生时间、地点属于个人数据。实现时应：
- 最小化采集
- 不把不必要的个人数据发送给第三方模型
- Secret 永不入库明文提交 GitHub
- 生产数据库访问使用最小权限

## 5. 待实现时确认

- 数据库供应商：TBD
- ORM：TBD
- Auth 与 users 的映射：TBD
- 匿名免费测试是否落库：TBD
- 数据删除/导出策略：TBD
- 顾问会话保留期限：TBD

最后更新：2026-08-17
