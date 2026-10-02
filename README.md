# Ellie's Animal Clinic

An iPad-friendly vet game for a Grade 1 student in Ontario. The player is
Dr. Ellie. Each patient needs three treatment steps, and every step is a short
activity from the Ontario Grade 1 curriculum:

- **Math (2020 curriculum):** counting objects, ten frames to 50, adding and
  taking away within 20, comparing numbers, skip counting by 10s/5s/2s,
  tens and ones, repeating patterns, Canadian coins, and coding with arrows.
- **Language (2023 curriculum):** beginning/middle/end sounds, spelling
  short-vowel words, decoding words, rhyming, sight words, sh/ch/th, clapping
  syllables, and reading a simple sentence.

Each healed patient earns 5 stars. In the **clinic shop** stars buy decorations
that appear in the waiting-room picture and the exam room, or adopt an animal
she has already helped. Adopted pets live in the clinic, and she can visit to
feed, pat and play with them. At checkout she pays by tapping 10-star and
5-star bags while the narrator counts along (a Grown-ups setting switches this
to one-tap buying).

Instructions are read aloud (tap 🔊 to hear them again). Levels adjust
automatically, and the **Grown-ups** corner (press and hold) shows progress per
skill and lets you change levels, the name, voice and subjects.

## Editions

The Grown-ups corner has an **Edition** picker:

- **Base edition**: every Grade 1 math and reading activity above.
- **Numbers to 10** (week of 28 September): built from the Chapter 1 worksheets
  (Online Workbook 1A / Revisit 1A). Nine activities, all within 0–10: counting
  to 10, more/fewer/same and greater/less than, what comes next, 1–4 more or
  less and "how many more", counting on and back with ten frames, ordering cube
  towers, and three number-word reading activities (read, match and spell zero
  to ten). Its reading also covers UFLI Home Practice Lessons 37a/37b: short o
  word chains ("Change the t to g"), spelling the short o words (not, sob, dog,
  hop, box, jog, frog, spot, drop, plot, cost, soft), the heart words he, be,
  me and from, and reading short o sentences and yes/no questions.

Stars, stickers, decorations and pets are shared by all editions; each activity
keeps its own level. A new week is a new entry in `EDITIONS` in `game.html`
plus its lines in `tools/voice/lines.js`.

## Play

Open `index.html` in Safari, or host the repo with GitHub Pages:

1. On GitHub: Settings → Pages → Build and deployment → Source: **Deploy from
   a branch**, pick the branch that has the game and the `/ (root)` folder,
   then Save. Pages needs a public repo on a free GitHub plan.
2. After a minute or two the game is at
   `https://<your-username>.github.io/Ellies-Vet-Game/`.
3. On the iPad, open that address in Safari, tap Share → **Add to Home
   Screen**. It opens full-screen with Dr. Ellie as the app icon.

## Narrator voice

Every line the game speaks is pre-recorded with [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M),
a free, open-source voice model, and stored in `voice/`. Any line without a
recording (for example after changing the child's name) is read by the
device's own voice. On an iPad, downloading an Enhanced voice (Settings →
Accessibility → Spoken Content → Voices) makes that fallback sound better.

To re-record, for example with a different voice:

```sh
pip install kokoro-onnx soundfile lameenc
# download kokoro-v1.0.onnx and voices-v1.0.bin from
# https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
node tools/build.mjs && node tools/voice/run.cjs   # list every line and check coverage
python3 tools/voice/build_voice.py --voice af_heart --model <folder with the model files>
```

If you change what the game says, update `tools/voice/lines.js` too;
`run.cjs` reports any spoken sentence that has no recording. Re-running
`build_voice.py` only records lines that are new; add `--fresh` to re-record
everything (for example after switching voice).

## Files

- `game.html`: the whole game (styles, markup, script).
- `index.html`: generated from `game.html` by `node tools/build.mjs`. Edit
  `game.html`, then rebuild.
- `animals/`: real animal photos with transparent backgrounds. See
  `animals/README.md` for file names and `animals/CREDITS.md` for credits.
- `voice/`: the recorded narrator lines (made by `tools/voice/`).
