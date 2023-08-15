const db = require("../db/main.js");

class RefreshTokenRepository {
  async findByToken(token) {
    return await db("refresh_tokens").where({ token: token }).first();
  }

  async deleteByToken(refreshToken) {
    return await db("refresh_tokens").where({ token: refreshToken }).del();
  }

  async createRefreshToken(userId, refreshToken, expires_at) {
    return await db("refresh_tokens").insert({
      user_id: userId,
      token: refreshToken,
      expires_at: expires_at
    });
  }
}

module.exports = new RefreshTokenRepository();
