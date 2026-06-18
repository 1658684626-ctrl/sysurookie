# EasyEvent 官网公网发布指南

本文档说明如何把 `website/` 产出为可公开访问的产品页。

## 1) 本地构建

### 构建官网静态产物

```bash
npm run website:build
```

- 输出目录：`website/dist`
- 入口：`website/index.html`
- 仅静态资源，不依赖 App 的后端服务。

### 本地预览

```bash
npm run website:preview
```

## 2) 直接托管：Netlify（最快）

### A. Netlify Drop（无需账号配置）

1. 运行 `npm run website:build`
2. 访问 <https://app.netlify.com/drop>
3. 将 `website/dist` 目录拖入
4. 获得一个临时公网链接，可用于演示/内测分享

### B. Netlify + Git 仓库

1. 创建 Netlify 站点并连接仓库
2. 配置：
   - Build command: `npm run website:build`
   - Publish directory: `website/dist`
3. 发布后 Netlify 会自动使用 `netlify.toml`（若存在）

## 3) Vercel 发布

1. 连接仓库后，设置：
   - Framework：Vite
   - Build Command：`npm run website:build`
   - Output Directory：`website/dist`
   - Install Command：`npm install`
2. `vercel.json` 已预置重定向规则
3. 完成后即可得到公网 `.vercel.app` 链接

## 4) GitHub Pages（推荐长期公开页）

项目已提供 GitHub Actions 工作流：`.github/workflows/deploy-website.yml`

发布步骤：

1. 在 GitHub 仓库开启 **Pages**（Source: GitHub Actions）
2. 推送到 `main` 分支（包含 `website/**` 变更）
3. 自动触发 `Deploy EasyEvent Website` 工作流
4. 部署成功后访问仓库的 Pages 地址，例如：
   `https://<你的组织或用户名>.github.io/<仓库名>/`

> 说明：当前网站在 `vite.config.ts` 已配置 `base: './'`，适配子路径场景（GitHub Pages 常见场景）。

## 5) 证书 / 自定义域名（可选）

如果你已经有独立域名，可在托管平台配置自定义域名到 HTTPS。只需：

- 在平台填写域名
- 按 DNS 指引增加 CNAME 解析
- 开启 HTTPS（多数平台自动签发）

## 6) 上线边界声明

- 官网按钮/下载仍为产品预览状态（private beta / coming soon）
- 联系、AI、健康信号、扫码等功能均按产品路线标注，不做后端强依赖
- 该站点为产品介绍与入口页，不承载核心赛事管理业务流程

## 7) 现有托管配置

- `netlify.toml`
- `vercel.json`
- `.github/workflows/deploy-website.yml`
