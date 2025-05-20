// Schéma des fichiers d'authentification

/**
 * Structure des fichiers pour l'authentification
 * 
 * backend/
 * ├── api/
 * │   ├── route-folder/     //  Dossier contenant les routes API ainsi que les controllers
 * │   └── index.js          //  Router vers les api /anime, /manga, /license, /search, /adaptation, /admin
 * ├── auth/
 * │   ├── auth-config.js    // Configuration et middlewares d'authentification
 * │   └── auth-routes.js    // Routes pour Auth.js avec Google OAuth
 * └── apiServer.js          // Fichier principal du serveur
 * .env                      // Variables d'environnement
 */

// 1. backend/auth/auth-config.js
// Contient la configuration de base et les middlewares d'authentification

// 2. backend/auth/auth-routes.js
// Définit les routes d'authentification avec Auth.js et Google OAuth

// 3. Utilisation dans apiServer.js
import authRoutes from './auth/auth-routes.js';
import { configureAuth } from './auth/auth-config.js';

// Configuration de l'authentification
configureAuth(app);

// Montage des routes d'authentification sur /api/auth
app.use('/api/auth', authRoutes);

// 4. Utilisation des middlewares d'authentification
import { requireAuth, requireRole } from './auth/auth-config.js';

// Route protégée simple
router.get('/protected', requireAuth, (req, res) => {
  res.json({ message: "Route protégée" });
});

// Route protégée avec rôle spécifique
router.get('/admin', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: "Route admin" });
});

// 5. Accès à l'utilisateur authentifié
app.get('/api/profile', requireAuth, (req, res) => {
  // L'utilisateur authentifié est disponible via req.auth.user
  const { name, email, role } = req.auth.user;
  res.json({ name, email, role });
});

/**
 * Flux d'authentification
 * 
 * 1. L'utilisateur accède à /api/auth/signin/google
 * 2. Redirection vers le formulaire de connexion Google
 * 3. Après validation, Google redirige vers /api/auth/callback/google
 * 4. Auth.js crée une session et redirige vers votre application
 * 5. La session est disponible via req.auth
 */