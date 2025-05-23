import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './api/index.js';
import authHandler from './auth/auth-routes.js';
import errorHandler from './middleware/errorHandler.js';
import setupAuthPages from './auth/auth-pages.js';

// Config de base
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const HOST = process.env.HOST || '';
const PORT = process.env.PORT || 2150;

// Options HTTPS
const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.sademaru.fr/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.sademaru.fr/fullchain.pem'),
};

// CORS - AJOUT DES DOMAINES SADEMARU
const allowedOrigins = [
  // Vos domaines de production
  'https://sademaru.fr',
  'http://sademaru.fr',
  'https://www.sademaru.fr',
  'http://www.sademaru.fr',
  'https://api.sademaru.fr:2150',
  'http://api.sademaru.fr:2150',
  
  // Vos anciennes config (à garder pour la transition)
  'https://lilite.be:2150', 
  'http://lilite.be:2150',
  'https://82.66.48.224:2150', 
  'http://82.66.48.224:2150',
  
  // Développement local
  'https://localhost:2150', 
  'http://localhost:2150',
  'https://localhost:3000', 
  'http://localhost:3000',
  'https://localhost:5173', 
  'http://localhost:5173',
  
  // Services externes
  'https://accounts.google.com'
];

// Middlewares
app.set('trust proxy', true);
app.use(cors({
  origin: (origin, callback) => {
    // Permettre les requêtes sans origine (ex: Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Origine refusée: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging simplifié
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Origin: ${req.get('Origin') || 'N/A'}`);
  next();
});

// Routes d'authentification (ordre important)
app.use('/auth', authHandler);
setupAuthPages(app);
app.get('/auth', (req, res) => res.redirect('/auth/login'));

// Routes API
app.use('/api', apiRoutes);

// Route de base pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Backend is running!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ Serveur HTTPS démarré sur le port ${PORT} ✅`);
  console.log(`🌐 Accessible via: https://${HOST}:${PORT}`);
  console.log(`📡 CORS autorisé pour: ${allowedOrigins.join(', ')}`);
});