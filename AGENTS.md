# AGENTS.md — AI Project Operating Protocol

本文件适用于所有参与本仓库工作的 AI / GPT / Codex / 自动化工程代理。

## 1. 唯一事实来源

聊天记录不是项目最终事实来源。GitHub 仓库中的代码与 `/docs` 项目记忆文件才是长期事实来源。

任何任务开始前，必须先读取：

1. `docs/00_PROJECT_INDEX.md`
2. `docs/09_CURRENT_STATE.md`
3. 与当前任务相关的专题文档
4. 若涉及已有决策，读取 `docs/08_DECISION_LOG.md`

不得仅凭聊天历史推测项目当前状态。

## 2. 冲突优先级

发生信息冲突时，按以下顺序处理：

1. 用户在当前对话中的最新明确指令
2. 仓库中的当前代码与配置
3. `/docs` 中状态为 Approved / Active 的当前文档
4. 历史聊天记录

发现冲突时，不要静默覆盖；应在相关文档中同步更正。

## 3. 任务完成后的强制回写

任何产生项目状态变化的任务完成后，必须检查是否需要更新：

- `docs/09_CURRENT_STATE.md`：当前完成度、正在进行、阻塞项、环境状态
- `docs/08_DECISION_LOG.md`：新增或变更的重要产品/技术/商业决策
- `docs/10_ROADMAP.md`：里程碑与下一步
- 对应专题文档：产品、设计、架构、数据库、AI、商业规则

重要信息不得只留在聊天窗口中。

## 4. 不得擅自改变的范围

在没有用户新明确指令或 Approved 决策前，不得擅自扩大 V1 产品范围。

当前 V1 聚焦：八字。

暂不加入：奇门、紫微斗数、塔罗、面相、手相、风水、社区、真人大师平台。

## 5. Handoff

跨窗口或阶段交接时，使用 `docs/HANDOFF_TEMPLATE.md`。

每次交接至少包含：

- 已完成
- 修改文件
- 当前状态
- 重要决策
- 遗留问题
- 下一步
- 不应破坏的既有约束

## 6. 文档更新原则

- 稳定方向写入 Blueprint / Architecture / Design System。
- 可变状态写入 Current State / Roadmap。
- 决策及原因写入 Decision Log。
- 不确定信息明确标注 `TBD`，禁止把猜测写成既定事实。
- 文档与代码不一致时，优先核查真实代码并同步修正文档。

## 7. 工程安全边界

- 本仓库只用于 **Bazi AI Advisor / AI 命理与现代行为指导系统**。
- 严禁修改、复制到、部署覆盖或重新绑定任何名为 `bible-library-complete`、`典外文库`、`Extra-Canonical Library` 或其他圣经/经外文献项目的仓库或 Vercel 项目。
- Feature branch 不得直接部署 Production；Production 只允许从批准后的主线发布。
- Secret 不得提交 Git。

## 8. 架构不变量

1. 原始出生信息必须先进入确定性八字 Engine，再进入解释层。
2. LLM 不得从原始出生日期/时间自由计算四柱；LLM 只处理结构化结果的解释、报告和行为建议。
3. `types/domain/` 是跨窗口共享 API，修改语义前必须明确协调影响面。
4. 生成型数据必须保留版本字段：`engine_version`、`rule_profile_version`、`mapping_version`、`prompt_version`、`report_schema_version`。
5. 金额使用整数 minor units；顾问次数使用整数 ledger，不使用浮点余额。
6. 支付、钱包与账本写入必须在可信服务端执行并具备幂等性。

最后更新：2026-08-17
