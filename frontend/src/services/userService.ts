// src/services/userService.js

/**
 * Service pour gérer les opérations liées aux utilisateurs
 */
export const userService = {
  /**
   * Vérifie si l'utilisateur actuel a le rôle admin
   * @returns {Promise<boolean>} True si l'utilisateur est admin, false sinon
   */
  async checkIsAdmin() {
    try {
      const response = await fetch('/api/users/me/role', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour envoyer les cookies d'authentification
      });

      if (!response.ok) {
        throw new Error('Failed to check admin status');
      }

      const data = await response.json();
      return data.isAdmin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  /**
   * Récupère le profil de l'utilisateur actuel
   * @returns {Promise<Object>} Les données de l'utilisateur
   */
  async getCurrentUser() {
    try {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Vous pouvez ajouter d'autres méthodes liées aux utilisateurs ici
}