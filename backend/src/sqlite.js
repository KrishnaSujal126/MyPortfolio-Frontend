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
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Ensure subject column exists if contacts table existed previously
    try {
      await db.run('ALTER TABLE contacts ADD COLUMN subject TEXT');
    } catch (e) {
      // Column already exists, ignore
    }

    const countRow = await db.get('SELECT COUNT(*) as c FROM projects');
    if (!countRow || countRow.c === 0) {
      await seedProjects(db);
    }
    return db;
  })();
  return dbPromise;
}

async function seedProjects(db) {
  const projects = [
    {
      title: 'AI Smart Healthcare & Triage System',
      description: 'Engineered an AI Symptom Triage Engine that processes natural-language medical complaints to categorize risk levels (Critical, High, Moderate, Low), with 10+ Spring Boot REST APIs, role-based workflows for Patients, Doctors, and Admins, and lightweight responsive UI.',
      url: 'https://github.com/KrishnaSujal126',
      tags: ['Java', 'Spring Boot', 'Spring Data JPA', 'REST APIs', 'AI/NLP Triage', 'MySQL', 'HTML5/CSS3/JS']
    },
    {
      title: 'College PYQ Management System',
      description: 'Built a web-based PYQ (Previous Year Questions) Management System allowing university students to search, filter by semester and subject, and download question papers with Spring Boot REST APIs and MySQL integration.',
      url: 'https://github.com/KrishnaSujal126',
      tags: ['Java', 'Spring Boot', 'MySQL', 'Spring Data JPA', 'REST APIs', 'JavaScript']
    },
    {
      title: 'Movie Ticket Booking System',
      description: 'Developed a comprehensive Java-based application with seat selection, dynamic pricing tier calculation, booking lifecycle management, and core Object-Oriented Programming (OOP) principles.',
      url: 'https://github.com/KrishnaSujal126',
      tags: ['Java', 'OOP Architecture', 'Data Structures', 'Booking Algorithms']
    }
  ];

  for (const p of projects) {
    await db.run(
      'INSERT INTO projects (title, description, url, tags) VALUES (?, ?, ?, ?)',
      p.title,
      p.description,
      p.url,
      JSON.stringify(p.tags)
    );
  }
}

module.exports = { getDb, seedProjects };
