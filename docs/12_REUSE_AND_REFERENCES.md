# 12 — Reuse and References Registry

状态：Approved / Active project governance

最后核查：2026-08-18

本文件是项目重要外部依赖、开源实现、API、MCP、skill 与参考项目的长期登记表。

> 规则：**Research Before Build / Reuse First**。聊天窗口不得仅凭记忆选择重要依赖；新增/替换重要能力前必须重新核查官方来源，并更新本文件。

## 1. 决策顺序

```text
成熟可靠库直接复用
>
Adapter 封装成熟实现
>
参考成熟实现补齐少量业务逻辑
>
最后才自行从零实现
```

尤其禁止无研究依据重复实现已有成熟能力：历法、节气、干支、时区/DST 数据与基础转换、基础排盘、常见 UI primitives、认证、数据库基础能力。

## 2. 每次选型必须检查

至少记录：

1. 官方 GitHub / npm / API / MCP / skill 来源
2. 用途与边界
3. License / 商业使用筛查
4. 当前维护状态（release / commit / security）
5. 测试与文档成熟度
6. 是否采用
7. 采用方式：direct / adapter / reference-only
8. 风险
9. 替代方案
10. 采用或核查版本
11. 最后核查日期

License 字段记录上游项目声明，仅用于工程选型筛查，不替代正式法律意见。

## 3. 当前已采用 / 已进入 Foundation 的重要依赖

| 名称 | URL / Package | 用途 | License | 维护状态 | 是否采用 | 采用方式 | 风险 | 替代方案 | 版本 / 核查 |
|---|---|---|---|---|---|---|---|---|---|
| Next.js | https://github.com/vercel/next.js / `next` | Web framework、App Router、SSR/Server Components | MIT | Active，官方仓库持续维护 | 是 | Direct dependency | Framework coupling；升级可能改变 routing/runtime 语义 | React Router/Vite 等，只有出现明确阻塞时再研究 | `16.2.11`；2026-08-18 |
| React / React DOM | https://github.com/facebook/react / `react`, `react-dom` | UI runtime | MIT | Active | 是 | Direct dependency | 必须与 Next.js 支持矩阵保持兼容 | 由 Web framework 选型决定，不单独替换 | `19.2.6`；2026-08-18 |
| Tailwind CSS | https://github.com/tailwindlabs/tailwindcss / `tailwindcss` | Utility CSS | MIT | Active，官方仓库有持续 release | 是 | Direct dependency | 大版本升级可能改变 class / build 语义 | CSS Modules / vanilla CSS，需重新评估成本 | declared `^4.1.0`；lockfile 为准；2026-08-18 |
| shadcn/ui | https://github.com/shadcn-ui/ui / https://ui.shadcn.com | 常见 UI primitives / component source distribution | MIT | Active，官方 registry / releases 持续维护 | 是 | **Source/registry reuse**，不是把整个库封装成黑盒 runtime | 复制进仓库后由本项目维护；需保留适当 License/notice 合规意识 | Radix/Base UI 等必须另行研究，不凭记忆替换 | Foundation `components.json` 已采用；2026-08-18 |
| Supabase JS | https://github.com/supabase/supabase-js / `@supabase/supabase-js` | Auth / Database / Storage / RPC client | MIT | Active，官方 SDK 持续 release | 是 | Direct dependency + repository/service boundary | SDK minor version可能调整 runtime 支持；敏感写入必须走可信服务端 | 直接 Postgres + 独立 Auth 只有出现产品级理由时再评估 | `2.111.0`；2026-08-18 |
| Supabase SSR | https://github.com/supabase/ssr / `@supabase/ssr` | Next.js SSR / cookie session client | MIT | Active；官方明确替代旧 auth-helpers | 是 | Direct dependency / adapter-like client factory | refresh token / concurrent SSR session 处理需遵守官方模式 | 不回退 deprecated auth-helpers；如替换需重新研究 | `0.12.4`；2026-08-18 |
| Vercel AI SDK | https://github.com/vercel/ai / `ai` | Provider-agnostic AI interface、streaming/structured output foundation | Apache-2.0 | Active，官方仓库持续维护 | 是（Foundation） | Provider adapter boundary；**不等于已选定模型 Provider** | API 与 provider capability 变化；Provider 特有能力可能需要薄适配 | 各模型官方 SDK，必须在具体 Provider 选型时比较 | declared `^6.0.0`；lockfile 为准；2026-08-18 |
| clsx | https://github.com/lukeed/clsx / `clsx` | 条件 className 拼接 | MIT | Maintained / widely used | 是 | Direct utility | 极低；避免重复造 className helper | `tailwind-merge` 的 `twJoin` 只在实际需求符合时评估 | `^2.1.1`；2026-08-18 |
| tailwind-merge | https://github.com/dcastil/tailwind-merge / `tailwind-merge` | Tailwind class conflict merge | MIT | Active，官方持续适配 Tailwind 新版本 | 是 | Direct utility behind `cn` | 与 Tailwind 版本兼容性；不应滥用为任意 style override API | 简化组件 API / 不做冲突合并 | `^3.3.0`；2026-08-18 |
| TypeScript | https://github.com/microsoft/TypeScript / `typescript` | Type system / compiler | Apache-2.0 | Active，但 upstream 正处于 TS 7 演进期 | 是 | Dev dependency | 不因“最新”盲目大版本升级；需验证 Next/ESLint/build compatibility | 无同级替代需求 | declared `^5.8.0`；lockfile 为准；2026-08-18 |
| ESLint | https://github.com/eslint/eslint / `eslint` | Static linting | MIT | Active | 是 | Dev dependency | Major config/API changes | biome 等只有经独立评估后才可替换 | declared `^9.0.0`；lockfile 为准；2026-08-18 |

## 4. 八字 / 历法 / 节气复用登记

### tyme4ts

- 名称：Tyme for TypeScript
- 官方仓库：https://github.com/6tail/tyme4ts
- npm package：`tyme4ts`
- 当前评估版本：`1.5.2`
- 用途：公历/农历相关日期能力、干支、节气等基础历法能力；PR #5 已通过 `modules/bazi/adapters/tyme4ts-adapter.ts` 封装使用。
- License：MIT（官方 `LICENSE` 与 `package.json` 均声明 MIT）。
- 维护状态：Active；2026-08-17 仍有仓库提交，`1.5.2` 于 2026-06 有算法/代码更新。
- 是否采用：**Conditional Adopt / PR #5 尚未进入 main**。
- 采用方式：**Adapter only**。Shared Domain 与业务规则不得直接暴露 `tyme4ts` 类型。
- 优点：避免自行重写节气、干支等成熟历法基础能力；项目本身有文档与测试脚本。
- 风险：库提供的是通用历法能力，不自动等于本项目八字流派规则；年/月边界、晚子时、大运起法等仍必须由版本化 `rule_profile_version` 明确定义并用 golden vectors 验证。
- 上游参考：README 明确说明部分节气算法引用 `sxwnl/sxwnl`；如未来深入校验 astronomical boundary，应继续追踪其来源与许可，而不是复制算法后失去 provenance。
- 替代方案：TBD。若 `tyme4ts` 不能满足准确性/维护/许可要求，必须重新 Research Before Build，对其他成熟库或 API 做同样登记后才能替换。
- 最后核查：2026-08-18。

**规则：02 不得把 Adapter 已能稳定提供的历法/节气/干支能力重新手写一套；只有明确的八字业务规则差异可以保留在 rule layer。**

## 5. 时区 / DST 复用登记

### ECMAScript `Intl.DateTimeFormat` + runtime IANA timezone data

- 来源：https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat （规范/API入口；运行时由 Node/ICU 提供 IANA timezone data）
- 用途：IANA timezone 下 instant ↔ local parts 的平台级转换/格式化基础。
- License：N/A（平台标准/API；具体 Node/ICU/tzdata 各有各自许可）。
- 是否采用：是，当前 Birth / Bazi feature PR 已使用平台 `Intl` 能力。
- 采用方式：平台 API；不得自行维护一份世界时区规则数据库。
- 风险：不同 runtime/ICU/tzdata 版本可能影响历史 timezone 边界；DST overlap/gap 的 disambiguation 策略必须显式测试和版本化。
- 替代方案：Temporal / `@js-temporal/polyfill` 已完成 Reuse First 复核，见下文。
- 最后核查：2026-08-18。

### TC39 Temporal / `@js-temporal/polyfill`

- 官方规范/状态：https://github.com/tc39/proposal-temporal / https://tc39.es/proposal-temporal/docs/timezone.html
- npm：https://www.npmjs.com/package/@js-temporal/polyfill
- 用途：对 local wall time → exact instant 的 overlap / gap 提供 first-class `disambiguation` 与 offset 语义。
- License：Temporal proposal/spec 以官方仓库声明为准；`@js-temporal/polyfill` npm 当前声明 ISC。
- 维护/实现状态：Temporal 已 Stage 4；官方 implementation status 列出 Node 26 ships native Temporal。当前仓库基线仍是 Node 22。
- 决定：**Reference Only for PR #4**，不新增 runtime dependency。
- 原因：Node 22 不能依赖原生 Temporal；polyfill 当前包文档仍列有“Release production version”未完成项。PR #4 已把 timezone database 与基本转换交给平台 `Intl`/IANA，只保留产品语义的 reject/offset disambiguation；现有边界测试足以覆盖 V1 目标时段。
- 退出路径：仓库升级 Node 26+ 后优先重新评估 native Temporal，或在历史边界测试发现现有策略不足时评估 polyfill Adapter。
- 最后核查：2026-08-18。

### Wave 1 Reuse First 复核结论

PR #4 不维护全球 timezone database，也不从外部 Provider 的“当前 DST/offset”推断历史出生时刻。保留的自有逻辑仅用于：

1. 输入验证；
2. 枚举 runtime IANA 下可能的 occurrence；
3. 产品 policy：gap 必须 reject，overlap 必须由用户/调用方显式选择 offset；
4. 把选中的 exact instant + offset 写入 `BirthProfile`。

DST regression tests 必须在 PR #4 Merge Gate 保持 green。

## 6. Birth Location / Timezone Provider 复用登记

详细矩阵：`modules/birth/PROVIDER_BENCHMARK.md`。

### OpenCage Geocoding

- URL：https://opencagedata.com/api / https://opencagedata.com/pricing
- Purpose：城市/国家 → canonical candidate + WGS84 coordinates + IANA timezone annotation。
- License / terms：API 返回数据允许永久存储；底层数据 attribution 依具体数据源要求处理。
- Maintenance / docs：官方 API、pricing、privacy、timezone 文档持续维护。
- Decision：**Conditional Adopt / primary V1 candidate**。
- Integration：`OpenCageLocationProvider` Adapter；Secret 只从 runtime config 注入。
- Risks：forward geocoding 不是 fuzzy autocomplete；language 仅 best-effort；必须做中文/英文真实 fixture benchmark 后才能宣布 production-ready。
- Privacy：Adapter 默认 `no_record=1`，减少 query-content retention。
- Alternative：GeoNames；商业搜索 UX benchmark 为 TomTom。
- Last verified：2026-08-18。

### GeoNames Web Services

- URL：https://www.geonames.org/export/
- Purpose：城市名搜索 + 经纬度；必要时通过 `timezoneJSON` 取得 IANA/Olson timezone id。
- License：CC-BY；commercial usage allowed；使用数据/服务需 attribution。
- Decision：**Conditional Adopt / fallback**。
- Integration：`GeoNamesLocationProvider` + `GeoNamesTimezoneResolver` Adapter；不把全球 GeoNames dump 纳入仓库。
- Risks：public free service 无 SLA；两次调用时 credit 成本为 search 1 + timezone 1；production-critical 场景应评估 premium。
- Alternative：OpenCage；TomTom commercial search。
- Last verified：2026-08-18。

### TomTom Search / Geocoding

- URL：https://docs.tomtom.com/pricing / https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search
- Purpose：多语言 fuzzy city/place search、coordinates、可选 IANA timezone。
- Decision：**Reference / commercial-quality benchmark**，PR #4 不接 live Adapter。
- Strengths：显式支持 `zh-CN`、`zh-TW`、English、`ms-MY`；Search 可 `timeZone=iana`；China 有 city-level coverage。
- Risks：Developer Portal terms、region-specific content 与持久化权利需在保存 birth coordinates 前单独法律/商业条款复核。
- Last verified：2026-08-18。

### Google Maps Platform Geocoding + Time Zone

- URL：https://developers.google.com/maps/billing-and-pricing/pricing / https://developers.google.com/maps/documentation/geocoding/policies
- Decision：**Reference Only**。
- Reason：搜索/覆盖成熟，但 Geocoding content 的 caching/storage 一般受限，place ID 是明确可无限期保存的例外；与本产品“持久保存 Birth coordinates / exact facts”的目标有明显合同摩擦。
- Credentials：API key/OAuth + billing required。
- Last verified：2026-08-18。

### Mapbox Geocoding

- URL：https://docs.mapbox.com/api/search/geocoding/ / https://www.mapbox.com/pricing
- Decision：**Reject as V1 primary / reference only**。
- Reason：temporary results 不可持久保存；permanent geocoding 单独计费且需要 permanent usage rights；当前 Geocoding 文档还要求响应与 Mapbox map 结合使用；IANA timezone 需另一个 resolver。
- Last verified：2026-08-18。

## 7. Auth / Database 复用边界

V1 已选择 Supabase，因此：

- Auth：优先使用 Supabase Auth + 官方 SSR/client SDK，不自行实现密码、token refresh、session storage 协议。
- Database：优先使用 PostgreSQL/Supabase migrations、RLS、constraints、transactions、RPC 等基础能力，不自行制造一套数据库/权限系统。
- Repository/service layer 只封装本项目 domain boundary，不复制 Supabase/Postgres 已成熟解决的基础设施。

若未来要替换 Supabase，必须先在本文件增加候选方案的 License、维护状态、迁移成本、锁定风险与替代方案对比，再进入实现。

## 8. UI primitives 复用边界

Foundation 已选择 React + Tailwind + shadcn/ui。新增常见控件（Button、Dialog、Sheet、Form、Tabs、Tooltip、Select 等）前：

1. 先查当前 shadcn registry / 已安装组件；
2. 能复用则复用或轻量组合；
3. 只有产品视觉/交互确实特殊时才写定制 primitive；
4. 不允许另开一套不兼容的 Button/Dialog/Form 基础组件体系。

## 9. AI / MCP / Skill 规则

新增 AI Provider、MCP、skill、外部 API 前，同样必须登记：

- 官方来源
- 权限范围
- 数据会离开哪些边界
- 商业条款 / License
- 维护状态
- 失败降级
- Provider lock-in 风险
- 是否通过 Adapter 接入

当前 `ai` package 只是 provider-agnostic foundation；具体模型 Provider 尚未因本文件自动批准。

## 10. 新依赖登记模板

```md
### <Name>

- URL / Package:
- Purpose:
- License:
- Maintenance evidence:
- Tests / docs:
- Decision: Adopt / Conditional Adopt / Reference Only / Reject
- Integration: Direct / Adapter / Reference
- Risks:
- Alternative:
- Version:
- Last verified:
- Decision / PR link:
```

## 11. Merge Gate

任何“重要基础能力”PR 若新增第三方依赖或自研已有成熟能力，最终合并前必须满足：

- 已在本文件登记；
- 官方来源已重新核查；
- License 已记录；
- 维护状态已记录；
- Adapter/边界明确；
- 有替代/退出路径；
- CI 与模块测试通过。

缺少以上信息时，不得以“先写了再说”为理由直接合并。
