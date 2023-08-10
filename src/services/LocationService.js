const NodeCache = require("node-cache");
const axios = require("axios");

class LocationService {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache dura 1 hora
    this.tolerance = 0.01; // margem de erro de 1 km aproximadamente
  }

  generateCacheKey(userId, latitude, longitude) {
    const lat = this.roundToTolerance(latitude);
    const lon = this.roundToTolerance(longitude);
    return `${userId}-${lat}-${lon}`;
  }

  roundToTolerance(value) {
    return Math.round(value / this.tolerance) * this.tolerance;
  }

  async fetchLocationFromNominatim(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    try {
      const response = await axios.get(url);

      if (!response.data || !response.data.address) {
        throw new Error("Failed to fetch location data.");
      }

      return response.data.address;
    } catch (error) {
      throw new Error(`Error fetching location: ${error.message}`);
    }
  }

  async getLocationData(userId, latitude, longitude) {
    const key = this.generateCacheKey(userId, latitude, longitude);
    let locationData = this.cache.get(key);

    if (!locationData) {
      locationData = await this.fetchLocationFromNominatim(latitude, longitude);
      this.cache.set(key, locationData);
    }

    return locationData;
  }
}

module.exports = LocationService;
