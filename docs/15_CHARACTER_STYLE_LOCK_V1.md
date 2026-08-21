# 15 — Character Style Lock V1

状态：**LOCKED / Product Owner approved**  
锁定日期：2026-08-21  
系统：**Bazi Personality Character Visual System V1**

## 1. 唯一视觉母版

后续所有 V1 正式角色绘制，必须以以下参考图为唯一画风锚点：

- `docs/assets/character-style-master-v1.webp`
- 来源：Product Owner 在 2026-08-21 明确确认满意的四角色 Style Bible / Pilot 总览图
- 原始上传 PNG SHA-256：`30d917df1b81a0242cff24955a14cf39d5d355ad8606b807a6dfd2d6f4acf436`
- 仓库存档 WebP SHA-256：`3e12c2c4e227249db9d13c353d22ed75cde23048846ea1d25dfbf19a5dc2835c`

> **规则：动作可以重新设计；画风不得重新解释。**

任何后续 Agent / 生图模型 / 设计师都必须先读取本文件与母版图，再开始角色生产。

## 2. 正式风格名称

主名称：**Bold Graphic Character / Flat Editorial Character**  
系统世界观名称：**City Observation Editorial / 城市观察体**

这里的 `City Observation Editorial` 只保留生活观察与人格行为逻辑；正式人物画风以母版图里的扁平图形角色系统为准，不再回到写实或日系生活杂志插画。

## 3. Locked Style DNA

### 3.1 人物比例

- 成人轻卡通比例
- 约 4.5–5.2 头身
- 头略大于真人，但不能 Q 版
- 身体比例允许夸张，用于强化人格剪影
- 手、鞋、肩宽、腿长可以按人格主动制造差异

### 3.2 面部

- 小眼睛、小嘴、简化鼻子
- 五官少而明确
- 不追求偶像式漂亮脸
- 不做写实皮肤与精细光影
- 不做动漫大眼与高光
- 不做所有角色同一张 AI 标准脸
- 允许轻微不对称、不同脸宽、不同下颌、不同眼距

### 3.3 图形语言

- 大块几何轮廓
- 清晰色块
- 人物首先通过剪影与姿势识别
- 衣服是形状，不是布料渲染展示
- 头发优先作为整体块面处理，不逐根描绘
- 缩小到 Homepage 小卡仍然能够识别人格

### 3.4 线条与渲染

- 少量、明确、稳定的轮廓线
- 平面低饱和色块
- 阴影最多保留一层简化块面
- 允许轻微印刷颗粒 / 纸感，但纹理只能辅助
- 禁止铅笔速写主导
- 禁止复杂手绘线稿主导
- 禁止半写实体积光
- 禁止 Cinematic AI portrait rendering

### 3.5 色彩

全局基础：

- Warm Ivory
- Ink Black
- Deep Burgundy / Cinnabar Red
- Muted Navy
- Sage Green
- Dusty Purple

人格允许拥有低饱和 Accent Color，但十个人并排时必须像同一套 Editorial Brand System，而不是游戏角色选择界面。

## 4. 识别优先级

固定顺序：

```text
Silhouette
→ Body Language
→ Hair / Head Shape
→ Body Proportion
→ Major Color Blocks
→ Props / Scene
→ Facial Detail
```

如果必须靠文字或五官才能区分两个人格，则该角色设计未通过。

## 5. 当前首批四人格的形状语法

### 享乐主义（男） / 食神

- 公开名称：**享乐主义**（已替代“好吃懒做”）
- 轮廓：软、宽、舒展
- 身体：松弛、打开、自然下沉
- 禁止：废宅、懒汉、胖、瘫、没有上进心
- 表达：会享受、懂体验、有生活感、有审美、让自己舒服

### 天生反骨（女） / 伤官

- 轮廓：斜、不对称、有逆向运动感
- 核心：不盲从、有主见、先问为什么
- 动作可以继续迭代，但必须保留母版的脸、比例、块面、上色与整体角色语言
- 禁止：靠朋克、全黑、链条、Goth stereotype 来证明“反骨”

### 狠人（男） / 七杀

- 轮廓：重、方、低重心
- 动作：少、直接、稳定
- 核心：别人还在讨论，他已经开始解决
- 禁止：黑帮、杀手、暴力狂、军人 cosplay

### 道长（女） / 偏印

- 轮廓：细、长、留白多
- 核心：观察、抽离、精神世界丰富
- 禁止：道袍、符咒、太极、仙侠、宗教 cosplay

## 6. Anti-Drift / 禁止风格漂移

后续生成一旦出现以下任意特征，应直接判定为视觉漂移：

- 日系生活杂志插画
- 铅笔 / 钢笔速写感成为主视觉
- 半写实人物
- Anime / Manga / Chibi
- 游戏抽卡立绘
- AI influencer / AI beauty face
- 复杂真实城市背景
- 过度布料细节
- 复杂头发丝
- 柔光写实皮肤
- 全员统一时尚 Pose
- 通过纸纹或颗粒强行伪装“手绘”
- 重新设计一套新的五官系统

## 7. 生产规则

### Style is immutable; pose is mutable.

允许改变：

- Signature Pose
- 手势
- 重心
- 行动方向
- 场景行为
- 道具

不得改变：

- 人物比例母体
- 面部语言
- 头发块面语言
- 线条粗细逻辑
- 扁平色块逻辑
- 阴影复杂度
- 低饱和 Editorial Palette
- 总体品牌角色感

## 8. 下一阶段生产顺序

先完成四个 Production Pilot：

1. `享乐主义 · 男`
2. `天生反骨 · 女`
3. `狠人 · 男`
4. `道长 · 女`

通过以下 Gate 后才扩展到 20 张：

```text
母版风格一致性
→ Black Silhouette Test
→ Face consistency
→ Homepage 140px recognition
→ Result Hero compatibility
→ 4:5 / 9:16 Share Card compatibility
→ Product Owner approval
```

然后再生产 10 人格 × 男女 = 20 个正式 V1 角色资产。

## 9. 一句话 Style Definition

> **八字人格 V1 的角色，是生活在同一个现代城市里的十种年轻人格。人物用大块图形、成人轻卡通比例、低饱和色彩、强剪影和身体语言表达性格；不靠漂亮脸、玄学服装、复杂场景或 AI 精致渲染成立。**

## 10. Release Gate

本文件与母版图一经锁定，除非 Product Owner 明确提出 Style V2，不允许其他 Agent 在正式 20 张生产过程中重新开启 Style Exploration。
