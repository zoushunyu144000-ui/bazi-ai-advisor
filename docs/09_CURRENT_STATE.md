# 09 — Current State

最后更新：2026-08-18

> 本文件描述“现在真实做到哪里”。只有实际存在于仓库/分支/部署环境或已明确 Approved 的事项才写为已完成。

## 1. Repository

- GitHub：`zoushunyu144000-ui/bazi-ai-advisor`
- Visibility：Private
- Default branch：`main`
- Foundation branch：`foundation/mvp-v1`
- Foundation PR：#1（**已合并 / closed**）
- Foundation HEAD：`ee37eba0c65a70da13365bbe354954457df2819c`
- Merge Commit / 当前 Foundation 合并基线：`f3b0fc9e0590b016d242031ffbcb00c5f7617306`
- PR #1 merged at：2026-08-17T16:34:25Z

**Foundation 已正式进入 `main`。**

截至本次状态同步前的 GitHub 核对，`main` HEAD 为上述 Merge Commit `f3b0fc9e0590b016d242031ffbcb00c5f7617306`。

## 2. Foundation 已完成并进入 main

### 工程基础

- Next.js `16.2.11`
- React `19.2.6`
- TypeScript `^5.8.0` strict
- App Router
- Tailwind CSS `^4.1.0`
- shadcn/ui 基础配置
- PostgreSQL / Supabase foundation schema
- Supabase Auth / DB 环境变量与依赖预留
- Vercel AI SDK provider abstraction 基础依赖
- PostHog 环境变量预留

已建立：

- `app/`
- `modules/bazi/`
- `modules/interpretation/`
- `modules/ai/`
- `modules/billing/`
- `modules/poster/`
- `modules/analytics/`
- `lib/`
- `db/`
- `types/domain/`
- `tests/fixtures/`

基础 route shell：

- `/`
- `/birth`
- `/result`
- `/report`
- `/advisor`
- `/account`

共享 Domain Contracts、版本字段规范、虚构 mock fixtures 与 `db/schema.sql` 已建立并随 PR #1 合并进入 `main`。

### 依赖锁定

- 已在 GitHub Actions 可访问 npm registry 的环境中执行真实依赖安装。
- 已生成并提交 `package-lock.json`（lockfileVersion 3）。
- CI 已切换为基于 lockfile 的 `npm ci`，不再使用未锁定的依赖安装作为验收路径。

## 3. Foundation 验收与合并状态

PR #1：`foundation: initialize Bazi MVP architecture`

状态：**Merged**

GitHub 已核实：

- PR state：`closed`
- merged：`true`
- Foundation HEAD：`ee37eba0c65a70da13365bbe354954457df2819c`
- Merge Commit：`f3b0fc9e0590b016d242031ffbcb00c5f7617306`

Foundation HEAD 对应 GitHub Actions CI run 已完成，结论为 `success`。

验收步骤均通过：

- Install dependencies：`npm ci --no-audit --no-fund`
- Lint：`npm run lint`
- Typecheck：`npm run typecheck`
- Build：`npm run build`

CI workflow 位于 `.github/workflows/ci.yml`，使用 Node.js 22，并对 `foundation/**`、`feature/**`、`fix/**` push 以及面向 `main` 的 pull request 执行验证。

此前“PR #1 Ready for review / 尚未合并 / 等待总指挥决定合并”的状态已经失效，不得继续作为当前项目状态引用。

## 4. 当前开发阶段：Wave 1 并行开发

**当前正式进入 Wave 1 并行开发。**

统一分支基线规则：

1. 后续所有开发窗口必须先同步最新 `main`。
2. 所有新的业务/功能开发统一从最新 `main` 创建各自的 `feature/*` branch。
3. 不得继续以旧的 `foundation/mvp-v1` 作为新功能开发基线。
4. 各窗口继续遵守 `AGENTS.md`、共享 Domain Contracts 与项目记忆回写规则。
5. 并行窗口如需修改 `types/domain/` 等共享 Contract，应先协调影响面，避免产生不兼容的平行定义。

Wave 1 表示 Foundation 后的并行开发阶段，不代表扩大 V1 产品范围；V1 仍只聚焦八字。

## 5. 项目治理 / 记忆系统

项目治理体系继续保留：

- `AGENTS.md`
- `docs/00_PROJECT_INDEX.md` ～ `docs/11_CHATGPT_PROJECT_INSTRUCTIONS.md`
- `docs/HANDOFF_TEMPLATE.md`

Foundation 合并没有覆盖或删除项目记忆体系。

本文件、`docs/10_ROADMAP.md` 与 `docs/08_DECISION_LOG.md` 已在 PR #1 合并后同步真实状态。

## 6. 外部服务状态

Foundation 合并不改变以下状态：

- Vercel Project：未绑定 / 未部署 Production
- Supabase Project：未连接真实实例，schema 尚未执行
- Supabase Auth：未实现真实登录流程
- Payment provider：TBD，未接真实支付
- Bazi calculation library / algorithm：TBD，未实现完整算法
- AI Provider / model：TBD，未配置真实 Provider 或 Prompt
- Analytics：PostHog 仅预留变量，未接入

## 7. 本地开发与验证

```bash
npm ci
npm run dev
```

验收：

```bash
npm run lint
npm run typecheck
npm run build
```

## 8. 下一步边界

Foundation 工程地基已经完成验收并正式合并 `main`。

后续窗口统一从最新 `main` 创建 feature branch，并继续遵守：

- `AGENTS.md`
- `types/domain/` 共享 Contract
- 确定性 Bazi Engine 与 LLM 解释层分离
- 不擅自扩展 V1 到八字以外品类
- 不连接或覆盖任何“典外文库 / Extra-Canonical Library / bible-library-complete”仓库或 Vercel 项目
