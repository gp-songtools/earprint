# Earprint design system (master)

Source of truth for every Earprint page (`index.html`, `changelog.html`). A page file in
`design-system/earprint/pages/<page>.md` overrides this file for that page only.

Generated with the ui-ux-pro-max skill (`--design-system`, density 7, motion 3) and then
verified against the product. Adopted from the skill's data: the **Music Streaming** dark
palette (midnight-indigo surfaces, "play green" action colour), the **Dashboard Data** font
pairing (Fira Sans + Fira Code), the Dark Mode (OLED) style's accessibility requirements, and
its pre-delivery checklist. Rejected as a poor fit for an analysis tool: the "Feature-Rich
Showcase" and "Scroll-Triggered Storytelling" landing patterns, the Righteous/Poppins and
Archivo/Space Grotesk pairings, parallax and scroll-reveal motion.

## Product

- Type: browser tool for musicians and producers; one dense analysis page plus a changelog
- Feel: a studio meter bridge. Calm surfaces, data in bright signal colours, numbers first
- Style: Dark Mode (OLED) with an equal light theme; theme follows the system
  (`prefers-color-scheme`, overridable with `data-theme` on `<html>`)
- Density: standard-dense (spacing scale below); one primary action per panel

## Colour tokens

Define on `:root`, redefine under `@media (prefers-color-scheme: dark)` guarded by
`:root:not([data-theme="light"])` and again under `:root[data-theme="dark"]`.
All text pairs below are ≥ 4.5:1; chart marks are ≥ 3:1 against `--surface`.

| Token | Role | Light | Dark |
|---|---|---|---|
| `--bg` | page background | `#F3F4F9` | `#0F0F23` |
| `--surface` | panels, cards | `#FFFFFF` | `#1B1B30` |
| `--raised` | inputs, wells, chart plot area, chips | `#EEF0F7` | `#24243C` |
| `--line` | borders, gridlines | `#D9DCEA` | `#34345A` |
| `--ink` | primary text, values | `#14142B` | `#F8FAFC` |
| `--muted` | secondary text, labels (7:1+) | `#4E5670` | `#A9B3C7` |
| `--cta` | primary buttons, play (Music Streaming "play green") | `#15803D` | `#22C55E` |
| `--on-cta` | text on `--cta` | `#FFFFFF` | `#0B1A10` |
| `--accent` | signal: peak, tonic, rating, current position | `#C92A63` | `#FF6B9C` |
| `--accent-2` | signal: building, in-scale, meters, links | `#1D6A94` | `#5BB4E0` |
| `--low` | signal: quiet, out-of-scale | `#7F88AE` | `#6B6BA6` |
| `--wave` | unplayed waveform | `#7A82A6` | `#6E6EA8` |
| `--danger` | errors (always with text) | `#B3261E` | `#FF8A80` |
| `--ring` | focus ring | `#1D6A94` | `#FFFFFF` |

Rules
- Colour follows meaning, never rank: pink = peak/tonic/emphasis, blue = building/in-key,
  indigo-grey = quiet/other. Every chart also says it in text (legend, label or value).
- `--cta` is for actions only (Analyze, Write AI review, Play); never for data.
- No raw hex in components; JS reads colours with `tok('--name')`.

## Typography

| Role | Font | Size / weight | Notes |
|---|---|---|---|
| Brand wordmark (h1) | Fira Sans | clamp(30px, 4.4vw, 44px) / 700 | letter-spacing −0.02em |
| Panel title (h2) | Fira Sans | 18px / 600 | |
| Body | Fira Sans | 16px / 400, line-height 1.55 | measure ≤ 70ch |
| Secondary / notes | Fira Sans | 14px / 400 | `--muted` |
| Label (field, readout name) | Fira Sans | 14px / 600, sentence case | `--muted`; never all caps, never below 13px |
| Readout value | Fira Code | clamp(30px, 3vw, 38px) / 600 | `tabular-nums` |
| Inline numbers, units, times | Fira Code | 14px / 500 | `tabular-nums` |
| Chart text (SVG/canvas) | Fira Code / Fira Sans | ≥ 12px rendered | size SVG text in rendered px, not viewBox px |

- Google Fonts: `family=Fira+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap`
- Smallest text anywhere: 12px (chart ticks only). Labels 14px. Body 16px (inputs 16px to
  prevent iOS zoom).

## Spacing, shape, elevation

- Scale (4px base): 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48
- Panel padding 20px (16px under 600px); grid gaps 20px (16px on phones); page gutter
  max(16px, safe-area)
- Container: max-width 1180px
- Radius: 6px (chips, small controls) · 10px (inputs, buttons) · 14px (panels)
- Elevation: flat. Panels use `--surface` + 1px `--line`; no drop shadows except focus

## Components

- **Buttons**: 44px min height, 10px radius, 15px/600. Primary = `--cta` fill; secondary =
  `--surface` + `--line` border; disabled = opacity .45 + `cursor:not-allowed`
- **Inputs**: 44px min height, 16px text, `--raised` fill, `--line` border, visible label above
- **Panel**: header row = h2 + optional tag (label style) on the right; wraps on phones
- **Readout**: label → value (Fira Code) + unit → one-line sub text in `--muted` 14px
- **Meter bar**: 8px track in `--raised`, fill `--accent-2`, 4px rounded end, value in text
- **Chip**: `--raised` fill, 6px radius, 14px text
- **Badge** (Example, Estimate): 13px/600 sentence case on `--raised`, `--muted` text
- **Panel tag**: a plain-language note in 14px `--muted` (e.g. "Scores from 0 to 100"); no tag strings joined with middle dots

## Charts

- Radar, mood plane, waveform, pitch profile, genre bars: single-hue magnitude in
  `--accent-2`; the one emphasised item in `--accent`
- Gridlines `--line`; plot wells `--raised`; data text `--ink`, axis text `--muted`
- Every chart has an `aria-label` / `role="img"` summary and visible values
- Charts reflow: the 3-up grid becomes 2-up under 1000px and 1-up under 680px

## Motion

- Subtle only (dial 3): 150–200ms colour/opacity transitions, 400ms meter fills
- No scroll-triggered or parallax effects; `prefers-reduced-motion` disables transitions

## Breakpoints

- 390 (phone) · 680 · 1000 · 1440. No horizontal scrolling at any width ≥ 320px

## Sample data

- The startup demo loop fills every measured panel. For the demo, the AI review shows a
  clearly labelled **example review** (rating, genres, moods, instruments, suggestions) so the
  page is populated before a visitor adds a key. It is replaced by real reviews.

## Pre-delivery checklist

- [ ] No emoji as UI icons (favicon matches the GP Song Tools suite and is exempt)
- [ ] `cursor:pointer` on every clickable element; hover + focus-visible states
- [ ] Text ≥ 4.5:1 in both themes; chart marks ≥ 3:1
- [ ] Focus ring visible (2px `--ring`, 2px offset)
- [ ] `prefers-reduced-motion` respected
- [ ] 390px and 1440px: no overflow, no orphan grid cells, readable labels
