# CLAUDE.md

## Directory map
- `index.html` — entire app: HTML, CSS, one inline `<script>` (IIFE)
- `README.md` — user docs: key handling, what gets sent to Gemini, model choice
- `.nojekyll` — GitHub Pages: serve files as-is
- `CLAUDE.md` — this file
- No `package.json`, no build output, no tests dir

## Commands
- Build: none (static single file, no dependencies)
- Serve: `npx -y serve -L -n -l 8080 .`
- Serve (no npm): `python3 -m http.server 8080 >/dev/null 2>&1`
- JS syntax check (run after every edit): `sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d' | node --check -`
- Smoke test: load `http://localhost:8080` with Playwright `chromium.launch()`, fail on `pageerror`/console errors
- Test suite: none

## Layout of index.html
- Lines ~1–154: `<head>`, CSS tokens on `:root`, Google Fonts link
- Lines ~155–265: markup (drop zone, link input, readouts, timeline, traits/radar, mood, chroma, AI panel)
- `analyze()`: local DSP (FFT, BPM, Krumhansl key, RMS/LRA, sections, chroma)
- `render()`, `renderRadar()`, `renderTraits()`, `renderMood()`: measured results UI
- `buildPrompt()`, `callGemini()`, `requestReview()`, `renderAI()`: Gemini review flow
- `parseLink()`, `renderLinkPanel()`: Spotify / YouTube / YouTube Music link handling
- `makeDemo()`: synthetic demo track

## Hard constraints
- Keep it one file; no build step, no npm deps, no external JS libraries
- Only external requests allowed: Google Fonts, `generativelanguage.googleapis.com`
- No backend; Gemini key goes browser → Google only
- Key in memory by default; `localStorage` only when "Remember the key" ticked
- Storage keys: `earprint.geminiKey`, `earprint.geminiModel`; always via `store` wrapper (try/catch)
- Default model: `DEFAULT_MODEL='gemini-3.5-flash'`; must accept audio input
- Never download audio from YouTube or Spotify
- YouTube: pass `file_uri` (`https://www.youtube.com/watch?v=<id>`) to Gemini; public videos only
- Spotify: send artist/title only; results are estimates from Gemini's general knowledge
- Uploaded audio to Gemini: first 6 min, 16 kHz mono WAV (`audioForGemini()`, `wavBlob()`)
- Gemini/user text into DOM via `textContent`, never `innerHTML`
- `innerHTML` only for app-generated numbers/SVG icons
- Use `$()` helper for `getElementById`
- Colors via CSS custom properties; read in JS with `tok('--name')`
- Update README "What gets sent to Gemini" table when changing anything sent to Google
- `mastering` field (`SHAPE`, `gpmClean()`, `renderMastering()`) must match GP Mastering's import format (`AISCHEMA`/`aiParse` in gp-songtools/gp-master `index.html`); change both together
- `mastering` only for uploaded files Gemini heard (`req.heardS`); times are seconds from file start
- `loadGen`: newest load wins; check it after every `await` in a load path

## Deploy
- GitHub Pages serves repo root; pushing to the Pages branch deploys
- Verify relative paths only; no absolute `/` asset paths

## Git workflow
- Commit and push directly to `main`; no feature branches or PRs (owner's standing instruction, until revoked)
- Run the JS syntax check before every push
