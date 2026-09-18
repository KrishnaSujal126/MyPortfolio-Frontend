-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(255),
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert project data from resume
INSERT INTO projects (title, description, url, tags) VALUES
("Movie Ticket Booking System", "Developed a Java-based application with seat selection, booking management, and user interaction for a movie ticket booking workflow.", "", '["Java","OOP","Booking System"]'),
("AI-Based Healthcare Solution", "Designed an AI-powered healthcare solution to improve diagnosis support and patient care using machine learning basics and data processing.", "", '["Machine Learning","Healthcare","Data Processing"]');

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
