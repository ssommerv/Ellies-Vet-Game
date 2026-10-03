"""Records every narrator line with an ElevenLabs voice (for example a saved voice called "Jessa").

    export ELEVENLABS_API_KEY=...            # set in the environment, never committed
    node tools/voice/run.cjs                 # refresh tools/voice/lines.json
    python3 tools/voice/build_voice_elevenlabs.py --voice-name Jessa --estimate      # count, no API calls
    python3 tools/voice/build_voice_elevenlabs.py --voice-name Jessa --sample 8      # a few lines to listen to
    python3 tools/voice/build_voice_elevenlabs.py --voice-name Jessa                 # everything

Writes the same files as build_voice.py (voice/index.json plus voice/pack-N.mp3), so the
game needs no changes. Each recorded line is cached by voice, model and text in --cache,
so a re-run (after a network error, or after adding new lines) only pays for lines it
has not recorded yet.
"""
import argparse, concurrent.futures as cf, hashlib, json, os, sys, time, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
API = 'https://api.elevenlabs.io'
PACK_BYTES = 5_000_000
# Letter teams are spoken as their sound, not their letter names.
SOUNDS = {' sh,': ' shh,', ' sh?': ' shh?', ' ch,': ' ch-,', ' ch?': ' ch-?', ' th,': ' thh,', ' th?': ' thh?'}
SAMPLE_LINES = ['Welcome, Doctor Ellie!', 'Your patients are waiting.', "Biscuit feels hot and sleepy. Let's help!",
                'Give Kitty 7 fish treats.', 'Change the t to g.', 'Can you spell frog?', 'Wow, well done!', 'Yes, 8 bandages!']

def key():
    k = os.environ.get('ELEVENLABS_API_KEY')
    if not k: sys.exit('ELEVENLABS_API_KEY is not set in this environment.')
    return k

def call(path, body=None, tries=6):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode() if body else None,
                                 headers={'xi-api-key': key(), 'Content-Type': 'application/json', 'Accept': '*/*'})
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            msg = e.read()[:300].decode('utf-8', 'replace')
            if e.code in (429, 500, 502, 503, 504) and i < tries - 1:
                time.sleep(2 ** i * 2); continue
            sys.exit(f'ElevenLabs said {e.code}: {msg}')
        except (urllib.error.URLError, TimeoutError):
            if i < tries - 1: time.sleep(2 ** i * 2); continue
            raise

def find_voice(name):
    voices = json.loads(call('/v1/voices'))['voices']
    hit = [v for v in voices if v['name'].strip().lower() == name.lower()] or [v for v in voices if name.lower() in v['name'].lower()]
    if not hit: sys.exit(f'No saved voice called "{name}". Voices on this account: ' + ', '.join(v['name'] for v in voices))
    return hit[0]['voice_id'], hit[0]['name']

def spoken(text):
    for a, b in SOUNDS.items(): text = text.replace(a, b)
    return text

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice-name', default='Jessa')
    ap.add_argument('--model', default='eleven_multilingual_v2')
    ap.add_argument('--format', default='mp3_22050_32')
    ap.add_argument('--out', default=os.path.join(ROOT, 'voice'))
    ap.add_argument('--cache', default=os.path.join(ROOT, '.voice-cache'))
    ap.add_argument('--workers', type=int, default=3)
    ap.add_argument('--estimate', action='store_true', help='only count lines and characters')
    ap.add_argument('--sample', type=int, help='record this many sample lines into --cache/samples and stop')
    a = ap.parse_args()
    lines = json.load(open(os.path.join(HERE, 'lines.json')))
    chars = sum(len(t) for t in lines.values())
    if a.estimate:
        print(f'{len(lines)} lines, {chars} characters'); return
    vid, vname = find_voice(a.voice_name)
    print('voice:', vname, vid, '| model:', a.model)
    os.makedirs(a.cache, exist_ok=True)

    def record(text):
        h = hashlib.sha1(f'{vid}|{a.model}|{a.format}|{text}'.encode()).hexdigest()
        path = os.path.join(a.cache, h + '.mp3')
        if not os.path.exists(path):
            audio = call(f'/v1/text-to-speech/{vid}?output_format={a.format}', {'text': spoken(text), 'model_id': a.model})
            open(path + '.part', 'wb').write(audio); os.replace(path + '.part', path)
        return open(path, 'rb').read()

    if a.sample:
        out = os.path.join(a.cache, 'samples'); os.makedirs(out, exist_ok=True)
        for i, t in enumerate(SAMPLE_LINES[:a.sample]):
            open(os.path.join(out, f'sample-{i + 1}.mp3'), 'wb').write(record(t)); print('recorded:', t)
        print('samples in', out); return

    t0, done = time.time(), 0
    datas = {}
    with cf.ThreadPoolExecutor(a.workers) as pool:
        futs = {pool.submit(record, text): key_ for key_, text in lines.items()}
        for f in cf.as_completed(futs):
            datas[futs[f]] = f.result(); done += 1
            if done % 200 == 0: print(f'{done}/{len(lines)} {time.time() - t0:.0f}s', flush=True)
    os.makedirs(a.out, exist_ok=True)
    for f in os.listdir(a.out):
        if f.startswith('pack-'): os.remove(os.path.join(a.out, f))
    packs, clips, cur = [], {}, bytearray()
    def flush():
        name = f'pack-{len(packs)}.mp3'
        open(os.path.join(a.out, name), 'wb').write(cur); packs.append(name)
    for key_ in lines:
        d = datas[key_]
        if len(cur) + len(d) > PACK_BYTES: flush(); cur = bytearray()
        clips[key_] = [len(packs), len(cur), len(d)]; cur += d
    flush()
    json.dump({'voice': 'elevenlabs:' + vname, 'packs': packs, 'clips': clips}, open(os.path.join(a.out, 'index.json'), 'w'), separators=(',', ':'))
    print('done', len(clips), 'clips in', len(packs), 'packs', f'{time.time() - t0:.0f}s')

if __name__ == '__main__':
    main()
