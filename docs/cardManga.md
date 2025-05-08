## 📘 MangaInfoCard - Documentation

Ce dossier de composants React gère l'affichage, la création et l'édition d'informations liées à un manga dans une interface utilisateur.

## 🧩 Composants

---

### `EmptyMangaCard`

> Affiche un message vide avec un bouton d'ajout lorsqu'aucun manga n'est associé à une licence.

#### Props

| Nom          | Type         | Description                                                         |
| ------------ | ------------ | ------------------------------------------------------------------- |
| `onAddManga` | `() => void` | (Optionnel) Callback lors du clic sur le bouton "Ajouter un manga". |

#### Exemple

```tsx
<EmptyMangaCard onAddManga={() => console.log('Ajout')} />
```

---

### `MangaHeader`

> Gère l'affichage du titre et de l'éditeur du manga, avec un mode édition.

#### Props

| Nom                 | Type                    | Description                               |
| ------------------- | ----------------------- | ----------------------------------------- |
| `title`             | `string`                | Titre du manga.                           |
| `publisher`         | `string`                | Nom de l'éditeur.                         |
| `isEditing`         | `boolean`               | Active/désactive le mode édition.         |
| `isLoading`         | `boolean`               | Affiche un spinner lors de la sauvegarde. |
| `onEditClick`       | `() => void`            | Déclenche le mode édition.                |
| `onSaveClick`       | `() => void`            | Sauvegarde les modifications.             |
| `onCancelClick`     | `() => void`            | Annule l'édition.                         |
| `onTitleChange`     | `(val: string) => void` | Callback pour modifier le titre.          |
| `onPublisherChange` | `(val: string) => void` | Callback pour modifier l'éditeur.         |

---

### `MangaInfo`

> Affiche les informations détaillées sur un manga : auteurs, volumes, dates, statut.

#### Props

| Nom     | Type        | Description                      |
| ------- | ----------- | -------------------------------- |
| `manga` | `MangaWork` | Objet manga contenant les infos. |

---

### `MangaEditForm`

> Formulaire d’édition complet des champs d’un manga.

#### Props

| Nom               | Type                                           | Description                                          |
| ----------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `manga`           | `MangaWork`                                    | Objet manga à éditer.                                |
| `onFieldChange`   | `(field: keyof MangaWork, value: any) => void` | Gère le changement d’un champ générique.             |
| `onAuthorsChange` | `(authorsString: string) => void`              | Gère le changement de la liste des auteurs (string). |

---

### `MangaInfoCard`

> Composant principal d'affichage et d'édition d'un manga avec gestion d'état local, API et sous-composants.

#### Props

| Nom               | Type                           | Description                                                                  |
| ----------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `manga`           | `MangaWork`                    | (Optionnel) Manga à afficher ou éditer.                                      |
| `licenseId`       | `string`                       | ID de la licence à laquelle est rattaché le manga.                           |
| `isEmptyTemplate` | `boolean`                      | Affiche un écran vide si `true`.                                             |
| `onUpdate`        | `(updated: MangaWork) => void` | Callback déclenché après une mise à jour réussie.                            |
| `onAddManga`      | `() => void`                   | Callback déclenché lors d’un ajout de manga (si `isEmptyTemplate` est vrai). |

#### Fonctionnalités :

* Bascule entre mode affichage et édition
* Sauvegarde des modifications via l’API
* Affichage des messages d’erreur ou de succès
* Affichage du JSON de réponse pour debug
* Intégration de `MangaPartsManager`

---

### `MangaPartsManager`

> Gère dynamiquement les parties d’un manga (arcs, saisons, etc.) : ajout, édition, suppression.

#### Props

| Nom                    | Type                           | Description                                                             |                                                           |
| ---------------------- | ------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| `manga`                | `MangaWork`                    | Le manga dont on gère les parties.                                      |                                                           |
| `licenseId`            | `string`                       | ID de la licence du manga.                                              |                                                           |
| `onUpdate`             | `(updated: MangaWork) => void` | Callback pour mettre à jour le manga après changement dans ses parties. |                                                           |
| `setParentError`       | \`(error: string               | null) => void\`                                                         | Permet d'afficher une erreur au parent (`MangaInfoCard`). |
| `setParentApiResponse` | `(message: string) => void`    | Permet d'afficher un message de succès au parent.                       |                                                           |

#### Fonctionnalités :

* ➕ Ajout de nouvelle partie
* ✏️ Modification d’une partie existante
* 🗑️ Suppression d’une partie avec confirmation
* 📥 Sauvegarde via l’API (`/api/manga-part`)
* 🔁 Mise à jour automatique du manga parent

---

## 📦 Types utilisés

```ts
interface MangaWork {
  id?: string;
  title: string;
  publisher?: string;
  authors?: string[];
  volumes?: number;
  startDate?: Date;
  endDate?: Date;
  status: WorkStatus;
  parts?: MangaPart[];
}

interface MangaPart {
  id: string;
  title: string;
  partNumber: number;
  startVolume: number;
  endVolume: number;
  volumes: number;
  status: WorkStatus;
}

enum WorkStatus {
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  HIATUS = "HIATUS",
  CANCELLED = "CANCELLED",
}
```