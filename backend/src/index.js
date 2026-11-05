require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const contactRouter = require('./routes/contact');
const projectsRouter = require('./routes/projects');
const cvRouter = require('./routes/cv');

const app = express();
const frontendUrl = process.env.FRONTEND_URL;

// Flexible CORS setup: allows local dev servers & configured production frontend
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!frontendUrl) return callback(null, true);
    if (origin === frontendUrl || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy blocked by server'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// 1. Static public files (e.g. cv.pdf)
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// 2. Serve frontend static files from dedicated frontend folder
const frontendRoot = path.resolve(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendRoot));

// 3. API Routes
app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/cv', cvRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

// Clean friendly URLs (e.g., /about, /projects, /contact, /cv, /admin)
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(frontendRoot, `${page}.html`);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  next();
});

// Fallback to index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`🚀 Krishna Kant Pandey Portfolio Server Active!`);
  console.log(`📡 Backend API:      http://localhost:${PORT}/api/health`);
  console.log(`🌐 Full Portfolio:   http://localhost:${PORT}/index.html`);
  console.log(`📬 Admin & Inbox:    http://localhost:${PORT}/admin.html`);
  console.log(`📁 Serving Frontend: ${frontendRoot}`);
  console.log(`========================================================\n`);
});
