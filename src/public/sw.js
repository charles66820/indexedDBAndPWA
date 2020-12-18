// sw for service worker
importScripts("/js/cache-polyfill.js"); // For support multiple browser

console.log("yes :");
console.log(self);

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
  e.waitUntil(() => {
    // Create db
    indexedDB.open("noteOfflineDb", 1, db => {
      // Create db schema
      let store = db.createObjectStore("notes"); // , { keyPath: "id", autoIncrement: true }
      store.createIndex("id", "id", { unique: false });
      store.createIndex("title", "title", { unique: false });
      store.createIndex("description", "description", { unique: false });
      store.createIndex("sync", "scync", { unique: false });
    });
  });
});


self.addEventListener("fetch", e => {
  console.log("fetch : " + e);
  let pathname = new URL(e.request.url).pathname;
  // Intercept /api/notes request and put it in cache
  if (e.request.method == "GET" && pathname == "/api/notes") {

    function getAllFromDb() {
      return indexedDB.open("noteOfflineDb", 1, function (db) {
        let tx = db.transaction(["notes"], "readonly");
        let store = tx.objectStore("notes");
        console.log(store);
        let notes = store.getAll();
        console.log(notes);
        return e.respondWith(new Response(JSON.stringify(notes), { "status": 200, "statusText": "OK from indexedDB" }));
      });
    }
    //return e.respondWith(new Response(JSON.stringify(err), { "status": 500, "statusText": "Error form Web worker" }));

    if (navigator.onLine) {
      return fetch(e.request)
        .then(rres => {
          res = rres.json();
          indexedDB.open("noteOfflineDb", 1).then(async function (db) {
            let tx = db.transaction(["notes"], "readwrite");
            let store = tx.objectStore("notes");
            try {
              await Promise.all(res.map(function (i) {
                store.add({
                  id: i.id,
                  title: i.title,
                  description: i.description,
                  sync: true,
                  delete: false
                });
              })
              );
            } catch (e) {
              tx.abort();
              console.error(e);
              return e.respondWith(new Response(JSON.stringify(err), { "status": 500, "statusText": "Error form Web worker" }));
            }
            console.log('All items added successfully!');
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