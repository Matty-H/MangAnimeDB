//backend/apiServer.js
import express from 'express';
import apiRoutes from './api/index.js';
import errorHandler from './middleware/errorHandler.js';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const clerkPubKey = process.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

process.env.CLERK_PUBLISHABLE_KEY = clerkPubKey;
process.env.CLERK_SECRET_KEY = clerkSecretKey;

// Middlewares globaux
app.use(clerkMiddleware());
app.use(express.json());

// Monter les routes API
app.use('/api', apiRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT} ✅`);
});