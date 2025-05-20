// backend/api/manga/mangaRoutes.js
import express from 'express';
import * as mangaController from './mangaController.js';
import { authenticatedUser, checkRole } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Routes publiques (pas besoin d'authentification)
router.get('/:id', mangaController.getMangaById);

// Routes protégées (requiert rôle admin)
router.post('/', authenticatedUser, checkRole('admin'), mangaController.createManga);
router.put('/:id', authenticatedUser, checkRole('admin'), mangaController.updateManga);
router.put('/license/:licenseId/manga/:mangaId', authenticatedUser, checkRole('admin'), mangaController.updateMangaByLicense);

// Routes des parties de manga - protégées (requiert rôle admin)
router.post('/part', authenticatedUser, checkRole('admin'), mangaController.createMangaPart);
router.put('/part/:id', authenticatedUser, checkRole('admin'), mangaController.updateMangaPart);
router.delete('/part/:id', authenticatedUser, checkRole('admin'), mangaController.deleteMangaPart);

export default router;

