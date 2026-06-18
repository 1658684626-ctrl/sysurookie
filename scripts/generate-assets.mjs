import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const assetDir = new URL('../assets/', import.meta.url)

await mkdir(assetDir, { recursive: true })

const iconSize = 1024
const splashSize = 2732

function svgBuffer(svg) {
  return Buffer.from(svg)
}

function iconSvg({ background = true } = {}) {
  return `
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="160" y1="120" x2="880" y2="920" gradientUnits="userSpaceOnUse">
          <stop stop-color="#10B981"/>
          <stop offset="0.55" stop-color="#0EA5E9"/>
          <stop offset="1" stop-color="#2563EB"/>
        </linearGradient>
        <linearGradient id="mark" x1="292" y1="292" x2="732" y2="732" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#DFFCF2"/>
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="26" stdDeviation="34" flood-color="#064E3B" flood-opacity="0.24"/>
        </filter>
      </defs>
      ${background ? '<rect width="1024" height="1024" rx="236" fill="url(#bg)"/>' : ''}
      <circle cx="512" cy="512" r="304" fill="rgba(255,255,255,0.18)"/>
      <path d="M313 671V353H714V434H414V479H666V557H414V590H728V671H313Z" fill="url(#mark)" filter="url(#softShadow)"/>
      <path d="M310 753C392 811 502 826 616 790C674 772 727 743 771 706" fill="none" stroke="#FFFFFF" stroke-width="34" stroke-linecap="round" opacity="0.86"/>
      <path d="M755 329C672 272 564 257 452 292C394 310 340 340 297 377" fill="none" stroke="#DFFCF2" stroke-width="34" stroke-linecap="round" opacity="0.72"/>
    </svg>
  `
}

function backgroundSvg() {
  return `
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="120" y1="80" x2="930" y2="940" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ECFDF5"/>
          <stop offset="0.48" stop-color="#E0F2FE"/>
          <stop offset="1" stop-color="#DBEAFE"/>
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#bg)"/>
      <circle cx="230" cy="180" r="260" fill="#10B981" opacity="0.22"/>
      <circle cx="830" cy="830" r="320" fill="#0EA5E9" opacity="0.20"/>
    </svg>
  `
}

function splashSvg({ dark = false } = {}) {
  const bg = dark
    ? '<rect width="2732" height="2732" fill="#061826"/><circle cx="730" cy="590" r="560" fill="#0F766E" opacity="0.32"/><circle cx="2140" cy="2110" r="670" fill="#0284C7" opacity="0.30"/>'
    : '<rect width="2732" height="2732" fill="#F8FAFC"/><circle cx="680" cy="520" r="620" fill="#CCFBF1" opacity="0.82"/><circle cx="2180" cy="2160" r="740" fill="#DBEAFE" opacity="0.92"/>'
  const titleColor = dark ? '#FFFFFF' : '#0F172A'
  const subtitleColor = dark ? '#B7F7DF' : '#047857'
  const captionColor = dark ? '#B6C5D3' : '#64748B'

  return `
    <svg width="${splashSize}" height="${splashSize}" viewBox="0 0 ${splashSize} ${splashSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoBg" x1="1040" y1="860" x2="1690" y2="1510" gradientUnits="userSpaceOnUse">
          <stop stop-color="#10B981"/>
          <stop offset="0.55" stop-color="#0EA5E9"/>
          <stop offset="1" stop-color="#2563EB"/>
        </linearGradient>
      </defs>
      ${bg}
      <rect x="1076" y="870" width="580" height="580" rx="144" fill="url(#logoBg)"/>
      <circle cx="1366" cy="1160" r="172" fill="rgba(255,255,255,0.18)"/>
      <path d="M1216 1241V1050H1517V1100H1278V1128H1478V1176H1278V1195H1527V1241H1216Z" fill="#FFFFFF"/>
      <path d="M1220 1303C1272 1338 1346 1346 1418 1321C1452 1309 1484 1292 1511 1270" fill="none" stroke="#DFFCF2" stroke-width="22" stroke-linecap="round" opacity="0.86"/>
      <text x="1366" y="1650" text-anchor="middle" font-size="96" font-weight="800" font-family="Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif" fill="${titleColor}">EasyEvent 易赛通</text>
      <text x="1366" y="1770" text-anchor="middle" font-size="54" font-weight="700" font-family="Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif" fill="${subtitleColor}">赛事管理更简单</text>
      <text x="1366" y="1870" text-anchor="middle" font-size="38" font-family="Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif" fill="${captionColor}">报名 · 审核 · 签到 · 点位 · 通知 · 复盘</text>
    </svg>
  `
}

async function writePng(name, svg, size) {
  await sharp(svgBuffer(svg))
    .resize(size, size)
    .png()
    .toFile(fileURLToPath(new URL(name, assetDir)))
}

await writePng('icon-only.png', iconSvg(), iconSize)
await writePng('icon-foreground.png', iconSvg({ background: false }), iconSize)
await writePng('icon-background.png', backgroundSvg(), iconSize)
await writePng('splash.png', splashSvg(), splashSize)
await writePng('splash-dark.png', splashSvg({ dark: true }), splashSize)

console.log('Generated EasyEvent Capacitor source assets in assets/.')
