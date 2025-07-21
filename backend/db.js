const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'pos',
  password: process.env.DB_PASS || 'pos',
  database: process.env.DB_NAME || 'pos',
  connectionLimit: 10
});
module.exports = pool;
