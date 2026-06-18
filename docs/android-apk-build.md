# Android APK 构建说明

EasyEvent 已接入 Capacitor Android。以下脚本用于生成测试安装包和发布构建产物。

## Debug APK

```bash
npm run android:debug-apk
```

产物路径：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Debug APK 可用于开发测试，不适合公开分发。

## Release APK

```bash
npm run android:release-apk
```

产物路径：

```text
android/app/build/outputs/apk/release/
```

Release APK 需要配置 Android 签名后才适合发给别人安装。

## AAB

```bash
npm run android:bundle
```

产物路径：

```text
android/app/build/outputs/bundle/release/
```

AAB 用于 Google Play 发布流程。

## 签名注意事项

- 不要把 keystore 提交到仓库。
- 不要把 keystore 密码写进 README 或源码。
- 给外部用户安装前，请使用正式签名配置。
- 如果本机没有 Android Studio / Android SDK，Gradle 构建会失败；先安装 Android Studio 并配置 SDK。

## 手机安装

1. Android 手机开启开发者模式。
2. 开启 USB 调试。
3. 连接电脑后用 Android Studio 或 `adb install` 安装 debug APK。
