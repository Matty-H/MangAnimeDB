//backend/middleware/authMiddleware.js
import { requireAuth, getAuth, clerkClient} from '@clerk/express';

export const isAuthenticated = requireAuth();

export const isAdmin = async (req, res, next) => {
  try {
    // Récupérer l'ID utilisateur depuis la requête
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    
    // Obtenir les métadonnées privées directement depuis l'API Clerk
    const user = await clerkClient.users.getUser(userId);
    
    // Afficher les métadonnées pour le débogage
    console.log('User metadata:', user.privateMetadata);
    
    // Vérifier si l'utilisateur a le rôle admin
    if (user.privateMetadata && user.privateMetadata.role === 'admin') {
      return next();
    }
    
    return res.status(403).json({ message: 'Accès refusé' });
  } catch (error) {
    console.error('Erreur d\'authentification admin:', error);
    return res.status(500).json({ message: 'Erreur serveur d\'authentification' });
  }
};