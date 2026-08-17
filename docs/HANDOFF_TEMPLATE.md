# Handoff Template

用于 GPT / AI 窗口之间交接。完成一个阶段、准备换窗口或当前窗口上下文变长时，复制下面模板填写，并把重要状态同步到对应项目文档。

---

# HANDOFF — [模块 / 阶段名称]

日期：YYYY-MM-DD
负责窗口：可选
相关分支 / Commit / PR：

## 1. 本阶段目标

简述这个窗口负责解决什么问题。

## 2. 已完成

- 
- 
- 

## 3. 修改文件

- `path/to/file` — 修改内容
- 

## 4. 当前真实状态

说明目前代码能做什么、不能做什么。

## 5. 重要决定

列出本阶段新增的重要决策。如果属于长期决策，必须同时写入 `08_DECISION_LOG.md`。

- 

## 6. 测试 / 验证

已执行：
- 

结果：
- 

未验证：
- 

## 7. 遗留问题 / 风险

- 
- 

## 8. 下一步

按优先级写：

1. 
2. 
3. 

## 9. 不要破坏的约束

列出下一窗口必须保留的兼容性、UI、API、数据库、商业规则等。

- 

## 10. 需要下一窗口首先读取

默认：
- `AGENTS.md`
- `docs/00_PROJECT_INDEX.md`
- `docs/09_CURRENT_STATE.md`

本模块额外：
- 

---

## 使用规则

Handoff 不是长期事实的替代品。

如果交接中包含：
- 重大决策 → 同步 `08_DECISION_LOG.md`
- 当前完成度 → 同步 `09_CURRENT_STATE.md`
- 架构变化 → 同步 `04_TECH_ARCHITECTURE.md`
- 数据模型变化 → 同步 `05_DATABASE_SCHEMA.md`
- AI Prompt/策略变化 → 同步 `06_AI_SYSTEM.md`
- 商业规则变化 → 同步 `07_BUSINESS_RULES.md`
- 视觉系统变化 → 同步 `03_DESIGN_SYSTEM.md`

最后更新：2026-08-17
