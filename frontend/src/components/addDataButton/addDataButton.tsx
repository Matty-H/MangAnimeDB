// frontend/src/components/addDataButton/addDataButton.tsx
import React, { useState } from 'react';
import AddDataModal from '../addDataModal/addDataModal';
import './addDataButton.css';

const AddDataButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="add-data-container">
      <button className="add-data-button" onClick={openModal}>
        + Ajouter une entrée
      </button>
      {isModalOpen && <AddDataModal onClose={closeModal} />}
    </div>
  );
};

export default AddDataButton;