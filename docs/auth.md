# Documentation d'authentification

## Architecture des fichiers

```
backend/
├── api/
│   ├── adaptation/          # Routes pour les adaptations
│   ├── anime/              # Routes pour les animes
│   ├── license/            # Routes pour les licences
│   ├── manga/              # Routes pour les mangas
│   ├── search/             # Routes de recherche
│   ├── user/               # Routes utilisateur
│   └── index.js            # Router principal des API
├── auth/
│   ├── auth-pages.js       # Configuration des pages d'authentification
│   └── auth-routes.js      # Routes Auth.js avec Google OAuth
├── middleware/
│   ├── auth.middleware.js  # Middlewares d'authentification
│   └── errorHandler.js     # Gestionnaire d'erreurs global
├── prisma/                 # Configuration base de données
├── types/                  # Types TypeScript
└── apiServer.js           # Serveur principal
```

## 1. Configuration du serveur principal (`apiServer.js`)

Le serveur utilise Express avec HTTPS et configure :
- **CORS** : Autorise les domaines Sademaru et localhost
- **Authentification** : Montée sur `/auth`
- **API** : Montée sur `/api`
- **Pages d'auth** : Configuration automatique des routes `/auth/login`, `/auth/logout`, etc.

```javascript
// Routes d'authentification (ordre important)
app.use('/auth', authHandler);
setupAuthPages(app);

// Routes API
app.use('/api', apiRoutes);
```

## 2. Configuration Auth.js (`auth/auth-routes.js`)

Utilise **@auth/express** avec :
- **Provider** : Google OAuth uniquement
- **Gestion des rôles** : Basée sur les emails configurés dans `ROLE_EMAILS`
- **Session customisée** : Inclut email, image et rôle

### Gestion des rôles
Les rôles sont définis dans la variable d'environnement `ROLE_EMAILS` :
```
ROLE_EMAILS=admin:admin@example.com,editor:editor@example.com
```

## 3. Pages d'authentification (`auth/auth-pages.js`)

Configure automatiquement les routes :
- `/auth/login` - Connexion
- `/auth/logout` - Déconnexion  
- `/auth/error` - Gestion des erreurs
- `/auth/verify-request` - Vérification des demandes

Toutes redirigent vers `dist/index.html` pour être gérées côté frontend.

## 4. Middlewares d'authentification (`middleware/auth.middleware.js`)

### `authenticatedUser(req, res, next)`
Vérifie qu'un utilisateur est connecté et ajoute la session à `req.session`.

### `checkRole(role)`
Middleware factory qui vérifie un rôle spécifique :
```javascript
export const isAdmin = checkRole('admin');
export const isEditor = checkRole('editor');  
export const isUser = checkRole('user');
```

### Optimisations
- **Cache de session** : Utilise `res.locals.session` pour éviter les appels répétés
- **Ajout automatique du rôle** : Si absent dans la session, le calcule automatiquement

## 5. Utilisation dans les routes

### Route protégée simple
```javascript
import { authenticatedUser } from '../middleware/auth.middleware.js';

router.get('/protected', authenticatedUser, (req, res) => {
  res.json({ 
    message: "Route protégée",
    user: req.session.user 
  });
});
```

### Route avec rôle spécifique
```javascript
import { isAdmin } from '../middleware/auth.middleware.js';

router.get('/admin', isAdmin, (req, res) => {
  res.json({ message: "Route admin uniquement" });
});
```

### Combinaison de middlewares
```javascript
import { authenticatedUser, checkRole } from '../middleware/auth.middleware.js';

router.get('/editor', 
  authenticatedUser, 
  checkRole('editor'), 
  (req, res) => {
    res.json({ message: "Accès éditeur" });
  }
);
```

## 6. Structure de la session

Après authentification, `req.session` contient :
```javascript
{
  expires: "2024-01-01T00:00:00.000Z",
  user: {
    email: "user@example.com",
    image: "https://lh3.googleusercontent.com/...",
    role: "admin" // ou "editor", "user", "guest"
  }
}
```

## 7. Flux d'authentification

1. **Connexion** : `GET /auth/signin/google`
2. **OAuth Google** : Redirection vers Google
3. **Callback** : `GET /auth/callback/google`
4. **Session** : Création avec email, image et rôle
5. **Redirection** : Vers l'application frontend

## 8. Gestion des erreurs

Le middleware `errorHandler.js` capture toutes les erreurs et retourne :
```javascript
{
  error: "Message d'erreur",
  details: "Détails optionnels",
  path: "/api/route"
}
```

## 9. Variables d'environnement requises

```env
# Google OAuth
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# Auth.js
AUTH_SECRET=your_random_secret_key

# Rôles utilisateurs
ROLE_EMAILS=admin:admin@example.com,editor:editor@example.com

# Serveur
HOST=sademaru.fr
PORT=2150
```

## 10. Sécurité

- **HTTPS** : Certificats Let's Encrypt
- **CORS** : Domaines autorisés explicitement
- **Trust Proxy** : Pour les headers de proxy inverse
- **Session sécurisée** : Secret fort requis pour Auth.js
- **Logging** : Suivi des requêtes et erreurs d'authentification