# AGENTS.md — AI Project Operating Protocol

本文件适用于所有参与本仓库工作的 AI / GPT / Codex / 自动化工程代理。

## 0. 强制项目执行闭环

所有正式任务必须遵守：

```text
PRODUCT
↓
ROADMAP
↓
CURRENT_STATE
↓
TASK
↓
BUILD
↓
REVIEW
↓
FREEZE
↓
CURRENT_STATE
```

完整规则见：

`docs/21_AI_PROJECT_OPERATING_SYSTEM.md`

不得从聊天里的一个新想法直接跳到 BUILD；不得在一个 Task 中无限横向扩 Scope；任务完成后必须 Review、Freeze，并回写 Current State。

## 1. 唯一事实来源

聊天记录不是项目最终事实来源。GitHub 仓库中的代码与 `/docs` 项目记忆文件才是长期事实来源。

任何任务开始前，必须先读取：

1. `docs/00_PROJECT_INDEX.md`
2. `docs/21_AI_PROJECT_OPERATING_SYSTEM.md`
3. `docs/09_CURRENT_STATE.md`
4. `docs/10_ROADMAP.md`
5. 与当前任务相关的专题文档
6. 若涉及已有决策，读取 `docs/08_DECISION_LOG.md`
7. 若涉及新依赖、外部项目、算法库、API、MCP、skill 或重要模块实现，必须读取 `docs/12_REUSE_AND_REFERENCES.md`

不得仅凭聊天历史推测项目当前状态。

## 2. 冲突优先级

发生信息冲突时，按以下顺序处理：

1. 用户在当前对话中的最新明确指令
2. 仓库中的当前代码与配置
3. `/docs` 中状态为 Approved / Active 的当前文档
4. 历史聊天记录

发现冲突时，不要静默覆盖；应在相关文档中同步更正。

## 3. Task Boundary（任务边界）

进入 BUILD 前必须明确：

- Goal：本轮唯一目标
- In Scope：允许修改什么
- Out of Scope：明确不做什么
- Inputs / Source of Truth：必须先读什么
- Deliverables：最终产出什么
- Review Gate：怎样算通过
- Forbidden：禁止顺手修改什么

一个任务可以做深，但不能无限扩张。

发现不阻塞当前任务的新问题时，记录到 Roadmap / backlog，不顺手开发。

## 4. 任务完成后的强制回写

任何产生项目状态变化的任务完成后，必须检查是否需要更新：

- `docs/09_CURRENT_STATE.md`：当前完成度、正在进行、阻塞项、环境状态
- `docs/08_DECISION_LOG.md`：新增或变更的重要产品/技术/商业决策
- `docs/10_ROADMAP.md`：里程碑与下一步
- `docs/12_REUSE_AND_REFERENCES.md`：新增/替换的重要外部依赖、参考项目、API、MCP、skill 与研究结论
- 对应专题文档：产品、设计、架构、数据库、AI、商业规则

重要信息不得只留在聊天窗口中。

## 5. Review / Freeze Gate

代码写完不等于任务完成。

Review 至少检查：

1. 是否超出 Task Scope；
2. 是否符合 Product 与 Roadmap；
3. 是否违反 Architecture / Rule / Shared Contract；
4. 涉及 UI 时是否符合 Design System 与 Mobile First；
5. lint / typecheck / tests / build / browser 或 integration QA 是否按任务需要通过；
6. 文档、PR、Current State 是否需要同步。

Review 未通过：回到 BUILD。

Review 通过后，重要决定与 Contract 才进入 FREEZE。

Freeze 后，后续 Agent 不得仅因为自己偏好不同就推翻；如确需修改，必须新增 Superseded 决策并解释原因。

## 6. 不得擅自改变的范围

在没有用户新明确指令或 Approved 决策前，不得擅自扩大 V1 产品范围。

当前 V1 聚焦：八字。

暂不加入：奇门、紫微斗数、塔罗、面相、手相、风水、社区、真人大师平台。

## 7. Handoff

跨窗口或阶段交接时，使用 `docs/HANDOFF_TEMPLATE.md`。

每次交接至少包含：

- 已完成
- 修改文件
- 当前状态
- 重要决策
- 遗留问题
- 下一步
- 不应破坏的既有约束

## 8. 文档更新原则

- 稳定方向写入 Blueprint / Architecture / Design System。
- 可变状态写入 Current State / Roadmap。
- 决策及原因写入 Decision Log。
- 外部依赖、参考项目及采用证据写入 `docs/12_REUSE_AND_REFERENCES.md`。
- 项目执行方法写入 `docs/21_AI_PROJECT_OPERATING_SYSTEM.md`。
- 不确定信息明确标注 `TBD`，禁止把猜测写成既定事实。
- 文档与代码不一致时，优先核查真实代码并同步修正文档。
- 不额外创建与现有编号文档重复的 `PRODUCT.md / ROADMAP.md / CURRENT_STATE.md / DESIGN_SYSTEM.md / DECISIONS.md`，避免双重 Source of Truth；对应关系以 `docs/21_AI_PROJECT_OPERATING_SYSTEM.md` 为准。

## 9. 工程安全边界

- 本仓库只用于 **Bazi AI Advisor / AI 命理与现代行为指导系统**。
- 严禁修改、复制到、部署覆盖或重新绑定任何名为 `bible-library-complete`、`典外文库`、`Extra-Canonical Library` 或其他圣经/经外文献项目的仓库或 Vercel 项目。
- Feature branch 不得直接部署 Production；Production 只允许从批准后的主线发布。
- Secret 不得提交 Git。

## 10. 架构不变量

1. 原始出生信息必须先进入确定性八字 Engine，再进入解释层。
2. LLM 不得从原始出生日期/时间自由计算四柱；LLM 只处理结构化结果的解释、报告和行为建议。
3. `types/domain/` 是跨窗口共享 API，修改语义前必须明确协调影响面。
4. 生成型数据必须保留版本字段：`engine_version`、`rule_profile_version`、`mapping_version`、`prompt_version`、`report_schema_version`。
5. 金额使用整数 minor units；顾问次数使用整数 ledger，不使用浮点余额。
6. 支付、钱包与账本写入必须在可信服务端执行并具备幂等性。
7. 重要模块遵守 **Research Before Build / Reuse First**，不得为了“代码归自己”而重复实现已有成熟能力。
8. 传统命理判断与现代人格翻译必须分层；Experimental scoring 不得冒充 Traditional Pattern authority。

## 11. 跨窗口转发格式

当 AI 判断某段内容需要由用户复制并转发给另一个 GPT / Codex / 项目窗口时：

1. 必须把**完整可转发内容放在单独的 Markdown 代码块中**。
2. 代码块外可以有一句简短说明，但不得把转发正文拆散到代码块外。
3. 转发内容应尽量做到开箱即用，包含必要的目标窗口、任务、仓库、分支、状态、约束和下一步，不依赖用户重新整理。
4. 如果存在多段分别发给不同窗口的消息，每个目标窗口使用独立代码块，并在代码块外清楚标明发送对象。
5. 用户说“给我转发内容 / 发给某窗口 / 我去复制给它 / 给我提示词去另一个窗口”等语义时，默认应用本规则。

目的：确保移动端和网页端可以一键复制，减少跨窗口传递时的遗漏、格式破坏和人工整理成本。

## 12. Research Before Build / Reuse First

开发任何重要模块、引入新基础能力或替换现有实现之前，必须先做外部复用调查，不得仅凭模型记忆选库。

至少调查并记录：

1. GitHub 是否已有成熟开源实现。
2. npm 是否已有成熟库。
3. 是否存在可复用 API / MCP / skill / 平台能力。
4. License 是否允许本项目的商业使用与分发方式。
5. 项目是否仍活跃维护，最近 release / commit / security 状态是否可接受。
6. 是否有足够测试、文档、边界规则与可验证样例。
7. 是否可以通过 Adapter 接入，避免把第三方数据结构泄漏到 shared Domain。
8. 失败/停更/许可变化时的替代方案是什么。

决策优先级固定为：

```text
成熟可靠库直接复用
>
Adapter 封装成熟实现
>
参考成熟实现补齐少量业务逻辑
>
最后才自行从零实现
```

尤其禁止无研究依据地自行重写已经成熟解决的：

- 历法
- 节气
- 干支
- 时区 / DST 数据与基础转换
- 基础排盘能力
- 常见 UI primitives
- 认证
- 数据库基础能力

如果最终仍决定自研，PR / Handoff 必须写明：调查过哪些方案、为何不适用、License/维护/正确性或产品边界上的具体原因，以及自研部分如何测试。

所有重要外部依赖与参考项目必须登记到 `docs/12_REUSE_AND_REFERENCES.md`，至少包含：名称、URL/Package、用途、License、维护状态、是否采用、采用方式、风险、替代方案、版本、最后核查日期。

**聊天窗口不得仅凭记忆选择依赖。** 每次重要依赖决策必须重新检查官方来源，并把证据落到仓库。

最后更新：2026-08-22
