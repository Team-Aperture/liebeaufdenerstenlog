/* =====================================================================
 * logo.js — the Kalibrierungsanlage title plate, drawn in pixels.
 *
 * A pixel-art reconstruction of the facility's badge: the chrome-and-
 * neon medallion on the left with the faceted crystal heart in it, and
 * the bevelled name plate on the right — motto strip, the hero word
 * under its pink halo, the cache's own name on a neon banner, and the
 * certification strip with the sector tab. Nothing here is an image
 * file; every pixel is placed by the code below.
 *
 * The badge is expensive to draw (the hero word alone is a dozen
 * stamped passes), so the static parts are baked into offscreen
 * canvases once per language and blitted. Only what actually moves —
 * the heartbeat trace, the strip lamps, the assembly glint — is drawn
 * per frame.
 *
 * It also owns the cold-start sequence the game opens with, because
 * the boot lines and the plate are one continuous animation.
 * ===================================================================== */
"use strict";

window.LOGO = (function () {

  /* Sampled off the facility's own badge: chrome with a warm pink cast,
   * and a magenta neon that runs from near-white to oxblood. */
  const C = {
    chromeHot:  "#fdfafc",
    chromeLite: "#ded1d7",
    chromeMid:  "#a4959d",
    chromeDark: "#5d5158",
    chromeDeep: "#332a30",
    edge:       "#140f14",
    field:      "#191218",
    fieldLite:  "#2b2028",
    fieldDeep:  "#0e090d",
    pinkHot:    "#ffd0f0",
    pinkLite:   "#ff8ed2",
    pink:       "#ff3fa8",
    pinkDeep:   "#c81f79",
    pinkDark:   "#7a0f47",
    pinkInk:    "#3c0018",
    ink:        "#150d13"
  };

  /* Facets of the crystal heart, lit from the upper left. */
  const GEM = ["#fff0fa", "#ffbfe8", "#ff7cc8", "#f43fa4", "#cc2079", "#911154"];

  const HEART = [
    "..ooo.....ooo..",
    ".ooooo...ooooo.",
    "ooooooo.ooooooo",
    "ooooooooooooooo",
    "ooooooooooooooo",
    "ooooooooooooooo",
    ".ooooooooooooo.",
    ".ooooooooooooo.",
    "..ooooooooooo..",
    "...ooooooooo...",
    "....ooooooo....",
    ".....ooooo.....",
    "......ooo......",
    ".......o......."
  ];

  /* One period of the heartbeat trace, as offsets from the baseline. */
  const ECG = [0, 0, 0, 0, 0, -1, -1, 0, 0, 1, 2, -2, -7, -4, 3, 4, 2, 0,
               0, 0, 1, 2, 1, 0, 0, 0, 0, 0];

  /* ------------------------------------------------------------------
   * Primitives
   * ------------------------------------------------------------------ */

  const px = (ctx, x, y, w, h, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)),
                 Math.max(1, Math.round(h)));
  };

  const pick = (col, i, n) => (typeof col === "function" ? col(i, n) : col);

  /**
   * The inset of a clipped corner on row `i` of an `h`-tall panel with
   * an `n`-pixel chamfer. Rows are drawn short rather than drawn full
   * and then cleared — clearRect would punch a hole through whatever
   * the badge is sitting on.
   */
  function chamfer(i, h, n) {
    if (i < n) return n - i;
    if (i >= h - n) return n - (h - 1 - i);
    return 0;
  }

  /** A filled octagon: the badge's basic shape at every scale. */
  function poly(ctx, x, y, w, h, n, col) {
    for (let i = 0; i < h; i++) {
      const c = chamfer(i, h, Math.max(0, n));
      const rw = w - c * 2;
      if (rw > 0) px(ctx, x + c, y + i, rw, 1, pick(col, i, h));
    }
  }

  /** A filled disc. */
  function disc(ctx, cx, cy, r, col) {
    for (let dy = -r; dy <= r; dy++) {
      const dx = Math.floor(Math.sqrt(r * r - dy * dy));
      px(ctx, cx - dx, cy + dy, dx * 2 + 1, 1, pick(col, dy + r, r * 2 + 1));
    }
  }

  /** The band between radius r0 and r1, drawn as two spans per row. */
  function annulus(ctx, cx, cy, r0, r1, col) {
    for (let dy = -r1; dy <= r1; dy++) {
      const o = Math.floor(Math.sqrt(Math.max(0, r1 * r1 - dy * dy)));
      const s = r0 * r0 - dy * dy;
      const i = s > 0 ? Math.floor(Math.sqrt(s)) : -1;
      const c = pick(col, dy + r1, r1 * 2 + 1);
      if (i < 0) { px(ctx, cx - o, cy + dy, o * 2 + 1, 1, c); continue; }
      const w = o - i;
      if (w <= 0) continue;
      px(ctx, cx - o, cy + dy, w, 1, c);
      px(ctx, cx + i + 1, cy + dy, w, 1, c);
    }
  }

  /** The outline of a flattened ellipse — the little radar dish. */
  function ellipse(ctx, cx, cy, rx, ry, col) {
    for (let a = 0; a < 360; a += 3) {
      const rad = a * Math.PI / 180;
      px(ctx, cx + Math.cos(rad) * rx, cy + Math.sin(rad) * ry, 1, 1, col);
    }
  }

  /** Brushed metal: bright along the top, shaded along the bottom. */
  function metal(i, n) {
    const k = i / n;
    return k < 0.14 ? C.chromeHot
         : k < 0.34 ? C.chromeLite
         : k < 0.62 ? C.chromeMid
         : k < 0.86 ? C.chromeDark : C.chromeDeep;
  }

  /**
   * Display lettering with a machined bevel: an ink drop shadow, a mid
   * body, a lit top band and a shaded foot. `glow` wraps the whole word
   * in the badge's pink halo first.
   */
  function bevel(ctx, str, x, y, sx, sy, adv, glow) {
    const h = sy * 5;
    if (glow) {
      ctx.save();
      ctx.globalAlpha = 0.34;
      ART.stamp(ctx, str, x - 2, y, sx, sy, adv, C.pink);
      ART.stamp(ctx, str, x + 2, y, sx, sy, adv, C.pink);
      ART.stamp(ctx, str, x, y - 2, sx, sy, adv, C.pink);
      ART.stamp(ctx, str, x, y + 2, sx, sy, adv, C.pink);
      ctx.globalAlpha = 0.7;
      ART.stamp(ctx, str, x - 1, y + 1, sx, sy, adv, C.pinkDeep);
      ART.stamp(ctx, str, x + 1, y + 1, sx, sy, adv, C.pinkDeep);
      ctx.restore();
    }
    ART.stamp(ctx, str, x + sx, y + sy, sx, sy, adv, C.edge);
    ART.stamp(ctx, str, x, y, sx, sy, adv, C.chromeMid);
    const band = (top, height, col) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x - 4, y + top, 4000, height);
      ctx.clip();
      ART.stamp(ctx, str, x, y, sx, sy, adv, col);
      ctx.restore();
    };
    band(0, sy * 2, C.chromeHot);
    band(sy * 2, sy, C.chromeLite);
    band(sy * 4, sy, C.chromeDark);
    band(h - Math.max(1, sy - 2), Math.max(1, sy - 2), C.chromeLite);
  }

  /** A recessed strip: dark channel, chrome frame, lit top lip. */
  function channel(ctx, x, y, w, h, n) {
    poly(ctx, x, y, w, h, n, C.edge);
    poly(ctx, x + 1, y + 1, w - 2, h - 2, n - 1,
         (i, k) => (i < k * 0.4 ? C.chromeLite : C.chromeDark));
    poly(ctx, x + 2, y + 2, w - 4, h - 4, n - 2,
         (i, k) => (i < k * 0.35 ? C.fieldLite : C.fieldDeep));
  }

  /** Polished silver: bright enough to carry dark lettering. */
  function silver(i, n) {
    const k = i / n;
    return k < 0.18 ? C.chromeHot : k < 0.74 ? C.chromeLite : C.chromeMid;
  }

  /** A raised chrome strip — the certification band along the bottom. */
  function bar(ctx, x, y, w, h, n) {
    poly(ctx, x, y, w, h, n, C.edge);
    poly(ctx, x + 1, y + 1, w - 2, h - 2, n - 1, silver);
  }

  /** A rectangular pink indicator slot. */
  function slot(ctx, x, y, w, h, on) {
    px(ctx, x, y, w, h, C.edge);
    px(ctx, x + 1, y + 1, w - 2, h - 2, on ? C.pink : C.pinkDark);
    if (on) px(ctx, x + 1, y + 1, w - 2, 1, C.pinkHot);
  }

  /* ------------------------------------------------------------------
   * The medallion
   * ------------------------------------------------------------------ */

  /** The bracket that pokes out from behind the medallion. */
  function edgeBracket(ctx, x, y, w, h) {
    poly(ctx, x, y, w, h, 4, C.edge);
    poly(ctx, x + 1, y + 1, w - 2, h - 2, 3, metal);
    for (let i = 0; i < 3; i++) slot(ctx, x + 3, y + 5 + i * 6, w - 6, 4, true);
  }

  /* Twelve facets cut radially out of the notch. The wedge only nudges
   * the shade by one step — the overall gradient comes from the light,
   * which sits off the stone's upper left. */
  const CUT = [0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1];

  /** One facet of the crystal, shaded by where it faces the light. */
  function facet(u, v) {
    const ang = Math.atan2(v + 0.42, u);
    const wedge = ((Math.floor((ang + Math.PI) / (Math.PI / 6)) % 12) + 12) % 12;
    const lit = (u * 0.38 + v * 0.86 + 1) / 2;   /* 0 lit, 1 in shadow */
    const k = Math.round(lit * 2.9) + CUT[wedge];
    return GEM[Math.max(0, Math.min(4, k))];
  }

  /** The light the stone throws onto the instrument field behind it. */
  function bloom(ctx, cx, cy) {
    const w = HEART[0].length, h = HEART.length, s = 2;
    const x0 = cx - Math.round(w * s / 2);
    const y0 = cy - Math.round(h * s / 2);
    ctx.save();
    ctx.globalAlpha = 0.17;
    [[-2, 0], [2, 0], [0, -2], [0, 2]].forEach((o) => {
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          if (HEART[r][c] === "o") {
            px(ctx, x0 + c * s + o[0], y0 + r * s + o[1], s, s, C.pink);
          }
        }
      }
    });
    ctx.restore();
  }

  /** The faceted crystal heart, drawn at 2x from the mask above. */
  function crystal(ctx, cx, cy) {
    const w = HEART[0].length, h = HEART.length, s = 2;
    const x0 = cx - Math.round(w * s / 2);
    const y0 = cy - Math.round(h * s / 2);
    const solid = (c, r) => (r >= 0 && r < h && c >= 0 && c < w &&
                             HEART[r][c] === "o");

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (!solid(c, r)) continue;
        const u = (c - (w - 1) / 2) / (w / 2);
        const v = (r - (h - 1) / 2) / (h / 2);
        let col = facet(u, v);
        /* the crease down the middle, where the two lobes meet */
        if (c === 7 && r >= 1 && r <= 5) col = GEM[4];
        /* the rim: any cell with a hole beside it */
        if (!solid(c - 1, r) || !solid(c + 1, r) ||
            !solid(c, r - 1) || !solid(c, r + 1)) col = GEM[4];
        px(ctx, x0 + c * s, y0 + r * s, s, s, col);
      }
    }
    /* speculars */
    px(ctx, x0 + 3 * s, y0 + 2 * s, s * 2, s, "#ffffff");
    px(ctx, x0 + 2 * s, y0 + 3 * s, s, s, "#ffffff");
    px(ctx, x0 + 10 * s, y0 + 2 * s, s, s, GEM[0]);
  }

  /** A chrome tab clamped over the outer ring, with a heart set in it. */
  function bracket(ctx, cx, cy, w, h) {
    px(ctx, cx - w / 2 - 1, cy - h / 2 - 1, w + 2, h + 2, C.edge);
    for (let i = 0; i < h; i++) {
      px(ctx, cx - w / 2, cy - h / 2 + i, w, 1, metal(i, h));
    }
    ART.heart(ctx, cx - 2, cy - 2, 1, C.pink);
    px(ctx, cx - 1, cy - 2, 1, 1, C.pinkHot);
  }

  /**
   * Everything in the medallion that sits behind the heart: the chrome
   * housing, the two neon rings, the dark instrument field and the
   * little radar dish underneath.
   */
  function medallionBack(ctx, cx, cy, r) {
    /* the bracket that pokes out from behind the housing */
    edgeBracket(ctx, cx - r - 9, cy - 13, 14, 26);

    /* soft pink bloom on whatever the badge sits on */
    ctx.save();
    ctx.globalAlpha = 0.16;
    disc(ctx, cx, cy, r + 3, C.pinkDeep);
    ctx.restore();

    annulus(ctx, cx, cy, r - 4, r, metal);           /* chrome housing   */
    annulus(ctx, cx, cy, r - 5, r - 5, C.edge);
    annulus(ctx, cx, cy, r - 8, r - 6, C.pink);      /* outer neon       */
    annulus(ctx, cx, cy, r - 7, r - 7, C.pinkHot);
    annulus(ctx, cx, cy, r - 10, r - 9, C.fieldDeep);
    annulus(ctx, cx, cy, r - 13, r - 11, metal);     /* inner chrome ring*/
    annulus(ctx, cx, cy, r - 14, r - 14, C.edge);
    annulus(ctx, cx, cy, r - 16, r - 15, C.pinkDeep);/* inner neon       */
    annulus(ctx, cx, cy, r - 15, r - 15, C.pinkLite);

    /* the instrument field, with a fine radial hatch */
    disc(ctx, cx, cy, r - 17, (i, n) => (i < n * 0.4 ? "#1a0f18" : "#0d070c"));
    const fr = r - 17;
    for (let a = 0; a < 360; a += 15) {
      const rad = a * Math.PI / 180;
      for (let d = fr - 4; d < fr; d++) {
        px(ctx, cx + Math.cos(rad) * d, cy + Math.sin(rad) * d, 1, 1, "#3a1c2e");
      }
    }
    for (let a = 0; a < 360; a += 90) {
      const rad = (a + 45) * Math.PI / 180;
      for (let d = 4; d < fr - 5; d += 2) {
        px(ctx, cx + Math.cos(rad) * d, cy + Math.sin(rad) * d, 1, 1, "#1d0e18");
      }
    }

    bloom(ctx, cx, cy - 6);

    /* the radar dish under the heart */
    const ry = cy + 15;
    ellipse(ctx, cx, ry, 14, 5, C.pinkDeep);
    ellipse(ctx, cx, ry, 9, 3, C.pink);
    px(ctx, cx - 4, ry, 9, 1, C.pinkLite);
    ART.heart(ctx, cx - 2, ry - 3, 1, C.pinkHot);
  }

  /** The heart itself and the four clamps, drawn over the trace. */
  function medallionFront(ctx, cx, cy, r) {
    crystal(ctx, cx, cy - 6);
    bracket(ctx, cx, cy - r + 4, 11, 9);
    bracket(ctx, cx, cy + r - 4, 11, 9);
    bracket(ctx, cx - r + 4, cy, 9, 11);
    bracket(ctx, cx + r - 4, cy, 9, 11);
  }

  /** The heartbeat trace, scrolling behind the crystal. */
  function trace(ctx, cx, cy, r, t) {
    const fr = r - 17;
    const shift = Math.floor(t * 11) % ECG.length;
    for (let dx = -fr; dx <= fr; dx++) {
      const v = ECG[(((dx + shift) % ECG.length) + ECG.length) % ECG.length];
      const y = cy + v;
      const fade = 1 - Math.abs(dx) / (fr + 2);
      ctx.save();
      ctx.globalAlpha = 0.4 + 0.6 * fade;
      px(ctx, cx + dx, y, 1, 1, v < -2 ? "#ffffff" : C.pinkHot);
      px(ctx, cx + dx, y + 1, 1, 1, C.pink);
      ctx.restore();
    }
  }

  /* ------------------------------------------------------------------
   * The plate
   * ------------------------------------------------------------------ */

  const PW = 222;   /* plate width                                      */
  const PH = 74;    /* plate height                                     */
  const TI = 20;    /* text column inset from the plate's left edge     */
  const TW = 196;   /* text column width                                */
  const TAB = 26;   /* width of the certification tab in the corner     */

  /** The neon banner the cache's own name rides on. */
  function banner(ctx, x, y, w, h, name) {
    poly(ctx, x, y, w, h, 5, C.edge);
    poly(ctx, x + 1, y + 1, w - 2, h - 2, 4, (i, n) => {
      const k = i / n;
      return k < 0.12 ? C.pinkHot
           : k < 0.24 ? C.pink
           : k < 0.62 ? C.pinkDeep
           : k < 0.84 ? C.pinkDark : C.pinkInk;
    });
    poly(ctx, x + 3, y + 4, w - 6, h - 8, 2, (i, n) =>
      (i < n * 0.5 ? "#6d0d3f" : "#43072a"));

    /* heart-in-crosshair at each end */
    [x + 6, x + w - 7].forEach((hx) => {
      const hy = y + Math.round(h / 2);
      for (let a = 0; a < 360; a += 20) {
        const rad = a * Math.PI / 180;
        px(ctx, hx + Math.cos(rad) * 5, hy + Math.sin(rad) * 5, 1, 1, C.pinkLite);
      }
      ART.heart(ctx, hx - 2, hy - 2, 1, C.pinkHot);
    });

    let adv = 7;
    while (adv > 5 && ART.stampWidth(name, 2, adv) > w - 28) adv--;
    const tw = ART.stampWidth(name, 2, adv);
    const tx = x + Math.round((w - tw) / 2);
    const ty = y + Math.round((h - 10) / 2);
    ART.stamp(ctx, name, tx + 1, ty + 1, 2, 2, adv, C.pinkInk);
    ART.stamp(ctx, name, tx, ty, 2, 2, adv, C.chromeLite);
    ctx.save();
    ctx.beginPath(); ctx.rect(tx - 2, ty, 4000, 4); ctx.clip();
    ART.stamp(ctx, name, tx, ty, 2, 2, adv, C.chromeHot);
    ctx.restore();
  }

  /** The certification tab in the bottom-right corner. */
  function sectorTab(ctx, x, y, w, h, code) {
    poly(ctx, x, y, w, h, 2, C.edge);
    poly(ctx, x + 1, y + 1, w - 2, h - 2, 1, silver);
    ART.text(ctx, "SEKTOR", x + Math.round((w - ART.textWidth("SEKTOR", 1)) / 2),
             y + 2, 1, C.ink);
    px(ctx, x + 3, y + 7, w - 6, 1, C.pinkDeep);
    ART.text(ctx, code, x + Math.round((w - ART.textWidth(code, 1)) / 2),
             y + 8, 1, C.ink);
  }

  /**
   * Everything on the plate that never moves. Drawn into a baked layer
   * whose origin is the plate's top-left corner, eight rows down from
   * the top of the canvas so the handle has somewhere to sit.
   */
  function plateStatic(ctx, ox, oy, ui) {
    const tx = ox + TI, tw = TW;

    /* ---- carry handle and its feed line, on the roof ---- */
    const hx = ox + 81;
    px(ctx, hx - 1, oy - 7, 47, 9, C.edge);
    for (let i = 0; i < 7; i++) px(ctx, hx, oy - 6 + i, 45, 1, metal(i, 7));
    px(ctx, hx + 5, oy - 4, 35, 3, C.fieldDeep);
    px(ctx, hx + 5, oy - 4, 35, 1, C.chromeDeep);
    for (let i = 0; i < 5; i++) {
      const cxx = hx + 46 + i * 6;
      for (let a = 20; a <= 340; a += 12) {
        const rad = a * Math.PI / 180;
        px(ctx, cxx + Math.cos(rad) * 3, oy - 3 + Math.sin(rad) * 4, 2, 1,
           a < 180 ? C.chromeLite : C.chromeDark);
      }
    }

    /* ---- the plate itself ---- */
    poly(ctx, ox, oy, PW, PH, 7, C.edge);
    poly(ctx, ox + 1, oy + 1, PW - 2, PH - 2, 6, metal);
    poly(ctx, ox + 4, oy + 4, PW - 8, PH - 8, 5, (i, n) => {
      const k = i / n;
      return k < 0.04 ? C.chromeDeep
           : k < 0.5 ? C.field
           : k < 0.9 ? "#120c11" : C.fieldDeep;
    });

    /* ---- motto strip ---- */
    channel(ctx, tx, oy + 3, tw, 9, 3);
    const motto = ui.motto;
    const mw = ART.stampWidth(motto, 1, 5);
    const mx = tx + Math.round((tw - mw) / 2);
    ART.stamp(ctx, motto, mx, oy + 5, 1, 1, 5, C.chromeHot);
    px(ctx, tx + 16, oy + 7, mx - tx - 20, 1, C.chromeDark);
    px(ctx, mx + mw + 4, oy + 7, tw - (mx + mw + 4 - tx) - 16, 1, C.chromeDark);

    /* ---- pointer heart under the strip ---- */
    const cxm = tx + Math.round(tw / 2);
    px(ctx, cxm - 7, oy + 12, 15, 5, C.edge);
    px(ctx, cxm - 6, oy + 12, 13, 4, C.chromeDark);
    px(ctx, cxm - 6, oy + 12, 13, 1, C.chromeLite);
    ART.heart(ctx, cxm - 2, oy + 12, 1, C.pink);
    px(ctx, cxm - 1, oy + 12, 1, 1, C.pinkHot);

    /* ---- "DIE", and the hairline that runs off to the right ---- */
    const parts = String(ui.facility).split(" ");
    const lead = parts.length > 1 ? parts[0] : "";
    const hero = (parts.length > 1 ? parts.slice(1) : parts).join(" ");
    if (lead) bevel(ctx, lead, tx, oy + 12, 2, 2, 8, false);
    const lw = lead ? ART.stampWidth(lead, 2, 8) + 4 : 0;
    px(ctx, tx + lw, oy + 20, tw - lw, 1, C.pinkDeep);
    px(ctx, tx + lw, oy + 21, tw - lw, 1, C.pinkInk);

    /* ---- the hero word, tracked to fill the column exactly ---- */
    const adv = Math.max(7, Math.floor((tw + 1) / Math.max(1, hero.length)));
    const hw = ART.stampWidth(hero, 3, adv);
    bevel(ctx, hero, tx, oy + 23, 3, 4, adv, true);

    /* ---- the cache's own name on its neon banner ----
       ART.stamp uppercases and the 3x5 font has no umlauts, so keep any
       replacement name to plain A-Z, digits and basic punctuation. */
    banner(ctx, tx, oy + 46, tw, 13, ui.cacheName);

    /* ---- certification strip and sector tab ----
       The tab has to stay clear of the plate's bottom-right chamfer, so
       it stops a row short of the strip and sits slightly higher. */
    const stripW = tw - TAB - 9;
    bar(ctx, tx, oy + 61, stripW, 10, 3);
    const tag = ui.facilityTag;
    const tagW = ART.textWidth(tag, 1);
    ART.text(ctx, tag, tx + Math.round((stripW - tagW) / 2), oy + 63, 1, C.ink);
    if (stripW - tagW > 18) {
      px(ctx, tx + 3, oy + 65, 2, 2, C.pinkDeep);
      px(ctx, tx + stripW - 5, oy + 65, 2, 2, C.pinkDeep);
    }
    sectorTab(ctx, tx + tw - TAB - 6, oy + 59, TAB, 14, ui.sectorTab);
  }

  /* ------------------------------------------------------------------
   * Baking
   * ------------------------------------------------------------------ */

  const MW = 92, MH = 84;        /* medallion layer                     */
  const MR = 40;                 /* medallion radius                    */
  const MCX = 49, MCY = 42;      /* its centre inside that layer        */
  const PY = 8;                  /* plate top inside the plate layer    */

  let cache = null, cacheKey = "";

  function layer(w, h) {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const c = cv.getContext("2d");
    c.imageSmoothingEnabled = false;
    return { cv: cv, ctx: c };
  }

  function bake(ui) {
    const key = [ui.cacheName, ui.facility, ui.motto, ui.facilityTag,
                 ui.sectorTab].join("|");
    if (cache && cacheKey === key) return cache;

    const back = layer(MW, MH);
    medallionBack(back.ctx, MCX, MCY, MR);

    const front = layer(MW, MH);
    medallionFront(front.ctx, MCX, MCY, MR);

    const plate = layer(PW + 40, PH + PY + 4);
    plateStatic(plate.ctx, 0, PY, ui);

    cache = { back: back.cv, front: front.cv, plate: plate.cv };
    cacheKey = key;
    return cache;
  }

  /* ------------------------------------------------------------------
   * The badge
   * ------------------------------------------------------------------ */

  /**
   * `p` is the assembly progress, 0 to 1: the medallion swings in from
   * the left, the plate from the right, and one glint sweeps across as
   * they meet.
   */
  function draw(ctx, cx, cy, t, p, ui) {
    const prog = Math.max(0, Math.min(1, p == null ? 1 : p));
    const ease = 1 - Math.pow(1 - prog, 3);
    const L = bake(ui);

    /*   x0 ....................... badge ....................... x0+286
     *   |-bracket-|
     *      |------ medallion ------|
     *                  |------------- plate -------------|
     */
    const x0 = Math.round(cx) - 146;
    const py = Math.round(cy) - 33;          /* plate top               */
    const mx = x0;                           /* medallion layer origin  */
    const my = py + 35 - MCY;                /* its centre sits at py+35*/
    const px0 = x0 + 72;                     /* plate left edge         */
    const tx = px0 + TI;

    const slide = Math.round((1 - ease) * 76);

    ctx.save();
    ctx.globalAlpha = Math.min(1, prog * 2);

    /* ---- plate ---- */
    ctx.drawImage(L.plate, px0 + slide, py - PY);

    /* the two strip lamps are the only thing on the plate that moves */
    const blink = t % 2.4;
    slot(ctx, tx + 3 + slide, py + 5, 8, 5, blink < 1.5);
    slot(ctx, tx + TW - 11 + slide, py + 5, 8, 5, blink >= 1.5);

    /* ---- medallion: housing, then the trace, then the crystal ---- */
    ctx.drawImage(L.back, mx - slide, my);
    trace(ctx, mx - slide + MCX, my + MCY, MR, t);
    ctx.drawImage(L.front, mx - slide, my);

    /* ---- one glint sweeping across on assembly ---- */
    if (prog > 0.55 && prog < 1) {
      const k = (prog - 0.55) / 0.45;
      const sx = x0 - 40 + k * 366;
      ctx.save();
      ctx.globalAlpha = 0.45 * (1 - Math.abs(k - 0.5) * 2);
      for (let i = 0; i < 14; i++) {
        px(ctx, sx + i, py - 8 + i * 0.4, 2, PH + 14, "#ffffff");
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
    px(ctx, 0, 0, W, H, "#06040a");

    /* faint grid, waking up */
    for (let y = 0; y < H; y += 8) px(ctx, 0, y, W, 1, "#140a14");
    for (let x = 0; x < W; x += 8) px(ctx, x, 0, 1, H, "#140a14");

    const PER = 0.30;             /* seconds per line */
    const shown = Math.min(lines.length, Math.floor(elapsed / PER) + 1);
    const y0 = 42;

    for (let i = 0; i < shown; i++) {
      const age = elapsed - i * PER;
      const chars = Math.min(lines[i].length, Math.floor(age * 42));
      const text = lines[i].slice(0, chars);
      const last = i === lines.length - 1;
      const col = last ? C.pinkHot : (i % 2 ? "#8d5f7b" : "#c58bb0");
      ART.text(ctx, text, 40, y0 + i * 14, 1, col);
      if (chars < lines[i].length && Math.floor(age * 6) % 2 === 0) {
        px(ctx, 40 + chars * 4, y0 + i * 14, 3, 5, col);
      }
      /* a lamp lights once a line has fully typed */
      if (chars >= lines[i].length) {
        px(ctx, 26, y0 + i * 14 + 1, 3, 3, last ? C.pinkHot : C.pink);
      }
    }

    /* scanline sweep */
    const sy = (elapsed * 90) % (H + 40) - 20;
    ctx.save();
    ctx.globalAlpha = 0.13;
    px(ctx, 0, sy, W, 10, C.pinkLite);
    ctx.restore();
    for (let y = 0; y < H; y += 3) {
      ctx.save(); ctx.globalAlpha = 0.16;
      px(ctx, 0, y, W, 1, "#000000");
      ctx.restore();
    }

    return elapsed > lines.length * PER + 0.5;
  }

  return { draw: draw, boot: boot, colors: C };
})();
