# Prisma Database Documentation - Anime/Manga Tracking Application

## Table des matières

- [Aperçu](#aperçu)
- [Configuration](#configuration)
- [Modèles de données](#modèles-de-données)
  - [License](#license)
  - [MangaWork](#mangawork)
  - [MangaPart](#mangapart)
  - [AnimeAdaptation](#animeadaptation)
  - [MangaToAnime](#mangatoanime)
  - [MangaPartToAnime](#mangaparttoanime)
  - [AnimeSeason](#animeseason)
- [Énumérations](#énumérations)
- [Relations](#relations)
- [Utilisations avec l'API](#utilisations-avec-lapi)

## Aperçu

L'architecture de la base de données est conçue pour représenter:
- Des licences (franchises) qui regroupent des mangas et leurs adaptations anime
- Des œuvres manga avec leurs différentes parties/arcs
- Des adaptations anime avec leurs saisons
- Les relations complexes entre mangas et adaptations anime

![Prisma Schema](https://github.com/Matty-H/MangAnimeDB/blob/main/docs/prisma-schema.png "Prisma Schema")

## Configuration

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "darwin-arm64", "rhel-openssl-1.0.x"]
}
```

Le projet utilise PostgreSQL comme base de données et génère un client Prisma avec support pour plusieurs architectures.

## Modèles de données

### License

Représente une licence/franchise qui peut contenir plusieurs œuvres manga et adaptations anime.

```prisma
model License {
  id               String           @id @default(cuid())
  externalId       String?          @unique
  title            String
  mangas           MangaWork[]      @relation(name: "LicenseToManga")
  mangaParts       MangaPart[]      @relation(name: "LicenseToMangaPart")
  animeAdaptations AnimeAdaptation[] @relation(name: "AnimeAdaptationToLicense")
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  @@map("licenses")
}
```

**Endpoints API associés**:
- `GET /api/license` - Liste toutes les licences
- `POST /api/license` - Crée une nouvelle licence
- `PUT /api/license/:id` - Modifie une licence existante
- `DELETE /api/license/:id` - Supprime une licence

### MangaWork

Représente une œuvre manga complète appartenant à une licence.

```prisma
model MangaWork {
  id          String         @id @default(cuid())
  externalId  String?        @unique
  licenseId   String
  license     License        @relation(name: "LicenseToManga", fields: [licenseId], references: [id], onDelete: Cascade)
  title       String
  authors     String[]
  volumes     Int
  status      WorkStatus
  startDate   DateTime?
  endDate     DateTime?
  publisher   String
  parts       MangaPart[]    @relation(name: "MangaWorkToParts")
  adaptations MangaToAnime[] @relation(name: "MangaToMangaToAnime")
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@map("mangas")
  @@index([title])
}
```

**Endpoints API associés**:
- `GET /api/manga/:id` - Récupère un manga spécifique
- `POST /api/manga` - Crée un nouveau manga
- `PUT /api/manga/:id` - Modifie un manga existant

### MangaPart

Représente une partie/arc spécifique d'une œuvre manga.

```prisma
model MangaPart {
  id          String         @id @default(cuid())
  externalId  String?        @unique
  mangaId     String
  manga       MangaWork      @relation(name: "MangaWorkToParts", fields: [mangaId], references: [id], onDelete: Cascade)
  licenseId   String
  license     License        @relation(name: "LicenseToMangaPart", fields: [licenseId], references: [id], onDelete: Cascade)
  title       String
  partNumber  Int
  volumes     Int
  startVolume Int
  endVolume   Int
  status      WorkStatus
  startDate   DateTime?
  endDate     DateTime?
  adaptations MangaPartToAnime[] @relation(name: "MangaPartToAnime")
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@map("manga_parts")
}
```

**Endpoints API associés**:
- `POST /api/manga/part` - Ajoute une nouvelle partie à un manga
- `PUT /api/manga/part/:id` - Modifie une partie existante
- `DELETE /api/manga/part/:id` - Supprime une partie

### AnimeAdaptation

Représente une adaptation anime d'une œuvre manga.

```prisma
model AnimeAdaptation {
  id           String           @id @default(cuid())
  externalId   String?          @unique
  licenseId    String
  license      License          @relation(name: "AnimeAdaptationToLicense", fields: [licenseId], references: [id], onDelete: Cascade)
  title        String
  studio       String
  adaptationType AdaptationType
  episodes     Int?
  duration     Int?
  startDate    DateTime?
  endDate      DateTime?
  status       WorkStatus
  fidelity     AnimeFidelity
  notes        String?          @db.Text
  relationType RelationType
  seasons      AnimeSeason[]    @relation(name: "AnimeAdaptationToAnimeSeason")
  sourcedFrom  MangaToAnime[]   @relation(name: "AnimeAdaptationToMangaToAnime")
  partSourcedFrom MangaPartToAnime[] @relation(name: "AnimeAdaptationToMangaPartToAnime")
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt

  @@map("anime_adaptations")
}
```

**Endpoints API associés**:
- `GET /api/anime/:id` - Récupère un anime spécifique
- `POST /api/anime` - Crée un nouvel anime
- `PUT /api/anime/:id` - Modifie un anime existant
- `DELETE /api/anime/:id` - Supprime un anime

### MangaToAnime

Table de jonction représentant la relation entre une œuvre manga complète et son adaptation anime.

```prisma
model MangaToAnime {
  id                 String          @id @default(cuid())
  mangaId            String
  manga_name         MangaWork       @relation(name: "MangaToMangaToAnime", fields: [mangaId], references: [id], onDelete: Cascade)
  animeAdaptationId  String
  anime_name         AnimeAdaptation @relation(name: "AnimeAdaptationToMangaToAnime", fields: [animeAdaptationId], references: [id], onDelete: Cascade)
  coverageFromVolume Int?
  coverageToVolume   Int?
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  @@map("manga_to_anime")
}
```

Cette table permet de gérer la couverture d'un manga par une adaptation anime, en spécifiant les volumes adaptés.

### MangaPartToAnime

Table de jonction représentant la relation entre une partie/arc spécifique d'un manga et son adaptation anime.

```prisma
model MangaPartToAnime {
  id                String          @id @default(cuid())
  mangaPartId       String
  mangaPart         MangaPart       @relation(name: "MangaPartToAnime", fields: [mangaPartId], references: [id], onDelete: Cascade)
  animeAdaptationId String
  animeAdaptation   AnimeAdaptation @relation(name: "AnimeAdaptationToMangaPartToAnime", fields: [animeAdaptationId], references: [id], onDelete: Cascade)
  coverageComplete  Boolean         @default(false)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@map("manga_part_to_anime")
}
```

Cette table permet de gérer la couverture d'une partie spécifique d'un manga par une adaptation anime.

### AnimeSeason

Représente une saison spécifique d'une adaptation anime.

```prisma
model AnimeSeason {
  id                 String          @id @default(cuid())
  animeAdaptationId  String
  animeAdaptation    AnimeAdaptation @relation(name: "AnimeAdaptationToAnimeSeason", fields: [animeAdaptationId], references: [id], onDelete: Cascade)
  seasonNumber       Int
  episodes           Int
  fidelity           AnimeFidelity
  coverageFromVolume Int?
  coverageToVolume   Int?
  notes              String?         @db.Text
  relationType       RelationType?
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  @@map("anime_seasons")
}
```

**Endpoints API associés**:
- `POST /api/anime/season` - Ajoute une nouvelle saison
- `PUT /api/anime/season/:id` - Modifie une saison existante
- `DELETE /api/anime/season/:id` - Supprime une saison

## Énumérations

### WorkStatus

Statuts possibles pour une œuvre (manga ou anime).

```prisma
enum WorkStatus {
  ONGOING
  COMPLETED
  HIATUS
  UNFINISHED
  CANCELED
}
```

### AnimeFidelity

Niveau de fidélité d'une adaptation anime par rapport au manga source.

```prisma
enum AnimeFidelity {
  FAITHFUL
  PARTIAL
  ANIME_ORIGINAL
}
```

### RelationType

Type de relation entre différentes œuvres.

```prisma
enum RelationType {
  ORIGINAL
  MANGA_ADAPTATION
  SEQUEL
  PREQUEL
  REMAKE
  SPIN_OFF
  REBOOT
}
```

### AdaptationType

Type d'adaptation anime.

```prisma
enum AdaptationType {
  TV_SERIES
  MOVIE
  OVA
  ONA
  SPECIAL
}
```

## Relations

Le schéma comprend plusieurs relations complexes:

1. **License → MangaWork / MangaPart / AnimeAdaptation**
   - Une licence peut contenir plusieurs mangas, parties de manga et adaptations anime

2. **MangaWork → MangaPart**
   - Un manga peut être divisé en plusieurs parties/arcs

3. **MangaWork ↔ AnimeAdaptation**
   - Relation many-to-many via la table de jonction `MangaToAnime`
   - Permet de spécifier quels volumes du manga ont été adaptés

4. **MangaPart ↔ AnimeAdaptation**
   - Relation many-to-many via la table de jonction `MangaPartToAnime`
   - Permet d'associer une adaptation à une partie spécifique d'un manga

5. **AnimeAdaptation → AnimeSeason**
   - Une adaptation anime peut avoir plusieurs saisons

## Utilisations avec l'API

L'API REST permet d'interagir avec cette base de données via plusieurs endpoints organisés par entité:

- `/api/license` - Gestion des licences
- `/api/manga` - Gestion des œuvres manga et leurs parties
- `/api/anime` - Gestion des adaptations anime et leurs saisons
- `/api/search` - Recherche à travers les licences, mangas et animes
- `/api/adaptation` - Gestion des relations d'adaptation
- `/api/admin` - Fonctionnalités d'administration

La plupart des opérations nécessitent une authentification utilisateur via Clerk, avec certaines fonctionnalités réservées aux administrateurs.

## Exemples d'utilisation

### Créer une nouvelle licence avec un manga et son adaptation
```javascript
// Avec Prisma Client
const newLicense = await prisma.license.create({
  data: {
    title: "One Piece",
    mangas: {
      create: {
        title: "One Piece",
        authors: ["Eiichiro Oda"],
        volumes: 100,
        status: "ONGOING",
        publisher: "Shueisha"
      }
    },
    animeAdaptations: {
      create: {
        title: "One Piece",
        studio: "Toei Animation",
        adaptationType: "TV_SERIES",
        episodes: 1000,
        status: "ONGOING",
        fidelity: "FAITHFUL",
        relationType: "MANGA_ADAPTATION"
      }
    }
  }
});
```

### Rechercher toutes les adaptations d'un manga
```javascript
const manga = await prisma.mangaWork.findUnique({
  where: { id: mangaId },
  include: {
    adaptations: {
      include: {
        anime_name: true
      }
    }
  }
});
```