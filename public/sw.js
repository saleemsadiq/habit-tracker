const CACHE_NAME = "habit-tracker-v2";

// Only cache static assets, NOT the page routes
const APP_SHELL = [
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install event — cache only static files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  // activate immediately
  self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event — network first, fall back to cache
self.addEventListener("fetch", (event) => {
  // always go to network for page navigation
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        // only use cache if network completely fails (offline)
        return caches.match(event.request);
      })
    );
    return;
  }

  // for static assets — cache first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
