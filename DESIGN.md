# UR COMICS Design Brief

**Purpose:** Premium webtoon/manhwa reading and creation platform. Minimalist Luxury aesthetic — infinite dark space with vivid purple energy.

## Visual Direction

| Aspect | Definition |
| --- | --- |
| **Tone** | Bold, immersive, editorial — never playful or corporate |
| **Aesthetic** | Midnight Purple — deep gradient space, vibrant #8B5CF6 accent, glassmorphism header |
| **Differentiation** | CSS-rendered infinite depth; comic covers as primary focal point; minimal reader chrome |

## Midnight Purple System

| Token | Value | Usage |
| --- | --- | --- |
| `--color-accent` | `#8B5CF6` | CTAs, highlights, borders, glow effects |
| `--color-bg` | `#000000` | Base fallback |
| `--color-bg-deep` | `#1a0b2e` | Gradient midpoint |
| `--gradient-midnight` | `linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)` | Body/page background |

## Color Palette (OKLCH — Dark Mode Always Active)

| Role | OKLCH | Hex Approx | Usage |
| --- | --- | --- | --- |
| Background | 0.06 0 0 | ~#0a0a0a | Page foundation |
| Foreground | 0.96 0 0 | ~#f5f5f5 | Body text |
| Card | 0.11 0.02 290 | ~#110d1a | Comic cards, panels |
| Primary | 0.62 0.22 291 | ~#8B5CF6 | Interactive elements, CTAs |
| Accent | 0.62 0.22 291 | `#8B5CF6` | Highlights, active states |
| Muted | 0.15 0.03 291 | ~#1a1225 | Skeletons, inactive zones |
| Border | 0.22 0.06 291 | ~rgba(139,92,246,0.3) | Subtle purple outlines |

## Typography

| Tier | Font | Usage |
| --- | --- | --- |
| Display | **Montserrat** (700–900) | Comic titles, hero headings, nav brand |
| Body | **Inter** (400–600) | Reading text, UI labels, descriptions |
| Mono | JetBrainsMono | Code, creator metadata |

## Glassmorphism Header

```css
.glass-header {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(26, 11, 46, 0.6);
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
}
```

Header is `position: sticky top-0 z-50`. Logo sits left, nav right. No opaque fills.

## Elevation & Depth

| Shadow | Value | Purpose |
| --- | --- | --- |
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.4)` | Subtle card lift |
| `shadow-elevated` | `0 8px 16px rgba(0,0,0,0.5), 0 2px 4px rgba(139,92,246,0.1)` | Medium elevation |
| `shadow-manga` | `0 12px 24px rgba(0,0,0,0.6), 0 4px 8px rgba(139,92,246,0.1)` | Hero/cover focal depth |
| `glow-accent` | `0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)` | Purple aura on CTAs |

## Structural Zones

| Zone | Background | Border | Usage |
| --- | --- | --- | --- |
| Header/Nav | `.glass-header` sticky | `1px solid rgba(139,92,246,0.3)` | Logo, search, creator toggle |
| Main Content | `var(--gradient-midnight)` fixed | None | Comic grid, reader container |
| Comic Card | `bg-midnight-card` | `border-purple-glow` | Cover image, title, badge |
| Reader Chrome | Fade to transparent | None | Controls on scroll/hover |
| Footer | `bg-midnight-deep` 80% | `border-t border-purple-glow` | Links, copyright |

## Component Patterns

- **Comic Covers:** `bg-midnight-card shadow-manga border-purple-glow` with minimal 4px radius. Badge accent (top-right) in `#8B5CF6`.
- **Buttons — Primary:** `bg-accent text-white glow-accent-sm` on hover. `rounded-sm`.
- **Buttons — Secondary:** `border border-purple-dim text-accent` backdrop glass. `rounded-sm`.
- **Reader Controls:** Glass background, appear on scroll/hover, accent highlight for active chapter.
- **Loading:** Muted pulse on card skeletons (`bg-muted`), `glow-accent` pulse on interactive elements.
- **Modals:** Dark glass overlay, `bg-midnight-card`, sharp corners, `#8B5CF6` border on primary action.

## Motion & Animation

| Animation | Duration | Easing | Purpose |
| --- | --- | --- | --- |
| All interactive transitions | **150ms** | `ease` | Buttons, links, cards — universal |
| `fade-in` | 300ms | ease-out | Page/modal entrance |
| `slide-up` | 300ms | ease-out | Card stagger, skeleton reveal |
| `pulse-accent` | 2s | cubic-bezier(0.4, 0, 0.6, 1) | Loading indicators |

## Spacing & Rhythm

- **Macro:** 48px section separation, 24px card gutters
- **Micro:** 8px internal padding, 4px icon spacing
- **Grid:** 2–4 columns responsive (mobile-first)

## Constraints & Signature Detail

- **Gradient not image** — the background is CSS `linear-gradient`, never a static PNG
- **Purple-only accent** — `#8B5CF6` is the single accent color; no secondary accent
- **Token-only colors** — never use raw hex in JSX className; use `text-accent`, `bg-midnight-deep`, `border-purple-dim`
- **High contrast** — foreground/background minimum WCAG AA (4.5:1 on body text)
- **Signature:** Glassmorphism header floats over the infinite dark gradient; covers glow faintly in purple
