//backend/api/users/usersRoutes.js
import express from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Route accessible uniquement aux administrateurs authentifiés
router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.json({ message: 'Bienvenue, administrateur!' });
});

export default router;