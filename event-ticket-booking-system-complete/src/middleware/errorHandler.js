module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const payload = { error: { message: err.message || 'Internal Server Error', status } };
  if (process.env.NODE_ENV === 'development' && err.stack) payload.error.stack = err.stack;
  res.status(status).json(payload);
};
