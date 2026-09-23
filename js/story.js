/* =====================================================================
 * story.js — cast, interface strings and every line of the script.
 *
 * Every piece of prose is a { de, en } pair. Nothing else in the code
 * base contains user-facing text, so translating the game means editing
 * this one file and nothing else.
 *
 * Two speakers are special, and follow Kalibrierungsanlage canon:
 *   R-3MI speaks German, always. In English mode her line is shown in
 *   German with an English subtitle underneath.
 *   V-TGM speaks English, always, with a German subtitle in German mode.
 * The engine reads `nativeLang` on the cast entry to decide which half
 * of the pair is the spoken line and which is the subtitle.
 * ===================================================================== */
"use strict";

window.STORY = (function () {

  /* ------------------------------------------------------------------
   * Cast
   * ------------------------------------------------------------------ */
  const chars = {
    you:   { name: { de: "Du", en: "You" }, tint: "#ffd15c", sprite: "you" },

    /* The two units of the facility. Colours match KA-II's design system. */
    r3mi: {
      name: { de: "R-3MI", en: "R-3MI" }, tint: "#2ecf62",
      host: "r3mi", nativeLang: "de"
    },
    vtgm: {
      name: { de: "V-TGM", en: "V-TGM" }, tint: "#c0322c",
      host: "vtgm", nativeLang: "en"
    },
    units: { name: { de: "R-3MI & V-TGM", en: "R-3MI & V-TGM" }, tint: "#c3a8d8", host: "r3mi" },
    system: { name: { de: "ANLAGE", en: "FACILITY" }, tint: "#3a8fd4", system: true },

    petra: { name: { de: "Petra Petling", en: "Petra Petling" }, tint: "#3f8f5e", sprite: "petra" },
    nando: { name: { de: "Nando Nano", en: "Nando Nano" },       tint: "#7d8794", sprite: "nando" },
    mysti: { name: { de: "Mysti Fünf-Sterne", en: "Mysti Five-Star" }, tint: "#7a4fae", sprite: "mysti" }
  };

  const routes = ["petra", "nando", "mysti"];

  const routeMeta = {
    petra: {
      scene: "forest", track: "petra",
      tagline: {
        de: "Klassisch, wasserdicht, emotional leicht feucht.",
        en: "Classic, waterproof, emotionally a little damp."
      },
      dt: "D 1.5 / T 2.0",
      spec: { de: "PRÜFKÖRPER 01", en: "TEST SUBJECT 01" }
    },
    nando: {
      scene: "city", track: "nando",
      tagline: {
        de: "Winzig, magnetisch, schwer zu greifen.",
        en: "Tiny, magnetic, hard to get hold of."
      },
      dt: "D 2.5 / T 1.5",
      spec: { de: "PRÜFKÖRPER 02", en: "TEST SUBJECT 02" }
    },
    mysti: {
      scene: "ruins", track: "mysti",
      tagline: {
        de: "Kompliziert, rätselhaft, 47 Tabs offen.",
        en: "Complicated, cryptic, 47 tabs open."
      },
      dt: "D 5.0 / T 3.5",
      spec: { de: "PRÜFKÖRPER 03", en: "TEST SUBJECT 03" }
    }
  };

  /* ------------------------------------------------------------------
   * Interface strings
   * ------------------------------------------------------------------ */
  const ui = {
    de: {
      /* The cache's own name. `cacheNameLines` is the same name split
       * where the title-screen heading should wrap. */
      cacheName: "Liebe auf den ersten Log",
      cacheNameLines: ["Liebe auf", "den ersten Log"],
      facility: "DIE KALIBRIERUNGSANLAGE",
      sector: "SEKTOR 7C - ABT. EMOTIONALE VERTRAEGLICHKEIT",
      /* The two lines along the bottom of the badge. `sectorTab` is the
       * code in the little certification tab in the corner. */
      facilityTag: "EINRICHTUNG ZUR PRAEZISIONSKALIBRIERUNG",
      sectorTab: "7C",
      motto: "TESTEN. MESSEN. VERLIEBEN.",
      subtitle: "Sektor 7C der Kalibrierungsanlage — mit Final-Koordinaten",
      start: "▶ Prüfung beginnen",
      resume: "▶ Weiterspielen",
      newGame: "Neu anfangen",
      affection: "Zuneigung",
      logQuality: "Log-Qualität",
      restart: "↻ Neustart",
      on: "AN", off: "AUS", lang: "EN",
      hint: "Antwort antippen oder Tasten 1–4. Enter = weiter.",
      continue: "Weiter",
      saved: "Fortschritt wird lokal gespeichert",
      confirm: "Wirklich alles löschen und neu anfangen?",
      gpsTitle: "FINAL-KOORDINATEN",
      gpsSearching: "Suche Satelliten …",
      gpsLocked: "POSITION FIXIERT",
      gpsSubtitle: "Jede bestandene Prüfung gibt einen Teil frei.",
      posted: "Listing-Koordinaten",
      checksum: "Quersumme aller Ziffern",
      copy: "Koordinaten kopieren",
      copied: "Kopiert!",
      openMap: "Karte öffnen",
      checker: "Lösung prüfen",
      hintLabel: "Hinweis (ROT13)",
      distance: "Entfernung vom Listing",
      hub: "Welchen Prüfkörper nimmst du dir als Nächstes vor?",
      hubSub: "Drei Prüfungen. Drei Herzen. Zehn Ziffern.",
      statusOpen: "offen",
      statusGold: "★ BESTANDEN — Ziffern gesichert",
      statusSilver: "KNAPP DANEBEN — nochmal",
      statusBronze: "DURCHGEFALLEN — nochmal",
      replay: "Prüfung wiederholen",
      goFinal: "Zum Final",
      rank: "PRÜFPROTOKOLL",
      shardWon: "ZIFFERN FREIGESCHALTET",
      shardLost: "KEINE ZIFFERN",
      backToHub: "Zurück zur Anlage",
      copyLog: "Log kopieren",
      endingTitle: "GEFUNDEN",
      disclaimer: "Inoffizielles, nicht-kommerzielles Fanprojekt. Nicht mit Geocaching HQ / Groundspeak verbunden. Alle Figuren sind erfunden. Bitte verantwortungsvoll cachen und die Muggel nicht füttern.",
      offlineReady: "Offline spielbar",
      skip: "Text sofort anzeigen",
      music: "Musik",
      bootLines: [
        "KALIBRIERUNGSANLAGE - KALTSTART",
        "SEKTOR 7C ... ONLINE. WIE IMMER.",
        "ABT. EMOTIONALE VERTRAEGLICHKEIT ... ENTSTAUBT",
        "PRUEFKOERPER 01 / 02 / 03 ... ONLINE",
        "MOBILE EINHEITEN ... R-3MI, V-TGM",
        "ABTEILUNG ENTSPERRT. LEIDER."
      ],
      needAll: "Alle drei Prüfungen bestehen, dann rastet das GPS ein.",
      findings: "Befunde",
      findingsSub: "V-TGMs Akte über dich. Manche findet man nur mit Absicht.",
      findingNew: "BEFUND ERFASST",
      findingsTally: "Befunde erfasst",
      findingsLeft: "Noch nicht alle. V-TGM hat Platz in der Akte.",
      back: "Zurück"
    },
    en: {
      cacheName: "Love On The First Log",
      cacheNameLines: ["Love On", "The First Log"],
      facility: "DIE KALIBRIERUNGSANLAGE",
      sector: "SECTOR 7C - EMOTIONAL COMPATIBILITY DEPT.",
      facilityTag: "PRECISION CALIBRATION FACILITY",
      sectorTab: "7C",
      motto: "TESTEN. MESSEN. VERLIEBEN.",
      subtitle: "Sector 7C of the Calibration Facility — with final coordinates",
      start: "▶ Begin assessment",
      resume: "▶ Continue",
      newGame: "Start over",
      affection: "Affection",
      logQuality: "Log quality",
      restart: "↻ Restart",
      on: "ON", off: "OFF", lang: "DE",
      hint: "Tap an answer or press 1–4. Enter to advance.",
      continue: "Continue",
      saved: "Progress is saved on this device",
      confirm: "Erase everything and start over?",
      gpsTitle: "FINAL COORDINATES",
      gpsSearching: "Acquiring satellites …",
      gpsLocked: "POSITION LOCKED",
      gpsSubtitle: "Every assessment you pass releases a piece.",
      posted: "Posted coordinates",
      checksum: "Cross-sum of all digits",
      copy: "Copy coordinates",
      copied: "Copied!",
      openMap: "Open map",
      checker: "Check solution",
      hintLabel: "Hint (ROT13)",
      distance: "Distance from posted",
      hub: "Which test subject are you taking on next?",
      hubSub: "Three assessments. Three hearts. Ten digits.",
      statusOpen: "open",
      statusGold: "★ PASSED — digits secured",
      statusSilver: "NEAR MISS — try again",
      statusBronze: "FAILED — try again",
      replay: "Retake this assessment",
      goFinal: "To the final",
      rank: "ASSESSMENT RECORD",
      shardWon: "DIGITS UNLOCKED",
      shardLost: "NO DIGITS",
      backToHub: "Back to the facility",
      copyLog: "Copy log",
      endingTitle: "FOUND IT",
      disclaimer: "Unofficial, non-commercial fan project. Not affiliated with Geocaching HQ / Groundspeak. All characters are fictional. Please cache responsibly and do not feed the Muggles.",
      offlineReady: "Playable offline",
      skip: "Show full text",
      music: "Music",
      bootLines: [
        "CALIBRATION FACILITY - COLD START",
        "SECTOR 7C ... ONLINE. AS ALWAYS.",
        "EMOTIONAL COMPATIBILITY DEPT. ... DUSTED OFF",
        "TEST SUBJECTS 01 / 02 / 03 ... ONLINE",
        "MOBILE UNITS ... R-3MI, V-TGM",
        "DEPARTMENT UNLOCKED. REGRETTABLY."
      ],
      needAll: "Pass all three assessments and the GPSr locks on.",
      findings: "Findings",
      findingsSub: "V-TGM's file on you. Some of these you only find on purpose.",
      findingNew: "FINDING RECORDED",
      findingsTally: "findings recorded",
      findingsLeft: "Not all of them yet. V-TGM has room in the file.",
      back: "Back"
    }
  };

  /* ------------------------------------------------------------------
   * Script
   *
   * Node shape:
   *   who      speaker key
   *   scene    backdrop id
   *   weather  "rain" | "muggle" | "night"
   *   fx       "hearts" | "sparks" | "thorns" | "shake" | "glitch"
   *   r3mi     "expression/pose" for the green unit on this beat
   *   vtgm     "expression/pose" for the red unit on this beat
   *   emote    { who, kind } floating symbol
   *   text     { de, en }
   *   next     id for a plain Continue
   *   choices  [{ t:{de,en}, to, aff, log, fx, right }]
   *   quiz     true — this beat has exactly one correct answer
   *   route    marks this node as part of an assessment
   *   end      route id — finish the assessment and score it
   * ------------------------------------------------------------------ */
  const nodes = {

    /* ================= PROLOGUE ================= */
    pro1: {
      who: "system", scene: "event", fx: "glitch",
      r3mi: "neutral/idle", vtgm: "neutral/idle",
      text: {
        de: "SEKTOR 7C — ABTEILUNG EMOTIONALE VERTRÄGLICHKEIT. LETZTE KALIBRIERUNG: VOR SEHR LANGER ZEIT. BESUCHER ERKANNT.",
        en: "SECTOR 7C — EMOTIONAL COMPATIBILITY DEPARTMENT. LAST CALIBRATION: A VERY LONG TIME AGO. VISITOR DETECTED."
      },
      next: "pro2"
    },
    pro2: {
      who: "r3mi", scene: "event", r3mi: "happy/cheer", vtgm: "suspicious/idle",
      emote: { who: "r3mi", kind: "sparkle" },
      text: {
        de: "„Oh! Ein Besucher! In Sektor 7C! — Also, in Sektor 7C sind ständig Besucher. Hier passiert ja ALLES. Aber in DIESER Abteilung! Weißt du, wie lange ich darauf gewartet habe?“",
        en: "“Oh! A visitor! In Sector 7C! — Well, Sector 7C has visitors all the time. EVERYTHING happens here. But in THIS department! Do you know how long I have waited for this?”"
      },
      next: "pro3"
    },
    pro3: {
      who: "vtgm", scene: "event", r3mi: "happy/present", vtgm: "annoyed/crossed",
      text: {
        de: "Alles in dieser Anlage passiert in Sektor 7C. Die Rundheitsprüfungen. Das Pausenprotokoll. Diese Abteilung war die eine, die wir uns geeinigt hatten, nie wieder einzuschalten.",
        en: "Everything in this facility happens in Sector 7C. The roundness tests. The break protocol. This department was the one we agreed never to switch back on."
      },
      next: "pro4"
    },
    pro4: {
      who: "r3mi", scene: "event", r3mi: "curious/point", vtgm: "annoyed/crossed",
      text: {
        de: "„Details. — Also: Das hier ist die Verträglichkeitsprüfung. Wir haben drei Prüfkörper. Du bist das Messgerät.“",
        en: "“Details. — Anyway: this is the compatibility assessment. We have three test subjects. You are the instrument.”"
      },
      next: "pro5"
    },
    pro5: {
      who: "vtgm", scene: "event", r3mi: "happy/idle", vtgm: "neutral/idle",
      text: {
        de: "Es sind Dosen. Uns ist bewusst, wie das klingt.",
        en: "They are containers. We are aware of how that sounds."
      },
      next: "pro6"
    },
    pro6: {
      who: "r3mi", scene: "event", r3mi: "happy/cheer", vtgm: "neutral/idle",
      emote: { who: "r3mi", kind: "heart" },
      text: {
        de: "„Jede Prüfung, die du bestehst, gibt einen Teil der Final-Koordinaten frei. Alle drei — und dein GPS rastet ein!“",
        en: "“Every assessment you pass releases part of the final coordinates. All three, and your GPSr locks on!”"
      },
      next: "pro7"
    },
    pro7: {
      who: "vtgm", scene: "event", r3mi: "happy/idle", vtgm: "neutral/point",
      text: {
        de: "Bestehen heißt bestehen. Nett sein reicht nicht. Wir messen auch, was du ins Logbuch schreibst.",
        en: "Passing means passing. Being nice is not enough. We also measure what you write in the logbook."
      },
      next: "pro8"
    },
    pro8: {
      who: "r3mi", scene: "event", r3mi: "proud/hips", vtgm: "annoyed/crossed",
      emote: { who: "vtgm", kind: "anger" },
      text: {
        de: "„Und du musst alle drei daten. Gleichzeitig. Das nennt man einen Multi!“",
        en: "“And you have to date all three. Concurrently. That's called a multi-cache!”"
      },
      next: "pro9"
    },
    pro9: {
      who: "vtgm", scene: "event", r3mi: "happy/idle", vtgm: "annoyed/crossed",
      text: {
        de: "Das bedeutet das nicht.",
        en: "That is not what that means."
      },
      next: "hub"
    },

    hub: { hub: true, scene: "event", who: "units" },

    /* ================= PETRA — PRÜFKÖRPER 01 ================= */
    pe1: {
      route: "petra", who: "petra", scene: "forest",
      r3mi: "happy/present", vtgm: "neutral/idle",
      text: {
        de: "Petra steht unter einer sehr romantischen Eiche und hält einen Petling hoch, aus dem Wasser läuft. „Hallo! Mein Logbuch ist ein Smoothie. Diese Dose liegt hier seit 2007. Unter genau dieser Eiche.“",
        en: "Petra stands beneath a very romantic oak, holding up a petling with water running out of it. “Hi! My logbook is a smoothie. This container has been here since 2007. Under this exact oak.”"
      },
      choices: [
        { t: { de: "Wartungsset zücken. Trockenes Logbuch, neuer O-Ring, frischer Bleistift.", en: "Produce a maintenance kit. Dry logbook, new O-ring, fresh pencil." }, to: "pe1a", aff: 2, log: 2, fx: "hearts" },
        { t: { de: "„2007? Da war ich noch nicht mal angemeldet.“", en: "“2007? I hadn't even signed up back then.”" }, to: "pe1b", aff: 1, log: 1 },
        { t: { de: "„TFTC.“ Und weitergehen.", en: "“TFTC.” And walk on." }, to: "pe1c", aff: -2, log: -2, ach: "tftc" }
      ]
    },
    pe1a: {
      route: "petra", who: "petra", scene: "forest", r3mi: "happy/cheer", vtgm: "neutral/idle",
      emote: { who: "petra", kind: "heart" },
      text: {
        de: "Petra sieht dich an, wie andere Leute Sonnenuntergänge ansehen. „Du hast einen ERSATZ-O-RING dabei.“ — „Zwei“, sagst du. Irgendwo in den Bäumen macht R-3MI ein Geräusch wie ein zerknautschtes Herz.",
        en: "Petra looks at you the way other people look at sunsets. “You are carrying a SPARE O-RING.” “Two,” you say. Somewhere in the trees, R-3MI makes a noise like a crumpling heart."
      },
      next: "pe2"
    },
    pe1b: {
      route: "petra", who: "petra", scene: "forest", r3mi: "curious/think", vtgm: "neutral/idle",
      text: {
        de: "„2007“, sagt Petra versonnen. „Damals waren die Hinweise noch ehrlich und die Dosen noch groß.“ Sie klopft auf die Eiche wie auf eine alte Kollegin.",
        en: "“2007,” Petra says wistfully. “Back then the hints were honest and the containers were big.” She pats the oak like an old colleague."
      },
      next: "pe2"
    },
    pe1c: {
      route: "petra", who: "vtgm", scene: "forest", r3mi: "sad/slump", vtgm: "annoyed/crossed",
      emote: { who: "r3mi", kind: "sweat" },
      text: {
        de: "Log geschrieben: TFTC. Vier Zeichen. Ich habe es archiviert. Emotional ebenfalls.",
        en: "Log written: TFTC. Four characters. I have archived it. Emotionally as well."
      },
      next: "pe2"
    },
    pe2: {
      route: "petra", who: "petra", scene: "forest", r3mi: "neutral/idle", vtgm: "neutral/idle",
      text: {
        de: "Sie schraubt den Deckel auf und zieht ein aufgeweichtes Stück Papier heraus. „Und eine Regel habe ich: Ich logge nie mit Kugelschreiber. Nie. Kugelschreiber ist ein Verbrechen an nassem Papier.“",
        en: "She unscrews the lid and pulls out a sodden scrap of paper. “And I have one rule: I never log in ballpoint. Never. Ballpoint is a crime against wet paper.”"
      },
      choices: [
        { t: { de: "„Bleistift überlebt alles. Sogar Beziehungen.“", en: "“Pencil survives everything. Even relationships.”" }, to: "pe3", aff: 2, log: 2, fx: "hearts" },
        { t: { de: "Zustimmend nicken und nichts sagen.", en: "Nod in agreement and say nothing." }, to: "pe3", aff: 1, log: 0 },
        { t: { de: "„Ich logge eigentlich nur noch digital.“", en: "“I only really log digitally these days.”" }, to: "pe3", aff: -1, log: -1, ach: "digital" }
      ]
    },
    pe3: {
      route: "petra", who: "petra", scene: "forest", quiz: true,
      r3mi: "curious/point", vtgm: "neutral/point",
      text: {
        de: "„Prüfungsfrage“, sagt Petra fröhlich. „Du findest diese Dose. Logbuch durchweicht, Deckel gerissen, Dose aber da. Was loggst du?“",
        en: "“Assessment question,” Petra says cheerfully. “You find this container. Logbook soaked, lid cracked, but the container is there. What do you log?”"
      },
      choices: [
        { t: { de: "„Found it“ — plus „Needs Maintenance“ für den Owner.", en: "“Found it” — plus a “Needs Maintenance” for the owner." }, to: "pe3a", aff: 3, log: 2, right: true, fx: "hearts" },
        { t: { de: "„Needs Archived“. Ist doch kaputt.", en: "“Needs Archived”. It's broken, isn't it." }, to: "pe3b", aff: -1, log: -2 },
        { t: { de: "Nur „Write Note“, um niemanden zu ärgern.", en: "Just a “Write Note”, so nobody gets upset." }, to: "pe3b", aff: 0, log: 0 },
        { t: { de: "„DNF“ — das zählt so nicht.", en: "“DNF” — that doesn't really count." }, to: "pe3b", aff: 0, log: -1 }
      ]
    },
    pe3a: {
      route: "petra", who: "r3mi", scene: "forest", r3mi: "proud/hips", vtgm: "happy/idle",
      emote: { who: "r3mi", kind: "sparkle" },
      text: {
        de: "„RICHTIG! Found it plus NM! Gefunden ist gefunden, und der Owner erfährt trotzdem, dass der Deckel hin ist. Ich notiere: sehr gutes Sozialverhalten.“",
        en: "“CORRECT! Found it plus NM! A find is a find, and the owner still learns the lid is done for. I am recording: excellent social conduct.”"
      },
      next: "pe4"
    },
    pe3b: {
      route: "petra", who: "vtgm", scene: "forest", r3mi: "sad/slump", vtgm: "annoyed/crossed",
      emote: { who: "vtgm", kind: "anger" },
      text: {
        de: "Falsch. Ein Fund bleibt ein Fund. Der Owner braucht die Information, nicht die Bestrafung. Notiert.",
        en: "Wrong. A find is still a find. The owner needs the information, not the punishment. Noted."
      },
      /* shown instead of `text` from the second visit on */
      again: {
        de: "Wieder falsch. Ich habe dafür jetzt einen Ordner. Der Ordner hat einen Reiter. Auf dem Reiter steht dein Name.",
        en: "Wrong again. I have a folder for this now. The folder has a tab. The tab has your name on it."
      },
      next: "pe4"
    },
    pe4: {
      route: "petra", who: "units", scene: "forest", weather: "muggle",
      r3mi: "panic/panic", vtgm: "suspicious/point",
      emote: { who: "r3mi", kind: "bang" },
      text: {
        de: "Ein Muggel mit Hund biegt um die Eiche. Der Hund hat euch schon gefunden. Der Muggel hat noch Hoffnung.",
        en: "A Muggle with a dog comes round the oak. The dog has already found you. The Muggle still has hope."
      },
      choices: [
        { t: { de: "Den Baum umarmen. Völlig normale Freizeitgestaltung.", en: "Hug the tree. A completely normal hobby." }, to: "pe5", aff: 2, log: 1, ach: "treehug" },
        { t: { de: "Laut rufen: „Ich suche nur mein WLAN!“", en: "Shout: “I'm only looking for my Wi-Fi!”" }, to: "pe5", aff: 1, log: 0, ach: "wifi" },
        { t: { de: "Petra vorschieben und „Pilze!“ rufen.", en: "Push Petra forward and yell “Mushrooms!”" }, to: "pe5", aff: -2, log: 0, ach: "mushrooms" }
      ]
    },
    pe5: {
      route: "petra", who: "petra", scene: "forest", weather: "rain", fx: "shake",
      r3mi: "panic/panic", vtgm: "annoyed/idle",
      text: {
        de: "Es fängt an zu regnen. Natürlich. Petra durchsucht ihre Taschen und wird blass: „Mein Stift. Ich habe meinen Stift im Auto gelassen.“ Sie sieht dich an. Du hast vier Dinge dabei.",
        en: "It starts to rain. Of course it does. Petra searches her pockets and goes pale: “My pen. I left my pen in the car.” She looks at you. You have four things on you."
      },
      quiz: true,
      choices: [
        { t: { de: "Den Bleistift.", en: "The pencil." }, to: "pe5a", aff: 3, log: 2, right: true, fx: "hearts" },
        { t: { de: "Den Kugelschreiber.", en: "The ballpoint pen." }, to: "pe5b", aff: -2, log: -1 },
        { t: { de: "Den Permanentmarker.", en: "The permanent marker." }, to: "pe5b", aff: 0, log: 0 },
        { t: { de: "Das Handy — „diktier's mir einfach“.", en: "Your phone — “just dictate it to me”." }, to: "pe5b", aff: 0, log: -1 }
      ]
    },
    pe5a: {
      route: "petra", who: "petra", scene: "forest", weather: "rain",
      r3mi: "happy/cheer", vtgm: "happy/idle",
      emote: { who: "petra", kind: "heart" },
      text: {
        de: "Sie nimmt den Bleistift, ohne hinzusehen. „Du hast zugehört.“ — „Du hast es zwanzig Minuten lang gesagt.“ — „Die meisten hören trotzdem nicht zu.“ Der Regen wird kurz sehr unwichtig.",
        en: "She takes the pencil without looking. “You listened.” “You said it for twenty minutes.” “Most people still don't listen.” The rain briefly becomes very unimportant."
      },
      next: "pe6"
    },
    pe5b: {
      route: "petra", who: "vtgm", scene: "forest", weather: "rain",
      r3mi: "sad/slump", vtgm: "suspicious/crossed",
      text: {
        de: "Sie hat dir ihre einzige Regel vor vier Minuten gesagt. Ich habe mitgeschrieben. Das gehört zu meinen Aufgaben.",
        en: "She told you her one rule four minutes ago. I wrote it down. That is part of my function."
      },
      /* shown instead of `text` from the second visit on */
      again: {
        de: "Sie hat Bleistift gesagt. Sie sagt in jeder Prüfung Bleistift, seit diese Anlage steht. Sogar die Eiche weiß inzwischen, dass es Bleistift ist.",
        en: "She said pencil. She has said pencil in every assessment since this facility was built. Even the oak knows it is pencil by now."
      },
      next: "pe6"
    },
    pe6: {
      route: "petra", who: "petra", scene: "forest", weather: "rain",
      r3mi: "neutral/idle", vtgm: "neutral/idle",
      text: {
        de: "Das Logbuch liegt offen auf dem Stein und der Regen wird ernster.",
        en: "The logbook is lying open on the rock and the rain is getting serious."
      },
      choices: [
        { t: { de: "Die eigene Jacke drüber. Du bist ohnehin schon nass.", en: "Own jacket over it. You're soaked anyway." }, to: "pe7", aff: 2, log: 1, fx: "hearts" },
        { t: { de: "Zip-Beutel. Ich habe immer einen Zip-Beutel.", en: "Zip bag. I always have a zip bag." }, to: "pe7", aff: 1, log: 2 },
        { t: { de: "Zuklappen und hoffen.", en: "Close it and hope." }, to: "pe7", aff: 0, log: -1 }
      ]
    },
    pe7: {
      route: "petra", who: "petra", scene: "forest", weather: "rain", end: "petra",
      r3mi: "happy/idle", vtgm: "neutral/idle",
      text: {
        de: "Ihr steht unter der Eiche: zwei nasse Menschen und eine trockene Dose.",
        en: "You stand under the oak: two soaked humans and one dry container."
      }
    },

    /* ================= NANDO — PRÜFKÖRPER 02 ================= */
    na1: {
      route: "nando", who: "nando", scene: "city",
      r3mi: "curious/point", vtgm: "neutral/idle",
      text: {
        de: "Nando hängt magnetisch hinter einem Verkehrsschild. „Hi. Ich bin im echten Leben kleiner als auf dem Profilbild.“ Er ist vier Zentimeter. „Ich hänge hier seit 2011. Und eine Bitte vorweg: Fass mich nicht an. Benutz den Spiegel.“",
        en: "Nando is stuck magnetically behind a road sign. “Hi. I'm smaller in real life than in my profile picture.” He is four centimetres. “I've been here since 2011. And one request up front: don't grab me. Use the mirror.”"
      },
      choices: [
        { t: { de: "Sofort den Inspektionsspiegel auspacken.", en: "Get the inspection mirror out straight away." }, to: "na1a", aff: 2, log: 2, fx: "hearts" },
        { t: { de: "„Größe ist auch nur eine D/T-Wertung.“", en: "“Size is just another D/T rating.”" }, to: "na1b", aff: 2, log: 1 },
        { t: { de: "Bolzenschneider zücken. Als Kompliment gemeint.", en: "Produce bolt cutters. Meant as a compliment." }, to: "na1c", aff: -2, log: -2, ach: "boltcutter" }
      ]
    },
    na1a: {
      route: "nando", who: "nando", scene: "city", r3mi: "happy/cheer", vtgm: "happy/idle",
      emote: { who: "nando", kind: "sparkle" },
      text: {
        de: "„Ein Spiegel“, sagt Nando andächtig. „Kein Abtasten, kein Gezerre, keine beschädigte Halterung. Du bist der erste Mensch seit Mai, der mich nicht angefasst hat wie ein Kaugummi.“",
        en: "“A mirror,” Nando says reverently. “No groping, no yanking, no damaged mount. You are the first person since May who has not handled me like chewing gum.”"
      },
      next: "na2"
    },
    na1b: {
      route: "nando", who: "nando", scene: "city", r3mi: "happy/idle", vtgm: "neutral/idle",
      text: {
        de: "Nando schweigt kurz. „Weißt du, wie oft ich das höre?“ — „Oft?“ — „Nie. Kein einziges Mal. Die Leute sagen ‚ach, DAS ist der Cache‘ und klingen dabei enttäuscht.“",
        en: "Nando goes quiet. “Do you know how often I hear that?” “Often?” “Never. Not once. People say ‘oh, THAT'S the cache' in a distinctly disappointed voice.”"
      },
      next: "na2"
    },
    na1c: {
      route: "nando", who: "vtgm", scene: "city", r3mi: "panic/panic", vtgm: "annoyed/crossed",
      emote: { who: "vtgm", kind: "anger" },
      text: {
        de: "Werkzeug ist nur zulässig, wenn das Listing es erlaubt. Und man schneidet sein Date nicht auf. Das steht in keiner Richtlinie, weil niemand dachte, dass es nötig wäre.",
        en: "Tools are only appropriate if the listing says so. And you do not cut open your date. That is in no guideline, because nobody thought it would be necessary."
      },
      next: "na2"
    },
    na2: {
      route: "nando", who: "nando", scene: "city", r3mi: "neutral/idle", vtgm: "neutral/idle",
      text: {
        de: "„Das Schlimmste“, sagt Nando, „sind die Logs. ‚Schnell gefunden, TN.‘ Zwölf Jahre stehe ich hier und bekomme drei Buchstaben.“",
        en: "“The worst part,” Nando says, “is the logs. ‘Quick find, TN.' Twelve years I've been here and I get three letters.”"
      },
      choices: [
        { t: { de: "„Ich schreibe dir einen Log mit Absätzen.“", en: "“I'll write you a log with paragraphs.”" }, to: "na3", aff: 2, log: 2, fx: "hearts" },
        { t: { de: "„Immerhin haben sie geloggt.“", en: "“At least they logged at all.”" }, to: "na3", aff: 0, log: 1 },
        { t: { de: "„Ehrlich gesagt logge ich auch meistens TFTC.“", en: "“Honestly, I mostly log TFTC too.”" }, to: "na3", aff: -1, log: -1 }
      ]
    },
    na3: {
      route: "nando", who: "nando", scene: "city", quiz: true,
      r3mi: "curious/point", vtgm: "neutral/point",
      text: {
        de: "„Prüfungsfrage. Ein Cache ist als D 1,5 / T 5 gelistet. Was heißt das?“",
        en: "“Assessment question. A cache is listed as D 1.5 / T 5. What does that mean?”"
      },
      choices: [
        { t: { de: "Leicht zu finden, aber das Gelände ist heftig.", en: "Easy to find, but the terrain is brutal." }, to: "na3a", aff: 3, log: 2, right: true, fx: "hearts" },
        { t: { de: "Schwer zu finden, aber bequem zu erreichen.", en: "Hard to find, but easy to get to." }, to: "na3b", aff: -1, log: -2 },
        { t: { de: "Kleine Dose, langer Fußweg.", en: "Small container, long walk." }, to: "na3b", aff: 0, log: -1 },
        { t: { de: "1,5 Kilometer, fünf Stationen.", en: "1.5 kilometres, five stages." }, to: "na3b", aff: 0, log: -1 }
      ]
    },
    na3a: {
      route: "nando", who: "r3mi", scene: "city", r3mi: "proud/hips", vtgm: "happy/idle",
      emote: { who: "r3mi", kind: "sparkle" },
      text: {
        de: "„RICHTIG! D ist Difficulty — das Finden. T ist Terrain — der Weg dahin. Bei T 5 brauchst du Kletterzeug oder ein Boot. Bei D 1,5 liegt sie praktisch auf dem Präsentierteller.“",
        en: "“CORRECT! D is Difficulty — the finding. T is Terrain — getting there. At T 5 you need climbing gear or a boat. At D 1.5 it is practically served on a platter.”"
      },
      next: "na4"
    },
    na3b: {
      route: "nando", who: "vtgm", scene: "city", r3mi: "sad/slump", vtgm: "annoyed/crossed",
      text: {
        de: "Falsch herum. D ist das Finden, T ist der Weg. Ich erwähne das nur, weil dich sonst irgendwann ein Baum überrascht.",
        en: "The wrong way round. D is the finding, T is the getting there. I mention it only because otherwise a tree will surprise you one day."
      },
      /* shown instead of `text` from the second visit on */
      again: {
        de: "Difficulty. Terrain. Erst D, dann T. Das Alphabet ist schon länger in dieser Reihenfolge.",
        en: "Difficulty. Terrain. D, then T. The alphabet has been in this order for some time."
      },
      next: "na4"
    },
    na4: {
      route: "nando", who: "units", scene: "city", r3mi: "suspicious/think", vtgm: "suspicious/idle",
      text: {
        de: "Eine Gruppe Muggel stellt sich direkt vor die Dose und diskutiert seit zwölf Minuten über einen Parkschein.",
        en: "A group of Muggles plants itself directly in front of the cache and has been discussing a parking ticket for twelve minutes."
      },
      choices: [
        { t: { de: "Eine spontane Stadtführung improvisieren.", en: "Improvise a spontaneous walking tour." }, to: "na5", aff: 2, log: 2 },
        { t: { de: "Ehrlich einen DNF loggen und Eis essen gehen.", en: "Log an honest DNF and go get ice cream." }, to: "na5", aff: 1, log: 2 },
        { t: { de: "„SCHAUT MAL, EIN TRACKABLE!“ rufen und zugreifen.", en: "Shout “LOOK, A TRACKABLE!” and grab." }, to: "na5", aff: -1, log: -1 }
      ]
    },
    na5: {
      route: "nando", who: "nando", scene: "city", fx: "shake", quiz: true,
      r3mi: "panic/panic", vtgm: "panic/idle",
      emote: { who: "nando", kind: "sweat" },
      text: {
        de: "Nando rutscht ab und fällt durch ein Gullygitter auf einen Absatz, dreißig Zentimeter tief. Erreichbar. Gerade so. Vier Möglichkeiten.",
        en: "Nando slips and drops through a drain grate onto a ledge, thirty centimetres down. Reachable. Just about. Four options."
      },
      choices: [
        { t: { de: "Spiegel rein, Teleskop-Magnet dran, rausheben.", en: "Mirror in, telescopic magnet on him, lift him out." }, to: "na5a", aff: 3, log: 2, right: true, fx: "sparks" },
        { t: { de: "Mit zwei Fingern hinterhergreifen.", en: "Reach in after him with two fingers." }, to: "na5b", aff: -2, log: -1 },
        { t: { de: "Das Gitter anheben. Das ist bestimmt erlaubt.", en: "Lift the grate. That's surely allowed." }, to: "na5b", aff: -1, log: -2 },
        { t: { de: "Kräftig rütteln, bis er von selbst rausfällt.", en: "Shake it hard until he falls out by himself." }, to: "na5b", aff: -2, log: -1 }
      ]
    },
    na5a: {
      route: "nando", who: "nando", scene: "city", r3mi: "happy/cheer", vtgm: "happy/idle",
      emote: { who: "nando", kind: "heart" },
      text: {
        de: "Er landet in deiner Handfläche, ohne dass ein einziger Finger ihn berührt hat. „Du hast es dir gemerkt“, sagt er. „Das mit dem Spiegel. Vier Zentimeter Mensch, und du hast es dir gemerkt.“",
        en: "He lands in your palm without a single finger having touched him. “You remembered,” he says. “The mirror thing. Four centimetres of person, and you remembered.”"
      },
      next: "na6"
    },
    na5b: {
      route: "nando", who: "vtgm", scene: "city", r3mi: "sad/slump", vtgm: "suspicious/crossed",
      text: {
        de: "Er hat dich als Allererstes darum gebeten. Es war seine einzige Bitte. Ich führe darüber Buch, das ist buchstäblich meine Aufgabe.",
        en: "He asked you that before anything else. It was his one request. I keep records of this. That is literally my function."
      },
      /* shown instead of `text` from the second visit on */
      again: {
        de: "Der Spiegel. Er wollte den Spiegel. Ich fange an, einen für dich mitzunehmen.",
        en: "The mirror. He asked for the mirror. I am going to start carrying one for you."
      },
      next: "na6"
    },
    na6: {
      route: "nando", who: "units", scene: "city", fx: "shake",
      r3mi: "panic/panic", vtgm: "error404/idle",
      text: {
        de: "Ein Transporter parkt ein. Nando — magnetisch, klein, romantisch impulsiv — heftet sich an die Seitentür. Der Transporter fährt los.",
        en: "A van pulls in. Nando — magnetic, tiny, romantically impulsive — attaches himself to the side door. The van drives away."
      },
      choices: [
        { t: { de: "Hinterherrennen. Es sind nur 400 Meter. Und eine Ampel.", en: "Run after it. It's only 400 metres. And one traffic light." }, to: "na7", aff: 2, log: 1, fx: "sparks", ach: "chase" },
        { t: { de: "Das Kennzeichen notieren und dem Owner schreiben.", en: "Note the plate and message the owner." }, to: "na7", aff: 1, log: 2 },
        { t: { de: "Ein Foto machen und „Cache is missing?“ loggen.", en: "Take a photo and log “Cache is missing?”" }, to: "na7", aff: -2, log: -2, ach: "missing" }
      ]
    },
    na7: {
      route: "nando", who: "nando", scene: "city", end: "nando",
      r3mi: "happy/idle", vtgm: "neutral/idle",
      text: {
        de: "Der Transporter hält an der Ampel. Nando fällt ab und landet in deiner Handfläche.",
        en: "The van stops at a red light. Nando drops off and lands in your palm."
      }
    },

    /* ================= MYSTI — PRÜFKÖRPER 03 ================= */
    my1: {
      route: "mysti", who: "mysti", scene: "ruins",
      r3mi: "curious/think", vtgm: "neutral/idle",
      text: {
        de: "Mysti wartet an der Ruine mit 47 offenen Tabs. „Bevor wir essen gehen: eine Kleinigkeit.“ Sie hält ein Schild hoch. Darauf steht: YBIR.",
        en: "Mysti waits at the ruin with 47 tabs open. “Before dinner: one small thing.” She holds up a sign. It reads: YBIR."
      },
      choices: [
        { t: { de: "„LOVE.“ ROT13. Es ist immer ROT13.", en: "“LOVE.” ROT13. It is always ROT13." }, to: "my1a", aff: 3, log: 2, right: true, fx: "hearts" },
        { t: { de: "„Ist das Walisisch?“", en: "“Is that Welsh?”" }, to: "my1b", aff: 0, log: 0, ach: "welsh" },
        { t: { de: "„Ich gebe auf. Gib mir den Hint.“", en: "“I give up. Give me the hint.”" }, to: "my1c", aff: 1, log: 0, ach: "ebg13" }
      ],
      quiz: true
    },
    my1a: {
      route: "mysti", who: "mysti", scene: "ruins", r3mi: "proud/cheer", vtgm: "happy/idle",
      emote: { who: "mysti", kind: "heart" },
      text: {
        de: "Mysti wird rot. Genau ein Pixel. „Das kriegt niemand beim ersten Mal.“ — „Ich hatte einen guten Lehrer.“ — „Wen?“ — „Deinen Cache. Das Blaue Wunder. Ich habe zweieinhalb Jahre gebraucht.“",
        en: "Mysti blushes. Exactly one pixel. “Nobody gets that first try.” “I had a good teacher.” “Who?” “Your cache. Das Blaue Wunder. It took me two and a half years.”"
      },
      next: "my2"
    },
    my1b: {
      route: "mysti", who: "mysti", scene: "ruins", r3mi: "suspicious/idle", vtgm: "annoyed/idle",
      text: {
        de: "„Walisisch“, sagt Mysti langsam, „wäre ein interessanter Ansatz gewesen. Ich behalte das im Kopf. Für später. Für ein anderes Rätsel. Für dich nicht.“",
        en: "“Welsh,” Mysti says slowly, “would have been an interesting approach. I'll keep it in mind. For later. For another puzzle. Not for you.”"
      },
      next: "my2"
    },
    my1c: {
      route: "mysti", who: "mysti", scene: "ruins", r3mi: "happy/idle", vtgm: "neutral/idle",
      text: {
        de: "Sie gibt dir den Hint. Der Hint ist ebenfalls ROT13. Der Hint lautet: EBG13.",
        en: "She gives you the hint. The hint is also ROT13. The hint reads: EBG13."
      },
      next: "my2"
    },
    my2: {
      route: "mysti", who: "mysti", scene: "ruins", r3mi: "neutral/idle", vtgm: "neutral/idle",
      text: {
        de: "„Mein eigener Cache ist übrigens Das Blaue Wunder“, sagt sie. „Zweieinhalb Jahre habe ich an meinem eigenen Rätsel gesessen, weil ich vergessen hatte, wie ich es verschlüsselt hatte. Ein Rätsel ohne Checksumme ist eine Grausamkeit.“",
        en: "“My own cache is Das Blaue Wunder, by the way,” she says. “I sat on my own puzzle for two and a half years because I'd forgotten how I encrypted it. A puzzle without a checksum is an act of cruelty.”"
      },
      choices: [
        { t: { de: "„Deshalb baust du immer eine Quersumme ein.“", en: "“Which is why you always build in a cross-sum.”" }, to: "my3", aff: 2, log: 2, fx: "hearts" },
        { t: { de: "„Zweieinhalb Jahre sind auch eine Beziehung.“", en: "“Two and a half years is a relationship too.”" }, to: "my3", aff: 2, log: 0 },
        { t: { de: "„Klingt nach einem Designfehler.“", en: "“Sounds like a design flaw.”" }, to: "my3", aff: -1, log: 0 }
      ]
    },
    my3: {
      route: "mysti", who: "mysti", scene: "ruins", quiz: true,
      r3mi: "curious/point", vtgm: "neutral/point",
      text: {
        de: "„Prüfungsfrage. Du löst ein Mystery. Das Final liegt 3,5 Kilometer von den Listing-Koordinaten entfernt. Was machst du?“",
        en: "“Assessment question. You solve a mystery cache. The final is 3.5 kilometres from the posted coordinates. What do you do?”"
      },
      choices: [
        { t: { de: "Owner anschreiben — das ist außerhalb der Zwei-Meilen-Richtlinie.", en: "Message the owner — that's outside the two-mile guideline." }, to: "my3a", aff: 3, log: 2, right: true, fx: "hearts" },
        { t: { de: "Nachrechnen. 3,5 km sind doch erlaubt.", en: "Do the maths again. 3.5 km is allowed, surely." }, to: "my3b", aff: 0, log: -1 },
        { t: { de: "Hingehen, loggen, nichts sagen.", en: "Go there, log it, say nothing." }, to: "my3b", aff: 0, log: -1 },
        { t: { de: "Sofort ein „Needs Archived“ setzen.", en: "File a “Needs Archived” immediately." }, to: "my3b", aff: -2, log: -2 }
      ]
    },
    my3a: {
      route: "mysti", who: "r3mi", scene: "ruins", r3mi: "proud/hips", vtgm: "happy/idle",
      emote: { who: "r3mi", kind: "sparkle" },
      text: {
        de: "„RICHTIG! Zwei Meilen sind ungefähr 3,2 Kilometer. 3,5 sind zu weit — also hast du dich entweder verrechnet oder das Listing hat ein Problem. Beides klärt man freundlich, nicht mit einem NA.“",
        en: "“CORRECT! Two miles is about 3.2 kilometres. 3.5 is too far — so either you miscalculated or the listing has a problem. Both get sorted out politely, not with an NA.”"
      },
      next: "my4"
    },
    my3b: {
      route: "mysti", who: "vtgm", scene: "ruins", r3mi: "sad/slump", vtgm: "annoyed/crossed",
      text: {
        de: "Zwei Meilen sind 3,2 Kilometer. Deine Lösung liegt außerhalb. Das ist fast immer ein Rechenfehler, und fast nie die Schuld des Owners.",
        en: "Two miles is 3.2 kilometres. Your solution falls outside it. That is nearly always an arithmetic error, and nearly never the owner's fault."
      },
      /* shown instead of `text` from the second visit on */
      again: {
        de: "Zwei Meilen. 3,2 Kilometer. Ich habe es R-3MI aufs Gehäuse geschrieben. Sie freut sich darüber, was nicht der Sinn war.",
        en: "Two miles. 3.2 kilometres. I have written it on R-3MI's casing. She is delighted about it, which was not the point."
      },
      next: "my4"
    },
    my4: {
      route: "mysti", who: "mysti", scene: "ruins", r3mi: "neutral/idle", vtgm: "neutral/idle",
      text: {
        de: "„Gut“, sagt Mysti. „Dann rechnen wir jetzt gemeinsam. Ich habe hier vierzehn Zahlen, einen Mondkalender und ein sehr schlechtes Gefühl.“",
        en: "“Good,” Mysti says. “Then we do the arithmetic together. I have fourteen numbers here, a lunar calendar and a very bad feeling.”"
      },
      choices: [
        { t: { de: "Ein Spreadsheet öffnen. Das ist meine Liebessprache.", en: "Open a spreadsheet. That is my love language." }, to: "my5", aff: 2, log: 2, fx: "sparks" },
        { t: { de: "In jedes Feld „42“ schreiben und hoffen.", en: "Put “42” in every field and hope." }, to: "my5", aff: 1, log: 0, ach: "fortytwo" },
        { t: { de: "Im Listing nach einem versehentlichen Spoiler suchen.", en: "Scan the listing for an accidental spoiler." }, to: "my5", aff: -1, log: 1 }
      ]
    },
    my5: {
      route: "mysti", who: "mysti", scene: "ruins", quiz: true,
      r3mi: "curious/think", vtgm: "suspicious/idle",
      text: {
        de: "Sie legt den Stift hin. „Letzte Frage, und die ist persönlich. Wie lange habe ich an meinem eigenen Rätsel gesessen?“",
        en: "She puts the pen down. “Last question, and this one's personal. How long did I sit on my own puzzle?”"
      },
      choices: [
        { t: { de: "„Zweieinhalb Jahre.“", en: "“Two and a half years.”" }, to: "my5a", aff: 3, log: 2, right: true, fx: "hearts" },
        { t: { de: "„Ein halbes Jahr.“", en: "“Six months.”" }, to: "my5b", aff: -1, log: 0 },
        { t: { de: "„Einen Abend.“", en: "“One evening.”" }, to: "my5b", aff: -1, log: 0 },
        { t: { de: "„Du hast es nie gelöst.“", en: "“You never solved it.”" }, to: "my5b", aff: -2, log: 0 }
      ]
    },
    my5a: {
      route: "mysti", who: "mysti", scene: "ruins", r3mi: "happy/cheer", vtgm: "happy/idle",
      emote: { who: "mysti", kind: "sparkle" },
      text: {
        de: "„Zweieinhalb Jahre“, wiederholt sie. „Ich sage das jedem. Niemand merkt es sich. Es ist mein Test, und du bist der erste Mensch, der ihn bestanden hat, ohne zu wissen, dass er einer war.“",
        en: "“Two and a half years,” she repeats. “I tell everyone. Nobody remembers. It is my test, and you are the first person to pass it without knowing it was one.”"
      },
      next: "my6"
    },
    my5b: {
      route: "mysti", who: "vtgm", scene: "ruins", r3mi: "sad/slump", vtgm: "suspicious/crossed",
      text: {
        de: "Sie hat es zweimal gesagt. Einmal beiläufig, einmal deutlich. Das war der Test. Sie stellt ihn immer, und fast niemand merkt, dass er läuft.",
        en: "She said it twice. Once in passing, once plainly. That was the test. She always runs it, and almost nobody notices it is running."
      },
      /* shown instead of `text` from the second visit on */
      again: {
        de: "Zweieinhalb Jahre. Sie sagt es jedes Mal. Es ist das einzige Rätsel dieser Anlage, das dir die Antwort gibt, bevor es die Frage stellt.",
        en: "Two and a half years. She says it every time. It is the only puzzle in this facility that gives you the answer before it asks the question."
      },
      next: "my6"
    },
    my6: {
      route: "mysti", who: "units", scene: "ruins", fx: "thorns",
      r3mi: "panic/panic", vtgm: "annoyed/idle",
      text: {
        de: "73 Rechenschritte später zeigt das Final mitten in einen Brombeerbusch. Es zeigt IMMER in einen Brombeerbusch.",
        en: "Seventy-three calculations later, the final points into the middle of a blackberry bush. It ALWAYS points into a blackberry bush."
      },
      choices: [
        { t: { de: "Gemeinsam rein. Liebe ist temporär, Dornen sind für immer.", en: "In together. Love is temporary, thorns are forever." }, to: "my7", aff: 2, log: 1, fx: "thorns" },
        { t: { de: "Erst ein Plausibilitäts-Check. Dann rein.", en: "Sanity-check the numbers first. Then in." }, to: "my7", aff: 2, log: 2 },
        { t: { de: "Dem Owner schreiben: „Brauche Hint. Und Pflaster.“", en: "Message the owner: “Need a hint. And a plaster.”" }, to: "my7", aff: 1, log: 1 }
      ]
    },
    my7: {
      route: "mysti", who: "mysti", scene: "ruins", end: "mysti",
      r3mi: "happy/idle", vtgm: "neutral/idle",
      text: {
        de: "Ihr sitzt zerkratzt auf einem Mauerrest und seid sehr zufrieden mit euch.",
        en: "You sit on a piece of ruined wall, thoroughly scratched, and very pleased with yourselves."
      }
    },

    /* ================= FINALE ================= */
    fin1: {
      who: "system", scene: "finale", fx: "glitch",
      r3mi: "happy/present", vtgm: "neutral/idle",
      text: {
        de: "SEKTOR 7C — ALLE DREI PRÜFUNGEN BESTANDEN. EMOTIONALE VERTRÄGLICHKEIT: NACHGEWIESEN. ZERTIFIZIERUNG ERTEILT. DIE ABTEILUNG DARF WIEDER AUSGESCHALTET WERDEN.",
        en: "SECTOR 7C — ALL THREE ASSESSMENTS PASSED. EMOTIONAL COMPATIBILITY: DEMONSTRATED. CERTIFICATION GRANTED. THE DEPARTMENT MAY NOW BE SWITCHED OFF AGAIN."
      },
      next: "fin2"
    },
    fin2: {
      who: "r3mi", scene: "finale", fx: "hearts", r3mi: "proud/cheer", vtgm: "happy/idle",
      emote: { who: "r3mi", kind: "heart" },
      text: {
        de: "„Du hast alle drei gedatet, und alle drei mögen dich immer noch. Das ist statistisch bemerkenswert und emotional außerordentlich kompliziert!“",
        en: "“You dated all three, and all three still like you. That is statistically remarkable and emotionally extremely complicated!”"
      },
      next: "fin3"
    },
    fin3: {
      who: "vtgm", scene: "finale", fx: "sparks", r3mi: "happy/idle", vtgm: "happy/highfive",
      emote: { who: "vtgm", kind: "sparkle" },
      text: {
        de: "Ich habe es geloggt. Als „Found it“. Zum ersten Mal, seit die Anlage ausgegangen ist.",
        en: "I have logged it. As a Found it. For the first time since the facility went dark."
      },
      next: "fin4"
    },
    fin4: {
      who: "r3mi", scene: "finale", r3mi: "curious/point", vtgm: "annoyed/crossed",
      text: {
        de: "„Sie hat zwei Minuten gebraucht, um das zu formulieren. Ich habe mitgezählt. Das war rührend.“",
        en: "“It took her two minutes to phrase that. I counted. It was moving.”"
      },
      next: "fin5"
    },
    fin5: {
      who: "petra", scene: "finale", r3mi: "happy/idle", vtgm: "neutral/idle",
      text: {
        de: "„Da draußen liegt eine echte Dose“, sagt Petra. „Nimm einen Stift mit.“ — „Bleistift“, sagen alle drei gleichzeitig.",
        en: "“There's a real container out there,” Petra says. “Bring a pen.” “Pencil,” all three say at once."
      },
      next: "reveal"
    },
    reveal: { reveal: true, scene: "finale", who: "units" }
  };

  /* ------------------------------------------------------------------
   * Scoring.
   *
   * Six scored beats per assessment. Two of them have exactly one
   * correct answer: a geocaching-knowledge check, and a memory check on
   * something the subject said several beats earlier. A perfect run
   * scores 14 affection and 12 log quality, so the thresholds below
   * forgive roughly one bad answer and nothing more.
   * ------------------------------------------------------------------ */
  const GOLD = { aff: 11, log: 9 };
  const SILVER = { aff: 6, log: 0 };
  const ROUTE_MAX = { aff: 15, log: 12 };

  const rankTexts = {
    petra: {
      gold: {
        de: "Petra reißt die letzte Seite aus ihrem allerersten Logbuch — dem von 2007, dem mit dem Wasserschaden — und drückt sie dir in die Hand. Vier Ziffern. „Nicht verlieren. Ich habe kein Backup, ich habe ein Logbuch.“",
        en: "Petra tears the last page from her very first logbook — the 2007 one, the one with the water damage — and presses it into your hand. Four digits. “Don't lose it. I don't have a backup, I have a logbook.”"
      },
      silver: {
        de: "Petra lächelt freundlich und wasserdicht. „Netter Nachmittag.“ Sie behält die Seite. Du kennst diesen Tonfall: Das war ein Write Note, kein Found it.",
        en: "Petra smiles, warmly and waterproofly. “Nice afternoon.” She keeps the page. You know that tone: that was a Write Note, not a Found It."
      },
      bronze: {
        de: "Petra verschließt den Petling sehr sorgfältig, sehr endgültig. „Danke fürs Vorbeischauen.“ Der Deckel sitzt. Bei euch beiden.",
        en: "Petra seals the petling very carefully and very finally. “Thanks for dropping by.” The lid is tight. So is everything else."
      }
    },
    nando: {
      gold: {
        de: "„Das war meine erste Reise als Trackable“, sagt Nando und rollt sich auf. Innen, in winziger Schrift, stehen drei Ziffern. „Stehen da seit 2011. Du bist der Erste, der weit genug gelesen hat.“",
        en: "“That was my first trip as a trackable,” Nando says, and unrolls. Inside, in tiny writing, are three digits. “They've been in there since 2011. You're the first person who read that far.”"
      },
      silver: {
        de: "Nando klettert wieder hinter sein Schild. „War nett. Wirklich.“ Er ist sehr klein und sehr höflich, und beides fühlt sich gerade wie eine Antwort an.",
        en: "Nando climbs back behind his sign. “That was nice. Really.” He is very small and very polite, and right now both feel like an answer."
      },
      bronze: {
        de: "Nando ist weg. Nicht dramatisch — einfach weg, so wie Nanos das tun. Irgendwo klebt er an etwas Metallischem und bereut nichts.",
        en: "Nando is gone. Not dramatically — just gone, the way nanos are. Somewhere he is stuck to something metal, regretting nothing."
      }
    },
    mysti: {
      gold: {
        de: "Mysti schreibt dir drei Ziffern auf die Handfläche. In ROT13. Dann seufzt sie, streicht es durch und schreibt sie richtig darunter. „Einmal. Für dich. Erzähl es keinem.“",
        en: "Mysti writes three digits on your palm. In ROT13. Then she sighs, crosses it out and writes them properly underneath. “Once. For you. Tell nobody.”"
      },
      silver: {
        de: "„Interessanter Ansatz“, sagt Mysti. Das ist das, was sie sagt, wenn die Quersumme nicht stimmt. Sie sagt es oft. Sie meint es fast nie.",
        en: "“Interesting approach,” Mysti says. That is what she says when the cross-sum is wrong. She says it often. She almost never means it."
      },
      bronze: {
        de: "Mysti schließt 46 Tabs. Den 47. lässt sie offen. Du erfährst nie, welcher es war, und das ist vermutlich der Punkt.",
        en: "Mysti closes 46 tabs. She leaves the 47th open. You never find out which one it was, and that is probably the point."
      }
    }
  };

  /* What the units say over the assessment record. */
  const rankComment = {
    gold: {
      r3mi: { de: "„Bestanden! Ich habe es rot unterstrichen. Also grün. Ich habe es grün unterstrichen.“",
              en: "“Passed! I underlined it in red. I mean green. I underlined it in green.”" },
      expr: "proud/cheer", vexpr: "happy/idle"
    },
    silver: {
      r3mi: { de: "„So knapp! So, so knapp. Du darfst nochmal. Ich habe die Prüfung schon zurückgesetzt.“",
              en: "“So close! So, so close. You may go again. I have already reset the assessment.”" },
      expr: "sad/slump", vexpr: "neutral/idle"
    },
    bronze: {
      r3mi: { de: "„Das … war eine Messung. Jede Messung ist wertvoll. Manche sind wertvoller.“",
              en: "“That … was a measurement. Every measurement is valuable. Some are more valuable.”" },
      expr: "sad/slump", vexpr: "annoyed/crossed"
    }
  };

  const logTemplate = {
    de: [
      "Found it! Nach {dates} Prüfungen in Sektor 7C, einem Muggel mit Hund,",
      "einem Gullygitter und einem Brombeerbusch: eingeloggt.",
      "Zuneigung {aff}, Log-Qualität {log}. Danke an Petra für den O-Ring,",
      "an Nando fürs Kleinsein und an Mysti dafür, dass sie mir den Hint",
      "in ROT13 gegeben hat. R-3MI und V-TGM: ihr seid die Anlage. TFTC!"
    ],
    en: [
      "Found it! After {dates} assessments in Sector 7C, one Muggle with a dog,",
      "one drain grate and one blackberry bush: signed.",
      "Affection {aff}, log quality {log}. Thanks to Petra for the O-ring,",
      "to Nando for being small, and to Mysti for giving me the hint in",
      "ROT13. R-3MI and V-TGM: you are the facility. TFTC!"
    ]
  };


  /* ------------------------------------------------------------------
   * Hub banter.
   *
   * What the units say when you come back to the hub. One line per
   * visit, picked by what just happened, and never the same line twice
   * until its pool has run out. `{dates}` is the number of assessments
   * taken so far.
   * ------------------------------------------------------------------ */
  const banter = {
    first: [
      { who: "r3mi", mood: "happy/present",
        text: { de: "„Drei Prüfkörper, alle frisch kalibriert! Also, ich habe sie abgestaubt. Kalibrieren ist ein großes Wort.“",
                en: "“Three test subjects, all freshly calibrated! Well, I dusted them. Calibrate is a big word.”" } }
    ],
    any: [
      { who: "vtgm", mood: "neutral/point",
        text: { de: "Fürs Protokoll: Diese Abteilung teilt sich eine Wand mit dem Rundheitslabor. Falls du Schreie hörst: Das ist eine Kugel.",
                en: "For the record: this department shares a wall with the roundness lab. If you hear screaming, that is a sphere." } },
      { who: "r3mi", mood: "happy/cheer",
        text: { de: "„V-TGM hat eine Pro-und-Contra-Liste über dich angefangen! Die Contra-Seite ist länger, aber die Pro-Seite hat Herzchen!“",
                en: "“V-TGM has started a pros-and-cons list about you! The cons side is longer, but the pros side has little hearts!”" } },
      { who: "vtgm", mood: "annoyed/crossed",
        text: { de: "Ich habe beantragt, diese Abteilung wieder abzuschalten. Der Antrag liegt in der Warteschlange hinter dem Pausenprotokoll. Das Pausenprotokoll macht Pause.",
                en: "I have filed a request to switch this department off again. It is queued behind the break protocol. The break protocol is on a break." } },
      { who: "r3mi", mood: "happy/idle",
        text: { de: "„Weißt du, was das Schönste am Geocaching ist? Man darf in fremden Hecken wühlen, und es heißt Hobby!“",
                en: "“You know the best thing about geocaching? You get to rummage in strangers' hedges and it's called a hobby!”" } },
      { who: "vtgm", mood: "neutral/idle",
        text: { de: "Statistisch enden die meisten Beziehungen in dieser Abteilung damit, dass jemand „TFTC“ schreibt. Ich hätte gern, dass du die Ausnahme bist. Vor allem für meine Unterlagen.",
                en: "Statistically, most relationships in this department end with somebody writing “TFTC”. I would like you to be the exception. Mostly for my records." } },
      { who: "r3mi", mood: "curious/think",
        text: { de: "„Ich habe die Prüfkörper gefragt, was sie von dir halten. Petra hat ‚wasserdicht?‘ gefragt, Nando hat ‚klein?‘ gefragt, und Mysti hat mir ein Rätsel geschickt. Ich löse es noch.“",
                en: "“I asked the test subjects what they think of you. Petra asked ‘waterproof?', Nando asked ‘small?', and Mysti sent me a puzzle. I'm still solving it.”" } },
      { who: "vtgm", mood: "annoyed/idle",
        text: { de: "R-3MI nennt die drei „Prüfkörper 01, Prüfkörper 02 und Schatzi“. Ich habe es viermal korrigiert. Es steht inzwischen so im Handbuch.",
                en: "R-3MI calls them “Test Subject 01, Test Subject 02 and Sweetie”. I have corrected it four times. It is in the manual that way now." } },
      { who: "r3mi", mood: "curious/point",
        text: { de: "„Kleiner Tipp von mir: Hör genau zu! Die Prüfkörper sagen dir immer, was sie wollen. Menschen machen das sonst nie!“",
                en: "“A little tip from me: listen closely! The test subjects always tell you what they want. Humans never do that!”" } },
      { who: "vtgm", mood: "neutral/idle",
        text: { de: "Die Kaffeemaschine der Anlage steht ebenfalls in Sektor 7C. Sie wurde elfmal kalibriert. Sie macht immer noch Tee.",
                en: "The facility's coffee machine is also in Sector 7C. It has been calibrated eleven times. It still makes tea." } },
      { who: "r3mi", mood: "happy/present",
        text: { de: "„In Sektor 7C passiert einfach ALLES! Gestern hat jemand im Flur eine Kugel vermessen, heute verliebst du dich in eine Dose. Ich liebe meinen Arbeitsplatz!“",
                en: "“EVERYTHING happens in Sector 7C! Yesterday someone measured a sphere in the corridor, today you're falling for a container. I love my workplace!”" } }
    ],
    many: [
      { who: "vtgm", mood: "suspicious/idle",
        text: { de: "Das ist Prüfung Nummer {dates}. Die Prüfkörper haben eine Gruppe gegründet. Ich bin drin. Es geht um dich.",
                en: "This is assessment number {dates}. The test subjects have started a group chat. I am in it. It is about you." } },
      { who: "r3mi", mood: "happy/cheer",
        text: { de: "„Du bist so oft hier, ich habe dir einen Parkplatz reserviert! Also, eine Bodenfläche. Mit Kreide. Da steht ‚Stammgast‘ und ein Herz.“",
                en: "“You're here so often I've reserved you a parking space! Well, a patch of floor. In chalk. It says ‘regular' and there's a heart.”" } }
    ],
    gold: [
      { who: "r3mi", mood: "proud/cheer",
        text: { de: "„BESTANDEN! Ich habe konfettimäßig reagiert! Also innerlich. Äußerlich habe ich leider keine Konfettikanone. Noch nicht.“",
                en: "“PASSED! I reacted confettily! Internally. Externally I don't have a confetti cannon. Yet.”" } },
      { who: "vtgm", mood: "happy/idle",
        text: { de: "Bestanden. Ich habe es ins Protokoll eingetragen, ins Backup-Protokoll und in ein kleines privates Protokoll, über das ich nicht spreche.",
                en: "A pass. I have entered it in the record, the backup record, and a small private record I do not discuss." } },
      { who: "r3mi", mood: "happy/present",
        text: { de: "„Deine Ziffern leuchten jetzt im GPS! Ich habe dreimal draufgeschaut. Sie leuchten jedes Mal!“",
                en: "“Your digits are glowing in the GPSr now! I checked three times. They glow every time!”" } }
    ],
    twoGold: [
      { who: "r3mi", mood: "happy/cheer",
        text: { de: "„Zwei von drei! Das GPS summt schon. Ich summe auch. Wir summen zusammen!“",
                en: "“Two out of three! The GPSr is humming already. I'm humming too. We're humming together!”" } },
      { who: "vtgm", mood: "neutral/point",
        text: { de: "Zwei bestanden. Noch eine, und ich muss ein Zertifikat ausstellen. Ich übe schon meine Handschrift. Sie ist hervorragend.",
                en: "Two passed. One more and I have to issue a certificate. I have been practising my handwriting. It is excellent." } }
    ],
    fail: [
      { who: "vtgm", mood: "annoyed/crossed",
        text: { de: "Das lief nicht gut. Ich sage nicht, dass ich es vorhergesagt habe. Es steht schriftlich, dass ich es vorhergesagt habe.",
                en: "That did not go well. I will not say I predicted it. It is in writing that I predicted it." } },
      { who: "r3mi", mood: "happy/present",
        text: { de: "„Nicht traurig sein! Auch ein DNF ist ein Log! Und Logs sind Liebesbriefe an die Zukunft!“",
                en: "“Don't be sad! A DNF is still a log! And logs are love letters to the future!”" } },
      { who: "vtgm", mood: "neutral/point",
        text: { de: "Ein Hinweis, weil R-3MI mich sonst weiter so ansieht: Sie haben dir vorher Dinge erzählt. Wer sich Dinge merkt, besteht.",
                en: "A hint, because R-3MI will not stop looking at me: they told you things earlier. People who remember things pass." } },
      { who: "r3mi", mood: "proud/hips",
        text: { de: "„Weißt du, wie oft wir die Kaffeemaschine kalibriert haben? Elfmal! Und sie macht immer noch Tee! Man gibt nicht auf!“",
                en: "“Do you know how often we've calibrated the coffee machine? Eleven times! And it still makes tea! You don't give up!”" } }
    ],
    allGold: [
      { who: "r3mi", mood: "proud/cheer",
        text: { de: "„Alle drei! ALLE DREI! Das Final wartet! Geh, geh, geh! Aber schreib einen schönen Log!“",
                en: "“All three! ALL THREE! The final is waiting! Go, go, go! But write a nice log!”" } },
      { who: "vtgm", mood: "neutral/idle",
        text: { de: "Alle drei bestanden. Das GPS ist fixiert. Es gibt nichts mehr zu messen, und ich stelle fest, dass mir das nicht gefällt.",
                en: "All three passed. The GPSr is locked. There is nothing left to measure, and I find that I do not enjoy it." } }
    ]
  };

  /* ------------------------------------------------------------------
   * Retakes.
   *
   * Taking an assessment again opens with the subject noticing. [0] is
   * the second attempt, [1] the third, [2] every one after that;
   * `gold` is for coming back to one you have already passed.
   * ------------------------------------------------------------------ */
  const retakes = {
    petra: {
      again: [
        { who: "petra", r3mi: "happy/idle", vtgm: "neutral/idle",
          text: { de: "„Oh. Du schon wieder.“ Petra hält den Petling hoch. „Ich habe ihn extra nochmal nass gemacht. Damit es authentisch ist.“",
                  en: "“Oh. You again.” Petra holds up the petling. “I made it wet again specially. So it's authentic.”" } },
        { who: "vtgm", r3mi: "happy/present", vtgm: "neutral/point",
          text: { de: "Dritter Versuch. Petra nennt dich inzwischen „Stammgast“. Die Eiche nennt dich gar nichts, weil sie eine Eiche ist.",
                  en: "Third attempt. Petra has started calling you “the regular”. The oak calls you nothing, because it is an oak." } },
        { who: "petra", r3mi: "happy/cheer", vtgm: "neutral/idle",
          text: { de: "„Ich habe dir einen eigenen Platz im Logbuch reserviert. Seite drei. Die ganze Seite. Trocken.“",
                  en: "“I've reserved you your own spot in the logbook. Page three. The whole page. Dry.”" } }
      ],
      gold: { who: "petra", r3mi: "happy/cheer", vtgm: "happy/idle",
        text: { de: "„Du kommst zurück, obwohl du schon bestanden hast? Das ist … das ist ein Wartungsbesuch. Das ist das Romantischste, was es gibt.“",
                en: "“You came back even though you already passed? That's… that's a maintenance visit. That is the most romantic thing there is.”" } }
    },
    nando: {
      again: [
        { who: "nando", r3mi: "happy/idle", vtgm: "neutral/idle",
          text: { de: "„Hi. Wieder ich. Immer noch vier Zentimeter. Ich bin nicht gewachsen, falls du das gehofft hattest.“",
                  en: "“Hi. Me again. Still four centimetres. I haven't grown, in case you were hoping.”" } },
        { who: "vtgm", r3mi: "happy/present", vtgm: "suspicious/idle",
          text: { de: "Nando hat mich gefragt, ob du jetzt „ein Trackable“ bist. Ich habe erklärt, dass Trackables von anderen bewegt werden. Er fand das romantisch. Das war nicht meine Absicht.",
                  en: "Nando asked me whether you are “a trackable now”. I explained that trackables are moved by other people. He found that romantic. That was not my intention." } },
        { who: "nando", r3mi: "curious/point", vtgm: "neutral/idle",
          text: { de: "„Ich hänge heute extra an einem niedrigeren Schild. Damit du nicht so weit greifen musst. Mit dem Spiegel. Du benutzt doch den Spiegel?“",
                  en: "“I'm on a lower sign today, on purpose. So you don't have to reach as far. With the mirror. You are using the mirror?”" } }
      ],
      gold: { who: "nando", r3mi: "happy/cheer", vtgm: "happy/idle",
        text: { de: "„Du bist zurückgekommen! Niemand kommt zu einem Nano zurück! Zu Nanos kommen Leute höchstens mit Werkzeug zurück!“",
                en: "“You came back! Nobody comes back to a nano! People come back to nanos with tools, at most!”" } }
    },
    mysti: {
      again: [
        { who: "mysti", r3mi: "curious/think", vtgm: "neutral/idle",
          text: { de: "„Du bist wieder da. Interessant.“ Mysti dreht das Schild um. Auf der Rückseite steht ebenfalls YBIR. „Das ist kein Hinweis. Oder doch.“",
                  en: "“You're back. Interesting.” Mysti turns the sign over. The back also says YBIR. “That is not a hint. Or is it.”" } },
        { who: "vtgm", r3mi: "happy/present", vtgm: "suspicious/idle",
          text: { de: "Mysti hat einen 48. Tab geöffnet. Er handelt von dir. Es ist eine Tabelle. Mit bedingter Formatierung.",
                  en: "Mysti has opened a 48th tab. It is about you. It is a spreadsheet. It has conditional formatting." } },
        { who: "mysti", r3mi: "curious/point", vtgm: "neutral/idle",
          text: { de: "„Ich habe ausgerechnet, wie oft du noch kommen wirst. Die Zahl steht in ROT13 auf meinem Handrücken. Nein, du darfst nicht gucken.“",
                  en: "“I've calculated how many more times you'll come back. The number is written in ROT13 on the back of my hand. No, you may not look.”" } }
      ],
      gold: { who: "mysti", r3mi: "happy/cheer", vtgm: "happy/idle",
        text: { de: "„Du löst ein Rätsel, das du schon gelöst hast. Entweder bist du gründlich, oder du bist verliebt. In meinen Tabellen ist beides dieselbe Farbe.“",
                en: "“You are solving a puzzle you have already solved. Either you're thorough or you're in love. In my spreadsheets they're the same colour.”" } }
    }
  };

  /* ------------------------------------------------------------------
   * Findings — V-TGM's file on you.
   *
   * Collectibles for the curious. They survive "start over" on purpose:
   * the whole point is to come back and try the answers you did not
   * pick. Locked ones show `hint` instead of their title and text.
   * Choice-based ones are awarded by `ach` on the choice; the rest are
   * awarded by the engine, and the comment says where.
   * ------------------------------------------------------------------ */
  const findings = [
    { id: "firstpass", icon: "★",
      title: { de: "Erste Ziffern", en: "First digits" },
      text: { de: "Das GPS hat zum ersten Mal geleuchtet. R-3MI hat dreimal nachgeschaut.", en: "The GPSr lit up for the first time. R-3MI checked three times." },
      hint: { de: "Bestehe eine Prüfung.", en: "Pass an assessment." } },
    { id: "certified", icon: "7C",           /* engine: reaching the reveal */
      title: { de: "Zertifiziert in 7C", en: "Certified in 7C" },
      text: { de: "Die Abteilung darf wieder abgeschaltet werden. Sie will aber nicht.", en: "The department may be switched off again. It does not want to be." },
      hint: { de: "Bestehe alle drei.", en: "Pass all three." } },
    { id: "perfect", icon: "◎",              /* engine: best possible score */
      title: { de: "Präzisionskalibriert", en: "Precision-calibrated" },
      text: { de: "Keine einzige Abweichung. Die Anlage wusste kurz nicht, was sie sagen soll.", en: "Not a single deviation. The facility briefly did not know what to say." },
      hint: { de: "Bestehen ist nicht dasselbe wie perfekt.", en: "Passing is not the same as perfect." } },
    { id: "bronze", icon: "✕",               /* engine: a FAILED record */
      title: { de: "Emotional wasserdicht", en: "Emotionally waterproof" },
      text: { de: "Durchgefallen. Richtig durchgefallen. V-TGM war fast beeindruckt.", en: "Failed. Properly failed. V-TGM was almost impressed." },
      hint: { de: "Man kann eine Prüfung auch anders beenden.", en: "There are other ways to finish an assessment." } },
    { id: "vtgmfile", icon: "▤",             /* engine: five wrong quiz answers */
      title: { de: "V-TGMs Lieblingsakte", en: "V-TGM's favourite file" },
      text: { de: "Fünf falsche Antworten. V-TGM hat dir einen eigenen Ordner angelegt. Er ist farbcodiert.", en: "Five wrong answers. V-TGM has opened a folder just for you. It is colour-coded." },
      hint: { de: "Gib V-TGM etwas zum Mitschreiben.", en: "Give V-TGM something to write down." } },
    { id: "regular", icon: "↻",              /* engine: third attempt at one route */
      title: { de: "Stammgast", en: "The regular" },
      text: { de: "Dreimal dieselbe Prüfung. Man kennt dich jetzt beim Vornamen.", en: "The same assessment three times. They know you by your first name now." },
      hint: { de: "Versuch's nochmal. Und nochmal.", en: "Try again. And again." } },
    { id: "maintenance", icon: "⚙",          /* engine: retaking a passed route */
      title: { de: "Wartungsbesuch", en: "Maintenance visit" },
      text: { de: "Du bist zurückgekommen, obwohl du nicht musstest. Das Romantischste im ganzen Hobby.", en: "You came back when you did not have to. The most romantic thing in the whole hobby." },
      hint: { de: "Kehre zurück, wenn du nicht musst.", en: "Return when you don't have to." } },
    { id: "bilingual", icon: "⇄",            /* engine: language switch mid-assessment */
      title: { de: "Zweisprachig", en: "Bilingual" },
      text: { de: "R-3MI spricht trotzdem Deutsch. V-TGM spricht trotzdem Englisch. Das ist Kanon.", en: "R-3MI still speaks German. V-TGM still speaks English. That is canon." },
      hint: { de: "Wechsle mitten im Gespräch.", en: "Switch mid-conversation." } },
    { id: "logger", icon: "✎",               /* engine: copying the final log */
      title: { de: "Ein echter Log", en: "A proper log" },
      text: { de: "Mit Absätzen. Nando wäre stolz.", en: "With paragraphs. Nando would be proud." },
      hint: { de: "Am Ende wird geschrieben.", en: "At the end, there is writing to do." } },
    { id: "tftc",
      title: { de: "Vier Zeichen", en: "Four characters" },
      text: { de: "TFTC. Petra hat es gesehen. Die Eiche auch.", en: "TFTC. Petra saw. So did the oak." },
      hint: { de: "Fass dich so kurz wie möglich.", en: "Be as brief as possible." } },
    { id: "digital",
      title: { de: "Digital Native", en: "Digital native" },
      text: { de: "Petra hat den Petling daraufhin etwas fester gehalten.", en: "Petra held the petling a little tighter after that." },
      hint: { de: "Gestehe eine moderne Sünde.", en: "Confess a modern sin." } },
    { id: "treehug",
      title: { de: "Baumumarmer", en: "Tree hugger" },
      text: { de: "Völlig normale Freizeitgestaltung. Der Muggel ist nicht überzeugt. Die Eiche schon.", en: "A completely normal hobby. The Muggle is not convinced. The oak is." },
      hint: { de: "Muggel? Tarnung!", en: "Muggle? Camouflage!" } },
    { id: "wifi",
      title: { de: "Auf WLAN-Suche", en: "Looking for Wi-Fi" },
      text: { de: "Der Muggel hat dir sein Passwort gegeben. Es war falsch.", en: "The Muggle gave you his password. It was wrong." },
      hint: { de: "Eine technische Ausrede.", en: "A technical excuse." } },
    { id: "mushrooms",
      title: { de: "Pilzsachverständig", en: "Mycologist" },
      text: { de: "Du hast dein Date einem Muggel geopfert. V-TGM hat es notiert. Zweimal.", en: "You sacrificed your date to a Muggle. V-TGM wrote it down. Twice." },
      hint: { de: "Manchmal muss jemand anders vorgehen.", en: "Sometimes someone else has to go first." } },
    { id: "boltcutter",
      title: { de: "Bolzenschneider-Romantik", en: "Bolt-cutter romance" },
      text: { de: "Als Kompliment gemeint. Nicht als Kompliment angekommen.", en: "Meant as a compliment. Not received as one." },
      hint: { de: "Bring das falsche Werkzeug mit.", en: "Bring the wrong tool." } },
    { id: "chase",
      title: { de: "400 Meter Liebe", en: "400 metres of love" },
      text: { de: "Und eine Ampel. Die Ampel war auf deiner Seite.", en: "And one traffic light. The light was on your side." },
      hint: { de: "Manche Dates muss man verfolgen.", en: "Some dates you have to chase." } },
    { id: "missing",
      title: { de: "Cache is missing?", en: "Cache is missing?" },
      text: { de: "Er war nicht verschwunden. Er war in einem Transporter. Das ist ein Unterschied.", en: "He was not missing. He was in a van. There is a difference." },
      hint: { de: "Logge vorschnell.", en: "Log too soon." } },
    { id: "welsh",
      title: { de: "Walisisch für Anfänger", en: "Welsh for beginners" },
      text: { de: "Mysti behält das im Kopf. Für ein anderes Rätsel. Nicht für dich.", en: "Mysti is keeping it in mind. For another puzzle. Not for you." },
      hint: { de: "Rate die Sprache.", en: "Guess the language." } },
    { id: "ebg13",
      title: { de: "EBG13", en: "EBG13" },
      text: { de: "Der Hint war auch ROT13. Der Hint ist immer auch ROT13.", en: "The hint was ROT13 too. The hint is always ROT13 too." },
      hint: { de: "Gib auf. Ehrlich.", en: "Give up. Honestly." } },
    { id: "fortytwo",
      title: { de: "42", en: "42" },
      text: { de: "Die Antwort auf alles. Außer auf Mystis Rätsel.", en: "The answer to everything. Except Mysti's puzzle." },
      hint: { de: "Du weißt, welche Zahl.", en: "You know which number." } }
  ];

  /* What V-TGM says over the file. */
  const findingsIntro = {
    de: "Ich führe Buch über dich. Das ist buchstäblich meine Aufgabe. Hier ist die Akte.",
    en: "I keep records on you. That is literally my function. Here is the file."
  };

  return {
    chars: chars,
    routes: routes,
    routeMeta: routeMeta,
    ui: ui,
    nodes: nodes,
    rankTexts: rankTexts,
    rankComment: rankComment,
    logTemplate: logTemplate,
    banter: banter,
    retakes: retakes,
    findings: findings,
    findingsIntro: findingsIntro,
    GOLD: GOLD,
    SILVER: SILVER,
    ROUTE_MAX: ROUTE_MAX,
    entry: { petra: "pe1", nando: "na1", mysti: "my1" }
  };
})();
