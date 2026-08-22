# 09 — Current State

状态：**V1 Release Freeze — Fixed 10-IP + Personality Mix + Final QA Active**  
最后更新：2026-08-22

## 0. Source of Truth boundary

本文件只描述：**现在真实做到哪里**。

Source of Truth precedence：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/09_CURRENT_STATE.md`
3. `docs/10_ROADMAP.md`
4. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`
5. older docs / experiments / historical research

如果本文件与 `docs/13_PERSONALITY_IP_BIBLE.md` 冲突，以 Personality IP Bible 为准。

## 1. 当前产品与 Release Freeze

产品已正式收敛为：

**八字版 SBTI + 10 个固定人格 IP + 免费主人格完整解析 + 免费人格因子配比 + 分享传播 + Post-V1 深度人格光谱付费解析。**

V1 唯一发布目标：

```text
Homepage
→ Birth
→ deterministic Bazi
→ Interpretation
→ Personality Mix
→ 10 Public Personalities
→ dominant full Personality Dossier
→ fixed official Character IP
→ Share Card
→ friend can open the website and test
```

AI、Payment、Supabase、Advisor、Relationship 不是当前 V1 release blocker。

## 2. Repository / PR baseline

当前工作分支：`release/v1-personality-rc`  
当前 Draft PR：`#16 release: V1 public personality experience`  
PR base：`main`。

Vercel Production：`bazi-ai-advisor.vercel.app`。

Preview 可用于 QA；PR #16 在 Personality Mix、10 / 10 fixed formal Character assets 与最终 QA 完成前保持 Draft。

## 3. Deterministic Core Chain

已经进入 `main` 的核心事实链保持为：

```text
Birth
→ Bazi Engine
→ Interpretation
```

公网 V1 正式复用：

```text
normalizeBirthProfile()
→ calculateBazi()
→ interpretBaziChart()
→ selectArchetypeCandidate()
```

Presentation Layer 不重新排八字，不随机生成十神，不随机生成 dimensions。

### Personality Mix — NEW V1 CONTRACT / NOT YET IMPLEMENTED

2026-08-22 Product Owner 已新增 V1 正式要求：

> 免费结果必须显示用户的 10 个 Public Personality 因子比例；但只完整详细解析主人格，其他人格主要显示名称 + 比例。

当前仓库已存在 dominant / secondary personality 与 15 dimensions，但尚未确认现有 `personality-map/0.2.0` 是否已经提供可直接公开、归一化到统一尺度的 10 因子权重。

因此当前真实状态是：

- 主人格：implemented
- 第二人格：implemented
- 15 dimensions：implemented
- **10 因子 Personality Mix：product contract locked / implementation pending**

实现必须使用 deterministic / versioned normalization rules；不得由 LLM 或前端随机生成百分比。

### Birth V1 UX

release branch 已接入：

- 阳历出生日期
- 知道 / 不知道出生时间
- approximate time 支持
- 用户性别字段
- V1 真实静态城市表
- IANA timezone resolution
- 手动 location / timezone fallback
- DST ambiguous / nonexistent time 错误提示

**重要：2026-08-22 新产品 contract 已取消“用户性别 → 男 / 女 Character”的映射。**

用户性别若仍为 deterministic Bazi Engine 所需，可继续作为排盘数据；但现有 UI / character routing 中任何“male / female character selection”语义都属于 **legacy pending refactor**。

## 4. 10 Public Personalities — LOCKED

| Machine key | Ten-God | Public personality |
| --- | --- | --- |
| `bi_jian` | 比肩 | 犟种 |
| `jie_cai` | 劫财 | 撒币 |
| `shi_shen` | 食神 | 享乐主义 |
| `shang_guan` | 伤官 | 天生反骨 |
| `zheng_cai` | 正财 | 抠抠搜搜 |
| `pian_cai` | 偏财 | 搞钱圣体 |
| `zheng_guan` | 正官 | 老干部 |
| `qi_sha` | 七杀 | 狠人 |
| `zheng_yin` | 正印 | 活菩萨 |
| `pian_yin` | 偏印 | 道长 |

Canonical Registry：`lib/public-personalities.ts`。

当前覆盖：

- Registry：**10 / 10 implemented**
- Complete Public Copy：**10 / 10 implemented**
- six Tags：**10 / 10 implemented**
- Result copy contract：**10 / 10 implemented**
- Share copy contract：**10 / 10 implemented**

完整 `TraditionalPatternResult` 仍未 Production-ready；`bi_jian → 建禄` 与 `jie_cai → 月劫` 仍只是 Presentation Proxy Mapping。

## 5. Public experience implementation

### Second Personality / Dimensions

Second Personality 正式消费 `archetype_seed.secondary_ten_god`。

Personality Dimensions 正式消费 `personality-map/0.2.0` 的真实 15 项 machine output。

### Homepage

release branch 已实现：首屏定位与 CTA、10 人格预览、确定性工作方式说明、Dossier Preview、Share Card Preview、再次 CTA。

### Result

已实现完整 18 段 Personality Dossier，并展示真实 second personality、15 dimensions 与专业八字依据折叠区。

**待更新：**在 Result 中新增免费 Personality Mix 展示；主人格继续保留完整 Dossier，其他人格只显示比例 / 简短标记，不展开深度解析。

### Share Loop

已实现：

- 1080 × 1350 feed card Canvas rendering
- 1080 × 1920 Story / XHS card Canvas rendering
- Web Share files（支持时）
- PNG download fallback
- copy result
- stable production return URL

**待更新：**Share Card 建议加入 Top 3 Personality Mix 摘要，强化同主人格用户之间的个体差异与比较传播。

正式 Character asset 缺失时 Share Card 必须显式失败，不允许 placeholder。

## 6. Character Visual System V1 — FIXED 10-IP / PRODUCTION ACTIVE

Character Style selection 已完成。

Canonical references：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`
- `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

正式风格：**Bold Graphic Character / Flat Editorial Character**。  
世界观：**City Observation Editorial / 城市观察体**。

硬规则：**pose may be redesigned; style may not be reinterpreted.**

### New formal asset contract

```text
public/characters/v1/{ten_god}.webp
```

共 **10 fixed Character Master assets**。

当前仓库真实状态：`public/characters/v1/` 只有 `README.md`，因此正式 Character binary 数量仍是：**0 / 10**。

旧 `{ten_god}-{gender}.webp` 以及任何用户性别驱动角色选择逻辑，均属于 **legacy pending refactor**，不得继续作为新生产标准。

当前最大 Release Blocker：

**Personality Mix implementation + fixed 10-IP contract refactor + 10 / 10 formal Character Masters + final QA**。

## 7. 当前 V1 P0 执行顺序

1. 固定 10-IP / Personality Mix contract 文档同步
2. 确认现有 machine output 是否足够构建 10 因子权重
3. 实现 versioned Personality Mix normalization contract
4. 重构 legacy gender-based Character routing / filenames
5. Result / Share Card 接入免费 Personality Mix
6. 10 / 10 formal Character Masters
7. Homepage Character integration QA
8. Result Character integration QA
9. Share Card real-image QA
10. mobile browser QA
11. full CI
12. PR #16 Ready
13. merge main
14. Vercel Production
15. final public smoke test

## 8. 完整产品设计已补齐

`docs/17_PRODUCT_DESIGN_REPORT_V1.md` 已正式定义：

- 10 个固定官方 IP
- 免费主人格完整 Personality Dossier
- 免费 10 因子 Personality Mix
- 其他人格免费显示比例、不展开详细解析
- 《疯传》传播结构
- Post-V1 `Bazi Personality Spectrum / 八字人格光谱` 深度解析
- `1 主人格 + 1–2 副人格 + N deterministic 修正因子`
- 人格纯度 / 结构清晰度概念
- 免费 → 付费转化逻辑
- LLM 只解释、不重新排盘、不编造比例的专业边界

付费不卖“看比例”的资格，而卖“为什么会是这些比例、它们怎样互相作用”的解释。

## 9. CI / Browser acceptance pending

最终 asset-integrated HEAD 仍必须通过：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

最终浏览器验收至少覆盖：390px / 430px / 768px / 1440px。

重点检查 Homepage、Birth、Personality Mix、Result Hero、Long Result、fixed Characters、Share Card、Save / Share、Navigation、Reload、Back、Error、Unknown birth time。

## 10. Post-V1 / V1.1 Parking Lot

当前仍 PARKED：

- 双人人格关系 / compatibility
- referral / invitation challenge
- AI Advisor / AI Chat
- payment / ¥9.9 report checkout
- **Bazi Personality Spectrum 深度解析 / checkout**
- Supabase Live / Auth / Account
- Analytics full system
- ranking / rarity
- new personality types
- new Character Style
- 用神 / 流月 / 流日
- complex Traditional Pattern expansion
- community / gamification

注意：**免费 Personality Mix 已从 Post-V1 移入 V1 P0；只有深度光谱解析仍属于 Post-V1。**

## 11. Production release gate

已完成：

- [x] 10 / 10 Public Registry
- [x] 10 / 10 complete Public Copy
- [x] deterministic Birth → Bazi → Interpretation → Public mapping
- [x] real secondary personality
- [x] real dimensions
- [x] full dominant Result Dossier implementation
- [x] Share rendering implementation
- [x] Character Style selected and LOCKED
- [x] fixed 10-IP product contract approved
- [x] free Personality Mix product contract approved
- [x] complete paid-spectrum design documented

仍阻塞发布：

- [ ] deterministic / versioned 10-factor Personality Mix implementation
- [ ] Result Personality Mix UI
- [ ] Share Card Top-factor mix integration
- [ ] legacy gender-based character routing refactor
- [ ] 10 / 10 formal Character Masters
- [ ] Homepage / Result / Share Card real-image QA
- [ ] mobile / viewport browser QA
- [ ] full CI on final asset-integrated HEAD
- [ ] PR #16 Ready / merge main
- [ ] Vercel Production
- [ ] final public smoke test

**V1 必须完整；免费用户可以看到自己的真实人格配方，但详细多因子解析留给付费层。**
