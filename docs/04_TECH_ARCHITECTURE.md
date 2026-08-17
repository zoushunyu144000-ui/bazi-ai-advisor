# 04 — Technical Architecture

状态：Foundation v1 已实现于 `foundation/mvp-v1` / PR #1，尚未合并到 `main`。

## 1. 架构目标

V1 技术架构优先级：

1. 尽快跑通完整商业闭环
2. 可维护、可观测、可回滚
3. AI Prompt / 报告 / 权益均可版本化
4. 支持后续海外用户、多币种和扩容
5. 不为了未来假设过度工程化

## 2. 当前工程基线

实际代码以 `package.json` 与仓库配置为准：

- Web：Next.js `16.2.11`
- React：`19.2.6`
- TypeScript：`^5.8.0`，strict mode
- Routing：Next.js App Router
- CSS：Tailwind CSS `^4.1.0`
- UI 基线：shadcn/ui 配置文件 `components.json` + `lib/utils.ts`
- Database：PostgreSQL / Supabase 作为 V1 目标数据库
- Auth：Supabase Auth 作为 V1 目标认证方案
- AI：Vercel AI SDK `^6.0.0`，通过 provider / gateway adapter 保持模型可替换
- Deployment：Vercel；**当前尚未绑定本仓库的正式 Vercel Project，也未执行 Production 部署**
- Analytics：PostHog 环境变量已预留，尚未接入

Supabase、支付、AI Provider、PostHog 当前均只完成工程接口/环境变量预留，不代表已经连接真实服务。

## 3. 目录与逻辑模块

```text
app/                 App Router 与基础 route shell
modules/
  bazi/              确定性排盘边界
  interpretation/    结构化解释边界
  ai/                provider / gateway 适配边界
  billing/           订单、权益、钱包、顾问次数
  poster/            分享海报预留
  analytics/         产品分析边界
lib/                 通用工具
db/                  PostgreSQL / Supabase schema
types/domain/        跨窗口共享 Domain Contracts
tests/fixtures/      共享虚构 fixtures
```

## 4. 核心数据流

```text
BirthProfile
  ↓
Deterministic Bazi Engine
  ↓
BaziChart + BaziCalculationMetadata
  ↓
BaziDerivedFeatures
  ↓
Interpretation Engine
  ↓
PersonalityProfile / Report
  ↓
AI Advisor
```

### 确定性计算 vs AI 生成

必须分离：

- 四柱、历法与核心排盘：确定性代码 / 可测试算法
- 语言解释、报告组织、顾问建议：LLM / 规则结合

禁止把原始出生日期/时间直接交给 LLM，让模型自由生成四柱作为真实命盘。

## 5. 共享 Contract 与版本化

`types/domain/` 是模块间与多窗口间的公共接口，禁止用 `any` 绕过边界。

生成型数据统一预留以下版本字段：

- `engine_version`
- `rule_profile_version`
- `mapping_version`
- `prompt_version`
- `report_schema_version`

目的：历史结果可复现、规则可灰度升级、报告可追溯、Prompt 可回滚。

## 6. 权益与支付边界

- 付费权限必须由服务端 / 数据库校验，不只靠前端隐藏组件。
- 金额使用整数 minor units。
- AI 顾问次数使用整数 wallet + credit ledger。
- 顾问扣减、支付回调与账本写入必须支持幂等/事务策略。
- 当前 foundation 不接真实支付。

## 7. 环境

至少区分：

- Local
- Preview
- Production

Secret 只放环境变量 / Secret Store，不提交 Git。`.env.example` 仅列变量名。

## 8. 基础页面

已建立仅用于开发衔接的 route shell：

- `/`
- `/birth`
- `/result`
- `/report`
- `/advisor`
- `/account`

这些不是最终视觉设计，也不代表业务功能已完成。

## 9. 尚未实现 / 待后续窗口确认

- 完整八字算法及历法库选择
- 人格映射规则
- Supabase 实例连接与 migration 执行
- 真实 Supabase Auth 流程
- Payment provider
- AI Provider / model 与 Prompt
- PostHog 实际接入
- Vercel Project 绑定与 Preview / Production 策略落地
- Email provider
- Localization 完整架构

最后更新：2026-08-17
