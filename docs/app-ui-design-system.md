# EasyEvent App UI Design System

## 1. Design Style

EasyEvent App uses a **Soft Editorial Sport OS** direction. The interface should feel like a premium mobile event operating system rather than a generic admin page.

Core traits:

- warm ivory background
- soft green surfaces
- large rounded cards
- gentle lifestyle-app shadows
- editorial typography
- numbered modules
- motion-stat cards
- event pass cards
- command center surfaces
- pixel copilot and voice orb as future AI affordances

## 2. Reference Synthesis

Soft mobile UI reference:

- warm ivory instead of plain white
- low-saturation green
- large rounded cards
- bottom mobile navigation
- comfortable spacing and touch targets

Aaru-inspired editorial layer:

- serif headlines
- thin lines
- short declarations
- numbered modules
- restrained acid-green accents

Nike / Strava inspired sport layer:

- large numeric stats
- progress-first cards
- route and checkpoint task cards
- health signal placeholders

AI Terminal layer:

- pixel copilot avatar
- dark terminal surface
- prompt chips
- voice orb
- explicit Coming soon boundary

## 3. Color Tokens

- `--ee-bg`: `#ECE9E1`
- `--ee-surface`: `#F8F6EF`
- `--ee-bg-2`: `#E3E8DA`
- `--ee-deep-olive`: `#33462D`
- `--ee-muted-olive`: `#6C765F`
- `--ee-text`: `#171915`
- `--ee-line`: `rgba(23, 25, 21, 0.14)`
- `--ee-accent`: `#B6FF4D`
- `--ee-warning`: `#FFD95A`
- `--ee-danger`: `#FF6B5E`
- `--ee-primary-2`: `#A8BAC5`

## 4. Font Tokens

- `.font-editorial`: `ui-serif, Georgia, Cambria, "Times New Roman", serif`
- `.font-app`: system UI stack
- `.font-mono-ui`: mono stack for numbers, status and AI terminal labels

## 5. Component Inventory

- `EventPassCard`: electronic event pass for participant home and registration status.
- `BottomAppNav`: mobile bottom navigation for participant flows.
- `MotionStatCard`: large sport metrics and operational stats.
- `CheckpointTimeline`: route-like task timeline.
- `PixelCopilot`: future AI assistant entry, no real AI call.
- `VoiceOrb`: future voice UI affordance, no microphone permission.
- `HealthSignalPreview`: future health / wearable data preview, no HealthKit / Health Connect.
- `SoftCommandCard`: admin command center module tile.
- `DataPanel` / `SoftDataTable`: soft table wrapper with horizontal overflow.
- `AiTerminalPanel`: mock AI terminal for roadmap communication.

## 6. Page Guidance

Participant pages:

- lead with event pass
- show next action clearly
- use bottom app nav on mobile
- use motion stat cards for progress
- show AI / health as Coming soon only

Admin pages:

- lead with command center modules
- keep tables inside soft data panels
- use large numbers for operational pressure
- keep critical actions visible and touch-friendly

## 7. Figma Suggestions

Create separate frames for:

1. App shell and navigation
2. Participant home
3. Event pass states
4. Registration status
5. Checkpoint timeline
6. Admin command center
7. Data review dashboard
8. Pixel Copilot / Voice Orb
9. Health signal preview

Use 390px, 768px and 1280px widths for responsive checks.
