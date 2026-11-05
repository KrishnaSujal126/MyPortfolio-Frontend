module.exports = function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.admin_token;
  const expected = process.env.ADMIN_TOKEN || 'admin123';
  if (!token || token !== expected) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin token' });
  }
  return next();
};
