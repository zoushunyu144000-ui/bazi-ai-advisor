# 09 — Current State

最后更新：2026-08-18

> 本文件描述“现在真实做到哪里”。只有实际存在于仓库/分支/部署环境或已明确 Approved 的事项才写为已完成。

## 1. Repository

- GitHub：`zoushunyu144000-ui/bazi-ai-advisor`
- Visibility：Private
- Default branch：`main`
- Foundation branch：`foundation/mvp-v1`
- Foundation PR：#1（Ready for review，尚未合并）
- PR 最近确认：`mergeable: true`

## 2. Foundation 已完成

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

共享 Domain Contracts、版本字段规范、虚构 mock fixtures 与 `db/schema.sql` 已建立。

### 依赖锁定

- 已在 GitHub Actions 可访问 npm registry 的环境中执行真实依赖安装。
- 已生成并提交 `package-lock.json`（lockfileVersion 3）。
- CI 已切换为基于 lockfile 的 `npm ci`，不再使用未锁定的依赖安装作为验收路径。

## 3. Foundation 验收状态

真实 GitHub Actions 验收已完成，以下步骤均通过：

- Install dependencies：`npm ci --no-audit --no-fund`
- Lint：`npm run lint`
- Typecheck：`npm run typecheck`
- Build：`npm run build`

CI workflow 位于 `.github/workflows/ci.yml`，使用 Node.js 22，并对 `foundation/**`、`feature/**`、`fix/**` push 以及面向 `main` 的 pull request 执行验证。

此前用于辅助读取状态的自定义 commit-status 步骤已移除；CI 现在以 GitHub Actions 原生 check run 作为验收结果。

PR #1 已从 Draft 切换为 Ready for review。当前不自动合并，由总指挥 / 用户决定合并时机。

## 4. 项目治理 / 记忆系统

项目治理体系继续保留：

- `AGENTS.md`
- `docs/00_PROJECT_INDEX.md` ～ `docs/11_CHATGPT_PROJECT_INSTRUCTIONS.md`
- `docs/HANDOFF_TEMPLATE.md`

Foundation 没有覆盖或删除其他窗口已经建立的项目记忆成果。

## 5. 外部服务状态

Foundation 验收不改变以下状态：

- Vercel Project：未绑定 / 未部署 Production
- Supabase Project：未连接真实实例，schema 尚未执行
- Supabase Auth：未实现真实登录流程
- Payment provider：TBD，未接真实支付
- Bazi calculation library / algorithm：TBD，未实现完整算法
- AI Provider / model：TBD，未配置真实 Provider 或 Prompt
- Analytics：PostHog 仅预留变量，未接入

## 6. 本地开发与验证

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

## 7. 下一步边界

Foundation 工程地基已经完成验收。合并 `main` 后，后续窗口应从最新 `main` 创建各自 feature branch，并继续遵守：

- `AGENTS.md`
- `types/domain/` 共享 Contract
- 确定性 Bazi Engine 与 LLM 解释层分离
- 不擅自扩展 V1 到八字以外品类
- 不连接或覆盖任何“典外文库 / Extra-Canonical Library / bible-library-complete”仓库或 Vercel 项目
