# 16 — Character Batch Production V1

状态：**PRODUCTION ACTIVE / Style LOCKED / Fixed 10-IP Contract**  
日期：2026-08-22  
项目：**Bazi Personality / 八字人格**

## 1. 唯一视觉锚点

所有正式角色生产必须先读取：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/13_PERSONALITY_IP_BIBLE.md`
- `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

正式风格：**Bold Graphic Character / Flat Editorial Character**  
世界观：**City Observation Editorial / 城市观察体**

硬规则：

> **动作可以重新设计；画风不得重新解释。**

禁止重新转向日系生活杂志线稿、半写实青年插画、动漫、Q 版、3D 玩具、古风、水墨或精致 AI 立绘。

## 2. 正式资产格式

正式目录：`public/characters/v1/`

命名：

```text
{ten_god}.webp
```

V1 只生产 10 个正式 Character Master，不再使用 `{ten_god}-male.webp / {ten_god}-female.webp` 双资产 contract。

建议生产母稿：4:5，1600 × 2000 或更高。  
正式网页导出：约 1200 × 1500 WebP，保留 alpha / 干净背景兼容性，控制文件体积。  
正式 Hero 不烘焙人格标题、说明文字或标签；文字由网页 / Share Card 排版系统负责。

## 3. 统一 Style DNA

- 成人轻卡通，约 4.5–5.2 头身
- 大块图形轮廓，形状先于细节
- 小眼、小嘴、简化鼻子
- 平面低饱和色块
- 阴影最多一层简单块面
- 轻微颗粒，不靠纸纹伪装手绘
- 发丝、布料、皮肤均不做写实细节渲染
- 不做 fashion model pose
- 不做统一漂亮脸
- 角色第一识别来源：**剪影 → 身体向量 → 头型发型 → 比例 → 色块 → 动作 → 五官**

## 4. 10 个固定 Character Master 生产矩阵

| Ten-God | Public identity | Canonical character | Body vector / silhouette | Accent |
| --- | --- | --- | --- | --- |
| `bi_jian` | 犟种 | 女 | 向前顶；方、稳、肩胯有支撑 | Brick Red |
| `jie_cai` | 撒币 | 男 | 向外打开；手臂动作最大 | Muted Orange |
| `shi_shen` | 享乐主义 | 男 | 向下舒展；软、宽、松 | Mustard |
| `shang_guan` | 天生反骨 | 女 | 斜向、逆向、不对称 | Cobalt Blue |
| `zheng_cai` | 抠抠搜搜 | 女 | 向内收；小、紧、克制 | Sage Green |
| `pian_cai` | 搞钱圣体 | 男 | 向前探；轻、快、灵 | Teal |
| `zheng_guan` | 老干部 | 女 | 向上立；直、正、对称 | Navy |
| `qi_sha` | 狠人 | 男 | 向下稳；短、重、方 | Deep Maroon |
| `zheng_yin` | 活菩萨 | 男 | 向外接纳；圆、柔、朝向他人 | Dusty Pink |
| `pian_yin` | 道长 | 女 | 向上漂；细、长、留白多 | Muted Purple |

角色性别属于固定 IP 设定，不跟随用户性别变化。

## 5. 人格动作锁定

### 犟种 / 比肩
核心动词：**顶 / 撑 / 扛 / 坚持**。双脚稳定、身体略向前，不让路但不凶。不得画成狠人。

### 撒币 / 劫财
核心动词：**给 / 拉 / 冲 / 加入**。身体打开，一只手主动伸向别人。不得只靠现金、红包、买单表达。

### 享乐主义 / 食神
核心动词：**尝 / 靠 / 闻 / 听 / 享受**。肩颈放松、身体舒展，可有杯子 / 耳机 / 小食但不依赖食物。禁止废宅、肥胖梗、邋遢、没上进心。

### 天生反骨 / 伤官
核心动词：**问 / 偏 / 拆 / 反**。明显不对称；身体与头部 / 视线形成方向错位。禁止朋克、全黑、链条代替人格表达。

### 抠抠搜搜 / 正财
核心动词：**算 / 收 / 存 / 整理**。动作幅度小，资源有明确去处。不是穷酸，而是精细管理。

### 搞钱圣体 / 偏财
核心动词：**发现 / 连接 / 交换 / 抓机会**。身体向前探，像随时发现连接点。禁止西装 + 钱 + 金链俗套符号。

### 老干部 / 正官
核心动词：**正 / 排 / 守 / 检查**。十人格里最轴对称、最端正。幽默来自环境越随意，她越正规。

### 狠人 / 七杀
核心动词：**做 / 扛 / 解决 / 拍板**。低重心、肩稳定、动作最少。禁止黑帮、杀手、军人 cosplay。

### 活菩萨 / 正印
核心动词：**听 / 接 / 扶 / 照顾**。身体自然朝别人倾斜，手势打开。禁止宗教视觉或夸张圣光。

### 道长 / 偏印
核心动词：**看 / 想 / 飘 / 研究**。人在场，头 / 视线却落在别处；留白最多。禁止道袍、符咒、太极、仙侠。

## 6. 固定角色规则

同一个人格从 Homepage、Result、Share Card 到后续社交内容必须使用同一个官方角色身份。

允许变化：

- 裁切
- 大小
- 背景
- 版式
- 同角色后续表情 / 动作 / 场景 Variant

不允许变化：

- 因用户性别更换成另一个人
- 同人格重新生成一张不同脸的“备用角色”
- 首页、结果页、分享卡使用彼此不一致的 Character identity

## 7. 正式生成模板

```text
REFERENCE
Use docs/assets/character-style-master-v1.webp as the single visual anchor.
Match its flat graphic character language closely.
Do not reinterpret the style.

IDENTITY
{public identity} / {ten_god} / fixed canonical character

BODY VECTOR
{locked body vector}

SIGNATURE POSE
{locked pose description}

FACE / HAIR
Design one distinctive permanent identity for this personality.
Do not create a gender alternate.

COLOR
Warm ivory + Ink black + personality accent {accent}

RENDER
adult light-cartoon 4.5–5.2 heads, bold flat shapes, simplified facial features,
muted editorial colors, minimal one-layer shadow, subtle grain,
clean brand-character silhouette, no detailed fabric or realistic hair.

OUTPUT
single formal hero character, no baked text, no character sheet layout,
no typography, no watermark, no complex background.
```

## 8. Negative production guardrails

Reject immediately if generation drifts into：anime / manga / semi-real anime、Q 版、Japanese lifestyle sketch、watercolor、glossy 3D、fashion model / idol face、realistic city scene、perfect AI face、traditional Chinese costume / xianxia / Taoist props、generic black-clothes rebel、gangster / military stereotype。

## 9. 生产顺序

### Gate A — 4 Production Pilots

1. `shi_shen.webp` — 享乐主义：测试“松弛但不懒”
2. `shang_guan.webp` — 天生反骨：测试“反骨但不朋克”
3. `qi_sha.webp` — 狠人：测试“强但不黑帮”
4. `pian_yin.webp` — 道长：测试“抽离但不玄学 cosplay”

Gate A 必须同时通过：

- 四张看起来是同一画师 / 同一产品
- 面部语言一致但不是同一张脸
- 四个剪影明显不同
- 缩小后仍有辨识度
- 没有退回旧 AI 立绘或日系线稿风

### Gate B — 完成 10 / 10 Character Masters

Pilot 通过后依次完成：

```text
犟种
撒币
抠抠搜搜
搞钱圣体
老干部
活菩萨
```

每个人格只有一个最终身份。不得补画男 / 女 alternate 作为 release requirement。

### Gate C — 10 / 10 Integration

10 张正式 WebP 到位后：

- Homepage 10-card
- Birth：移除“角色性别选择”语义；若保留用户性别，只作为八字计算数据
- Result Hero
- secondary personality character
- 1080×1350 Share Card
- 1080×1920 Story / XHS
- 390 / 430 / 768 / 1440 viewport

全部 QA 后解除 Production Visual Gate。

## 10. 最终验收问题

每张角色都必须能回答 YES：

1. 不看名字，轮廓是否像一个独立的人？
2. 和另外 9 个缩成小卡后是否明显不同？
3. 面部 / 上色是否与锁定母版属于同一画风？
4. 人格是否主要靠姿势和身体方向表达，而不是靠道具？
5. 去掉玄学背景后人格是否仍成立？
6. 这个角色是否能长期作为该人格唯一官方 IP？
7. 是否避开“漂亮 AI 年轻人换衣服”的统一脸问题？
8. 是否能直接进入 Homepage / Result / Share Card，不需要风格返工？

只有全部通过，才能标记该资产为 **FORMAL V1**。
