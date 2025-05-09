// backend/api/anime/animeRoutes.js
import express from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.js'; // Importez le middleware d'authentification
import * as animeController from './animeController.js';

const router = express.Router();

// Routes publiques - accessibles à tous
router.get('/:id', animeController.getAnimeById);

// Routes protégées - nécessitent une authentification
router.post('/', isAuthenticated, animeController.createAnime);
router.put('/:id', isAuthenticated, animeController.updateAnime);
router.delete('/:id', isAuthenticated, animeController.deleteAnime);

// Routes des saisons d'anime - également protégées
router.post('/season', isAuthenticated, animeController.createAnimeSeason);
router.put('/season/:id', isAuthenticated, animeController.updateAnimeSeason);
router.delete('/season/:id', isAuthenticated, animeController.deleteAnimeSeason);

export default router;