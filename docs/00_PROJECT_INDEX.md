# 八字 AI Advisor — Project Index

这是本项目所有 AI 窗口与工程代理的统一入口。

## 项目一句话定位

面向海外华人年轻用户的商业化 AI 八字网站，通过低门槛免费体验完成首次转化，再通过完整人格报告与 AI 顾问服务实现付费。

## V1 商业漏斗

免费测试
→ ¥9.9 等值价格解锁完整人格报告
→ ¥29.9 等值价格购买 10 次 AI 顾问
→ 第一阶段目标：逐步达到月收入人民币 10,000 元以上

## V1 范围

只做：八字。

暂不加入：

- 奇门
- 紫微斗数
- 塔罗
- 面相
- 手相
- 风水
- 社区
- 真人大师平台

## 核心项目记忆

- `01_MASTER_BLUEPRINT.md`：项目总蓝图与稳定原则
- `02_PRODUCT_SPEC.md`：产品需求、页面与核心用户流程
- `03_DESIGN_SYSTEM.md`：品牌、UI/UX 与视觉约束
- `04_TECH_ARCHITECTURE.md`：技术架构、服务边界、Reuse First 与部署原则
- `05_DATABASE_SCHEMA.md`：数据模型与数据库约定
- `06_AI_SYSTEM.md`：AI 八字报告与顾问系统设计
- `07_BUSINESS_RULES.md`：价格、权益、付费与商业规则
- `08_DECISION_LOG.md`：重要决定、原因与状态
- `09_CURRENT_STATE.md`：项目当前真实状态
- `10_ROADMAP.md`：阶段路线图与下一步
- `11_CHATGPT_PROJECT_INSTRUCTIONS.md`：ChatGPT 项目窗口协作规则
- `12_REUSE_AND_REFERENCES.md`：重要外部依赖、开源/API/MCP/skill 研究、License、维护状态、采用方式、风险与替代方案
- `13_WAVE1_CONTRACT_INTEGRATION.md`：Wave 1.5 shared Contract、测试入口、各工程窗口最小返工与 Merge Gate
- `14_BILLING_CONTRACT_INTEGRATION.md`：Wave 2 Payment / entitlement / credits / Advisor reservation Shared Contract 与 implementation handoff
- `HANDOFF_TEMPLATE.md`：跨聊天窗口/阶段交接模板

## AI 工作协议

所有 AI / GPT / Codex 在修改项目之前必须读取根目录 `AGENTS.md`。

重要模块开发或依赖选型前还必须读取 `docs/12_REUSE_AND_REFERENCES.md`，执行 Research Before Build / Reuse First，不得仅凭聊天或模型记忆选择依赖。

Billing / Payment / Advisor credit 相关实现还必须读取 `docs/14_BILLING_CONTRACT_INTEGRATION.md`，不得绕过 server-side authority、transaction 与 idempotency boundaries。

原则：

> Chat 是临时工作内存，GitHub 是长期项目记忆。

重要信息必须回写仓库，不得只存在于聊天记录中。

最后更新：2026-08-18
