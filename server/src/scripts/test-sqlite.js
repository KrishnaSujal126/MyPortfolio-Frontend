require('dotenv').config();
const { getDb } = require('../sqlite');

(async () => {
  try {
    const db = await getDb();
    const row = await db.get('SELECT 1 AS ok');
    console.log('SQLite test query result:', row);
    if (db && db.close) await db.close();
    process.exit(0);
  } catch (err) {
    console.error('SQLite test failed:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
