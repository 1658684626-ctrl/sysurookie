# EasyEvent UI 2.0 视觉系统

## 视觉关键词

- Sport Tech
- Event Command Center
- Digital Race Operations
- Neon Gradient
- Glassmorphism
- Dynamic Timeline
- Mobile-first App

目标是让 EasyEvent 从课程原型升级为“赛事运营驾驶舱 + 移动端赛事 App”的产品观感，同时保持克制、可读和适合课堂截图。

## 色彩体系

核心色：

- 背景：slate-950 / slate-900 / emerald-950
- 主色：emerald / cyan / sky / blue
- 强调：violet
- 成功：emerald
- 警告：amber
- 危险：rose

全局 CSS 变量在 `src/index.css`：

- `--ee-bg`
- `--ee-surface`
- `--ee-surface-strong`
- `--ee-primary`
- `--ee-primary-2`
- `--ee-accent`
- `--ee-success`
- `--ee-warning`
- `--ee-danger`
- `--ee-text`
- `--ee-muted`
- `--ee-border`
- `--ee-glow`

## 背景体系

全局背景使用深色科技底色、径向渐变光斑和轻量网格。`BackgroundOrbs` 只负责氛围，不承载业务信息，也不遮挡内容。

页面内容卡片以玻璃拟态为主：

- 亮玻璃：用于表单、列表、普通内容，保证可读性。
- 深色 command card：用于管理端和数据复盘。
- glow card：用于演示模式、项目概览、关键状态卡。

## 卡片体系

`SectionCard` 支持：

- `default`：默认亮玻璃卡片，兼容旧页面深色文字。
- `dark`：深色卡片。
- `glow`：发光渐变卡片，适合 hero 和重点模块。
- `command`：运营指挥中心风格，适合管理端模块。
- `subtle`：低调浅色卡片。

使用原则：

- 普通页面优先 default。
- 课堂截图位使用 glow。
- 管理端主入口和数据复盘使用 command。
- 不在卡片里再堆过多装饰卡，保持信息层级清楚。

## 按钮体系

`PrimaryButton` 支持：

- `primary`
- `secondary`
- `ghost`
- `danger`
- `success`
- `neon`

尺寸：

- `sm`
- `md`
- `lg`

按钮使用 `motion/react` 做轻量 `whileTap` 和 `whileHover`，并尊重 `prefers-reduced-motion`。

## 状态体系

`StatusBadge` 统一为发光胶囊：

- neutral：普通 / 草稿 / 未开始
- info：待审核 / 已发布 / 信息提示
- success：报名成功 / 已签到 / 已完成
- warning：待完善 / 部分确认 / 待审核任务
- danger：驳回 / 异常关注 / 紧急通知

页面不应重复自定义状态颜色，优先复用 `StatusBadge` 和已有中文 label 函数。

## 动效原则

本阶段只使用 `motion` 一个动效依赖。

允许：

- 页面进入淡入 + 轻微上移。
- 卡片 hover 轻微上浮。
- 按钮点击轻微缩放。
- 进度条宽度过渡。
- 电子通行证扫描线。

不做：

- 复杂 3D。
- 无限闪烁。
- 大量逐字动画。
- 会影响操作的动画。
- Three.js、GSAP、Lottie 或图表库。

## 移动端规则

- 默认 mobile-first。
- 顶部导航可换行，管理端模块导航横向滚动。
- 表格使用 `DataPanel` 横向滚动容器。
- 主按钮触控高度不低于 44px。
- 页面底部留出 safe area。
- 长标题、长队伍名和长通知内容必须可换行。

## 页面截图建议

适合课堂或 App 宣传截图的优先页面：

1. 项目概览页：展示 EasyEvent 产品首页和赛事模板能力。
2. 演示模式页：展示产品定位、痛点、闭环和一键演示。
3. 参赛者端首页：展示移动 App 感和报名记录。
4. 报名状态页：展示电子参赛证、签到码和下一步任务。
5. 管理端首页：展示运营指挥中心入口。
6. 数据复盘页：展示赛事运营驾驶舱和指标沉淀。
