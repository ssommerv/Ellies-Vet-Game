"""Records every narrator line with the free Kokoro voice model.

    pip install kokoro-onnx soundfile lameenc
    # model files: https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
    node tools/voice/run.cjs                       # refresh tools/voice/lines.json
    python3 tools/voice/build_voice.py --voice af_heart --model DIR

Writes voice/index.json plus voice/pack-N.mp3. Each pack is a run of small MP3
files back to back; the index gives each sentence's pack, byte offset and length.
"""
import argparse, json, os, re, sys, time
import numpy as np, lameenc
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
# Letter teams are spoken as their sound, not their letter names ("sh", not "ess aitch").
SOUNDS = {'sh': 'ʃː', 'ch': 'tʃ', 'th': 'θː'}
PACK_BYTES = 5_000_000

def phonemes(k, text, lang):
    if not re.search(r'\b(sh|ch|th)\b', text):
        return None
    out = []
    for part in re.split(r'\b(sh|ch|th)\b', text):
        if part in SOUNDS: out.append(SOUNDS[part])
        elif part.strip(): out.append(k.tokenizer.phonemize(part, lang))
    return ' '.join(out)

def trim(s, sr):
    loud = np.where(np.abs(s) > 0.01)[0]
    if not len(loud): return s
    pad = int(sr * 0.04)
    return s[max(0, loud[0] - pad): loud[-1] + pad]

def mp3(s, sr):
    enc = lameenc.Encoder(); enc.set_bit_rate(32); enc.set_in_sample_rate(sr); enc.set_channels(1); enc.set_quality(2)
    return enc.encode((np.clip(s, -1, 1) * 32767).astype(np.int16).tobytes()) + enc.flush()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default='af_heart')
    ap.add_argument('--speed', type=float, default=0.95)
    ap.add_argument('--model', default='.', help='folder holding kokoro-v1.0.onnx and voices-v1.0.bin')
    ap.add_argument('--out', default=os.path.join(ROOT, 'voice'))
    a = ap.parse_args()
    lang = 'en-gb' if a.voice.startswith('b') else 'en-us'
    k = Kokoro(os.path.join(a.model, 'kokoro-v1.0.onnx'), os.path.join(a.model, 'voices-v1.0.bin'))
    lines = json.load(open(os.path.join(HERE, 'lines.json')))
    os.makedirs(a.out, exist_ok=True)
    for f in os.listdir(a.out):
        if f.startswith('pack-'): os.remove(os.path.join(a.out, f))
    packs, clips, cur, t0 = [], {}, bytearray(), time.time()
    def flush():
        name = f'pack-{len(packs)}.mp3'
        open(os.path.join(a.out, name), 'wb').write(cur); packs.append(name)
    for i, (key, text) in enumerate(lines.items()):
        ph = phonemes(k, text, lang)
        s, sr = k.create(ph, voice=a.voice, speed=a.speed, is_phonemes=True) if ph else k.create(text, voice=a.voice, speed=a.speed, lang=lang)
        data = mp3(trim(s, sr), sr)
        if len(cur) + len(data) > PACK_BYTES:
            flush(); cur = bytearray()
        clips[key] = [len(packs), len(cur), len(data)]
        cur += data
        if i % 200 == 0: print(f'{i}/{len(lines)} {time.time() - t0:.0f}s', flush=True)
    flush()
    json.dump({'voice': a.voice, 'packs': packs, 'clips': clips}, open(os.path.join(a.out, 'index.json'), 'w'), separators=(',', ':'))
    print('done', len(clips), 'clips in', len(packs), 'packs', f'{time.time() - t0:.0f}s')

if __name__ == '__main__':
    main()
