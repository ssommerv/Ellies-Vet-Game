// Lists every sentence the narrator can say, using the game's own data.
// Runs inside the game page (see run.cjs). Keep in step with the say()/speak/after
// text in game.html: run.cjs --check reports any sentence this list misses.
window.voiceLines = function (T) {
  const out = [];
  const add = (...xs) => xs.flat(Infinity).forEach(x => out.push(String(x)));
  const range = (a, b, step) => { const r = []; for (let i = a; i <= b; i += step || 1) r.push(i); return r; };
  const name = 'Ellie';
  const A = T.ANIMALS;

  // general
  add(T.PRAISE, T.OOPS, 'Welcome, Doctor ' + name + '! Your patients are waiting.', "Let's help!",
    'Thank you, Doctor ' + name + '!', 'You earned a sticker.');
  A.forEach(a => {
    T.AILMENTS.forEach(ail => add(a.name + ' ' + ail.says + '.'));
    add(a.name + ' feels all better!');
  });
  T.AILMENTS.forEach(ail => ail.steps.forEach(st => add(st[1] + '.')));

  // counting food
  A.forEach(a => range(3, 20).forEach(n => add('Give ' + a.name + ' ' + n + ' ' + a.foods + '.')));
  add('Tap them into the bowl, then press done.', 'Yum yum!', 'That is too many!');
  range(0, 50).forEach(n => add(n + '!'));
  range(0, 24).forEach(c => add('You gave ' + c + '.'));
  A.forEach(a => add(a.name + ' needs more.'));

  // how many
  const things = ['bandages', 'vitamins', 'chew toys', 'toys'];
  things.forEach(t => { add('How many ' + t + ' are in the boxes?'); range(1, 50).forEach(n => add('Yes, ' + n + ' ' + t + '!')); });
  add('Each full box has ten.');

  // adding and taking away
  A.forEach(a => {
    range(0, 20).forEach(x => add(a.name + ' has ' + x + ' ' + a.foods + '.'));
    range(1, 19).forEach(y => add(a.name + ' eats ' + y + '.'));
  });
  range(1, 19).forEach(y => add('You give ' + y + ' more.'));
  add('How many now?', 'How many are left?');
  range(1, 19).forEach(x => range(1, 20 - x).forEach(y => add(x + ' plus ' + y + ' is ' + (x + y) + '!')));
  range(2, 20).forEach(x => range(1, x - 1).forEach(y => add(x + ' take away ' + y + ' is ' + (x - y) + '!')));

  // comparing
  add('Which jar has MORE treats?', 'Which pet is HEAVIER on the scale?', 'Which pet is LIGHTER on the scale?');
  range(1, 50).forEach(v => add(v + ' kilograms.', 'Or ' + v + ' kilograms?', v + ' kilograms is heavier!', v + ' kilograms is lighter!'));
  range(1, 10).forEach(p => range(1, 10).forEach(q => p !== q && add(p + ' is more than ' + q + '!')));

  // skip counting (same rules as the game: 5 numbers, one blank that is never first)
  [[10, 'tens'], [5, 'fives'], [2, 'twos']].forEach(([step, word]) => {
    add('Count by ' + word + '.', 'Which number is missing?');
    const len = 5, maxStart = Math.floor(50 / step) - len + 1;
    range(step === 10 ? 0 : 1, Math.max(1, maxStart)).forEach(start => {
      const seq = range(0, len - 1).map(i => (start + i) * step);
      add(seq.join(', ') + '!');
      range(1, len - 1).forEach(h => add(seq.map((v, i) => i === h ? 'hmm' : v).join(', ') + '.'));
    });
  });

  // tens and ones
  add('The vet built a block tower for the waiting room.', 'Each stick has 10 blocks.', 'How many blocks are there in all?');
  range(1, 4).forEach(t => range(0, 9).forEach(o => add(t + (t === 1 ? ' ten and ' : ' tens and ') + o + (o === 1 ? ' one make ' : ' ones make ') + (t * 10 + o) + '!')));

  // patterns
  add('Let us decorate the bandage with a pattern.', 'What comes next?');

  // coins
  Object.entries(T.COINS).forEach(([v, c]) => add('Tap the ' + c.name + '.', 'Which coin is worth ' + T.cents(+v) + '?', 'A ' + c.name + ' is worth ' + T.cents(+v) + '!', c.name));
  range(10, 50, 5).forEach(p => add('The medicine costs ' + p + ' cents.', 'Exactly ' + p + ' cents.'));
  add('Tap coins to pay, then press pay.', 'Thank you!', 'You need more.', 'Too much!', 'Tap a coin to take it back.');
  range(0, 200, 5).forEach(s => add('That is ' + s + ' cents.'));

  // coding
  A.forEach(a => add('Help Doctor ' + name + ' walk to ' + a.name + '.', 'You made it to ' + a.name + '!'));
  add('Tap the arrows to make a plan, then press go.', 'Not there yet.', 'Fix your plan and try again!', 'Bonk!', 'Something is in the way.');

  // words, letters and sounds
  const cvc = T.CVC.map(w => w[0]), blends = T.BLENDS.map(w => w[0]);
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  add(letters);
  const allWords = [...cvc, ...blends, ...T.RHYMES.flat().map(w => w[0]), ...T.SIGHT.flat(),
    ...Object.values(T.DIGRAPH).flat().map(w => w[0]), ...T.SYLL.map(s => s[0].replace(/-/g, ''))];
  [...new Set(allWords)].forEach(w => add(w + '.', w + '!'));

  // beginning / middle / end sounds
  cvc.forEach(w => {
    add('What sound does ' + w + ' start with?', 'What sound does ' + w + ' have in the middle?', 'What sound does ' + w + ' end with?');
    add(w + ' starts with ' + w[0] + '!', w + ' has ' + w[1] + ' in the middle!', w + ' ends with ' + w[2] + '!');
  });

  // spelling
  [...cvc, ...blends].forEach(w => add('Can you spell ' + w + '?', w.split('').join(', ') + '.'));

  // reading words and sentences
  add('Sound out the word.', 'Then tap the picture that matches.', 'Read the vet note by yourself.');
  const ANI = ['cat', 'dog', 'pig', 'hen', 'fox', 'bug'], PLACE = ['tub', 'bed', 'box', 'van'], THING = ['hat', 'cup', 'map', 'bag', 'net'];
  ANI.forEach(an => { PLACE.forEach(pl => add('The ' + an + ' is in the ' + pl + '.')); THING.forEach(th => add('The ' + an + ' has a ' + th + '.')); });

  // rhyming
  T.RHYMES.forEach(fam => fam.forEach(t => {
    add('Which word rhymes with ' + t[0] + '?');
    fam.forEach(m => m !== t && add(t[0] + ', ' + m[0] + '.'));
  }));
  T.RHYMES.flat().forEach(w => add(w[0] + '?', 'Or ' + w[0] + '?'));
  add('They rhyme!');

  // sight words
  [...new Set(T.SIGHT.flat())].forEach(w => add('Find the word: ' + w + '.'));
  add('Listen, then find the word you hear.');

  // sh, ch, th
  const keySets = [['sh', 'ch'], ['ch', 'sh'], ['sh', 'th'], ['th', 'sh'], ['ch', 'th'], ['th', 'ch'], ['sh', 'ch', 'th']];
  Object.entries(T.DIGRAPH).forEach(([k, words]) => words.forEach(([w]) => {
    keySets.filter(ks => ks.includes(k)).forEach(ks => add('Does ' + w + ' start with ' + ks.join(', or ') + '?'));
    add(w + ' starts with ' + k.split('').join(' ') + '!');
  }));

  // syllables
  T.SYLL.forEach(([split]) => {
    const w = split.replace(/-/g, ''), parts = split.split('-'), n = parts.length;
    add('Tap the drum for each beat in ' + w + ', then press done.', 'Listen again: ' + w + '.', parts.join(', ') + '.', parts);
    add(n + (n === 1 ? ' beat!' : ' beats!'));
  });
  range(0, 6).forEach(c => add('You tapped ' + c + '.'));

  return out;
};
