# Personality IP System V2 — Handoff

日期：2026-08-26

分支：`feature/ip-system-v2`

Worktree：`work/bazi-ai-advisor/.worktrees/ip-system-v2`

## 1. 完成内容

- 十个固定 Canonical Personality IP 与 `character-visual/2.0.0` manifest；
- City Observation Editorial V2 全局 design system；
- 六个公开路由：`/`、`/birth`、`/result`、`/report`、`/advisor`、`/account`；
- 出生资料 → 确定性 Bazi → Interpretation → 人格档案原链路保持不变；
- Canvas 分享卡使用当前人格 Accent 与 V2 Canonical art；
- GitHub Pages `/bazi-ai-advisor` 与 Vercel root 图片路径兼容；
- UI source-contract 与 base-path regression tests。

## 2. 产品边界

当前页面不宣称 Traditional Authority Cutover。`/report` 为 preview，`/advisor` 为 provider-not-configured，`/account` 为 local-only。Payment、真实 AI Provider、Supabase/Auth 与云同步仍未接入，也没有模拟成功状态。

出生资料中的 sex 继续只供传统排盘规则使用；十个品牌 IP 的 canonical gender 与资产不会跟随用户选择变化。

## 3. Commit list

- `d54766e feat: add canonical personality IP system v2`
- `2914c23 feat: build City Observation Editorial public journey`

## 4. 验证记录

最终完整命令：

```text
npm run lint
npm run typecheck
npm test
npm run build
```

结果：

- ESLint：`0 errors`，`5 warnings`；warning 均来自既有 legacy 组件未使用变量；
- TypeScript：通过；
- Tests：`113 / 113` 通过（Birth 14、Bazi 46、Interpretation/Assets 24、UI 6、Backend 23）；
- Build：通过，静态生成 `/`、`/birth`、`/result`、`/report`、`/advisor`、`/account` 与 not-found；
- GitHub base-path HTTP smoke：主页 `200`，十个 `/bazi-ai-advisor/characters/v2/*.png` 均为 `200 image/png`；
- `git diff --check`：通过（仅 Windows checkout 的 LF → CRLF 提示）。

视觉 QA：1280px 本地首轮截图确认编辑分栏、十人格 DOM 数量与页面层级可渲染，并发现/修复了 GitHub Pages character asset 404。修复后浏览器工具因 localhost URL policy 未允许继续截图；最终 390 / 430 / 768 / 1440 截图复验需在 Vercel Preview 或允许的 GitHub Pages Preview 上完成。

## 5. 资产校验

全部资产为 1122 × 1402 RGB opaque Warm Ivory PNG。完整路径、性别、Accent、尺寸与 SHA-256 的 machine-readable Source of Truth：`public/characters/v2/manifest.json`。

| Key | SHA-256 |
| --- | --- |
| `bi_jian` | `ba32edd1797f990c7223f254af28ddae78b433e7434e9a3ccb004606c51e840d` |
| `jie_cai` | `c8809a9e597fcb1d9e3505da2262d94525fdb6212d4a62a2d71ea7bd7b5610a3` |
| `shi_shen` | `286513ab03ff6d94c9d339a13f085f7eed09761d3bbdae6d2cd854fe0069bd5a` |
| `shang_guan` | `4364ae96258ea565ecae720645cf1ee8681c88ac6ea82d38dcd1a1a326007c56` |
| `zheng_cai` | `e21db8853032a318f571d500b919bb056514885e4d06ee3e1580da336e647590` |
| `pian_cai` | `e0d9a561d2b69d05c87d31f571b7a0568c025c306b82f177e0246da489300f85` |
| `zheng_guan` | `c2ac575b28009b60a9610910547890492603257636ae4e1928a0e06fa937f553` |
| `qi_sha` | `c8e8761c57557fbe854082b449b7911d9b058c8e650c483750a70ee84a7dc8c4` |
| `zheng_yin` | `2cc46438bc8942f56cbddc1bd8a2e7ed3b4689578f53b5da7b0afdf61950170b` |
| `pian_yin` | `ac7a0931ada06055e4b59a0302edc24ff9a38a176cc4cc2c01a02f249e5e60ea` |

## 6. 下一步

1. 建立 Vercel Preview 或 GitHub Pages preview，完成 390 / 430 / 768 / 1440 screenshot QA；
2. 人工走通出生资料 → 结果 → 分享图下载，并核对未知时辰与自定义城市错误态；
3. Code Review 后合并到目标 release branch；
4. TraditionalPatternResult、Payment、AI Provider、Auth 按各自 frozen contract 独立推进，不在 Presentation 层绕过。
