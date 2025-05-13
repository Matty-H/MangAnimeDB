import express from 'express';
import apiRoutes from './api/index.js';
import errorHandler from './middleware/errorHandler.js';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Charge le bon fichier d'environnement selon NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

console.log("Environnement:", process.env.NODE_ENV);
console.log("Fichier .env utilisé:", envFile);
console.log("HOST:", process.env.HOST);
console.log("PORT:", process.env.PORT);

// Obtenir l'équivalent de __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 2100;
const HOST = process.env.NODE_ENV === 'production' ? '82.66.48.224' : 'localhost';
console.log("HOST (après solution de contournement):", HOST);
const clerkPubKey = process.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

// Configuration des clés Clerk
process.env.CLERK_PUBLISHABLE_KEY = clerkPubKey;
process.env.CLERK_SECRET_KEY = clerkSecretKey;

// Options HTTPS avec chemin absolu
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'etc/ssl/private/82.66.48.224-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'etc/ssl/certs/82.66.48.224.pem')),
};

// Middlewares globaux
app.use(cors()); // Ajoutez CORS pour permettre les requêtes du frontend
app.use(clerkMiddleware());
app.use(express.json());

// Monter les routes API
app.use('/api', apiRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur HTTPS
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ Serveur démarré sur https://${HOST}:${PORT} ✅`);
});