const tokenService = require("../services/TokenService.js");

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // O formato geralmente é "Bearer TOKEN"

    tokenService.authenticateJWT(token)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        if (err.message === "User not found.") {
          res.sendStatus(401);
        } else {
          res.sendStatus(403);
        }
      });
  } else {
    res.sendStatus(401);
  }
}

module.exports = authenticateJWT;
