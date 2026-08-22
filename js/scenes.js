/* =====================================================================
 * scenes.js — animated backdrops, weather, particles and the stage.
 *
 * One requestAnimationFrame loop drives everything. Scenes are painted
 * as layered bands with dithered seams (the cheap old trick that makes
 * a flat fill look like a gradient without leaving the pixel grid).
 * ===================================================================== */
"use strict";

window.SCENES = (function () {
  const W = ART.VIEW_W;
  const H = ART.VIEW_H;
  const GROUND = 138;

  /* ------------------------------------------------------------------
   * Painting helpers
   * ------------------------------------------------------------------ */

  /** Dithered seam between two colours — a checkerboard two rows tall. */
  function dither(ctx, y, color, density) {
    const step = density === 2 ? 2 : 3;
    for (let x = 0; x < W; x += step) {
      ART.rect(ctx, x + ((y % 2) ? 1 : 0), y, 1, 1, color);
    }
  }

  function band(ctx, y0, y1, color) {
    ART.rect(ctx, 0, y0, W, y1 - y0, color);
  }

  /** A layered sky with dithered transitions. stops: [[y, color], ...] */
  function sky(ctx, stops) {
    for (let i = 0; i < stops.length; i++) {
      const y0 = stops[i][0];
      const y1 = i + 1 < stops.length ? stops[i + 1][0] : GROUND;
      band(ctx, y0, y1, stops[i][1]);
      if (i > 0) {
        dither(ctx, y0, stops[i - 1][1], 2);
        dither(ctx, y0 + 1, stops[i - 1][1], 3);
      }
    }
  }

  /** A circle drawn on the pixel grid, one horizontal run per row. */
  function disc(ctx, cx, cy, r, color) {
    for (let dy = -r; dy <= r; dy++) {
      const dx = Math.floor(Math.sqrt(r * r - dy * dy));
      ART.rect(ctx, cx - dx, cy + dy, dx * 2 + 1, 1, color);
    }
  }

  /** A sinking sun with the classic sliced-band treatment. */
  function sun(ctx, cx, cy, r, color, sliceColor, sliceFrom) {
    disc(ctx, cx, cy, r, color);
    if (!sliceColor) return;
    for (let y = cy + (sliceFrom || 0); y < cy + r; y += 5) {
      ART.rect(ctx, cx - r, y, r * 2 + 1, 2, sliceColor);
    }
  }

  /**
   * A crumbling wall with an arched doorway. Drawn rather than stored
   * as a sprite grid so the jagged top and the arch stay crisp at any
   * size — a hand-authored grid this big just reads as rubble soup.
   */
  function ruinWall(ctx, x, ground, w, h) {
    const stone = "#6f6880", light = "#877f95", dark = "#4a4459", hole = "#251b30";
    const notch = [0, 0, 1, 3, 2, 0, 4, 1, 0, 2, 5, 3, 1, 0, 0, 2];

    for (let i = 0; i < w; i++) {
      const n = notch[(i >> 1) % notch.length];
      ART.rect(ctx, x + i, ground - h + n, 1, h - n, stone);
    }
    /* courses and vertical joints */
    for (let y = ground - h + 7; y < ground; y += 7) ART.rect(ctx, x, y, w, 1, dark);
    for (let i = 4; i < w; i += 9) ART.rect(ctx, x + i, ground - h + 7, 1, h - 7, dark);
    ART.rect(ctx, x, ground - h + 3, 2, h - 3, light);

    /* arched doorway */
    const dw = Math.max(8, Math.round(w * 0.3));
    const dx = x + Math.round(w * 0.36);
    const dh = Math.round(h * 0.66);
    const r = Math.round(dw / 2);
    ART.rect(ctx, dx, ground - dh + r, dw, dh - r, hole);
    for (let dy = 0; dy <= r; dy++) {
      const o = Math.floor(Math.sqrt(r * r - dy * dy));
      ART.rect(ctx, dx + r - o, ground - dh + r - dy, o * 2, 1, hole);
    }
  }

  /** Chunky pixel cloud, drifting. */
  function cloud(ctx, x, y, s, color) {
    x = Math.round(x);
    ART.rect(ctx, x + 2 * s, y, 6 * s, s, color);
    ART.rect(ctx, x + s, y + s, 9 * s, s, color);
    ART.rect(ctx, x, y + 2 * s, 12 * s, s, color);
    ART.rect(ctx, x + s, y + 3 * s, 10 * s, s, color);
  }

  function wrap(x, span) {
    return ((x % span) + span) % span;
  }

  /* ------------------------------------------------------------------
   * Particles
   * ------------------------------------------------------------------ */
  let particles = [];

  function spawn(p) {
    if (particles.length > 220) particles.shift();
    particles.push(p);
  }

  function burstHearts(x, y, count, color) {
    for (let i = 0; i < (count || 8); i++) {
      spawn({
        kind: "heart",
        x: x + (Math.random() * 54 - 27),
        y: y + (Math.random() * 26 - 13),
        vx: (Math.random() - 0.5) * 26,
        vy: -26 - Math.random() * 30,
        life: 1.3 + Math.random() * 0.8,
        age: 0,
        s: Math.random() < 0.4 ? 2 : 1,
        color: color || "#ff6ba3"
      });
    }
  }

  function burstSparks(x, y, count, color) {
    for (let i = 0; i < (count || 10); i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 20 + Math.random() * 45;
      spawn({
        kind: "spark",
        x: x, y: y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.5 + Math.random() * 0.4,
        age: 0,
        s: 1,
        color: color || "#ffd15c"
      });
    }
  }

  function confetti(count) {
    for (let i = 0; i < (count || 40); i++) {
      spawn({
        kind: "confetti",
        x: Math.random() * W,
        y: -6 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 22,
        vy: 26 + Math.random() * 34,
        life: 3.4 + Math.random() * 1.6,
        age: 0,
        s: Math.random() < 0.35 ? 2 : 1,
        spin: Math.random() * 6,
        color: ["#ff5d9e", "#ffc857", "#2ecf62", "#c0322c", "#7dfab4"][i % 5]
      });
    }
  }

  function burstThorns(x, y) {
    for (let i = 0; i < 14; i++) {
      spawn({
        kind: "spark",
        x: x + (Math.random() * 40 - 20),
        y: y + (Math.random() * 30 - 15),
        vx: (Math.random() - 0.5) * 30,
        vy: (Math.random() - 0.5) * 30,
        life: 0.6,
        age: 0,
        s: 1,
        color: Math.random() < 0.5 ? "#7a2b4a" : "#3f8f5e"
      });
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life) { particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.kind === "heart") p.vy += 12 * dt;
      if (p.kind === "spark") { p.vy += 46 * dt; p.vx *= 0.97; }
      if (p.kind === "confetti") {
        p.spin += dt * 9;
        p.vx += Math.sin(p.age * 4 + p.spin) * 26 * dt;
      }
    }
  }

  function drawParticles(ctx) {
    for (const p of particles) {
      const fade = 1 - p.age / p.life;
      if (fade < 0.35 && Math.floor(p.age * 22) % 2) continue; /* flicker out */
      if (p.kind === "heart") ART.heart(ctx, p.x, p.y, p.s, p.color);
      else if (p.kind === "confetti") {
        const flat = Math.abs(Math.sin(p.spin)) < 0.4;
        ART.rect(ctx, p.x, p.y, p.s * (flat ? 3 : 1), p.s * (flat ? 1 : 3), p.color);
      } else ART.rect(ctx, p.x, p.y, p.s, p.s, p.color);
    }
  }

  function clearParticles() { particles = []; emotes.length = 0; }

  /* ------------------------------------------------------------------
   * Emotes — the floating symbols from the expression sheets. They are
   * pinned to whoever triggered them and live about a second and a half.
   * ------------------------------------------------------------------ */
  const emotes = [];

  function showEmote(who, kind) {
    emotes.push({ who: who, kind: kind, age: 0, life: 1.7 });
  }

  function drawEmotes(ctx, scene, t) {
    for (let i = emotes.length - 1; i >= 0; i--) {
      const e = emotes[i];
      if (e.age >= e.life) { emotes.splice(i, 1); continue; }
      let x = W / 2, y = 40;
      if (e.who === "r3mi" || e.who === "vtgm") {
        const m = UNIT_MARKS[e.who];
        x = m[0] + HOSTS.size(e.who).w * m[2] * 0.5;
        y = m[1] - HOSTS.size(e.who).h * m[2] - 6;
      } else {
        const stage = STAGE[scene];
        let mark = null;
        if (stage) {
          if (e.who === "you" && stage.you) mark = [stage.you[0], stage.you[1], stage.you[2], "you"];
          else if (stage.date && stage.date[0] === e.who) mark = [stage.date[1], stage.date[2], stage.date[3], e.who];
          else if (stage.extras) {
            const hitList = stage.extras.filter((x2) => x2[0] === e.who);
            if (hitList.length) mark = [hitList[0][1], hitList[0][2], hitList[0][3], e.who];
          }
        }
        if (mark) {
          const def = ART.sprites[mark[3]];
          x = mark[0] + (def ? def.w : 16) * mark[2] * 0.5;
          y = mark[1] - (def ? def.h : 24) * mark[2] - 6;
        }
      }
      HOSTS.emote(ctx, e.kind, x, y, 2, e.age, null);
    }
  }

  function updateEmotes(dt) {
    for (const e of emotes) e.age += dt;
  }

  /* ------------------------------------------------------------------
   * Weather: drawn procedurally from time so it never allocates.
   * ------------------------------------------------------------------ */
  function rain(ctx, t, strength) {
    const drops = strength || 70;
    for (let i = 0; i < drops; i++) {
      const seed = i * 97.13;
      const x = wrap(seed * 3.7 + t * 26, W + 40) - 20;
      const y = wrap(seed * 7.3 + t * 190 + (i % 3) * 40, H + 30) - 10;
      ART.rect(ctx, x, y, 1, 3, i % 5 === 0 ? "#cfe6ef" : "#8fb6c9");
    }
    /* splashes: each one is a drop's landing, phased off the same seed */
    for (let i = 0; i < 22; i++) {
      const seed = i * 53.7;
      const x = wrap(seed * 11.3, W);
      const phase = (t * 2.1 + seed * 0.37) % 1;
      const gy = 150 + ((i * 7) % 26);
      if (phase > 0.72) {
        const k = (phase - 0.72) / 0.28;
        const spread = Math.round(k * 3);
        ART.rect(ctx, x - spread, gy, 1, 1, "#bcd9e6");
        ART.rect(ctx, x + spread, gy, 1, 1, "#bcd9e6");
        if (k < 0.5) ART.rect(ctx, x, gy - 1, 1, 1, "#e4f2f8");
      }
    }
  }

  /** Slow motes drifting through a shaft of light. */
  function motes(ctx, t, tint) {
    for (let i = 0; i < 22; i++) {
      const seed = i * 27.31;
      const x = wrap(seed * 13.7 + Math.sin(t * 0.35 + i) * 9, W);
      const y = wrap(seed * 7.9 - t * 5, H - 40) + 12;
      const on = Math.sin(t * 1.4 + i * 2.1) > -0.2;
      if (on) ART.rect(ctx, x, y, 1, 1, tint || "#fff4cf");
    }
  }

  function fireflies(ctx, t) {
    for (let i = 0; i < 16; i++) {
      const seed = i * 31.7;
      const x = 20 + wrap(seed * 11 + Math.sin(t * 0.6 + i) * 14, W - 40);
      const y = 70 + Math.sin(t * 0.9 + seed) * 22 + (i % 4) * 12;
      const on = (Math.sin(t * 3 + i * 1.7) + 1) / 2;
      if (on > 0.55) ART.rect(ctx, x, y, 1, 1, "#ffe9a8");
      if (on > 0.85) ART.rect(ctx, x, y, 2, 2, "#fff6cf");
    }
  }

  function leaves(ctx, t) {
    for (let i = 0; i < 12; i++) {
      const seed = i * 53.1;
      const x = wrap(seed * 5.3 + t * 9 + Math.sin(t * 1.3 + i) * 10, W + 20) - 10;
      const y = wrap(seed * 9.1 + t * 15, H - 30);
      ART.rect(ctx, x, y, 2, 1, i % 2 ? "#c98b3f" : "#8f6b2c");
    }
  }

  function stars(ctx, t) {
    for (let i = 0; i < 40; i++) {
      const seed = i * 17.3;
      const x = wrap(seed * 13.7, W);
      const y = wrap(seed * 5.1, 96);
      const tw = Math.sin(t * 2 + i) > 0.2;
      if (tw) ART.rect(ctx, x, y, 1, 1, i % 7 ? "#fdf3ff" : "#ffd7ea");
    }
  }

  /* ------------------------------------------------------------------
   * Backdrops
   * ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
   * Backdrops
   *
   * Each one is split in two. The static half — sky, hills, skylines,
   * buildings, trees — is painted once into an offscreen canvas and
   * blitted every frame; only the moving half is redrawn. A city
   * skyline alone is several hundred fillRects, and repainting all of
   * that sixty times a second is the difference between a phone that
   * lasts a cache round and one that does not.
   * ------------------------------------------------------------------ */

  const STATIC = {
    event: function (ctx) {
      sky(ctx, [[0, "#7ec8e8"], [44, "#a3dcee"], [86, "#cdeef5"]]);
      for (let x = 0; x < W; x++) {
        const h = 104 + Math.sin(x * 0.03) * 6 + Math.sin(x * 0.011) * 4;
        ART.rect(ctx, x, h, 1, GROUND - h, "#6aa85f");
      }
      band(ctx, GROUND, H, "#5b9a52");
      dither(ctx, GROUND, "#6aa85f", 2);
      ART.rect(ctx, 0, 158, W, 22, "#b79a68");
      dither(ctx, 158, "#5b9a52", 2);
      ART.sprite(ctx, "tent", 12, 92, { scale: 2 });
      ART.sprite(ctx, "pine", 246, 82, { scale: 2 });
      ART.sprite(ctx, "bush", 214, 128, { scale: 1 });
      ART.sprite(ctx, "bush", 118, 132, { scale: 1 });
    },

    forest: function (ctx) {
      sky(ctx, [[0, "#8fd0dd"], [40, "#b6e2e2"], [80, "#d8f0e4"]]);
      /* Two receding walls of conifers. Each tree is a stepped triangle,
       * which reads as a treeline rather than as a picket fence. */
      function treeline(x0, spacing, topBase, jitter, halfWidth, color) {
        for (let x = x0; x < W + spacing; x += spacing) {
          const top = topBase + ((x * 7) % jitter);
          for (let y = top; y < GROUND; y += 2) {
            const grow = Math.min(halfWidth, ((y - top) / 2) + 1);
            ART.rect(ctx, x - grow, y, grow * 2, 2, color);
          }
        }
      }
      treeline(-6, 13, 60, 11, 7, "#2a5f45");
      treeline(-12, 19, 76, 9, 10, "#356f4e");
      band(ctx, GROUND, H, "#41894f");
      dither(ctx, GROUND, "#356f4e", 2);
      ART.rect(ctx, 0, 162, W, 18, "#347042");
      ART.sprite(ctx, "oak", 8, 66, { scale: 2 });
      ART.sprite(ctx, "pine", 268, 74, { scale: 2 });
      ART.sprite(ctx, "pine", 234, 96, { scale: 1 });
      ART.sprite(ctx, "bush", 96, 140, { scale: 1 });
      ART.sprite(ctx, "bush", 190, 144, { scale: 1 });
    },

    city: function (ctx) {
      sky(ctx, [[0, "#2b2140"], [40, "#4a2f52"], [78, "#7a4361"]]);
      /* Windows that flicker are noted here and repainted per frame;
       * the other few hundred are baked. */
      const flickers = [];
      for (let x = -20; x < W + 20; x += 34) {
        const h = 58 + ((x * 13) % 26);
        ART.rect(ctx, x, h, 30, GROUND - h, "#3a2b4d");
        for (let wy = h + 6; wy < GROUND - 6; wy += 9) {
          for (let wx = x + 4; wx < x + 26; wx += 8) {
            const lit = ((wx * 7 + wy * 13) % 11) > 5;
            ART.rect(ctx, wx, wy, 3, 4, lit ? "#ffd98f" : "#2c2039");
            if (!lit && (wx + wy) % 17 === 0) flickers.push([wx, wy]);
          }
        }
      }
      for (let x = -14; x < W + 20; x += 46) {
        const h = 86 + ((x * 7) % 14);
        ART.rect(ctx, x, h, 40, GROUND - h, "#4b3960");
        for (let wy = h + 6; wy < GROUND - 4; wy += 10) {
          for (let wx = x + 5; wx < x + 34; wx += 9) {
            ART.rect(ctx, wx, wy, 4, 5, ((wx * 3 + wy) % 7) > 3 ? "#ffe6ad" : "#3a2b4d");
          }
        }
      }
      band(ctx, GROUND, H, "#4f4a58");
      dither(ctx, GROUND, "#4b3960", 2);
      ART.rect(ctx, 0, 158, W, 22, "#3f3a49");
      for (let x = 4; x < W; x += 16) ART.rect(ctx, x, 158, 10, 1, "#59535f");
      ART.sprite(ctx, "lamppost", 44, 88, { scale: 1 });
      ART.sprite(ctx, "lamppost", 262, 88, { scale: 1 });
      ART.sprite(ctx, "signpost", 148, 96, { scale: 1 });
      return { flickers: flickers };
    },

    ruins: function (ctx) {
      sky(ctx, [[0, "#43305f"], [34, "#7e4a6a"], [66, "#c4707a"], [96, "#e9a173"]]);
      sun(ctx, 238, 100, 20, "#ffd88a", "#c4707a", 2);
      for (let x = 0; x < W; x++) {
        const h = 112 + Math.sin(x * 0.02 + 1.2) * 7;
        ART.rect(ctx, x, h, 1, GROUND - h, "#5b4470");
      }
      band(ctx, GROUND, H, "#4a3a5e");
      dither(ctx, GROUND, "#5b4470", 2);
      ART.rect(ctx, 0, 164, W, 16, "#3e3050");
      ruinWall(ctx, 244, GROUND + 20, 72, 74);
      ruinWall(ctx, 112, GROUND + 12, 44, 30);
      ART.sprite(ctx, "pine", 6, 90, { scale: 2 });
      ART.sprite(ctx, "bush", 176, 146, { scale: 1 });
      ART.sprite(ctx, "bush", 84, 150, { scale: 1 });
    },

    finale: function (ctx) {
      sky(ctx, [[0, "#3a2258"], [26, "#8b3c74"], [56, "#d95f7d"], [88, "#ffab77"]]);
      sun(ctx, 160, 104, 30, "#ffe28f", "#d95f7d", 4);
      for (let x = 0; x < W; x++) {
        const h = 116 + Math.sin(x * 0.017 + 0.4) * 8;
        ART.rect(ctx, x, h, 1, GROUND - h, "#6b3b63");
      }
      band(ctx, GROUND, H, "#4b2b4d");
      dither(ctx, GROUND, "#6b3b63", 2);
      ART.rect(ctx, 0, 164, W, 16, "#3d2340");
      ART.sprite(ctx, "pine", 4, 92, { scale: 2 });
      ART.sprite(ctx, "pine", 288, 96, { scale: 2 });
    },

    title: function (ctx) {
      sky(ctx, [[0, "#33174a"], [30, "#6d2a63"], [62, "#b23f70"], [92, "#e86a86"]]);
      sun(ctx, 160, 96, 34, "#ffd98f", "#b23f70", -14);
      for (let x = 0; x < W; x++) {
        const h = 124 + Math.sin(x * 0.02) * 5;
        ART.rect(ctx, x, h, 1, H - h, "#3b1d43");
      }
      /* grid floor running to the horizon */
      for (let i = 1; i < 9; i++) {
        const y = 130 + i * i * 0.8;
        ART.rect(ctx, 0, y, W, 1, "#7a3a6b");
      }
      for (let i = -8; i <= 8; i++) {
        ctx.strokeStyle = "#7a3a6b";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2 + i * 6, 130);
        ctx.lineTo(W / 2 + i * 40, H);
        ctx.stroke();
      }
    }
  };

  const DYNAMIC = {
    event: function (ctx, t) {
      cloud(ctx, wrap(t * 5, W + 120) - 60, 16, 2, "#ffffff");
      cloud(ctx, wrap(t * 3.2 + 180, W + 120) - 60, 38, 1, "#f2fbff");
      cloud(ctx, wrap(t * 4.1 + 90, W + 120) - 60, 26, 1, "#ffffff");
      for (let i = 0; i < 14; i++) {
        const x = 80 + i * 14;
        const y = 60 + Math.sin(i * 0.8) * 4 + Math.sin(t * 1.6 + i * 0.5) * 1;
        ART.rect(ctx, x, y, 12, 1, "#4a2c46");
        ART.heart(ctx, x + 3, y + 2, 1, i % 2 ? "#ff8ab5" : "#ffd15c");
      }
    },

    forest: function (ctx, t, weather) {
      /* shafts of light through the canopy */
      ctx.save();
      ctx.globalAlpha = 0.09 + Math.sin(t * 0.7) * 0.02;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(40 + i * 70, 0);
        ctx.lineTo(64 + i * 70, 0);
        ctx.lineTo(40 + i * 70, GROUND);
        ctx.lineTo(24 + i * 70, GROUND);
        ctx.fill();
      }
      ctx.restore();

      if (weather === "rain") {
        ctx.save();
        ctx.globalAlpha = 0.25;
        band(ctx, 0, H, "#2f4a63");
        ctx.restore();
        rain(ctx, t, 80);
      } else {
        leaves(ctx, t);
        motes(ctx, t, "#fff4cf");
      }
    },

    city: function (ctx, t, weather, extra) {
      stars(ctx, t);
      if (extra && Math.sin(t * 4) > 0) {
        for (const [wx, wy] of extra.flickers) {
          ART.rect(ctx, wx, wy, 3, 4, "#ffd98f");
        }
      }
      /* pools of lamplight */
      ctx.save();
      ctx.globalAlpha = 0.14 + Math.sin(t * 5.5) * 0.015;
      ctx.fillStyle = "#ffe9a8";
      for (const lx of [49, 267]) {
        ctx.beginPath();
        ctx.moveTo(lx, 92);
        ctx.lineTo(lx + 26, GROUND + 24);
        ctx.lineTo(lx - 26, GROUND + 24);
        ctx.fill();
      }
      ctx.restore();
    },

    ruins: function (ctx, t) {
      fireflies(ctx, t);
      /* bats, because a ruin without bats is just masonry */
      for (let i = 0; i < 3; i++) {
        const x = wrap(t * 22 + i * 110, W + 40) - 20;
        const y = 34 + Math.sin(t * 3 + i * 2) * 8;
        const flap = Math.sin(t * 14 + i) > 0 ? 1 : 0;
        ART.rect(ctx, x, y, 2, 1, "#2b1630");
        ART.rect(ctx, x - 2, y - flap, 2, 1, "#2b1630");
        ART.rect(ctx, x + 2, y - flap, 2, 1, "#2b1630");
      }
    },

    finale: function (ctx, t) {
      for (let i = 0; i < 10; i++) {
        const seed = i * 41.3;
        const x = wrap(seed * 7.7 + Math.sin(t * 0.8 + i) * 12, W);
        const y = wrap(seed * 5.3 - t * 11, H - 40) + 8;
        ART.heart(ctx, x, y, i % 3 === 0 ? 2 : 1, i % 2 ? "#ffc2d6" : "#ff8ab5");
      }
    },

    title: function (ctx, t) {
      stars(ctx, t);
      for (let i = 0; i < 8; i++) {
        const seed = i * 61.7;
        const x = wrap(seed * 9.1 + Math.sin(t + i) * 9, W);
        const y = wrap(seed * 3.7 - t * 8, 120) + 6;
        ART.heart(ctx, x, y, i % 3 === 0 ? 2 : 1, "#ff8ab5");
      }
    }
  };

  /* Baked static layers, built on first use and kept for the session. */
  const baked = {};

  function bakedLayer(scene) {
    if (baked[scene]) return baked[scene];
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    const extra = STATIC[scene](g) || null;
    baked[scene] = { canvas: c, extra: extra };
    return baked[scene];
  }

  function backdrop(ctx, scene, t, weather) {
    const key = STATIC[scene] ? scene : "event";
    const layer = bakedLayer(key);
    ctx.drawImage(layer.canvas, 0, 0);
    DYNAMIC[key](ctx, t, weather, layer.extra);
  }

  /* ------------------------------------------------------------------
   * Actors: who stands where, in which scene.
   * ------------------------------------------------------------------ */
  /* [x, footY, scale] — footY is where the boots meet the ground.
   * The two units stand nearer the camera at the bottom corners, half
   * out of frame, which frames the scene and keeps the middle clear. */
  const STAGE = {
    event:  { you: [62, 150, 3], extras: [["petra", 176, 150, 3], ["nando", 236, 150, 2]] },
    forest: { you: [62, 150, 3], date: ["petra", 186, 150, 3] },
    city:   { you: [62, 150, 3], date: ["nando", 196, 150, 2] },
    ruins:  { you: [62, 150, 3], date: ["mysti", 186, 150, 3] },
    finale: {
      you: [40, 148, 3],
      extras: [["petra", 108, 148, 3], ["nando", 166, 148, 2], ["mysti", 208, 148, 3]]
    }
  };

  /* Where R-3MI and V-TGM stand, per scene. */
  const UNIT_MARKS = { r3mi: [-8, 179, 2], vtgm: [268, 181, 2] };

  /* ------------------------------------------------------------------
   * Actor animation: a hop when something goes well, a recoil when it
   * does not, and a slide-in when a character first appears.
   * ------------------------------------------------------------------ */
  const actorAnim = {};

  const animFor = (name) => (actorAnim[name] ||
    (actorAnim[name] = { hop: 0, recoil: 0, enter: 0, fidget: Math.random() * 6 }));

  function react(name, kind) {
    const a = animFor(name);
    if (kind === "recoil") a.recoil = 1;
    else a.hop = 1;
  }

  function enter(name) { animFor(name).enter = 1; }

  function updateActors(dt) {
    for (const k of Object.keys(actorAnim)) {
      const a = actorAnim[k];
      a.hop = Math.max(0, a.hop - dt * 2.2);
      a.recoil = Math.max(0, a.recoil - dt * 3);
      a.enter = Math.max(0, a.enter - dt * 1.8);
      a.fidget += dt;
    }
  }

  /** Feet-anchored draw so a scale-2 Nando still stands on the ground. */
  function actor(ctx, name, x, footY, scale, t, opts) {
    const o = opts || {};
    const def = ART.sprites[name];
    if (!def) return;
    const a = animFor(name);

    /* a squashed-then-airborne hop, not a plain sine */
    const hop = a.hop > 0 ? Math.sin(a.hop * Math.PI) * 6 * scale * 0.5 : 0;
    const recoil = a.recoil > 0 ? Math.sin(a.recoil * Math.PI * 2) * 2 * scale : 0;
    /* every so often, glance around */
    const glance = Math.sin(a.fidget * 0.7) > 0.985 ? 1 : 0;

    if (a.enter > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, (1 - a.enter) * 2.2);
    }
    x += (o.flip ? 1 : -1) * a.enter * a.enter * 26 + recoil;

    const bob = Math.round(Math.sin(t * 1.8 + (o.phase || 0)) * 1 - hop + glance);
    const y = footY - def.h * scale + bob;
    /* contact shadow keeps them from floating */
    ctx.save();
    ctx.globalAlpha = 0.22;
    ART.rect(ctx, x + scale, footY - scale, (def.w - 2) * scale, scale, "#1a0f22");
    ctx.restore();

    const blinkCycle = (t * 1000 + (o.phase || 0) * 900) % 3800;
    ART.sprite(ctx, name, x, y, {
      scale: scale,
      flip: o.flip,
      blink: blinkCycle < 130,
      talk: o.talking ? Math.floor(t * 8) % 2 === 0 : false,
      alpha: o.alpha
    });
    if (a.enter > 0) ctx.restore();
    return { x: x, y: y, w: def.w * scale, h: def.h * scale };
  }

  function props(ctx, scene, t) {
    const wob = Math.round(Math.sin(t * 2.2) * 1);
    if (scene === "forest") ART.sprite(ctx, "petling", 268, 126 + wob, { scale: 2 });
    if (scene === "city")   ART.sprite(ctx, "magnet", 264, 134 + wob, { scale: 2 });
    if (scene === "ruins")  ART.sprite(ctx, "notebook", 154, 134 + wob, { scale: 2 });
    if (scene === "event" || scene === "finale") {
      ART.sprite(ctx, "ammocan", 292, 142 + wob, { scale: 1 });
    }
    /* You always have the GPSr out. Obviously. */
    const s = STAGE[scene] && STAGE[scene].you;
    if (s) ART.sprite(ctx, "gpsr", s[0] + 44, s[1] - 46 + wob, { scale: 2 });
  }

  /**
   * The two units of the facility, standing in the near foreground.
   * Whichever one is speaking leans in a little and gets its emote.
   */
  function units(ctx, t, o) {
    const speaking = o.speaker;
    ["r3mi", "vtgm"].forEach((who) => {
      const m = UNIT_MARKS[who];
      const talking = speaking === who || speaking === "units";
      const lean = talking ? 3 : 0;
      const dir = who === "r3mi" ? 1 : -1;
      const box = HOSTS.draw(ctx, who, m[0] + lean * dir, m[1], m[2], {
        t: t,
        talking: talking,
        expr: o[who + "Expr"],
        pose: o[who + "Pose"]
      });
      /* A nameplate for whoever is talking, pinned to its own screen
       * edge rather than centred on the unit — centred plates drift
       * over whoever happens to be standing behind them. */
      if (talking) {
        const label = who === "r3mi" ? "R-3MI" : "V-TGM";
        const wdt = ART.textWidth(label, 1) + 7;
        const lx = who === "r3mi" ? 3 : W - wdt - 3;
        const ly = m[1] - HOSTS.size(who).h * m[2] - 12;
        ART.rect(ctx, lx, ly, wdt, 10, "#0e0b14dd");
        ART.rect(ctx, lx, ly + 9, wdt, 1,
                 who === "r3mi" ? HOSTS.PAL.r3mi.accent : HOSTS.PAL.vtgm.accent);
        ART.text(ctx, label, lx + 3, ly + 3, 1,
                 who === "r3mi" ? HOSTS.PAL.r3mi.eye : HOSTS.PAL.vtgm.eye);
      }
    });
  }

  /* ------------------------------------------------------------------
   * Public render entry point
   * ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
   * Transitions. A block dissolve: each 8x8 cell has a fixed threshold,
   * so cells wink out and back in a stable scatter rather than a sweep.
   * ------------------------------------------------------------------ */
  const CELL = 8;
  const COLS = Math.ceil(W / CELL), ROWS = Math.ceil(H / CELL);
  const cellOrder = [];
  for (let cy = 0; cy < ROWS; cy++) {
    for (let cx = 0; cx < COLS; cx++) {
      /* diagonal bias plus a stable jitter, so it reads as a wipe with
         a bit of grit rather than as pure noise */
      const diag = (cx + cy) / (COLS + ROWS);
      const jitter = (((cx * 73 + cy * 151) % 97) / 97) * 0.45;
      cellOrder.push(Math.min(1, diag * 0.7 + jitter));
    }
  }

  let trans = { active: false, k: 0, dir: 1, onSwap: null, swapped: false };

  function beginTransition(onSwap) {
    trans = { active: true, k: 0, dir: 1, onSwap: onSwap || null, swapped: false };
  }

  function updateTransition(dt) {
    if (!trans.active) return;
    /* dir carries the sign — without it the cover-up never uncovers. */
    trans.k += dt * (trans.dir > 0 ? 3.2 : -2.4);
    if (trans.dir > 0 && trans.k >= 1) {
      trans.k = 1;
      trans.dir = -1;
      if (trans.onSwap && !trans.swapped) { trans.swapped = true; trans.onSwap(); }
    } else if (trans.dir < 0 && trans.k <= 0) {
      trans.k = 0;
      trans.active = false;
    }
  }

  function drawTransition(ctx) {
    if (!trans.active) return;
    let i = 0;
    for (let cy = 0; cy < ROWS; cy++) {
      for (let cx = 0; cx < COLS; cx++, i++) {
        if (cellOrder[i] < trans.k) {
          ART.rect(ctx, cx * CELL, cy * CELL, CELL, CELL, "#160b1c");
        }
      }
    }
  }

  const inTransition = () => trans.active;

  /* A one-frame colour wash, used for glitches and big reveals. */
  let flash = { a: 0, color: "#ffffff" };
  function setFlash(color, amount) { flash = { a: amount || 0.6, color: color || "#ffffff" }; }

  /* ------------------------------------------------------------------
   * Public render entry point
   * ------------------------------------------------------------------ */
  function render(ctx, scene, opts) {
    const o = opts || {};
    const t = o.time || 0;

    ctx.save();
    if (o.shake > 0) {
      ctx.translate(
        Math.round((Math.random() - 0.5) * o.shake * 4),
        Math.round((Math.random() - 0.5) * o.shake * 4)
      );
    }

    backdrop(ctx, scene, t, o.weather);

    const stage = STAGE[scene];
    if (stage) {
      /* A Muggle wanders through, entirely unaware, behind everyone. */
      if (o.weather === "muggle") {
        const mx = 300 - wrap(t * 14, 360);
        actor(ctx, "muggle", mx, 150, 2, t, { phase: 2.1, flip: true });
        ART.sprite(ctx, "dog", mx + 34, 132, { scale: 2, flip: true });
      }

      if (stage.date) {
        const d = stage.date;
        actor(ctx, d[0], d[1], d[2], d[3], t, {
          talking: o.speaker === d[0], phase: 1.3, flip: true
        });
      }
      if (stage.extras) {
        stage.extras.forEach((e, i) =>
          actor(ctx, e[0], e[1], e[2], e[3], t, {
            talking: o.speaker === e[0], phase: 0.7 * (i + 1), flip: true
          })
        );
      }
      if (stage.you) {
        actor(ctx, "you", stage.you[0], stage.you[1], stage.you[2], t, {
          talking: o.speaker === "you", phase: 0
        });
      }
      props(ctx, scene, t);
      units(ctx, t, o);
    }

    drawParticles(ctx);
    drawEmotes(ctx, scene, t);
    ctx.restore();

    if (flash.a > 0.01) {
      ctx.save();
      ctx.globalAlpha = Math.min(0.85, flash.a);
      ART.rect(ctx, 0, 0, W, H, flash.color);
      ctx.restore();
    }

    drawTransition(ctx);

    /* vignette + scanlines: sold separately, included free */
    ctx.save();
    ctx.globalAlpha = 0.07;
    for (let y = 0; y < H; y += 3) ART.rect(ctx, 0, y, W, 1, "#000000");
    ctx.restore();
  }

  function update(dt) {
    updateParticles(dt);
    updateEmotes(dt);
    updateTransition(dt);
    updateActors(dt);
    HOSTS.update(dt);
    if (flash.a > 0) flash.a = Math.max(0, flash.a - dt * 2.4);
  }

  return {
    W: W, H: H, GROUND: GROUND,
    render: render,
    update: update,
    burstHearts: burstHearts,
    burstSparks: burstSparks,
    burstThorns: burstThorns,
    confetti: confetti,
    showEmote: showEmote,
    react: react,
    enter: enter,
    clearParticles: clearParticles,
    beginTransition: beginTransition,
    inTransition: inTransition,
    flash: setFlash,
    STAGE: STAGE,
    UNIT_MARKS: UNIT_MARKS
  };
})();
