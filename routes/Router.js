const express = require("express");
const { modelNames } = require("mongoose");
const router = express();

router.get("/", (req, res) => {
  res.send("API working.");
});

module.exports = router;
