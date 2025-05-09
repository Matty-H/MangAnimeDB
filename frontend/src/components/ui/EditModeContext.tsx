//frontend/src/components/ui/EditModeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  isDebugMode: boolean;
  toggleDebugMode: () => void;
}

const defaultContext: EditModeContextType = {
  isEditMode: false,
  toggleEditMode: () => {},
  isDebugMode: false,
  toggleDebugMode: () => {},
};

export const EditModeContext = createContext<EditModeContextType>(defaultContext);

export const useEditMode = () => useContext(EditModeContext);

interface EditModeProviderProps {
  children: ReactNode;
}

export const EditModeProvider: React.FC<EditModeProviderProps> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  const toggleDebugMode = () => {
    setIsDebugMode(prev => !prev);
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode, isDebugMode, toggleDebugMode }}>
      {children}
    </EditModeContext.Provider>
  );
};