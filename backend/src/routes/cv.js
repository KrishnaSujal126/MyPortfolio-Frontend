const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
  const candidates = [
    path.join(__dirname, '..', 'public', 'cv.pdf'),
    path.join(__dirname, '..', '..', 'public', 'cv.pdf'),
    path.join(__dirname, '..', '..', 'frontend', 'resume.pdf'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return res.sendFile(candidate);
    }
  }

  return res.status(404).json({ error: 'CV file not found.' });
});

module.exports = router;
