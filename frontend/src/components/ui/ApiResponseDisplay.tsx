// ui/ApiResponseDisplay.jsx
import React from 'react';
import { X } from 'lucide-react';

const ApiResponseDisplay = ({ response, error, onClose }) => {
  if (!response && !error) return null;

  return (
    <div className="mt-2 relative">
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>

      {error && (
        <div className="alert alert-error text-sm pr-6">
          <span>{error}</span>
        </div>
      )}

      {response && (
        <div className="bg-gray-100 p-2 text-xs font-mono rounded-lg pr-6">
          <pre className="whitespace-pre-wrap overflow-auto max-h-40">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiResponseDisplay;
