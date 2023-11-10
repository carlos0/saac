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
app.get('/', function(req, res) {
  res.json({ title: "Servicios Censo" });
});
app.use(bodyParser.json({ limit: "10mb" }));
app.use('/api/v1', require('./app/routers'))
const port = process.env.PORT;

const server = http.createServer(app);
server.listen(port, () => {
  const date = new Date();
  console.log(date.getFullYear() + '-' +('0' + (date.getMonth()+1)).slice(-2)+ '-' +  
  ('0' + date.getDate()).slice(-2) + ' '+date.getHours()+ ':'+('0' + (date.getMinutes())).slice(-2)+ ':'+date.getSeconds() + ' ' + date.getMilliseconds() + '' +  date.getUTCMilliseconds());
  console.log(`🚀 Server on http://localhost:${port}`);
  console.log(`🚀 server listening on port ${port}`);
});
