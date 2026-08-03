# Design System

<!-- impeccable:design-schema 1 -->

## Visual World

Minimal and calm. The visual language should feel like a well-designed journal or a quiet morning — unhurried, warm, and intentional. Nothing competes with the affirmation text itself. White space is structural, not decorative.

Closest reference points: Calm app, Linear's landing page restraint, Notion's neutral palette. Not: vibrant wellness apps with gradients and emojis.

## Color

All colors are from Tailwind's stone and warm neutral scales, with one soft accent.

| Token | Value | Use |
|-------|-------|-----|
| `bg-stone-50` | `#fafaf9` | Page background |
| `bg-white` | `#ffffff` | Card surfaces |
| `text-stone-800` | `#292524` | Primary text, headings |
| `text-stone-600` | `#57534e` | Secondary text, labels |
| `text-stone-400` | `#a8a29e` | Placeholder, muted |
| `border-stone-200` | `#e7e5e4` | Dividers, card borders |
| `bg-stone-100` | `#f5f5f4` | Hover states, subtle fills |
| Accent | `#a78bfa` (violet-400) | Single CTA button, active states, progress fill — used sparingly |

No other accent colors. If something feels like it needs color, add more whitespace instead.

## Typography

System font stack — no Google Fonts import to keep load fast and native.

```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Affirmation text | `text-3xl` / `text-4xl` on desktop | `font-light` (300) | The hero. Generous line-height (`leading-relaxed`). Centered. |
| Page headings (h1) | `text-2xl` | `font-medium` (500) | Used sparingly — one per page |
| Section labels | `text-sm` | `font-medium` | Uppercase tracking: `tracking-widest text-stone-400` |
| Body / quiz text | `text-base` | `font-normal` | `leading-relaxed` |
| Button text | `text-sm` | `font-medium` | Never all-caps |
| Captions / meta | `text-xs` | `font-normal` | `text-stone-400` |

## Spacing

Use Tailwind's default 4px base. Prefer multiples of 4: `p-4`, `p-8`, `p-12`, `gap-4`, `gap-6`. Never use `px-3` or odd numbers unless compensating for a border.

Page-level padding: `px-6 py-12` on mobile, `px-8 py-16` on desktop. Max content width: `max-w-xl mx-auto` for single-column reading content (quiz, affirmation), `max-w-2xl` for landing page.

## Components

### Button (primary)
```
bg-violet-400 hover:bg-violet-500 text-white text-sm font-medium
px-6 py-3 rounded-full transition-colors duration-200
```
Only one primary button per view. No gradients on buttons.

### Button (secondary / ghost)
```
text-stone-600 hover:text-stone-800 text-sm font-medium
underline-offset-2 hover:underline transition-colors duration-150
```
For "Retake quiz", "Next affirmation" — low visual weight.

### Card
```
bg-white border border-stone-200 rounded-2xl p-8 shadow-sm
```
No heavy drop shadows. `shadow-sm` only. Cards should feel like paper, not floating.

### Quiz option (selectable)
```
border border-stone-200 rounded-xl px-5 py-4 text-left cursor-pointer
hover:border-violet-300 hover:bg-violet-50 transition-all duration-150
selected: border-violet-400 bg-violet-50 text-stone-800
```

### Progress bar
```
bg-stone-200 rounded-full h-1
fill: bg-violet-400 rounded-full h-1 transition-all duration-300
```
Thin, quiet. `h-1` (4px), not chunky.

## Motion

Subtle and purposeful only. Nothing animated for its own sake.

- Page transitions: `opacity 0→1`, `200ms`, `ease-out`
- Quiz slide: new question fades in from 8px below, `150ms ease-out`
- Progress bar fill: `300ms ease-out`
- Button hover: `150ms` color shift only, no scale
- No bounce, no spring, no dramatic entrances

## Anti-patterns (never do these)

- No gradients as backgrounds — only on very subtle overlays if needed
- No emoji in UI (confirmed: user preference)
- No heavy shadows (avoid `shadow-lg`, `shadow-xl`)
- No colored text except the accent violet on interactive elements
- No all-caps buttons
- No cards with colored headers
- No floating action buttons
- No skeleton loaders for content that loads instantly from localStorage
- No multi-color illustrations or icon sets — use simple SVG line icons only if needed
