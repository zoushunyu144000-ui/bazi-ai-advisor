# Bazi AI Advisor

面向海外华人年轻用户的商业化 **AI 八字 + 现代行为指导** 产品。第一阶段商业路径是：免费测试 → 低价完整人格报告 → 付费 AI 顾问次数。

> 当前仓库只负责八字 MVP。它与“典外文库 / Extra-Canonical Library / bible-library-complete”等项目完全隔离。

## MVP 范围

第一版只做：

- 出生信息输入与规范化
- 确定性八字排盘 Engine（由后续模块实现）
- Canonical Bazi Schema
- 结构化 Derived Features
- 人格解释与报告
- 报告解锁
- 有次数限制的 AI 顾问
- 账户、订单、余额/次数与基础分析

第一版明确不做：奇门、紫微斗数、塔罗、面相、手相、风水、社区、真人大师平台。

## 核心架构原则

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
PersonalityProfile / Report (Tier 1 / Tier 2 / Tier 3)
  ↓
AI Advisor (structured context only)
```

**LLM 不负责排八字。** 原始出生日期/时间不得直接交给 LLM 让它自由生成命盘。LLM 只负责解释、现代语言转译、报告生成，以及基于结构化命盘和用户记忆提供行为建议。

## 技术栈

- Next.js + TypeScript + App Router
- Tailwind CSS
- shadcn/ui 配置
- PostgreSQL / Supabase
- Supabase Auth
- Vercel
- Vercel AI SDK / 可替换 Provider Adapter
- PostHog（预留）

## 目录结构

```text
app/                 # App Router 与基础页面壳
modules/
  bazi/              # 确定性排盘边界
  interpretation/    # 结构化解释边界
  ai/                # AI provider / gateway 适配边界
  billing/           # 报告、顾问次数、订单、账本
  poster/            # 分享海报预留
  analytics/         # 产品分析事件
lib/                 # 通用工具
db/                  # PostgreSQL / Supabase schema
types/domain/        # 跨窗口共享 Domain Contracts
tests/fixtures/      # UI/模块共享 mock fixtures
```

## Domain Contracts

`types/domain/` 是多个开发窗口共同工作的公共接口。当前基础合同包括：

- `BirthProfile`
- `BaziChart`
- `BaziCalculationMetadata`
- `BaziDerivedFeatures`
- `PersonalityProfile`
- `Report`
- `Conversation` / `ConversationMessage`
- `UserMemory`
- `Wallet`
- `CreditLedgerEntry`
- `Order`
- `AnalyticsEvent`

禁止用 `any` 绕过这些边界。需要扩展时优先新增字段或新版本，而不是静默改变已有语义。

## 版本字段规范

生成型数据必须记录适用的版本：

- `engine_version`
- `rule_profile_version`
- `mapping_version`
- `prompt_version`
- `report_schema_version`

这些字段用于复现历史结果、灰度升级、回滚、A/B 测试与客服排查。不要用“当前最新规则”覆盖历史记录。

## 数据库

第一版 schema 位于 `db/schema.sql`。Supabase 的 `auth.users` 负责认证身份；`public.users` 是应用层用户根记录，并与 `auth.users(id)` 一对一关联。支付金额统一使用**整数 minor units**，顾问次数使用**整数 credit ledger**，禁止浮点余额。

数据库当前只建立地基，不代表已经连接真实 Supabase 项目。

## 环境变量

复制模板：

```bash
cp .env.example .env.local
```

`.env.example` 仅包含变量名。真实 secret 只放在本地、Supabase 或 Vercel Environment Variables 中，禁止提交 Git。

## 本地启动

需要 Node.js 22+ 与 npm。

```bash
npm install
npm run dev
```

验证：

```bash
npm run lint
npm run typecheck
npm run build
```

## 分支协作规则

- `main`：可部署主线，不直接开发。
- `foundation/*`：架构、Contracts、Schema、基础设施。
- `feature/*`：独立业务功能。
- `fix/*`：缺陷修复。
- 每个窗口只在自己的 feature branch 工作，通过 PR 合并。
- 改动 `types/domain/`、`db/schema.sql`、核心版本字段语义时，必须在 PR 描述中明确指出影响面。
- 不在一个 PR 中混入无关大规模 UI、美术、算法或支付实现。

## 部署原则

- Feature branch 只允许 Preview / CI 验证。
- Production 只从 `main` 发布，并需要人工确认。
- 不把本仓库连接到其他现有 Vercel 项目，尤其不得连接或覆盖 `bible-library-complete`。
- 当前 foundation 不执行 production 部署。

## 当前实现边界

已实现：确定性 Birth → Bazi → Interpretation 免费链路、十个固定 Public Personality、十张 V2 正式 IP、City Observation Editorial 完整公网旅程与分享卡。

仍未实现或未完成 Authority Cutover：

- `ziping-v1.0.0` TraditionalPatternResult 全量规则与 production authority cutover
- 真实 AI Provider / Prompt / Advisor 会话服务
- 支付 Provider、订单与顾问次数账本
- 真实 Supabase Auth / 云端档案同步

对应页面会显示 preview、not-configured 或 local-only，不伪造在线服务。

这些应由后续独立窗口在共享 Contracts 与 Schema 基础上实现。
