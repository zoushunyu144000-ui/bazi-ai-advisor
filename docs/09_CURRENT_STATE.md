# 09 — Current State

状态：**Tonight V1 Release Candidate — Engineering Loop Implemented / Character Visual Gate OPEN**  
最后更新：2026-08-20

## 1. 当前产品方向

产品已从“复杂八字 AI 顾问平台优先”正式收敛为：

**八字版 SBTI + 抽象人格 IP + 免费分享传播 + 后续轻付费深度报告。**

V1 核心原则：

> 里面认真算，外面认真发疯。

今晚不以 Supabase、支付或 AI 系统是否上线作为免费人格体验的完成条件；免费人格链路本身必须完整。

## 2. Production baseline

截至本轮开始时：

- `main` baseline：`0533e90c28162c28fb3e492a9331079eb6231818`
- Vercel Production：`bazi-ai-advisor.vercel.app`
- 原 Production 仍是 2026-08-18 前端版本，不应被描述为今晚新人格 RC。

## 3. Tonight Release branch

当前工作分支：

`release/v1-personality-rc`

Draft PR：

`#16 release: V1 public personality experience`

PR 保持 Draft，直到 Character Visual System V1 选定且 20 / 20 正式角色资产完成、CI 与浏览器验收完成。

当前 Preview 固定别名：

`bazi-ai-advisor-git-release-v1-personality-rc-zuriel144000.vercel.app`

Preview 已成功通过一次 Vercel production build 并返回 HTTP 200；但由于正式 Character binary 尚未提交，它只是 **QA Preview**，不是可公开替换 Production 的最终版本。

## 4. Deterministic Core Chain

已经进入 `main` 的核心技术链保持为唯一事实来源：

```text
Birth
→ Bazi Engine
→ Interpretation
```

今晚新公网链路明确复用：

```text
normalizeBirthProfile()
→ calculateBazi()
→ interpretBaziChart()
→ selectArchetypeCandidate()
```

Presentation Layer 不重新排八字，不随机生成十神，不随机生成 dimensions。

### Birth V1 UX

正式 Birth 页面已在 release branch 接入：

- 阳历出生日期
- 知道 / 不知道出生时间
- approximate time 支持
- male / female character selection
- V1 真实静态城市表
- IANA timezone resolution
- 手动 city / country / countryCode / lat / lon / timezone fallback
- DST ambiguous / nonexistent time 错误提示

`StaticLocationProvider + IanaHintTimezoneResolver` 被正式复用，因此纯免费 V1 不依赖 Live Location Provider，也没有伪造地理结果。

未知出生时间不会偷偷补中午 12:00；系统保留时柱未知的不确定性。

## 5. 10 Public Personalities

公网 V1 只使用 10 个锁定人格：

| Ten-God | Public personality |
| --- | --- |
| 比肩 | 犟种 |
| 劫财 | 撒币 |
| 食神 | 好吃懒做 |
| 伤官 | 天生反骨 |
| 正财 | 抠抠搜搜 |
| 偏财 | 搞钱圣体 |
| 正官 | 老干部 |
| 七杀 | 狠人 |
| 正印 | 活菩萨 |
| 偏印 | 道长 |

Canonical Registry：`lib/public-personalities.ts`。

覆盖状态：

- Registry：**10 / 10 implemented**
- Complete Public Copy：**10 / 10 implemented**
- six Tags：**10 / 10 implemented**
- Result copy contract：**10 / 10 implemented**
- Share copy contract：**10 / 10 implemented**

### Proxy honesty

当前完整 `TraditionalPatternResult` 仍未 Production-ready。

所以：

- `bi_jian → 犟种 / 建禄` 是 Presentation Proxy Mapping；
- `jie_cai → 撒币 / 月劫` 是 Presentation Proxy Mapping。

不得把它描述为 Engine 已经正式完成建禄/月劫格局判定。

## 6. Second Personality / Dimensions

Second Personality 正式消费：

`archetype_seed.secondary_ten_god`

不是第三种新人格，也不是随机标签。

Personality Dimensions 正式消费 `personality-map/0.2.0` 的真实 15 项 machine output，并只在公网做年轻化 label 翻译。

## 7. 25 Experimental Archetypes

`lib/personality-archetypes.ts` 中 5 Elements × 5 Families = 25 的体系，状态正式调整为：

**experimental / legacy presentation experiment**。

它们不再参与新 Public Result。

旧 `/report` 已在 release branch 退役为“深度报告即将开放”页面，不再生成 25 archetype 正式结果。

代码没有为了今晚粗暴删除，后续如要研究可继续保留。

## 8. Homepage / Birth / Result

Release branch 已完成：

### Homepage

- 首屏：“用八字测测，你到底是个什么东西。”
- CTA：“测测我是什么”
- 10 人格预览
- 确定性工作方式说明
- Personality Dossier Preview
- Share Card Preview
- 再次 CTA

### Birth

- 正式表单视觉
- deterministic normalization
- real Bazi + Interpretation
- session result handoff
- unknown-time/error state

### Result

已覆盖 18 段结构：

1. 人格身份
2. 朋友视角
3. A 面
4. 翻车面
5. 第二人格
6. Dimensions
7–14. 工作 / 学习 / 关系 / 冲突 / 压力 / 恢复 / 决策 / 金钱
15. 容易卡住的地方
16. 成长建议
17. 为什么得到这个结果
18. 专业八字依据折叠区

专业区显示真实 pillars / day master / engine version / mapping version / Birth warnings，并明确 Proxy boundary。

## 9. Share Loop V1

Release branch 已实现：

- 1080 × 1350 主卡 Canvas rendering
- 1080 × 1920 Story / 小红书卡 Canvas rendering
- Web Share files（浏览器支持时）
- PNG download fallback
- copy result
- stable production return URL

分享图使用和 Result 相同的正式 Character asset contract；如果 asset 缺失会明确失败，不会换成 CSS / SVG / placeholder。

## 10. Character Visual System V1

这是当前 **唯一最大的 Release Blocker**。

要求：

```text
3 distinct Style Pilot directions
↓
每套 4 人：
好吃懒做 male
天生反骨 female
狠人 male
道长 female
↓
Product Owner 选定
↓
冻结 Style Bible
↓
10 × male/female = 20 formal WebP
```

代码中的 20 个正式文件路径 contract 已建立：`public/characters/v1/{ten_god}-{gender}.webp`。

当前正式 binary 状态：**0 / 20**。

没有 placeholder 被提交，因此 Production Visual Gate 仍然 **CLOSED**。

## 11. CI / QA 状态

第一版 Release commit：`d6a2ddb`。

Vercel 第一次暴露 Result share flow nullable type error，已修复。

后续 Vercel Preview：**READY**。

GitHub Actions run #222 随后发现：

- `app/result/page.tsx` React 19 `set-state-in-effect` lint error
- 旧 `app/report/page.tsx` 同类 pre-existing lint error

release branch 已修复 Result hydration，并退役旧 experimental Report route。最新 HEAD 需要再次通过：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

最终不得有 skip / 降断言 / production personality mock。

## 12. Browser acceptance

最终合并前必须仍完成真实浏览器人工验收：

- 390px
- 430px
- 768px
- 1440px

检查：Homepage、Birth、Result Hero、Long Result、Characters、Share Card、Save / Share、Navigation、Reload、Back、Error、Unknown birth time。

当前只能确认 Vercel Preview HTTP 200 与 server render 正常；正式 Character Visual 与完整 viewport 人工验收尚未完成。

## 13. Tonight deferred

继续明确后置：

- Supabase Live
- Auth / Account
- Stripe / PayPal
- Credits
- AI Advisor
- Formal AI Provider
- Memory
- Analytics
- complex Traditional Pattern
- 用神 / 大量神煞
- 流月 / 流日 / 预测

这些不得反过来阻塞免费 V1 RC。

## 14. Production release gate

只有以下全部成立，PR #16 才能 Ready / merge：

- [x] 10 / 10 Public Registry
- [x] 10 / 10 complete Public Copy
- [x] deterministic Birth → Bazi → Interpretation → Public mapping
- [x] real secondary personality
- [x] real dimensions
- [x] full Result Dossier implementation
- [x] Share rendering implementation
- [ ] 3 visual pilots reviewed
- [ ] Product Owner selects one Character direction
- [ ] 20 / 20 formal character assets
- [ ] CI full green on final HEAD
- [ ] 390 / 430 / 768 / 1440 browser QA
- [ ] Share Card real-image QA
- [ ] final Production smoke test

Build success alone does not equal release completion.
