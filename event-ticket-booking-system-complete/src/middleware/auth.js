const basicAuth = require('basic-auth');
exports.requireAdmin = (req, res, next) => {
  const token = process.env.ADMIN_TOKEN || 'password123';
  const user = basicAuth(req);
  if (!user || user.name !== 'admin' || user.pass !== token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
