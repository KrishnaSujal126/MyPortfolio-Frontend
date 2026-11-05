# Krishna Kant Pandey — Full Stack Portfolio

An attractive, modern, and tech-forward developer portfolio website with an integrated Node.js Express backend and SQLite/MySQL database support.

---

## 📁 Project Structure

The project is organized into two distinct, standalone directories:

```text
Myportfolio/
├── frontend/                     # Modern UI Client
│   ├── index.html                # Hero banner, stats counters & spotlights
│   ├── about.html                # Narrative, education, skills matrix & certs
│   ├── projects.html             # Projects showcase with live search & filters
│   ├── cv.html                   # ATS-friendly resume with 1-click print & PDF
│   ├── contact.html              # Contact portal with direct copy & form
│   ├── admin.html                # Admin dashboard & live Messages Inbox
│   ├── frontend-config.js        # API connector linking frontend to backend
│   ├── script.js                 # Theme engine, mobile drawer, filters & form logic
│   ├── style.css                 # Dark/Light theme, glassmorphism & responsive CSS
│   ├── my picture.png            # High-resolution profile photo
│   └── resume.pdf                # Official curriculum vitae PDF
│
├── backend/                      # Node.js + Express REST API Server
│   ├── data/
│   │   ├── sqlite.db             # Local SQLite database (projects & messages)
│   │   └── projects.json         # Seed projects dataset
│   ├── db/
│   │   └── init.sql              # MySQL schema & seeds
│   ├── public/
│   │   └── cv.pdf                # Server resume PDF stream
│   ├── src/
│   │   ├── controllers/          # Contact form handler & email logic
│   │   ├── middleware/           # Admin token authentication
│   │   ├── routes/               # /api/projects, /api/contact, /api/cv
│   │   ├── db.js                 # MySQL pool connector
│   │   ├── sqlite.js             # SQLite connector & auto-migrations
│   │   └── index.js              # Server entry point & frontend static server
│   ├── .env.example              # Environment variables template
│   └── package.json              # Backend dependencies
│
├── index.html                    # Root browser redirector to frontend/index.html
├── package.json                  # Root runner script
└── README.md                     # Full stack documentation
```

---

## ⚡ How Frontend & Backend Are Connected

1. **Auto-Detection Connector ([`frontend/frontend-config.js`](frontend/frontend-config.js))**:
   * When you run the backend on port `4000`, the server serves the frontend directly.
   * When you open the frontend via VS Code Live Server (port `5500`) or double-click the HTML files, the client automatically directs all API calls to `http://localhost:4000`.

2. **Live Contact Form Submissions**:
   * Form submissions on [`frontend/contact.html`](frontend/contact.html) hit `POST /api/contact`.
   * Messages are stored in the SQLite `contacts` table and forwarded via SMTP (if configured).

3. **Admin Dashboard & Inbox ([`frontend/admin.html`](frontend/admin.html))**:
   * View and manage projects dynamically.
   * Inspect all visitor inquiries in real time inside the **"📬 Messages Inbox"** tab.

4. **Dynamic Project Sync**:
   * [`frontend/projects.html`](frontend/projects.html) syncs directly with `GET /api/projects` while retaining offline-ready fallback cards.

---

## 🚀 Running the Project

### Option 1: Run Full Stack with One Command (Recommended)
From the root directory:
```bash
npm start
```
This launches the backend server on **`http://localhost:4000`**, which serves both the REST API and the frontend website!

### Option 2: Run Separately

#### Running Backend
```bash
cd backend
npm install
npm start
```
Server runs at `http://localhost:4000`.

#### Running Frontend
* Open [`frontend/index.html`](frontend/index.html) directly in any browser, or
* Right-click [`frontend/index.html`](frontend/index.html) in VS Code and select **"Open with Live Server"**.
