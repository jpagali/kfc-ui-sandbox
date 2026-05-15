const CACHE_NAME = "kfc-atlas-prototype-v38";
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
  "./assets/menu-landing/figma-featured-offers.png",
  "./assets/menu-landing/burgers.png",
  "./assets/menu-landing/boxed-meals.png",
  "./assets/menu-landing/chicken.png",
  "./assets/menu-landing/snack-hacks.png",
  "./assets/menu-landing/protein-picks.png",
  "./assets/menu-landing/go-buckets-kids-meals.png",
  "./assets/menu-landing/shared-meals.png",
  "./assets/menu-landing/twisters-bowls.png",
  "./assets/menu-landing/sides-desserts.png",
  "./assets/menu-landing/cold-drinks.png",
  "./assets/menu-landing/build-your-own-bucket.png",
  "./assets/homepage/top-card.png",
  "./assets/homepage/hero-saved-room.png",
  "./assets/homepage/hero-title-1.png",
  "./assets/homepage/hero-title-2.png",
  "./assets/homepage/offer-icecream.png",
  "./assets/homepage/offer-burger.png",
  "./assets/homepage/offer-product.png",
  "./assets/homepage/offer-all.png",
  "./assets/homepage/open-24-hours.png",
  "./assets/homepage/feature-stack.png",
  "./assets/pickup/melbourne-map.png",
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
