//frontend/src/components/mangAnimeCard/hooks/useGenericApi.ts
import { useState, useCallback } from 'react';

export interface ApiState {
  isLoading: boolean;
  error: string | null;
  apiResponse: string;
  apiResponseData: any;
  showAlert: boolean;
}

export const useGenericApi = () => {
  const [state, setState] = useState<ApiState>({
    isLoading: false,
    error: null,
    apiResponse: '',
    apiResponseData: null,
    showAlert: false,
  });

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      apiResponse: '',
      apiResponseData: null,
      showAlert: false,
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setSuccess = useCallback((message: string, data?: any) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: null,
      apiResponse: message,
      apiResponseData: data,
      showAlert: true,
    }));
  }, []);

  const setError = useCallback((error: string, data?: any) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error,
      apiResponse: '',
      apiResponseData: data,
      showAlert: true,
    }));
  }, []);

  const closeAlert = useCallback(() => {
    setState(prev => ({ ...prev, showAlert: false }));
  }, []);

  return {
    ...state,
    resetState,
    setLoading,
    setSuccess,
    setError,
    closeAlert,
  };
};
