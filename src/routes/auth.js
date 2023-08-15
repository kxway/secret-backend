const express = require("express");
const router = express.Router();
const passport = require("../passport");

const authService = require("../services/AuthService.js");

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

  try {
    const newToken = await authService.generateNewToken(refreshToken);
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required!" });
  }

  try {
    await authService.logout(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log out." });
  }
});

module.exports = router;
