function logError(error, req, res, next) {
    console.error(error);
    next(error);
}

function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    error: true,
    message,
    details: err.details || null
  });
}

module.exports = { errorHandler, logError };
