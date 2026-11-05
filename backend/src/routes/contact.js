const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/auth');
const { sendContact, getContacts, deleteContact } = require('../controllers/contactController');

// Public route: Submit contact form
router.post('/', sendContact);

// Admin-protected routes: View and delete messages
router.get('/', requireAdmin, getContacts);
router.delete('/:id', requireAdmin, deleteContact);

module.exports = router;
