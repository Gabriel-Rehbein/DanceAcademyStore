
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '123456',
  host: 'localhost',
  port: 5433,
  database: 'ballet',
});

module.exports = pool;
