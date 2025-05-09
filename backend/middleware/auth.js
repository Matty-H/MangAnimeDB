//backend/middleware/auth.js
import { requireAuth, getAuth, clerkClient } from '@clerk/express';

// Middleware d'authentification simple qui renvoie une fonction express standard
export const isAuthenticated = (req, res, next) => {
  try {
    // Vérifier si l'authentification Clerk est disponible
    const auth = getAuth(req);
    
    if (!auth || !auth.userId) {
      return res.status(401).json({ 
        message: 'Authentification requise', 
        error: 'Vous devez être connecté pour accéder à cette ressource' 
      });
    }
    
    // L'utilisateur est authentifié, on continue
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur d\'authentification',
      error: error.message 
    });
  }
};

// Version avancée utilisant directement requireAuth() de Clerk
// export const isAuthenticated = requireAuth();

export const isAdmin = async (req, res, next) => {
  try {
    // Récupérer l'ID utilisateur depuis la requête
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    
    // Obtenir les métadonnées privées directement depuis l'API Clerk
    const user = await clerkClient.users.getUser(userId);
    
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