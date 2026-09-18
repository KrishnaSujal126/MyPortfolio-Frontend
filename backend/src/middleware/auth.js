module.exports = function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.admin_token;
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return res.status(403).json({ error: 'Admin token not configured' });
  if (!token || token !== expected) return res.status(401).json({ error: 'Unauthorized' });
  return next();
};
