/* =====================================================================
 * logo.js — the Kalibrierungsanlage title plate, drawn in pixels.
 *
 * A pixel-art take on the facility's brushed-chrome badge: the red /
 * green calibration gauge on the left, the bevelled name plate on the
 * right, the motto strip along the top and the certification tab in
 * the corner. Nothing here is an image file.
 *
 * It also owns the cold-start sequence the game opens with, because
 * the boot lines and the plate are one continuous animation.
 * ===================================================================== */
"use strict";

window.LOGO = (function () {

  const C = {
    plateDark:  "#3a4048",
    plateMid:   "#6e7681",
    plateLite:  "#b9c2cc",
    plateHot:   "#eef3f8",
    edge:       "#14181d",
    red:        "#c0322c",
    redHot:     "#ff6f61",
    green:      "#2ecf62",
    greenHot:   "#7dfab4",
    ink:        "#0d1014",
    dim:        "#8b949e"
  };

  const px = (ctx, x, y, w, h, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)),
                 Math.max(1, Math.round(h)));
  };

  /**
   * Text with a machined bevel: dark drop, mid body, a lit top edge and
   * a shaded bottom edge. Three clipped passes over the same glyphs.
   */
  function chrome(ctx, str, x, y, s, hot) {
    ART.text(ctx, str, x + s, y + s, s, C.edge);
    ART.text(ctx, str, x, y, s, C.plateMid);
    ctx.save();
    ctx.beginPath(); ctx.rect(x - s, y - s, 4000, 2 * s + 1); ctx.clip();
    ART.text(ctx, str, x, y, s, hot || C.plateHot);
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.rect(x - s, y + 4 * s, 4000, 2 * s); ctx.clip();
    ART.text(ctx, str, x, y, s, C.plateDark);
    ctx.restore();
  }

  /** A brushed-metal panel with clipped corners and a bevelled rim. */
  function plate(ctx, x, y, w, h, notch) {
    const n = notch == null ? 4 : notch;
    px(ctx, x, y, w, h, C.edge);
    px(ctx, x + 1, y + 1, w - 2, h - 2, C.plateMid);
    /* brushed banding */
    for (let i = 2; i < h - 2; i++) {
      const k = i / h;
      const c = k < 0.28 ? C.plateLite : (k < 0.42 ? C.plateHot : (k > 0.74 ? C.plateDark : C.plateMid));
      px(ctx, x + 1, y + i, w - 2, 1, c);
    }
    /* clipped corners */
    for (let i = 0; i < n; i++) {
      const len = n - i;
      px(ctx, x, y + i, len, 1, "rgba(0,0,0,0)");
      ctx.clearRect(x, y + i, len, 1);
      ctx.clearRect(x + w - len, y + i, len, 1);
      ctx.clearRect(x, y + h - 1 - i, len, 1);
      ctx.clearRect(x + w - len, y + h - 1 - i, len, 1);
    }
    /* re-draw the diagonal edge */
    for (let i = 0; i < n; i++) {
      px(ctx, x + n - i - 1, y + i, 1, 1, C.edge);
      px(ctx, x + w - n + i, y + i, 1, 1, C.edge);
      px(ctx, x + n - i - 1, y + h - 1 - i, 1, 1, C.edge);
      px(ctx, x + w - n + i, y + h - 1 - i, 1, 1, C.edge);
    }
  }

  /** The calibration gauge: half red, half green, with a caliper needle. */
  function gauge(ctx, cx, cy, r, t) {
    /* housing */
    for (let dy = -r; dy <= r; dy++) {
      const dx = Math.floor(Math.sqrt(r * r - dy * dy));
      const k = (dy + r) / (2 * r);
      px(ctx, cx - dx, cy + dy, dx * 2 + 1, 1,
         k < 0.3 ? C.plateLite : (k > 0.72 ? C.plateDark : C.plateMid));
    }
    /* rim */
    for (let a = 0; a < 360; a += 2) {
      const rad = a * Math.PI / 180;
      px(ctx, cx + Math.cos(rad) * r, cy + Math.sin(rad) * r, 1, 1, C.edge);
    }
    /* dark dial face */
    for (let dy = -r + 4; dy <= r - 4; dy++) {
      const dx = Math.floor(Math.sqrt((r - 4) * (r - 4) - dy * dy));
      px(ctx, cx - dx, cy + dy, dx * 2 + 1, 1, dy < -2 ? "#1b2630" : "#141c24");
    }
    /* two calibration arcs — red on the left, green on the right */
    const sweep = Math.min(1, t * 1.4);
    for (let a = 0; a < 150 * sweep; a += 2) {
      const rr = (a + 105) * Math.PI / 180;
      const gr = (-a - 75) * Math.PI / 180;
      for (let w = 0; w < 5; w++) {
        px(ctx, cx + Math.cos(rr) * (r - 6 - w), cy + Math.sin(rr) * (r - 6 - w), 1, 1,
           a < 20 ? C.redHot : C.red);
        px(ctx, cx + Math.cos(gr) * (r - 6 - w), cy + Math.sin(gr) * (r - 6 - w), 1, 1,
           a < 20 ? C.greenHot : C.green);
      }
    }
    /* dial ticks */
    for (let a = -160; a <= -20; a += 20) {
      const rr = a * Math.PI / 180;
      for (let w = 0; w < 3; w++) {
        px(ctx, cx + Math.cos(rr) * (r - 13 - w), cy + Math.sin(rr) * (r - 13 - w), 1, 1, C.plateLite);
      }
    }
    /* the needle sweeps in and settles just off centre, forever */
    const ang = -Math.PI / 2 + Math.sin(t * 0.9) * 0.16 + (1 - sweep) * 1.2;
    for (let i = 0; i < r - 6; i++) {
      const w = i > r - 12 ? 1 : 2;
      px(ctx, cx + Math.cos(ang) * i - (w >> 1), cy + Math.sin(ang) * i, w, 1, C.plateHot);
    }
    px(ctx, cx - 2, cy - 2, 5, 5, C.plateLite);
    px(ctx, cx - 1, cy - 1, 3, 3, C.edge);
  }

  /** A small indicator lamp. */
  function lamp(ctx, x, y, on, color) {
    px(ctx, x, y, 7, 5, C.edge);
    px(ctx, x + 1, y + 1, 5, 3, on ? color : "#2a3038");
  }

  /**
   * The whole badge. `p` is the assembly progress, 0 → 1: the two
   * halves slide in from the edges and the glint sweeps across once.
   */
  function draw(ctx, cx, cy, t, p, ui) {
    const prog = Math.max(0, Math.min(1, p == null ? 1 : p));
    const ease = 1 - Math.pow(1 - prog, 3);
    const W = 300, H = 96;
    const x0 = Math.round(cx - W / 2);
    const y0 = Math.round(cy - H / 2);

    ctx.save();
    ctx.globalAlpha = Math.min(1, prog * 2);

    /* ---- gauge, sliding in from the left ---- */
    const gx = Math.round(x0 + 30 - (1 - ease) * 70);
    gauge(ctx, gx, y0 + 48, 30, t);

    /* ---- main plate, sliding in from the right ---- */
    const bx = Math.round(x0 + 62 + (1 - ease) * 80);

    /* motto strip */
    plate(ctx, bx, y0 + 6, 236, 15, 3);
    lamp(ctx, bx + 5, y0 + 11, t % 2 < 1.4, C.redHot);
    lamp(ctx, bx + 224, y0 + 11, t % 2 >= 1.4, C.greenHot);
    ART.text(ctx, ui.motto, bx + 34, y0 + 11, 1, C.ink);

    /* the name */
    chrome(ctx, ui.facility, bx + 6, y0 + 27, 2);

    /* the sector plate */
    plate(ctx, bx, y0 + 50, 236, 20, 3);
    ART.text(ctx, "LIEBE AUF DEN ERSTEN LOG", bx + 22, y0 + 57, 1, C.ink);
    px(ctx, bx + 14, y0 + 56, 3, 7, C.red);
    px(ctx, bx + 219, y0 + 56, 3, 7, C.green);

    /* footer bar and certification tab */
    px(ctx, bx, y0 + 72, 236, 13, C.edge);
    px(ctx, bx + 1, y0 + 73, 234, 11, "#141a20");
    px(ctx, bx + 1, y0 + 73, 234, 1, "#232c35");
    ART.text(ctx, ui.sector, bx + 6, y0 + 76, 1, "#8fb0c4");
    plate(ctx, bx + 198, y0 + 70, 38, 17, 2);
    ART.text(ctx, "ZERT", bx + 202, y0 + 72, 1, C.ink);
    ART.text(ctx, "7C", bx + 210, y0 + 79, 1, C.red);

    /* ---- one glint sweeping across on assembly ---- */
    if (prog > 0.55 && prog < 1) {
      const k = (prog - 0.55) / 0.45;
      const sx = x0 - 40 + k * (W + 80);
      ctx.save();
      ctx.globalAlpha = 0.5 * (1 - Math.abs(k - 0.5) * 2);
      for (let i = 0; i < 18; i++) {
        px(ctx, sx + i, y0 - 4 + i * 0.4, 2, H + 8, "#ffffff");
      }
      ctx.restore();
    }
    ctx.restore();
  }

  /**
   * The cold start. Lines type on one after another over a dark field
   * of drifting facility noise; returns true once it is finished.
   */
  function boot(ctx, lines, elapsed) {
    const W = ART.VIEW_W, H = ART.VIEW_H;
    px(ctx, 0, 0, W, H, "#05080b");

    /* faint grid, waking up */
    for (let y = 0; y < H; y += 8) px(ctx, 0, y, W, 1, "#0a1016");
    for (let x = 0; x < W; x += 8) px(ctx, x, 0, 1, H, "#0a1016");

    const PER = 0.55;             /* seconds per line */
    const shown = Math.min(lines.length, Math.floor(elapsed / PER) + 1);
    const y0 = 42;

    for (let i = 0; i < shown; i++) {
      const age = elapsed - i * PER;
      const chars = Math.min(lines[i].length, Math.floor(age * 42));
      const text = lines[i].slice(0, chars);
      const last = i === lines.length - 1;
      const col = last ? C.greenHot : (i % 2 ? "#4e6b7d" : "#7fa8bd");
      ART.text(ctx, text, 40, y0 + i * 14, 1, col);
      if (chars < lines[i].length && Math.floor(age * 6) % 2 === 0) {
        px(ctx, 40 + chars * 4, y0 + i * 14, 3, 5, col);
      }
      /* a checkmark lamp once a line has fully typed */
      if (chars >= lines[i].length) {
        px(ctx, 26, y0 + i * 14 + 1, 3, 3, last ? C.greenHot : C.green);
      }
    }

    /* scanline sweep */
    const sy = (elapsed * 90) % (H + 40) - 20;
    ctx.save();
    ctx.globalAlpha = 0.13;
    px(ctx, 0, sy, W, 10, "#69d6ff");
    ctx.restore();
    for (let y = 0; y < H; y += 3) {
      ctx.save(); ctx.globalAlpha = 0.16;
      px(ctx, 0, y, W, 1, "#000000");
      ctx.restore();
    }

    return elapsed > lines.length * PER + 0.5;
  }

  return { draw: draw, boot: boot, colors: C, chrome: chrome, plate: plate };
})();
