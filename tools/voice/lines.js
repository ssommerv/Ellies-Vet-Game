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

  // clinic shop and decorations
  const stars = n => n + (n === 1 ? ' star' : ' stars');
  add('Welcome to the clinic shop!', 'What would you like?', 'Tap the star bags to pay.', 'Too many stars!', 'Tap a bag to take it back.',
    'Help more animals to earn stars!', 'Adopting a pet costs ' + T.PET_PRICE + ' stars.', 'Help this animal at the clinic first.',
    'Congratulations!', 'Come back tomorrow.');
  range(0, 500).forEach(n => add('You have ' + stars(n) + '.'));
  range(1, 60).forEach(n => add('You need ' + n + ' more ' + (n === 1 ? 'star' : 'stars') + '.'));
  range(51, 60).forEach(n => add(n + '!'));   // running total while paying (0-50 are recorded above)
  T.DECOR.forEach(d => add('The ' + d.name + ' costs ' + d.price + ' stars.', 'The ' + d.name + ' is in your clinic now!'));

  // week edition: Numbers to 10
  T.N10_THINGS.forEach(([, t]) => { add('How many ' + t + ' are in the box?', 'Yes, 0 ' + t + '!', 'Count the ' + t + '.'); range(1, 10).forEach(n => add('Yes, ' + n + ' ' + t + '!')); });
  add('Tap the correct word.', 'Yes!', 'No!', 'Count back.', 'Count on.', 'What comes next?', 'Fill in the missing numbers.',
    'Put the towers in order.', 'Tap the shortest tower first.', 'Tap the tallest tower first.', 'They are in order!',
    'Read the number word by yourself.', 'Then tap the box that matches.');
  range(0, 10).forEach(k => {
    add('Which number is greater than ' + k + '?', 'Which number is less than ' + k + '?');
    range(0, 10).forEach(x => { if (x > k) add(x + ' is greater than ' + k + '!'); if (x < k) add(x + ' is less than ' + k + '!'); });
  });
  range(1, 10).forEach(a => add(a + ' and ' + a + ' are the same!'));
  T.N10_PAIRS.forEach(([[, na], [, nb]]) => add('Are there more ' + na + ' than ' + nb + '?', 'Are there fewer ' + na + ' than ' + nb + '?', 'Is the number of ' + na + ' and ' + nb + ' the same?'));
  range(0, 6).forEach(start => [false, true].forEach(down => {
    const seq = range(start, start + 4); if (down) seq.reverse();
    add(seq.join(', ') + '!');
    range(0, 4).forEach(h => add(seq.map((v, i) => i === h ? 'hmm' : v).join(', ') + '.'));
  }));
  range(0, 9).forEach(x => range(x + 1, Math.min(10, x + 5)).forEach(y => {
    const d = y - x;
    add(y + ' is how many more than ' + x + '?', x + ' is how many less than ' + y + '?', y + ' is ' + d + ' more than ' + x + '!', x + ' is ' + d + ' less than ' + y + '!');
  }));
  range(1, 4).forEach(k => range(0, 10).forEach(n => {
    if (n + k <= 10) add('What is ' + k + ' more than ' + n + '?', k + ' more than ' + n + ' is ' + (n + k) + '!');
    if (n - k >= 0) add('What is ' + k + ' less than ' + n + '?', k + ' less than ' + n + ' is ' + (n - k) + '!');
  }));
  T.NUM_WORDS.forEach(w => add(w + '.', w + '!', 'Can you spell ' + w + '?', w.split('').join(', ') + '.'));

  // week reading: UFLI 37a/b short o words, heart words and word chains
  const oWords = [...new Set([...T.O_WORDS_A, ...T.O_WORDS_B, ...T.O_CHAINS.flat(), ...T.HEART_WORDS])];
  oWords.forEach(w => add(w + '.', w + '!', 'Can you spell ' + w + '?', w.split('').join(', ') + '.', 'This word is ' + w + '.', 'Find the word: ' + w + '.'));
  T.O_CHAINS.forEach(c => c.slice(1).forEach((to, i) => add(T.chainStep(c[i], to), c[i] + ', ' + to + '!')));
  add('What word is this?', 'Listen, then spell the word.', 'Read the question by yourself.', 'Then tap yes or no.', 'Read the vet note by yourself.', 'Then tap the picture that matches.');
  T.O_QUESTIONS.forEach(([q]) => add(q));
  T.O_SCENE_ANIMALS.forEach(([a]) => T.O_SCENE_PLACES.forEach(([p]) => add('The ' + a + ' is on the ' + p + '.')));
  ['we', 'she', 'for', 'the', 'my'].forEach(w => add(w + '!'));

  // adopted pets
  A.forEach(a => add('You adopted ' + a.name + '!', 'Welcome to the family, ' + a.name + '!', 'Say hi to ' + a.name + '!',
    a.name + ' missed you!', a.name + ' loves the food!', a.name + ' loves pats!', a.name + ' loves to play!', a.name + ' is so happy!'));

  return out;
};
