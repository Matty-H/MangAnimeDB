import express from 'express';
import apiRoutes from './api/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(express.json());

// Monter les routes API
app.use('/api', apiRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT} ✅`);
});