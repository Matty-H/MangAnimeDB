import express from 'express';
import { authenticatedUser, isAdmin } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Route pour récupérer les informations de l'utilisateur connecté
router.get('/me', authenticatedUser, (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  const userData = {
    email: req.session.user.email,
    role: req.session.user.role || 'guest'
  };

  res.json(userData);
});

// ✅ Nouvelle route protégée pour les administrateurs uniquement
router.get('/admin', authenticatedUser, isAdmin, (req, res) => {
  res.json({
    message: `Bienvenue sur la route admin, ${req.session.user.name}.`,
  });
});

export default router;
