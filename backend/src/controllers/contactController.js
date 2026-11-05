const nodemailer = require('nodemailer');

exports.sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  const cleanSubject = (subject || 'Portfolio Contact Inquiry').trim();

  // 1. Persist contact submission to database (SQLite or MySQL)
  try {
    if (process.env.DB_TYPE === 'mysql') {
      const pool = require('../db');
      await pool.query(
        'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, cleanSubject, message]
      );
    } else {
      const { getDb } = require('../sqlite');
      const db = await getDb();
      await db.run(
        'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
        name,
        email,
        cleanSubject,
        message
      );
    }
  } catch (err) {
    console.error('Failed to persist contact submission:', err && err.message ? err.message : err);
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toAddress = process.env.CONTACT_TO || process.env.SMTP_USER || 'krishnaQ2004@gmail.com';

  // 2. Send email via SMTP if configured, else log to server terminal
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('\n================ NEW PORTFOLIO CONTACT MESSAGE ================');
    console.log(`From:    ${name} <${email}>`);
    console.log(`Date:    ${new Date().toLocaleString()}`);
    console.log(`Subject: ${cleanSubject}`);
    console.log(`Message:\n${message}`);
    console.log('=================================================================\n');
    return res.json({
      ok: true,
      info: 'Message recorded successfully in database. (SMTP not configured on server).'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: toAddress,
      subject: `[Portfolio Inquiry] ${cleanSubject}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #f8fafc; color: #1e293b; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0;">New Message from Portfolio Website</h2>
          <p><strong>Sender:</strong> ${name} &lt;<a href="mailto:${email}">${email}</a>&gt;</p>
          <p><strong>Subject:</strong> ${cleanSubject}</p>
          <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 16px 0;">
          <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${message}</p>
        </div>
      `,
    });

    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Nodemailer SMTP Send Error:', err);
    return res.status(500).json({ error: 'Failed to send email via SMTP, but message was saved to database.' });
  }
};

// Admin endpoint: Fetch all contact messages
exports.getContacts = async (req, res) => {
  try {
    if (process.env.DB_TYPE === 'mysql') {
      const pool = require('../db');
      const [rows] = await pool.query('SELECT id, name, email, subject, message, created_at FROM contacts ORDER BY id DESC');
      return res.json(rows);
    }
    const { getDb } = require('../sqlite');
    const db = await getDb();
    const rows = await db.all('SELECT id, name, email, subject, message, created_at FROM contacts ORDER BY id DESC');
    return res.json(rows);
  } catch (err) {
    console.error('Failed to fetch contact messages:', err);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Admin endpoint: Delete a contact message
exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    if (process.env.DB_TYPE === 'mysql') {
      const pool = require('../db');
      await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
      return res.json({ ok: true });
    }
    const { getDb } = require('../sqlite');
    const db = await getDb();
    await db.run('DELETE FROM contacts WHERE id = ?', id);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Failed to delete contact message:', err);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
};
