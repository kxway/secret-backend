const express = require("express");
const router = express.Router();
const LocationService = require("../services/LocationService.js");  
const authenticateJWT = require('../middlewares/authenticateJWT.js');

const locationService = new LocationService()

router.get("/location", authenticateJWT, async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required." });
  }

  try {
    const neighborhood = await locationService.getLocationData(req.user.id, lat, lon); 

    if (neighborhood) {
      res.json({ neighborhood });
    } else {
      res.json({ message: "Neighborhood not found." });
    }

  } catch (error) {
    res.status(500).json({ error: "Error fetching location data." });
  }
});

module.exports = router;