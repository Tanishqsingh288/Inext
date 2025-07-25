// This middleware handles any errors in your app and returns a clean message
function ErrorMiddleware(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';

  res.status(status).json({
    success: false,
    message: message
  });
}

module.exports = ErrorMiddleware;
