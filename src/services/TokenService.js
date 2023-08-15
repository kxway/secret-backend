const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const refreshTokenRepository = require("../repositories/RefreshTokenRepository.js");
const userRepository = require("../repositories/UserRepository.js");

class TokenService {
  generateJWT(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  async generateRefreshToken(userId) {
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 30);

    await refreshTokenRepository.createRefreshToken(
      userId,
      refreshToken,
      expires_at
    );

    return refreshToken;
  }

  async verifyAndDecodeJWT(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
        if (err) {
          return reject(err);
        }

        resolve(userPayload);
      });
    });
  }

  async authenticateJWT(token) {
    const userPayload = await this.verifyAndDecodeJWT(token);
    const user = await userRepository.findById(userPayload.id);

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }
}

module.exports = new TokenService();
