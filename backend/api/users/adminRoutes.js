//backend/api/users/adminRoutes.js
import express from 'express';
import { authenticatedUser, checkRole } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Route existante pour les administrateurs
router.get('/admin-dashboard', authenticatedUser, checkRole('admin'), (req, res) => {
  res.json({ message: 'Bienvenue, administrateur!' });
});

export default router;