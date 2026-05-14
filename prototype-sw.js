const CACHE_NAME = "kfc-atlas-prototype-v1";
const CORE_ASSETS = [
  "./",
  "./rna-sneak-peek-prototype.html",
  "./kfc-au-menu-data.js",
  "./manifest.webmanifest",
  "./app-icon.svg",
  "./app-icon-180.png",
  "./app-icon-192.png",
  "./app-icon-512.png",
  "./VIEW%20ALL%20MENU%20.jpg",
  "./assets/secret-menu-initial.png",
  "./fonts/Kentucky%20Fried%20Sans/WOFF/KentuckyFriedSans-Regular.woff2",
  "./fonts/Kentucky%20Fried%20Sans/WOFF/KentuckyFriedSans-Light.woff2",
  "./fonts/Kentucky%20Fried%20Serif/WOFF/KentuckyFriedSerif-Regular.woff2",
  "./fonts/Kentucky%20Fried%20Serif/WOFF/KentuckyFriedSerif-HeavyItalic.woff2",
  "./fonts/Kentucky%20Fried%20Stripes/WOFF/KentuckyFriedStripes-Heavy.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./rna-sneak-peek-prototype.html", copy));
          return response;
        })
        .catch(() => caches.match("./rna-sneak-peek-prototype.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
