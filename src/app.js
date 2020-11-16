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

// execute on all request
app.use((req, res, next) => {
  next();
});

// load public folder
app.use(express.static(__dirname + "/public"));

// routes
app.get("*", (req, res) => {
  fs.readFile(__dirname + "/index.html", (err, data) => res.end(data));
});

app.listen(port, () => {
  console.info("Server start on interface : " + hostname + " with port :" + port);
});