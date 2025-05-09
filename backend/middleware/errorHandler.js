// backend/middleware/errorHandler.js
const errorHandler = (
  err,
  req,
  res,
  next // Ajout du paramètre next qui est requis pour un middleware d'erreur Express
) => {
  console.error('Error:', err);
  
  // Vérification que res est valide et a la méthode status
  if (!res || typeof res.status !== 'function') {
    console.error('Invalid response object');
    return next(err); // Passer l'erreur au middleware suivant
  }

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    error: err.message || 'Erreur serveur interne',
    details: err.details || undefined,
    path: req.path
  });
};

export default errorHandler;