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
    }
  }

  function drawParticles(ctx) {
    for (const p of particles) {
      const fade = 1 - p.age / p.life;
      if (fade < 0.35 && Math.floor(p.age * 22) % 2) continue; /* flicker out */
      if (p.kind === "heart") ART.heart(ctx, p.x, p.y, p.s, p.color);
      else ART.rect(ctx, p.x, p.y, p.s, p.s, p.color);
    }
  }

  function clearParticles() { particles = []; }

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

  function drawEvent(ctx, t) {
    sky(ctx, [[0, "#7ec8e8"], [44, "#a3dcee"], [86, "#cdeef5"]]);
    cloud(ctx, wrap(t * 5, W + 120) - 60, 16, 2, "#ffffff");
    cloud(ctx, wrap(t * 3.2 + 180, W + 120) - 60, 38, 1, "#f2fbff");
    cloud(ctx, wrap(t * 4.1 + 90, W + 120) - 60, 26, 1, "#ffffff");

    /* rolling hills */
    for (let x = 0; x < W; x++) {
      const h = 104 + Math.sin(x * 0.03) * 6 + Math.sin(x * 0.011) * 4;
      ART.rect(ctx, x, h, 1, GROUND - h, "#6aa85f");
    }
    band(ctx, GROUND, H, "#5b9a52");
    dither(ctx, GROUND, "#6aa85f", 2);
    /* trodden event path */
    ART.rect(ctx, 0, 158, W, 22, "#b79a68");
    dither(ctx, 158, "#5b9a52", 2);

    ART.sprite(ctx, "tent", 12, 92, { scale: 2 });
    ART.sprite(ctx, "pine", 246, 82, { scale: 2 });
    ART.sprite(ctx, "bush", 214, 128, { scale: 1 });
    ART.sprite(ctx, "bush", 118, 132, { scale: 1 });

    /* bunting, swinging gently */
    for (let i = 0; i < 14; i++) {
      const x = 80 + i * 14;
      const y = 60 + Math.sin(i * 0.8) * 4 + Math.sin(t * 1.6 + i * 0.5) * 1;
      ART.rect(ctx, x, y, 12, 1, "#4a2c46");
      ART.heart(ctx, x + 3, y + 2, 1, i % 2 ? "#ff8ab5" : "#ffd15c");
    }
  }

  function drawForest(ctx, t, weather) {
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

    const sway = Math.sin(t * 1.1) * 1;
    ART.sprite(ctx, "oak", 8 + sway, 66, { scale: 2 });
    ART.sprite(ctx, "pine", 268 - sway, 74, { scale: 2 });
    ART.sprite(ctx, "pine", 234, 96, { scale: 1 });
    ART.sprite(ctx, "bush", 96, 140, { scale: 1 });
    ART.sprite(ctx, "bush", 190, 144, { scale: 1 });

    /* shafts of light through the canopy */
    ctx.save();
    ctx.globalAlpha = 0.09 + Math.sin(t * 0.7) * 0.02;
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = "#ffffff";
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
    }
  }

  function drawCity(ctx, t) {
    sky(ctx, [[0, "#2b2140"], [40, "#4a2f52"], [78, "#7a4361"]]);
    stars(ctx, t);

    /* skyline, two parallax layers */
    for (let x = -20; x < W + 20; x += 34) {
      const h = 58 + ((x * 13) % 26);
      ART.rect(ctx, x, h, 30, GROUND - h, "#3a2b4d");
      for (let wy = h + 6; wy < GROUND - 6; wy += 9) {
        for (let wx = x + 4; wx < x + 26; wx += 8) {
          const lit = ((wx * 7 + wy * 13) % 11) > 5;
          const flick = ((wx + wy) % 17 === 0) && Math.sin(t * 4) > 0;
          ART.rect(ctx, wx, wy, 3, 4, lit || flick ? "#ffd98f" : "#2c2039");
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

    /* pavement */
    band(ctx, GROUND, H, "#4f4a58");
    dither(ctx, GROUND, "#4b3960", 2);
    ART.rect(ctx, 0, 158, W, 22, "#3f3a49");
    for (let x = 4; x < W; x += 16) ART.rect(ctx, x, 158, 10, 1, "#59535f");

    ART.sprite(ctx, "lamppost", 44, 88, { scale: 1 });
    ART.sprite(ctx, "lamppost", 262, 88, { scale: 1 });
    ART.sprite(ctx, "signpost", 148, 96, { scale: 1 });

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
  }

  function drawRuins(ctx, t) {
    sky(ctx, [[0, "#43305f"], [34, "#7e4a6a"], [66, "#c4707a"], [96, "#e9a173"]]);
    /* the sun, sinking */
    sun(ctx, 238, 100 + Math.round(Math.sin(t * 0.2)), 20, "#ffd88a", "#c4707a", 2);

    /* hills */
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
  }

  function drawFinale(ctx, t) {
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

    /* drifting hearts, always */
    for (let i = 0; i < 10; i++) {
      const seed = i * 41.3;
      const x = wrap(seed * 7.7 + Math.sin(t * 0.8 + i) * 12, W);
      const y = wrap(seed * 5.3 - t * 11, H - 40) + 8;
      ART.heart(ctx, x, y, i % 3 === 0 ? 2 : 1, i % 2 ? "#ffc2d6" : "#ff8ab5");
    }
  }

  function drawTitle(ctx, t) {
    sky(ctx, [[0, "#33174a"], [30, "#6d2a63"], [62, "#b23f70"], [92, "#e86a86"]]);
    stars(ctx, t);
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
      const x0 = W / 2 + i * 6;
      const x1 = W / 2 + i * 40;
      ctx.strokeStyle = "#7a3a6b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, 130);
      ctx.lineTo(x1, H);
      ctx.stroke();
    }

    for (let i = 0; i < 8; i++) {
      const seed = i * 61.7;
      const x = wrap(seed * 9.1 + Math.sin(t + i) * 9, W);
      const y = wrap(seed * 3.7 - t * 8, 120) + 6;
      ART.heart(ctx, x, y, i % 3 === 0 ? 2 : 1, "#ff8ab5");
    }
  }

  const BACKDROPS = {
    title: drawTitle,
    event: drawEvent,
    forest: drawForest,
    city: drawCity,
    ruins: drawRuins,
    finale: drawFinale
  };

  /* ------------------------------------------------------------------
   * Actors: who stands where, in which scene.
   * ------------------------------------------------------------------ */
  /* [x, footY, scale] — footY is where the boots meet the ground. */
  const STAGE = {
    event:  { you: [42, 152, 3], extras: [["petra", 196, 152, 3], ["nando", 258, 152, 2]] },
    forest: { you: [42, 152, 3], date: ["petra", 208, 152, 3] },
    city:   { you: [42, 152, 3], date: ["nando", 224, 152, 2] },
    ruins:  { you: [42, 152, 3], date: ["mysti", 208, 152, 3] },
    finale: {
      you: [24, 152, 3],
      extras: [["petra", 104, 152, 3], ["nando", 172, 152, 2], ["mysti", 224, 152, 3]]
    }
  };

  /** Feet-anchored draw so a scale-2 Nando still stands on the ground. */
  function actor(ctx, name, x, footY, scale, t, opts) {
    const o = opts || {};
    const def = ART.sprites[name];
    if (!def) return;
    const bob = Math.round(Math.sin(t * 1.8 + (o.phase || 0)) * 1);
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

  function bots(ctx, t, speaking) {
    const hoverA = Math.round(Math.sin(t * 2.4) * 2);
    const hoverB = Math.round(Math.sin(t * 2.4 + 1.6) * 2);
    ART.sprite(ctx, "t4tc", 128, 18 + hoverA, {
      scale: 2, talk: speaking === "bots" && Math.floor(t * 8) % 2 === 0
    });
    ART.sprite(ctx, "dnf", 166, 22 + hoverB, {
      scale: 2, talk: speaking === "bots" && Math.floor(t * 8) % 3 === 0
    });
  }

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

    (BACKDROPS[scene] || drawEvent)(ctx, t, o.weather);

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
      bots(ctx, t, o.speaker);
    }

    drawParticles(ctx);
    ctx.restore();

    /* vignette + scanlines: sold separately, included free */
    ctx.save();
    ctx.globalAlpha = 0.07;
    for (let y = 0; y < H; y += 3) ART.rect(ctx, 0, y, W, 1, "#000000");
    ctx.restore();
  }

  return {
    W: W, H: H, GROUND: GROUND,
    render: render,
    update: updateParticles,
    burstHearts: burstHearts,
    burstSparks: burstSparks,
    burstThorns: burstThorns,
    clearParticles: clearParticles,
    STAGE: STAGE
  };
})();
