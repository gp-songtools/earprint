// Earprint and the GP Song Tools song spec, in a real browser (Playwright + Chromium, which are
// preinstalled in Claude Code sessions; no npm install). Gemini is mocked: no real AI calls.
// Runs Earprint on its built-in demo track twice: with no song spec, and with one holding
// Lyricpad's lyrics and GP Blueprint's BPM/key. Both must work; nothing Earprint doesn't own changes.
// Run from the repo root: node tests/songspec.ui.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const S = require(join(ROOT, "songspec.js"));
const KEY = "gpsongtools.songspec.v1";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".md": "text/markdown" };

const REVIEW = {
  summary: "A mellow loop.", rating: { score: 7, reasons: ["warm"], suggestions: ["more variation"] },
  genres: [{ name: "Synthwave", weight: 70 }], moods: ["calm"], instruments: ["synth pads"], vocals: "None",
  use_cases: ["focus"], lyrics: { themes: ["distance"], summary: "About letting go.", language: "English" },
};

const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://x").pathname;
    const body = await readFile(join(ROOT, path === "/" ? "index.html" : path));
    res.writeHead(200, { "content-type": TYPES[extname(path) || ".html"] || "application/octet-stream" }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch();
let failed = 0;
async function check(name, fn) {
  try { await fn(); console.log(`ok - ${name}`); } catch (e) { failed++; console.log(`FAIL - ${name}\n  ${e.message}`); }
}

async function openEarprint(spec, width = 390) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [], prompts = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("dialog", (d) => d.accept());
  await page.route("https://static.cloudflareinsights.com/**", (r) => r.fulfill({ contentType: "text/javascript", body: "" }));
  await page.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ contentType: "text/css", body: "" }));
  await page.route("https://fonts.gstatic.com/**", (r) => r.abort());
  await page.route("https://generativelanguage.googleapis.com/**", (r) => {
    prompts.push(r.request().postData() || "");
    r.fulfill({ json: { candidates: [{ content: { parts: [{ text: JSON.stringify(REVIEW) }] }, finishReason: "STOP" }] } });
  });
  await page.addInitScript(([spec, KEY]) => {
    if (sessionStorage.getItem("init")) return; sessionStorage.setItem("init", "1");
    localStorage.clear();
    if (spec) localStorage.setItem(KEY, spec);
  }, [spec, KEY]);
  await page.goto(base);
  await page.fill("#keyIn", "AIza-test-key-0123456789");
  await page.locator("#keyIn").dispatchEvent("input");
  await page.waitForFunction(() => !document.getElementById("aiBtn").disabled, null, { timeout: 30000 });
  return { page, errors, prompts };
}
async function review(page) {
  await page.click("#aiBtn");
  await page.getByRole("button", { name: "Save to song spec" }).waitFor({ timeout: 30000 });
}
const saved = (page) => page.evaluate((k) => localStorage.getItem(k), KEY);

await check("no song spec: review, save Analysis only, BPM/key only when ticked", async () => {
  const { page, errors } = await openEarprint("");
  assert.equal(await page.locator("#specLyr").isHidden(), true, "no lyrics offer without a song spec");
  await review(page);
  await page.getByRole("button", { name: "Save to song spec" }).click();
  let d = S.parse(await saved(page));
  assert.match(S.section(d, "analysis").body, /^Earprint analysis\nTrack: Example loop\nTempo: \d+ BPM\nKey: /);
  assert.equal(S.setting(d, "bpm"), "", "BPM/key are off by default");
  assert.equal(S.validate(d).filter((i) => i.level === "error").length, 0);
  await page.getByLabel(/Also set the song's BPM and key/).check();
  await page.getByRole("button", { name: "Save to song spec" }).click();
  d = S.parse(await saved(page));
  assert.match(S.setting(d, "bpm"), /^\d+$/);
  assert.match(S.setting(d, "key"), /^[A-G][b#]? (major|minor)$/);
  assert.equal(S.setting(d, "bpm_key_by"), "earprint");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
  assert.deepEqual(errors, []);
  await page.close();
});

const UPSTREAM = `---
schema_version: 1
title: Paper Lanterns
model: v6
bpm: 89
key: Ab minor
bpm_key_by: gp-blueprint
---

# Song spec

## Style
<!-- song-spec: by=gp-blueprint at=2026-11-17T13:55Z hash=00000000 -->
Indie folk, 89 BPM, Ab minor.

## Lyrics
<!-- song-spec: by=lyricpad at=2026-11-17T14:20Z hash=00000000 -->
[VERSE 1|wistful]
Your name still glows across my screen
A message never sent

[CHORUS]
So I light one for you
`;

await check("with a song spec: offers Lyricpad's lyrics, records them, keeps everything else", async () => {
  const { page, errors, prompts } = await openEarprint(UPSTREAM, 1280);
  assert.match(await page.locator("#specLyr").textContent(), /lyrics from Lyricpad \(3 lines, \[tags\] removed\)/);
  await page.getByRole("button", { name: "Use these lyrics" }).click();
  assert.equal(await page.inputValue("#lyrics"), "Your name still glows across my screen\nA message never sent\n\nSo I light one for you");
  await review(page);
  assert.ok(prompts.at(-1).includes("So I light one for you"), "the lyrics went into the review request");
  assert.match(await page.getByText(/This review used from the song spec/).textContent(), /Lyrics \(Lyricpad\)/);
  assert.match(await page.getByLabel(/Also set the song's BPM and key/).locator("..").textContent(), /replacing 89 BPM, Ab minor from GP Blueprint/);
  await page.getByRole("button", { name: "Save to song spec" }).click();
  const before = S.parse(UPSTREAM), d = S.parse(await saved(page));
  assert.deepEqual(Object.keys(S.section(d, "analysis").marker.from), ["lyrics"]);
  const raw = (x) => x.sections.filter((s) => s.id !== "analysis").map((s) => s.head + s.lines.join("")).join("").replace(/\n+$/, "");
  assert.equal(raw(d), raw(before), "sections Earprint doesn't own are unchanged");
  assert.equal(d.fm.items.map((i) => i.line).join(""), before.fm.items.map((i) => i.line).join(""), "unticked: BPM/key stay GP Blueprint's");
  assert.deepEqual(errors, []);
  await page.close();
});

await browser.close();
server.close();
console.log(failed ? `${failed} failed` : "all passed");
process.exit(failed ? 1 : 0);
