const path = require('path');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

let dbPromise = null;

async function getDb() {
  if (dbPromise) return dbPromise;
  const file = process.env.SQLITE_FILE || path.join(__dirname, '..', 'data', 'sqlite.db');
  dbPromise = (async () => {
    const db = await sqlite.open({ filename: file, driver: sqlite3.Database });
    await db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      url TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const row = await db.get('SELECT COUNT(*) as c FROM projects');
    if (row && row.c === 0) {
      await db.run('INSERT INTO projects (title, description, url, tags) VALUES (?,?,?,?)',
        'Example Project', 'A sample project entry', 'https://example.com', JSON.stringify(['demo','portfolio']));
    }
    return db;
  })();
  return dbPromise;
}

module.exports = { getDb };
