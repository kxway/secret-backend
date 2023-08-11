const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();
require("./cronJobs");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const port = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const locationRoutes = require('./routes/location');
const timelineRoutes = require('./routes/timeline');

app.use(authRoutes);
app.use(indexRoutes);
app.use(locationRoutes);
app.use(timelineRoutes);

app.listen(port, () => {
  console.log(`App está rodando na porta ${port}`);
});
