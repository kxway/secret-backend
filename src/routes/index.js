const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT.js");
const formatTimeAgo = require("../helpers/formatTimeAgo.js");
const startTimestamp = new Date().toISOString();

router.get("/", function (req, res) {
  const timeAgo = formatTimeAgo(startTimestamp);
  res.json({ status: "online", lastUpdate: timeAgo });
});

router.get("/profile", authenticateJWT, function (req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
});

router.use(require('./auth'));
router.use(require('./location'));
router.use(require('./timeline'));

module.exports = router;
