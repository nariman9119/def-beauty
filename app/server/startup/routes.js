const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const auth = require("../routes/auth");
const recommendations = require("../routes/recommendations");
const bot = require("../routes/bot");
const error = require("../middleware/error");

module.exports = function(app) {
  if (process.env.NODE_ENV === "production") {
    app.use(cors({ credentials: true }));
  } else {
    app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  }

  app.use(express.json());

  app.use(cookieParser());
  app.use("/api/auth", auth);
  app.use("/api/recommendations", recommendations);
  app.use("/api/bot", bot);

  app.use(error);
};
