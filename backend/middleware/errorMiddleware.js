const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = error.message || 'An unexpected error occurred.';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map((item) => item.message).join(', ');
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'An account with this email already exists.';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'The requested resource is invalid.';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    message = error.message;
  }

  if (statusCode === 500) console.error(error);
  return res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };
