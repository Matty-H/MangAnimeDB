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
const HOST = process.env.HOST || 'lilite.be';
const PORT = process.env.PORT || 2150;

// Options HTTPS
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'etc/ssl/private/82.66.48.224-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'etc/ssl/certs/82.66.48.224.pem')),
};

// CORS
const allowedOrigins = [
  'https://lilite.be:2150', 'http://lilite.be:2150',
  'https://82.66.48.224:2150', 'http://82.66.48.224:2150',
  'https://localhost:2150', 'http://localhost:2150',
  'https://localhost:3000', 'http://localhost:3000',
  'https://localhost:5173', 'http://localhost:5173',
  'https://accounts.google.com'
];

// Middlewares
app.set('trust proxy', true);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
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
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes d'authentification (ordre important)
app.use('/auth', authHandler);
setupAuthPages(app);
app.get('/auth', (req, res) => res.redirect('/auth/login'));

// Routes API
app.use('/api', apiRoutes);

// Fichiers statiques
app.use('/assets', express.static(path.join(__dirname, '../dist/assets'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) res.set('Content-Type', 'text/css');
    else if (filePath.endsWith('.js')) res.set('Content-Type', 'application/javascript');
  }
}));

// Fichiers statiques à la racine
['favicon.ico', 'robots.txt', 'manifest.json', 'logo.svg'].forEach(file => {
  app.get(`/${file}`, (req, res) => {
    const filePath = path.join(__dirname, `../dist/${file}`);
    fs.existsSync(filePath) 
      ? res.sendFile(filePath) 
      : res.status(404).send('Fichier non trouvé');
  });
});

// Handler pour servir index.html
const serveIndex = (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'), {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store',
    }
  });
};

// Routes pour SPA
app.get('/', serveIndex);
app.get('/*path', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/auth/')) {
    return next();
  }
  serveIndex(req, res);
});

// Gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ Serveur démarré sur https://${HOST}:${PORT} ✅`);
});