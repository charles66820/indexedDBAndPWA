// sw for service worker
importScripts("/js/cache-polyfill.js"); // For support multiple browser

// For pwa
self.addEventListener("install", e => {
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

let dbPromise;
self.addEventListener("activate", e => {
  e.waitUntil(() => {
    // Create db
    dbPromise = indexedDB.open("noteOfflineDb", 1, db => {
      // Create db schema
      let store = db.createObjectStore("notes"); // , { keyPath: "id", autoIncrement: true }
      store.createIndex("id", "id", { unique: false });
      store.createIndex("title", "title", { unique: false });
      store.createIndex("description", "description", { unique: false });
      store.createIndex("sync", "scync", { unique: false });
    });
  });
});

self.addEventListener("fetch", async e => {
  let pathname = new URL(e.request.url).pathname;
  // Intercept /api/notes request and put it in cache
  if (e.request.method == "GET" && pathname == "/api/notes") {

    function getAllFromDb() {
      return dbPromise.then(function (db) {
        let tx = db.transaction(["notes"], "readonly");
        let store = tx.objectStore("notes");
        return store.getAll();
      }).then(notes => {
        return e.respondWith(new Response(JSON.stringify(notes), { "status": 200, "statusText": "OK from indexedDB" }));
      }).cache(err => {
        return e.respondWith(new Response(JSON.stringify(err), { "status": 500, "statusText": "Error form Web worker" }));
      });
    }

    if (navigator.onLine) {
      return await fetch(e.request).then(res => res.json())
        .then(res => {
          dbPromise.then(function (db) {
            let tx = db.transaction(["notes"], "readwrite");
            let store = tx.objectStore("notes");
            return Promise.all(res.map(function (i) {
              return store.add({
                id: i.id,
                title: i.title,
                description: i.description,
                sync: true,
                delete: false
              });
            })
            ).catch(function (e) {
              tx.abort();
              console.error(e);
              return e.respondWith(new Response(JSON.stringify(err), { "status": 500, "statusText": "Error form Web worker" }));
            }).then(function () {
              console.log('All items added successfully!');
            });
          });
        }).catch(err => {
          console.error(err);
          return getAllFromDb();
        });
    } else {
      return getAllFromDb();
    }
  } else if (e.request.method == "POST" && pathname == "/api/notes") {

  } else if (e.request.method == "DELETE" && pathname == "/api/notes/:id") {

  }

  // If request is in cache returns cache else send request
  return e.respondWith(caches.match(e.request).then(res => { // For pwa
    return res || fetch(e.request);
  }));
});