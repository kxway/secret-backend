const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT.js");

const locationService = require('../services/LocationService');
const userService = require('../services/UserService');

router.post("/location/update", authenticateJWT, async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and Longitude are required." });
  }

  try {
    const neighborhood = await locationService.getLocationData(req.user.id, lat, lon);

    if (!neighborhood) {
      return res.json({ message: "Neighborhood not found." });
    }

    await userService.updateUserLocation(req.user.id, neighborhood);

    res.json({ message: "Location updated successfully!", neighborhood });
  } catch (error) {
    res.status(500).json({ error: "Error updating location." });
  }
});

module.exports = router;
