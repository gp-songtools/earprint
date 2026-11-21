# Changelog

All notable changes to Earprint, newest first. Earprint has no version numbers, so entries are grouped by date.

## 2026-11-20 — New design

### Changed

- **A new look** on both pages, with dark and light themes that follow your system. Fira Sans for text and Fira Code for every number, so readouts line up and stay easy to read. No text is smaller than 13px.
- The track, its five readouts and the waveform now sit together in one panel at the top. On a phone the readouts form a tidy two-column grid.
- **Choose audio file** is now the main button. Analyzing a YouTube Music or Spotify link moved into **Analyze a YouTube Music or Spotify link instead**, which opens on click.
- The mood chart's corners now use the same words as the mood label (Tense, Upbeat, Melancholic, Warm), and its sides read **sadder** and **happier**.
- On a phone, the AI review now comes before the key and settings.

### Added

- An **example review** of the demo loop, so the AI review section shows what you get before you add a key. It says clearly that it was written in advance and nothing was sent to Gemini.
- The waveform works from the keyboard: focus it, then use the arrow keys to move by 5 seconds, Home and End to jump, and Space to play or pause.
- A **Skip to the analysis** link for keyboard users, and screen readers now hear when an AI review is ready.

### Fixed

- The browser tab uses the same Earprint mark as the app header.

## 2026-11-18 — Song spec

### Added

- **Song spec**: the song file shared by the GP Song Tools in this browser. A panel at the top shows which tool filled each part and when, and lets you clear a part, start a new song, open a `.songspec.md` file or download one to hand to Claude.
- **Save to song spec** under an AI review saves the analysis (the same text as Copy for Idea Wizard), where GP Blueprint and Idea Wizard can use it. **Also set the song's BPM and key** (off by default) saves Earprint's tempo and key too, and says when that replaces GP Blueprint's.
- When Lyricpad has saved lyrics to the song spec, **Use these lyrics** fills the lyrics box with them (section tags removed). The review then says it used them. All optional: with no song spec, Earprint works as before.

## 2026-11-15 — Copy for Idea Wizard

### Added

- **Copy for Idea Wizard** under every AI review: copies the track's tempo, key and mood with the review's genres, moods, instruments, vocals and lyric themes, ready to paste into [Idea Wizard](https://gp-songtools.github.io/ideawizard/) for three song ideas built on this sound. For a YouTube or Spotify link, tempo and key are marked as Gemini's estimates.

### Changed

- When an AI review has no **Edits for GP Mastering**, it now says why: the review was for a link, Gemini didn't listen to the file, or Gemini suggested no edits.

## 2026-11-09 — Visit statistics and credits

### Added

- **Changelog** and **Privacy & credits** links at the bottom of the page.

### Changed

- The browser tab now shows Earprint's own icon, 👂, the same one as on the GP Song Tools menu, on every page.
- Earprint now counts visits with Cloudflare Web Analytics: anonymous totals only, with no cookies. It never sees your audio, files or key. The Privacy & credits page explains what it reports.

## 2026-11-08 — Arrangement edits for GP Mastering

### Added

- Edits for GP Mastering can now **repeat** or **cut** whole bars, matching GP Mastering v50's arrangement editing. Times stay in the original file; GP Mastering maps them onto the song's current arrangement when they are pasted in.
- A **Changelog page** (`changelog.html`) that shows this changelog in a readable layout, with the newest changes first.

## 2026-11-07 — Edits for GP Mastering

### Added

- **Edits for GP Mastering.** When Gemini listened to an uploaded file, the AI review also lists edits for exact time ranges in [GP Mastering](https://github.com/gp-songtools/gp-master)'s import format, with a **Copy for GP Mastering** button. Load the same file in GP Mastering, open *AI suggestions › Paste suggestions from another tool*, paste and press Import. If the browser blocks copying, the text is shown selected so it can be copied by hand.
- Edit types, kept in step with GP Mastering:
  - level, EQ, tame dynamics and no tone processing;
  - edits on one stem (vocals, drums, bass or other), including muting a stem for a range with a level of −60 dB;
  - effects: filter sweep, reverb, delay (timed to the tempo) and pan / width;
  - added sounds: noise, synth, tape and pitch risers, and noise or sub-drop downlifters with an optional impact;
  - pitch shift by up to ±12 semitones, with a mix control for harmonies.
- Edits on one stem show a note that the song must be separated into stems in GP Mastering first.
- Every edit and parameter is checked and limited to GP Mastering's ranges before it is shown or copied; unusable edits are dropped.
- "Suggestions to make it better" now start with their time range and section (for example `0:10–0:14 (Chorus 1): …`) when Gemini heard an uploaded file.

### Fixed

- A file chosen while the startup demo loop was still being made or analyzed could be replaced by the demo, so the review was about the wrong audio; a file chosen during the demo's analysis could be ignored. The newest load now always wins.

### Changed

- Edits for GP Mastering are produced only for uploaded files Gemini heard. Reviews of YouTube or Spotify links skip them, because the times would not match your own file.

## 2026-11-07 — Rating and suggestions

### Added

- **Suggestions to make it better**: two to four specific ideas in Gemini's rating, each naming what to change and where.
- A just-for-fun **0–10 rating** with a verdict, the best part and what could be better.

### Changed

- A short-lived genre probability chart was removed again; the original genre bars stay alongside the rating.
- `CLAUDE.md` added with commands, file map and project rules; work goes directly to `main`.

## 2026-11-05 — First release

### Added

- **Earprint**, a single-page music analyzer that runs in the browser.
- Measured locally, with no AI: tempo (BPM), key with Camelot code, loudness, loudness range, energy sections, pitch profile, character scores and a mood estimate.
- **AI review with Gemini**, using each visitor's own API key (kept in memory unless "Remember the key" is ticked): genre weights, moods, instruments, vocals, listening contexts and lyric themes. Gemini can listen to an uploaded file (the first 6 minutes as 16 kHz mono) or to a public YouTube / YouTube Music link; Spotify links use artist and title only.
- **Character radar chart** above the meters. For streaming links, Gemini estimates the same scores plus valence and arousal, so the radar and mood plane appear there too, labelled as estimates.
