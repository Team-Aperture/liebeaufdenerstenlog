/* =====================================================================
 * game.js — state, the render loop, and everything the player touches.
 * ===================================================================== */
"use strict";

(function () {
  const $ = (id) => document.getElementById(id);
  const SAVE_KEY = "liebe-auf-den-ersten-log/v3";

  const REDUCED = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Which track plays over which backdrop. */
  const TRACK_FOR = {
    title: "title", event: "hub", forest: "petra",
    city: "nando", ruins: "mysti", finale: "final"
  };

  /* ------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------ */
  const freshState = () => ({
    lang: (navigator.language || "de").toLowerCase().indexOf("de") === 0 ? "de" : "en",
    sound: false,
    started: false,
    node: "pro1",
    cur: null,                 /* { route, aff, log } during an assessment */
    ranks: {},                 /* route -> gold | silver | bronze          */
    scores: {},                /* route -> { aff, log }                    */
    result: null,              /* the assessment record currently on screen */
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
  const goldRoutes = () => STORY.routes.filter((r) => state.ranks[r] === "gold");

  const isSpecial = (id) =>
    id === "hub" || id === "reveal" || String(id).indexOf("END:") === 0;

  const sfx = (name, arg) => AUDIO.play(name, arg);

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

  const view = { scene: "event", speaker: "units", weather: null, shake: 0 };

  /* Title screen phases: the facility boots, the badge assembles, then
   * the menu appears. Clicking anywhere skips ahead.
   *
   * `showingTitle` tracks the overlay itself. It deliberately does NOT
   * key off state.started: loading a save sets that flag true, and the
   * loop would then paint the hidden game canvas while the title screen
   * sat in front of it, unpainted and with its menu never revealed. */
  let showingTitle = true;
  let titlePhase = "boot";
  let titleClock = 0;

  function skipTitleIntro() {
    if (titlePhase === "ready") return;
    titlePhase = "ready";
    titleClock = 3;
    $("titleScreen").classList.add("ready");
  }

  /* ------------------------------------------------------------------
   * Portraits
   * ------------------------------------------------------------------ */
  function drawPortrait(time) {
    const char = STORY.chars[view.speaker] || STORY.chars.units;
    pctx.clearRect(0, 0, portrait.width, portrait.height);

    const bg = char.host
      ? (char.host === "r3mi" ? "#123021" : "#33161a")
      : (char.system ? "#122435" : "#ffd1e0");
    ART.rect(pctx, 0, 0, portrait.width, portrait.height, bg);
    ART.rect(pctx, 0, portrait.height - 10, portrait.width, 10,
             char.host ? "#0b1c14" : (char.system ? "#0d1a26" : "#f2b6cd"));

    if (char.host) {
      const w = HOSTS.size(char.host).w * 2;
      HOSTS.draw(pctx, char.host, Math.round((portrait.width - w) / 2) + 2,
                 portrait.height - 2, 2, { t: time, talking: typing });
      return;
    }

    if (char.system) {
      /* the facility itself: a slowly sweeping calibration dial */
      const cx = portrait.width / 2, cy = portrait.height / 2;
      for (let a = 0; a < 360; a += 6) {
        const r = a * Math.PI / 180;
        ART.rect(pctx, cx + Math.cos(r) * 15, cy + Math.sin(r) * 15, 1, 1, "#2a5a80");
      }
      const ang = -Math.PI / 2 + Math.sin(time * 1.1) * 0.9;
      for (let i = 0; i < 13; i++) {
        ART.rect(pctx, cx + Math.cos(ang) * i, cy + Math.sin(ang) * i, 1, 1, "#69d6ff");
      }
      ART.rect(pctx, cx - 2, cy - 2, 4, 4, "#9ae8ff");
      return;
    }

    const def = ART.sprites[char.sprite];
    if (!def) return;
    const scale = 3;
    const x = Math.round((portrait.width - def.w * scale) / 2);
    const bob = Math.round(Math.sin(time * 2.2) * 1);
    ART.sprite(pctx, char.sprite, x, portrait.height - def.h * scale + 4 + bob, {
      scale: scale,
      blink: (time * 1000) % 3600 < 130,
      talk: typing && Math.floor(time * 9) % 2 === 0
    });
  }

  /* ------------------------------------------------------------------
   * Loop
   * ------------------------------------------------------------------ */
  let lastTs = 0;
  let clock = 0;

  function loop(ts) {
    const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0);
    lastTs = ts;
    clock += dt;
    view.shake = Math.max(0, view.shake - dt * 3.5);

    SCENES.update(dt);

    if (showingTitle) {
      titleClock += dt;
      renderTitle();
    } else {
      SCENES.render(sctx, view.scene, {
        time: clock,
        speaker: view.speaker,
        weather: view.weather,
        shake: view.shake
      });
      drawPortrait(clock);
    }
    tickTypewriter(dt);
    tickGpsNoise();
    requestAnimationFrame(loop);
  }

  function renderTitle() {
    const ui = t();
    if (titlePhase === "boot") {
      const done = LOGO.boot(tctx, ui.bootLines, titleClock);
      if (done) { titlePhase = "logo"; titleClock = 0; sfx("boot"); }
      return;
    }

    /* backdrop for the badge */
    SCENES.render(tctx, "title", { time: clock });
    const p = titlePhase === "logo" ? Math.min(1, titleClock / 1.1) : 1;
    LOGO.draw(tctx, ART.VIEW_W / 2, 46, clock, p, ui);

    /* the cast lines up under the plate */
    const reveal = titlePhase === "logo" ? Math.max(0, (titleClock - 0.7) / 0.8) : 1;
    if (reveal > 0) {
      tctx.save();
      tctx.globalAlpha = Math.min(1, reveal);
      const lift = Math.round((1 - Math.min(1, reveal)) * 14);
      ART.sprite(tctx, "petra", 92, 100 + lift, { scale: 3, blink: (clock * 1000) % 3400 < 120 });
      ART.sprite(tctx, "nando", 146, 124 + lift, { scale: 2, blink: (clock * 1000 + 900) % 3400 < 120 });
      ART.sprite(tctx, "mysti", 184, 100 + lift, { scale: 3, blink: (clock * 1000 + 1800) % 3400 < 120 });
      HOSTS.draw(tctx, "r3mi", 24, 180 + lift, 2, { t: clock });
      HOSTS.draw(tctx, "vtgm", 248, 182 + lift, 2, { t: clock });
      tctx.restore();
    }

    if (titlePhase === "logo" && titleClock > 1.5) {
      titlePhase = "ready";
      $("titleScreen").classList.add("ready");
    }
  }

  /* ------------------------------------------------------------------
   * Typewriter
   * ------------------------------------------------------------------ */
  let fullText = "";
  let shown = 0;
  let typing = false;
  let onTypeDone = null;
  let lastTick = 0;

  function say(text, sub, done) {
    fullText = text;
    shown = REDUCED ? text.length : 0;
    typing = !REDUCED;
    onTypeDone = done || null;
    lastTick = 0;
    $("dialogueText").textContent = fullText.slice(0, shown);
    $("dialogueSub").textContent = sub || "";
    $("dialogueSub").hidden = !sub;
    $("srLive").textContent =
      ($("speaker").textContent || "") + ": " + fullText + (sub ? " — " + sub : "");
    $("skipBtn").hidden = !typing;
    if (!typing && onTypeDone) { const f = onTypeDone; onTypeDone = null; f(); }
  }

  function tickTypewriter(dt) {
    if (!typing) return;
    const before = Math.floor(shown);
    shown = Math.min(fullText.length, shown + dt * 62);
    const now = Math.floor(shown);
    if (now !== before) {
      $("dialogueText").textContent = fullText.slice(0, now);
      lastTick += now - before;
      if (lastTick >= 3) { lastTick = 0; sfx("type"); }
    }
    if (shown >= fullText.length) finishTyping();
  }

  function finishTyping() {
    if (!typing) return;
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
    b.addEventListener("mouseenter", () => sfx("blip"));
    b.addEventListener("click", () => { sfx("select"); onClick(); });
    box.appendChild(b);
    return b;
  }

  /* ------------------------------------------------------------------
   * Answer order
   *
   * Authored first, correct first — which made "always pick the top
   * option" a winning strategy. Each beat's answers are shuffled by a
   * hash of its node id instead: scattered across A/B/C/D, but stable,
   * so every player sees the same order every time and a hint that says
   * "it was C" stays true.
   * ------------------------------------------------------------------ */
  /* Chosen by searching salts for the flattest spread of correct answers
   * across the options, with no two consecutive quizzes sharing a letter.
   * Quiz answers land A/B/C/D = 1/2/2/2; best answers on the three-option
   * beats land A/B/C = 3/4/4. */
  const SHUFFLE_SALT = "sektor12-43/";

  function hash32(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  function orderedChoices(nodeId, choices) {
    if (!choices || choices.length < 2) return choices || [];
    const arr = choices.slice();
    let seed = hash32(SHUFFLE_SALT + nodeId) || 1;
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const j = seed % (i + 1);
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
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
    SCENES.enter(route);
    SCENES.enter("you");
    goto(STORY.entry[route]);
  }

  function rankOf(aff, log) {
    if (aff >= STORY.GOLD.aff && log >= STORY.GOLD.log) return "gold";
    if (aff >= STORY.SILVER.aff) return "silver";
    return "bronze";
  }

  /**
   * Score a finished assessment. This runs exactly once, on the
   * transition — never from render(), so switching language on the
   * results screen cannot quietly award a second attempt.
   */
  function finishRoute(route) {
    const score = state.cur && state.cur.route === route
      ? { aff: state.cur.aff, log: state.cur.log }
      : (state.scores[route] || { aff: 0, log: 0 });
    const rank = rankOf(score.aff, score.log);

    /* Keep the best attempt: a bad retake never takes a pass away. */
    const prev = state.scores[route];
    if (!prev || score.aff + score.log > prev.aff + prev.log) {
      state.scores[route] = score;
    }
    if (state.ranks[route] !== "gold") state.ranks[route] = rank;

    state.dates += 1;
    state.cur = null;
    state.result = { route: route, rank: rank, aff: score.aff, log: score.log };

    if (rank === "gold") {
      SCENES.burstHearts(190, 92, 22);
      SCENES.flash("#ffe9a8", 0.35);
      sfx("unlock");
    } else {
      sfx("deny");
    }

    goto("END:" + route);
  }

  function applyChoice(c, node) {
    if (state.cur) {
      /* Floors at zero: a disastrous answer costs you the pass, but the
       * record should not read "-5 affection". */
      state.cur.aff = Math.max(0, state.cur.aff + (c.aff || 0));
      state.cur.log = Math.max(0, state.cur.log + (c.log || 0));
    }
    const anchor = SCENES.STAGE[node.scene];
    const px = anchor && anchor.date ? anchor.date[1] : 160;
    const subject = state.cur && state.cur.route;
    if (c.fx === "hearts") { SCENES.burstHearts(px, 96, 12); sfx("heart"); }
    else if (c.fx === "sparks") { SCENES.burstSparks(px, 104, 16); sfx("ping", 2); }
    else if (c.fx === "thorns") { SCENES.burstThorns(px, 120); sfx("thud"); }
    if (subject) SCENES.react(subject, (c.aff || 0) < 0 ? "recoil" : "hop");
    if ((c.aff || 0) > 0) SCENES.react("you", "hop");
    if ((c.aff || 0) < 0) sfx("deny");
    if (node.quiz) {
      SCENES.showEmote(c.right ? "r3mi" : "vtgm", c.right ? "sparkle" : "anger");
      if (!c.right) SCENES.flash("#c0322c", 0.28);
    }
    goto(c.to);
  }

  /* ------------------------------------------------------------------
   * Render: one function, driven entirely by state
   * ------------------------------------------------------------------ */
  function clearCards() {
    document.querySelectorAll(".dialogue .result-card").forEach((el) => el.remove());
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

  /** Swap backdrop, weather, unit moods and music for a beat. */
  function setScene(node) {
    const next = node.scene || view.scene;
    if (next !== view.scene) {
      const from = view.scene;
      if (REDUCED) view.scene = next;
      else SCENES.beginTransition(() => { view.scene = next; });
      if (TRACK_FOR[next] !== TRACK_FOR[from]) AUDIO.music(TRACK_FOR[next]);
    }
    view.speaker = node.who || "units";
    view.weather = node.weather || null;

    const moods = { r3mi: node.r3mi, vtgm: node.vtgm };
    for (const who of ["r3mi", "vtgm"]) {
      if (!moods[who]) continue;
      const [expr, pose] = String(moods[who]).split("/");
      HOSTS.set(who, expr, pose);
    }

    if (node.emote) SCENES.showEmote(node.emote.who, node.emote.kind);
    if (node.fx === "shake") { view.shake = 1; sfx("thud"); }
    if (node.fx === "hearts") { SCENES.burstHearts(160, 90, 14); sfx("heart"); }
    if (node.fx === "sparks") { SCENES.burstSparks(160, 100, 18); sfx("ping", 1); }
    if (node.fx === "thorns") { SCENES.burstThorns(190, 118); sfx("thud"); }
    if (node.fx === "glitch") { SCENES.flash("#69d6ff", 0.4); sfx("error"); }
    if (node.weather === "rain") sfx("rain");
    if (node.weather === "muggle") sfx("alert");
  }

  /**
   * R-3MI speaks German and V-TGM speaks English, always. Whichever the
   * player is not reading in becomes a subtitle under the line.
   */
  function linesFor(node, char) {
    if (char && char.nativeLang) {
      return {
        spoken: node.text[char.nativeLang],
        sub: char.nativeLang === state.lang ? null : node.text[state.lang]
      };
    }
    return { spoken: tr(node.text), sub: null };
  }

  function renderDialogue(node) {
    setScene(node);
    const char = STORY.chars[node.who];
    $("speaker").textContent = tr(char && char.name);
    $("speaker").style.color = (char && char.tint) || "";
    clearChoices();
    updateChip(node.route);
    updateMeters();

    const L = linesFor(node, char);
    say(L.spoken, L.sub, () => {
      clearChoices();
      if (node.choices) {
        orderedChoices(state.node, node.choices)
          .forEach((c) => addChoice(tr(c.t), null, () => applyChoice(c, node)));
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
    setScene({ scene: "event", who: "units", r3mi: "happy/present", vtgm: "neutral/idle" });
    updateChip(null);
    updateMeters();

    $("speaker").textContent = tr(STORY.chars.units.name);
    $("speaker").style.color = STORY.chars.units.tint;
    clearChoices();
    say(t().hub + " " + t().hubSub, null, () => {
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
          tr(meta.spec) + " · " + tr(meta.tagline) + " · " + meta.dt + " · " + statusText,
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
    const comment = STORY.rankComment[rank];

    setScene({
      scene: STORY.routeMeta[route].scene, who: route,
      r3mi: comment.expr, vtgm: comment.vexpr
    });
    updateChip(route);
    updateMeters({ aff: result.aff, log: result.log });

    $("speaker").textContent = tr(STORY.chars[route].name);
    $("speaker").style.color = STORY.chars[route].tint;
    clearChoices();

    say(tr(STORY.rankTexts[route][rank]), null, () => {
      clearChoices();
      renderResultCard(route, rank, comment, result);
      addChoice(t().backToHub, null, () => goto("hub"), { key: "◂" });
      if (rank !== "gold") {
        addChoice(t().replay, null, () => startRoute(route), { key: "↻" });
      }
      $("hint").textContent = t().hint;
      updateGps();
    });
  }

  function renderResultCard(route, rank, comment, result) {
    const card = document.createElement("div");
    card.className = "result-card";

    const h = document.createElement("h3");
    h.textContent = t().rank + " · " + tr(STORY.routeMeta[route].spec);
    card.appendChild(h);

    const badge = document.createElement("div");
    badge.className = "rank " + rank;
    badge.textContent = rank === "gold" ? t().statusGold
      : rank === "silver" ? t().statusSilver : t().statusBronze;
    card.appendChild(badge);

    /* the score, against what a perfect run would have been */
    const bar = document.createElement("p");
    bar.className = "score-line";
    bar.textContent =
      t().affection + " " + result.aff + "/" + STORY.ROUTE_MAX.aff +
      "  ·  " + t().logQuality + " " + result.log + "/" + STORY.ROUTE_MAX.log +
      "  ·  " + t().statusGold.replace(/^★ /, "") .split(" —")[0] +
      " ≥ " + STORY.GOLD.aff + " / " + STORY.GOLD.log;
    card.appendChild(bar);

    const quip = document.createElement("p");
    quip.className = "unit-quip";
    quip.textContent = comment.r3mi.de;
    if (state.lang === "en") {
      const s = document.createElement("span");
      s.className = "unit-quip-sub";
      s.textContent = comment.r3mi.en;
      quip.appendChild(s);
    }
    card.appendChild(quip);

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
    setScene({ scene: "finale", who: "units", r3mi: "proud/cheer", vtgm: "happy/highfive" });
    updateChip(null);
    updateMeters();

    const digits = GEO.digits(goldRoutes());
    if (!digits) return renderHub();
    const coords = GEO.format(digits);

    $("speaker").textContent = tr(STORY.chars.units.name);
    $("speaker").style.color = STORY.chars.units.tint;
    clearChoices();
    sfx("lock");
    SCENES.confetti(70);
    SCENES.flash("#ffffff", 0.5);
    for (let i = 0; i < 6; i++) {
      setTimeout(() => SCENES.burstHearts(40 + i * 46, 80, 8), i * 170);
    }

    say(coords.pretty, null, () => {
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
    chip.textContent = tr(meta.spec) + " · " + tr(STORY.chars[route].name) + " · " + meta.dt;
  }

  function updateMeters(override) {
    let aff, log, maxA, maxL;
    const src = override || state.cur;
    if (src) {
      aff = src.aff; log = src.log;
      maxA = STORY.ROUTE_MAX.aff; maxL = STORY.ROUTE_MAX.log;
    } else {
      const totals = STORY.routes.reduce((acc, r) => {
        const s = state.scores[r] || { aff: 0, log: 0 };
        acc.aff += s.aff; acc.log += s.log;
        return acc;
      }, { aff: 0, log: 0 });
      aff = totals.aff; log = totals.log;
      maxA = STORY.ROUTE_MAX.aff * 3; maxL = STORY.ROUTE_MAX.log * 3;
    }
    const pct = (v, m) => Math.max(0, Math.min(100, (v / m) * 100));
    $("affVal").textContent = String(aff);
    $("logVal").textContent = String(log);
    $("affBar").style.width = pct(aff, maxA) + "%";
    $("logBar").style.width = pct(log, maxL) + "%";
    /* mark the pass threshold on the meters, but only while an
     * assessment is actually running — at the hub it means nothing. */
    const mark = (bar, goal) => {
      const m = bar.parentNode;
      m.style.setProperty("--goal", pct(goal, goal === STORY.GOLD.aff ? maxA : maxL) + "%");
      m.style.setProperty("--goal-shown", src ? "1" : "0");
    };
    mark($("affBar"), STORY.GOLD.aff);
    mark($("logBar"), STORY.GOLD.log);
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
    if (animate && state.started) sfx("ping", gold.length);
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
      sfx("page");
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
   * Static interface text
   * ------------------------------------------------------------------ */
  function applyStaticText() {
    const s = t();
    document.documentElement.lang = state.lang;
    $("uiSubtitle").textContent = s.sector;
    $("affLabel").textContent = s.affection;
    $("logLabel").textContent = s.logQuality;
    /* Both language buttons show the language they switch TO. The title
     * one was previously left at its hard-coded markup value. */
    $("langBtn").textContent = s.lang;
    $("btnTitleLang").textContent = s.lang;
    const switchTo = state.lang === "de" ? "English" : "Deutsch";
    $("langBtn").setAttribute("aria-label", switchTo);
    $("btnTitleLang").setAttribute("aria-label", switchTo);
    $("soundBtn").textContent = "♪ " + (state.sound ? s.on : s.off);
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    $("soundBtn").title = s.music;
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

    /* The cache name appears in four places; all of them follow the
     * interface language. The heading wraps at an authored break rather
     * than wherever the column happens to run out. */
    document.title = s.cacheName;
    $("brandTitle").textContent = s.cacheName;
    const heading = $("titleHeading");
    heading.replaceChildren(
      document.createTextNode(s.cacheNameLines[0]),
      document.createElement("br"),
      document.createTextNode(s.cacheNameLines[1])
    );

    $("titleKicker").textContent = s.motto;
    $("titleSub").textContent = s.subtitle;
    $("titleNote").textContent = s.disclaimer;
    $("titleNeed").textContent = s.needAll;
    $("btnContinue").textContent = s.resume;

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
      previouslyUnlocked = 0;
    }
    state.started = true;
    showingTitle = false;
    save();
    $("titleScreen").hidden = true;
    $("app").hidden = false;
    SCENES.clearParticles();
    render();
    AUDIO.music(TRACK_FOR[view.scene] || "hub");
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
    sfx("blip");
    if (state.started) render(); else applyStaticText();
  }

  $("btnStart").addEventListener("click", () => { sfx("select"); beginGame(true); });
  $("btnContinue").addEventListener("click", () => { sfx("select"); beginGame(false); });
  $("btnTitleLang").addEventListener("click", toggleLang);
  $("langBtn").addEventListener("click", toggleLang);
  $("restartBtn").addEventListener("click", () => {
    if (confirm(t().confirm)) hardReset();
  });
  $("soundBtn").addEventListener("click", () => {
    state.sound = !state.sound;
    save();
    AUDIO.setEnabled(state.sound);
    applyStaticText();
    if (state.sound) {
      sfx("select");
      AUDIO.music(state.started ? (TRACK_FOR[view.scene] || "hub") : "title");
    }
  });
  $("skipBtn").addEventListener("click", finishTyping);
  $("dialogueText").addEventListener("click", () => { if (typing) finishTyping(); });
  /* Tapping anywhere on the title screen skips the cold start — not
   * just the canvas, which the text block can cover on small screens. */
  $("titleScreen").addEventListener("pointerdown", skipTitleIntro);

  document.addEventListener("keydown", (e) => {
    if (!state.started) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (titlePhase !== "ready") skipTitleIntro();
        else beginGame(!hasSave());
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
  AUDIO.setEnabled(state.sound);
  applyStaticText();
  /* The facility only cold-starts once. If there is already a save on
   * this device, go straight to the badge — nobody wants to watch the
   * boot log every single visit, and the menu is unclickable until it
   * has finished. */
  if (REDUCED) skipTitleIntro();
  else if (hasSave()) { titlePhase = "logo"; titleClock = 0; }
  renderTitle();                 /* paint before the first frame lands */
  requestAnimationFrame(loop);

  /* A backgrounded tab still runs the audio scheduler even though
   * requestAnimationFrame has stopped, which would quietly drain a
   * phone in a pocket. Stop the music while hidden, resume on return. */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      AUDIO.stopMusic(0.3);
    } else if (state.sound) {
      AUDIO.music(state.started ? (TRACK_FOR[view.scene] || "hub") : "title");
    }
  });

  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
