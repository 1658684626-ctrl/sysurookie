# EasyEvent Website

This directory contains the public product website for EasyEvent.

## Positioning

The website presents EasyEvent as a reusable operating system for sports event operations. It is not a business dashboard and does not include App business logic.

## Design Style

The current website uses an editorial futurism direction:

- monochrome / paper / ink palette
- acid green accent
- oversized serif typography
- thin borders
- numbered modules
- abstract generative event visual
- calm but high-contrast product narrative

The design studies high-end product storytelling patterns, but does not copy any external website copy, imagery, video, logo, brand asset, or proprietary layout detail.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- motion

## Run

```bash
npm install
npm run website:dev
```

Or from this directory:

```bash
npm run dev
```

## Build

```bash
npm run website:build
```

Or from this directory:

```bash
npm run build
```

## Deploy to Public URL

This site is static and deployable to any static host.

Recommended:

- Netlify: set
  - Build command: `npm run website:build`
  - Publish directory: `website/dist`
- Vercel: uses existing `vercel.json` with SPA fallback.
- GitHub Pages: we provide a GitHub Actions workflow at

```bash
.github/workflows/deploy-website.yml
```

Push to `main` to trigger automatic deployment. The workflow deploys `website/dist`.

## Content

Core copy and structured content are centralized in:

```text
website/src/data/content.ts
```

The site supports English and Chinese through the `siteContent.en` / `siteContent.zh` dictionaries. The top-right language switch changes all main sections without reloading the page.

The current copy uses an "event operating system" narrative: short declarations, numbered arguments, live operations vocabulary, and explicit roadmap boundaries for health signals and AI. It avoids generic SaaS phrases and keeps download actions in private preview / coming soon states.

Contact email:

```text
1658684626@qq.com
```

## Boundaries

- Download entries are private beta / coming soon placeholders.
- Contact form uses a front-end success state and `mailto:` draft only.
- Health / wearable features are roadmap items.
- AI Assistant is a roadmap item.
- The website does not connect to a backend, health API, AI API, payment provider, map service, or push notification service.
