# EasyEvent 移动端发布准备说明

## 当前素材状态

当前阶段已准备基础 App 图标和启动图源文件，并可通过 `@capacitor/assets` 生成 Android / iOS 平台资源。源文件位于：

- `assets/icon-only.png`
- `assets/icon-foreground.png`
- `assets/icon-background.png`
- `assets/splash.png`
- `assets/splash-dark.png`

生成命令：

```bash
npm run cap:assets
npm run cap:sync
```

这些素材用于课程 MVP 和真机预览准备。正式发布前仍建议由设计同学或品牌规范进一步打磨。

## App Icon

- 当前图标使用 EasyEvent / EE 标识、绿色 / 蓝色渐变和运动科技感。
- Android adaptive icon 和 iOS App icon 可由 `@capacitor/assets` 生成。
- 正式发布前建议检查小尺寸图标可读性。

## Splash Screen

- 当前启动图包含 EasyEvent 标识和“赛事管理更简单”副标题。
- 已准备浅色和深色版本。
- 正式发布前可根据 App Store / Google Play 截图规范进一步优化。

## 包名与标识

- Android package name：`com.easyevent.app`
- iOS bundle identifier：`com.easyevent.app`
- 正式发布前需要确认是否与组织域名、学校或团队命名规范一致。

## 隐私权限说明

后续如果接入真实原生能力，需要补充权限说明：

- 相机权限：用于未来扫码签到或点位任务扫码。
- 文件权限：用于未来材料证明和任务附件上传。
- 通知权限：用于未来赛事公告和紧急提醒。
- 定位权限：仅在未来真实地图 / GPS 点位能力上线时申请。

当前 MVP 不申请这些权限。

## 应用商店截图

建议准备以下截图：

- 演示模式首页。
- 参赛者端赛事详情。
- 报名状态和签到码。
- 点位打卡页面。
- 管理端审核工作台。
- 签到检录操作台。
- 现场执行管理。
- 通知公告确认。
- 数据复盘看板。

## 测试设备清单

正式打包前建议至少测试：

- iPhone 小屏设备。
- iPhone 标准尺寸设备。
- Android 小屏设备。
- Android 标准尺寸设备。
- 平板或桌面浏览器宽度。

重点检查顶部导航、二级导航、表格横向滚动、表单单列布局、长标题换行和底部留白。
