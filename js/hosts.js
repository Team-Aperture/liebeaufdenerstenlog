/* =====================================================================
 * hosts.js — R-3MI and V-TGM, the two units of the Kalibrierungsanlage.
 *
 * These two are drawn procedurally rather than from fixed sprite grids.
 * They have nine expressions and a dozen arm poses between them, and
 * both need to blend from one to the next; baking that combinatorially
 * into grids would be thousands of rows of strings that could never
 * move. Bones and a parametric eye animate instead.
 *
 * Everything is authored in local "art units" and multiplied by the
 * scale at draw time, with every coordinate rounded, so the result
 * still lands exactly on the pixel grid.
 * ===================================================================== */
"use strict";

window.HOSTS = (function () {

  const PAL = {
    r3mi: {
      shell: "#e7e3d9", shade: "#bcb7ac", edge: "#1b1620",
      limb: "#2a2733", limbHi: "#3f3b49",
      accent: "#2ecf62", accentDim: "#1d8a41",
      eye: "#5dff9a", eyeMid: "#2ecf62", eyeDark: "#0d2a18",
      glass: "#d3e9dc", fluid: "#45e07a", fluidHi: "#9dffc4"
    },
    vtgm: {
      shell: "#ded9d0", shade: "#b0aaa0", edge: "#1b1620",
      limb: "#232028", limbHi: "#37333d",
      accent: "#c0322c", accentDim: "#7d211d",
      eye: "#ff6f61", eyeMid: "#c0322c", eyeDark: "#2a0f0d",
      glass: "#efd6d3", fluid: "#d8443c", fluidHi: "#ff9b90"
    }
  };

  /* ------------------------------------------------------------------
   * Pixel primitives. Local units in, device pixels out.
   * ------------------------------------------------------------------ */
  function px(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)),
                 Math.max(1, Math.round(h)));
  }

  function disc(ctx, cx, cy, r, c) {
    cx = Math.round(cx); cy = Math.round(cy);
    const R = Math.max(1, Math.round(r));
    for (let dy = -R; dy <= R; dy++) {
      const dx = Math.floor(Math.sqrt(R * R - dy * dy));
      px(ctx, cx - dx, cy + dy, dx * 2 + 1, 1, c);
    }
  }

  function ring(ctx, cx, cy, r, thick, c) {
    cx = Math.round(cx); cy = Math.round(cy);
    const R = Math.max(1, Math.round(r));
    const Ri = Math.max(0, R - Math.max(1, Math.round(thick)));
    for (let dy = -R; dy <= R; dy++) {
      const o = Math.floor(Math.sqrt(R * R - dy * dy));
      const i = Math.abs(dy) <= Ri ? Math.floor(Math.sqrt(Ri * Ri - dy * dy)) : -1;
      if (i < 0) { px(ctx, cx - o, cy + dy, o * 2 + 1, 1, c); }
      else {
        px(ctx, cx - o, cy + dy, o - i, 1, c);
        px(ctx, cx + i + 1, cy + dy, o - i, 1, c);
      }
    }
  }

  /** An oval, for helmets and bodies that are not quite round. */
  function oval(ctx, cx, cy, rx, ry, c) {
    cx = Math.round(cx); cy = Math.round(cy);
    const RY = Math.max(1, Math.round(ry));
    for (let dy = -RY; dy <= RY; dy++) {
      const k = 1 - (dy * dy) / (RY * RY);
      if (k < 0) continue;
      const dx = Math.floor(rx * Math.sqrt(k));
      px(ctx, cx - dx, cy + dy, dx * 2 + 1, 1, c);
    }
  }

  /**
   * A limb segment: a thick line with a rounded cap at each end.
   *
   * Stamping a full disc at every step along the line costs about
   * (length x width) fills. Walking the dominant axis and laying down
   * one span per step, with a rounded cap only at the two ends, looks
   * the same at these sizes for roughly a quarter of the work — and
   * these two are on screen in every single scene.
   */
  function bone(ctx, x0, y0, x1, y1, w, c) {
    const dx = x1 - x0, dy = y1 - y0;
    const r = w / 2;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
    if (Math.abs(dy) >= Math.abs(dx)) {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        px(ctx, x0 + dx * t - r, y0 + dy * t, w, 1, c);
      }
    } else {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        px(ctx, x0 + dx * t, y0 + dy * t - r, 1, w, c);
      }
    }
    disc(ctx, x0, y0, r, c);
    disc(ctx, x1, y1, r, c);
  }

  /** The coiled feed line from the tank over the shoulder. */
  function coil(ctx, x0, y0, x1, y1, turns, amp, c) {
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      /* arc from tank to collar, with a spring wound around it */
      const bx = x0 + (x1 - x0) * t;
      const by = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * amp * 1.6;
      const wob = Math.sin(t * Math.PI * 2 * turns) * amp * 0.5;
      const nx = -(y1 - y0), ny = (x1 - x0);
      const len = Math.hypot(nx, ny) || 1;
      px(ctx, bx + (nx / len) * wob, by + (ny / len) * wob, 1, 1, c);
      px(ctx, bx + (nx / len) * wob, by + (ny / len) * wob + 1, 1, 1, c);
    }
  }

  /* ------------------------------------------------------------------
   * Expressions. Each returns how the single optic reads.
   *   lid    0 = wide open, 1 = fully closed
   *   squash vertical squeeze of the iris
   *   arc    -1 = frowning crescent, +1 = happy crescent
   *   glow   halo strength
   * ------------------------------------------------------------------ */
  const EXPR = {
    neutral:    { lid: 0.00, squash: 1.00, arc: 0,    glow: 0.55, shape: "ring" },
    happy:      { lid: 0.00, squash: 1.00, arc: 1,    glow: 0.85, shape: "arc" },
    curious:    { lid: 0.00, squash: 1.00, arc: 0,    glow: 0.70, shape: "ring", look: 1 },
    suspicious: { lid: 0.52, squash: 0.72, arc: 0,    glow: 0.45, shape: "ring", look: -0.7 },
    annoyed:    { lid: 0.66, squash: 0.48, arc: -1,   glow: 0.40, shape: "slit" },
    panic:      { lid: 0.00, squash: 1.12, arc: 0,    glow: 1.00, shape: "ring", shake: 1 },
    error404:   { lid: 0.00, squash: 1.00, arc: 0,    glow: 0.80, shape: "err" },
    proud:      { lid: 0.00, squash: 1.00, arc: 0,    glow: 1.00, shape: "star" },
    highfive:   { lid: 0.00, squash: 1.00, arc: 0,    glow: 0.85, shape: "ring" },
    sad:        { lid: 0.35, squash: 0.80, arc: -1,   glow: 0.35, shape: "arc" }
  };

  /**
   * The optic. One eye does all the acting these two have, so it gets
   * the detail budget: a socket, a lid, an iris, a specular pip and a
   * halo that leaks onto the shell.
   */
  function eye(ctx, p, cx, cy, r, exprName, t, blink) {
    const e = EXPR[exprName] || EXPR.neutral;
    const wob = e.shake ? Math.round(Math.sin(t * 42) * 1) : 0;
    cx += wob;

    /* socket */
    disc(ctx, cx, cy, r + 1, p.edge);
    disc(ctx, cx, cy, r, p.eyeDark);

    if (e.shape === "err") {
      /* 404: the optic gives up and shows a status code instead. */
      const jitter = Math.floor(t * 14) % 3 - 1;
      ART.text(ctx, "404", cx - 5 + jitter, cy - 2, 1, p.eye);
      for (let i = 0; i < 6; i++) {
        const gy = cy - r + ((i * 7 + Math.floor(t * 30)) % (r * 2));
        const gx = cx - r - 2 + ((i * 5 + Math.floor(t * 23)) % (r * 2 + 4));
        px(ctx, gx, gy, 2 + (i % 3), 1, i % 2 ? p.eyeMid : p.eye);
      }
      return;
    }

    if (e.shape === "star") {
      /* proud: a four-point sparkle where the iris should be */
      const s = r + Math.round(Math.sin(t * 4) * 0.6);
      disc(ctx, cx, cy, Math.max(1, r - 1), p.eyeDark);
      /* four tapering points, drawn last so nothing buries them */
      for (let i = 0; i <= s; i++) {
        const w = Math.max(1, Math.round((1 - i / (s + 1)) * 3));
        px(ctx, cx - (w >> 1), cy - i, w, 1, p.eye);
        px(ctx, cx - (w >> 1), cy + i, w, 1, p.eye);
        px(ctx, cx - i, cy - (w >> 1), 1, w, p.eye);
        px(ctx, cx + i, cy - (w >> 1), 1, w, p.eye);
      }
      disc(ctx, cx, cy, Math.max(1, r - 6), "#ffffff");
      return;
    }

    if (e.shape === "arc") {
      /* happy / sad: the iris collapses to a crescent. Happy bows
         downward in the middle and lifts at the ends — a smile. */
      const dir = e.arc >= 0 ? 1 : -1;
      for (let dx = -r + 1; dx <= r - 1; dx++) {
        const k = 1 - (dx * dx) / ((r - 1) * (r - 1));
        const dy = Math.round(dir * (r - 1.5) * k * 0.75);
        px(ctx, cx + dx, cy + dy, 1, 2, p.eye);
      }
      return;
    }

    if (e.shape === "slit") {
      px(ctx, cx - r + 1, cy - 1, (r - 1) * 2 + 1, 2, p.eyeMid);
      px(ctx, cx - r + 2, cy - 1, (r - 2) * 2 + 1, 1, p.eye);
      return;
    }

    /* ring: the default optic */
    const lid = blink ? 1 : e.lid;
    const irisR = Math.max(1, r - 1.5);
    const drift = (e.look || 0) * 1.2 + Math.sin(t * 0.7) * 0.5;

    ring(ctx, cx, cy, irisR, 2, p.eyeMid);
    disc(ctx, cx + drift, cy, Math.max(1, irisR - 2.2), p.eye);
    px(ctx, cx + drift - 1, cy - Math.max(1, irisR - 3), 2, 2, "#ffffff");

    /* eyelid comes down from the top */
    if (lid > 0.01) {
      const h = Math.ceil((r * 2 + 2) * lid);
      for (let dy = -r - 1; dy < -r - 1 + h; dy++) {
        const k = (r + 1) * (r + 1) - dy * dy;
        if (k < 0) continue;
        const dx = Math.floor(Math.sqrt(k));
        px(ctx, cx - dx, cy + dy, dx * 2 + 1, 1, p.eyeDark);
      }
    }
  }

  /* ------------------------------------------------------------------
   * Arm poses. Each entry is [elbow, hand] as offsets from the
   * shoulder, in local units, for the near and far arm. Poses are
   * lerped, so a unit swinging from "crossed" to "cheer" actually
   * swings rather than snapping.
   * ------------------------------------------------------------------ */
  const POSES = {
    idle:     { l: [[-3, 4], [-3, 9]],   r: [[3, 4], [3, 9]] },
    cheer:    { l: [[-4, 2], [-5, -6]],  r: [[3, 4], [3, 9]] },
    point:    { l: [[-4, 1], [-3, -6]],  r: [[3, 5], [2, 10]] },
    think:    { l: [[-5, 3], [-1, -3]],  r: [[3, 5], [2, 10]] },
    crossed:  { l: [[2, 5], [8, 7]],     r: [[-2, 5], [-8, 7]] },
    panic:    { l: [[-5, 0], [-7, -7]],  r: [[5, 0], [7, -7]] },
    wave:     { l: [[-3, 5], [-3, 9]],   r: [[4, 1], [6, -6]] },
    hips:     { l: [[-5, 4], [-2, 8]],   r: [[5, 4], [2, 8]] },
    highfive: { l: [[-3, 5], [-3, 9]],   r: [[4, 0], [5, -8]] },
    present:  { l: [[-5, 3], [-8, 6]],   r: [[5, 3], [8, 6]] },
    slump:    { l: [[-2, 5], [-1, 11]],  r: [[2, 5], [1, 11]] }
  };

  const lerp = (a, b, k) => a + (b - a) * k;

  function blendPose(from, to, k) {
    const A = POSES[from] || POSES.idle;
    const B = POSES[to] || POSES.idle;
    const mix = (side, j, i) => lerp(A[side][j][i], B[side][j][i], k);
    return {
      l: [[mix("l", 0, 0), mix("l", 0, 1)], [mix("l", 1, 0), mix("l", 1, 1)]],
      r: [[mix("r", 0, 0), mix("r", 0, 1)], [mix("r", 1, 0), mix("r", 1, 1)]]
    };
  }

  /** A three-fingered pixel hand. */
  function hand(ctx, x, y, s, open, p) {
    disc(ctx, x, y, 1.6 * s, p.limb);
    if (open) {
      px(ctx, x - 2 * s, y - 3 * s, s, 3 * s, p.limb);
      px(ctx, x, y - 4 * s, s, 4 * s, p.limb);
      px(ctx, x + 2 * s, y - 3 * s, s, 3 * s, p.limb);
    }
  }

  /* ------------------------------------------------------------------
   * The units
   * ------------------------------------------------------------------ */

  function drawR3MI(ctx, X, Y, s, st) {
    const p = PAL.r3mi;
    const u = (n) => n * s;                 /* local units -> pixels */
    const bob = Math.sin(st.t * 1.9 + st.phase) * 0.6;
    const ox = X, oy = Y + bob * s;
    const at = (lx, ly) => [ox + u(lx), oy + u(ly)];

    /* --- feed tank and coil, behind everything --- */
    const [tx, ty] = at(18.4, 16);
    px(ctx, tx - u(0.7), ty - u(5.7), u(5.4), u(11.4), p.edge);
    px(ctx, tx, ty - u(5), u(4), u(10), p.glass);
    const fill = u(10) * 0.74;
    px(ctx, tx, ty + u(5) - fill, u(4), fill, p.fluid);
    px(ctx, tx, ty + u(5) - fill, u(4), Math.max(1, s), p.fluidHi);
    for (let i = 0; i < 4; i++) {
      const by = ty + u(4.4) - ((st.t * 9 + i * 4.5) % 9) * s;
      px(ctx, tx + u(0.7 + i * 0.9), by, s, s, p.fluidHi);
    }
    /* collar and cap */
    px(ctx, tx - u(0.4), ty - u(6.6), u(4.8), u(1.2), p.limb);
    coil(ctx, ...at(20.4, 10.4), ...at(13.4, 5.2), 6, s * 1.4, p.accent);

    /* --- legs --- */
    const legW = 2.6 * s;
    [[8.2, -1], [13.8, 1]].forEach(([lx, dir]) => {
      const [hx0, hy0] = at(lx, 26.5);
      const [nx, ny] = at(lx + dir * 0.3, 31);
      const [fx, fy] = at(lx + dir * 0.4, 35.4);
      bone(ctx, hx0, hy0, nx, ny, legW + 1.5, p.edge);
      bone(ctx, nx, ny, fx, fy, legW + 0.5, p.edge);
      bone(ctx, hx0, hy0, nx, ny, legW, p.limb);
      bone(ctx, nx, ny, fx, fy, legW - 0.6, p.limb);
      disc(ctx, nx, ny, 1.6 * s, p.limbHi);
      disc(ctx, hx0, hy0, 1.8 * s, p.limbHi);
      px(ctx, fx - u(2.2), fy - u(0.4), u(4.6), u(2), p.edge);
      px(ctx, fx - u(1.9), fy - u(0.4), u(4), u(1.5), p.limb);
    });

    /* --- torso: cream chest plate over a dark waist --- */
    const [bx, by] = at(11, 19.5);
    px(ctx, bx - u(3), by + u(4), u(6), u(4), p.edge);
    px(ctx, bx - u(2.6), by + u(4.3), u(5.2), u(3.4), p.limb);
    px(ctx, bx - u(6), by - u(6), u(12), u(11), p.edge);
    px(ctx, bx - u(5.4), by - u(5.4), u(10.8), u(10), p.shell);
    px(ctx, bx - u(5.4), by + u(2.4), u(10.8), u(2.2), p.shade);
    px(ctx, bx - u(5.4), by - u(5.4), u(10.8), u(1), "#ffffff");
    /* chest indicator, brighter while this unit is talking */
    const lit = st.talking ? p.accent : p.accentDim;
    px(ctx, bx - u(2.4), by - u(2.6), u(4.8), u(2), p.edge);
    px(ctx, bx - u(2), by - u(2.2), u(4), u(1.2), lit);
    px(ctx, bx - u(1.4), by + u(0.6), u(2.8), u(1), p.shade);

    /* --- arms --- */
    const pose = blendPose(st.poseFrom, st.pose, st.poseK);
    const swing = Math.sin(st.t * 1.9 + st.phase) * 0.5;
    [["l", -6.4], ["r", 6.4]].forEach(([side, sx]) => {
      const j = pose[side];
      const [shx, shy] = at(11 + sx, 15.4);
      const [ex, ey] = at(11 + sx + j[0][0], 15.4 + j[0][1] + swing * 0.4);
      const [hx2, hy2] = at(11 + sx + j[1][0], 15.4 + j[1][1] + swing * 0.7);
      bone(ctx, shx, shy, ex, ey, 2.4 * s + 1, p.edge);
      bone(ctx, ex, ey, hx2, hy2, 2.1 * s + 1, p.edge);
      bone(ctx, shx, shy, ex, ey, 2.4 * s, p.limb);
      bone(ctx, ex, ey, hx2, hy2, 2.1 * s, p.limb);
      disc(ctx, ex, ey, 1.4 * s, p.limbHi);
      disc(ctx, shx, shy, 2.2 * s, p.limb);
      disc(ctx, shx, shy, 1.5 * s, p.limbHi);
      hand(ctx, hx2, hy2, s, st.openHands, p);
    });

    /* --- head --- */
    const [hx, hy] = at(11, 6.8);
    px(ctx, hx - u(1.6), hy + u(4.6), u(3.2), u(2.6), p.limb);
    oval(ctx, hx, hy, u(5.9), u(6.2), p.edge);
    oval(ctx, hx, hy, u(5.2), u(5.5), p.shell);
    oval(ctx, hx, hy + u(2.6), u(4.6), u(2.6), p.shade);
    px(ctx, hx - u(4), hy - u(4), u(2.4), u(1), "#ffffff");
    /* antenna */
    px(ctx, hx - u(0.5), hy - u(7.6), u(1), u(1.8), p.edge);
    px(ctx, hx - u(1.1), hy - u(8.6), u(2.2), u(1.6), p.edge);
    px(ctx, hx - u(0.8), hy - u(8.4), u(1.6), u(1.1), p.accent);

    eye(ctx, p, hx, hy, u(3.5), st.expr, st.t, st.blink);
    return { headX: hx, headY: hy - u(9), w: u(24), h: u(36) };
  }

  function drawVTGM(ctx, X, Y, s, st) {
    const p = PAL.vtgm;
    const u = (n) => n * s;
    const bob = Math.sin(st.t * 1.7 + st.phase) * 0.7;
    const ox = X, oy = Y + bob * s;
    const at = (lx, ly) => [ox + u(lx), oy + u(ly)];

    /* --- tank clear of the shell on the left, and the coil --- */
    const [tx, ty] = at(1.2, 11);
    px(ctx, tx - u(0.7), ty - u(5.7), u(5.4), u(11.4), p.edge);
    px(ctx, tx, ty - u(5), u(4), u(10), p.glass);
    const fill = u(10) * 0.7;
    px(ctx, tx, ty + u(5) - fill, u(4), fill, p.fluid);
    px(ctx, tx, ty + u(5) - fill, u(4), Math.max(1, s), p.fluidHi);
    for (let i = 0; i < 4; i++) {
      const by = ty + u(4.4) - ((st.t * 8 + i * 5) % 9) * s;
      px(ctx, tx + u(0.7 + i * 0.9), by, s, s, p.fluidHi);
    }
    px(ctx, tx - u(0.4), ty - u(6.6), u(4.8), u(1.2), p.limb);
    coil(ctx, ...at(3.2, 5.2), ...at(11, 3.4), 5, s * 1.5, p.accent);

    /* --- legs: short, wide, planted --- */
    [[11.5, -1], [19.5, 1]].forEach(([lx, dir]) => {
      const [hpx, hpy] = at(lx, 18);
      const [nx, ny] = at(lx + dir * 0.8, 23.5);
      const [fx, fy] = at(lx + dir * 1.1, 29);
      bone(ctx, hpx, hpy, nx, ny, 3 * s + 1.5, p.edge);
      bone(ctx, nx, ny, fx, fy, 2.7 * s + 1, p.edge);
      bone(ctx, hpx, hpy, nx, ny, 3 * s, p.limb);
      bone(ctx, nx, ny, fx, fy, 2.7 * s - 0.6, p.limb);
      disc(ctx, nx, ny, 1.7 * s, p.limbHi);
      px(ctx, fx - u(2.6), fy - u(0.5), u(5.4), u(2.2), p.edge);
      px(ctx, fx - u(2.2), fy - u(0.5), u(4.6), u(1.6), p.limb);
    });

    /* --- arms: articulated tubes off the lower shell --- */
    const pose = blendPose(st.poseFrom, st.pose, st.poseK);
    const swing = Math.sin(st.t * 1.7 + st.phase) * 0.5;
    [["l", -8.8], ["r", 8.8]].forEach(([side, sx]) => {
      const j = pose[side];
      const [shx, shy] = at(15.5 + sx, 14);
      const [ex, ey] = at(15.5 + sx + j[0][0], 14 + j[0][1] + swing * 0.4);
      const [hx2, hy2] = at(15.5 + sx + j[1][0], 14 + j[1][1] + swing * 0.7);
      bone(ctx, shx, shy, ex, ey, 2.3 * s + 1, p.edge);
      bone(ctx, ex, ey, hx2, hy2, 2.1 * s + 1, p.edge);
      bone(ctx, shx, shy, ex, ey, 2.3 * s, p.limb);
      bone(ctx, ex, ey, hx2, hy2, 2.1 * s, p.limb);
      disc(ctx, ex, ey, 1.4 * s, p.limbHi);
      hand(ctx, hx2, hy2, s, st.openHands, p);
    });

    /* --- the body: one big shell with a single enormous optic --- */
    const [bx, by] = at(15.5, 10.6);
    disc(ctx, bx, by, u(9.9), p.edge);
    disc(ctx, bx, by, u(9.1), p.shell);
    for (let dy = 3; dy <= 9; dy++) {
      const k = 1 - (dy * dy) / (9.1 * 9.1);
      if (k < 0) continue;
      const dx = Math.floor(u(9.1 * Math.sqrt(k)));
      px(ctx, bx - dx, by + u(dy), dx * 2, s, p.shade);
    }
    /* top vent and shoulder bolts */
    px(ctx, bx - u(2.4), by - u(8.8), u(4.8), u(1.6), p.edge);
    px(ctx, bx - u(2), by - u(8.5), u(4), u(1.1), p.accentDim);
    px(ctx, bx - u(7.2), by - u(6), u(2.6), u(1.2), "#ffffff");
    /* two panel seams instead of studs — studs turn to confetti at 2x */
    px(ctx, bx - u(8.6), by + u(1), u(2), s, p.edge);
    px(ctx, bx + u(6.6), by + u(1), u(2), s, p.edge);

    const lit = st.talking ? p.accent : p.accentDim;
    px(ctx, bx + u(4.6), by + u(6.4), u(2.2), u(2.2), p.edge);
    px(ctx, bx + u(4.9), by + u(6.7), u(1.6), u(1.6), lit);

    eye(ctx, p, bx + u(0.6), by, u(6.2), st.expr, st.t, st.blink);
    return { headX: bx, headY: by - u(10.5), w: u(28), h: u(29) };
  }

  /* ------------------------------------------------------------------
   * Emotes — the little symbols from the expression sheets that pop
   * above a unit's head.
   * ------------------------------------------------------------------ */
  function emote(ctx, kind, x, y, s, t, color) {
    const rise = Math.min(1, t * 3);
    const yy = y - rise * 4 * s;
    const pop = 1 + Math.sin(Math.min(Math.PI, t * 7)) * 0.3;
    const S = Math.max(1, Math.round(s * pop));

    switch (kind) {
      case "heart":
        ART.heart(ctx, x - 2 * S, yy, S, color || "#ff5d9e");
        break;
      case "question":
        ART.text(ctx, "?", x - S, yy, S * 2, color || "#5dff9a");
        break;
      case "bang":
        ART.text(ctx, "!", x - S, yy, S * 2, color || "#ff6f61");
        break;
      case "sparkle":
        for (const [dx, dy, k] of [[0, 0, 1.4], [5, 3, 0.9], [-5, 2, 0.9]]) {
          const r = k * S * 1.6;
          px(ctx, x + dx * S, yy + dy * S - r, S, r * 2, color || "#ffd15c");
          px(ctx, x + dx * S - r, yy + dy * S, r * 2, S, color || "#ffd15c");
        }
        break;
      case "anger":
        /* the classic four-lobed cross vein */
        for (const [dx, dy] of [[0, -2], [0, 2], [-2, 0], [2, 0]]) {
          px(ctx, x + dx * S, yy + dy * S, S * 2, S * 2, color || "#ff4733");
        }
        break;
      case "note":
        px(ctx, x, yy - 4 * S, S, 5 * S, color || "#8ef0b8");
        px(ctx, x - 2 * S, yy + S, 3 * S, 2 * S, color || "#8ef0b8");
        break;
      case "sweat":
        px(ctx, x, yy, S, S * 3, color || "#9ad8ff");
        px(ctx, x - S, yy + S * 2, S * 3, S * 2, color || "#9ad8ff");
        break;
      case "lines":
        for (let i = 0; i < 3; i++) {
          px(ctx, x + (i - 1) * 3 * S, yy - i * S, S, 3 * S, color || "#5dff9a");
        }
        break;
    }
  }

  /* ------------------------------------------------------------------
   * Per-unit animation state, so poses and expressions can blend.
   * ------------------------------------------------------------------ */
  const state = {
    r3mi: { expr: "neutral", pose: "idle", poseFrom: "idle", poseK: 1, phase: 0 },
    vtgm: { expr: "neutral", pose: "idle", poseFrom: "idle", poseK: 1, phase: 1.7 }
  };

  function set(who, expr, pose) {
    const s = state[who];
    if (!s) return;
    if (expr && EXPR[expr]) s.expr = expr;
    if (pose && POSES[pose] && pose !== s.pose) {
      s.poseFrom = s.pose;
      s.pose = pose;
      s.poseK = 0;
    }
  }

  function update(dt) {
    for (const k of Object.keys(state)) {
      const s = state[k];
      if (s.poseK < 1) s.poseK = Math.min(1, s.poseK + dt * 4.5);
    }
  }

  /**
   * Draw a unit with its feet on footY.
   * opts: { t, talking, scale, expr, pose, openHands }
   */
  function draw(ctx, who, x, footY, scale, opts) {
    const o = opts || {};
    const s = state[who];
    if (!s) return null;
    const t = o.t || 0;
    const HEIGHT = who === "r3mi" ? 35.4 : 29;
    const st = {
      t: t,
      phase: s.phase,
      expr: o.expr || s.expr,
      pose: o.pose || s.pose,
      poseFrom: s.poseFrom,
      poseK: s.poseK,
      talking: !!o.talking,
      openHands: o.openHands || s.pose === "panic" || s.pose === "highfive",
      blink: ((t * 1000 + s.phase * 700) % 4200) < 120 &&
             ["neutral", "curious", "highfive"].indexOf(o.expr || s.expr) !== -1
    };

    /* contact shadow */
    ctx.save();
    ctx.globalAlpha = 0.2;
    px(ctx, x + scale * 4, footY - scale, (who === "r3mi" ? 14 : 16) * scale,
       scale, "#12060f");
    ctx.restore();

    const top = footY - HEIGHT * scale;
    return who === "r3mi"
      ? drawR3MI(ctx, x, top, scale, st)
      : drawVTGM(ctx, x, top, scale, st);
  }

  return {
    draw: draw,
    set: set,
    update: update,
    emote: emote,
    state: state,
    PAL: PAL,
    EXPRESSIONS: Object.keys(EXPR),
    POSES: Object.keys(POSES),
    size: (who) => (who === "r3mi" ? { w: 24, h: 35.4 } : { w: 28, h: 29 })
  };
})();
