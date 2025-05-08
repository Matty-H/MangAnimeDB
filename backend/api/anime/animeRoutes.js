//backend/api/anime/animeRoutes.js
import express from 'express';
import { 
  createAnime, 
  getAnimeById, 
  updateAnime, 
  deleteAnime,
  updateAnimeSeason, 
  deleteAnimeSeason, 
  createAnimeSeason 
} from './animeController.js';

const router = express.Router();

// Middleware pour parser le JSON
router.use(express.json());

// Routes pour les animes
router.post('/', createAnime);
router.get('/:id', getAnimeById);
router.put('/:id', updateAnime);
router.delete('/:id', deleteAnime);

// Routes pour les saisons d'anime
router.post('/season', createAnimeSeason);
router.put('/season/:id', updateAnimeSeason);
router.delete('/season/:id', deleteAnimeSeason);

export default router;