const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT.js');

router.get('/profile', authenticateJWT, function (req, res) {
  if(req.user) {
    res.json(req.user)
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
