const knex = require("../config/db.js");

class UserService {
  async updateUserLocation(userId, neighborhood) {
    try {
      let current_location =
        neighborhood.suburb || neighborhood.city || neighborhood.town;

      if (!current_location) {
        throw new Error("Location details are incomplete.");
      }

      await knex("users").where("id", userId).update({ current_location });
    } catch (error) {
      console.error("Error updating user's location:", error.message);
      throw new Error("Error updating user's location");
    }
  }
}

module.exports = UserService;
