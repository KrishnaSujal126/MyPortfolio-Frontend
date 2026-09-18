require('dotenv').config();
const pool = require('../db');

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('DB test query result:', rows);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('DB connection test failed:', err && err.message ? err.message : err);
    try { await pool.end(); } catch(e){}
    process.exit(2);
  }
})();
