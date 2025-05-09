// backend/api/manga/mangaRoutes.js
import express from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.js';
import * as mangaController from './mangaController.js';

const router = express.Router();

// Routes publiques
router.get('/:id', mangaController.getMangaById);

// Routes protégées
router.post('/', isAuthenticated, mangaController.createManga);
router.put('/:id', isAuthenticated, mangaController.updateManga);
router.put('/license/:licenseId/manga/:mangaId', isAuthenticated, mangaController.updateMangaByLicense);

// Routes des parties de manga - protégées
router.post('/part', isAuthenticated, mangaController.createMangaPart);
router.put('/part/:id', isAuthenticated, mangaController.updateMangaPart);
router.delete('/part/:id', isAuthenticated, mangaController.deleteMangaPart);

export default router;