# CLAUDE.md

## Directory map
- `index.html` — entire app: HTML, CSS, one inline `<script>` (IIFE)
- `README.md` — user docs: key handling, what gets sent to Gemini, model choice
- `CHANGELOG.md` — user-facing changes by date, newest first; add an entry with every user-facing change; `changelog.html` renders it in the browser; edit only the `.md`
- `design-system/earprint/` — `MASTER.md` (tokens, type, components; source of truth for every page) + `DESIGN-PLAN.md`
- `.nojekyll` — GitHub Pages: serve files as-is
- `CLAUDE.md` — this file
- `songspec.js` — copy of gp-songtools/toolsmenu `songspec/songspec.js` (the GP Song Tools song spec library), loaded before the inline script; never edit it here
- `songdrive.js` — byte-identical copy of toolsmenu `songspec/songdrive.js` (Google Drive for the Song spec panel's Save to Drive / Open from Drive…), loaded before `songspec.js`; never edit it here
- `tests/songspec.ui.mjs` — song spec browser test (Playwright, Gemini mocked): `node tests/songspec.ui.mjs`
- No `package.json`, no build output

## Commands
- Build: none (static single file, no dependencies)
- Serve: `npx -y serve -L -n -l 8080 .`
- Serve (no npm): `python3 -m http.server 8080 >/dev/null 2>&1`
- JS syntax check (run after every edit): `sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d' | node --check -`
- Smoke test: load `http://localhost:8080` with Playwright `chromium.launch()`, fail on `pageerror`/console errors
- Song spec test: `node tests/songspec.ui.mjs` (serves the folder itself; mocks Gemini, fonts, analytics)

## Layout of index.html
- Lines ~1–240: `<head>`, CSS tokens on `:root` (values from `design-system/earprint/MASTER.md`), Fira fonts link
- Lines ~241–360: markup: header, `.bridge` (drop zone + readouts + timeline), `#linkDetails` (streaming form), `#localGrid` (radar, mood, chroma), AI panel
- `EXAMPLE_REVIEW` / `showExampleReview()`: canned review for the demo loop; `renderAI(j, heard, {example:true})` never claims Gemini ran
- `analyze()`: local DSP (FFT, BPM, Krumhansl key, RMS/LRA, sections, chroma)
- `render()`, `renderRadar()`, `renderTraits()`, `renderMood()`: measured results UI
- `buildPrompt()`, `callGemini()`, `requestReview()`, `renderAI()`: Gemini review flow
- `parseLink()`, `renderLinkPanel()`: Spotify / YouTube / YouTube Music link handling
- `makeDemo()`: synthetic demo track

## Hard constraints
- Keep it one file; no build step, no npm deps, no external JS libraries. One exception (owner's decision, 2026-11-18): `songspec.js`, the shared song spec library. A second exception (owner's decision, 2026-11-23): `songdrive.js`, the shared Google Drive helper; copy it from toolsmenu, never edit it here
- Song spec (format: gp-songtools/toolsmenu `songspec/SPEC.md`): Earprint owns only Analysis (`ideaText()`) and, only when "Also set the song's BPM and key" is ticked (off by default), `bpm`/`key`/`bpm_key_by`; it only reads Lyrics (tags stripped) and must work unchanged without a song spec or the library (`SS` null). Update `songspec.js` only by copying it from toolsmenu (`node toolsmenu/songspec/check-copies.js`)
- Only external requests allowed: Google Fonts, `generativelanguage.googleapis.com`, Google sign-in (`accounts.google.com`, loaded only after a Save to Drive / Open from Drive click), the Google Drive API (`www.googleapis.com`, `drive.file` scope, only after sign-in), Cloudflare Web Analytics (`static.cloudflareinsights.com` snippet before `</body>` on every page, same token on all GP Song Tools)
- Privacy & credits live on the suite page `gp-songtools.github.io/toolsmenu/privacy.html` (repo `gp-songtools/toolsmenu`); update it and README Privacy/Credits when changing what is sent, stored or credited
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
- Follow `design-system/earprint/MASTER.md`: sentence-case labels ≥14px, no text <13px (chart ticks ≥12px rendered), numbers in Fira Code tabular, `--cta` only for actions
- Update README "What gets sent to Gemini" table when changing anything sent to Google
- `mastering` field (`SHAPE`, `gpmClean()`, `renderMastering()`) must match GP Mastering's import format (`AISCHEMA`/`aiParse` in gp-songtools/gp-master `index.html`); change both together
- `mastering` only for uploaded files Gemini heard (`req.heardS`); times are seconds from file start
- `mastering` actions: level, eq, tame, bypass, filter, reverb, delay, pan, riser, downlifter, pitch_shift, repeat, cut; `gpmClean()` clamps every effect parameter to GP Mastering's ranges
- `loadGen`: newest load wins; check it after every `await` in a load path

## Deploy
- GitHub Pages serves repo root; pushing to the Pages branch deploys
- Verify relative paths only; no absolute `/` asset paths

## Git workflow
- Commit and push directly to `main`; no feature branches or PRs (owner's standing instruction, until revoked)
- Run the JS syntax check before every push

# Multi-Agent Delegation Rules
When acting as the primary session (Opus), operate as a **Tech Lead and Architect**. Conserve primary context and rate limits by delegating execution work to specialized subagents whenever possible.
## Available Subagents
1. **`haiku-helper` (Fast Scout & Clerk)**
- **When to delegate:** File discovery, searching across the codebase (`Grep`/`Glob`), checking git status or commit logs, reading configuration files, and summarizing documentation.
- **Constraint:** Read-only tasks. Do not ask `haiku-helper` to write or edit code.
2. **`sonnet-worker` (Builder & Tester)**
- **When to delegate:** Implementing features from a finalized specification, writing unit or integration tests, refactoring isolated modules, fixing localized bugs, and running test/build suites.
- **Constraint:** Always provide clear requirements, target file paths, and expected behavior when invoking `sonnet-worker`.
## Orchestration Workflow
1. **Explore First:** Before planning changes, dispatch `haiku-helper` to locate relevant files and summarize existing patterns.
2. **Design & Plan:** Synthesize the findings in the main session and outline the architectural plan or edge cases.
3. **Delegate Implementation:** Hand off well-scoped coding, refactoring, and test-writing tasks to `sonnet-worker`. You may launch multiple `sonnet-worker` instances in parallel for independent modules.
4. **Review & Verify:** Inspect the changes made by `sonnet-worker` (or have `haiku-helper` summarize `git diff`) to ensure architectural alignment before concluding the task.
