const { Pool } = require("pg");

const pool = new Pool({
  database: process.env.DB_NAME_MINEDU,
  user: process.env.DB_USER_MINEDU,
  password: process.env.DB_PASS_MINEDU,
  port: process.env.DB_PORT_MINEDU,
  host: process.env.DB_HOST_MINEDU,
});

module.exports = pool;
