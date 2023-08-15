const express = require('express');
const configureExpress = require('./expressConfig');
const mainRoutes = require('./routes');
require("dotenv").config();

const app = express();
configureExpress(app);
app.use(mainRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App está rodando na porta ${port}`);
});
