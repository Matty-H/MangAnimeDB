# Documentation - Composants Manga Card

## Vue d'ensemble

Le module `cardManga` est composé de 6 composants React qui forment ensemble un système complet de gestion des mangas. Il permet l'affichage, l'édition et la gestion des parties/arcs d'un manga avec une interface utilisateur cohérente.

## Architecture des composants

```
MangaInfoCard (Composant principal)
├── EmptyMangaCard (État vide)
├── MangaCardHeader (En-tête avec titre/éditeur)
├── MangaDisplayInfo (Affichage des informations)
├── MangaEditForm (Formulaire d'édition)
└── MangaPartsManager (Gestion des parties/arcs)
```

---

## 1. MangaInfoCard (Composant principal)

### Props
```typescript
interface MangaInfoCardProps {
  manga?: MangaWork;
  licenseId: string;
  isEmptyTemplate?: boolean;
  onUpdate?: (updatedManga: MangaWork) => void;
  onAddManga?: () => void;
  onMangaDeleted?: (mangaId: string) => void;
}
```

### Responsabilités
- **Orchestration** : Coordonne tous les sous-composants
- **Gestion d'état** : Contrôle l'édition, le chargement, les erreurs
- **API Communication** : Interface avec le searchService pour CRUD
- **Mode édition** : Bascule entre affichage et édition
- **Alertes** : Gestion des messages de succès/erreur

### États internes clés
- `isEditing` : Mode édition activé/désactivé
- `editedManga` : Version en cours d'édition
- `apiResponse` / `error` : Gestion des retours API
- `showDeleteConfirm` : Confirmation de suppression

---

## 2. EmptyMangaCard

### Props
```typescript
interface EmptyMangaCardProps {
  onAddManga?: () => void;
}
```

### Responsabilités
- Affichage de l'état vide (aucun manga trouvé)
- Bouton d'ajout conditionnel (mode édition uniquement)

---

## 3. MangaCardHeader

### Props
```typescript
interface MangaHeaderProps {
  title: string;
  publisher: string;
  isEditing: boolean;
  isLoading: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  onDeleteClick: () => void;
  onTitleChange: (value: string) => void;
  onPublisherChange: (value: string) => void;
}
```

### Responsabilités
- Affichage/édition du titre et éditeur
- Boutons d'actions (Éditer, Sauvegarder, Annuler, Supprimer)
- Gestion des états de chargement

---

## 4. MangaDisplayInfo

### Props
```typescript
interface MangaDisplayInfoProps {
  manga: MangaWork;
  onVolumesUpdated?: (updatedVolumes: any) => void; // Non utilisée actuellement
}
```

### Responsabilités
- Affichage des informations de lecture seule
- Formatage des dates et années de publication
- Badges de statut
- Informations sur auteurs, volumes, période

---

## 5. MangaEditForm

### Props
```typescript
interface MangaEditFormProps {
  manga: MangaWork;
  onFieldChange: (field: keyof MangaWork, value: any) => void;
  onAuthorsChange?: (authorsString: string) => void; // Optionnel
}
```

### Responsabilités
- Formulaire d'édition des champs manga
- Gestion spéciale des auteurs (chaîne → tableau)
- Validation des types (dates, nombres)

---

## 6. MangaPartsManager

### Props
```typescript
interface MangaPartsManagerProps {
  manga: MangaWork;
  licenseId: string;
  onUpdate: (updatedManga: MangaWork) => void;
  setParentError: (error: string | null) => void;
  setParentApiResponse: (message: string) => void;
}
```

### Responsabilités
- **CRUD complet** des parties/arcs de manga
- **Édition inline** des parties existantes
- **Ajout** de nouvelles parties
- **Suppression** avec confirmation
- **Calcul automatique** du nombre de volumes par partie
- **Synchronisation** avec le composant parent

### États internes
- `editingPartId` : ID de la partie en cours d'édition
- `editedParts` : Liste des parties modifiées
- `isAddingPart` : Mode ajout activé
- `newPart` : Données pour nouvelle partie

---

## Flux de données

```
MangaInfoCard
├── État local (editedManga)
├── API calls (searchService)
├── Props callbacks vers parent
└── Props/callbacks vers enfants
    ├── MangaPartsManager
    │   ├── État local (editedParts)
    │   ├── API calls (searchService)
    │   └── Callbacks vers MangaInfoCard
    └── Autres composants (affichage/édition)
```

---

## Pistes d'amélioration

### 🔧 Architecture & Structure

1. **Séparation des responsabilités**
   - Extraire la logique API dans des hooks personnalisés (`useMangaCRUD`, `useMangaPartsCRUD`)
   - Créer un contexte `MangaContext` pour partager l'état entre composants
   - Séparer la logique de validation dans des utilitaires

2. **Réduction de la complexité**
   - MangaInfoCard est trop volumineux (>200 lignes)
   - Extraire les fonctions de gestion API dans un service dédié
   - Créer des composants intermédiaires pour regrouper les fonctionnalités

### 🎯 Gestion d'état

3. **État global vs local**
   - Utiliser React Query/SWR pour le cache et la synchronisation
   - Réduire la duplication d'état entre MangaInfoCard et MangaPartsManager
   - Implémenter un reducer pour les opérations complexes

4. **Optimisation des re-renders**
   - Mémoriser les callbacks avec `useCallback`
   - Utiliser `React.memo` pour les composants purement présentationnels
   - Optimiser les dépendances des `useEffect`

### 🚀 UX/UI

5. **Expérience utilisateur**
   - Ajouter des états de chargement granulaires
   - Implémenter un système d'annulation (undo/redo)
   - Améliorer la validation en temps réel
   - Ajouter des raccourcis clavier (Ctrl+S pour sauvegarder)

6. **Accessibilité**
   - Ajouter des labels ARIA appropriés
   - Gérer la navigation au clavier
   - Améliorer les contrastes et la lisibilité

### ⚡ Performance

7. **Optimisations techniques**
   - Lazy loading des composants non critiques
   - Debounce sur les inputs de recherche/édition
   - Pagination pour les listes de parties longues
   - Cache local des données fréquemment utilisées

### 🔒 Robustesse

8. **Gestion d'erreurs**
   - Boundary d'erreur React pour les crashs
   - Retry automatique pour les échecs réseau
   - Messages d'erreur plus explicites
   - Validation côté client renforcée

9. **Types et sécurité**
   - Renforcer le typage TypeScript
   - Ajouter des guards de type
   - Valider les données API avec des schémas (Zod, Yup)

### 📱 Responsive & Mobile

10. **Adaptabilité**
    - Optimiser pour mobile/tablette
    - Gérer les interactions tactiles
    - Adapter les modales et formulaires

---

## Suggestions de refactoring prioritaires

### Phase 1 - Hooks personnalisés
```typescript
// Extraire la logique API
const useMangaCRUD = (licenseId: string) => {
  // Logique create, update, delete manga
}

const useMangaPartsCRUD = (mangaId: string) => {
  // Logique CRUD parties
}
```

### Phase 2 - Réduction de complexité
```typescript
// Diviser MangaInfoCard
<MangaInfoCard>
  <MangaContent />      // Logique d'affichage
  <MangaActions />      // Boutons et actions
  <MangaAlerts />       // Gestion des alertes
</MangaInfoCard>
```

### Phase 3 - État global
```typescript
// Contexte partagé
const MangaProvider = ({ children }) => {
  // État et actions partagées
}
```

Cette architecture modulaire facilitera la maintenance, les tests et l'évolutivité du système de gestion des mangas.