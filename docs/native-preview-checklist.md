# EasyEvent 原生预览检查清单

## Web 预览步骤

1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动 Web 开发服务：
   ```bash
   npm run dev
   ```
3. 在浏览器访问终端输出的本地地址，例如 `http://127.0.0.1:5173/`。
4. 先进入“演示模式”，点击“一键生成完整演示案例”，再检查参赛者端和管理端页面。

## Capacitor 同步步骤

1. 生成 Web 构建：
   ```bash
   npm run build
   ```
2. 同步到 Android / iOS 原生项目：
   ```bash
   npm run cap:sync
   ```
3. 如果更新了 App 图标或启动图：
   ```bash
   npm run cap:assets
   npm run cap:sync
   ```

## Android 预览步骤

1. 打开 Android 工程：
   ```bash
   npm run cap:open:android
   ```
2. 在 Android Studio 中选择模拟器或真机。
3. 点击 Run。
4. 也可以尝试命令运行：
   ```bash
   npm run cap:run:android
   ```

## iOS 预览步骤

1. 打开 iOS 工程：
   ```bash
   npm run cap:open:ios
   ```
2. 在 Xcode 中选择 Simulator 或真机。
3. 如使用真机，选择 Team / Signing。
4. 点击 Run。
5. 也可以尝试命令运行：
   ```bash
   npm run cap:run:ios
   ```

## Android 真机注意事项

- 手机需要开启开发者模式。
- 开启 USB 调试。
- 确认设备被 Android Studio 识别。
- 如果构建失败，先查看 Gradle / SDK 报错。
- 如果页面不是最新版本，重新执行 `npm run cap:sync`。

## iOS 真机注意事项

- 需要 macOS + Xcode。
- 真机运行通常需要 Apple ID / Team Signing。
- 第一次运行可能需要在手机上信任开发者证书。
- 如果只是课堂展示，可以优先使用 Simulator，减少签名问题。

## 常见问题

- 找不到 `dist`：先运行 `npm run build`。
- `cap sync` 后页面没更新：确认已重新构建，再执行 `npm run cap:sync`。
- Android Studio 没有识别设备：检查 USB 调试、数据线、驱动和 SDK。
- Xcode signing 报错：检查 Team、Bundle Identifier 和证书状态。
- 页面空白：先用浏览器检查 Web 构建，再看原生控制台日志。
- localStorage 演示数据丢失：进入“演示模式”，重新生成完整演示案例。
- Safe area 顶部 / 底部遮挡：检查设备是否启用全屏显示，确认页面保留了安全区间距。

当前原生预览仍然是课程 MVP，不包含真实扫码、推送、登录、后端或应用商店发布能力。
