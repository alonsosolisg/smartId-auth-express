const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use("/api", cors(), routes);

module.exports = app;
