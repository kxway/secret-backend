const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login", session: false }),
  function (req, res) {
    res.json({ token: req.user.token });
  }
);

module.exports = router;
