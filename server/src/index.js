require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const contactRouter = require('./routes/contact');
const projectsRouter = require('./routes/projects');
const cvRouter = require('./routes/cv');

const app = express();
const frontendUrl = process.env.FRONTEND_URL;
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (!frontendUrl || origin === frontendUrl) return callback(null, true);
    callback(new Error('CORS policy blocked by server'));
  },
};
app.use(cors(corsOptions));
app.use(express.json());

// static public files (e.g. cv.pdf)
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Serve frontend static files from project root so visiting / shows the site
const frontendRoot = path.join(__dirname, '..', '..');
app.use(express.static(frontendRoot));

app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/cv', cvRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
