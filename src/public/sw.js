// sw for service worker
importScripts("/js/cache-polyfill.js"); // For support multiple browser

// Init db
function openDb() {
  let dbRequest = indexedDB.open("noteOfflineDb", 1);
  dbRequest.addEventListener("error", e => console.error("Error on open noteOfflineDb: " + e));
  dbRequest.addEventListener("upgradeneeded", e => {
    db = e.target.result;

    // Create db schema
    let notesOS = db.createObjectStore("notes"); // , { keyPath: "id", autoIncrement: true }
    notesOS.createIndex("id", "id", { unique: false });
    notesOS.createIndex("title", "title", { unique: false });
    notesOS.createIndex("description", "description", { unique: false });
    notesOS.createIndex("sync", "scync", { unique: false });

    if (db.transaction) {
      db.transaction.addEventListener("complete", () => console.info("All donne!"));
      db.transaction.addEventListener("error", e => console.error("Error on transaction: " + e));
    }
    db.addEventListener("close", e => console.error("Close on db: " + e));
    db.addEventListener("error", e => console.error("Error on db: " + e));
  });
}

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

/*
// For pwa
self.addEventListener("activate", e => {
  // For clients and clean cache
  return self.clients.claim();
});
*/

let db = null;
openDb();

self.addEventListener("fetch", e => {
  let pathname = new URL(e.request.url).pathname;
  // Intercept /api/notes request and put it in cache
  if (e.request.method == "GET" && pathname == "/api/notes") {
    function getFromDb() {
      return notesOS.getAll().addEventListener("success", notes => {
        return e.respondWith(new Response(JSON.stringify(notes), { "status": 200, "statusText" : "OK from indexedDB" }));
      }).addEventListener("error", err => {
        return e.respondWith(new Response(JSON.stringify(err), { "status": 500, "statusText" : "Error form Web worker" }));
      });
    }

    let notesOS = db ? db.transaction("notes", "readwrite").objectStore("notes") : null;
    if (navigator.onLine) {
      return fetch(e.request).then(res => res.json())
        .then(res => {
          res.forEach(i => notesOS.add({
            id: i.id,
            title: i.title,
            description: i.description,
            sync: true,
            delete: false
          }));
          return res;
        }).catch(err => {
          console.error(err);
          return getFromDb();
        });
    } else {
      return getFromDb();
    }
  } else if (e.request.method == "POST" && pathname == "/api/notes") {

  } else if (e.request.method == "DELETE" && pathname == "/api/notes/:id") {

  }

  // If request is in cache returns cache else send request
  return e.respondWith(caches.match(e.request).then(res => { // For pwa
    return res || fetch(e.request);
  }));
});