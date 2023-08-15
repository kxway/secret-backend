const db = require("../db/main.js");

class UserRepository {
  async updateLocation(userId, neighborhood) {
    try {
      let current_location =
        neighborhood.suburb || neighborhood.city || neighborhood.town;

      if (!current_location) {
        throw new Error("Location details are incomplete.");
      }

      await db("users").where("id", userId).update({ current_location });
    } catch (error) {
      console.error("Error updating user's location:", error.message);
      throw new Error("Error updating user's location");
    }
  }

  async findById(userId) {
    return await db("users").where({ id: userId }).first();
  }

  async findByTwitterId(twitterId) {
    return await db("users")
      .where({ twitterId })
      .first();
  }

  async createUser(user) {
    const [{id}] = await db("users").insert(user).returning("id");
    return { ...user, id };
  }
}

module.exports = new UserRepository();
