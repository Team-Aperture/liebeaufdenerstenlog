/* =====================================================================
 * story.js — cast, interface strings and every line of the script.
 *
 * Every piece of prose is a { de, en } pair. Nothing else in the code
 * base contains user-facing text, so translating the game means editing
 * this one file and nothing else.
 * ===================================================================== */
"use strict";

window.STORY = (function () {

  /* ------------------------------------------------------------------
   * Cast
   * ------------------------------------------------------------------ */
  const chars = {
    you:   { name: { de: "Du", en: "You" },       tint: "#ffd15c", sprite: "you" },
    t4tc:  { name: { de: "T4-TC", en: "T4-TC" },  tint: "#ff8ab5", sprite: "t4tc" },
    dnf:   { name: { de: "D-NF", en: "D-NF" },    tint: "#79c6c0", sprite: "dnf" },
    bots:  { name: { de: "T4-TC & D-NF", en: "T4-TC & D-NF" }, tint: "#c3a8d8", sprite: "t4tc" },
    petra: { name: { de: "Petra Petling", en: "Petra Petling" }, tint: "#3f8f5e", sprite: "petra" },
    nando: { name: { de: "Nando Nano", en: "Nando Nano" },       tint: "#7d8794", sprite: "nando" },
    mysti: { name: { de: "Mysti Fünf-Sterne", en: "Mysti Five-Star" }, tint: "#7a4fae", sprite: "mysti" }
  };

  const routes = ["petra", "nando", "mysti"];

  const routeMeta = {
    petra: {
      scene: "forest",
      tagline: {
        de: "Klassisch, wasserdicht, emotional leicht feucht.",
        en: "Classic, waterproof, emotionally a little damp."
      },
      dt: "D 1.5 / T 2.0",
      size: { de: "Größe: normal", en: "Size: regular" }
    },
    nando: {
      scene: "city",
      tagline: {
        de: "Winzig, magnetisch, schwer zu greifen.",
        en: "Tiny, magnetic, hard to get hold of."
      },
      dt: "D 2.5 / T 1.5",
      size: { de: "Größe: micro", en: "Size: micro" }
    },
    mysti: {
      scene: "ruins",
      tagline: {
        de: "Kompliziert, rätselhaft, 47 Tabs offen.",
        en: "Complicated, cryptic, 47 tabs open."
      },
      dt: "D 5.0 / T 3.5",
      size: { de: "Größe: unbekannt", en: "Size: unknown" }
    }
  };

  /* ------------------------------------------------------------------
   * Interface strings
   * ------------------------------------------------------------------ */
  const ui = {
    de: {
      subtitle: "Ein Geocaching-Datingspiel mit Final-Koordinaten",
      start: "▶ Spiel starten",
      resume: "▶ Weiterspielen",
      newGame: "Neu anfangen",
      affection: "Zuneigung",
      logQuality: "Log-Qualität",
      restart: "↻ Neustart",
      sound: "Ton",
      on: "AN",
      off: "AUS",
      lang: "EN",
      hint: "Antwort antippen oder Tasten 1–3. Enter = weiter.",
      continue: "Weiter",
      saved: "Fortschritt wird lokal gespeichert",
      confirm: "Wirklich alles löschen und neu anfangen?",
      gpsTitle: "FINAL-KOORDINATEN",
      gpsSearching: "Suche Satelliten …",
      gpsLocked: "POSITION FIXIERT",
      gpsSubtitle: "Jedes gelungene Date gibt einen Teil frei.",
      posted: "Listing-Koordinaten",
      checksum: "Quersumme aller Ziffern",
      copy: "Koordinaten kopieren",
      copied: "Kopiert!",
      openMap: "Karte öffnen",
      checker: "Lösung prüfen",
      hintLabel: "Hinweis (ROT13)",
      distance: "Entfernung vom Listing",
      hub: "Wen datest du als Nächstes?",
      hubSub: "Drei Caches. Drei Herzen. Zehn Ziffern.",
      statusOpen: "offen",
      statusGold: "★ GOLD — Ziffern gesichert",
      statusSilver: "SILBER — nochmal versuchen",
      statusBronze: "DNF — nochmal versuchen",
      replay: "Date wiederholen",
      goFinal: "Zum Final",
      rank: "WERTUNG",
      shardWon: "ZIFFERN FREIGESCHALTET",
      shardLost: "KEINE ZIFFERN",
      backToHub: "Zurück zur Event-Wiese",
      yourLog: "Dein Log-Eintrag",
      copyLog: "Log kopieren",
      endingTitle: "GEFUNDEN",
      cacheOwner: "Owner",
      disclaimer: "Inoffizielles, nicht-kommerzielles Fanprojekt. Nicht mit Geocaching HQ / Groundspeak verbunden. Alle Figuren sind erfunden. Bitte verantwortungsvoll cachen und die Muggel nicht füttern.",
      offlineReady: "Offline spielbar",
      skip: "Text sofort anzeigen",
      routeDone: "erledigt"
    },
    en: {
      subtitle: "A geocaching dating sim that hands you the final coordinates",
      start: "▶ Start game",
      resume: "▶ Continue",
      newGame: "Start over",
      affection: "Affection",
      logQuality: "Log quality",
      restart: "↻ Restart",
      sound: "Sound",
      on: "ON",
      off: "OFF",
      lang: "DE",
      hint: "Tap an answer or press 1–3. Enter to advance.",
      continue: "Continue",
      saved: "Progress is saved on this device",
      confirm: "Erase everything and start over?",
      gpsTitle: "FINAL COORDINATES",
      gpsSearching: "Acquiring satellites …",
      gpsLocked: "POSITION LOCKED",
      gpsSubtitle: "Every date that goes well releases a piece.",
      posted: "Posted coordinates",
      checksum: "Cross-sum of all digits",
      copy: "Copy coordinates",
      copied: "Copied!",
      openMap: "Open map",
      checker: "Check solution",
      hintLabel: "Hint (ROT13)",
      distance: "Distance from posted",
      hub: "Who are you dating next?",
      hubSub: "Three caches. Three hearts. Ten digits.",
      statusOpen: "open",
      statusGold: "★ GOLD — digits secured",
      statusSilver: "SILVER — try again",
      statusBronze: "DNF — try again",
      replay: "Redo this date",
      goFinal: "To the final",
      rank: "RATING",
      shardWon: "DIGITS UNLOCKED",
      shardLost: "NO DIGITS",
      backToHub: "Back to the event field",
      yourLog: "Your log entry",
      copyLog: "Copy log",
      endingTitle: "FOUND IT",
      cacheOwner: "Owner",
      disclaimer: "Unofficial, non-commercial fan project. Not affiliated with Geocaching HQ / Groundspeak. All characters are fictional. Please cache responsibly and do not feed the Muggles.",
      offlineReady: "Playable offline",
      skip: "Show full text",
      routeDone: "done"
    }
  };

  /* ------------------------------------------------------------------
   * Script
   *
   * Node shape:
   *   who      speaker key
   *   scene    backdrop id
   *   weather  "rain" | "muggle" | undefined
   *   fx       "hearts" | "sparks" | "thorns" | "shake"
   *   text     { de, en }
   *   next     id for a plain Continue
   *   choices  [{ t:{de,en}, to, aff, log, fx }]
   *   route    marks this node as part of a date route
   *   end      route id — finish the route and score it
   * ------------------------------------------------------------------ */
  const nodes = {

    /* ================= PROLOGUE ================= */
    pro1: {
      who: "t4tc", scene: "event",
      text: {
        de: "Willkommen beim Mega-Event „Liebe auf den ersten Log“! Ich bin T4-TC, dein Kommentator-Drohnchen, und ich finde ALLES großartig!",
        en: "Welcome to the “Love at First Log” mega-event! I'm T4-TC, your commentary drone, and I think EVERYTHING is wonderful!"
      },
      next: "pro2"
    },
    pro2: {
      who: "dnf", scene: "event",
      text: {
        de: "Und ich bin D-NF. Ich habe 4.112 Fehlversuche geloggt und null Beziehungen. Statistisch gesehen findest du heute nichts.",
        en: "And I'm D-NF. I have logged 4,112 did-not-finds and zero relationships. Statistically, you will find nothing today."
      },
      next: "pro3"
    },
    pro3: {
      who: "t4tc", scene: "event",
      text: {
        de: "Ignorier ihn. Der Deal: drei Caches, drei Herzen. Jedes Date, das richtig gut läuft, gibt dir einen Teil der Final-Koordinaten. Alle drei — und dein GPS rastet ein.",
        en: "Ignore him. Here's the deal: three caches, three hearts. Every date that goes really well hands you a piece of the final coordinates. All three, and your GPSr locks on."
      },
      next: "pro4"
    },
    pro4: {
      who: "dnf", scene: "event",
      text: {
        de: "Zur Klarstellung: Du musst mit allen dreien ausgehen. Parallel. Die Community wird das in den Logs diskutieren.",
        en: "For clarity: you must date all three. Concurrently. The community will discuss this in the logs."
      },
      next: "pro5"
    },
    pro5: {
      who: "t4tc", scene: "event", fx: "hearts",
      text: {
        de: "Das nennt man einen Multi. Ab dafür!",
        en: "That's called a multi-cache. Off you go!"
      },
      next: "hub"
    },

    /* The hub is generated at runtime — see game.js. */
    hub: { hub: true, scene: "event", who: "bots" },

    /* ================= PETRA — the forest ================= */
    pe1: {
      route: "petra", who: "petra", scene: "forest",
      text: {
        de: "Du findest Petra unter einer sehr romantischen Eiche. Sie hält einen Petling hoch, aus dem Wasser läuft. „Hallo! Mein Logbuch ist ein Smoothie.“",
        en: "You find Petra beneath a very romantic oak. She holds up a petling with water running out of it. “Hi! My logbook is a smoothie.”"
      },
      choices: [
        { t: { de: "Wartungsset zücken. Trockenes Logbuch, neuer O-Ring, frischer Bleistift.", en: "Produce a maintenance kit. Dry logbook, new O-ring, fresh pencil." }, to: "pe2a", aff: 2, log: 2, fx: "hearts" },
        { t: { de: "„TFTC.“ Und weitergehen.", en: "“TFTC.” And walk on." }, to: "pe2b", aff: -1, log: -2 },
        { t: { de: "Den Kassenbon von 2019 als Tauschgegenstand loben.", en: "Praise the 2019 receipt as excellent swag." }, to: "pe2c", aff: 1, log: 0 }
      ]
    },
    pe2a: {
      route: "petra", who: "petra", scene: "forest",
      text: {
        de: "Petra sieht dich an, wie andere Leute Sonnenuntergänge ansehen. „Du hast einen ERSATZ-O-RING dabei.“ — „Zwei“, sagst du. Irgendwo in den Bäumen fällt D-NF ein Rotor ab.",
        en: "Petra looks at you the way other people look at sunsets. “You are carrying a SPARE O-RING.” “Two,” you say. Somewhere in the trees, D-NF drops a rotor."
      },
      next: "pe3"
    },
    pe2b: {
      route: "petra", who: "dnf", scene: "forest",
      text: {
        de: "D-NF: „Log geschrieben: TFTC. Vier Zeichen. Ich habe es archiviert. Im Herzen ebenfalls.“ T4-TC weint sehr leise Kühlflüssigkeit.",
        en: "D-NF: “Log written: TFTC. Four characters. I have archived it. Also emotionally.” T4-TC quietly weeps coolant."
      },
      next: "pe3"
    },
    pe2c: {
      route: "petra", who: "petra", scene: "forest",
      text: {
        de: "„Ein Kassenbon“, sagt Petra andächtig. „Von 2019. Für einen Kaffee. Manche nennen das Müll. Ich nenne es einen Trackable ohne Ambitionen.“",
        en: "“A receipt,” Petra says reverently. “From 2019. For a coffee. Some people call that litter. I call it a trackable with no ambition.”"
      },
      next: "pe3"
    },
    pe3: {
      route: "petra", who: "bots", scene: "forest", weather: "muggle",
      text: {
        de: "Ein Muggel mit Hund biegt um die Eiche. Der Hund hat euch schon gefunden. Der Muggel hat noch Hoffnung.",
        en: "A Muggle with a dog comes round the oak. The dog has already found you. The Muggle still has hope."
      },
      choices: [
        { t: { de: "Den Baum umarmen. Völlig normale Freizeitgestaltung.", en: "Hug the tree. A completely normal hobby." }, to: "pe4a", aff: 2, log: 1 },
        { t: { de: "Laut rufen: „Ich suche nur mein WLAN!“", en: "Shout: “I'm only looking for my Wi-Fi!”" }, to: "pe4b", aff: 1, log: 0 },
        { t: { de: "Petra vorschieben und „Pilze!“ rufen.", en: "Push Petra forward and yell “Mushrooms!”" }, to: "pe4c", aff: -1, log: 0 }
      ]
    },
    pe4a: {
      route: "petra", who: "petra", scene: "forest", weather: "muggle",
      text: {
        de: "Ihr umarmt beide den Baum. Der Muggel nickt respektvoll und geht weiter. Der Hund bleibt. Der Hund weiß Bescheid. Der Hund war schon immer FTF.",
        en: "You both hug the tree. The Muggle nods respectfully and moves on. The dog stays. The dog knows. The dog has always been FTF."
      },
      next: "pe5"
    },
    pe4b: {
      route: "petra", who: "bots", scene: "forest", weather: "muggle",
      text: {
        de: "Der Muggel zeigt dir wortlos die volle Netzabdeckung auf seinem Handy. Petra flüstert: „Das war mutig und komplett falsch, und ich mag beides.“",
        en: "The Muggle silently shows you the full signal bars on his phone. Petra whispers: “That was brave and completely wrong, and I like both.”"
      },
      next: "pe5"
    },
    pe4c: {
      route: "petra", who: "petra", scene: "forest", weather: "muggle",
      text: {
        de: "Petra hält dem Muggel eine zwanzigminütige Vorlesung über Pilze, die sie sich vollständig ausdenkt. Der Muggel geht beeindruckt. Petra sieht dich an. „Nie wieder.“",
        en: "Petra gives the Muggle a twenty-minute lecture on mushrooms that she invents entirely. The Muggle leaves impressed. Petra looks at you. “Never again.”"
      },
      next: "pe5"
    },
    pe5: {
      route: "petra", who: "petra", scene: "forest", weather: "rain",
      text: {
        de: "Es fängt an zu regnen. Natürlich. Das trockene Logbuch liegt offen auf dem Stein.",
        en: "It starts to rain. Of course it does. The dry logbook is lying open on the rock."
      },
      choices: [
        { t: { de: "Die eigene Jacke drüber. Du bist ohnehin schon nass.", en: "Own jacket over it. You're soaked anyway." }, to: "pe6", aff: 2, log: 1, fx: "hearts" },
        { t: { de: "Zip-Beutel. Ich habe immer einen Zip-Beutel.", en: "Zip bag. I always have a zip bag." }, to: "pe6", aff: 1, log: 2 },
        { t: { de: "Mit Kugelschreiber loggen. Der verläuft ja nicht … oh.", en: "Log it in ballpoint. That doesn't run … oh." }, to: "pe6", aff: 0, log: -1 }
      ]
    },
    pe6: {
      route: "petra", who: "petra", scene: "forest", weather: "rain",
      end: "petra",
      text: {
        de: "Ihr steht unter der Eiche: zwei nasse Menschen und eine trockene Dose.",
        en: "You stand under the oak: two soaked humans and one dry container."
      }
    },

    /* ================= NANDO — the city ================= */
    na1: {
      route: "nando", who: "nando", scene: "city",
      text: {
        de: "Nando hängt magnetisch hinter einem Verkehrsschild. „Hi. Ich bin im echten Leben kleiner als auf dem Profilbild.“ Er ist vier Zentimeter.",
        en: "Nando is stuck magnetically behind a road sign. “Hi. I'm smaller in real life than in my profile picture.” He is four centimetres."
      },
      choices: [
        { t: { de: "„Größe ist auch nur eine D/T-Wertung.“", en: "“Size is just another D/T rating.”" }, to: "na2a", aff: 2, log: 1, fx: "hearts" },
        { t: { de: "Bolzenschneider zücken. Als Kompliment gemeint.", en: "Produce bolt cutters. Meant as a compliment." }, to: "na2b", aff: -2, log: -1 },
        { t: { de: "Mit einem Inspektionsspiegel diskret suchen.", en: "Search discreetly with an inspection mirror." }, to: "na2c", aff: 1, log: 2 }
      ]
    },
    na2a: {
      route: "nando", who: "nando", scene: "city",
      text: {
        de: "Nando schweigt kurz. „Weißt du, wie oft ich das höre?“ — „Oft?“ — „Nie. Kein einziges Mal. Leute sagen ‚ach, DAS ist der Cache‘ und klingen dabei enttäuscht.“",
        en: "Nando goes quiet. “Do you know how often I hear that?” “Often?” “Never. Not once. People say ‘oh, THAT'S the cache' in a distinctly disappointed voice.”"
      },
      next: "na3"
    },
    na2b: {
      route: "nando", who: "dnf", scene: "city",
      text: {
        de: "D-NF: „Ich muss dich darauf hinweisen, dass Werkzeuge nur nötig sind, wenn der Owner es im Listing erlaubt.“ T4-TC: „Und dass man Dates nicht aufschneidet!“",
        en: "D-NF: “I must point out that tools are only appropriate if the listing says so.” T4-TC: “And that you do not cut open your date!”"
      },
      next: "na3"
    },
    na2c: {
      route: "nando", who: "nando", scene: "city",
      text: {
        de: "„Ein Spiegel“, sagt Nando anerkennend. „Kein Abtasten, kein Gezerre, keine beschädigte Halterung. Du bist der erste Mensch seit Mai, der mich nicht angefasst hat wie ein Kaugummi.“",
        en: "“A mirror,” says Nando approvingly. “No groping, no yanking, no damaged mount. You are the first person since May who did not handle me like chewing gum.”"
      },
      next: "na3"
    },
    na3: {
      route: "nando", who: "bots", scene: "city",
      text: {
        de: "Eine Gruppe Muggel stellt sich direkt vor die Dose und diskutiert seit zwölf Minuten über einen Parkschein.",
        en: "A group of Muggles plants itself directly in front of the cache and has been discussing a parking ticket for twelve minutes."
      },
      choices: [
        { t: { de: "Eine spontane Stadtführung improvisieren.", en: "Improvise a spontaneous walking tour." }, to: "na4a", aff: 2, log: 2 },
        { t: { de: "Ehrlich einen DNF loggen und Eis essen gehen.", en: "Log an honest DNF and go get ice cream." }, to: "na4b", aff: 1, log: 2 },
        { t: { de: "„SCHAUT MAL, EIN TRACKABLE!“ rufen und zugreifen.", en: "Shout “LOOK, A TRACKABLE!” and grab." }, to: "na4c", aff: 0, log: -1 }
      ]
    },
    na4a: {
      route: "nando", who: "bots", scene: "city",
      text: {
        de: "Du erfindest die Geschichte dieses Laternenmastes. Sie ist bewegend. Zwei Muggel machen Fotos. Einer fragt nach deinem Instagram. T4-TC: „ZEHN VON ZEHN!“",
        en: "You invent the history of this lamppost. It is moving. Two Muggles take photos. One asks for your Instagram. T4-TC: “TEN OUT OF TEN!”"
      },
      next: "na5"
    },
    na4b: {
      route: "nando", who: "nando", scene: "city",
      text: {
        de: "„Du hast einen DNF geloggt, obwohl ich neben dir stehe“, sagt Nando gerührt. „Das ist die ehrlichste Sache, die je jemand für mich getan hat.“ Das Eis ist auch gut.",
        en: "“You logged a DNF while I was standing right next to you,” Nando says, moved. “That is the most honest thing anyone has done for me.” The ice cream is good too."
      },
      next: "na5"
    },
    na4c: {
      route: "nando", who: "bots", scene: "city",
      text: {
        de: "Alle sieben Muggel drehen sich gleichzeitig um. Du hältst einen vier Zentimeter großen Mann in der Hand. Es folgt eine Stille, die niemand von euch je vergessen wird.",
        en: "All seven Muggles turn round at once. You are holding a four-centimetre man. There follows a silence none of you will ever forget."
      },
      next: "na5"
    },
    na5: {
      route: "nando", who: "bots", scene: "city", fx: "shake",
      text: {
        de: "Ein Transporter parkt ein. Nando — magnetisch, klein, romantisch impulsiv — heftet sich an die Seitentür. Der Transporter fährt los.",
        en: "A van pulls in. Nando — magnetic, tiny, romantically impulsive — attaches himself to the side door. The van drives away."
      },
      choices: [
        { t: { de: "Hinterherrennen. Es sind nur 400 Meter. Und eine Ampel.", en: "Run after it. It's only 400 metres. And one traffic light." }, to: "na6", aff: 2, log: 1, fx: "sparks" },
        { t: { de: "Das Kennzeichen notieren und im Listing als Hinweis ergänzen.", en: "Note the plate and add it to the listing as a hint." }, to: "na6", aff: 1, log: 2 },
        { t: { de: "Ein Foto machen und „Cache is missing?“ loggen.", en: "Take a photo and log “Cache is missing?”" }, to: "na6", aff: -1, log: -2 }
      ]
    },
    na6: {
      route: "nando", who: "nando", scene: "city",
      end: "nando",
      text: {
        de: "Der Transporter hält an der Ampel. Nando fällt ab und landet in deiner Handfläche.",
        en: "The van stops at a red light. Nando drops off and lands in your palm."
      }
    },

    /* ================= MYSTI — the ruin ================= */
    my1: {
      route: "mysti", who: "mysti", scene: "ruins",
      text: {
        de: "Mysti wartet an der Ruine mit 47 offenen Browser-Tabs und einem Blick, der sagt: Das hier wird keine schnelle Nummer. „Bevor wir essen gehen: eine Kleinigkeit.“",
        en: "Mysti waits at the ruin with 47 browser tabs open and a look that says this will not be quick. “Before dinner: one small thing.”"
      },
      next: "my2"
    },
    my2: {
      route: "mysti", who: "mysti", scene: "ruins",
      text: {
        de: "Sie hält ein Schild hoch. Darauf steht: YBIR. „Mein Standard-Icebreaker. Fünf Leute haben ihn als Beleidigung aufgefasst.“",
        en: "She holds up a sign. It reads: YBIR. “My standard icebreaker. Five people took it as an insult.”"
      },
      choices: [
        { t: { de: "„LOVE.“ ROT13. Es ist immer ROT13.", en: "“LOVE.” ROT13. It is always ROT13." }, to: "my3a", aff: 3, log: 2, fx: "hearts" },
        { t: { de: "„Ist das Walisisch?“", en: "“Is that Welsh?”" }, to: "my3b", aff: 0, log: 0 },
        { t: { de: "„Ich gebe auf. Gib mir den Hint.“", en: "“I give up. Give me the hint.”" }, to: "my3c", aff: 1, log: 0 }
      ]
    },
    my3a: {
      route: "mysti", who: "mysti", scene: "ruins",
      text: {
        de: "Mysti wird rot. Genau ein Pixel. „Das kriegt niemand beim ersten Mal.“ — „Ich hatte einen guten Lehrer.“ — „Wen?“ — „Deinen letzten Cache. Zweieinhalb Jahre.“",
        en: "Mysti blushes. Exactly one pixel. “Nobody gets that first try.” “I had a good teacher.” “Who?” “Your last cache. Two and a half years.”"
      },
      next: "my4"
    },
    my3b: {
      route: "mysti", who: "mysti", scene: "ruins",
      text: {
        de: "„Walisisch“, sagt Mysti langsam, „wäre ein interessanter Ansatz gewesen. Ich behalte das im Kopf. Für später. Für ein anderes Rätsel. Für dich nicht.“",
        en: "“Welsh,” Mysti says slowly, “would have been an interesting approach. I'll keep it in mind. For later. For another puzzle. Not for you.”"
      },
      next: "my4"
    },
    my3c: {
      route: "mysti", who: "mysti", scene: "ruins",
      text: {
        de: "Sie gibt dir den Hint. Der Hint ist ebenfalls ROT13. Der Hint lautet: EBG13.",
        en: "She gives you the hint. The hint is also ROT13. The hint reads: EBG13."
      },
      next: "my4"
    },
    my4: {
      route: "mysti", who: "mysti", scene: "ruins",
      text: {
        de: "„Die Final-Koordinaten haben eine Quersumme“, sagt Mysti. „Wenn deine nicht stimmt, hast du dich verrechnet, und wir reden nie wieder darüber.“ Es ist die romantischste Drohung deines Lebens.",
        en: "“The final coordinates have a cross-sum,” Mysti says. “If yours doesn't match, you miscalculated, and we never speak of it again.” It is the most romantic threat of your life."
      },
      choices: [
        { t: { de: "Ein Spreadsheet öffnen. Das ist meine Liebessprache.", en: "Open a spreadsheet. That is my love language." }, to: "my5", aff: 2, log: 2, fx: "sparks" },
        { t: { de: "In jedes Feld „42“ schreiben und hoffen.", en: "Put “42” in every field and hope." }, to: "my5", aff: 1, log: 0 },
        { t: { de: "Im Listing nach einem versehentlichen Spoiler suchen.", en: "Scan the listing for an accidental spoiler." }, to: "my5", aff: 0, log: 1 }
      ]
    },
    my5: {
      route: "mysti", who: "bots", scene: "ruins", fx: "thorns",
      text: {
        de: "73 Rechenschritte später zeigt das Final mitten in einen Brombeerbusch. Es zeigt IMMER in einen Brombeerbusch.",
        en: "Seventy-three calculations later, the final points into the middle of a blackberry bush. It ALWAYS points into a blackberry bush."
      },
      choices: [
        { t: { de: "Gemeinsam rein. Liebe ist temporär, Dornen sind für immer.", en: "In together. Love is temporary, thorns are forever." }, to: "my6", aff: 2, log: 1, fx: "thorns" },
        { t: { de: "Erst ein Plausibilitäts-Check. Dann rein.", en: "Sanity-check the numbers first. Then in." }, to: "my6", aff: 1, log: 2 },
        { t: { de: "Dem Owner schreiben: „Brauche Hint. Und Pflaster.“", en: "Message the owner: “Need a hint. And a plaster.”" }, to: "my6", aff: 1, log: 1 }
      ]
    },
    my6: {
      route: "mysti", who: "mysti", scene: "ruins",
      end: "mysti",
      text: {
        de: "Ihr sitzt zerkratzt auf einem Mauerrest und seid sehr zufrieden mit euch.",
        en: "You sit on a piece of ruined wall, thoroughly scratched, and very pleased with yourselves."
      }
    },

    /* ================= FINALE ================= */
    fin1: {
      who: "bots", scene: "finale", fx: "hearts",
      text: {
        de: "Dein GPS piept. Dann piept es anders. Dann rastet es ein.",
        en: "Your GPSr beeps. Then it beeps differently. Then it locks on."
      },
      next: "fin2"
    },
    fin2: {
      who: "t4tc", scene: "finale",
      text: {
        de: "Du hast alle drei gedatet, und alle drei mögen dich immer noch. Das ist statistisch bemerkenswert und emotional kompliziert!",
        en: "You dated all three, and all three still like you. That is statistically remarkable and emotionally complicated!"
      },
      next: "fin3"
    },
    fin3: {
      who: "dnf", scene: "finale", fx: "sparks",
      text: {
        de: "Ich habe es geloggt. Als „Found it“. Zum ersten Mal seit 4.112 Versuchen.",
        en: "I have logged it. As “Found it”. For the first time in 4,112 attempts."
      },
      next: "fin4"
    },
    fin4: {
      who: "petra", scene: "finale",
      text: {
        de: "„Da draußen liegt eine echte Dose“, sagt Petra. „Nimm einen Stift mit. Der Stift ist immer das Problem.“",
        en: "“There is a real container out there,” Petra says. “Bring a pen. The pen is always the problem.”"
      },
      next: "reveal"
    },
    reveal: { reveal: true, scene: "finale", who: "bots" }
  };

  /* ------------------------------------------------------------------
   * Route scoring. GOLD is the only rank that releases digits.
   * ------------------------------------------------------------------ */
  const GOLD = { aff: 5, log: 4 };
  const SILVER = { aff: 3, log: 0 };

  const rankTexts = {
    petra: {
      gold: {
        de: "Petra reißt die letzte Seite aus ihrem allerersten Logbuch — dem von 2007, dem mit dem Wasserschaden — und drückt sie dir in die Hand. Vier Ziffern. „Nicht verlieren. Ich habe kein Backup, ich habe ein Logbuch.“",
        en: "Petra tears the last page from her very first logbook — the 2007 one, the one with the water damage — and presses it into your hand. Four digits. “Don't lose it. I don't have a backup, I have a logbook.”"
      },
      silver: {
        de: "Petra lächelt freundlich und wasserdicht. „Netter Nachmittag.“ Sie behält die Seite. Du kennst diesen Tonfall: Das war ein „Write note“, kein „Found it“.",
        en: "Petra smiles, warmly and waterproofly. “Nice afternoon.” She keeps the page. You know that tone: that was a Write Note, not a Found It."
      },
      bronze: {
        de: "Petra verschließt den Petling sehr sorgfältig, sehr endgültig. „Danke fürs Vorbeischauen.“ Der Deckel sitzt. Bei euch beiden.",
        en: "Petra seals the petling very carefully and very finally. “Thanks for dropping by.” The lid is tight. So is everything else."
      }
    },
    nando: {
      gold: {
        de: "„Das war meine erste Reise als Trackable“, sagt Nando und rollt sich auf. Innen, in winziger Schrift, stehen drei Ziffern. „Steht seit 2011 drin. Du bist der Erste, der weit genug gelesen hat.“",
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

  /* Player-facing log entry, assembled at the end. */
  const logTemplate = {
    de: [
      "Found it! Nach {dates} Dates, einem Muggel mit Hund, einem Transporter und",
      "einem Brombeerbusch: eingeloggt. Zuneigung {aff}, Log-Qualität {log}.",
      "Danke an Petra für den O-Ring, an Nando fürs Kleinsein und an Mysti dafür,",
      "dass sie mir den Hint in ROT13 gegeben hat. TFTC!"
    ],
    en: [
      "Found it! After {dates} dates, one Muggle with a dog, one van and one",
      "blackberry bush: signed. Affection {aff}, log quality {log}.",
      "Thanks to Petra for the O-ring, to Nando for being small, and to Mysti for",
      "giving me the hint in ROT13. TFTC!"
    ]
  };

  return {
    chars: chars,
    routes: routes,
    routeMeta: routeMeta,
    ui: ui,
    nodes: nodes,
    rankTexts: rankTexts,
    logTemplate: logTemplate,
    GOLD: GOLD,
    SILVER: SILVER,
    entry: { petra: "pe1", nando: "na1", mysti: "my1" }
  };
})();
