const express = require("express");
const app = express();
const path = require("path");
require("./utils/strings");
require("./db/connection");

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/config")();

const logger = require("./logger");
const {setupSocket} = require('./ws')

let server;

let onListenStartSocket = () => {
  logger.info("listening to requests on port 4000");
  setupSocket(server)
};

let startApp = () => {
  server = app.listen(4000, onListenStartSocket).on("error", err => {
    logger.error(`startApp error: ${err.toString()}`);
    if (err.toString().includes("listen EADDRINUSE")) setTimeout(startApp, 500);
    else throw err;
  });
};

// Host static files
const build = path.join(__dirname, "../../client/build");
app.use(express.static(build));
app.get("*", function(req, res) {
  if (process.env.NODE_ENV === "production")
    res.sendFile(path.join(build, "index.html"));
  else res.end();
});

startApp();
