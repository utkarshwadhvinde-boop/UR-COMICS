# UR Comics Design System

## Visual Direction
**Luxury digital minimalism**: Premium purple-based platform with glassmorphism elegance, smooth micro-interactions, and refined typography. Feels like Spotify + Figma maturity — bold but tasteful, modern but timeless.

## Color Palette (OKLCH)
| Role | Light | Dark |
|------|-------|------|
| Primary | 0.58 0.22 265 | 0.72 0.20 265 |
| Background | 0.98 0.005 320 | 0.13 0.005 265 |
| Foreground | 0.15 0.02 265 | 0.95 0.004 280 |
| Card | 1.0 0 0 | 0.17 0.008 265 |
| Accent | 0.58 0.22 265 | 0.72 0.20 265 |
| Muted | 0.93 0.004 320 | 0.21 0.008 265 |
| Destructive | 0.55 0.22 25 | 0.65 0.19 22 |

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | General Sans | Hero titles, comic titles, prominent CTAs |
| Body | DM Sans | Body text, navigation, UI copy |
| Mono | JetBrains Mono | Stats, timestamps, code |

## Shape & Spacing
- **Radii**: 20px cards, 12px buttons/inputs, 8px chips
- **Shadows**: Soft (sm: 1px blur), Medium (md: 4px blur), Large (lg: 8px blur), Glow (purple 20px)
- **Spacing**: 0.5rem base grid, mobile-first scaling

## Structural Zones
| Zone | Treatment | Role |
|------|-----------|------|
| Header | bg-background, border-b | Sticky, logo + navigation + search |
| Hero | bg-gradient-primary, glassmorphism | Featured comic banner with glow CTA |
| Grid | bg-background, section dividers | Comic cards with card-hover effect |
| Modals | bg-card, backdrop-blur (glassmorphism) | Semi-transparent overlay, elevated |
| Footer | bg-muted, border-t | Secondary links, copyright |
| Image Stitching Modal | modal-glass (bg-card/95, backdrop-blur-md, border border-border/40) | Drop zone (dashed border, glow on hover), thumbnail grid (responsive cols), progress bar (gradient fill), action buttons |

## Component Patterns
- **Buttons**: Purple primary, scale 0.98 on press, 0.15s transition-press
- **Cards**: White/elevated surfaces, scale 1.02 + shadow-lg on hover, 0.3s transition-smooth
- **Genre Chips**: Grey inactive → purple gradient on active, glow effect
- **Logo**: Fade-in-up on load (0.5s), glow-pulse subtle animation, scale 1.05 on hover
- **Read Now CTA**: Primary gradient, glow-accent shadow, press animation
- **Image Stitching Modal**: Glassmorphism card (bg-card/95, backdrop-blur-md), dashed purple-glow border on drop zone, drag-handle indicators on thumbnail hover, linear progress bar with gradient fill animation, dual action buttons (auto-upload primary gradient, download secondary), fade-in scale-in on open

## Motion & Interactions
| Trigger | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page load | fade-in-up | 0.5s | ease-out |
| Button press | scale (0.98) | 0.15s | cubic-bezier |
| Card hover | scale (1.02) + shadow-lg | 0.3s | cubic-bezier |
| Chip active | gradient + glow | 0.2s | ease-out |
| Logo hover | scale (1.05) | 0.3s | ease-out |
| Glow pulse | shadow animation | 2s | ease-in-out |
| Modal open | scale-in (0.98→1) + fade | 0.3s | ease-out |
| Drop zone drag-over | drop-zone-active (border + bg) | 0.2s | ease-out |
| Thumbnail drag | drag-lift + scale 1.05 + opacity 0.8 | 0.2s | ease-out |
| Progress bar | progress-fill (0→100%) + shimmer | 0.8s / 2s | ease-out / linear |
| Stitching complete | checkmark fade-in + success message | 0.4s | ease-out |

## Responsive Design
- **Mobile-first**: base styles 375px+
- **Tablet**: md breakpoint (768px) — sidebar/grid adjust
- **Desktop**: lg+ (1024px+) — full layout

## Differentiation & Signature Detail
**Glassmorphism layering**: Semi-transparent backgrounds on modals/popovers with backdrop blur effect (8px), creating elegant depth. Purple gradient accents on interactive elements (buttons, chips) paired with soft glow shadow create premium, cohesive brand identity.

## Dark Mode
Intentional design (not inverted): Darker purple backgrounds (#13000D), brighter accent text, softer shadows with reduced opacity, adjusted glow intensity for reduced eye strain.
