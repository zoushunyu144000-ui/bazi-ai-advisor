# 04 — Technical Architecture

状态：Draft。任何未确认技术选型均保持 TBD。

## 1. 架构目标

V1 技术架构优先级：

1. 尽快跑通完整商业闭环
2. 可维护、可观测、可回滚
3. AI Prompt / 报告 / 权益均可版本化
4. 支持后续海外用户、多币种和扩容
5. 不为了未来假设过度工程化

## 2. 当前已知工程环境

- GitHub repository：`zoushunyu144000-ui/bazi-ai-advisor`
- 默认分支：`main`
- Vercel：计划用于网站部署/预览；具体项目连接状态需由部署窗口确认并写回 Current State

## 3. 建议逻辑模块

### Web App
负责：
- Landing / 表单 / 报告 / 顾问 UI
- Auth 状态
- API 调用
- 支付跳转/结果页

框架与具体版本：TBD，实际初始化代码一旦落库，以代码为准并更新本文件。

### Bazi Engine
负责：
- 出生信息标准化
- 时区/地点处理
- 四柱排盘
- 十神、五行、旺衰等结构化派生数据
- 大运/流年计算

原则：排盘计算与自然语言解释分离。

### Report Service
负责：
- 将结构化命盘转为可追踪、可缓存的报告输入
- 调用 AI 生成报告
- 保存报告版本
- 控制免费/付费章节权益

### AI Advisor
负责：
- 获取用户命盘上下文
- 获取已生成报告摘要/章节
- 管理问答次数
- 调用 LLM
- 保存对话所需数据

### Auth / User
供应商：TBD。

### Database
供应商：TBD。逻辑模型见 `05_DATABASE_SCHEMA.md`。

### Payment
供应商：TBD。业务规则见 `07_BUSINESS_RULES.md`。

## 4. 关键架构边界

### 确定性计算 vs AI 生成

必须分离：

- 八字排盘与历法计算：确定性代码/可靠算法
- 对命盘的语言解释：AI / 规则结合

禁止让 LLM 自行“猜”四柱作为唯一排盘来源。

### 权益控制

付费权限必须由服务端/数据库校验，不得只靠前端隐藏组件。

### AI 次数扣减

顾问次数扣减必须可追踪，并防止重复扣减。具体事务方案在数据库/后端实现时冻结。

## 5. 环境建议

至少区分：
- Local
- Preview
- Production

敏感信息只放环境变量/Secret，不提交到 GitHub。

## 6. 版本化要求

以下内容建议有版本字段：
- Bazi calculation version
- Report prompt version
- Report schema version
- Advisor system prompt version
- Pricing / entitlement version（如后续需要）

这样历史用户报告可以追溯生成逻辑。

## 7. 待确认

- 前端框架及版本
- Auth
- Database
- Payment provider
- Bazi calculation library/implementation
- LLM provider/model
- Observability / analytics
- Email provider
- Localization architecture

最后更新：2026-08-17
