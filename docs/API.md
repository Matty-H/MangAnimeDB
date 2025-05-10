# API Documentation - Anime/Manga Tracking Application

## Table des matières

- [Introduction](#introduction)
- [Configuration du serveur](#configuration-du-serveur)
- [Authentification](#authentification)
- [Endpoints](#endpoints)
  - [Animes](#animes)
  - [Mangas](#mangas)
  - [Licences](#licences)
  - [Recherche](#recherche)
  - [Adaptations](#adaptations)
  - [Utilisateurs](#utilisateurs)

## Introduction

Cette API permet de gérer une base de données d'œuvres manga et leurs adaptations anime. Elle est construite avec Express.js et utilise Prisma comme ORM pour interagir avec la base de données.

## Configuration du serveur

Le serveur est configuré dans `apiServer.js` et utilise les technologies suivantes:
- Express.js comme framework
- Clerk pour l'authentification
- Prisma pour l'accès à la base de données

## Authentification

L'API utilise Clerk pour l'authentification et implémente deux niveaux d'accès:

- **Utilisateur authentifié**: Utilise `isAuthenticated` middleware
- **Administrateur**: Utilise `isAdmin` middleware qui vérifie les métadonnées privées de l'utilisateur

## Endpoints

### Animes

#### GET `/api/anime/:id`
Récupère les informations d'un anime spécifique avec ses saisons.

**Réponse**: Objet anime avec saisons incluses.

#### POST `/api/anime` (authentifié)
Ajoute un nouvel anime.

**Corps de la requête**:
```json
{
  "licenseId": "string",
  "title": "string",
  "studio": "string",
  "adaptationType": "string",
  "episodes": "number",
  "status": "string",
  "fidelity": "string",
  "relationType": "string",
  "startDate": "date",
  "endDate": "date",
  "notes": "string",
  "externalId": "string"
}
```

#### PUT `/api/anime/:id` (authentifié)
Modifie un anime existant.

**Corps de la requête**: Identique à POST avec champs optionnels.

#### DELETE `/api/anime/:id` (authentifié)
Supprime un anime et toutes ses saisons associées.

#### POST `/api/anime/season` (authentifié)
Ajoute une nouvelle saison à un anime.

**Corps de la requête**:
```json
{
  "animeAdaptationId": "string",
  "seasonNumber": "number",
  "episodes": "number",
  "fidelity": "FAITHFUL|PARTIAL|ANIME_ORIGINAL",
  "coverageFromVolume": "number",
  "coverageToVolume": "number",
  "notes": "string"
}
```

#### PUT `/api/anime/season/:id` (authentifié)
Modifie une saison existante.

#### DELETE `/api/anime/season/:id` (authentifié)
Supprime une saison.

### Mangas

#### GET `/api/manga/:id`
Récupère les informations d'un manga spécifique avec ses parties.

**Réponse**: Objet manga avec parties incluses.

#### POST `/api/manga` (authentifié)
Crée un nouveau manga.

**Corps de la requête**:
```json
{
  "licenseId": "string",
  "title": "string",
  "authors": "string",
  "volumes": "number",
  "status": "string",
  "startDate": "date",
  "endDate": "date",
  "publisher": "string",
  "externalId": "string"
}
```

#### PUT `/api/manga/:id` (authentifié)
Modifie un manga existant.

#### PUT `/api/manga/license/:licenseId/manga/:mangaId` (authentifié)
Modifie un manga via sa licence.

#### POST `/api/manga/part` (authentifié)
Ajoute une nouvelle partie à un manga.

**Corps de la requête**:
```json
{
  "mangaId": "string",
  "licenseId": "string",
  "title": "string",
  "partNumber": "number",
  "startVolume": "number",
  "endVolume": "number",
  "status": "string"
}
```

#### PUT `/api/manga/part/:id` (authentifié)
Modifie une partie de manga existante.

#### DELETE `/api/manga/part/:id` (authentifié)
Supprime une partie de manga.

### Licences

#### GET `/api/license`
Récupère toutes les licences.

**Réponse**: Liste d'objets licence triés par ordre alphabétique.

#### POST `/api/license` (authentifié)
Crée une nouvelle licence.

**Corps de la requête**:
```json
{
  "title": "string",
  "externalId": "string"
}
```

#### PUT `/api/license/:id` (authentifié)
Modifie une licence existante.

#### DELETE `/api/license/:id` (authentifié)
Supprime une licence.

### Recherche

#### GET `/api/search/suggestions?query=string`
Récupère des suggestions de titres basées sur la requête.

**Paramètres**:
- `query`: Texte à rechercher

**Réponse**: Liste de suggestions limitée à 10 résultats.

#### GET `/api/search/detailed?query=string`
Effectue une recherche détaillée.

**Paramètres**:
- `query`: Texte à rechercher

**Réponse**: Résultats détaillés incluant mangas et adaptations anime.

### Adaptations

#### PUT `/api/adaptation/:id` (authentifié)
Modifie une adaptation (anime ou saison).

**Corps de la requête**:
```json
{
  "episodes": "number",
  "fromVolume": "number",
  "toVolume": "number",
  "type": "anime|season"
}
```

### Utilisateurs

#### GET `/api/admin/check-admin` (authentifié)
Vérifie si l'utilisateur actuel est administrateur.

**Réponse**:
```json
{
  "isAdmin": "boolean"
}
```

#### POST `/api/admin/set-admin` (admin)
Définit un utilisateur comme administrateur.

**Corps de la requête**:
```json
{
  "targetUserId": "string"
}
```

#### GET `/api/admin/admin-dashboard` (admin)
Accède au tableau de bord administrateur.

## Gestion des erreurs

L'API utilise un middleware de gestion d'erreurs qui standardise les réponses en cas d'erreur:

```json
{
  "error": "Message d'erreur",
  "details": "Détails optionnels",
  "path": "Chemin de la requête"
}
```

## Codes de statut

- **200**: Requête réussie
- **201**: Ressource créée avec succès
- **400**: Requête incorrecte (paramètres manquants/invalides)
- **401**: Non authentifié
- **403**: Accès refusé (pas les droits)
- **404**: Ressource non trouvée
- **500**: Erreur serveur interne

## Notes spécifiques

- Les dates doivent être envoyées au format ISO 8601
- Pour les relations mangas/animes, les volumes sont spécifiés par `fromVolume` et `toVolume`
- La fidélité des adaptations anime peut être `FAITHFUL`, `PARTIAL` ou `ANIME_ORIGINAL`