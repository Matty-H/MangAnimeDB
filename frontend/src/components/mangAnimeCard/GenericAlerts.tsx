//frontend/src/components/mangAnimeCard/GenericAlerts.tsx
import React from 'react';
import { ErrorAlert } from '../ui/ErrorAlert';
import { SuccessAlert } from '../ui/SuccessAlert';

interface GenericAlertsProps {
  showAlert: boolean;
  error: string | null;
  apiResponse: string;
  onClose: () => void;
}

export const GenericAlerts: React.FC<GenericAlertsProps> = ({
  showAlert,
  error,
  apiResponse,
  onClose
}) => {
  if (!showAlert) return null;

  return (
    <>
      {error && <ErrorAlert message={error} onClose={onClose} />}
      {apiResponse && !error && <SuccessAlert message={apiResponse} onClose={onClose} />}
    </>
  );
};