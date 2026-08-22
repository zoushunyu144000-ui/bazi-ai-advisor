# 21 — AI Project Operating System

状态：**APPROVED / ACTIVE**  
日期：2026-08-23

本文件定义本仓库所有 AI / GPT / Codex / Agent 的项目执行闭环。

目标不是增加流程负担，而是防止：

- 项目做到一半不断扩 Scope；
- Agent 凭聊天记忆修改已经冻结的决定；
- UI、算法、商业逻辑并行互相覆盖；
- 任务完成后 GitHub 状态没有更新；
- 同一个问题被不同 Agent 反复推翻。

核心原则：

> **GitHub 是长期事实来源；每轮只推进一个清晰 Task；完成后 Review、Freeze、回写 Current State。**

---

## 1. 强制执行流程

所有正式开发任务统一遵守：

```text
PRODUCT
产品是什么
↓
ROADMAP
准备做什么
↓
CURRENT_STATE
现在在哪里
↓
TASK
本轮只做什么
↓
BUILD
Agent 开发
↓
REVIEW
检查
↓
FREEZE
冻结完成
↓
CURRENT_STATE
更新真实状态
```

不得从聊天中的一个新想法直接跳到 BUILD。

---

## 2. PRODUCT — 先确认产品是什么

回答：

- 产品到底是什么；
- 为谁解决什么问题；
- V1 的核心体验是什么；
- 什么不属于当前产品范围；
- 哪些产品原则已经冻结。

本项目当前 Product Source of Truth 主要包括：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`
4. `docs/02_PRODUCT_SPEC.md`（仅在不与上述最新冻结文档冲突时使用）

若这些文件冲突，按各文档声明的 Source of Truth 优先级处理，不得自行平均折中。

---

## 3. ROADMAP — 再确认准备做什么

回答：

- 当前阶段是什么；
- 下一阶段是什么；
- P0 / blocker 顺序是什么；
- 哪些内容明确 parked / deferred。

唯一当前路线图：

`docs/10_ROADMAP.md`

Agent 不得因为某个功能“顺手能做”就跳过 Roadmap 顺序。

---

## 4. CURRENT_STATE — 确认真实做到哪里

回答：

- 已经完成什么；
- 哪些只是 Research / Prototype / Draft；
- 哪些已经进入 production logic；
- 当前 blocker 是什么；
- 当前 branch / PR / deployment 状态是什么。

唯一当前状态文件：

`docs/09_CURRENT_STATE.md`

聊天记录不是 Current State。

如果文档与真实代码、PR、CI、部署状态冲突，先核查真实仓库，再修正文档。

---

## 5. TASK — 本轮只做什么

每轮进入 BUILD 前必须有明确 Task Boundary（任务边界）。

至少写清：

```text
Goal
本轮唯一目标

In Scope
允许修改什么

Out of Scope
明确不做什么

Inputs / Source of Truth
必须先读哪些文件、代码、PR

Deliverables
最终必须产出什么

Review Gate
怎样才算通过

Forbidden
哪些决定 / 模块禁止顺手修改
```

原则：

> **一个任务可以很深，但不能无限横向扩张。**

发现新问题时：

- 若阻塞当前 Task：记录并处理；
- 若不阻塞：进入 Roadmap / backlog，不顺手开发。

---

## 6. BUILD — Agent 开发

Build 阶段只执行已批准 Task。

必须遵守：

- `AGENTS.md`；
- 当前 Product / Roadmap / Current State；
- `docs/08_DECISION_LOG.md` 中 Approved / Active 决策；
- 相关 Design / Architecture / Contract；
- Research Before Build / Reuse First；
- 不破坏已经 Freeze 的内容。

Build 中若发现 Task 前提错误，应停止扩大实现，先把事实写清楚并进入 Review，而不是自行重定义产品。

---

## 7. REVIEW — 不是“代码能跑”就结束

每轮至少审核六类内容：

### 7.1 Scope Review

- 是否只做了 Task；
- 是否偷偷增加功能；
- 是否改了未授权模块。

### 7.2 Product Review

- 是否符合当前 Product；
- 是否破坏已冻结产品原则。

### 7.3 Architecture / Rule Review

- 是否违反 shared Contract；
- 是否创造第二套事实来源；
- 是否把实验逻辑包装成正式规则。

### 7.4 UI Review（涉及 UI 时）

- 是否符合 Design System；
- 是否 Mobile First；
- 是否真实浏览器验证。

### 7.5 Engineering Review

至少按适用范围检查：

```text
lint
→ typecheck
→ tests
→ build
→ browser / integration QA
```

### 7.6 Documentation Review

- Current State 是否需要更新；
- Roadmap 是否需要推进；
- Decision Log 是否产生新冻结决定；
- 专题 Contract / research 文档是否需要同步。

Review 未通过：回到 BUILD。

---

## 8. FREEZE — 通过后才冻结

Freeze 的意思不是“永远不能改”，而是：

> **后续 Agent 不得仅因为自己偏好不同就重新推翻。**

需要冻结的内容包括但不限于：

- 产品 Scope；
- 命名；
- 数据 Contract；
- Rule Profile；
- API Contract；
- Character / Design language；
- Release Gate；
- 已确认的架构边界。

重要 Freeze 写入：

`docs/08_DECISION_LOG.md`

如果未来要推翻：必须新增 Superseded 决策，解释原因，不删除历史。

---

## 9. CURRENT_STATE — 每轮结束必须回写

任何真正改变项目状态的 Task 完成后，必须更新：

`docs/09_CURRENT_STATE.md`

并按需要更新：

- `docs/10_ROADMAP.md`
- `docs/08_DECISION_LOG.md`
- 对应专题文档
- PR 描述 / Handoff

结束状态必须区分：

```text
DONE
PARTIAL
BLOCKED
RESEARCH ONLY
PROTOTYPE ONLY
PRODUCTION READY
```

禁止把“代码写了”“测试通过”“Research 完成”自动写成“Production Ready”。

---

## 10. 本项目文档角色映射

本仓库已有编号化文档，不再额外创建一套重复的 `PRODUCT.md / CURRENT_STATE.md / ROADMAP.md / DESIGN_SYSTEM.md / DECISIONS.md`，避免双重 Source of Truth。

对应关系：

| 项目管理角色 | 当前仓库 Source of Truth |
| --- | --- |
| PRODUCT（产品） | `13_PERSONALITY_IP_BIBLE.md` + `18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md` + `17_PRODUCT_DESIGN_REPORT_V1.md` |
| ROADMAP（路线图） | `10_ROADMAP.md` |
| CURRENT_STATE（当前状态） | `09_CURRENT_STATE.md` |
| TASK（本轮任务） | 当前任务 Prompt / PR Scope / 必要时专题 Task 文档 |
| DESIGN_SYSTEM（设计系统） | `03_DESIGN_SYSTEM.md` + Character Style contracts |
| DECISIONS（冻结决定） | `08_DECISION_LOG.md` |
| RULE PROFILE（传统规则体系） | `22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md` |
| BUILD（开发） | feature / release branch production changes |
| REVIEW（审核） | tests + CI + browser / domain review + PR review |
| FREEZE（冻结） | Decision Log + Approved Contract + merged state |

---

## 11. 与 Idea → Spec → Plan → Build → Review → Freeze 的关系

项目从更高层看统一为：

```text
Idea
↓
Spec
↓
Plan
↓
Build
↓
Review
↓
Freeze
```

对应到日常执行：

```text
Idea
↓
PRODUCT / Spec
↓
ROADMAP / Plan
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

Idea 阶段可以发散；一旦进入 Task / Build，必须收敛。

---

## 12. 当前八字人格项目的执行规则

当前产品最高原则：

> **传统命理负责判断，现代产品负责翻译。**

当前 V1 不允许为了“更像人格测试”而自造传统判断 authority。

截至 2026-08-23：

- Traditional Bazi Rule Audit 已完成；
- Traditional Bazi Rule Profile 已完成 Owner Approval + Freeze；
- 正式 `rule_profile_version = ziping-v1.0.0`；
- Rule Profile Source of Truth：`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`；
- 下一 P0 已推进为 `TraditionalPatternResult + Evidence + Counter Evidence + Ambiguity` implementation；
- `TraditionalPatternResult` 当前仍是 **NOT IMPLEMENTED**，Rule Profile Freeze 不等于 production implementation 完成；
- implementation 必须先 Spec / Plan，再 Build，不得重新混入 `support_ratio`、month multiplier、candidate score、Personality Dimensions 或 LLM pattern judgment；
- Payment、AI Advisor、Supabase Live、Auth 等继续 parked，不得抢当前 P0。

当前顺序：

```text
Rule Audit = DONE
→ ziping-v1.0.0 Rule Profile = LOCKED
→ TraditionalPatternResult Spec / Plan
→ Build
→ Review
→ Freeze implementation
→ Public Personality Translation
```

详细规则见：

- `docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`
- `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`

---

## 13. Agent 每轮结束汇报模板

```text
TASK：DONE / PARTIAL / BLOCKED

1. 本轮目标
2. 实际完成
3. 修改文件
4. 是否修改 production logic
5. Review 结果
6. Tests / CI / browser QA
7. 新增或变化的决定
8. Freeze 了什么
9. CURRENT_STATE 是否已更新
10. ROADMAP 当前下一步
11. 遗留 blocker
```

---

## 14. 最终原则

> **先确认产品，再看路线图；先确认当前状态，再切任务；只做本轮任务；开发后必须审核；审核通过才能冻结；冻结后必须更新状态。**

任何 Agent 不得跳过这条闭环。
