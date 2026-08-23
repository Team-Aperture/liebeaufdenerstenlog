/* =====================================================================
 * sw.js — offline support.
 *
 * The whole point: a solver standing in a field with one bar of signal
 * should still be able to open the game and read their coordinates.
 * Everything is precached on install; navigations fall back to the
 * cached shell when the network is unavailable.
 *
 * Bump CACHE when you publish a new build (or change the cache config)
 * so returning players do not get a stale copy.
 * ===================================================================== */
"use strict";

const CACHE = "liebe-auf-den-ersten-log-v6";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.webmanifest",
  "./icon.svg",
  "./js/coords.js",
  "./js/audio.js",
  "./js/art.js",
  "./js/hosts.js",
  "./js/logo.js",
  "./js/scenes.js",
  "./js/story.js",
  "./js/game.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  /* Navigations: network first so a republished cache config lands
   * quickly, cache second so the forest still works. */
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  /* Everything else: cache first, it never changes within a build. */
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    })).catch(() => Response.error())
  );
});
