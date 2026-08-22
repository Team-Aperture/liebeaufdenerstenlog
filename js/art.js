/* =====================================================================
 * art.js — hand-authored pixel sprites and the drawing primitives.
 *
 * Everything renders onto a 320x180 backbuffer which is then scaled up
 * with smoothing disabled, so what you see are honest, chunky pixels
 * rather than smooth vectors pretending to be pixels.
 *
 * Sprite grids are plain strings. Characters map to palette entries;
 * "." and any character missing from the palette are transparent, so
 * rows do not have to be padded to full width.
 * ===================================================================== */
"use strict";

window.ART = (function () {
  const VIEW_W = 320;
  const VIEW_H = 180;

  /* ------------------------------------------------------------------
   * Shared ink. Outlines are never pure black — a very dark plum reads
   * warmer and keeps the whole thing feeling like a love story.
   * ------------------------------------------------------------------ */
  const INK = "#2b1630";

  /* ------------------------------------------------------------------
   * The cast. 16x24, drawn at scale 3 (Nando at 2 — he is a nano).
   * ------------------------------------------------------------------ */
  const BODY_ROWS_STANDARD = [
    "................",
    ".....oooooo.....",
    "....oHHHHHHo....",
    "...oHHHHHHHHo...",
    "..oooooooooooo..",
    "...oSSSSSSSSo...",
    "...oSESSSSESo...",
    "...oSSSSSSSSo...",
    "...oSSMMMMSSo...",
    "....oSSSSSSo....",
    ".....oSSSSo.....",
    "..oooCCCCCCooo..",
    ".oSCCCCCCCCCCSo.",
    ".oSCCcCCCCcCCSo.",
    ".oSCCCCCCCCCCSo.",
    ".ooCCCCCCCCCCoo.",
    "...oCCCCCCCCo...",
    "...oCCCCCCCCo...",
    "...oPPPPPPPPo...",
    "...oPPPPPPPPo...",
    "...oPPo..oPPo...",
    "...oPPo..oPPo...",
    "...oBBo..oBBo...",
    "...oooo..oooo..."
  ];

  const SPRITES = {
    /* ---- You: baseball cap, yellow shell jacket, cargo trousers ---- */
    you: {
      w: 16, h: 24,
      rows: BODY_ROWS_STANDARD,
      pal: {
        o: INK, H: "#5a3b22", h: "#7a5330",
        S: "#f0c39a", s: "#d69f77", E: "#3a1f2e", M: "#c2707d",
        C: "#ffd15c", c: "#e0a832",
        P: "#4a6b58", B: "#3a2b3f"
      }
    },

    /* ---- Petra Petling: braid, headband, forest-green softshell ---- */
    petra: {
      w: 16, h: 24,
      rows: [
        "................",
        "....oooooooo....",
        "...oHHHHHHHHo...",
        "..oHHhHHHHhHHo..",
        "..oAAAAAAAAAAo..",
        "..oHSSSSSSSSHo..",
        "..oHSESSSSESHo..",
        "..oHSSSSSSSSHo..",
        "..oHSSMMMMSSHo..",
        "...oHSSSSSSHo...",
        "...oHHoSSoHHo...",
        "..oooCCCCCCooo..",
        ".oSCCCCCCCCCCSo.",
        ".oSCCCCCCCCCCSo.",
        ".oSCcCCCCCCcCSo.",
        ".ooCCCCCCCCCCoo.",
        "...oCCaaaaCCo...",
        "...oCCCCCCCCo...",
        "...oPPPPPPPPo...",
        "...oPPPPPPPPo...",
        "...oPPo..oPPo...",
        "...oPPo..oPPo...",
        "...oBBo..oBBo...",
        "...oooo..oooo..."
      ],
      pal: {
        o: INK, H: "#e8c15e", h: "#f6dd93", A: "#e0567f",
        S: "#f6c9a4", E: "#3a1f2e", M: "#c46a7b",
        C: "#3f8f5e", c: "#2f6f48", a: "#d9d2b8",
        P: "#5d4a3a", B: "#3a2b3f"
      }
    },

    /* ---- Nando Nano: beanie, steel-grey jacket, one small magnet ---- */
    nando: {
      w: 16, h: 24,
      rows: [
        "................",
        "....oooooooo....",
        "...oHHHHHHHHo...",
        "...oHHHHHHHHo...",
        "...ohhhhhhhho...",
        "...oSSSSSSSSo...",
        "...oSESSSSESo...",
        "...oSSSSSSSSo...",
        "...oSSMMMMSSo...",
        "....oSSSSSSo....",
        ".....oSSSSo.....",
        "..oooCCCCCCooo..",
        ".oSCCCCCCCCCCSo.",
        ".oSCCCaaCCCCCSo.",
        ".oSCCCaaCCCCCSo.",
        ".ooCCCCCCCCCCoo.",
        "...oCCCCCCCCo...",
        "...oCCCCCCCCo...",
        "...oPPPPPPPPo...",
        "...oPPo..oPPo...",
        "...oPPo..oPPo...",
        "...oBBo..oBBo...",
        "...oooo..oooo...",
        "................"
      ],
      pal: {
        o: INK, H: "#c8433f", h: "#e8615c",
        S: "#e8b48c", E: "#3a1f2e", M: "#b8636f",
        C: "#7d8794", c: "#5f6873", a: "#d84a4a",
        P: "#37414d", B: "#2f2635"
      }
    },

    /* ---- Mysti Five-Star: hood, spectacles, long puzzle-solver robe -- */
    mysti: {
      w: 16, h: 24,
      rows: [
        "................",
        "....oooooooo....",
        "...oHHHHHHHHo...",
        "..oHHHHHHHHHHo..",
        "..oHHSSSSSSHHo..",
        "..oHWEWSSWEWHo..",
        "..oHSSSSSSSSHo..",
        "..oHSSMMMMSSHo..",
        "...oHSSSSSSHo...",
        "...oHHSSSSHHo...",
        "....oHHHHHHo....",
        "..oooCCCCCCooo..",
        ".oSCCCCCCCCCCSo.",
        ".oSCCCCCCCCCCSo.",
        ".oSCCaaaaaaCCSo.",
        ".ooCCCCCCCCCCoo.",
        "...oCCCCCCCCo...",
        "...oCCCCCCCCo...",
        "...oCCCCCCCCo...",
        "...oCCCCCCCCo...",
        "...oCCCCCCCCo...",
        "...oPPPPPPPPo...",
        "...oBBooooBBo...",
        "...oooo..oooo..."
      ],
      pal: {
        o: INK, H: "#3b2b56", W: "#f2f2ff", E: "#241633",
        S: "#eec2a6", M: "#bd6f86",
        C: "#7a4fae", c: "#5c3888", a: "#ffd15c",
        P: "#3b2b56", B: "#2f2635"
      }
    },

    /* ---- A generic Muggle. Grey, oblivious, walking a dog. ---- */
    muggle: {
      w: 16, h: 24,
      rows: BODY_ROWS_STANDARD,
      pal: {
        o: INK, H: "#6b6470",
        S: "#dcb794", E: "#3a1f2e", M: "#b1808c",
        C: "#9aa0ae", c: "#7c8290",
        P: "#5a5f6b", B: "#3a2b3f"
      }
    },

    /* ------------------------------------------------------------------
     * Props. Drawn beside characters and animated independently.
     * ------------------------------------------------------------------ */
    gpsr: {
      w: 7, h: 10,
      rows: [
        "..ooo..",
        "ooooooo",
        "oSSSSSo",
        "oSGGGSo",
        "oSGGGSo",
        "oSSSSSo",
        "oBBBBBo",
        "oBoBoBo",
        "oBBBBBo",
        "ooooooo"
      ],
      pal: { o: INK, S: "#4a4453", G: "#8ef0b8", B: "#6b6474" }
    },

    petling: {
      w: 6, h: 12,
      rows: [
        ".oooo.",
        ".oAAo.",
        "oooooo",
        "oCCCCo",
        "oCCCCo",
        "oCLLCo",
        "oCLLCo",
        "oCCCCo",
        "oCCCCo",
        "oCCCCo",
        "oCCCCo",
        "oooooo"
      ],
      pal: { o: INK, A: "#d84a4a", C: "#cfe6ef", L: "#f6f0d8" }
    },

    magnet: {
      w: 8, h: 8,
      rows: [
        "..oooo..",
        ".oAAAAo.",
        "oAAooAAo",
        "oAo..oAo",
        "oAo..oAo",
        "oSo..oSo",
        "oSo..oSo",
        "ooo..ooo"
      ],
      pal: { o: INK, A: "#d84a4a", S: "#dfe4ea" }
    },

    notebook: {
      w: 9, h: 8,
      rows: [
        "ooooooooo",
        "oWWWWWWWo",
        "oWaWaWaWo",
        "oWWWWWWWo",
        "oWaWaWaWo",
        "oWWWWWWWo",
        "oWaWaWaWo",
        "ooooooooo"
      ],
      pal: { o: INK, W: "#f6f0d8", a: "#7a4fae" }
    },

    /* ------------------------------------------------------------------
     * Scenery.
     * ------------------------------------------------------------------ */
    pine: {
      w: 16, h: 28,
      rows: [
        ".......oo.......",
        "......oDDo......",
        "......oDDo......",
        ".....oDDDDo.....",
        ".....oDDDDo.....",
        "....oDDDLDDo....",
        "....oDDDDDDo....",
        "...oDDDDDDDDo...",
        "...oDDDLDDDDo...",
        "..oDDDDDDDDDDo..",
        "..oDDDDDDDDDDo..",
        ".oDDDDDLDDDDDDo.",
        ".oDDDDDDDDDDDDo.",
        "oDDDDDDDDDDDDDDo",
        "oDDDDDDDDDDDDDDo",
        ".oDDDDDDDDDDDDo.",
        "..oDDDDDDDDDDo..",
        "...oDDDDDDDDo...",
        "......oTTo......",
        "......oTTo......",
        "......oTTo......",
        "......oTTo......",
        "......oTTo......",
        ".....ooTToo.....",
        ".....oTTTTo.....",
        "....ooTTTToo....",
        "....o......o....",
        "................"
      ],
      pal: { o: INK, D: "#2f7a4c", L: "#4aa269", T: "#6b4630" }
    },

    oak: {
      w: 22, h: 26,
      rows: [
        "......oooooo......",
        "....ooDDDDDDoo....",
        "...oDDDDLDDDDDo...",
        "..oDDDDDDDDDDDDo..",
        ".oDDDDDDDDDDDDDDo.",
        ".oDDLDDDDDDDDDDDo.",
        "oDDDDDDDDDDDDDDDDo",
        "oDDDDDDDDDDLDDDDDo",
        "oDDDDDDDDDDDDDDDDo",
        ".oDDDDDDDDDDDDDDo.",
        ".oDDDDLDDDDDDDDDo.",
        "..oDDDDDDDDDDDDo..",
        "...oDDDDDDDDDDo...",
        "....ooDDDDDDoo....",
        "........oTTo......",
        "........oTTo......",
        "........oTTo......",
        "........oTTo......",
        "........oTTo......",
        "........oTTo......",
        ".......ooTToo.....",
        ".......oTTTTo.....",
        "......ooTTTToo....",
        "......oTTTTTTo....",
        "......o......o....",
        ".................."
      ],
      pal: { o: INK, D: "#3d8f57", L: "#63b078", T: "#6b4630" }
    },

    bush: {
      w: 14, h: 9,
      rows: [
        "....oooo....",
        "..ooDDDDoo..",
        ".oDDDDLDDDo.",
        "oDDDDDDDDDDo",
        "oDDLDDDDDDDo",
        "oDDDDDDDDDDo",
        ".oDDDDDDDDo.",
        "..oDDDDDDo..",
        "...oooooo..."
      ],
      pal: { o: INK, D: "#2c6b43", L: "#48915d" }
    },

    lamppost: {
      w: 10, h: 30,
      rows: [
        "..oooooo..",
        ".oLLLLLLo.",
        ".oLLLLLLo.",
        "..oLLLLo..",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "...oPPo...",
        "..oPPPPo..",
        ".oPPPPPPo.",
        ".oooooooo."
      ],
      pal: { o: INK, L: "#ffe9a8", P: "#4a4453" }
    },

    signpost: {
      w: 14, h: 26,
      rows: [
        "oooooooooooo..",
        "oSSSSSSSSSSo..",
        "oSAASAASAASo..",
        "oSSSSSSSSSSo..",
        "oSAASAASAASo..",
        "oSSSSSSSSSSo..",
        "oooooooooooo..",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        ".....oPPo.....",
        "....oPPPPo....",
        "....oooooo...."
      ],
      pal: { o: INK, S: "#d8dde6", A: "#4a6b9a", P: "#5f6873" }
    },

    tent: {
      w: 30, h: 18,
      rows: [
        "..............o...............",
        ".............oAo..............",
        "............oAAAo.............",
        "...........oAAAAAo............",
        "..........oCCCCCCCo...........",
        ".........oCCCCCCCCCo..........",
        "........oCCCCCCCCCCCo.........",
        ".......oCCCCCCCCCCCCCo........",
        "......oCCCCCCCCCCCCCCCo.......",
        ".....oCCCCCCoooooCCCCCCo......",
        "....oCCCCCCoDDDDDoCCCCCCo.....",
        "...oCCCCCCCoDDDDDoCCCCCCCo....",
        "..oCCCCCCCCoDDDDDoCCCCCCCCo...",
        ".oCCCCCCCCCoDDDDDoCCCCCCCCCo..",
        "oCCCCCCCCCCoDDDDDoCCCCCCCCCCo.",
        "oCCCCCCCCCCoDDDDDoCCCCCCCCCCo.",
        "oooooooooooooooooooooooooooooo",
        ".............................."
      ],
      pal: { o: INK, A: "#ffd15c", C: "#e0567f", D: "#4a2c46" }
    },

    dog: {
      w: 14, h: 10,
      rows: [
        "...........oo.",
        "..........oCCo",
        "oooo......oCCo",
        "oCCCoooooooCCo",
        "oCCCCCCCCCCCEo",
        "oCCCCCCCCCCCCo",
        "oCCCCCCCCCCCCo",
        "oCoCoooooCoCo.",
        "oCoCo...oCoCo.",
        "ooooo...ooooo."
      ],
      pal: { o: INK, C: "#b98a5e", E: "#2b1630" }
    },

    /* The cache itself. Small, green, extremely findable in hindsight. */
    ammocan: {
      w: 12, h: 9,
      rows: [
        "..oooooooo..",
        ".oAAoooAAAo.",
        "oCCCCCCCCCCo",
        "oCCCCCCCCCCo",
        "oCCLLLLLLCCo",
        "oCCLLLLLLCCo",
        "oCCCCCCCCCCo",
        "oCCCCCCCCCCo",
        "oooooooooooo"
      ],
      pal: { o: INK, A: "#5f6873", C: "#3f6b45", L: "#598c5f" }
    }
  };

  /* ------------------------------------------------------------------
   * Drawing primitives
   * ------------------------------------------------------------------ */

  function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x | 0, y | 0, Math.ceil(w), Math.ceil(h));
  }

  /**
   * Sprite rendering.
   *
   * A 16x24 sprite at scale 3 is up to 384 separate fillRect calls, and
   * with five or six characters on stage that dominated every frame.
   * Each distinct variant is rasterised once into its own small canvas
   * and blitted from then on — one drawImage instead of a few hundred
   * fills. The variant set is tiny and bounded (a handful of sprites,
   * two scales, flipped or not, blinking or not, mouth open or shut).
   */
  const spriteCache = new Map();
  const CACHE_LIMIT = 256;

  function rasterise(def, o) {
    const scale = o.scale;
    const c = document.createElement("canvas");
    c.width = def.w * scale;
    c.height = def.h * scale;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    const pal = def.pal;

    for (let row = 0; row < def.h; row++) {
      const line = def.rows[row] || "";
      for (let col = 0; col < def.w; col++) {
        let ch = line.charAt(col);
        if (!ch || ch === ".") continue;

        /* Blinking: eyes become skin for a couple of frames. */
        if (o.blink && ch === "E") ch = pal.S ? "S" : ch;
        /* Talking: the mouth closes on alternate frames. */
        if (ch === "M" && o.talk === false) ch = pal.S ? "S" : ch;

        let color = pal[ch];
        if (!color) continue;

        const dx = o.flip ? def.w - 1 - col : col;
        g.fillStyle = color;
        g.fillRect(dx * scale, row * scale, scale, scale);
      }
    }
    return c;
  }

  /**
   * Draw a sprite grid.
   * opts: { scale, flip, blink, talk, alpha }
   */
  function sprite(ctx, name, x, y, opts) {
    const def = SPRITES[name];
    if (!def) return;
    const o = opts || {};
    const scale = o.scale || 1;
    const variant = {
      scale: scale,
      flip: !!o.flip,
      blink: !!o.blink,
      talk: o.talk !== false
    };
    const key = name + "|" + scale + "|" + (variant.flip ? 1 : 0) + "|" +
                (variant.blink ? 1 : 0) + "|" + (variant.talk ? 1 : 0);

    let canvas = spriteCache.get(key);
    if (!canvas) {
      if (spriteCache.size >= CACHE_LIMIT) spriteCache.clear();
      canvas = rasterise(def, variant);
      spriteCache.set(key, canvas);
    }

    const fade = o.alpha != null && o.alpha < 1;
    if (fade) { ctx.save(); ctx.globalAlpha = o.alpha; }
    ctx.drawImage(canvas, Math.round(x), Math.round(y));
    if (fade) ctx.restore();
  }

  /** A 5x5 pixel heart, the game's punctuation mark. */
  function heart(ctx, x, y, s, color) {
    const rows = [".o.o.", "ooooo", "ooooo", ".ooo.", "..o.."];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (rows[r][c] === "o") rect(ctx, x + c * s, y + r * s, s, s, color);
      }
    }
  }

  /** Chunky 3x5 bitmap font, for text that has to live inside the art. */
  const GLYPHS = {
    "0": ["ooo", "o.o", "o.o", "o.o", "ooo"],
    "1": [".o.", "oo.", ".o.", ".o.", "ooo"],
    "2": ["ooo", "..o", "ooo", "o..", "ooo"],
    "3": ["ooo", "..o", "ooo", "..o", "ooo"],
    "4": ["o.o", "o.o", "ooo", "..o", "..o"],
    "5": ["ooo", "o..", "ooo", "..o", "ooo"],
    "6": ["ooo", "o..", "ooo", "o.o", "ooo"],
    "7": ["ooo", "..o", "..o", "..o", "..o"],
    "8": ["ooo", "o.o", "ooo", "o.o", "ooo"],
    "9": ["ooo", "o.o", "ooo", "..o", "ooo"],
    A: ["ooo", "o.o", "ooo", "o.o", "o.o"],
    B: ["oo.", "o.o", "oo.", "o.o", "oo."],
    C: ["ooo", "o..", "o..", "o..", "ooo"],
    D: ["oo.", "o.o", "o.o", "o.o", "oo."],
    E: ["ooo", "o..", "oo.", "o..", "ooo"],
    F: ["ooo", "o..", "oo.", "o..", "o.."],
    G: ["ooo", "o..", "o.o", "o.o", "ooo"],
    H: ["o.o", "o.o", "ooo", "o.o", "o.o"],
    I: ["ooo", ".o.", ".o.", ".o.", "ooo"],
    J: ["..o", "..o", "..o", "o.o", "ooo"],
    K: ["o.o", "o.o", "oo.", "o.o", "o.o"],
    L: ["o..", "o..", "o..", "o..", "ooo"],
    M: ["o.o", "ooo", "ooo", "o.o", "o.o"],
    N: ["oo.", "o.o", "o.o", "o.o", "o.o"],
    O: ["ooo", "o.o", "o.o", "o.o", "ooo"],
    P: ["ooo", "o.o", "ooo", "o..", "o.."],
    Q: ["ooo", "o.o", "o.o", "ooo", "..o"],
    R: ["ooo", "o.o", "oo.", "o.o", "o.o"],
    S: ["ooo", "o..", "ooo", "..o", "ooo"],
    T: ["ooo", ".o.", ".o.", ".o.", ".o."],
    U: ["o.o", "o.o", "o.o", "o.o", "ooo"],
    V: ["o.o", "o.o", "o.o", "o.o", ".o."],
    W: ["o.o", "o.o", "ooo", "ooo", "o.o"],
    X: ["o.o", "o.o", ".o.", "o.o", "o.o"],
    Y: ["o.o", "o.o", ".o.", ".o.", ".o."],
    Z: ["ooo", "..o", ".o.", "o..", "ooo"],
    "°": ["oo.", "o.o", "oo.", "...", "..."],
    ".": ["...", "...", "...", "...", ".o."],
    ",": ["...", "...", "...", ".o.", "o.."],
    "-": ["...", "...", "ooo", "...", "..."],
    "!": [".o.", ".o.", ".o.", "...", ".o."],
    "?": ["ooo", "..o", ".oo", "...", ".o."],
    "'": [".o.", ".o.", "...", "...", "..."],
    "&": ["oo.", "oo.", "ooo", "o.o", "ooo"],
    "*": ["o.o", ".o.", "ooo", ".o.", "o.o"],
    ":": ["...", ".o.", "...", ".o.", "..."],
    "/": ["..o", "..o", ".o.", "o..", "o.."],
    " ": ["...", "...", "...", "...", "..."]
  };

  function text(ctx, str, x, y, s, color) {
    let cx = x;
    const up = String(str).toUpperCase();
    for (let i = 0; i < up.length; i++) {
      const g = GLYPHS[up[i]] || GLYPHS["?"];
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
          if (g[r][c] === "o") rect(ctx, cx + c * s, y + r * s, s, s, color);
        }
      }
      cx += 4 * s;
    }
    return cx - x;
  }

  function textWidth(str, s) {
    return String(str).length * 4 * s - s;
  }

  return {
    VIEW_W: VIEW_W,
    VIEW_H: VIEW_H,
    INK: INK,
    sprites: SPRITES,
    rect: rect,
    sprite: sprite,
    heart: heart,
    text: text,
    textWidth: textWidth
  };
})();
