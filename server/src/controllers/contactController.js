const nodemailer = require('nodemailer');

exports.sendContact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email, message required' });

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toAddress = process.env.CONTACT_TO || process.env.SMTP_USER;

  // persist contact to DB if available
  try {
    if (process.env.DB_TYPE === 'mysql') {
      const pool = require('../db');
      await pool.query('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    } else {
      const { getDb } = require('../sqlite');
      const db = await getDb();
      await db.run('INSERT INTO contacts (name, email, message) VALUES (?,?,?)', name, email, message);
    }
  } catch (err) {
    console.error('Failed to persist contact:', err && err.message ? err.message : err);
  }

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('Contact submission (no SMTP configured):', { name, email, message });
    return res.json({ ok: true, info: 'Saved locally; no SMTP configured; message logged to server console.' });
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
      subject: `Website contact from ${name}`,
      text: message,
      html: `<p>${message}</p><p>From: ${name} &lt;${email}&gt;</p>`,
    });

    return res.json({ ok: true, info: info.messageId || info.response });
  } catch (err) {
    console.error('Email send error', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
