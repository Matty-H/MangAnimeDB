# 📦 Composants `cardAnime`

Composants React liés à l'affichage et à la gestion des cartes d'animes.

---

## 📁 `AnimeCardHeader.tsx`

### `AnimeCardHeader`

Affiche l'en-tête d'une carte d'anime avec la possibilité de le modifier.

#### Props

| Nom             | Type                                  | Description                                                 |
| --------------- | ------------------------------------- | ----------------------------------------------------------- |
| `anime`         | `object`                              | Objet représentant l'anime d'origine.                       |
| `isEditing`     | `boolean`                             | Indique si l'en-tête est en mode édition.                   |
| `editedAnime`   | `object`                              | Valeurs modifiées de l’anime (si en édition).               |
| `onEdit`        | `() => void`                          | Callback pour activer le mode édition.                      |
| `onSave`        | `() => void`                          | Callback pour enregistrer les modifications.                |
| `onCancel`      | `() => void`                          | Callback pour annuler les modifications.                    |
| `onFieldChange` | `(field: string, value: any) => void` | Callback appelé lors d’un changement de champ.              |
| `isLoading`     | `boolean`                             | Indique si une sauvegarde est en cours (affiche un loader). |

---

## 📁 `AnimeDisplayInfo.tsx`

### `AnimeDisplayInfo`

Affiche les informations de base d’un anime (saisons, statut, dates, etc.).

#### Props

| Nom                | Type                       | Description                                       |
| ------------------ | -------------------------- | ------------------------------------------------- |
| `anime`            | `object`                   | Objet représentant l’anime.                       |
| `onSeasonsUpdated` | `(seasons: any[]) => void` | Callback appelé après la mise à jour des saisons. |

---

## 📁 `AnimeEditForm.tsx`

### `AnimeEditForm`

Formulaire de modification des détails d’un anime.

#### Props

| Nom             | Type                                  | Description                                        |
| --------------- | ------------------------------------- | -------------------------------------------------- |
| `editedAnime`   | `object`                              | Objet représentant les valeurs en cours d’édition. |
| `onFieldChange` | `(field: string, value: any) => void` | Callback appelé lors d’un changement de champ.     |

> **Champs éditables** : nombre d'épisodes, studio, dates, statut (`WorkStatus`), fidélité (`AnimeFidelity`), notes.

---

## 📁 `EmptyAnimeCard.tsx`

### `EmptyAnimeCard`

Carte vide affichée lorsqu’aucun anime n’est associé à une licence.

#### Props

| Nom          | Type         | Description                                                    |
| ------------ | ------------ | -------------------------------------------------------------- |
| `onAddAnime` | `() => void` | Callback appelé lors du clic sur le bouton "Ajouter un anime". |

---

## 📁 `AnimeInfoCard.tsx`

### `AnimeInfoCard`

Composant principal affichant la carte complète d’un anime, en mode lecture ou édition.

#### Props

| Nom               | Type                          | Description                                               |
| ----------------- | ----------------------------- | --------------------------------------------------------- |
| `anime`           | `object \| undefined`         | Objet représentant l’anime à afficher ou éditer.          |
| `licenseId`       | `string`                      | Identifiant de la licence associée.                       |
| `isEmptyTemplate` | `boolean`                     | Affiche une carte vide s’il n’y a pas encore d’anime.     |
| `onAnimeUpdated`  | `(updatedAnime: any) => void` | Callback appelé après création ou mise à jour d’un anime. |

> Gère les cas suivants :
>
> * création d’un nouvel anime ;
> * édition et sauvegarde d’un anime existant ;
> * affichage conditionnel d'alertes (`SuccessAlert`, `ErrorAlert`) et d’un débogueur (`ApiResponseDisplay`).

---

## 📁 `AnimeSeasonManager.tsx`

### `AnimeSeasonManager`

Gère la liste des saisons d’un anime, avec ajout, édition, suppression et feedback utilisateur.

#### Props

| Nom                | Type                          | Description                                                               |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------- |
| `anime`            | `AnimeWork`                   | L’anime auquel les saisons sont liées.                                    |
| `seasons`          | `Season[]`                    | Liste initiale des saisons (optionnelle si chargées depuis l’API).        |
| `onSeasonsUpdated` | `(seasons: Season[]) => void` | Callback appelé lorsque les saisons sont modifiées (ajout/édition/supp.). |

> Comporte :
>
> * un formulaire d'ajout de saison (`SeasonForm`),
> * une liste des saisons (`SeasonList`),
> * un système de retour utilisateur (alerte succès/erreur, logs API),
> * gestion asynchrone des appels via `AnimeSeasonAPI`.

---

## 📁 `SeasonForm.tsx`

### `SeasonForm`

Formulaire de création ou de modification d'une saison.

#### Props

| Nom                 | Type                                | Description                                                       |
| ------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `season`            | `Season \| undefined`               | Saison existante à modifier (sinon mode ajout).                   |
| `animeAdaptationId` | `string`                            | Identifiant de l'adaptation d'anime associée.                     |
| `seasonNumber`      | `number`                            | Numéro de la saison (utilisé en préremplissage pour la nouvelle). |
| `isEditing`         | `boolean`                           | Indique si le formulaire est en mode édition.                     |
| `isLoading`         | `boolean`                           | Indique si une action est en cours (pour désactiver les boutons). |
| `onSave`            | `(season: Partial<Season>) => void` | Callback lors de la soumission du formulaire.                     |
| `onCancel`          | `() => void`                        | Callback pour annuler l’ajout ou la modification.                 |

---

## 📁 `SeasonItem.tsx`

### `SeasonItem`

Affiche une saison avec ses métadonnées et actions associées (édition, suppression).

#### Props

| Nom         | Type                         | Description                                                        |
| ----------- | ---------------------------- | ------------------------------------------------------------------ |
| `season`    | `Season`                     | Objet représentant la saison.                                      |
| `isLast`    | `boolean`                    | Indique si l’élément est le dernier de la liste (pour la bordure). |
| `onEdit`    | `(seasonId: string) => void` | Callback déclenché lors du clic sur le bouton d'édition.           |
| `onDelete`  | `(seasonId: string) => void` | Callback déclenché lors du clic sur le bouton de suppression.      |
| `isLoading` | `boolean`                    | Désactive le bouton supprimer pendant une action asynchrone.       |

---

## 📁 `SeasonList.tsx`

### `SeasonList`

Affiche une liste de saisons avec boutons d’édition et de suppression.

#### Props

| Nom         | Type                         | Description                                                     |
| ----------- | ---------------------------- | --------------------------------------------------------------- |
| `seasons`   | `Season[]`                   | Tableau des saisons à afficher.                                 |
| `onEdit`    | `(seasonId: string) => void` | Callback appelé lors de la demande d’édition d’une saison.      |
| `onDelete`  | `(seasonId: string) => void` | Callback appelé lors de la demande de suppression d’une saison. |
| `isLoading` | `boolean`                    | Indique si une action (comme delete) est en cours.              |

---

## 🛠️ Dépendances utilisées

* **Icons** : `lucide-react` (`Pencil`, `Check`, `X`, `Tv`, `Calendar`, `Info`, `Film`, `Plus`)
* **UI personnalisée** : composants CSS avec classes `daisyUI` (`btn`, `input`, `select`, `card`, etc.)
* **Types** : `WorkStatus`, `AnimeFidelity`, `Season`, `AnimeWork`
* **Services API** : `AnimeSeasonAPI` (`getSeasons`, `createSeason`, `updateSeason`, `deleteSeason`)
* **UI Feedback** : `ApiResponseDisplay`, `ErrorAlert`, `SuccessAlert`
* **Composants supplémentaires** :

  * `Badge` : pour l'affichage des badges de fidélité et couverture
  * `SeasonForm` : formulaire de gestion d’une saison
  * `SeasonItem` : affichage individuel d’une saison
  * `SeasonList` : liste des saisons affichées avec gestion des actions