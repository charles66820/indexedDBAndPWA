// sw for service worker
importScripts("/js/cache-polyfill.js"); // For support multiple browser

// Init db
function openDb() {
  return new Promise(function(resolve, reject) {
    let dbRequest = indexedDB.open("noteOfflineDb", 1); // reject(Error("It broke"));
    dbRequest.addEventListener("error", e => console.error("Error on open noteOfflineDb: " + e));
    dbRequest.addEventListener("upgradeneeded", e => {
      let db = e.target.result;
      db.onclose = e => console.error("Close on db: " + e);
      db.onerror = e => console.error("Error on db: " + e);

      // Create db schema
      let notesOS = db.createObjectStore("notes"); // , { keyPath: "id", autoIncrement: true }
      notesOS.createIndex("id", "id", { unique: false });
      notesOS.createIndex("title", "title", { unique: false });
      notesOS.createIndex("description", "description", { unique: false });
      notesOS.createIndex("sync", "scync", { unique: false });

      if (db.transaction) {
        db.transaction.oncomplete = () => console.info("All donne!");
        db.transaction.onerror = e => console.error("Error on transaction: " + e);
      }
      return resolve(db);
    });
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

let db = openDb().then( db => db);
console.log(db);
let notesOS = db.transaction.objectStore("notes"); //("notes", "readwrite")
console.log(notesOS);

self.addEventListener("fetch", async e => {
  let pathname = new URL(e.request.url).pathname;
  // Intercept /api/notes request and put it in cache
  if (db) {
    if (e.request.method == "GET" && pathname == "/api/notes") {
      async function getAllFromDb() {
        return await notesOS.getAll().addEventListener("success", notes => {
          return e.respondWith(new Response(JSON.stringify(notes), { "status": 200, "statusText": "OK from indexedDB" }));
        }).addEventListener("error", err => {
          return e.respondWith(new Response(JSON.stringify(err), { "status": 500, "statusText": "Error form Web worker" }));
        });
      }
      if (navigator.onLine) {
        return await fetch(e.request).then(res => res.json())
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
            return getAllFromDb();
          });
      } else {
        return getAllFromDb();
      }
    } else if (e.request.method == "POST" && pathname == "/api/notes") {

    } else if (e.request.method == "DELETE" && pathname == "/api/notes/:id") {

    } else {
      // If request is in cache returns cache else send request
      return e.respondWith(caches.match(e.request).then(res => { // For pwa
        return res || fetch(e.request);
      }));
    }
  }

  // If request is in cache returns cache else send request
  return e.respondWith(caches.match(e.request).then(res => { // For pwa
    return res || fetch(e.request);
  }));
});