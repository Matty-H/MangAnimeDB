//backend/api/manga/mangaRoutes.js
import express from 'express';

import { 
  getMangaById,
  createManga, 
  updateManga,
  updateMangaByLicense,
  createMangaPart,
  updateMangaPart,
  deleteMangaPart
} from './mangaController.js';

const router = express.Router();

// GET - Récupérer un manga par ID
router.get('/:id', getMangaById);

// POST - Ajouter un nouveau manga
router.post('/', createManga);

// PUT - Mettre à jour un manga
router.put('/:id', updateManga);

// PUT - Mettre à jour un manga via la licence
router.put('/license/:licenseId/manga/:mangaId', updateMangaByLicense);

// Routes pour les parties de manga
// POST - Ajouter une nouvelle partie
router.post('/part', createMangaPart);

// PUT - Mettre à jour une partie
router.put('/part/:id', updateMangaPart);

// DELETE - Supprimer une partie
router.delete('/part/:id', deleteMangaPart);

export default router;