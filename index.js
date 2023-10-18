"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const dbConnect = require('./config/db')
const { checkAuth } = require('./app/middleware/auth')

// Configurations
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use('/api/v1', require('./app/routers'))
const port = process.env.PORT;

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`🚀 server listening on port ${port}`);
});
