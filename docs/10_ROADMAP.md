# 10 — Roadmap

状态：V1 Roadmap — Wave 1.5 Contract Integration Active

最后更新：2026-08-18

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

## Phase 1 — Web 基础工程 / Foundation

目标：形成可部署、可迭代的基础网站。

状态：**已完成并正式合并 `main`。**

关键 GitHub 状态：

- Foundation PR：#1
- PR 状态：Merged / Closed
- Foundation branch：`foundation/mvp-v1`
- Foundation HEAD：`ee37eba0c65a70da13365bbe354954457df2819c`
- Merge Commit：`f3b0fc9e0590b016d242031ffbcb00c5f7617306`
- Foundation CI：`npm ci` / lint / typecheck / build 全部通过

Foundation 后仍属于后续 Web / 部署工作的事项：

- Vercel Preview project 独立绑定本仓库
- 基础 error boundary / loading strategy

**不得把本仓库连接或部署覆盖到任何其他既有 Vercel 项目。**

## Wave 1 — Foundation 后并行开发

状态：**第一轮实现已完成，当前开放 PR #2～#6；尚未 merge。**

当前 Wave 1 PR：

- #2 Visual / UX
- #3 Interpretation
- #4 Birth normalization
- #5 Bazi Engine
- #6 Supabase core

第一轮跨 PR 检查发现共享 Contract 与测试入口漂移，因此在任何批量 merge 前插入 Wave 1.5 Integration Gate。

## Wave 1.5 — Contract Integration Gate

状态：**Active**

目标：在 Wave 1 PR 进入主线前，先统一跨模块 API、canonical facts ownership、DST replay、持久化 read path 与 root test contract。

### 已冻结 Contract

1. 02 Bazi Engine 是 canonical `BaziDerivedFeatures` 唯一传统命理事实来源。
2. `WeightedElementScore.score` / `WeightedTenGodScore.score` = 0–100 percentage。
3. `BirthProfile` 保存 `resolvedBirthInstant?` + `utcOffsetMinutesAtBirth?`。
4. shared Domain 提升 `BaziRelation`、`BaziLuckStructure`、`BaziCalculationContext`、`BaziCalculationResult`。
5. 08 必须能够完整保存并读回 calculation metadata / relations / luck。
6. shared `PersonalityDimension` V1 暂不扩大。
7. root `npm test` 必须聚合 Birth / Bazi / Interpretation / Backend 四套测试。
8. CI 必须执行 `npm test`。

### Integration branch

`feature/wave1-contract-integration`

### Merge Gate

在 Contract Integration 合并前：

- 不 merge #2～#6
- 不要求业务窗口各自发明新的 shared Contract

Contract Integration 合并后，各业务 PR 必须同步最新 `main` 并只做必要返工。

### 推荐依赖顺序

```text
Contract Integration
→ #4 Birth
→ #5 Bazi
→ #3 Interpretation
→ #6 Supabase
→ #2 Visual（仅在视觉验收通过后）
```

说明：

- #4 先落地 resolved instant 生产端。
- #5 随后消费 Birth instant 并产出 canonical Bazi facts / result。
- #3 依赖 #5 canonical facts，必须在 #5 后完成最终返工。
- #6 需要最终 Birth + Bazi shared Contract 才能稳定 migration/repository round-trip，因此放在 #4/#5 后；可与 #3 的最终验收并行，但主线 merge 建议在 shared data contract 已稳定后进行。
- #2 不依赖命理 Contract，但它有独立视觉验收门槛，不应因为工程 Contract 通过就自动 merge。

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
