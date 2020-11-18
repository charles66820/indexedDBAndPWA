const express = require("express");
const fs = require("fs");

// app settings
global.app = express();
global.port = process.env.PORT || 8080;
global.hostname = process.env.HOSTNAME || "localhost";

app.set("trust proxy", true); // Allow proxy
app.set("twig options", {
  allow_async: true,
  strict_letiables: false
});

global.app.use(express.urlencoded({ extended: true }));
global.app.use(express.json());

// execute on all request
app.use((req, res, next) => {
  next();
});

// load public folder
app.use(express.static(__dirname + "/public"));

let notes = [
  { id: 0, title: "truc0", description: "description n°0" },
  { id: 1, title: "truc1", description: "description n°1" },
  { id: 2, title: "truc2", description: "description n°2" },
  { id: 3, title: "truc3", description: "description n°3" },
  { id: 4, title: "truc4", description: "description n°4" },
  { id: 5, title: "truc5", description: "description n°5" }
];

// routes
app.get("/api/notes", (req, res) => {
  res.status(200).json(notes);
});

app.post("/api/notes", (req, res) => {
  let note = {
    id: notes.length ? notes[notes.length - 1].id + 1 : 0,
    title: req.body.title,
    description: req.body.description
  };
  notes.push(note);
  res.status(201).json({ id: note.id });
});

app.delete("/api/notes/:id", (req, res) => {
  notes.splice(notes.findIndex(i => i.id == req.params.id), 1);
  res.status(201).json({});
});

app.get("*", (req, res) => {
  fs.readFile(__dirname + "/index.html", (err, data) => res.end(data));
});

app.listen(port, () => {
  console.info("Server start on interface : " + hostname + " with port :" + port);
});