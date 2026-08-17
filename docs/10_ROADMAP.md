# 10 — Roadmap

状态：Initial V1 Roadmap

## Phase 0 — 项目记忆与工程治理

目标：保证多 GPT 窗口长期协作不会因上下文压缩而失控。

状态：**已建立基础体系，持续维护。**

包含：
- 项目索引
- 总蓝图
- 产品规格
- 设计系统
- 技术架构
- 数据库模型
- AI 系统
- 商业规则
- 决策日志
- 当前状态
- AI 工作协议
- Handoff 模板

## Phase 1 — Web 基础工程

目标：形成可部署、可迭代的基础网站。

状态：**Foundation 工程与依赖级验收已完成；PR #1 已 Ready for review，等待合并 `main`。**

Foundation 已完成：

- Next.js / TypeScript / App Router 初始化
- Tailwind CSS 与 shadcn/ui 基础配置
- 基础页面 route shell
- 模块目录边界
- `.env.example`
- Domain Contracts 与版本字段
- PostgreSQL / Supabase foundation schema
- 共享 mock fixtures
- README / AGENTS / CI workflow
- `package-lock.json` 生成并提交
- CI 改为 `npm ci` 锁定依赖安装
- `npm run lint` 通过
- `npm run typecheck` 通过
- `npm run build` 通过

Foundation 合并后仍属于后续 Web / 部署工作的事项：

- Vercel Preview project 独立绑定本仓库
- 基础 error boundary / loading strategy

**不得把本仓库连接或部署覆盖到任何其他既有 Vercel 项目。**

## Phase 2 — 免费八字测试闭环

目标：用户可输入出生信息并得到正确、可理解的免费结果。

任务：
- 出生信息表单
- 时区/地点策略
- 八字确定性排盘
- 结构化命盘数据
- 免费报告生成
- 免费结果页
- 基础 QA 测试样本

关键验收：排盘必须可复现，不由 LLM 自行猜测四柱。

## Phase 3 — 完整人格报告付费闭环

目标：实现第一笔可真实交付的付费产品。

任务：
- 用户/身份方案落地
- Supabase database/migrations
- Full Report Schema
- Prompt v1
- 支付供应商
- 订单/Webhook 幂等审计
- Full Report entitlement
- 锁定/解锁 UI
- 支付成功/失败恢复流程

商业基准：¥9.9 等值价格。

## Phase 4 — AI 顾问 10 次包

目标：完成第二层付费产品。

任务：
- Advisor UI
- 命盘/报告上下文注入
- 次数权益
- 原子扣减
- 模型错误补偿
- 对话历史
- AI 安全边界
- 复购入口

商业基准：¥29.9 等值价格 / 10 次。

## Phase 5 — 数据与转化优化

目标：从“能卖”进入“提高转化”。

任务：
- Analytics
- 漏斗事件
- 首页 CTA 测试
- 免费报告内容比例实验
- 价格/展示实验
- 支付失败分析
- 顾问使用与复购分析

## Phase 6 — V1 稳定上线

目标：确保真实用户可稳定完成全链路。

验收：
- Mobile / Desktop
- 多语言/本地化基础（如 V1 需要）
- 支付回调稳定
- 权限无绕过
- 报告生成失败可恢复
- 顾问次数准确
- 基础隐私与条款页面
- 错误监控

## V1 之后

在商业漏斗得到数据验证之前，不提前承诺开发紫微、奇门、塔罗、社区或真人大师平台。

新增品类必须通过新的 Decision Log 决策进入 Roadmap。

最后更新：2026-08-18
