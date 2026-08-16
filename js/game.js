/* =====================================================================
 * game.js — state, the render loop, and everything the player touches.
 * ===================================================================== */
"use strict";

(function () {
  const $ = (id) => document.getElementById(id);
  const SAVE_KEY = "liebe-auf-den-ersten-log/v2";

  const REDUCED = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Per-route ceilings, used to scale the meters. */
  const ROUTE_MAX = { aff: 6, log: 6 };

  /* ------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------ */
  const freshState = () => ({
    lang: (navigator.language || "de").toLowerCase().indexOf("de") === 0 ? "de" : "en",
    sound: false,
    started: false,
    node: "pro1",
    cur: null,                 /* { route, aff, log } while on a date */
    ranks: {},                 /* route -> gold | silver | bronze     */
    scores: {},                /* route -> { aff, log }               */
    result: null,              /* the route result currently on screen */
    dates: 0
  });

  let state = freshState();

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        state = Object.assign(freshState(), saved);
        if (!STORY.nodes[state.node] && !isSpecial(state.node)) state.node = "pro1";
      }
    } catch (_) { /* corrupt save: start fresh, say nothing */ }
  }

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  const t = () => STORY.ui[state.lang];
  const tr = (pair) => (pair ? pair[state.lang] : "");
  const goldRoutes = () =>
    STORY.routes.filter((r) => state.ranks[r] === "gold");

  const isSpecial = (id) =>
    id === "hub" || id === "reveal" || String(id).indexOf("END:") === 0;

  /* ------------------------------------------------------------------
   * Sound. A handful of square waves; created on first gesture only.
   * ------------------------------------------------------------------ */
  const Audio2 = (function () {
    let ac = null;
    function ctx() {
      if (!state.sound) return null;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ac) ac = new AC();
      if (ac.state === "suspended") ac.resume();
      return ac;
    }
    function tone(freq, dur, when, vol, type) {
      const a = ctx();
      if (!a) return;
      const at = a.currentTime + (when || 0);
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type || "square";
      o.frequency.setValueAtTime(freq, at);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol || 0.05, at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      o.connect(g).connect(a.destination);
      o.start(at);
      o.stop(at + dur + 0.02);
    }
    return {
      blip:   () => tone(620, 0.07, 0, 0.05),
      pick:   () => { tone(520, 0.06, 0, 0.05); tone(780, 0.09, 0.06, 0.045); },
      good:   () => [0, 0.09, 0.18, 0.3].forEach((w, i) =>
                      tone([523, 659, 784, 1047][i], 0.16, w, 0.05)),
      bad:    () => { tone(220, 0.16, 0, 0.05); tone(165, 0.24, 0.13, 0.05); },
      unlock: () => [0, 0.08, 0.16].forEach((w, i) =>
                      tone([784, 988, 1319][i], 0.14, w, 0.05)),
      lock:   () => [0, 0.12, 0.24, 0.36, 0.52].forEach((w, i) =>
                      tone([523, 659, 784, 1047, 1319][i], 0.3, w, 0.06, "triangle"))
    };
  })();

  /* ------------------------------------------------------------------
   * Canvas
   * ------------------------------------------------------------------ */
  const stage = $("stage");
  const sctx = stage.getContext("2d");
  const titleCanvas = $("titleCanvas");
  const tctx = titleCanvas.getContext("2d");
  const portrait = $("portrait");
  const pctx = portrait.getContext("2d");
  [sctx, tctx, pctx].forEach((c) => { c.imageSmoothingEnabled = false; });

  const view = { scene: "event", speaker: "bots", weather: null, shake: 0 };

  function drawPortrait(time) {
    const char = STORY.chars[view.speaker] || STORY.chars.bots;
    const def = ART.sprites[char.sprite];
    pctx.clearRect(0, 0, portrait.width, portrait.height);
    ART.rect(pctx, 0, 0, portrait.width, portrait.height, "#ffd1e0");
    /* soft ground shadow so heads are not floating in a pink void */
    ART.rect(pctx, 0, portrait.height - 10, portrait.width, 10, "#f2b6cd");
    if (!def) return;

    const scale = def.h > 16 ? 3 : 4;
    const x = Math.round((portrait.width - def.w * scale) / 2);
    const bob = Math.round(Math.sin(time * 2.2) * 1);
    const y = def.h > 16
      ? portrait.height - def.h * scale + 4 + bob
      : Math.round((portrait.height - def.h * scale) / 2) + bob;

    ART.sprite(pctx, char.sprite, x, y, {
      scale: scale,
      blink: (time * 1000) % 3600 < 130,
      talk: typing && Math.floor(time * 9) % 2 === 0
    });
  }

  let lastTs = 0;
  let clock = 0;

  function loop(ts) {
    const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0);
    lastTs = ts;
    clock += dt;
    view.shake = Math.max(0, view.shake - dt * 3.5);

    SCENES.update(dt);

    if (state.started) {
      SCENES.render(sctx, view.scene, {
        time: clock,
        speaker: view.speaker,
        weather: view.weather,
        shake: view.shake
      });
      drawPortrait(clock);
    } else {
      SCENES.render(tctx, "title", { time: clock });
      drawTitleArt(tctx, clock);
    }
    tickTypewriter(dt);
    tickGpsNoise();
    requestAnimationFrame(loop);
  }

  /* Big pixel wordmark painted over the title backdrop. */
  function drawTitleArt(ctx, time) {
    const bounce = Math.round(Math.sin(time * 1.6) * 2);
    ART.text(ctx, "LIEBE AUF DEN", 42, 30 + bounce, 2, "#2b1630");
    ART.text(ctx, "LIEBE AUF DEN", 41, 29 + bounce, 2, "#ffe9a8");
    ART.text(ctx, "ERSTEN LOG", 66, 48 + bounce, 3, "#2b1630");
    ART.text(ctx, "ERSTEN LOG", 64, 46 + bounce, 3, "#ff8ab5");
    ART.heart(ctx, 30, 44 + bounce, 3, "#ff5d9e");
    ART.heart(ctx, 268, 44 - bounce, 3, "#ff5d9e");

    ART.sprite(ctx, "petra", 74, 108, { scale: 3, blink: (time * 1000) % 3400 < 120 });
    ART.sprite(ctx, "nando", 140, 132, { scale: 2, blink: (time * 1000 + 900) % 3400 < 120 });
    ART.sprite(ctx, "mysti", 186, 108, { scale: 3, blink: (time * 1000 + 1800) % 3400 < 120 });
    ART.sprite(ctx, "t4tc", 24, 96 + Math.round(Math.sin(time * 2.4) * 2), { scale: 2 });
    ART.sprite(ctx, "dnf", 272, 100 + Math.round(Math.sin(time * 2.4 + 1.5) * 2), { scale: 2 });
  }

  /* ------------------------------------------------------------------
   * Typewriter
   * ------------------------------------------------------------------ */
  let fullText = "";
  let shown = 0;
  let typing = false;
  let onTypeDone = null;

  function say(text, done) {
    fullText = text;
    shown = REDUCED ? text.length : 0;
    typing = !REDUCED;
    onTypeDone = done || null;
    $("dialogueText").textContent = fullText.slice(0, shown);
    /* Announce the whole line once; the typewriter itself is silent to
     * assistive tech, which would otherwise hear it letter by letter. */
    $("srLive").textContent = ($("speaker").textContent || "") + ": " + fullText;
    $("skipBtn").hidden = !typing;
    if (!typing && onTypeDone) { const f = onTypeDone; onTypeDone = null; f(); }
  }

  function tickTypewriter(dt) {
    if (!typing) return;
    shown = Math.min(fullText.length, shown + dt * 62);
    $("dialogueText").textContent = fullText.slice(0, Math.floor(shown));
    if (shown >= fullText.length) finishTyping();
  }

  function finishTyping() {
    typing = false;
    shown = fullText.length;
    $("dialogueText").textContent = fullText;
    $("skipBtn").hidden = true;
    if (onTypeDone) { const f = onTypeDone; onTypeDone = null; f(); }
  }

  /* ------------------------------------------------------------------
   * Choice helpers
   * ------------------------------------------------------------------ */
  function clearChoices() { $("choices").replaceChildren(); }

  function addChoice(label, sub, onClick, opts) {
    const box = $("choices");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice" + (opts && opts.className ? " " + opts.className : "");
    const key = document.createElement("span");
    key.className = "key";
    key.textContent = opts && opts.key != null ? opts.key : box.children.length + 1;
    const body = document.createElement("span");
    body.appendChild(document.createTextNode(label));
    if (sub) {
      const s = document.createElement("span");
      s.className = "sub";
      s.textContent = sub;
      body.appendChild(s);
    }
    b.append(key, body);
    b.addEventListener("click", () => { Audio2.pick(); onClick(); });
    box.appendChild(b);
    return b;
  }

  /* ------------------------------------------------------------------
   * Navigation
   * ------------------------------------------------------------------ */
  function goto(id) {
    state.node = id;
    save();
    render();
  }

  function startRoute(route) {
    state.cur = { route: route, aff: 0, log: 0 };
    goto(STORY.entry[route]);
  }

  function rankOf(aff, log) {
    if (aff >= STORY.GOLD.aff && log >= STORY.GOLD.log) return "gold";
    if (aff >= STORY.SILVER.aff) return "silver";
    return "bronze";
  }

  /**
   * Score a finished date. This runs exactly once, on the transition —
   * never from render(), so switching language on the results screen
   * cannot quietly award a second date.
   */
  function finishRoute(route) {
    const score = state.cur && state.cur.route === route
      ? { aff: state.cur.aff, log: state.cur.log }
      : (state.scores[route] || { aff: 0, log: 0 });
    const rank = rankOf(score.aff, score.log);

    /* Keep the best attempt: a bad redo never takes GOLD away. */
    const prev = state.scores[route];
    if (!prev || score.aff + score.log > prev.aff + prev.log) {
      state.scores[route] = score;
    }
    if (state.ranks[route] !== "gold") state.ranks[route] = rank;

    state.dates += 1;
    state.cur = null;
    state.result = { route: route, rank: rank, aff: score.aff, log: score.log };

    if (rank === "gold") { SCENES.burstHearts(200, 92, 18); Audio2.unlock(); }
    else Audio2.bad();

    goto("END:" + route);
  }

  function applyChoice(c, node) {
    if (state.cur) {
      state.cur.aff += c.aff || 0;
      state.cur.log += c.log || 0;
    }
    const anchor = SCENES.STAGE[node.scene];
    const px = anchor && anchor.date ? anchor.date[1] : 160;
    if (c.fx === "hearts") { SCENES.burstHearts(px, 96, 10); Audio2.good(); }
    else if (c.fx === "sparks") { SCENES.burstSparks(px, 104, 14); Audio2.blip(); }
    else if (c.fx === "thorns") { SCENES.burstThorns(px, 120); Audio2.bad(); }
    if ((c.aff || 0) < 0) Audio2.bad();
    goto(c.to);
  }

  /* ------------------------------------------------------------------
   * Render: one function, driven entirely by state
   * ------------------------------------------------------------------ */
  /* Result cards live outside #choices, so they need their own sweep. */
  function clearCards() {
    document.querySelectorAll(".dialogue .result-card")
      .forEach((el) => el.remove());
  }

  function render() {
    clearCards();
    applyStaticText();

    const id = state.node;
    if (id === "hub") return renderHub();
    if (id === "reveal") return renderReveal();
    if (String(id).indexOf("END:") === 0) return renderRouteEnd(id.slice(4));

    const node = STORY.nodes[id];
    if (!node) return renderHub();
    renderDialogue(node);
  }

  function setScene(node) {
    view.scene = node.scene || view.scene;
    view.speaker = node.who || "bots";
    view.weather = node.weather || null;
    if (node.fx === "shake") view.shake = 1;
    if (node.fx === "hearts") SCENES.burstHearts(160, 90, 12);
    if (node.fx === "sparks") SCENES.burstSparks(160, 100, 16);
    if (node.fx === "thorns") SCENES.burstThorns(200, 118);
  }

  function renderDialogue(node) {
    setScene(node);
    $("speaker").textContent = tr(STORY.chars[node.who] && STORY.chars[node.who].name);
    clearChoices();
    updateChip(node.route);
    updateMeters();

    say(tr(node.text), () => {
      clearChoices();
      if (node.choices) {
        node.choices.forEach((c) => addChoice(tr(c.t), null, () => applyChoice(c, node)));
      } else if (node.end) {
        addChoice(t().continue, null, () => finishRoute(node.end), { key: "▸" });
      } else if (node.next) {
        addChoice(t().continue, null, () => goto(node.next), { key: "▸" });
      }
      $("hint").textContent = t().hint;
    });
  }

  /* ------------------------------- hub ------------------------------ */
  function renderHub() {
    state.cur = null;
    view.scene = "event";
    view.speaker = "bots";
    view.weather = null;
    updateChip(null);
    updateMeters();

    $("speaker").textContent = tr(STORY.chars.bots.name);
    clearChoices();
    say(t().hub + " " + t().hubSub, () => {
      clearChoices();
      STORY.routes.forEach((r) => {
        const rank = state.ranks[r];
        const meta = STORY.routeMeta[r];
        const statusText = rank === "gold" ? t().statusGold
          : rank === "silver" ? t().statusSilver
          : rank === "bronze" ? t().statusBronze
          : t().statusOpen;
        addChoice(
          tr(STORY.chars[r].name) + (rank === "gold" ? "  ★" : ""),
          tr(meta.tagline) + " · " + meta.dt + " · " + statusText,
          () => startRoute(r),
          { className: rank === "gold" ? "route-done" : "" }
        );
      });
      if (GEO.complete(goldRoutes())) {
        addChoice(t().goFinal, null, () => goto("fin1"), { key: "★" });
      }
      $("hint").textContent = t().hint;
    });
    save();
  }

  /* --------------------------- route result ------------------------- */
  function renderRouteEnd(route) {
    const result = state.result && state.result.route === route
      ? state.result
      : { route: route, rank: state.ranks[route] || "bronze", aff: 0, log: 0 };
    const rank = result.rank;

    view.scene = STORY.routeMeta[route].scene;
    view.speaker = route;
    view.weather = null;
    updateChip(route);
    updateMeters({ aff: result.aff, log: result.log });

    $("speaker").textContent = tr(STORY.chars[route].name);
    clearChoices();

    say(tr(STORY.rankTexts[route][rank]), () => {
      clearChoices();
      renderResultCard(route, rank);
      addChoice(t().backToHub, null, () => goto("hub"), { key: "◂" });
      if (rank !== "gold") {
        addChoice(t().replay, null, () => startRoute(route), { key: "↻" });
      }
      $("hint").textContent = t().hint;
      updateGps();
    });
  }

  function renderResultCard(route, rank) {
    const card = document.createElement("div");
    card.className = "result-card";

    const h = document.createElement("h3");
    h.textContent = t().rank;
    card.appendChild(h);

    const badge = document.createElement("div");
    badge.className = "rank " + rank;
    badge.textContent = rank === "gold" ? t().statusGold
      : rank === "silver" ? t().statusSilver : t().statusBronze;
    card.appendChild(badge);

    const label = document.createElement("h3");
    label.textContent = rank === "gold" ? t().shardWon : t().shardLost;
    card.appendChild(label);

    const row = document.createElement("div");
    row.className = "shard-row";
    GEO.shardFor(route, goldRoutes()).forEach((slot, i) => {
      const d = document.createElement("span");
      d.className = "shard" + (slot.value == null ? " blank" : "");
      d.style.animationDelay = (i * 0.09) + "s";
      d.textContent = slot.value == null ? "–" : slot.value;
      const s = document.createElement("small");
      s.textContent = slot.label;
      d.appendChild(s);
      row.appendChild(d);
    });
    card.appendChild(row);

    $("choices").parentNode.insertBefore(card, $("choices"));
  }

  /* ------------------------------ reveal ---------------------------- */
  function renderReveal() {
    view.scene = "finale";
    view.speaker = "bots";
    view.weather = null;
    updateChip(null);
    updateMeters();

    const digits = GEO.digits(goldRoutes());
    if (!digits) return renderHub();   /* can't happen; costs nothing */
    const coords = GEO.format(digits);

    $("speaker").textContent = tr(STORY.chars.bots.name);
    clearChoices();
    Audio2.lock();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => SCENES.burstHearts(60 + i * 40, 80, 8), i * 160);
    }

    say(coords.pretty, () => {
      clearChoices();

      const card = document.createElement("div");
      card.className = "result-card";

      const h = document.createElement("h3");
      h.textContent = t().endingTitle + " · " + GEO.config.gcCode;
      card.appendChild(h);

      const row = document.createElement("div");
      row.className = "shard-row";
      String(digits).split("").forEach((d, i) => {
        const el = document.createElement("span");
        el.className = "shard";
        el.style.animationDelay = (i * 0.07) + "s";
        el.textContent = d;
        const s = document.createElement("small");
        s.textContent = GEO.DIGIT_LABELS[i];
        el.appendChild(s);
        row.appendChild(el);
      });
      card.appendChild(row);

      const log = document.createElement("div");
      log.className = "logbox";
      log.textContent = buildLog();
      card.appendChild(log);
      $("choices").parentNode.insertBefore(card, $("choices"));

      addChoice(t().copyLog, null, () => copy(buildLog(), null), { key: "⎘" });
      addChoice(t().newGame, null, () => {
        if (confirm(t().confirm)) hardReset();
      }, { key: "↻" });
      $("hint").textContent = t().hint;
      updateGps();
    });
  }

  function buildLog() {
    const totals = STORY.routes.reduce((acc, r) => {
      const s = state.scores[r] || { aff: 0, log: 0 };
      acc.aff += s.aff; acc.log += s.log;
      return acc;
    }, { aff: 0, log: 0 });
    return STORY.logTemplate[state.lang]
      .join("\n")
      .replace("{dates}", String(state.dates))
      .replace("{aff}", String(totals.aff))
      .replace("{log}", String(totals.log));
  }

  /* ------------------------------------------------------------------
   * HUD, chip, GPS panel
   * ------------------------------------------------------------------ */
  function updateChip(route) {
    const chip = $("routeChip");
    if (!route) { chip.hidden = true; return; }
    const meta = STORY.routeMeta[route];
    chip.hidden = false;
    chip.textContent = tr(STORY.chars[route].name) + " · " + meta.dt;
  }

  function updateMeters(override) {
    let aff, log, maxA, maxL;
    const src = override || state.cur;
    if (src) {
      aff = src.aff; log = src.log;
      maxA = ROUTE_MAX.aff; maxL = ROUTE_MAX.log;
    } else {
      const totals = STORY.routes.reduce((acc, r) => {
        const s = state.scores[r] || { aff: 0, log: 0 };
        acc.aff += s.aff; acc.log += s.log;
        return acc;
      }, { aff: 0, log: 0 });
      aff = totals.aff; log = totals.log;
      maxA = ROUTE_MAX.aff * 3; maxL = ROUTE_MAX.log * 3;
    }
    const pct = (v, m) => Math.max(0, Math.min(100, (v / m) * 100));
    $("affVal").textContent = String(aff);
    $("logVal").textContent = String(log);
    $("affBar").style.width = pct(aff, maxA) + "%";
    $("logBar").style.width = pct(log, maxL) + "%";
  }

  let gpsNoiseAt = 0;
  const lockedSlots = [];

  function tickGpsNoise() {
    if (REDUCED || !lockedSlots.length) return;
    const now = performance.now();
    if (now - gpsNoiseAt < 110) return;
    gpsNoiseAt = now;
    lockedSlots.forEach((el) => {
      el.textContent = String(Math.floor(Math.random() * 10));
    });
  }

  function slotEl(slot, animate) {
    const el = document.createElement("span");
    el.className = "slot" + (slot.value == null ? " locked" : "");
    if (slot.value != null) {
      el.textContent = slot.value;
      if (animate) el.classList.add("reveal");
    } else {
      el.textContent = "0";
      lockedSlots.push(el);
    }
    return el;
  }

  function sepEl(ch) {
    const el = document.createElement("span");
    el.className = "slot sep";
    el.textContent = ch;
    return el;
  }

  let previouslyUnlocked = 0;

  function updateGps() {
    const gold = goldRoutes();
    const slots = GEO.slots(gold);
    const cfg = GEO.config;
    lockedSlots.length = 0;

    const unlockedCount = slots.filter((s) => s.value != null).length;
    const animate = unlockedCount > previouslyUnlocked;
    previouslyUnlocked = unlockedCount;

    const pad = (n, w) => String(n).padStart(w, "0");
    $("latFix").textContent = cfg.latHem + " " + pad(cfg.latDeg, 2) + "°";
    $("lonFix").textContent = cfg.lonHem + " " + pad(cfg.lonDeg, 3) + "°";

    const lat = $("latSlots");
    const lon = $("lonSlots");
    lat.replaceChildren();
    lon.replaceChildren();
    [0, 1].forEach((i) => lat.appendChild(slotEl(slots[i], animate)));
    lat.appendChild(sepEl("."));
    [2, 3, 4].forEach((i) => lat.appendChild(slotEl(slots[i], animate)));
    [5, 6].forEach((i) => lon.appendChild(slotEl(slots[i], animate)));
    lon.appendChild(sepEl("."));
    [7, 8, 9].forEach((i) => lon.appendChild(slotEl(slots[i], animate)));

    /* satellite bars */
    const sats = $("gpsSats");
    sats.replaceChildren();
    const lit = gold.length * 3 + (GEO.complete(gold) ? 3 : 0);
    for (let i = 0; i < 9; i++) {
      const bar = document.createElement("i");
      if (i < lit) { bar.className = "on"; bar.style.height = (4 + i) + "px"; }
      else bar.style.animationDelay = (i * 0.12) + "s";
      sats.appendChild(bar);
    }

    const done = GEO.complete(gold);
    $("gpsStatus").textContent = done ? t().gpsLocked : t().gpsSearching;
    $("postedValue").textContent = cfg.postedCoords;
    $("checksumValue").textContent = done ? String(GEO.checksum(GEO.digits(gold))) : "—";

    if (cfg.distanceFromPostedMeters > 0) {
      $("distanceRow").hidden = false;
      $("distanceValue").textContent =
        (cfg.distanceFromPostedMeters / 1000).toFixed(2) + " km";
    }

    /* route ledger */
    const list = $("gpsRoutes");
    list.replaceChildren();
    STORY.routes.forEach((r) => {
      const li = document.createElement("li");
      const isGold = state.ranks[r] === "gold";
      if (isGold) li.className = "gold";
      const pip = document.createElement("span");
      pip.className = "pip";
      const name = document.createElement("span");
      name.textContent = tr(STORY.chars[r].name);
      const st = document.createElement("span");
      st.className = "state";
      st.textContent = isGold
        ? GEO.SHARDS[r].map((i) => GEO.DIGIT_LABELS[i]).join("")
        : t().statusOpen;
      li.append(pip, name, st);
      list.appendChild(li);
    });

    const coords = done ? GEO.format(GEO.digits(gold)) : null;
    $("btnCopy").disabled = !done;
    $("btnMap").disabled = !done;
    $("btnCopy").onclick = () => coords && copy(coords.pretty, $("btnCopy"));
    $("btnMap").onclick = () => {
      if (!coords) return;
      window.open(GEO.links(GEO.digits(gold)).maps, "_blank", "noopener");
    };

    if (cfg.checkerUrl) {
      $("btnChecker").hidden = false;
      $("btnChecker").onclick = () =>
        window.open(cfg.checkerUrl, "_blank", "noopener");
    }

    if (cfg.hintRot13) {
      $("hintBox").hidden = false;
      $("hintValue").textContent = GEO.rot13(cfg.hintRot13);
    }
  }

  function copy(text, btn) {
    const done = () => {
      if (!btn) return;
      const old = btn.textContent;
      btn.textContent = t().copied;
      setTimeout(() => { btn.textContent = old; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallback(text, done));
    } else fallback(text, done);
  }

  function fallback(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (_) {}
    document.body.removeChild(ta);
  }

  /* ------------------------------------------------------------------
   * Static interface text (runs on every render and on language change)
   * ------------------------------------------------------------------ */
  function applyStaticText() {
    const s = t();
    document.documentElement.lang = state.lang;
    $("uiSubtitle").textContent = s.subtitle;
    $("affLabel").textContent = s.affection;
    $("logLabel").textContent = s.logQuality;
    $("langBtn").textContent = s.lang;
    $("btnTitleLang").textContent = s.lang;
    $("soundBtn").textContent = "♪ " + (state.sound ? s.on : s.off);
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    $("restartBtn").textContent = s.restart;
    $("restartBtn").title = s.newGame;
    $("saveNote").textContent = s.saved;
    $("offlineNote").textContent = s.offlineReady;
    $("disclaimer").textContent = s.disclaimer;
    $("skipBtn").textContent = s.skip;

    $("gpsTitle").textContent = s.gpsTitle;
    $("gpsSub").textContent = s.gpsSubtitle;
    $("postedLabel").textContent = s.posted;
    $("checksumLabel").textContent = s.checksum;
    $("distanceLabel").textContent = s.distance;
    $("btnCopy").textContent = s.copy;
    $("btnMap").textContent = s.openMap;
    $("btnChecker").textContent = s.checker;
    $("hintLabel").textContent = s.hintLabel;

    $("titleSub").textContent = s.subtitle;
    $("titleNote").textContent = s.disclaimer;
    $("btnContinue").textContent = s.resume;

    /* With a save on disk, Continue takes the lead and Start becomes
     * the quieter "begin again" option. */
    const resumable = hasSave() && state.started;
    $("btnContinue").hidden = !resumable;
    $("btnStart").textContent = resumable ? s.newGame : s.start;
    $("btnStart").classList.toggle("primary", !resumable);

    updateGps();
  }

  /* ------------------------------------------------------------------
   * Wiring
   * ------------------------------------------------------------------ */
  function beginGame(fresh) {
    if (fresh) {
      const lang = state.lang, sound = state.sound;
      state = freshState();
      state.lang = lang;
      state.sound = sound;
    }
    state.started = true;
    save();
    $("titleScreen").hidden = true;
    $("app").hidden = false;
    SCENES.clearParticles();
    render();
  }

  function hardReset() {
    const lang = state.lang, sound = state.sound;
    try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
    state = freshState();
    state.lang = lang;
    state.sound = sound;
    previouslyUnlocked = 0;
    SCENES.clearParticles();
    beginGame(false);
  }

  function toggleLang() {
    state.lang = state.lang === "de" ? "en" : "de";
    save();
    if (state.started) {
      /* Re-render the current beat in the new language. */
      render();
    } else {
      applyStaticText();
    }
  }

  $("btnStart").addEventListener("click", () => { Audio2.pick(); beginGame(true); });
  $("btnContinue").addEventListener("click", () => { Audio2.pick(); beginGame(false); });
  $("btnTitleLang").addEventListener("click", toggleLang);
  $("langBtn").addEventListener("click", toggleLang);
  $("restartBtn").addEventListener("click", () => {
    if (confirm(t().confirm)) hardReset();
  });
  $("soundBtn").addEventListener("click", () => {
    state.sound = !state.sound;
    save();
    applyStaticText();
    if (state.sound) Audio2.blip();
  });
  $("skipBtn").addEventListener("click", finishTyping);
  $("dialogueText").addEventListener("click", () => { if (typing) finishTyping(); });

  document.addEventListener("keydown", (e) => {
    if (!state.started) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        beginGame(!hasSave());
      }
      return;
    }
    if (typing && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      finishTyping();
      return;
    }
    if (e.key >= "1" && e.key <= "9") {
      const b = $("choices").children[Number(e.key) - 1];
      if (b) b.click();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const kids = $("choices").children;
      if (kids.length === 1) kids[0].click();
    }
  });

  function hasSave() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch (_) { return false; }
  }

  /* ------------------------------------------------------------------ */
  load();
  applyStaticText();
  requestAnimationFrame(loop);

  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
