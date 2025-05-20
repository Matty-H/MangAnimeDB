// backend/api/adaptation/adaptationRoutes.js
import express from 'express';
import { authenticatedUser, checkRole } from '../../middleware/auth.middleware.js';
import * as adaptationController from './adaptationController.js';

const router = express.Router();

// Si vous avez des routes publiques d'adaptation, placez-les ici

// Routes protégées
router.put('/:id', authenticatedUser, checkRole('admin'), adaptationController.updateAdaptation);

export default router;