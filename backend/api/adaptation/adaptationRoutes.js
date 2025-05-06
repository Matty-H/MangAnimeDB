//backend/api/adaptations/adaptationRoutes.js
import express from 'express';
import { updateAdaptation } from './adaptationController.js';

const router = express.Router();

// PUT - Mettre à jour une adaptation
router.put('/:id', updateAdaptation);

export default router;