# 🗃️ Prisma Schema – Base de données

Ce document décrit les modèles de données utilisés dans la base PostgreSQL via Prisma. Il inclut les relations, les types énumérés, et les contraintes.

---

## 📦 Models

### `License`

Représente une licence d'œuvre (ex. : FMA001).

| Champ         | Type                     | Description                        |
|---------------|--------------------------|------------------------------------|
| `id`          | String (cuid)            | Identifiant unique                 |
| `externalId`  | String?                  | ID externe unique (ex: FMA001)     |
| `title`       | String                   | Titre de la licence                |
| `mangas`      | `MangaWork[]`            | Mangas liés                        |
| `mangaParts`  | `MangaPart[]`            | Parties de manga liées             |
| `animeAdaptations` | `AnimeAdaptation[]` | Adaptations animées liées          |
| `createdAt`   | DateTime                 | Date de création                   |
| `updatedAt`   | DateTime (auto)          | Mise à jour automatique            |

---

### `MangaWork`

Représente une œuvre manga complète.

| Champ       | Type             | Description                      |
|-------------|------------------|----------------------------------|
| `id`        | String (cuid)    | Identifiant unique               |
| `externalId`| String?          | ID externe unique                |
| `licenseId` | String           | Référence à la licence           |
| `title`     | String           | Titre du manga                   |
| `authors`   | String[]         | Auteurs                          |
| `volumes`   | Int              | Nombre de volumes                |
| `status`    | `WorkStatus`     | Statut de l'œuvre                |
| `startDate` | DateTime?        | Début de publication             |
| `endDate`   | DateTime?        | Fin de publication               |
| `publisher` | String           | Éditeur                          |
| `parts`     | `MangaPart[]`    | Parties de ce manga              |
| `adaptations` | `MangaToAnime[]` | Adaptations animées associées  |

---

### `MangaPart`

Partie ou arc d’un manga (ex. : "Arc Enies Lobby").

| Champ         | Type                   | Description                            |
|---------------|------------------------|----------------------------------------|
| `id`          | String (cuid)          | Identifiant unique                     |
| `mangaId`     | String                 | Référence au manga principal           |
| `licenseId`   | String                 | Référence à la licence                 |
| `title`       | String                 | Titre de la partie                     |
| `partNumber`  | Int                    | Ordre de la partie                     |
| `volumes`     | Int                    | Nombre total de volumes dans la partie|
| `startVolume` | Int                    | Volume de début                        |
| `endVolume`   | Int                    | Volume de fin                          |
| `status`      | `WorkStatus`           | Statut                                 |
| `adaptations` | `MangaPartToAnime[]`   | Adaptations animées associées         |

---

### `AnimeAdaptation`

Représente une adaptation animée.

| Champ           | Type                      | Description                            |
|------------------|---------------------------|----------------------------------------|
| `id`            | String (cuid)             | Identifiant unique                     |
| `licenseId`     | String                    | Référence à la licence                 |
| `title`         | String                    | Titre de l’anime                       |
| `studio`        | String                    | Studio d’animation                     |
| `adaptationType`| `AdaptationType`          | Type d’adaptation                      |
| `episodes`      | Int?                      | Nombre d’épisodes                      |
| `duration`      | Int?                      | Durée en minutes (pour films)          |
| `status`        | `WorkStatus`              | Statut                                 |
| `fidelity`      | `AnimeFidelity`           | Fidélité à l’œuvre                     |
| `relationType`  | `RelationType`            | Type de relation                       |
| `seasons`       | `AnimeSeason[]`           | Saisons de l’anime                     |
| `sourcedFrom`   | `MangaToAnime[]`          | Mangas sources                         |
| `partSourcedFrom` | `MangaPartToAnime[]`    | Parties de manga sources               |

---

### `AnimeSeason`

Représente une saison d’un anime.

| Champ           | Type             | Description                          |
|------------------|------------------|--------------------------------------|
| `seasonNumber`  | Int              | Numéro de la saison                  |
| `episodes`      | Int              | Nombre d’épisodes                    |
| `fidelity`      | `AnimeFidelity`  | Fidélité à l’œuvre                   |
| `coverageFromVolume` | Int?        | Volume de début couvert              |
| `coverageToVolume`   | Int?        | Volume de fin couvert                |

---

### `MangaToAnime`

Table intermédiaire (relation plusieurs-à-plusieurs).

| Champ           | Type             | Description                          |
|------------------|------------------|--------------------------------------|
| `mangaId`       | String           | Référence au manga                   |
| `animeAdaptationId` | String       | Référence à l’anime                  |
| `coverageFromVolume` | Int?        | Volume de début                      |
| `coverageToVolume`   | Int?        | Volume de fin                        |

---

### `MangaPartToAnime`

Table intermédiaire pour les adaptations de parties de manga.

| Champ           | Type             | Description                          |
|------------------|------------------|--------------------------------------|
| `mangaPartId`   | String           | Partie du manga                      |
| `animeAdaptationId` | String       | Adaptation animée                    |
| `coverageComplete`  | Boolean       | Adaptation complète de la partie     |

---

## 🔢 Enums

### `WorkStatus`
- `ONGOING`
- `COMPLETED`
- `HIATUS`
- `UNFINISHED`
- `CANCELED`

### `AnimeFidelity`
- `FAITHFUL`
- `PARTIAL`
- `ANIME_ORIGINAL`

### `RelationType`
- `ORIGINAL`
- `MANGA_ADAPTATION`
- `SEQUEL`
- `PREQUEL`
- `REMAKE`
- `SPIN_OFF`
- `REBOOT`

### `AdaptationType`
- `TV_SERIES`
- `MOVIE`
- `OVA`
- `ONA`
- `SPECIAL`

---

## 🧠 Notes

- Toutes les clés primaires sont des `cuid()` pour des identifiants uniques globaux.
- Les champs `createdAt` et `updatedAt` sont automatiquement gérés.
- Les `@@map()` permettent d’adapter les noms de table pour PostgreSQL.

---

