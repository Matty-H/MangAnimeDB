import React, { useEffect, useRef } from 'react';
import AddDataModal from '../addDataModal/addDataModal';
import { Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';

const AddDataButton: React.FC = () => {
  const { isEditMode } = useEditMode();
  
  // Référence au bouton pour debugging
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Référence au modal
  const modalRef = useRef<HTMLDialogElement>(null);
  
  // Vérifier que tout est bien monté
  useEffect(() => {
    const modalElement = document.getElementById('add_data_modal');
        if (modalElement && modalRef.current === null) {
      modalRef.current = modalElement as HTMLDialogElement;
    }
  }, []);
  
  // Fonction pour ouvrir le modal avec plusieurs fallbacks
  const openModal = () => {
    
    // Méthode 1: Utiliser la référence React
    if (modalRef.current) {
      try {
        modalRef.current.showModal();
        return;
      } catch (err) {
      }
    }
    
    // Méthode 2: Rechercher dans le DOM
    const modalElement = document.getElementById('add_data_modal');
    if (modalElement) {
      try {
        (modalElement as HTMLDialogElement).showModal();
        return;
      } catch (err) {
      }
    }
    
    // Méthode 3: Chercher via query selector (plus large)
    const modalByQuery = document.querySelector('dialog#add_data_modal');
    if (modalByQuery) {
      try {
        (modalByQuery as HTMLDialogElement).showModal();
        return;
      } catch (err) {
      }
    }
    
    console.error("Modal introuvable par toutes les méthodes");
    alert("Impossible d'ouvrir le formulaire d'ajout. Veuillez recharger la page.");
  };

  return (
    <div className="add-data-container">
      {isEditMode && (
        <button
          ref={buttonRef}
          className="btn btn-primary btn-circle shadow-lg"
          onClick={(e) => {
            e.preventDefault(); // Empêcher tout comportement par défaut
            openModal();
          }}
          aria-label="Ajouter des données"
        >
          <Plus size={24} />
        </button>
      )}
      
      {/* Rendre le modal ici */}
      <AddDataModal />
    </div>
  );
};

export default AddDataButton;