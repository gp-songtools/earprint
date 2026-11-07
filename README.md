# Earprint

A music analyzer that runs entirely in the browser.

- **Measured locally, no AI needed:** tempo (BPM), key with Camelot code, loudness, loudness range, energy sections, pitch profile, character scores and a mood estimate.
- **AI review with Gemini:** a just-for-fun 0–10 rating with suggestions for improving the track, genre weights, moods, instruments, vocals, listening contexts and lyric themes. Gemini can listen to an uploaded file or to a YouTube / YouTube Music link.
- **Edits for GP Mastering:** when Gemini listened to an uploaded file, the review also lists level, EQ, taming and no-processing edits for exact time ranges. **Copy for GP Mastering** copies them in the format [GP Mastering](https://github.com/gp-songtools/gp-master) imports: load the same file there, open **AI suggestions › Paste suggestions from another tool**, paste and press Import. Times are seconds from the start of the file, so they only line up with the same file. Edits aimed at one instrument (vocals, drums, bass or other) apply to that stem only, and need the song separated into stems in GP Mastering first (Stem balance › Separate whole song).

## Your own Gemini key

Each person pastes their own key into the page. Get a free one at https://aistudio.google.com/apikey.

- The key is sent only to Google (`generativelanguage.googleapis.com`), straight from your browser. There is no Earprint server.
- It stays in memory and is forgotten when you close the tab, unless you tick **Remember the key in this browser**. That saves it in this browser's local storage on this device only. Untick the box to delete it.
- Free-tier keys have rate limits, and Google's terms for the free tier allow it to use your prompts and audio to improve its products. Check https://ai.google.dev/gemini-api/terms and https://ai.google.dev/gemini-api/docs/pricing.

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
