// AnimeEditForm.jsx
import React from 'react';
import { WorkStatus, AnimeFidelity } from '../../types';

const AnimeEditForm = ({ editedAnime, onFieldChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Épisodes</span>
        </label>
        <input
          type="number"
          className="input input-sm input-bordered"
          value={editedAnime?.episodes || 0}
          onChange={(e) => onFieldChange('episodes', parseInt(e.target.value))}
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Studio</span>
        </label>
        <input
          type="text"
          className="input input-sm input-bordered"
          value={editedAnime?.studio || ''}
          onChange={(e) => onFieldChange('studio', e.target.value)}
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Date de début</span>
        </label>
        <input
          type="date"
          className="input input-sm input-bordered"
          value={editedAnime?.startDate ? new Date(editedAnime.startDate).toISOString().split('T')[0] : ''}
          onChange={(e) => onFieldChange('startDate', e.target.value ? new Date(e.target.value) : null)}
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Date de fin</span>
        </label>
        <input
          type="date"
          className="input input-sm input-bordered"
          value={editedAnime?.endDate ? new Date(editedAnime.endDate).toISOString().split('T')[0] : ''}
          onChange={(e) => onFieldChange('endDate', e.target.value ? new Date(e.target.value) : null)}
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Statut</span>
        </label>
        <select
          className="select select-sm select-bordered"
          value={editedAnime?.status || WorkStatus.ONGOING}
          onChange={(e) => onFieldChange('status', e.target.value)}
        >
          {Object.values(WorkStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Fidélité</span>
        </label>
        <select
          className="select select-sm select-bordered"
          value={editedAnime?.fidelity || AnimeFidelity.FAITHFUL}
          onChange={(e) => onFieldChange('fidelity', e.target.value)}
        >
          {Object.values(AnimeFidelity).map(fidelity => (
            <option key={fidelity} value={fidelity}>{fidelity}</option>
          ))}
        </select>
      </div>
      
      <div className="form-control col-span-2">
        <label className="label">
          <span className="label-text">Notes</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          value={editedAnime?.notes || ''}
          onChange={(e) => onFieldChange('notes', e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default AnimeEditForm;