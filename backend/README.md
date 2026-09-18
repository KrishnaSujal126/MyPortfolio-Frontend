# MyPortfolio Backend (Node/Express)

Quick scaffold for serving portfolio APIs: contact form, projects list, and CV download.

Getting started

1. Install dependencies

```bash
cd backend
npm install
```

2. Run (development)

```bash
npm run dev
```

Then open the site in your browser at `http://localhost:4000/index.html` (backend now serves the frontend files).

3. Configuration

Copy `.env.example` to `.env` and set `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` to enable email sending. If SMTP is not configured, contact submissions are logged to the server console.

Endpoints

- `POST /api/contact` — JSON body `{ name, email, message }` — sends email or logs submission
- `GET /api/projects` — returns sample projects JSON
- `GET /api/cv` — serves `backend/public/cv.pdf` if present

Place your CV at `backend/public/cv.pdf` to enable the CV endpoint.

Database (MySQL)

1. Create a MySQL database and user, then run the init SQL to create the `projects` table and seed sample data:

```bash
# Example (adjust user/db names as needed)
mysql -u root -p
CREATE DATABASE myportfolio;
USE myportfolio;
SOURCE db/init.sql;
```

2. Set database variables in `.env` (see `.env.example`): `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`.

The `GET /api/projects` endpoint now reads projects from the `projects` table. Tags are stored as JSON text in the `tags` column.

API additions

- `POST /api/projects` — create a project, body: `{ title, description, url, tags }` — returns `{ id }`
- `PUT /api/projects/:id` — update a project
- `DELETE /api/projects/:id` — delete a project

Contact persistence

Contact submissions are now saved to the `contacts` table (MySQL) or `contacts` table in SQLite. To view saved contacts in SQLite, open `backend/data/sqlite.db`.

Admin UI

- Open `admin.html` and enter your `ADMIN_TOKEN` (set as `ADMIN_TOKEN` env variable on the server) to manage projects. The admin UI sends `x-admin-token` header to protected endpoints.

Deployment

- Heroku: create an app, set environment variables (`ADMIN_TOKEN`, DB vars, SMTP vars, `FRONTEND_URL`), and push this repository. The included `Procfile` starts the server.
- Render/Other: configure a Node service pointing to `backend/src/index.js`. Set the same environment variables.

Vercel frontend + backend on Heroku/Render

1. Deploy the backend from `server/` to Heroku or Render.
2. Set `FRONTEND_URL` to your Vercel site URL in the backend environment.
3. In `frontend-config.js`, set `window.API_BASE_URL` to your deployed backend URL, e.g. `https://my-backend.herokuapp.com`.
4. Deploy the frontend to Vercel by selecting the root project folder.

The frontend will use `window.API_BASE_URL` when deployed separately. For local dev, it falls back to the local backend path.
