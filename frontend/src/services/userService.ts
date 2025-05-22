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
      const user = await this.getCurrentUser();
      return user.role === 'admin';
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
      const response = await fetch('/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour envoyer les cookies d'auth
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
};
