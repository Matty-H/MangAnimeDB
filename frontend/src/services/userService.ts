const API_BASE_URL = '/api'; // Adaptez selon votre configuration

export const userService = {
  /**
   * Vérifie si l'utilisateur actuel est un administrateur
   * @returns {Promise<boolean>} True si l'utilisateur est admin, false sinon
   */
  async checkIsAdmin() {
    try {
      // Modifié pour pointer vers la bonne route
      const response = await fetch(`${API_BASE_URL}/admin/check-admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Les credentials sont importantes pour transmettre les cookies d'authentification
        credentials: 'include'
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.isAdmin === true;
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error);
      return false;
    }
  },
  
  /**
   * Définit un utilisateur comme administrateur
   * @param {string} targetUserId - L'ID de l'utilisateur à promouvoir
   * @returns {Promise<{success: boolean}>} Résultat de l'opération
   */
  async setUserAsAdmin(targetUserId) {
    try {
      // Modifié pour pointer vers la bonne route
      const response = await fetch(`${API_BASE_URL}/admin/set-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ targetUserId }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la définition du rôle admin:', error);
      return { success: false, error: 'Erreur réseau' };
    }
  }
};