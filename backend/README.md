# Krishna Kant Pandey — Portfolio Backend (Node.js & Express)

A robust backend REST API service providing dynamic project management, contact form submission persistence, and resume delivery for Krishna Kant Pandey's portfolio.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Locally
```bash
# Production mode
npm start

# Development mode (auto-reload via nodemon)
npm run dev
```

The server will start on **`http://localhost:4000`** and automatically serve the frontend portfolio pages:
* **Home**: `http://localhost:4000/index.html`
* **About**: `http://localhost:4000/about.html`
* **Projects**: `http://localhost:4000/projects.html`
* **CV**: `http://localhost:4000/cv.html`
* **Contact**: `http://localhost:4000/contact.html`
* **Admin Dashboard**: `http://localhost:4000/admin.html`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Healthcheck and server status | No |
| `GET` | `/api/projects` | Fetch all portfolio projects | No |
| `POST` | `/api/projects` | Add a new project (`{ title, description, url, tags }`) | Yes (`x-admin-token`) |
| `PUT` | `/api/projects/:id` | Update an existing project | Yes (`x-admin-token`) |
| `DELETE` | `/api/projects/:id` | Delete a project | Yes (`x-admin-token`) |
| `POST` | `/api/contact` | Submit contact message (`{ name, email, subject, message }`) | No |
| `GET` | `/api/cv` | Direct stream of Krishna's resume PDF | No |

---

## 🗄️ Database Architecture

The backend supports **dual database backends**:

### 1. SQLite (Default, Zero-Setup)
* Active by default out-of-the-box — no external database server needed.
* Database file is automatically created at `backend/data/sqlite.db`.
* Pre-seeded with your 3 key software engineering projects:
  1. **AI Smart Healthcare & Triage System**
  2. **College PYQ Management System**
  3. **Movie Ticket Booking System**

### 2. MySQL (Optional Production DB)
To use MySQL:
1. Create a database:
   ```sql
   CREATE DATABASE myportfolio;
   USE myportfolio;
   SOURCE db/init.sql;
   ```
2. In `.env`, set:
   ```env
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=myportfolio
   ```

---

## 📧 Contact Form & Email Notifications

When a visitor submits a message through [`contact.html`](../frontend/contact.html):
1. **Database Persistence**: The message is automatically recorded in the `contacts` table in SQLite (`backend/data/sqlite.db`) or MySQL.
2. **Email Forwarding (SMTP)**:
   * If SMTP credentials are configured in `.env`, the message is instantly emailed to your inbox (`krishnaQ2004@gmail.com`).
   * If SMTP credentials are omitted, the server logs the contact details to the console while safely storing it in the database.

---

## ⚙️ Environment Variables (`.env`)

Copy `.env.example` to `.env`:
```env
PORT=4000
FRONTEND_URL=http://localhost:4000

# Security token for Admin UI (projects management)
ADMIN_TOKEN=your_secret_admin_token

# Optional Database: 'sqlite' (default) or 'mysql'
DB_TYPE=sqlite
SQLITE_FILE=data/sqlite.db

# Optional SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_TO=krishnaQ2004@gmail.com
```

---

## 🚀 Deployment Options

* **Heroku / Render / Railway**:
  * Set root to `backend/`.
  * Set `FRONTEND_URL` to your production domain.
  * Start command: `node src/index.js` (uses included `Procfile`).
* **Vercel**:
  * Deploy `frontend/` as a static site.
  * In `frontend/frontend-config.js`, set `window.API_BASE_URL = 'https://your-backend-api.com';`.
