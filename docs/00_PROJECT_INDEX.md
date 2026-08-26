# 八字 AI Advisor — Project Index

这是本项目所有 AI 窗口与工程代理的统一入口。

## 项目一句话定位

面向海外华人年轻用户的商业化八字人格产品：以确定性的传统八字判断为底层，把传统结构翻译成现代人格语言，通过免费人格体验与分享传播获取用户，并在后续提供专业报告与 AI 顾问服务。

## V1 产品路径

```text
Homepage
→ Birth
→ deterministic Bazi calculation
→ Traditional Structure / Pattern judgment
→ evidence-backed Public Personality translation
→ fixed Character IP
→ full Personality Dossier
→ Share Card
→ friend opens website and tests
```

付费专业报告 / AI Advisor 属于后续商业层，当前不作为 V1 Release P0 blocker。

## V1 范围

只做：八字。

暂不加入：奇门、紫微斗数、塔罗、面相、手相、风水、社区、真人大师平台。

## 核心项目记忆

- `01_MASTER_BLUEPRINT.md`：项目总蓝图与稳定原则
- `02_PRODUCT_SPEC.md`：早期产品需求；与较新冻结文档冲突时以后者为准
- `03_DESIGN_SYSTEM.md`：品牌、UI/UX 与视觉约束
- `04_TECH_ARCHITECTURE.md`：技术架构、服务边界、Reuse First 与部署原则
- `05_DATABASE_SCHEMA.md`：数据模型与数据库约定
- `06_AI_SYSTEM.md`：AI 八字报告与顾问系统设计
- `07_BUSINESS_RULES.md`：价格、权益、付费与商业规则
- `08_DECISION_LOG.md`：重要决定、原因与状态
- `09_CURRENT_STATE.md`：项目当前真实状态
- `10_ROADMAP.md`：阶段路线图与下一步
- `11_CHATGPT_PROJECT_INSTRUCTIONS.md`：ChatGPT 项目窗口协作规则
- `12_REUSE_AND_REFERENCES.md`：外部依赖 / 开源 / API / MCP / skill 研究记录
- `13_PERSONALITY_IP_BIBLE.md`：Public Personality / Character IP 产品 Source of Truth
- `14_BILLING_CONTRACT_INTEGRATION.md`：Payment / entitlement / credits / Advisor Shared Contract
- `15_CHARACTER_STYLE_LOCK_V1.md`：Character Style V1 冻结
- `16_CHARACTER_BATCH_PRODUCTION_V1.md`：Character production contract
- `17_PRODUCT_DESIGN_REPORT_V1.md`：V1 产品体验与专业报告定位
- `18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`：传统八字判断 → 现代人格翻译最高产品契约
- `20_TRADITIONAL_BAZI_RULE_AUDIT.md`：八字规则审计、分类与 authority 风险
- `21_AI_PROJECT_OPERATING_SYSTEM.md`：AI 项目管理闭环与 Task / Build / Review / Freeze 规则
- `22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`：**LOCKED `ziping-v1.0.0`**；传统规则 Source of Truth
- `23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`：**LOCKED `traditional-pattern-result/1.0.0`**；TraditionalPatternResult Contract、Evidence / Counter Evidence / Ambiguity、migration、Implementation Plan、Testing / Golden strategy
- `24_CHARACTER_STYLE_LOCK_V2.md`：**LOCKED `character-visual/2.0.0`**；十个固定 IP、City Observation Editorial 画风、色板与资产合同
- `handoffs/2026-08-26-personality-ip-system-v2.md`：V2 资产与完整公网旅程的实现、验证和剩余门槛
- `HANDOFF_TEMPLATE.md`：跨聊天窗口 / 阶段交接模板

## AI 工作协议

所有 AI / GPT / Codex 在修改项目之前必须读取根目录 `AGENTS.md`。

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

完整规则见 `docs/21_AI_PROJECT_OPERATING_SYSTEM.md`。

重要模块开发或依赖选型前必须读取 `docs/12_REUSE_AND_REFERENCES.md`，执行 Research Before Build / Reuse First。

当前 Traditional Pattern / Public Personality authority 相关工作必须读取：

1. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
2. `docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`
3. `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`
4. `docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`
5. `docs/08_DECISION_LOG.md`（特别是 D-020 / D-021）
6. `docs/09_CURRENT_STATE.md`
7. `docs/10_ROADMAP.md`

当前状态：

```text
Traditional Bazi Rule Audit = DONE
Traditional Bazi Rule Profile = LOCKED
rule_profile_version = ziping-v1.0.0
TraditionalPatternResult Spec = LOCKED
pattern_schema_version = traditional-pattern-result/1.0.0
TraditionalPatternResult Implementation = NEXT / ALLOWED
```

重要 prerequisite：

```text
current production calculation profile = civil-local-jieqi-v1
traditional authority required profile = ziping-v1.0.0
```

因此 implementation 可以开始，但 legacy chart 必须 fail closed，不得 silent reinterpret 为 `ziping-v1.0.0`。

Legacy `BaziDerivedFeatures` numeric / distribution / strength fields 只保留 compatibility / analytics / Interpretation 用途，不是 TraditionalPatternResult authority input；以 D-021 为最新治理解释。

原则：

> Chat 是临时工作内存，GitHub 是长期项目记忆。

重要信息必须回写仓库，不得只存在于聊天记录中。

最后更新：2026-08-26
