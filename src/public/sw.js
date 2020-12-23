// sw for service worker
importScripts("/js/cache-polyfill.js"); // For support multiple browser

// For pwa
self.addEventListener("install", e => {
  console.log("install : " + e);
  e.waitUntil(
    caches.open("v1").then(cache => {
      return cache.addAll([
        "/",
        "/css/main.css",
        "/js/pwa.js",
        "/js/main.js",
        "/js/cache-polyfill.js",
        "/img/karp.ico",
        "/img/magikarp475.png"
      ]);
    })
  );
});


self.addEventListener("activate", e => {
  console.log("activate : " + e);
  e.waitUntil(() => {});
});


self.addEventListener("fetch", e => {
  // let pathname = new URL(e.request.url).pathname; // for get pathname
  // e.request.method // for get http method
  // For send error
  // return e.respondWith(new Response(JSON.stringify({ msg: "Error" }), { "status": 500, "statusText": "Error form Web worker" }));

  // If request is in cache returns cache else send request
  return e.respondWith(caches.match(e.request).then(res => { // For pwa
    return res || fetch(e.request);
  }));
});