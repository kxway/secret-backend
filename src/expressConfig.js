const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./passport');
const cors = require('cors');
require("dotenv").config();

module.exports = function configureExpress(app) {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    }));
};