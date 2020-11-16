// sw for service worker
importScripts("/js/cache-polyfill.js"); // For support multiple browser

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("v1").then(cache => {
      return cache.addAll([
        "/",
        "/css/main.css",
        "/js/main.js",
        "/js/cache-polyfill.js",
        "/img/karp.ico",
        "/img/magikarp475.png"
      ]);
    })
  );
});

/*
self.addEventListener("activate", e => {
  // For clients and clean cache
  return self.clients.claim();
});
*/

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(res => {
      return res || fetch(e.request);
      // if fetch we can clone response and put it in cache
    }));
});