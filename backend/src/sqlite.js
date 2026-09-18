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
        'Movie Ticket Booking System',
        'Developed a Java-based application with seat selection, booking management, and user interaction for a movie ticket booking workflow.',
        '',
        JSON.stringify(['Java', 'OOP', 'Booking System']));

      await db.run('INSERT INTO projects (title, description, url, tags) VALUES (?,?,?,?)',
        'AI-Based Healthcare Solution',
        'Designed an AI-powered healthcare solution to improve diagnosis support and patient care using machine learning basics and data processing.',
        '',
        JSON.stringify(['Machine Learning', 'Healthcare', 'Data Processing']));
    }
    return db;
  })();
  return dbPromise;
}

module.exports = { getDb };
