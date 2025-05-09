//frontend/src/components/cardAnime/AnimeSeasonManager.tsx
import React, { useState, useEffect } from 'react';
import { ChevronsLeftRightEllipsis, Plus } from 'lucide-react';
import SeasonForm from './SeasonForm';
import SeasonList from './SeasonList';
import { animeSeasonService } from '../../services';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { ErrorAlert } from '../ui/ErrorAlert';
import { SuccessAlert } from '../ui/SuccessAlert';
import { useEditMode } from '../ui/EditModeContext';

export enum AnimeFidelity {
  FAITHFUL = 'FAITHFUL',
  PARTIAL = 'PARTIAL',
  ANIME_ORIGINAL = 'ANIME_ORIGINAL'
}

export interface Season {
  id: string;
  animeAdaptationId: string;
  seasonNumber: number;
  episodes: number;
  fidelity: AnimeFidelity;
  coverageFromVolume: number | null;
  coverageToVolume: number | null;
  notes: string;
}

export interface AnimeWork {
  id: string;
  seasons?: Season[];
}

interface AnimeSeasonManagerProps {
  anime: AnimeWork;
  seasons: Season[];
  onSeasonsUpdated?: (seasons: Season[]) => void;
}

const AnimeSeasonManager: React.FC<AnimeSeasonManagerProps> = ({ 
  anime, 
  seasons, 
  onSeasonsUpdated 
}) => {
  // États pour la gestion des saisons
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  const [editedSeasons, setEditedSeasons] = useState<Season[]>(seasons || []);
  const [isAddingSeason, setIsAddingSeason] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Nouveaux états pour le système d'alerte et de débogage
  const { isEditMode } = useEditMode();
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  
  // Charger les saisons depuis l'API au chargement du composant si non fournies
  useEffect(() => {
    if (!seasons && anime?.id) {
      const fetchSeasons = async () => {
        setIsLoading(true);
        try {
          const seasons = await animeSeasonService.getSeasons(anime.id);
          setEditedSeasons(seasons);
        } catch (err: any) {
          console.error('Erreur lors du chargement des saisons:', err);
          setError(err.message || 'Erreur lors du chargement des saisons');
          setShowAlert(true);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSeasons();
    }
  }, [anime?.id, seasons]);

  // Effet pour afficher les alertes lors de nouvelles réponses API ou erreurs
  useEffect(() => {
    if (apiResponse || error) {
      setShowAlert(true);
    }
  }, [apiResponse, error]);

  // Fonction pour sauvegarder les modifications d'une saison
  const saveSeasonChanges = async (updatedSeason: Partial<Season>) => {
    if (!updatedSeason.id) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponse('');
    setApiResponseData(null);
    
    try {
      const returnedSeason = await animeSeasonService.updateSeason(updatedSeason.id, updatedSeason);
      
      // Mettre à jour les données de réponse API
      setApiResponseData(returnedSeason);
      setApiResponse('Saison mise à jour avec succès');
      
      // Mettre à jour l'état local des saisons
      const updatedSeasons = editedSeasons.map(season => 
        season.id === updatedSeason.id ? returnedSeason : season
      );
      
      setEditedSeasons(updatedSeasons);
      setEditingSeasonId(null);
      
      // Notifier le parent des changements
      if (onSeasonsUpdated) {
        onSeasonsUpdated(updatedSeasons);
      }
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la saison:', err);
      setError(err.message || 'Erreur lors de la mise à jour de la saison');
      setApiResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter une nouvelle saison
  const addNewSeason = async (newSeason: Partial<Season>) => {
    if (!anime || !anime.id) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponse('');
    setApiResponseData(null);
    
    try {
      const seasonToCreate = {
        ...newSeason,
        animeAdaptationId: anime.id
      };
      
      const createdSeason = await animeSeasonService.createSeason(seasonToCreate);
      
      // Mettre à jour les données de réponse API
      setApiResponseData(createdSeason);
      setApiResponse('Saison créée avec succès');
      
      // Mettre à jour l'état local des saisons
      const updatedSeasons = [...editedSeasons, createdSeason];
      setEditedSeasons(updatedSeasons);
      
      // Réinitialiser le formulaire d'ajout
      setIsAddingSeason(false);
      
      // Notifier le parent des changements
      if (onSeasonsUpdated) {
        onSeasonsUpdated(updatedSeasons);
      }
      
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout de la saison:', err);
      setError(err.message || 'Erreur lors de l\'ajout de la saison');
      setApiResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer une saison
  const deleteSeason = async (seasonId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette saison ?')) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponse('');
    setApiResponseData(null);
    
    try {
      const deletedSeason = await animeSeasonService.deleteSeason(seasonId);
      
      // Mettre à jour les données de réponse API
      setApiResponseData(deletedSeason);
      setApiResponse('Saison supprimée avec succès');
      
      // Mettre à jour l'état local des saisons
      const updatedSeasons = editedSeasons.filter(season => season.id !== seasonId);
      setEditedSeasons(updatedSeasons);
      
      // Notifier le parent des changements
      if (onSeasonsUpdated) {
        onSeasonsUpdated(updatedSeasons);
      }
      
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la saison:', err);
      setError(err.message || 'Erreur lors de la suppression de la saison');
      setApiResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler pour l'édition d'une saison
  const handleEditSeason = (seasonId: string) => {
    setEditingSeasonId(seasonId);
  };

  // Handler pour l'annulation de l'édition
  const handleCancelEdit = () => {
    setEditingSeasonId(null);
  };

  // Handler pour l'annulation de l'ajout
  const handleCancelAdd = () => {
    setIsAddingSeason(false);
  };

  // Handler pour fermer les alertes
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  // Handler pour afficher/masquer les détails de la réponse API
  const handleResponseToggle = () => {
    setShowResponse(!showResponse);
  };

  return (
    <div className="mt-2">
      {/* Affichage des alertes - indépendant du débogueur */}
      {showAlert && error && (
        <ErrorAlert message={error} onClose={handleAlertClose} />
      )}
      
      {showAlert && apiResponse && !error && (
        <SuccessAlert message={apiResponse} onClose={handleAlertClose} />
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Détails des saisons</div>
        {isEditMode && (
          <button 
            className="btn btn-success btn-xs btn-outline" 
            onClick={() => setIsAddingSeason(true)}
            disabled={isAddingSeason}
          >
            <Plus size={14} /> Ajouter
          </button>
        )}
      </div>

      {isEditMode && (
            <button 
                className="btn btn-error btn-sm btn-outline" 
                onClick={handleResponseToggle}
              >
                {showResponse ? (
                  <>
                    <ChevronsLeftRightEllipsis size={16} /> Masquer le débogage
                  </>
                ) : (
                  <>
                    <ChevronsLeftRightEllipsis size={16} /> Afficher le débogage
                  </>
                )}
            </button>
        )}

      {/* Affichage du débogueur - indépendant des alertes */}
      {showResponse && (
        <ApiResponseDisplay
          response={apiResponseData ? JSON.stringify(apiResponseData, null, 2) : null}
          error={error}
          onClose={handleResponseToggle}
        />
      )}
      
      {/* Formulaire d'ajout de saison */}
      {isAddingSeason && (
        <SeasonForm
          animeAdaptationId={anime.id}
          seasonNumber={(editedSeasons.length || 0) + 1}
          isEditing={false}
          isLoading={isLoading}
          onSave={addNewSeason}
          onCancel={handleCancelAdd}
        />
      )}
      
      {/* Formulaire d'édition de saison */}
      {editingSeasonId && (
        <SeasonForm
          season={editedSeasons.find(s => s.id === editingSeasonId)}
          animeAdaptationId={anime.id}
          seasonNumber={0} // sera remplacé par la valeur du season trouvé
          isEditing={true}
          isLoading={isLoading}
          onSave={saveSeasonChanges}
          onCancel={handleCancelEdit}
        />
      )}
      
      {/* Liste des saisons */}
      <SeasonList
        seasons={editedSeasons}
        onEdit={handleEditSeason}
        onDelete={deleteSeason}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AnimeSeasonManager;