# 10 — Roadmap

状态：**V1 Release Freeze — Fixed 10-IP + Personality Mix P0 Closure**  
最后更新：2026-08-22

## 0. Roadmap boundary / Source of Truth

本文件只描述：**接下来做什么**。

Source of Truth precedence：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/09_CURRENT_STATE.md`
3. `docs/10_ROADMAP.md`
4. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`
5. older docs / experiments / historical research

## 1. V1 Release Freeze objective

V1 的唯一目标：让陌生用户完整走通：

```text
Homepage
→ Birth
→ deterministic Bazi
→ Interpretation
→ deterministic Personality Mix
→ dominant Public Personality
→ dominant full Personality Dossier
→ 10 fixed official Character IPs
→ Share Card with personalized mix summary
→ friend can open the website and test
```

V1 必须是完整产品体验，不是 prototype。

Payment、AI Advisor、Supabase Live、付费八字人格光谱深度解析等未来能力不作为首发阻塞项。

## 2. P0 — Release closure sequence

当前严格按以下顺序执行：

1. Documentation / Source of Truth sync
2. Audit current machine outputs for 10-factor weighting
3. Implement versioned Personality Mix normalization contract
4. Refactor legacy gender-based Character contract
5. Integrate free Personality Mix into Result / Share Card
6. 10 / 10 formal Character Masters
7. Homepage Character integration QA
8. Result Character + Personality Mix QA
9. Share Card real-image + Top-factor mix QA
10. mobile browser QA
11. full CI
12. PR #16 Ready
13. merge main
14. Vercel Production
15. final public smoke test

当前最大 Release Blocker：

**Personality Mix implementation + legacy gender contract refactor + 10 / 10 fixed Character Masters + final QA**。

## 3. P0.1 — Personality Mix Contract

状态：**NEXT / BLOCKER**。

2026-08-22 Product Owner 已正式锁定：

> **免费用户必须看到自己的人格因子比例，但免费只完整详细解析主人格。**

V1 免费结果要求：

```text
10 个 Public Personality 因子比例
+
主人格完整解析
+
第二人格名称 / 比例
+
其他人格名称 / 比例
```

其他人格免费不展开：

- 深层成因；
- 与主人格的组合机制；
- 多因子内在矛盾；
- 混合度 / 清晰度专业解释；
- 工作、金钱、关系等组合效应。

这些留给 Post-V1 `Bazi Personality Spectrum` 深度解析。

### Machine implementation requirements

先审计现有 `personality-map/0.2.0` / Interpretation 输出，确认是否已有可复用的 10 因子 raw weights。

如果没有可直接公开的归一化比例，则实现一个明确版本化的 normalization contract。

硬规则：

- deterministic；
- stable / reproducible；
- 统一尺度，建议归一化到 100%；
- 主人格 / 第二人格与现有结果保持兼容，或通过版本迁移明确解释；
- LLM 不参与数值计算；
- 前端不得随机造比例；
- tests 覆盖同盘复算一致性、排序与 normalization。

## 4. P0.2 — Fixed 10-IP Contract Refactor

2026-08-22 Product Owner 已正式锁定：

> **10 Public Personality = 10 个固定官方 IP。**

旧逻辑：

```text
{ten_god}-male.webp
{ten_god}-female.webp
用户性别 → Character asset
```

新逻辑：

```text
{ten_god}.webp
Public Personality → 唯一固定 Character asset
```

执行要求：

- 移除代码中的 male / female character filename routing；
- Birth 若仍收集用户性别，只保留 deterministic Bazi calculation 语义；
- UI 不再把性别描述为角色选择；
- Result Hero 只按 dominant personality 选择固定角色；
- secondary personality 也只按 personality key 选择固定角色；
- Share Card 只按 personality key 选择固定角色；
- tests / manifests / types / docs 全部同步；
- 不得保留“缺固定角色时回退到 gender asset”的双轨逻辑。

## 5. P0.3 — Result / Share Personality Mix Integration

### Result

必须新增“我的八字人格配方 / Personality Mix”模块。

推荐 UI：

- Hero 先给主人格；
- 主人格式完整 Dossier；
- 在首屏后较靠前位置展示 Personality Mix；
- 默认 Top 4–5，可展开全部 10 个；
- 主人格视觉突出；
- 第二人格明确标记；
- 其余只显示名称 + 百分比；
- 不用付费锁遮住百分比。

### Share Card

建议显示 Top 3 人格配比摘要，例如：

```text
天生反骨 41%
搞钱圣体 26%
狠人 14%
```

不把全部十项塞进分享卡，以免破坏视觉冲击。

传播目标：让同一主人格用户仍能比较“为什么我们的配方不一样”。

## 6. P0.4 — 10 / 10 formal Character Masters

正式目录：`public/characters/v1/`

正式资产：

```text
bi_jian.webp        # 犟种 · 固定女角色
jie_cai.webp        # 撒币 · 固定男角色
shi_shen.webp       # 享乐主义 · 固定男角色
shang_guan.webp     # 天生反骨 · 固定女角色
zheng_cai.webp      # 抠抠搜搜 · 固定女角色
pian_cai.webp       # 搞钱圣体 · 固定男角色
zheng_guan.webp     # 老干部 · 固定女角色
qi_sha.webp         # 狠人 · 固定男角色
zheng_yin.webp      # 活菩萨 · 固定男角色
pian_yin.webp       # 道长 · 固定女角色
```

Canonical references：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

正式风格：**Bold Graphic Character / Flat Editorial Character**。  
世界观：**City Observation Editorial / 城市观察体**。

硬规则：**pose may be redesigned; style may not be reinterpreted.**

当前正式 binary 状态：**0 / 10**。

## 7. P0.5 — Integration QA

### Homepage

- 10 personality cards 使用固定正式 Character；
- 缩小后人格识别度足够；
- 不出现 fallback / gender alternate；
- 首屏加载策略正常。

### Birth

- 用户性别若保留，仅作为排盘数据；
- 不出现“选择男 / 女角色”产品语义；
- 不因为用户性别改变最终 Character。

### Result

- dominant personality Hero 正确；
- Personality Mix 数字来自 deterministic output；
- 主人格与比例排序一致；
- secondary personality 与比例一致；
- 其他因子不展开深度付费解析；
- 同人格所有用户看到同一个固定 Character；
- reload / back / error state 不出现 placeholder。

### Share Card

- 1080 × 1350 feed card；
- 1080 × 1920 Story / XHS card；
- 固定 Hero Character 清晰；
- Top-factor mix 摘要正确；
- Web Share / PNG fallback / copy result；
- 缺图必须显式失败。

## 8. P0.6 — Mobile / browser QA

至少完成：390px / 430px / 768px / 1440px。

完整走查：

```text
Homepage → Birth → Personality Mix → Result → Share Card → public return URL
```

同时覆盖 unknown birth time、invalid/custom location、reload、back、navigation 与 share fallback。

## 9. P0.7 — Full CI / PR / Production

最终 asset-integrated HEAD 必须通过：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

通过后：

```text
PR #16 Draft
→ Ready for review
→ merge main
→ Vercel Production
→ final public smoke test
```

## 10. 完整产品方向

`docs/17_PRODUCT_DESIGN_REPORT_V1.md` 已定义完整产品终局：

```text
10 fixed Public Personality IPs
→ 免费主人格完整 Dossier
→ 免费 Personality Mix
→ Share Loop
→ Bazi Personality Spectrum 深度解析（付费）
→ 更深层报告
→ AI Advisor / 后续顾问能力
```

关键商业原则：

> **免费给数值与主人格解析；付费解释组合、成因与现实影响。**

任何比例 / 纯度 / 权重不得由 LLM 自行编造。

## 11. Post-V1 / V1.1 Parking Lot

当前 PARKED：

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

**免费 Personality Mix 已正式移入 V1 P0，不再属于 Post-V1。**

## 12. V1 release rule

**不扩无关 Scope，不降质量。**

V1 的完整性标准现在包括：

- 真正可复算的人格比例；
- 主人格完整解析；
- 其他因子比例透明；
- 10 个固定 Character IP；
- 好看的个性化 Share Card；
- 完整手机端闭环。

付费层可以之后上线，但免费层不能靠假百分比或故意隐藏人格配方来制造付费。
