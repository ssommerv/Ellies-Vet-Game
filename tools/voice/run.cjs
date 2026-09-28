// Collects every narrator sentence into tools/voice/lines.json, then plays each
// activity many times in a headless browser and reports any spoken sentence
// that is missing from that list.
//   node tools/voice/run.cjs
const fs = require('fs'), path = require('path'), os = require('os');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const root = path.join(__dirname, '..', '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
  // expose the game's data and record everything passed to say()
  .replace(/^showTitle\(\);$/m, 'window.__T={SKILLS:ALL_SKILLS,NUM_WORDS,N10_THINGS,N10_PAIRS,ANIMALS,AILMENTS,CVC,BLENDS,RHYMES,SIGHT,DIGRAPH,SYLL,COINS,PRAISE,OOPS,DECOR,PET_PRICE,cents,clipKey,sentences};showTitle();')
  .replace('async function speak(text, id) {', 'async function speak(text, id) {\n  (window.__said = window.__said || []).push(String(text));');
const tmp = path.join(os.tmpdir(), 'vet-voice-check.html');
fs.writeFileSync(tmp, html);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + tmp);
  await page.addScriptTag({ path: path.join(__dirname, 'lines.js') });
  const lines = await page.evaluate(() => {
    const T = window.__T, map = {};
    for (const text of window.voiceLines(T)) for (const s of T.sentences(text)) {
      const k = T.clipKey(s);
      if (!(k in map)) map[k] = s;
    }
    return map;
  });
  fs.writeFileSync(path.join(__dirname, 'lines.json'), JSON.stringify(lines, null, 0));
  console.log(Object.keys(lines).length, 'sentences written to tools/voice/lines.json');

  // Play every activity at every level and collect what the narrator says.
  const missing = await page.evaluate(lines => {
    const T = window.__T, heard = [];
    for (const [k, sk] of Object.entries(T.SKILLS)) for (let l = 1; l <= 3; l++) for (let i = 0; i < 400; i++) {
      const a = T.ANIMALS[i % T.ANIMALS.length], act = sk.make(l, a), box = document.createElement('div');
      heard.push(act.speak || act.prompt);
      const api = { win: after => heard.push(typeof after === 'function' ? after() : after || ''), miss: (n, msg) => msg && heard.push(msg) };
      const hint = act.build(box, api);
      box.querySelectorAll('button').forEach(b => { try { b.click(); } catch (e) {} });
      if (hint) hint();
    }
    heard.push(...(window.__said || []));
    const miss = new Set();
    heard.forEach(t => T.sentences(t).forEach(s => { if (!(T.clipKey(s) in lines)) miss.add(s); }));
    return [...miss];
  }, lines);
  await page.waitForTimeout(500);
  const said = await page.evaluate(lines => (window.__said || []).flatMap(t => window.__T.sentences(t)).filter(s => !(window.__T.clipKey(s) in lines)), lines);
  const all = [...new Set([...missing, ...said])];
  console.log(all.length ? 'Missing ' + all.length + ' sentences:\n  ' + all.slice(0, 60).join('\n  ') : 'Every spoken sentence is covered.');
  await browser.close();
  process.exit(all.length ? 1 : 0);
})();
