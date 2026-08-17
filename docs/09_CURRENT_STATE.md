# 09 — Current State

最后更新：2026-08-17

> 本文件描述“现在真实做到哪里”。只有实际存在于仓库/分支/部署环境或已明确 Approved 的事项才写为已完成。

## 1. Repository

- GitHub：`zoushunyu144000-ui/bazi-ai-advisor`
- Visibility：Private
- Default branch：`main`
- Foundation branch：`foundation/mvp-v1`
- Foundation PR：#1（Draft，尚未合并）
- Initial foundation engineering commit：`35b7bbc05fe12c9b0162090b49ff244de8d0d5d9`
- 最新 Foundation head：以 PR #1 当前 `head_sha` 为准

## 2. 当前已完成

### 项目治理 / 记忆系统

`main` 已建立：

- `AGENTS.md`
- `docs/00_PROJECT_INDEX.md` ～ `docs/11_CHATGPT_PROJECT_INSTRUCTIONS.md`
- `docs/HANDOFF_TEMPLATE.md`

Foundation 分支保留并同步这套治理系统，不覆盖其他窗口成果。

### Foundation 工程（PR #1）

已存在实际代码：

- Next.js `16.2.11`
- React `19.2.6`
- TypeScript `^5.8.0` strict
- App Router
- Tailwind CSS `^4.1.0`
- shadcn/ui 基础配置
- PostgreSQL / Supabase schema 文件
- Supabase Auth / DB 环境变量与依赖预留
- Vercel AI SDK provider abstraction 基础依赖
- PostHog 环境变量预留

已建立目录：

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

已建立基础 route shell：

- `/`
- `/birth`
- `/result`
- `/report`
- `/advisor`
- `/account`

已建立共享 Domain Contracts、版本字段规范、虚构 mock fixtures 与 `db/schema.sql`。

## 3. 当前验证状态

已确认：

- `git diff --check`：通过
- Domain Contracts + fixtures 独立 TypeScript 校验：通过
- GitHub 远端 branch/commit/PR：已创建并可读取

尚未确认：

- 完整 `npm run lint`
- 完整 `npm run typecheck`
- 完整 `npm run build`

原因：当前执行 sandbox 无法解析 npm registry DNS，因此不能安装完整依赖；GitHub App 能写代码/PR，但当前读取 Actions workflow run 明细返回 403。仓库已经加入 `.github/workflows/ci.yml`，在结果可访问前 PR 保持 Draft，不把未验证状态写成“通过”。

## 4. 外部服务状态

- Vercel Project：**未绑定 / 未部署 Production**
- Supabase Project：**未连接真实实例，schema 尚未执行**
- Supabase Auth：**未实现真实登录流程**
- Payment provider：TBD，未接真实支付
- Bazi calculation library / algorithm：TBD，未实现完整算法
- AI Provider / model：TBD，未配置真实 Provider 或 Prompt
- Analytics：PostHog 仅预留变量，未接入

## 5. 本地运行命令

依赖安装完成后：

```bash
npm install
npm run dev
```

验证：

```bash
npm run lint
npm run typecheck
npm run build
```

## 6. 正在进行

- Foundation PR 与并行建立的 `/docs` 项目治理提交安全整合
- 完整 CI 验证结果待可访问环境确认

## 7. 下一步

Foundation 合并并验证后，其他窗口可以基于共享 Contracts 分工：

1. 确定性 Bazi Engine
2. Birth 输入与规范化
3. Interpretation / Personality mapping
4. Report generation
5. Auth + Supabase integration
6. Billing / Payment provider
7. Advisor flow
8. Analytics

所有窗口必须遵守 `AGENTS.md` 与 `types/domain/` 的共享接口边界。
