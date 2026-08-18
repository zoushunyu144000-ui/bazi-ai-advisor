# 08 — Decision Log

本文件记录已经做出的重要产品、商业、技术和设计决定，以及决定原因。不要删除历史决定；如有变化，新增一条 Superseded 决策并指向新决定。

---

## D-001 — V1 只开发八字

日期：2026-08-17
状态：Approved

### 决定

第一版产品只做八字。

暂不加入：
- 奇门
- 紫微斗数
- 塔罗
- 面相
- 手相
- 风水
- 社区
- 真人大师平台

### 原因

第一阶段目标是尽快验证商业闭环，而不是构建大而全的命理平台。减少范围有助于更快上线、测试转化和迭代。

---

## D-002 — V1 基础付费漏斗

日期：2026-08-17
状态：Approved at product concept level

### 决定

商业路径：

免费测试
→ ¥9.9 等值价格解锁完整人格报告
→ ¥29.9 等值价格购买 10 次 AI 顾问

### 目标

逐步达到月收入人民币 10,000 元以上。

### 说明

具体海外币种价格、支付供应商、税费与促销策略仍待确认。

---

## D-003 — GitHub 作为长期项目记忆与事实来源

日期：2026-08-17
状态：Approved

### 决定

不依赖单个 ChatGPT 窗口长期保存项目关键事实。

采用三层模式：

1. GitHub：长期项目记忆、代码和事实来源
2. ChatGPT Project：协作工作空间与跨窗口辅助上下文
3. 单个 Chat：临时讨论、分析、执行和 Debug

### 原因

聊天上下文存在长度限制、压缩和多窗口漂移风险。重要蓝图、规则、架构、设计、决策和状态必须版本化并可重新读取。

---

## D-004 — AI 任务开始前读取项目记忆，完成后回写

日期：2026-08-17
状态：Approved

### 决定

所有 AI 工程窗口必须遵守根目录 `AGENTS.md`：

开始前读取项目索引、当前状态与相关专题文档；完成后更新 Current State、Decision Log 和必要的专题文档。

### 原因

保证任意新窗口都能接班，避免信息只存在于被压缩的聊天上下文中。

---

## D-005 — 排盘计算与 LLM 解释分离

日期：2026-08-17
状态：Architecture Principle

### 决定

四柱、历法与核心排盘数据使用确定性代码/可靠算法得到；LLM 负责解释、组织报告和顾问回答。

### 原因

避免模型幻觉导致基础命盘错误，并允许计算结果测试、复现与版本化。

---

## D-006 — V1 Foundation 技术栈

日期：2026-08-17
状态：Approved / Implemented in PR #1

### 决定

V1 Foundation 采用：

- Next.js + TypeScript + App Router
- Tailwind CSS + shadcn/ui 基础配置
- PostgreSQL / Supabase
- Supabase Auth
- Vercel 作为部署目标
- Vercel AI SDK + 可替换 Provider / Gateway 边界
- PostHog 作为 Analytics 预留

具体 package versions 以 `package.json` 为准；外部 Supabase/Vercel/Payment/AI Provider 尚未因为本决策而自动连接。

### 原因

该组合满足单体 MVP 快速交付，同时保留确定性八字 Engine、AI Provider、支付与分析层的清晰边界。

### 影响

后续窗口应优先复用当前基础目录与 Contracts，不另起不兼容的平行架构。

---

## D-007 — 生成型数据统一版本字段

日期：2026-08-17
状态：Approved / Implemented in foundation contracts

### 决定

跨 Engine、Interpretation、Report 与 AI 层统一使用：

- `engine_version`
- `rule_profile_version`
- `mapping_version`
- `prompt_version`
- `report_schema_version`

### 原因

保证历史结果可复现、映射规则与 Prompt 可回滚、报告 schema 可迁移，并支持后续灰度/A-B 实验。

### 影响

后续生成 chart / derived features / report 的窗口不得静默移除这些版本信息；若版本语义变化，应新增 Decision Log 并协调 `types/domain/`。

---

## D-008 — Foundation 合并后统一以最新 main 作为 Wave 1 开发基线

日期：2026-08-18
状态：Approved / Active

### 决定

Foundation PR #1 已正式合并 `main`。

核实基线：

- Foundation branch：`foundation/mvp-v1`
- Foundation HEAD：`ee37eba0c65a70da13365bbe354954457df2819c`
- Merge Commit：`f3b0fc9e0590b016d242031ffbcb00c5f7617306`
- Foundation CI：通过

自此项目进入 **Wave 1 并行开发**。

所有后续开发窗口必须：

1. 先同步最新 `main`。
2. 从最新 `main` 创建各自独立的 `feature/*` branch。
3. 不再从旧的 `foundation/mvp-v1` 分支开始新功能开发。
4. 并行开发时继续遵守 `AGENTS.md`、共享 Domain Contracts 与项目记忆回写规则。

### 原因

Foundation 已成为正式主线的一部分。统一从最新 `main` 分叉可以保证所有并行窗口共享同一工程地基，减少因旧基线、重复实现或 Contract 漂移导致的冲突。

### 影响

- `foundation/mvp-v1` 转为已完成 Foundation 的历史分支/参考分支。
- `main` 成为 Wave 1 所有新 feature branch 的唯一统一开发基线。
- Wave 1 只表示开发阶段切换，不改变 D-001 的 V1 产品范围。
- 具体 Wave 1 任务由 00 号总调度 / 用户分配，本决策不擅自新增业务功能。

---

## D-009 — 跨窗口转发消息统一使用代码块

日期：2026-08-18
状态：Approved / Active

### 决定

凡需要用户把一段消息复制并转发给另一个 GPT、Codex 或项目窗口时，AI 必须把完整可转发正文放进独立 Markdown 代码块中。

若需要分别转发给多个窗口，则每个窗口使用独立代码块，并在代码块外标明目标窗口。

代码块外可以有简短解释，但真正需要复制转发的正文不得拆散在普通段落中。

### 原因

用户主要通过 ChatGPT 网页端 / App 管理多窗口项目。代码块可以提供更稳定的一键复制体验，减少移动端选中文字、漏复制、格式破坏和人工重新整理。

### 影响

- 适用于跨窗口 Handoff、任务分发、状态汇报、要求某窗口执行的提示词、需要用户转交的技术说明等。
- `AGENTS.md` 与 `docs/11_CHATGPT_PROJECT_INSTRUCTIONS.md` 同步写入此规则。
- 本规则属于项目协作格式规范，不改变业务、技术架构或产品范围。

---

## D-010 — 02 是 canonical BaziDerivedFeatures 唯一传统命理事实来源

日期：2026-08-18
状态：Approved / Active

### 决定

02 Bazi Engine 负责：

```text
BirthProfile
→ BaziChart
→ canonical BaziDerivedFeatures
```

以下事实不得由 04 Interpretation 再建立第二套计算：

- 五行分布
- 十神分布
- 日主强弱
- 季节结构

`WeightedElementScore.score` 与 `WeightedTenGodScore.score` 统一为 **0–100 percentage scale**；完整分布在浮点舍入容差内应合计约 100。

`confidence` 继续使用 0–1，二者语义不得混淆。

04 可以计算 Interpretation-only signals，例如 element balance、ten-god concentration、visible yang ratio、personality contributors，但这些不属于第二套 `BaziDerivedFeatures`。

### 原因

Wave 1 检查发现 02 与 04 同时独立计算传统命理事实，而且 score scale 分别出现 0–1 与 0–100。若不收敛，会导致同一用户在不同层得到互相矛盾的基础数据。

### 影响

- 02 必须把当前 element/Ten-God distribution 从 0–1 fraction 改为 0–100 percentage。
- 04 必须消费 02 的 canonical `BaziDerivedFeatures`，删除/停用重复传统事实推导。
- 数据库只保存 canonical 02 facts，不持久化第二套 Interpretation 命理事实。

---

## D-011 — Birth 已解析 UTC instant 是 DST overlap 的下游 source of truth

日期：2026-08-18
状态：Approved / Active

### 决定

共享 `BirthProfile` 增加：

- `resolvedBirthInstant?: ISODateTime`
- `utcOffsetMinutesAtBirth?: number`

03 Birth 一旦完成 DST overlap disambiguation，应写入这两个字段。

02 收到 `resolvedBirthInstant` 后必须直接使用它，不能再次对 ambiguous civil time 自行选择 earlier/later occurrence。

08 必须把两字段持久化并完整读取。

### 原因

Wave 1 检查发现 03 已经能解析 overlap 并得到 resolved instant / offset，但 shared BirthProfile 无法保存结果；02 因而会再次解析，并默认 earlier occurrence，可能改变用户已经确认的实际出生 instant。

### 影响

- `resolvedBirthInstant` 是下游 deterministic calculation 的 canonical instant。
- `utcOffsetMinutesAtBirth` 作为 occurrence 与审计辅助信息。
- unknown birth time / legacy records 允许字段缺失。

---

## D-012 — Shared Bazi calculation context 必须可完整持久化与读回

日期：2026-08-18
状态：Approved / Active

### 决定

把以下类型提升到 shared Domain：

- `BaziRelation`
- `BaziLuckStructure`
- `BaziCalculationContext`
- `BaziCalculationResult`

定义：

```text
BaziCalculationContext
= BaziChart
+ BaziCalculationMetadata
+ BaziRelation[]
+ BaziLuckStructure

BaziCalculationResult
= BaziCalculationContext
+ BaziDerivedFeatures
```

`BaziChart` 保持纯命盘结构。

08 必须保证保存路径和读取路径对称：metadata、relations、luck 不能“保存了但标准 API 读不回来”。

### 原因

Tier 3 AI Advisor 后续需要重载干支关系、大运方向、起运年龄、大运周期和 calculation metadata。模块本地类型会在 02 → 08 → 07 链路中丢失。

### 影响

- 02 删除或别名化 module-local relation/luck/result 类型，改用 shared Contract。
- 08 为 `bazi_charts` 增加 relations / luck persistence，并提供 calculation context/result read path。
- 07 后续只消费共享 result/context，不自己重算命理上下文。

---

## D-013 — Root npm test 聚合所有 Wave 1 模块测试

日期：2026-08-18
状态：Approved / Active

### 决定

Root 测试入口统一：

- `npm run test:birth`
- `npm run test:bazi`
- `npm run test:interpretation`
- `npm run test:backend`
- `npm test`：顺序执行以上全部测试

CI 必须在 typecheck 后、build 前运行 `npm test`。

各业务 feature PR 不得再把 root `test` 覆盖为只运行自己的测试套件。

在 Wave 1 分支逐个整合期间，尚不存在的 `tests/<module>` 目录可以被 shared runner 明确 skip；目录一旦存在却没有可执行测试则 hard fail。

### 原因

PR #4、#5、#6 分别把同一个 root `npm test` 改成自己的模块测试，PR #3 则没有接入 root test。按任意顺序合并都会覆盖其他模块测试入口。

### 影响

所有 Wave 1 工程 PR 在最终 merge 前必须 rebase/merge 最新 integration baseline，并保留统一 root scripts。

---

## D-014 — V1 暂不扩大 shared PersonalityDimension

日期：2026-08-18
状态：Approved / Active

### 决定

共享 `PersonalityDimension` V1 继续保持现有核心字段：

- `key`
- `label`
- `score`
- `confidence`
- `evidenceKeys`

04 提议的：

- contributors
- positiveExpression
- stressExpression
- explanationCodes

暂时保留在 Interpretation module-local `dimensionDetails`，本轮不提升到 shared Contract。

### 原因

当前持久化与跨模块消费并未证明必须扩大公共 API。过早提升会增加 Report / DB / UI 的耦合面。

### 影响

若后续 Report 或数据库 first-class persistence 明确需要这些字段，再新增 Contract change 与 Decision Log；不得在单一窗口静默扩展共享 `PersonalityDimension`。

---

## D-015 — Research Before Build / Reuse First

日期：2026-08-18
状态：Approved / Active

### 决定

从现在开始，所有重要工程模块和重要依赖选型必须执行 **Research Before Build / Reuse First**。

固定优先级：

```text
成熟可靠库直接复用
>
Adapter 封装成熟实现
>
参考成熟实现补齐少量业务逻辑
>
最后才自行从零实现
```

开发前至少调查并记录：

- GitHub 成熟开源实现
- npm 成熟库
- 可复用 API / MCP / skill / 平台能力
- License 与商业使用兼容性
- 当前维护状态 / 最近 release / commit / security
- 测试、文档、边界规则
- Adapter 接入可能性
- 风险与替代方案

禁止为了“代码归自己”而无研究依据重复实现已有成熟能力，尤其包括：历法、节气、干支、时区/DST 数据与基础转换、基础排盘、常见 UI primitives、认证、数据库基础能力。

所有重要外部依赖与参考项目统一登记到 `docs/12_REUSE_AND_REFERENCES.md`。聊天窗口不得仅凭记忆选择依赖；每次重要依赖决策必须重新检查官方来源。

### 原因

多窗口并行开发容易出现重复造轮子、同一基础事实由多个模块重复实现、依赖选型缺少 License/维护状态核查等问题。成熟基础能力通过 Adapter 复用，可以降低算法错误、维护成本和跨模块漂移，同时保留 Domain Contract 与产品规则的自主控制。

### 影响

- `AGENTS.md` 把 Reuse First 升级为所有工程窗口的强制工作协议。
- `docs/04_TECH_ARCHITECTURE.md` 明确“deterministic 不等于从零手写”，第三方能力优先经 Adapter 隔离。
- 新建 `docs/12_REUSE_AND_REFERENCES.md` 作为依赖/参考选型长期 source of truth。
- 原 `docs/12_WAVE1_CONTRACT_INTEGRATION.md` 顺延为 `docs/13_WAVE1_CONTRACT_INTEGRATION.md`。
- PR #4/#5 当前自研 DST overlap/gap 逻辑在最终 Merge Gate 前必须补一次 Reuse First 复核；能由成熟平台/库承担的 timezone database 与基础转换不得继续自行维护。
- PR #5 的 `tyme4ts` 继续只允许通过 Adapter 接入，并保留 golden-vector/rule-profile 验证；不得把第三方类型泄漏到 shared Domain。
- Auth / Database / UI primitives 继续优先复用已批准的 Supabase / PostgreSQL / shadcn/ui 等成熟能力。

---

## 决策模板

复制以下结构新增决策：

```md
## D-XXX — 决策标题

日期：YYYY-MM-DD
状态：Proposed / Approved / Superseded / Rejected

### 决定
...

### 原因
...

### 影响
...
```

最后更新：2026-08-18