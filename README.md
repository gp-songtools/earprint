# Earprint

A music analyzer that runs entirely in the browser.

- **Measured locally, no AI needed:** tempo (BPM), key with Camelot code, loudness, loudness range, energy sections, pitch profile, character scores and a mood estimate.
- **AI review with Gemini:** a just-for-fun 0–10 rating with suggestions for improving the track, genre weights, moods, instruments, vocals, listening contexts and lyric themes. Gemini can listen to an uploaded file or to a YouTube / YouTube Music link.
- **Edits for GP Mastering:** when Gemini listened to an uploaded file, the review also lists level, EQ, taming, no-processing and effect edits (filter sweep, reverb, delay, pan / width) pitch shifts, added sounds (noise, synth, tape or pitch risers, downlifters) and arrangement changes (repeat or cut bars) for exact time ranges. **Copy for GP Mastering** copies them in the format [GP Mastering](https://github.com/gp-songtools/gp-master) imports: load the same file there, open **AI suggestions › Paste suggestions from another tool**, paste and press Import. Times are seconds from the start of the file, so they only line up with the same file. Edits aimed at one instrument (vocals, drums, bass or other) apply to that stem only, and need the song separated into stems in GP Mastering first (Stem balance › Separate whole song).

## Song spec

Earprint reads and writes the GP Song Tools [song spec](https://github.com/gp-songtools/toolsmenu/blob/main/songspec/SPEC.md), one file per song that every tool fills in its own part of, shared in this browser.

- **Writes** (Save to song spec, under an AI review): Analysis (the Copy for Idea Wizard text), and the song's BPM and key only when **Also set the song's BPM and key** is ticked (off by default).
- **Reads, optional:** Lyricpad's lyrics (**Use these lyrics**, section tags removed). Without a song spec, nothing changes.
- **Save to Drive** and **Open from Drive…** (optional) keep the song spec in a `GP Song Tools/<song title>` folder in your Google Drive, so you can open it on another device. See Privacy below.
- `songspec.js` and `songdrive.js` are copies of the toolsmenu libraries (never edit them here); the rest is in `index.html`. Browser test: `node tests/songspec.ui.mjs` (needs Playwright; Gemini is mocked).

## Your own Gemini key

Each person pastes their own key into the page. Get a free one at https://aistudio.google.com/apikey.

- The key is sent only to Google (`generativelanguage.googleapis.com`), straight from your browser. There is no Earprint server.
- It stays in memory and is forgotten when you close the tab, unless you tick **Remember the key in this browser**. That saves it in this browser's local storage on this device only. Untick the box to delete it.
- Free-tier keys have rate limits, and Google's terms for the free tier allow it to use your prompts and audio to improve its products. Check https://ai.google.dev/gemini-api/terms and https://ai.google.dev/gemini-api/docs/pricing.

## Privacy

Earprint has no server and no account. Measurements stay in your browser; what goes to Google for an AI review is listed under [What gets sent to Gemini](#what-gets-sent-to-gemini). Pages load Cloudflare Web Analytics, shared by all GP Song Tools, for anonymous visit counts (no cookies; it never sees your audio, files or key). Details: [Privacy & credits](https://gp-songtools.github.io/toolsmenu/privacy.html). Save to song spec keeps the analysis (and, if ticked, BPM and key) in the song spec shared by the GP Song Tools in this browser; it is never sent anywhere by itself. The Drive buttons are optional and do nothing until you click one: Google's sign-in script then loads from `accounts.google.com`, and the song spec text and the song's folder name go to Google Drive (`www.googleapis.com`) and nowhere else. Earprint asks only for the `drive.file` permission, so it can see only the files and folders GP Song Tools created, not the rest of your Drive. Your browser keeps the sign-in token (about an hour, shared by the GP Song Tools on this site) and a note of which Drive copy was last synced; **Sign out of Drive** removes both.

## Credits

Key detection uses the Krumhansl–Kessler key profiles. Fonts: Bricolage Grotesque, IBM Plex Sans and IBM Plex Mono (SIL Open Font License) via Google Fonts.

## Run it

It's a single file, `index.html`, with no build step and no dependencies. Either:

- open `index.html` in Chrome, Edge, Firefox or Safari, or
- serve the folder locally: `npx serve .` (then open the address it prints), or
- host it as a static site (GitHub Pages, Netlify, Cloudflare Pages). Since every visitor uses their own key, hosting it publicly costs you nothing.

## What gets sent to Gemini

| You do | Sent to Google |
| --- | --- |
| Measure a file | Nothing |
| AI review, "Let Gemini listen" on | The first 6 minutes as 16 kHz mono WAV (about 11 MB), the measurements, the file name and any pasted lyrics |
| AI review, listening off | Measurements, file name, pasted lyrics |
| YouTube / YouTube Music link | The video link (Google fetches the audio itself), plus artist/title if typed |
| Spotify link or artist + title | Artist and title only. Gemini can't hear Spotify, so it answers from general knowledge |

YouTube links must be public videos. Earprint never downloads audio from YouTube or Spotify.

## Changing the model

The default model ID is `gemini-3.5-flash`. To use a different one, open **Model** in the AI review panel; the choice is remembered. Use a model that accepts audio input, and check the pricing page for which ones are on the free tier.
