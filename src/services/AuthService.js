const jwt = require("jsonwebtoken");
const refreshTokenRepository = require("../repositories/RefreshTokenRepository.js");
const userRepository = require("../repositories/UserRepository.js");
const tokenService = require("../services/TokenService.js");

function getLargeProfileImage(url) {
  if (!url) return null;
  return url.replace("_normal.", ".");
}

class AuthService {
  async generateNewToken(refreshToken) {
    const tokenData = await refreshTokenRepository.findByToken(refreshToken);

    if (!tokenData || tokenData.expires_at < new Date()) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await userRepository.findById(tokenData.user_id);

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  async logout(refreshToken) {
    const deletedRowCount = await refreshTokenRepository.deleteByToken(refreshToken);

    if (deletedRowCount === 0) {
      throw new Error("Invalid token or token not found");
    }
  }

  async findOrCreateUser(profile) {
    let user = await userRepository.findByTwitterId(profile.id);

    if (user) {
      user.token = tokenService.generateJWT(user.id);
      user.refreshToken = await tokenService.generateRefreshToken(user.id);
      return user;
    }

    user = await userRepository.createUser({
      twitterId: profile.id,
      name: profile.displayName,
      photo: getLargeProfileImage(profile._json.profile_image_url),
    });

    user.token = tokenService.generateJWT(user.id);
    user.refreshToken = await tokenService.generateRefreshToken(user.id);

    return user;
  }
}

module.exports = new AuthService();
