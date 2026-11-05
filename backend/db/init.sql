-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(255),
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert project data matching Krishna Kant Pandey's portfolio
INSERT INTO projects (title, description, url, tags) VALUES
(
  "AI Smart Healthcare & Triage System",
  "Engineered an AI Symptom Triage Engine that processes natural-language medical complaints to categorize risk levels (Critical, High, Moderate, Low), with 10+ Spring Boot REST APIs, role-based workflows for Patients, Doctors, and Admins, and lightweight responsive UI.",
  "https://github.com/KrishnaSujal126",
  '["Java","Spring Boot","Spring Data JPA","REST APIs","AI/NLP Triage","MySQL"]'
),
(
  "College PYQ Management System",
  "Built a web-based PYQ (Previous Year Questions) Management System allowing university students to search, filter by semester and subject, and download question papers with Spring Boot REST APIs and MySQL integration.",
  "https://github.com/KrishnaSujal126",
  '["Java","Spring Boot","MySQL","Spring Data JPA","REST APIs","JavaScript"]'
),
(
  "Movie Ticket Booking System",
  "Developed a comprehensive Java-based application with seat selection, dynamic pricing tier calculation, booking lifecycle management, and core Object-Oriented Programming (OOP) principles.",
  "https://github.com/KrishnaSujal126",
  '["Java","OOP Architecture","Data Structures","Booking Algorithms"]'
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
