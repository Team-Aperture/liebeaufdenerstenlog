/* =====================================================================
 * audio.js — every sound in this game, generated in code.
 *
 * There is not a single audio file in this repository. The music is a
 * small chiptune tracker: pulse waves at three duty cycles, a triangle
 * bass, filtered noise percussion, and a feedback delay send. The sound
 * effects are short synthesised gestures built from the same parts.
 *
 * Nothing is created until the player turns sound on, because browsers
 * require a user gesture before audio may start.
 * ===================================================================== */
"use strict";

window.AUDIO = (function () {

  /* ------------------------------------------------------------------
   * Graph
   * ------------------------------------------------------------------ */
  let ac = null;
  let master = null, musicBus = null, sfxBus = null, delayBus = null;
  let enabled = false;
  let ready = false;

  /* Pulse waves. A plain "square" oscillator is a 50% duty cycle; the
   * thinner duties are what give chiptune leads their reedy character,
   * so they are built as PeriodicWaves from the Fourier series of a
   * rectangular pulse. */
  const waves = {};

  function makePulse(duty, harmonics) {
    const n = harmonics || 28;
    const real = new Float32Array(n + 1);
    const imag = new Float32Array(n + 1);
    for (let k = 1; k <= n; k++) {
      /* b_k of a duty-cycle pulse, normalised */
      imag[k] = (2 / (k * Math.PI)) * Math.sin(Math.PI * k * duty);
    }
    return ac.createPeriodicWave(real, imag, { disableNormalization: false });
  }

  function ensure() {
    if (ac) return ac;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ac = new AC();

    master = ac.createGain();
    master.gain.value = 0.85;

    /* Gentle limiter so a busy bar never clips. */
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 12;
    comp.ratio.value = 6;
    comp.attack.value = 0.004;
    comp.release.value = 0.18;

    master.connect(comp).connect(ac.destination);

    musicBus = ac.createGain(); musicBus.gain.value = 0.55;
    sfxBus = ac.createGain();   sfxBus.gain.value = 0.85;
    musicBus.connect(master);
    sfxBus.connect(master);

    /* One shared eighth-note feedback delay. Chiptune leads live on it. */
    const delay = ac.createDelay(1.0);
    delay.delayTime.value = 0.26;
    const fb = ac.createGain(); fb.gain.value = 0.32;
    const tone = ac.createBiquadFilter();
    tone.type = "lowpass"; tone.frequency.value = 2600;
    delayBus = ac.createGain(); delayBus.gain.value = 0.5;
    delayBus.connect(delay);
    delay.connect(tone).connect(fb).connect(delay);
    tone.connect(musicBus);

    waves.p12 = makePulse(0.125);
    waves.p25 = makePulse(0.25);
    waves.p50 = makePulse(0.5);

    ready = true;
    return ac;
  }

  function resume() {
    if (ac && ac.state === "suspended") ac.resume();
  }

  /* ------------------------------------------------------------------
   * Notes
   * ------------------------------------------------------------------ */
  const SEMI = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

  /** "a4", "c#5", "eb3" -> Hz. Returns 0 for anything unparseable. */
  function hz(note) {
    const m = /^([a-g])([#b]?)(-?\d)$/.exec(String(note).toLowerCase());
    if (!m) return 0;
    let s = SEMI[m[1]];
    if (m[2] === "#") s += 1;
    if (m[2] === "b") s -= 1;
    const midi = (parseInt(m[3], 10) + 1) * 12 + s;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /* Pre-rendered noise, reused by every percussive hit. */
  let noiseBuf = null;
  function noise() {
    if (noiseBuf) return noiseBuf;
    const len = Math.floor(ac.sampleRate * 0.7);
    noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }

  /* ------------------------------------------------------------------
   * Voices
   * ------------------------------------------------------------------ */

  /** One pitched note with an AD envelope, optionally sent to the delay. */
  function tone(opts) {
    if (!ready) return;
    const at = opts.at;
    const dur = opts.dur;
    const o = ac.createOscillator();
    if (opts.wave && waves[opts.wave]) o.setPeriodicWave(waves[opts.wave]);
    else o.type = opts.type || "square";
    o.frequency.setValueAtTime(opts.freq, at);
    if (opts.glide) {
      o.frequency.exponentialRampToValueAtTime(
        Math.max(20, opts.glide), at + dur * 0.9);
    }
    if (opts.vibrato) {
      const lfo = ac.createOscillator();
      const amt = ac.createGain();
      lfo.frequency.value = opts.vibrato;
      amt.gain.value = opts.freq * 0.011;
      lfo.connect(amt).connect(o.frequency);
      lfo.start(at); lfo.stop(at + dur + 0.05);
    }

    const g = ac.createGain();
    const peak = Math.max(0.0002, opts.gain);
    const atk = opts.attack != null ? opts.attack : 0.006;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + atk);
    if (opts.hold) {
      g.gain.setValueAtTime(peak, at + Math.max(atk, dur * 0.55));
    }
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

    o.connect(g);
    g.connect(opts.bus || musicBus);
    if (opts.send) {
      const s = ac.createGain();
      s.gain.value = opts.send;
      g.connect(s).connect(delayBus);
    }
    o.start(at);
    o.stop(at + dur + 0.03);
  }

  /** Filtered noise burst — hats, snares, static, rain. */
  function hit(opts) {
    if (!ready) return;
    const at = opts.at;
    const dur = opts.dur;
    const src = ac.createBufferSource();
    src.buffer = noise();
    src.playbackRate.value = opts.rate || 1;

    const f = ac.createBiquadFilter();
    f.type = opts.filter || "highpass";
    f.frequency.setValueAtTime(opts.freq, at);
    if (opts.sweep) {
      f.frequency.exponentialRampToValueAtTime(Math.max(60, opts.sweep), at + dur);
    }
    f.Q.value = opts.q || 1;

    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, opts.gain), at + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

    src.connect(f).connect(g).connect(opts.bus || musicBus);
    src.start(at);
    src.stop(at + dur + 0.02);
  }

  /* Percussion kit */
  function kick(at, gain) {
    tone({ at: at, dur: 0.17, freq: 132, glide: 42, gain: gain || 0.5,
           type: "sine", attack: 0.002 });
    hit({ at: at, dur: 0.03, freq: 1200, gain: (gain || 0.5) * 0.25 });
  }
  function snare(at, gain) {
    hit({ at: at, dur: 0.13, freq: 1500, sweep: 700, gain: gain || 0.28,
          filter: "bandpass", q: 0.8 });
    tone({ at: at, dur: 0.07, freq: 210, glide: 150, gain: (gain || 0.28) * 0.5,
           type: "triangle" });
  }
  function hat(at, gain, open) {
    hit({ at: at, dur: open ? 0.15 : 0.035, freq: 8200,
          gain: gain || 0.12, rate: 1.6 });
  }

  /* ------------------------------------------------------------------
   * Tracks
   *
   * A pattern is an array of steps. Each step is a note name, "." for
   * a rest, or "-" to let the previous note ring on. One step is a
   * sixteenth note. Patterns loop independently, so a 16-step bass can
   * sit under a 64-step lead without either being written out twice.
   * ------------------------------------------------------------------ */
  const P = (s) => s.trim().split(/\s+/);

  const TRACKS = {
    /* ---- Title. A minor, unhurried, a little wistful, a little hopeful.
       Am – F – C – G, the four chords of every good crush. ---- */
    title: {
      bpm: 96, swing: 0,
      channels: [
        { name: "bass", wave: "p50", type: "triangle", gain: 0.20, dur: 0.9,
          pattern: P(`a2 . . . . . . . f2 . . . . . . .
                      c3 . . . . . . . g2 . . . . . . .`) },
        { name: "arp", wave: "p25", gain: 0.075, dur: 0.42, send: 0.28,
          pattern: P(`a3 c4 e4 c4 a3 c4 e4 c4 f3 a3 c4 a3 f3 a3 c4 a3
                      c4 e4 g4 e4 c4 e4 g4 e4 g3 b3 d4 b3 g3 b3 d4 b3`) },
        { name: "lead", wave: "p50", gain: 0.115, dur: 1.5, send: 0.42, vib: 5,
          pattern: P(`e5 .  .  .  d5 .  c5 .  .  .  a4 .  .  .  .  .
                      c5 .  .  .  e5 .  .  .  d5 .  .  .  .  .  .  .
                      g5 .  .  .  e5 .  d5 .  c5 .  .  .  .  .  .  .
                      b4 .  .  .  d5 .  .  .  a4 .  .  .  .  .  .  .`) },
        { name: "perc", drums: true,
          pattern: P(`. . h . . . h . . . h . . . h .
                      . . h . . . h . . . h . . . H .`) }
      ]
    },

    /* ---- Hub, the event field. C major, bouncy, faintly ridiculous. ---- */
    hub: {
      bpm: 128, swing: 0.14,
      channels: [
        { name: "bass", type: "triangle", gain: 0.24, dur: 0.24,
          pattern: P(`c2 . c2 . c2 . c2 . a2 . a2 . a2 . a2 .
                      f2 . f2 . f2 . f2 . g2 . g2 . g2 . b2 d3`) },
        { name: "arp", wave: "p12", gain: 0.055, dur: 0.16, send: 0.2,
          pattern: P(`c5 e5 g5 e5 c5 e5 g5 e5 a4 c5 e5 c5 a4 c5 e5 c5
                      f4 a4 c5 a4 f4 a4 c5 a4 g4 b4 d5 b4 g4 b4 d5 f5`) },
        { name: "lead", wave: "p50", gain: 0.115, dur: 0.7, send: 0.3,
          pattern: P(`g4 .  a4 .  c5 .  .  b4 g4 .  .  .  e4 .  .  .
                      f4 .  g4 .  a4 .  .  .  g4 .  e4 .  d4 .  .  .
                      c5 .  b4 .  a4 .  g4 .  a4 .  .  .  .  .  .  .
                      d5 .  .  c5 b4 .  a4 .  g4 .  .  .  .  .  .  .`) },
        { name: "perc", drums: true,
          pattern: P(`K . h . S . h . K . h K S . h .
                      K . h . S . h . K . h K S . h H`) }
      ]
    },

    /* ---- Petra. F major, warm, unhurried, mildly damp. ---- */
    petra: {
      bpm: 104, swing: 0.16,
      channels: [
        { name: "bass", type: "triangle", gain: 0.22, dur: 0.5,
          pattern: P(`f2 . . . c3 . . . d3 . . . a2 . . .
                      a#2 . . . f2 . . . c3 . . . c3 . . .`) },
        { name: "arp", wave: "p25", gain: 0.06, dur: 0.3, send: 0.34,
          pattern: P(`f4 a4 c5 a4 e4 g4 c5 g4 d4 f4 a4 f4 c4 e4 a4 e4
                      a#3 d4 f4 d4 f4 a4 c5 a4 g4 c5 e5 c5 g4 c5 e5 g5`) },
        { name: "lead", wave: "p50", gain: 0.1, dur: 1.2, send: 0.4, vib: 4.5,
          pattern: P(`a4 .  .  .  c5 .  .  .  d5 .  .  c5 a4 .  .  .
                      g4 .  .  .  a4 .  .  .  f4 .  .  .  .  .  .  .
                      c5 .  .  .  d5 .  .  .  f5 .  .  e5 d5 .  .  .
                      c5 .  .  a4 g4 .  .  .  f4 .  .  .  .  .  .  .`) },
        { name: "perc", drums: true,
          pattern: P(`K . . h . . S . . h K . S . h .
                      K . . h . . S . . h K . S . h H`) }
      ]
    },

    /* ---- Nando. A minor, night, syncopated, a bit nervous. ---- */
    nando: {
      bpm: 138, swing: 0.1,
      channels: [
        { name: "bass", type: "square", gain: 0.2, dur: 0.2,
          pattern: P(`a2 . a2 a2 . a2 . . g2 . g2 g2 . g2 . .
                      f2 . f2 f2 . f2 . . e2 . e2 e2 . e2 e2 .`) },
        { name: "arp", wave: "p12", gain: 0.05, dur: 0.13, send: 0.36,
          pattern: P(`a4 e5 a5 e5 a4 e5 a5 e5 g4 d5 g5 d5 g4 d5 g5 d5
                      f4 c5 f5 c5 f4 c5 f5 c5 e4 b4 e5 b4 e4 b4 e5 g5`) },
        { name: "lead", wave: "p25", gain: 0.1, dur: 0.55, send: 0.3,
          pattern: P(`.  .  e5 .  a5 .  .  g5 e5 .  .  .  d5 .  .  .
                      .  .  d5 .  g5 .  .  f5 d5 .  .  .  c5 .  .  .
                      .  .  c5 .  f5 .  .  e5 c5 .  .  .  b4 .  .  .
                      e5 .  .  d5 c5 .  b4 .  a4 .  .  .  .  .  .  .`) },
        { name: "perc", drums: true,
          pattern: P(`K . h h S . h . K K h . S . h h
                      K . h h S . h . K K h . S h H .`) }
      ]
    },

    /* ---- Mysti. E Phrygian, slow, cryptic, 47 tabs open. ---- */
    mysti: {
      bpm: 88, swing: 0,
      channels: [
        { name: "bass", type: "triangle", gain: 0.23, dur: 1.6,
          pattern: P(`e2 . . . . . . . . . . . . . . .
                      f2 . . . . . . . . . . . . . . .
                      e2 . . . . . . . . . . . . . . .
                      d2 . . . . . . . . . . . . . . .`) },
        { name: "arp", wave: "p12", gain: 0.055, dur: 0.5, send: 0.5,
          pattern: P(`e4 .  b4 .  .  g4 .  .  c5 .  .  b4 .  .  .  .
                      f4 .  c5 .  .  a4 .  .  c5 .  .  a4 .  .  .  .
                      e4 .  b4 .  .  g4 .  .  b4 .  .  e5 .  .  .  .
                      d4 .  a4 .  .  f4 .  .  a4 .  .  .  .  .  .  .`) },
        { name: "lead", wave: "p50", gain: 0.085, dur: 2.0, send: 0.55, vib: 4,
          pattern: P(`b4 .  .  .  .  .  .  .  c5 .  .  .  .  .  .  .
                      a4 .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
                      g4 .  .  .  .  .  b4 .  e5 .  .  .  .  .  .  .
                      d5 .  .  c5 .  .  b4 .  .  .  .  .  .  .  .  .`) },
        { name: "perc", drums: true,
          pattern: P(`. . . . . . h . . . . . . . . .
                      . . . . . . h . . . . . . . h .`) }
      ]
    },

    /* ---- The reveal. D major, everything at once, no apologies. ---- */
    final: {
      bpm: 124, swing: 0,
      channels: [
        { name: "bass", type: "triangle", gain: 0.26, dur: 0.24,
          pattern: P(`d2 . d2 . d2 . d2 . a2 . a2 . a2 . a2 .
                      b2 . b2 . b2 . b2 . g2 . g2 . g2 . a2 c#3`) },
        { name: "arp", wave: "p25", gain: 0.07, dur: 0.17, send: 0.3,
          pattern: P(`d5 f#5 a5 f#5 d5 f#5 a5 f#5 a4 c#5 e5 c#5 a4 c#5 e5 c#5
                      b4 d5 f#5 d5 b4 d5 f#5 d5 g4 b4 d5 b4 g4 b4 d5 f#5`) },
        { name: "lead", wave: "p50", gain: 0.13, dur: 1.1, send: 0.4, vib: 5.5,
          pattern: P(`d5 .  .  e5 f#5 .  .  .  a5 .  .  .  .  .  f#5 .
                      e5 .  .  .  c#5 .  .  .  e5 .  .  .  .  .  .  .
                      f#5 . .  g5 a5 .  .  .  b5 .  .  a5 f#5 .  .  .
                      g5 .  f#5 . e5 .  .  .  d5 .  .  .  .  .  .  .`) },
        { name: "perc", drums: true,
          pattern: P(`K . h . S . h . K . h K S . h .
                      K . h . S . h . K K h . S h H h`) }
      ]
    }
  };

  /* ------------------------------------------------------------------
   * Sequencer — lookahead scheduling, the only way to get stable
   * timing out of a browser. A timer wakes every 25 ms and schedules
   * everything falling inside the next 150 ms at exact sample times.
   * ------------------------------------------------------------------ */
  let playing = null;      /* { key, def, step, nextTime, timer } */
  let pendingKey = null;   /* requested before the context existed */

  const LOOKAHEAD = 0.15;
  const TICK = 25;

  function scheduleStep(def, step, when) {
    for (const ch of def.channels) {
      const pat = ch.pattern;
      const cell = pat[step % pat.length];
      if (!cell || cell === "." || cell === "-") continue;

      if (ch.drums) {
        if (cell === "K") kick(when, 0.44);
        else if (cell === "S") snare(when, 0.24);
        else if (cell === "h") hat(when, 0.085, false);
        else if (cell === "H") hat(when, 0.11, true);
        continue;
      }

      const f = hz(cell);
      if (!f) continue;
      tone({
        at: when,
        dur: ch.dur || 0.3,
        freq: f,
        wave: ch.wave,
        type: ch.type,
        gain: ch.gain,
        send: ch.send,
        vibrato: ch.vib,
        hold: true
      });
    }
  }

  function pump() {
    if (!playing) return;
    const def = playing.def;
    const stepDur = 60 / def.bpm / 4;   /* sixteenths */
    while (playing.nextTime < ac.currentTime + LOOKAHEAD) {
      const swing = (def.swing && playing.step % 2 === 1)
        ? stepDur * def.swing : 0;
      scheduleStep(def, playing.step, playing.nextTime + swing);
      playing.step += 1;
      playing.nextTime += stepDur;
    }
  }

  /** Cross-fade to a named track. Re-requesting the same track is a no-op. */
  function music(key) {
    pendingKey = key;
    if (!enabled) return;
    if (!ensure()) return;
    resume();
    if (playing && playing.key === key) return;
    stopMusic(0.5);
    if (!key || !TRACKS[key]) return;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(1, ac.currentTime + 0.9);
    gain.connect(musicBus);

    playing = {
      key: key,
      def: TRACKS[key],
      step: 0,
      nextTime: ac.currentTime + 0.08,
      gain: gain,
      timer: setInterval(pump, TICK)
    };
    pump();
  }

  function stopMusic(fade) {
    if (!playing) return;
    clearInterval(playing.timer);
    const g = playing.gain;
    if (g && ac) {
      const t = ac.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (fade || 0.3));
      setTimeout(() => { try { g.disconnect(); } catch (_) {} },
                 (fade || 0.3) * 1000 + 200);
    }
    playing = null;
  }

  /* ------------------------------------------------------------------
   * Sound effects
   * ------------------------------------------------------------------ */
  const S = {};

  function at() { return ac.currentTime; }

  /** Cursor move / dialogue advance. */
  S.blip = () => tone({ at: at(), dur: 0.05, freq: 880, wave: "p25",
                        gain: 0.09, bus: sfxBus });

  /** A choice is committed. */
  S.select = () => {
    const t = at();
    tone({ at: t, dur: 0.06, freq: 660, wave: "p50", gain: 0.1, bus: sfxBus });
    tone({ at: t + 0.055, dur: 0.1, freq: 990, wave: "p50", gain: 0.09, bus: sfxBus });
  };

  /** Typewriter tick — deliberately tiny, it fires a lot. */
  S.type = () => tone({ at: at(), dur: 0.018, freq: 2100 + Math.random() * 420,
                        wave: "p12", gain: 0.022, bus: sfxBus });

  /** Affection up. */
  S.heart = () => {
    const t = at();
    [0, 0.07, 0.14].forEach((d, i) =>
      tone({ at: t + d, dur: 0.16, freq: [784, 988, 1319][i], wave: "p50",
             gain: 0.085, bus: sfxBus, send: 0.3 }));
  };

  /** Affection down / a bad idea. */
  S.deny = () => {
    const t = at();
    tone({ at: t, dur: 0.14, freq: 233, wave: "p25", gain: 0.1, bus: sfxBus });
    tone({ at: t + 0.11, dur: 0.24, freq: 175, wave: "p25", gain: 0.1, bus: sfxBus });
  };

  /** A route reaches GOLD and hands over its digits. */
  S.unlock = () => {
    const t = at();
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      tone({ at: t + i * 0.075, dur: 0.3, freq: f, wave: "p50",
             gain: 0.1, bus: sfxBus, send: 0.45 }));
  };

  /** The GPSr locks on. The big one. */
  S.lock = () => {
    const t = at();
    [587, 740, 880, 1175].forEach((f, i) =>
      tone({ at: t, dur: 1.6, freq: f, wave: "p50", gain: 0.07,
             bus: sfxBus, send: 0.5, hold: true, attack: 0.02 + i * 0.01 }));
    [0, 0.12, 0.24, 0.36, 0.5, 0.7].forEach((d, i) =>
      tone({ at: t + d, dur: 0.4, freq: [587, 740, 880, 1175, 1480, 1760][i],
             wave: "p25", gain: 0.08, bus: sfxBus, send: 0.5 }));
  };

  /** A satellite is acquired — one per digit group. */
  S.ping = (n) => {
    const t = at();
    tone({ at: t, dur: 0.22, freq: 1200 + (n || 0) * 260, wave: "p12",
           gain: 0.07, bus: sfxBus, send: 0.4 });
  };

  /** V-TGM throwing an error. */
  S.error = () => {
    const t = at();
    hit({ at: t, dur: 0.22, freq: 900, sweep: 200, gain: 0.14,
          filter: "bandpass", q: 2, bus: sfxBus });
    tone({ at: t, dur: 0.3, freq: 190, glide: 70, wave: "p12",
           gain: 0.11, bus: sfxBus });
  };

  /** Muggle approaching. Two low, careful notes. */
  S.alert = () => {
    const t = at();
    tone({ at: t, dur: 0.2, freq: 392, type: "sine", gain: 0.1, bus: sfxBus });
    tone({ at: t + 0.2, dur: 0.28, freq: 330, type: "sine", gain: 0.1, bus: sfxBus });
  };

  /** Thorns, stumbles, vans driving off. */
  S.thud = () => {
    const t = at();
    hit({ at: t, dur: 0.18, freq: 420, sweep: 90, gain: 0.16,
          filter: "lowpass", bus: sfxBus });
    tone({ at: t, dur: 0.14, freq: 90, glide: 45, type: "sine",
           gain: 0.16, bus: sfxBus });
  };

  /** Rain starting — a soft swell of filtered noise. */
  S.rain = () => hit({ at: at(), dur: 1.4, freq: 900, sweep: 2600,
                       gain: 0.055, filter: "bandpass", q: 0.6, bus: sfxBus });

  /** UI: panel opening, page turning. */
  S.page = () => hit({ at: at(), dur: 0.09, freq: 2400, sweep: 900,
                       gain: 0.07, bus: sfxBus });

  /** The facility booting up. */
  S.boot = () => {
    const t = at();
    tone({ at: t, dur: 1.1, freq: 55, glide: 110, type: "sawtooth",
           gain: 0.09, bus: sfxBus });
    [0.15, 0.35, 0.6, 0.9].forEach((d, i) =>
      tone({ at: t + d, dur: 0.14, freq: 440 + i * 220, wave: "p12",
             gain: 0.055, bus: sfxBus, send: 0.3 }));
  };

  /* ------------------------------------------------------------------
   * Public surface
   * ------------------------------------------------------------------ */
  function play(name, arg) {
    if (!enabled || !ensure()) return;
    resume();
    const fn = S[name];
    if (fn) { try { fn(arg); } catch (_) {} }
  }

  function setEnabled(on) {
    enabled = !!on;
    if (!enabled) { stopMusic(0.25); return; }
    if (!ensure()) return;
    resume();
    if (pendingKey) music(pendingKey);
  }

  return {
    setEnabled: setEnabled,
    isEnabled: () => enabled,
    music: music,
    stopMusic: stopMusic,
    play: play,
    tracks: () => Object.keys(TRACKS)
  };
})();
