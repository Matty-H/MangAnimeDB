// frontend/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { AuthSession, AuthContextType } from '../types';


export function useAuth(): AuthContextType {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
    
  // Récupérer la session au chargement
  useEffect(() => {
    async function loadSession() {
      try {
        setLoading(true);
        
        const res = await fetch(`${(import.meta as any).env.VITE_API_URL}/auth/session`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la session', error);
        setError(error instanceof Error ? error : new Error('Erreur inconnue'));
        setSession(null);
      } finally {
        setLoading(false);
      }
    }
    
    loadSession();
  }, []);

  const signIn = async (provider: string = 'google'): Promise<void> => {
    try {
      // Fermer la modal si elle est ouverte
      const modal = document.getElementById("auth-modal");
      if (modal instanceof HTMLDialogElement) {
        modal.close();
      }
      
      // Nouveau format d'URL avec query parameter
      window.location.href = `${(import.meta as any).env.VITE_API_URL}/auth/signin?provider=${provider}`;
    } catch (error) {
      console.error(`Erreur lors de la connexion avec ${provider}`, error);
      setError(error instanceof Error ? error : new Error(`Erreur de connexion`));
    }
  };


  const signOut = async (): Promise<void> => {
    try {
      window.location.href = `${(import.meta as any).env.VITE_API_URL}/auth/signout`;
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      setError(error instanceof Error ? error : new Error('Erreur de déconnexion'));
    }
  };

  const refreshSession = async (): Promise<void> => {
    try {
      setLoading(true);
      
      const res = await fetch(`${(import.meta as any).env.VITE_API_URL}/auth/session`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la session', error);
      setError(error instanceof Error ? error : new Error('Erreur de rafraîchissement'));
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    loading,
    error,
    signIn,
    signOut,
    refreshSession,
    isAuthenticated: !!session?.user,
    user: session?.user || null,
  };
}