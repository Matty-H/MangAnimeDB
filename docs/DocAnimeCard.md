# Documentation - Module AnimeCard

## Vue d'ensemble

Le module `cardAnime` constitue un système complet de gestion des informations d'anime avec édition en ligne, gestion des saisons et intégration API. Il est conçu autour d'un composant principal (`AnimeInfoCard`) orchestrant plusieurs sous-composants spécialisés.

## Architecture du module

### Composant principal

#### `AnimeInfoCard`
**Rôle** : Chef d'orchestre du module, gère l'état global et la coordination entre les sous-composants.

**Props** :
```typescript
interface AnimeInfoCardProps {
  anime?: any;                                    // Données de l'anime
  licenseId: string;                             // ID de la licence parente
  isEmptyTemplate?: boolean;                     // Affichage en mode vide
  onAnimeUpdated?: (updatedAnime: any) => void;  // Callback de mise à jour
  onAnimeDeleted?: (animeId: string) => void;    // Callback de suppression
}
```

**États internes** :
- `isEditing` : Mode édition actif
- `editedAnime` : Données en cours d'édition
- `apiResponse` / `apiResponseData` : Réponses API pour debug
- `error` : Gestion des erreurs
- `isLoading` : État de chargement
- `showAlert` / `showResponse` : Contrôle des affichages

### Composants de structure

#### `AnimeCardHeader`
**Rôle** : En-tête avec titre, studio et contrôles d'édition.

**Props** :
```typescript
interface AnimeHeaderProps {
  anime: any;
  isEditing: boolean;
  editedAnime: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onFieldChange: (field: string, value: any) => void;
  isLoading: boolean;
}
```

#### `EmptyAnimeCard`
**Rôle** : État vide avec possibilité d'ajout.

**Props** :
```typescript
interface EmptyAnimeCardProps {
  onAddAnime: () => void;
}
```

### Composants de contenu

#### `AnimeDisplayInfo`
**Rôle** : Affichage des informations en mode lecture seule.

**Props** :
```typescript
// Props implicites (non typées)
{
  anime: any;
  onSeasonsUpdated: (seasons: any) => void;
}
```

#### `AnimeEditForm`
**Rôle** : Formulaire d'édition des propriétés de base.

**Props** :
```typescript
// Props implicites (non typées)
{
  editedAnime: any;
  onFieldChange: (field: string, value: any) => void;
}
```

### Gestion des saisons

#### `AnimeSeasonManager`
**Rôle** : Gestionnaire complet des saisons avec CRUD et debug.

**Props** :
```typescript
interface AnimeSeasonManagerProps {
  anime: AnimeWork;
  seasons: Season[];
  onSeasonsUpdated?: (seasons: Season[]) => void;
}
```

**États internes complexes** :
- Gestion multi-modale (ajout/édition/suppression)
- Système d'alertes et debug intégré
- Synchronisation avec API via `animeSeasonService`

#### `SeasonForm`
**Rôle** : Formulaire de création/édition d'une saison avec validation.

**Props** :
```typescript
interface SeasonFormProps {
  season?: Season;                              // Données existantes (mode édition)
  animeAdaptationId: string;                    // ID de l'anime parent
  seasonNumber: number;                         // Numéro de saison
  isEditing: boolean;                          // Mode édition vs création
  isLoading: boolean;                          // État de chargement
  onSave: (season: Partial<Season>) => void;   // Callback de sauvegarde
  onCancel: () => void;                        // Callback d'annulation
}
```

**États internes** :
- `formData` : Données du formulaire avec gestion des types (Partial<Season>)

**Particularités** :
- Gestion intelligente des types (conversion string→number)
- Validation des valeurs d'enum AnimeFidelity
- Interface responsive avec grid layout

#### `SeasonList`
**Rôle** : Container des saisons avec gestion d'état vide.

**Props** :
```typescript
interface SeasonListProps {
  seasons: Season[];                           // Liste des saisons
  onEdit: (seasonId: string) => void;         // Callback d'édition
  onDelete: (seasonId: string) => void;       // Callback de suppression
  isLoading: boolean;                         // État de chargement
}
```

**Logique** :
- Affichage conditionnel (état vide vs liste)
- Gestion des séparateurs visuels entre items
- Délégation des actions aux SeasonItem

#### `SeasonItem`
**Rôle** : Affichage individuel d'une saison avec contrôles.

**Props** :
```typescript
interface SeasonItemProps {
  season: Season;                             // Données de la saison
  isLast: boolean;                           // Position dans la liste
  onEdit: (seasonId: string) => void;        // Callback d'édition
  onDelete: (seasonId: string) => void;      // Callback de suppression
  isLoading: boolean;                        // État de chargement
}
```

**Intégrations** :
- `useEditMode()` : Affichage conditionnel des contrôles
- `Badge` : Affichage des statuts (fidélité, couverture)

**Design** :
- Layout flexible avec alignement intelligent
- Système de badges pour les métadonnées
- Contrôles d'action conditionnels

## Pistes d'amélioration

### 1. Typage et interfaces
**Problème** : Types `any` omniprésents, interfaces manquantes
**Solution** :
```typescript
interface Anime {
  id: string;
  title: string;
  studio: string;
  episodes: number;
  status: WorkStatus;
  fidelity: AnimeFidelity;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  seasons?: Season[];
}
```

### 2. Gestion d'état
**Problème** : État distribué entre composants, logique dupliquée
**Solutions** :
- Utiliser `useReducer` pour l'état complexe d'`AnimeInfoCard`
- Extraire la logique API en hooks personnalisés (`useAnimeOperations`, `useSeasonOperations`)
- Centraliser la gestion des alertes

### 3. Séparation des responsabilités
**Problème** : `AnimeInfoCard` trop volumineux, responsabilités mixtes
**Solutions** :
- Extraire la logique API en services/hooks
- Créer un hook `useAnimeCard` pour la logique métier
- Séparer les composants de debug

### 4. Performance
**Problèmes** : Re-rendus inutiles, props drilling
**Solutions** :
- Mémoïsation avec `React.memo` pour les composants enfants
- Contexte dédié pour les états partagés (édition, loading)
- Optimisation des callbacks avec `useCallback`

### 5. Architecture modulaire
**Suggestion** : Structure en modules métier
```
cardAnime/
├── hooks/
│   ├── useAnimeOperations.ts
│   ├── useSeasonOperations.ts
│   └── useAnimeCard.ts
├── components/
│   ├── AnimeCard/
│   ├── SeasonManager/
│   └── shared/
├── types/
│   └── anime.types.ts
└── utils/
    └── anime.utils.ts
```

### 6. Gestion des erreurs
**Amélioration** : Système unifié avec retry et fallbacks
```typescript
const useErrorBoundary = () => {
  // Gestion centralisée des erreurs
  // Recovery automatique
  // Logging structuré
};
```

### 7. Tests
**Manque** : Couverture de tests
**Solution** : Tests unitaires par composant + tests d'intégration pour les flux complets

### 8. Accessibilité
**Amélioration** : ARIA labels, navigation clavier, contraste
**Focus** : Formulaires et modales notamment

## Complexité actuelle

- **Lignes de code** : ~800+ lignes
- **Composants** : 9 composants interdépendants
- **États** : 15+ états répartis
- **Responsabilités** : Affichage, édition, API, debug, navigation

Cette complexité justifie une refactorisation vers une architecture plus modulaire et maintenable.