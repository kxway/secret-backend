const passport = require("passport");
const db = require("./db.js");
const TwitterStrategy = require("passport-twitter").Strategy;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

function getLargeProfileImage(url) {
  if (!url) return null;
  return url.replace("_normal.", ".");
}

async function generateRefreshTokenForUser(userId) {
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + 30); // Refresh token expira em 30 dias

  await db("refresh_tokens").insert({
    user_id: userId,
    token: refreshToken,
    expires_at,
  });

  return refreshToken;
}

async function findOrCreateUser(profile) {
  const existingUser = await db("users")
    .where({ twitterId: profile.id })
    .first();

  if (existingUser) {
    existingUser.token = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    existingUser.refreshToken = await generateRefreshTokenForUser(
      existingUser.id
    );
    return existingUser;
  }

  const [{id}] = await db("users").insert({
    twitterId: profile.id,
    name: profile.displayName,
    photo: getLargeProfileImage(profile._json.profile_image_url),
  }).returning('id');

  const newUser = {
    twitterId: profile.id,
    id,
    name: profile.displayName,
    photo: getLargeProfileImage(profile._json.profile_image_url),
  };
  newUser.token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  newUser.refreshToken = await generateRefreshTokenForUser(id);

  return newUser;
}

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
