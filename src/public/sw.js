// sw for service worker
importScripts("/js/cache-polyfill.js"); // For support multiple browser

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
self.addEventListener("activate", e => {
  // For clients and clean cache
  return self.clients.claim();
});
*/

let db = null;
openDb();

self.addEventListener("fetch", e => {
  console.log(e.request);
  // Intercept /api/notes request
  let notesOS = db? db.transaction("notes", "readwrite").objectStore("notes") : null;

  // if fetch we can clone response and put it in cache
  // GET /api/notes
  //notes.forEach(note => notesOS.add(note));
  // POST /api/notes
  // DELETE /api/notes/:id


  // If request is in cache returns cache else send request
  e.respondWith(caches.match(e.request).then(res => {
    return res || fetch(e.request);
  }));
});

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

    db.transaction.addEventListener("complete", () => console.info("All donne!"));
    db.transaction.addEventListener("error", e => console.error("Error on transaction: " + e));
  });
}