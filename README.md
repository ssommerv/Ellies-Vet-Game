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

Instructions are read aloud (tap 🔊 to hear them again). Levels adjust
automatically, and the **Grown-ups** corner (press and hold) shows progress per
skill and lets you change levels, the name, voice and subjects.

## Play

Open `index.html` in Safari. To put it on the iPad home screen, host the repo
(for example with GitHub Pages: Settings → Pages → Deploy from branch), open
the page in Safari and choose Share → Add to Home Screen.

## Files

- `game.html`: the whole game (styles, markup, script).
- `index.html`: generated from `game.html` by `node tools/build.mjs`. Edit
  `game.html`, then rebuild.
- `animals/`: optional real animal photos with transparent backgrounds. See
  `animals/README.md` for file names.
