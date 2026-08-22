# 13 — Personality IP Bible V1

状态：**V1 Release Freeze / Product LOCKED / Character Style LOCKED / Traditional Translation Doctrine LOCKED**  
最后更新：2026-08-22

## 0. Governance / Source of Truth precedence

V1 项目治理优先级固定为：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/09_CURRENT_STATE.md`
4. `docs/10_ROADMAP.md`
5. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`
6. older docs / experiments / historical research

如果旧文档、实验代码或历史研究与本文件冲突，以本文件为准。

## 1. 产品定位

V1 是：

**传统八字命理结构 → 现代人格翻译 → 10 个固定官方 IP → 完整免费人格 Dossier → 分享传播闭环。**

核心原则：

> **传统命理负责判断，现代产品负责翻译。**

产品语气：

> **里面认真算，外面认真发疯。**

本产品不创造新的“八字人格学”，不通过自造权重重新定义格局，也不让 LLM 重新排盘或取格。

完整方向：

```text
出生信息
→ deterministic Birth normalization
→ deterministic Bazi calculation
→ Traditional Structure / Pattern judgment
→ evidence-backed modern translation
→ Public Personality
→ fixed official Character IP
→ full Personality Dossier
→ Share Card
```

## 2. 10 Public Personalities — LOCKED

| Machine / traditional archetype | Public Personality |
| --- | --- |
| `bi_jian` | 犟种 |
| `jie_cai` | 撒币 |
| `shi_shen` | 享乐主义 |
| `shang_guan` | 天生反骨 |
| `zheng_cai` | 抠抠搜搜 |
| `pian_cai` | 搞钱圣体 |
| `zheng_guan` | 老干部 |
| `qi_sha` | 狠人 |
| `zheng_yin` | 活菩萨 |
| `pian_yin` | 道长 |

`shi_shen → 享乐主义` 已替代旧名称“好吃懒做”；旧名 retired。

### 重要语义

10 个 Public Personality 是 **传统十神 / 格局原型的现代人格翻译标签**，不是传统格局本身。

因此：

- `天生反骨` 不等于“用户一定是标准伤官格”；
- `搞钱圣体` 不等于“财星数量最大”；
- Public Personality 必须能回溯到传统命盘结构与证据；
- 不成格、兼格、破格、从格、混合结构都必须被允许，不能为了人格分类强行判成纯型。

## 3. Traditional Bazi → Personality Translation Contract

正式规则见：

`docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`

核心边界：

### 3.1 Traditional Layer

负责判断：

- 月令 / 透干 / 藏干 / 根气；
- 十神结构；
- 旺衰；
- 格局候选；
- 成格 / 败格 / 破格 / 救应；
- 从格 / 特殊格局；
- 组合关系；
- 不确定性与流派差异。

### 3.2 Translation Layer

只负责把已经得到的传统结构翻译成：

- 主 Public Personality；
- 明显副倾向；
- 场景化现代文案；
- Character IP；
- Share Card 文案。

Translation Layer 不得反向修改传统命理结果。

### 3.3 Existing personality-map/0.2.0 status

当前 `personality-map/0.2.0` 中存在现代工程化 candidate ranking / dimension weighting。

这些内容可以保留作：

- historical experiment；
- presentation research；
- future calibration reference。

但不得再被描述为“传统命理本身的准确人格算法”，也不得成为未来专业报告的 Traditional Pattern Source of Truth。

## 4. 关于人格比例 / Personality Mix

此前规划的“10 人格精确百分比”暂停作为正式 V1 contract。

原因：传统八字没有一套跨流派统一、天然等同于人格百分比的标准。

在没有锁定传统依据的量化方法之前：

- 禁止展示伪精确 `41% 天生反骨 / 26% 搞钱圣体`；
- 禁止把现有工程化 `candidate_score` 归一化后包装成人格比例；
- 禁止把 `tenGodDistribution` 直接等同于 Public Personality 百分比。

V1 免费层可以展示：

```text
主导：天生反骨
明显副倾向：搞钱圣体
辅助：狠人
结构状态：混合 / 较清晰 / 存在争议
```

这些强弱与层级必须来自传统规则证据。

未来若实现百分比，必须先完成传统来源锁定、规则版本化、典型命例回测与可复算验证。

## 5. Public Copy Contract

每个 Public Personality 必须完整提供：

- `display_name`
- `traditional_label`
- `anchor_quote`
- `one_line_roast`
- `short_description`
- 6 × Tags
- `friend_view`
- `positive_mode`
- `flip_mode`
- `work_mode`
- `learning_mode`
- `relationship_mode`
- `conflict_mode`
- `stress_mode`
- `recovery_mode`
- `decision_mode`
- `money_mode`
- `growth_advice`
- `secondary_personality_copy`
- `share_card_copy`
- `paid_report_teaser`

公网语言必须年轻、具体、有生活场景、有损但不恶毒；禁止 AI 心理报告腔和传统命理套话。

Canonical implementation：`lib/public-personalities.ts`。

## 6. Character Visual System V1 — FIXED 10-IP CONTRACT

**10 Public Personality = 10 个固定官方 Character IP。**

取消旧的“每个人格 male + female 两个正式角色”contract。

Character 代表人格本身，不代表用户本人。用户性别不得改变 Character identity。

### Canonical Character identities

| Machine key | Public personality | Canonical Character |
| --- | --- | --- |
| `bi_jian` | 犟种 | 固定女性角色 |
| `jie_cai` | 撒币 | 固定男性角色 |
| `shi_shen` | 享乐主义 | 固定男性角色 |
| `shang_guan` | 天生反骨 | 固定女性角色 |
| `zheng_cai` | 抠抠搜搜 | 固定女性角色 |
| `pian_cai` | 搞钱圣体 | 固定男性角色 |
| `zheng_guan` | 老干部 | 固定女性角色 |
| `qi_sha` | 狠人 | 固定男性角色 |
| `zheng_yin` | 活菩萨 | 固定男性角色 |
| `pian_yin` | 道长 | 固定女性角色 |

整体 5 男 + 5 女，仅用于 IP 世界观平衡。

### Asset contract

```text
public/characters/v1/{ten_god}.webp
```

正式资产：

```text
bi_jian.webp
jie_cai.webp
shi_shen.webp
shang_guan.webp
zheng_cai.webp
pian_cai.webp
zheng_guan.webp
qi_sha.webp
zheng_yin.webp
pian_yin.webp
```

角色风格仍以：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

为唯一视觉锚点。

硬规则：**pose may be redesigned; style may not be reinterpreted.**

## 7. Free Result Dossier

免费产品必须完整、有价值、可分享。

V1 Result 至少包含：

1. 主人格 Hero；
2. 主导 / 明显副倾向 / 辅助结构摘要；
3. 朋友眼里的你；
4. A 面；
5. 翻车面；
6. 第二人格 / 次级倾向；
7. 现代行为维度（只能作为解释辅助，不能反向决定传统格局）；
8. 工作；
9. 学习；
10. 关系；
11. 冲突；
12. 压力；
13. 恢复；
14. 决策；
15. 金钱；
16. 卡点；
17. 成长建议；
18. 为什么得到这个人格；
19. 专业八字依据折叠区。

免费层完整解析主人格；其他倾向只做轻量提示。

## 8. Professional / Paid Report Direction

付费报告的价值不是“多写几千字”，而是解释传统结构为什么形成这种现代人格表达。

专业报告应明确分区：

### A. Traditional Bazi Structure

- 采用的规则体系；
- 月令 / 十神 / 透藏 / 根气；
- 旺衰；
- 格局判断；
- 成败 / 破格 / 救应；
- 从格 / 特殊结构；
- 组合关系；
- 不确定性 / 流派差异。

### B. Modern Personality Translation

- 主人格为什么这样翻译；
- 次级倾向从哪里来；
- 为什么同一个 Public Personality 的两个人仍然不同；
- 工作 / 金钱 / 关系 / 压力下如何表达。

付费层卖的是：**传统结构的深入解释与现代化翻译**，不是自造人格算法。

## 9. Share Loop V1

至少提供：

- 1080 × 1350 主分享卡；
- 1080 × 1920 Story / 小红书版；
- 保存图片；
- Web Share API（支持时）；
- 下载 fallback；
- 复制结果。

分享卡包含：人格大名、固定 Character、锚点句、3–5 Tags、毒舌总结、品牌、回流 URL。

可以加入：

```text
主导：天生反骨
明显副倾向：搞钱圣体
```

暂不加入没有传统依据的精确人格百分比。

## 10. V1 Release Freeze

当前 V1 不再以 Personality Mix 数字化为 release requirement。

新的 P0 顺序必须先保证传统命理判断链可信：

```text
Audit existing Bazi rules
→ classify traditional / school-choice / experimental rules
→ define TraditionalPatternResult contract
→ remove engineering personality ranking from authoritative path
→ modern translation mapping
→ fixed 10 Character IPs
→ Result / Share integration
→ QA / CI / Production
```

Payment、AI Advisor、Supabase Live 等仍不是首发 blocker。

## 11. Definition of Done

陌生用户完成测试后：

```text
真实排盘
→ 传统规则可追溯的结构判断
→ 明确主导 / 副倾向
→ 翻译为 Public Personality
→ 完整主人格 Dossier
→ 固定 Character IP
→ 专业依据可展开查看
→ 生成分享卡
→ 好友回流继续测试
```

同时必须满足：

- 传统判断规则来源可追溯；
- 自造工程化人格权重不进入 authoritative path；
- 不成格 / 从格 / 混合结构可以诚实表达；
- 10 / 10 Character Master 到位；
- 无 gender 双角色依赖；
- 无 placeholder；
- mobile QA / final CI / smoke test 通过。
