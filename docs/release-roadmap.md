# EasyEvent 发布路线

EasyEvent 当前目标是从课程原型转向真实可安装 App。正式分发前，需要先完成 Supabase 后端闭环、登录、隐私合规和移动端测试。

## Android 下载路线

1. Debug APK
   - 仅用于开发测试。
   - 可通过 Android Studio 直接安装到模拟器或真机。

2. Signed APK
   - 用于小范围内部分发。
   - 需要配置 Android 签名证书。
   - 适合赛事组织方内部测试。

3. AAB
   - Google Play 推荐发布格式。
   - 需要应用签名、包名、版本号、隐私说明和商店素材。

4. Google Play Internal Testing
   - 先给小范围测试人员安装。
   - 验证登录、数据保存、崩溃和权限提示。

5. Google Play Production
   - 完成合规、稳定性和数据安全说明后再正式发布。

## iOS 下载路线

1. Xcode Simulator
   - 适合开发验证 UI 和基础流程。

2. 真机开发安装
   - 需要 macOS、Xcode、Apple ID / Team Signing。

3. TestFlight 内测
   - 推荐真实用户测试路线。
   - 需要 App Store Connect、隐私说明和测试信息。

4. App Store 正式发布
   - 完成审核材料、截图、隐私政策、用户协议和版本信息后提交。

## 上架前必须完成

- Supabase 后端可用。
- 登录 / 注册可用。
- 核心报名数据可云端保存。
- 隐私政策。
- 用户协议。
- App 图标。
- 应用截图。
- 版本号和构建号。
- Android 签名。
- iOS signing。
- TestFlight / Internal Testing 测试。
- 数据安全说明。

## 当前阶段边界

当前阶段不直接上架，也不接支付、真实扫码、文件上传、推送、地图或 GPS。

## 下一阶段建议

1. 完成 Supabase 真实数据闭环验证。
2. 补齐管理角色初始化流程。
3. 增加 Android signed APK 内部分发。
4. 准备 TestFlight 内测。
5. 再规划扫码、文件上传和推送通知。
# EasyEvent Alpha 发布路线

当前目标不是正式上架，而是形成可安装、可登录、可连接云端数据的 Alpha 测试版本。

## Android

1. Debug APK：开发自测，产物在 `android/app/build/outputs/apk/debug/app-debug.apk`。
2. Signed APK：小范围内部分发，需要签名配置。
3. AAB：Google Play 测试和正式发布使用。
4. Google Play Internal Testing：适合早期组织方试用。

## iOS

1. Xcode Simulator：开发预览。
2. 真机开发安装：需要 Apple ID / Signing。
3. TestFlight：邀请制内测。
4. App Store：正式发布。

## 上架前必须完成

- Supabase 数据闭环稳定。
- 登录与账号删除流程。
- 隐私政策和用户协议。
- Android signing / iOS signing。
- App 图标、截图和版本号。
- 数据安全说明。
- AI 助手边界说明。

## 不在当前阶段

- 支付。
- 地图 / GPS。
- 推送通知。
- 真实健康数据。
- 正式应用商店提交。
