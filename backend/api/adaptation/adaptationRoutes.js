// backend/api/adaptation/adaptationRoutes.js
import express from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.js';
import * as adaptationController from './adaptationController.js';

const router = express.Router();

// Si vous avez des routes publiques d'adaptation, placez-les ici

// Routes protégées
router.put('/:id', isAuthenticated, adaptationController.updateAdaptation);

export default router;