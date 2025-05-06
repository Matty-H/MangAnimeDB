//backend/middleware/errorHandler.js
const errorHandler = (
  err,
  req,
  res,
) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    error: err.message || 'Erreur serveur interne',
    details: err.details || undefined,
    path: req.path
  });
};

export default errorHandler;