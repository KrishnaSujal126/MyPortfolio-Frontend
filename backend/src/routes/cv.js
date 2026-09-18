const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
  const cvPath = path.join(__dirname, '..', '..', 'public', 'cv.pdf');
  if (fs.existsSync(cvPath)) {
    return res.sendFile(cvPath);
  }
  return res.status(404).json({ error: 'CV not found. Place `cv.pdf` in backend/public/' });
});

module.exports = router;
