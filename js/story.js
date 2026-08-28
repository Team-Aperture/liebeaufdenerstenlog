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
      sector: "SEKTOR 12 - EMOTIONALE VERTRAEGLICHKEIT",
      /* The two lines along the bottom of the badge. `sectorTab` is the
       * code in the little certification tab in the corner. */
      facilityTag: "EINRICHTUNG ZUR PRAEZISIONSKALIBRIERUNG",
      sectorTab: "12",
      motto: "TESTEN. MESSEN. VERLIEBEN.",
      subtitle: "Sektor 12 der Kalibrierungsanlage — mit Final-Koordinaten",
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
        "SEKTOR 12 ... EMOTIONALE VERTRAEGLICHKEIT",
        "PRUEFKOERPER 01 / 02 / 03 ... ONLINE",
        "MOBILE EINHEITEN ... R-3MI, V-TGM",
        "ZERTIFIZIERUNG 7C ... GUELTIG",
        "SEKTOR 12 ENTSPERRT."
      ],
      needAll: "Alle drei Prüfungen bestehen, dann rastet das GPS ein."
    },
    en: {
      cacheName: "Love On The First Log",
      cacheNameLines: ["Love On", "The First Log"],
      facility: "DIE KALIBRIERUNGSANLAGE",
      sector: "SECTOR 12 - EMOTIONAL COMPATIBILITY",
      facilityTag: "PRECISION CALIBRATION FACILITY",
      sectorTab: "12",
      motto: "TESTEN. MESSEN. VERLIEBEN.",
      subtitle: "Sector 12 of the Calibration Facility — with final coordinates",
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
        "SECTOR 12 ... EMOTIONAL COMPATIBILITY",
        "TEST SUBJECTS 01 / 02 / 03 ... ONLINE",
        "MOBILE UNITS ... R-3MI, V-TGM",
        "CERTIFICATION 7C ... VALID",
        "SECTOR 12 UNLOCKED."
      ],
      needAll: "Pass all three assessments and the GPSr locks on."
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
        de: "SEKTOR 12 — EMOTIONALE VERTRÄGLICHKEIT. LETZTE KALIBRIERUNG: VOR SEHR LANGER ZEIT. BESUCHER ERKANNT.",
        en: "SECTOR 12 — EMOTIONAL COMPATIBILITY. LAST CALIBRATION: A VERY LONG TIME AGO. VISITOR DETECTED."
      },
      next: "pro2"
    },
    pro2: {
      who: "r3mi", scene: "event", r3mi: "happy/cheer", vtgm: "suspicious/idle",
      emote: { who: "r3mi", kind: "sparkle" },
      text: {
        de: "„Oh! Ein Besucher! In Sektor 12! Weißt du, wie lange ich auf einen Besucher in Sektor 12 gewartet habe?“",
        en: "“Oh! A visitor! In Sector 12! Do you know how long I have been waiting for a visitor in Sector 12?”"
      },
      next: "pro3"
    },
    pro3: {
      who: "vtgm", scene: "event", r3mi: "happy/present", vtgm: "annoyed/crossed",
      text: {
        de: "Sektor 12 sollte nie wieder hochgefahren werden.",
        en: "Sector 12 was never meant to come back online."
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
        { t: { de: "„TFTC.“ Und weitergehen.", en: "“TFTC.” And walk on." }, to: "pe1c", aff: -2, log: -2 }
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
        { t: { de: "„Ich logge eigentlich nur noch digital.“", en: "“I only really log digitally these days.”" }, to: "pe3", aff: -1, log: -1 }
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
        { t: { de: "Den Baum umarmen. Völlig normale Freizeitgestaltung.", en: "Hug the tree. A completely normal hobby." }, to: "pe5", aff: 2, log: 1 },
        { t: { de: "Laut rufen: „Ich suche nur mein WLAN!“", en: "Shout: “I'm only looking for my Wi-Fi!”" }, to: "pe5", aff: 1, log: 0 },
        { t: { de: "Petra vorschieben und „Pilze!“ rufen.", en: "Push Petra forward and yell “Mushrooms!”" }, to: "pe5", aff: -2, log: 0 }
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
        { t: { de: "Bolzenschneider zücken. Als Kompliment gemeint.", en: "Produce bolt cutters. Meant as a compliment." }, to: "na1c", aff: -2, log: -2 }
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
        { t: { de: "Hinterherrennen. Es sind nur 400 Meter. Und eine Ampel.", en: "Run after it. It's only 400 metres. And one traffic light." }, to: "na7", aff: 2, log: 1, fx: "sparks" },
        { t: { de: "Das Kennzeichen notieren und dem Owner schreiben.", en: "Note the plate and message the owner." }, to: "na7", aff: 1, log: 2 },
        { t: { de: "Ein Foto machen und „Cache is missing?“ loggen.", en: "Take a photo and log “Cache is missing?”" }, to: "na7", aff: -2, log: -2 }
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
        { t: { de: "„Ist das Walisisch?“", en: "“Is that Welsh?”" }, to: "my1b", aff: 0, log: 0 },
        { t: { de: "„Ich gebe auf. Gib mir den Hint.“", en: "“I give up. Give me the hint.”" }, to: "my1c", aff: 1, log: 0 }
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
        { t: { de: "In jedes Feld „42“ schreiben und hoffen.", en: "Put “42” in every field and hope." }, to: "my5", aff: 1, log: 0 },
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
        de: "SEKTOR 12 — ALLE DREI PRÜFUNGEN BESTANDEN. EMOTIONALE VERTRÄGLICHKEIT: NACHGEWIESEN. ZERTIFIZIERUNG 7C ERTEILT.",
        en: "SECTOR 12 — ALL THREE ASSESSMENTS PASSED. EMOTIONAL COMPATIBILITY: DEMONSTRATED. CERTIFICATION 7C GRANTED."
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
      "Found it! Nach {dates} Prüfungen in Sektor 12, einem Muggel mit Hund,",
      "einem Gullygitter und einem Brombeerbusch: eingeloggt.",
      "Zuneigung {aff}, Log-Qualität {log}. Danke an Petra für den O-Ring,",
      "an Nando fürs Kleinsein und an Mysti dafür, dass sie mir den Hint",
      "in ROT13 gegeben hat. R-3MI und V-TGM: ihr seid die Anlage. TFTC!"
    ],
    en: [
      "Found it! After {dates} assessments in Sector 12, one Muggle with a dog,",
      "one drain grate and one blackberry bush: signed.",
      "Affection {aff}, log quality {log}. Thanks to Petra for the O-ring,",
      "to Nando for being small, and to Mysti for giving me the hint in",
      "ROT13. R-3MI and V-TGM: you are the facility. TFTC!"
    ]
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
    GOLD: GOLD,
    SILVER: SILVER,
    ROUTE_MAX: ROUTE_MAX,
    entry: { petra: "pe1", nando: "na1", mysti: "my1" }
  };
})();
