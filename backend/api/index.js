//backend/api/index.js
import express from 'express';
import animeRoutes from './anime/animeRoutes.js';
import mangaRoutes from './manga/mangaRoutes.js';
import licenseRoutes from './license/licenseRoutes.js';
import searchRoutes from './search/searchRoutes.js';
import adaptationRoutes from './adaptation/adaptationRoutes.js';
import userRoutes from './users/usersRoutes.js';
import adminRoute from './users/adminRoutes.js'

const router = express.Router();

// Middleware pour parser le JSON
router.use(express.json());

// Monter les routes
router.use('/anime', animeRoutes);
router.use('/manga', mangaRoutes);
router.use('/license', licenseRoutes);
router.use('/search', searchRoutes);
router.use('/adaptation', adaptationRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoute);


export default router;