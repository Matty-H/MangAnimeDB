// backend/api/anime/animeRoutes.js
import express from 'express';
import { authenticatedUser, checkRole } from '../../middleware/auth.middleware.js';
import * as animeController from './animeController.js';

const router = express.Router();

// Routes publiques - accessibles à tous
router.get('/:id', animeController.getAnimeById);

// Routes protégées - nécessitent une authentification
router.post('/', authenticatedUser, checkRole('admin'), animeController.createAnime);
router.put('/:id', authenticatedUser, checkRole('admin'), animeController.updateAnime);
router.delete('/:id', authenticatedUser, checkRole('admin'), animeController.deleteAnime);

// Routes des saisons d'anime - également protégées
router.post('/season', authenticatedUser, checkRole('admin'), animeController.createAnimeSeason);
router.put('/season/:id', authenticatedUser, checkRole('admin'), animeController.updateAnimeSeason);
router.delete('/season/:id', authenticatedUser, checkRole('admin'), animeController.deleteAnimeSeason);

export default router;