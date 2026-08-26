# 03 — Design System

状态：**City Observation Editorial V2 / LOCKED**
最后更新：2026-08-26

完整角色画风、十个固定 IP 与资产合同见 `docs/24_CHARACTER_STYLE_LOCK_V2.md`。本文件只记录网站 UI 系统。

## 1. 设计命题

网站是一份可以交互的城市人格观察刊物，而不是算命摊、SaaS Dashboard 或圆角卡片模板。

```text
Warm Ivory paper
+ heavy ink typography
+ thin editorial rules
+ asymmetric columns
+ one canonical character per identity
+ restrained personality accents
```

关键词：现代、直接、可信、带梗、有日常城市感。里面的计算严谨，外面的表达可以发疯，但不以恐惧或虚假权威转化用户。

## 2. 已冻结色板

全局：

| Token | Hex | 用途 |
| --- | --- | --- |
| Paper | `#F6F1E6` | 页面与角色纸面 |
| Surface | `#FBF8F1` | 次级纸张 |
| Ink | `#111111` | 标题、正文、主边框 |
| Soft | `#3F3D38` | 次级正文 |
| Line | `#D8D0C3` | 分栏与网格 |
| Maroon | `#7A1E1E` | 强调、七杀、重要状态 |
| Navy | `#1F2E4A` | 深色编辑区 |
| Mustard | `#E7C45A` | CTA、focus、提示 |

十个人格 Accent 必须直接读取 `lib/public-personalities.ts`；不得另建一套近似色。禁止渐变、霓虹、糖果高饱和与整体灰雾。

## 3. 字体与层级

- Display：重黑无衬线；中文优先系统黑体，英文回退 Arial Black。
- Body：系统中文无衬线，保证跨平台与静态部署不依赖远程字体。
- `display-xl` 用于产品/人格主名，`display-lg` 用于章节命题，`display-md` 用于模块标题。
- 大标题允许紧字距与短行断句；长正文保持 `line-height: 1.75–2`。

## 4. 版式与组件

- 全站最大编辑框 `90rem`，桌面保留纵向分栏线，移动端去掉外框线。
- 卡片优先用 `1px` 细线与纸张明度分层，圆角固定为 `0–2px`。
- 按钮为黑底或纸底直角按钮，hover 使用小位移与 Mustard 影子；不使用胶囊型主 CTA。
- Character stage 与角色图共享 Warm Ivory，并以 `mix-blend-mode: multiply` 融合纸纹。
- 单一内容区最多使用一个人格 Accent；只有十人格目录可同时出现十色。
- 状态页必须明确 `preview`、`not-configured` 或 `local-only`，不得把未接入服务伪装为可用。

## 5. 页面约束

### 首页

首屏同时传达“十怪人格俱乐部”“确定性八字”和明确测试 CTA；十个 IP 必须全部可见并保持完整剪影。

### 出生信息

计算字段与品牌角色身份分离。UI 只出现“传统排盘所需性别”，并说明固定 IP 不随该选项改变。未知时辰必须如实进入不确定性链路。

### 人格档案

角色、主人格与一句话先于细节；第二人格、行为维度、生活模式、专业依据与分享卡随后展开。Canvas 分享卡沿用 Paper / Ink / 当前人格 Accent。

### 报告 / 顾问 / 账户

报告只预览范围，不伪造购买；顾问 Provider 未配置时禁用输入；账户未接 Auth 时只说明本地 Session。

## 6. 可访问与响应式

- 所有交互元素保留 `:focus-visible`，focus 色为 Mustard。
- 提供 skip link 与语义化主导航 landmark。
- 选择按钮使用 `aria-pressed`；错误使用 `role="alert"`；状态文本使用明确文案。
- 支持 `prefers-reduced-motion`，不依赖动画表达信息。
- 移动端优先保住角色全身与 CTA；文字可以重排，人物不得靠裁切解决布局。

## 7. 明确禁止

- 大红大金、龙凤八卦、符咒、古装、宗教道具堆叠；
- 玻璃拟态、赛博发光、渐变光晕、3D 玩具、动漫大眼；
- 大量圆角白卡、低对比灰字、与内容无关的悬浮装饰；
- 用锁内容、假倒计时、假支付成功或假 AI 回答制造转化。
