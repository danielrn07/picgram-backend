const express = require("express");
const { modelNames } = require("mongoose");
const router = express();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"));

router.get("/", (req, res) => {
  res.send("API working.");
});

module.exports = router;
