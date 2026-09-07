// Procedural, royalty-free teaser soundtrack built with the Web Audio API.
// Every book gets a slightly different mood, seeded from its id.

const SCALES: number[][] = [
  [0, 2, 4, 7, 9], // major pentatonic — warm
  [0, 3, 5, 7, 10], // minor pentatonic — moody
  [0, 2, 3, 7, 9], // dorian-ish — wistful
  [0, 4, 5, 7, 11], // lydian-ish — bright
];

const ROOTS = [220, 233.08, 246.94, 261.63, 293.66, 311.13];

// Per-book arrangement presets — different tempos, rhythms, timbres.
const TEMPOS = [0.26, 0.3, 0.35, 0.42, 0.5]; // seconds per step
const LEAD_TYPES: OscillatorType[] = ["triangle", "sine", "square", "sawtooth"];
const BASS_TYPES: OscillatorType[] = ["sine", "triangle"];
const MELODY_STEPS = [2, 3, 1, 4]; // melody interval jump per style
const FILTERS = [1400, 1800, 2200, 2800];

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const semitone = (base: number, n: number) => base * Math.pow(2, n / 12);

export class TeaserMusic {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private nextNoteTime = 0;
  private step = 0;
  private scale: number[];
  private root: number;
  private tempo: number;
  private leadType: OscillatorType;
  private bassType: OscillatorType;
  private melodyJump: number;
  private filterFreq: number;
  private arpOffset: number;
  private muted = false;

  constructor(seed: string) {
    const h = hash(seed || "book");
    this.scale = SCALES[h % SCALES.length]!;
    this.root = ROOTS[(h >> 3) % ROOTS.length]!;
    this.tempo = TEMPOS[(h >> 5) % TEMPOS.length]!;
    this.leadType = LEAD_TYPES[(h >> 8) % LEAD_TYPES.length]!;
    this.bassType = BASS_TYPES[(h >> 11) % BASS_TYPES.length]!;
    this.melodyJump = MELODY_STEPS[(h >> 13) % MELODY_STEPS.length]!;
    this.filterFreq = FILTERS[(h >> 15) % FILTERS.length]!;
    this.arpOffset = (h >> 17) % 5;
  }

  private ensureCtx() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.28;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private voice(freq: number, time: number, dur: number, gain: number, type: OscillatorType) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = this.filterFreq;
    osc.type = type;
    osc.frequency.value = freq;
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(gain, time + Math.min(0.25, dur * 0.3));
    env.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(filter).connect(env).connect(this.master!);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  private schedule() {
    const ctx = this.ctx!;
    while (this.nextNoteTime < ctx.currentTime + 0.4) {
      const t = this.nextNoteTime;
      const s = this.step;
      const len = this.scale.length;

      // arpeggio / melody — pattern and octave shift differ per book
      const degree = this.scale[(s * this.melodyJump + Math.floor(s / 4) + this.arpOffset) % len]!;
      const octave = (s + this.arpOffset) % 8 < 4 ? 12 : 24;
      this.voice(semitone(this.root, degree + octave), t, this.tempo * 2.6, 0.12, this.leadType);

      // soft pad chord every bar, voiced from the book's scale
      if (s % 8 === 0) {
        const chordRoot = this.scale[(s / 8 + this.arpOffset) % len]!;
        [0, 4, 7].forEach((iv, i) =>
          this.voice(semitone(this.root, chordRoot + iv), t, this.tempo * 9, 0.055 - i * 0.008, "sine"),
        );
      }

      // bass pulse — on-beat or syncopated depending on the book
      if (s % 4 === this.arpOffset % 3) {
        this.voice(semitone(this.root, -12), t, this.tempo * 3.2, 0.1, this.bassType);
      }

      this.step = s + 1;
      this.nextNoteTime += this.tempo;
    }
  }

  play() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    void ctx.resume();
    if (this.timer !== null) return;
    this.nextNoteTime = ctx.currentTime + 0.05;
    this.timer = window.setInterval(() => this.schedule(), 100);
  }

  pause() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    void this.ctx?.suspend();
  }

  restart() {
    this.step = 0;
    if (this.ctx) this.nextNoteTime = this.ctx.currentTime + 0.05;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.28, this.ctx.currentTime, 0.05);
    }
  }

  dispose() {
    this.pause();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
