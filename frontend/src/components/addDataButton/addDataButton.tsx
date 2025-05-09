import React, { useEffect, useRef } from 'react';
import AddDataModal from '../addDataModal/addDataModal';
import { Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';

const AddDataButton: React.FC = () => {
  const { isEditMode, isDebugMode } = useEditMode();
  
  // Référence au bouton pour debugging
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Référence au modal
  const modalRef = useRef<HTMLDialogElement>(null);
  
  // Vérifier que tout est bien monté
  useEffect(() => {
    console.log("AddDataButton component mounted");
    
    // Vérifier si le modal existe dans le DOM
    const modalElement = document.getElementById('add_data_modal');
    console.log("Modal element in DOM:", modalElement ? "Found" : "Not found");
    
    // Connecter la référence si on trouve l'élément
    if (modalElement && modalRef.current === null) {
      modalRef.current = modalElement as HTMLDialogElement;
    }
  }, []);
  
  // Fonction pour ouvrir le modal avec plusieurs fallbacks
  const openModal = () => {
    console.log("Tentative d'ouverture du modal");
    
    // Méthode 1: Utiliser la référence React
    if (modalRef.current) {
      console.log("Ouverture via ref React");
      try {
        modalRef.current.showModal();
        return;
      } catch (err) {
        console.error("Erreur lors de l'ouverture via ref:", err);
      }
    }
    
    // Méthode 2: Rechercher dans le DOM
    const modalElement = document.getElementById('add_data_modal');
    if (modalElement) {
      console.log("Ouverture via getElementById");
      try {
        (modalElement as HTMLDialogElement).showModal();
        return;
      } catch (err) {
        console.error("Erreur lors de l'ouverture via getElementById:", err);
      }
    }
    
    // Méthode 3: Chercher via query selector (plus large)
    const modalByQuery = document.querySelector('dialog#add_data_modal');
    if (modalByQuery) {
      console.log("Ouverture via querySelector");
      try {
        (modalByQuery as HTMLDialogElement).showModal();
        return;
      } catch (err) {
        console.error("Erreur lors de l'ouverture via querySelector:", err);
      }
    }
    
    console.error("Modal introuvable par toutes les méthodes");
    alert("Impossible d'ouvrir le formulaire d'ajout. Veuillez recharger la page.");
  };

  return (
    <div className="add-data-container">
      {/* Utiliser la référence sur le bouton pour debugging */}
      {/* N'afficher le bouton de débogage que si isDebugMode est vrai */}
      {isDebugMode && (
        <button
          ref={buttonRef}
          className="btn btn-primary btn-circle shadow-lg"
          onClick={(e) => {
            e.preventDefault(); // Empêcher tout comportement par défaut
            console.log("Bouton cliqué");
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