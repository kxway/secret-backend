const passport = require("passport");
const db = require("./db.js");
const TwitterStrategy = require("passport-twitter").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

function getLargeProfileImage(url) {
    if (!url) return null;
    return url.replace("_normal.", ".");
}

async function findOrCreateUser(profile) {
    const existingUser = await db("users").where({ twitterId: profile.id }).first();
    
    if (existingUser) {
        existingUser.token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return existingUser;
    }
    
    const [id] = await db("users").insert({
        twitterId: profile.id,
        name: profile.displayName,
        photo: getLargeProfileImage(profile._json.profile_image_url),
    });

    const newUser = {
        twitterId: profile.id,
        id,
        name: profile.displayName,
        photo: getLargeProfileImage(profile._json.profile_image_url),
    };
    newUser.token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    return newUser;
}

passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: "http://localhost:3000/auth/twitter/callback",
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
