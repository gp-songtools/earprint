# Earprint design plan

Works inside `design-system/earprint/MASTER.md`. Applies to `index.html` and `changelog.html`.

## Subject, audience, job

- Subject: a track analyzer. You drop in a song and get its measurements, then an AI review
- Audience: songwriters and producers checking a mix or a reference track, often on a phone
- Primary job: show the numbers that matter (tempo, key, level, range, length) at a glance,
  then let people dig into the timeline, character, mood, pitch and the AI review

## Tokens

- Colour: midnight `#0F0F23` / panel `#1B1B30` / well `#24243C` / signal pink `#FF6B9C` /
  signal blue `#5BB4E0` / play green `#22C55E` (dark); light theme mirrors it (see MASTER)
- Type: Fira Sans for words, Fira Code for every number, unit and time. Readouts 30–38px.
  Labels 14px sentence case. Body 16px. Chart text never under 12px rendered
- Shape: 14px panels, 10px controls, 6px chips. Flat; a 1px line separates layers

## Layout concept

The memorable element is the **meter bridge**: the track, its five readouts and the waveform
sit in one console panel at the top, like a channel strip, with big Fira Code numbers split
by hairline dividers. Everything else is quieter and lower on the page.

Desktop (1440):

```
Earprint  (mark + wordmark)                                   Changelog
One-line purpose
[Song spec ▸]
┌ Meter bridge ─────────────────────────────────────────────────────────┐
│ Example loop  [Example]                          [Choose audio file]  │
│ 31 s synthesized in your browser                                      │
│───────────────────────────────────────────────────────────────────────│
│ Tempo      │ Key        │ Average level │ Loudness range │ Length     │
│ 123.6 BPM  │ A min [8A] │ −24.3 dBFS    │ 15.0 dB        │ 0:31       │
│───────────────────────────────────────────────────────────────────────│
│ ▶ 0:00 / 0:31      ■ Quiet ■ Building ■ Peak                          │
│ ▁▂▅▇▅▃▇█▆▅▇▆▅▃ waveform ▅▇▆▅▃▂▁                                      │
│ ════════ energy band ═════════                                        │
└───────────────────────────────────────────────────────────────────────┘
┌ Or analyze a streaming track ─────────────────────────────────────────┐
│ Link ……………………… | Artist … | Title … | [Analyze track]                   │
└───────────────────────────────────────────────────────────────────────┘
┌ Character ───────┐ ┌ Mood ─────────────┐ ┌ Pitch profile ─────────────┐
│ radar + meters   │ │ word + plane      │ │ 12 bars + note             │
└──────────────────┘ └───────────────────┘ └────────────────────────────┘
┌ AI review ────────────────────────────────────────────────────────────┐
│ key + options (1/3)   │ rating card, genres, moods… (2/3)             │
└───────────────────────────────────────────────────────────────────────┘
footer: how it measures · Changelog · Privacy & credits
```

Phone (390): one column. The meter bridge keeps all five readouts in a 2-column grid where
Length spans both columns (no orphan cell); the waveform stays full width.

```
Earprint
[Choose audio file] (full width)
Tempo 123.6 | Key A min
Level −24.3 | Range 15.0
Length 0:31 (spans)
▶ waveform
```

Alignment: everything left-aligned to one edge; numbers left-aligned under their labels;
right column holds only the single action of each panel.

## Principles

1. Numbers first. Every value is Fira Code, tabular, high-contrast `--ink`; units are smaller
   and `--muted` but still 14px+
2. One loud thing. Only the meter bridge gets large type; chart panels use 18px titles
3. Labels say what a thing is in sentence case. No all-caps eyebrows, no "A · B · C" tag
   strings, no arrows on buttons
4. Colour means something: pink = peak / tonic / your rating; blue = building / in-key;
   indigo-grey = quiet. Green only for actions
5. Never empty: the demo loop fills every chart, and the AI review shows a labelled example
   review until the visitor runs a real one

## Review against the brief

Checked against what I would produce for any "dark analytics tool":

- Draft had **all-caps mono labels and middle-dot tag strings** (the template-chrome default).
  Changed to 14px sentence-case Fira Sans labels and plain-language panel notes, which are
  also more readable, as the brief asks.
- Draft was a **stack of identical cards** (file strip, readouts, timeline as separate
  panels). Merged them into the meter bridge so the top of the page reads as one instrument,
  which is specific to audio tools.
- Draft dark theme risked the **near-black + one acid accent** look. Kept the midnight-indigo
  base from the music palette (not neutral black) and three signal colours with fixed meanings;
  green is limited to buttons and play.
- Kept Fira Code for numbers on purpose: here monospace digits are the content (tabular
  readouts), not decoration on small labels.

## Changelog page

Same tokens, fonts and header (mark + wordmark, link back to the app). Entries in a 760px
column; dates in Fira Code; type tags (New / Changed / Fixed) as sentence-case badges with
colour plus text.
