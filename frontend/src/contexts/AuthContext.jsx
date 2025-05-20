// src/contexts/AuthContext.jsx
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

// Création du contexte
const AuthContext = createContext(null);

/**
 * Fournisseur du contexte d'authentification pour toute l'application
 */
export function AuthProvider({ children }) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error(`useAuthContext doit être utilisé à l'intérieur d'un AuthProvider`);
  }
  
  return context;
}