const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const db = require("../config/db.js");

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    res.json({ token: req.user.token, refreshToken: req.user.refreshToken });
  }
);

router.post("/token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required!" });
  }

  const tokenData = await db("refresh_tokens")
    .where({ token: refreshToken })
    .first();

  if (!tokenData || tokenData.expires_at < new Date()) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }

  const user = await db("users").where({ id: tokenData.user_id }).first();

  const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token: newToken });
});


router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required!" });
  }

  await db('refresh_tokens').where({ token: refreshToken }).del();

  res.json({ message: "Logged out successfully" });
});


module.exports = router;
