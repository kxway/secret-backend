const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../config/db.js");

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log(req.headers.authorization)
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // O formato geralmente é "Bearer TOKEN"

    jwt.verify(token, process.env.JWT_SECRET, async (err, userPayload) => {
      if (err) {
        return res.sendStatus(403);
      }

      try {
        const user = await db("users").where({ id: userPayload.id }).first();

        if (!user) {
          return res.sendStatus(401);
        }

        req.user = user;
        next();
      } catch (error) {
        res.sendStatus(500);
      }
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = authenticateJWT;
