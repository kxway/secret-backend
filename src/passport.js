const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const authService = require('./services/AuthService');

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const user = await authService.findOrCreateUser(profile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;