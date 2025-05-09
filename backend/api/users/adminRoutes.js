//backend/api/users/adminRoutes.js
import express from 'express';
import { clerkClient } from '@clerk/express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Route pour vérifier si l'utilisateur courant est admin
router.get('/check-admin', isAuthenticated, async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    // Récupérer l'utilisateur depuis l'API Clerk
    const user = await clerkClient.users.getUser(userId);
    
    // Vérifier si l'utilisateur a le rôle admin dans ses privateMetadata
    const isAdmin = user.privateMetadata && user.privateMetadata.role === 'admin';
    
    return res.json({ isAdmin });
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle admin:', error);
    return res.status(500).json({ isAdmin: false, error: 'Erreur serveur' });
  }
});

// Route pour définir un utilisateur comme admin (protégée par le middleware isAdmin)
router.post('/set-admin', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    
    if (!targetUserId) {
      return res.status(400).json({ success: false, error: "ID utilisateur requis" });
    }

    // Mise à jour des métadonnées privées de l'utilisateur cible
    await clerkClient.users.updateUser(targetUserId, {
      privateMetadata: {
        role: 'admin',
      },
    });
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la définition du rôle admin:', error);
    return res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// Route existante pour les administrateurs
router.get('/admin-dashboard', isAuthenticated, isAdmin, (req, res) => {
  res.json({ message: 'Bienvenue, administrateur!' });
});

export default router;