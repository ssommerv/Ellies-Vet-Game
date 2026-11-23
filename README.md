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
- **Chapter 3: Addition Facts to 10** (the current edition, from 23 November):
  only Chapter 3 math, built from the textbook pages 43–65, until a grown-up
  picks another edition. Nine activities, every sum within 10, using the book's
  wording:
  - counting on from the greater number with the cup of treats ("6, 7, 8") or
    the counting tape ("Start here", hops 1, 2), choosing which number to start
    from when the smaller one comes first;
  - "What is 2 more than 7?" on cube trains, ten frames and the counting tape
    ("9 is 2 more than 7. 2 added to 7 is 9.");
  - number bonds (part, part, whole), including "5 and 2 make 7. What other
    numbers make 7?";
  - completing addition sentences from cube trains, ten frames and pictures;
  - adding in any order (3 + 2 = 2 + 3);
  - practice facts like the "Let's Practise" page;
  - addition stories about pictures (ducks in a pond, teddy bears, apples on
    plates including 0, girls playing, birds, bicycles, turtles, yellow and
    green beans);
  - word problems (the tug-of-war, John's cards, Isa's stickers, Yuhan's
    empty plate, Megan's markers, the dancing children, the marble jars with
    0, Kelly's stickers, and a few at the clinic);
  - counting and "1 more than".

  It is a *focus* edition: while it is on, the spelling test button is hidden
  and shop checkout is one tap, so everything Ellie practises is Chapter 3.
  Picking another edition in the Grown-ups corner brings everything back.
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

- **Week of Oct 19**: reading first, about 9 in 10 steps.
  UFLI Lesson 40 (short e review): read and then write the heart words said,
  you, what and have, Roll and Read 40a, the story "The Pet Hen", short e
  spelling, sentences and chains made from the week's words. A little Numbers
  to 10 math stays in as review. Editions can set `weights` to choose how often
  each activity comes up.
- **Week of Oct 12**: reading from UFLI Lesson 39 (short u
  review): read and then write (spell) the heart words said, look, book, are
  and was, Roll and Read 39a, the story "Cub and Pup", short u spelling,
  sentences, and short u word chains made from the week's words (no chain
  sheet came home). Math reviews Numbers to 10.
- **Week of Oct 5**: reading from UFLI Lesson 38 (short
  a, i, o review): word chains from the sheet (sat → sit → lit → lot, mix →
  fix → fax → fox) as both reading and spelling steps, spelling the sample and
  Roll and Read words, the 12 heart words (a, said, he, be, me, from, to, do,
  of, see, the, I), Roll and Read with a die, the story "The Big Box" with
  comprehension questions, and short sentences like "The pig ran from me."
  Math reviews Numbers to 10. When a new week ships the game switches to it
  once (`CURRENT_WEEK`); the Grown-ups corner can switch back.

Each UFLI week is one config object (`U38_CFG`, `U39_CFG`, ...) that
`ufliSkills()` turns into that week's activities, and `tools/voice/lines.js`
reads the same configs, so adding a week is a config, an `EDITIONS` entry and
recording its new lines.

## Spelling test

The **🏷️ Spelling test** button on the title screen (also 🏷️ in the top bar;
both are hidden while a focus edition such as Chapter 3 is on) opens a mode that is only a spelling test, with no patients. Dr. Ellie says
each word ("said. Spell said."), and Ellie stamps it onto a pet's dog tag with
a big a–z keyboard, then taps **Stamp it**. Each tap makes a little click, ⌫
rubs a letter out, and Ellie's face or 🔊 repeats the word. Words are only
marked after stamping, like a real test: a right word turns the tag gold, and a
wrong one shows her letters next to the right spelling while the narrator
spells it out. At the end she sees all her tags, earns a star per right word,
and can practise just the words she missed.

A test is 10 words in a mixed order from the current week's UFLI list: the
heart words, then that week's spelling words, two of them harder ones. In the Grown-ups
corner you can type the exact list from the school sheet instead (up to 15
words), and see the scores of the last tests. Only the current week's words
are pre-recorded, so new custom words use the device voice until recorded.

### Chapter 1 test practice (until Monday, October 5, 2026)

For the Chapter 1 unit test, a temporary **test practice** mode replaces the
week's edition until midnight after the test, then turns itself off. Every
patient's steps come from the test topics on the teacher's review note, and
the first step is nearly always a "relate to 5 and 10" question ("8 is __ more
than 5", "6 is __ less than 10", "3 more than 5 is __"). It adds four
activities modelled on the review package: relating numbers to 5 and 10 on a
number track, finding the 2 sets with the same number, tapping the set with
more or fewer then filling in "__ is greater than __", and counting a group
then picking its number and word. The Grown-ups corner can switch it off.

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

Every line the game speaks is pre-recorded and stored in `voice/`. The narrator
is the ElevenLabs voice "Jessa" (Multilingual v2, made with
`tools/voice/build_voice_elevenlabs.py`); the free [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M)
model (`build_voice.py`) is the no-cost alternative. Any line without a
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

To use an ElevenLabs voice instead (for example a saved voice called "Jessa"),
set `ELEVENLABS_API_KEY` in the environment (never in the repo), then run
`python3 tools/voice/build_voice_elevenlabs.py --voice-name Jessa --estimate`
to count characters, `--sample 8` to hear a few lines, and no flag to record
everything. Recorded lines are cached in `.voice-cache/` (not committed), so
re-runs only pay for new lines. It also reuses the clips already in `voice/`
when they were made with the same voice, so adding a week only records its new
lines.

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
