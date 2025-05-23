//frontend/src/types/auth.ts

/**
 * Utilisateur authentifié
 */
export interface AuthUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
  
  /**
   * Session d'authentification
   */
  export interface AuthSession {
    user?: AuthUser | null;
    expires?: string | null;
  }
  
  /**
   * Contexte d'authentification fourni par useAuth
   */
  export interface AuthContextType {
    session: AuthSession | null;
    loading: boolean;
    error: Error | null;
    signIn: (provider: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
    isAuthenticated: boolean;
    user: AuthUser | null;
  }