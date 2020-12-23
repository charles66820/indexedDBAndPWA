let res = [
  {
    id: 1,
    title: "title1",
    description: "description 1",
    sync: true,
    delete: false
  },
  {
    id: 2,
    title: "title2",
    description: "description 2",
    sync: true,
    delete: false
  },
  {
    id: 3,
    title: "title3",
    description: "description 3",
    sync: true,
    delete: false
  }
];

// Create db
let rdb = indexedDB.open("noteOfflineDb", 1);

rdb.onerror = function(event) {
  // Handle errors.
};

rdb.onupgradeneeded = function(event) {
  var db = event.target.result;

  // Create db schema
  let store = db.createObjectStore("notes", { keyPath: "localId", autoIncrement: true });
  store.createIndex("id", "id", { unique: false });
  store.createIndex("title", "title", { unique: false });
  store.createIndex("description", "description", { unique: false });
  store.createIndex("sync", "sync", { unique: false });
  store.createIndex("delete", "delete", { unique: false });

  // Work
  store.transaction.oncomplete = function(event) {
    var customerObjectStore = db.transaction("notes", "readwrite").objectStore("notes");
    customerObjectStore.add({
      id: 3,
      title: "oui",
      description: "oui oui",
      sync: true,
      delete: false
    });
  };
};

// Work
rdb.onsuccess = function(event) {
  db = event.target.result;
  try {
    let tx = db.transaction(["notes"], "readwrite");
    let store = tx.objectStore("notes");
    store.clear();
    store.add({
      id: 0,
      title: "oui",
      description: "oui oui",
      sync: true,
      delete: false
    });

    try {
      for (const i of res) {
        store.add({ //put
          id: i.id,
          title: i.title,
          description: i.description,
          sync: true,
          delete: false
        });
      }
    } catch (e) {
      tx.abort();
      console.error(e);
      console.error("status: 500, Error form Web worker");
    }
    console.log('All items added successfully!');

    // Get all
    store.getAll().onsuccess = function(event) {
      console.log("Got all customers: " + event.target.result);
    };
  } catch (error) {
    console.log(error);
  }
};
