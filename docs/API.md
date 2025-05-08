# 📚 API Documentation

## 🌐 Base URL
http://localhost:3000/api


---

## 📁 Adaptations

| Méthode | Endpoint           | Description                         |
|---------|--------------------|-------------------------------------|
| PUT     | `/adaptation/:id` | Met à jour une adaptation existante |

---

## 📁 Anime

### 🔸 Animes

| Méthode | Endpoint     | Description                         |
|---------|--------------|-------------------------------------|
| POST    | `/anime`     | Crée un nouvel anime                |
| GET     | `/anime/:id` | Récupère un anime par ID           |
| PUT     | `/anime/:id` | Met à jour un anime existant       |
| DELETE  | `/anime/:id` | Supprime un anime existant         |

### 🔸 Saisons d’anime

| Méthode | Endpoint           | Description                           |
|---------|--------------------|---------------------------------------|
| POST    | `/anime/season`    | Crée une nouvelle saison              |
| PUT     | `/anime/season/:id`| Met à jour une saison existante       |
| DELETE  | `/anime/season/:id`| Supprime une saison existante         |

---

## 📁 Manga

| Méthode | Endpoint                                          | Description                                     |
|---------|---------------------------------------------------|-------------------------------------------------|
| GET     | `/manga/:id`                                      | Récupère un manga par ID                        |
| POST    | `/manga`                                          | Crée un nouveau manga                           |
| PUT     | `/manga/:id`                                      | Met à jour un manga                             |
| PUT     | `/manga/license/:licenseId/manga/:mangaId`        | Met à jour un manga via une licence spécifique  |

### 🔸 Parties de manga

| Méthode | Endpoint             | Description                          |
|---------|----------------------|--------------------------------------|
| POST    | `/manga/part`        | Crée une nouvelle partie de manga    |
| PUT     | `/manga/part/:id`    | Met à jour une partie de manga       |
| DELETE  | `/manga/part/:id`    | Supprime une partie de manga         |

---

## 📁 Licenses

| Méthode | Endpoint        | Description                            |
|---------|-----------------|----------------------------------------|
| GET     | `/license`     | Liste toutes les licences              |
| POST    | `/license`     | Crée une nouvelle licence              |
| PUT     | `/license/:id` | Met à jour une licence existante       |
| DELETE  | `/license/:id` | Supprime une licence existante         |

---

## 🔍 Recherche

| Méthode | Endpoint                | Description                        |
|---------|-------------------------|------------------------------------|
| GET     | `/search/suggestions`   | Récupère des suggestions de titres |
| GET     | `/search/detailed`      | Lance une recherche détaillée      |

---

## ⚠️ Gestion des erreurs

Toutes les erreurs sont gérées de manière centralisée via le middleware `errorHandler`.

### Exemple de réponse d'erreur :

```json
{
  "error": "Message d’erreur",
  "details": "Informations supplémentaires (optionnel)",
  "path": "/endpoint/appelé"
}