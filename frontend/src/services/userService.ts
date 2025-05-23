// src/services/userService.ts
import { httpClient } from './http-client';
import { API_ENDPOINTS } from './api-config';

/**
 * Interface pour les données utilisateur
 */
interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  // Ajoutez d'autres propriétés selon votre modèle utilisateur
}

/**
 * Service pour gérer les opérations liées aux utilisateurs
 */
export class UserService {
  /**
   * Vérifie si l'utilisateur actuel a le rôle admin
   * @returns {Promise<boolean>} True si l'utilisateur est admin, false sinon
   */
  async checkIsAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Récupère le profil de l'utilisateur actuel
   * @returns {Promise<User>} Les données de l'utilisateur
   */
  async getCurrentUser(): Promise<User> {
    try {
      // Utilisation du client HTTP centralisé avec credentials inclus
      return await httpClient.request<User>(API_ENDPOINTS.USER.ME, {
        method: 'GET',
        headers: {
          // Les headers par défaut sont déjà gérés par httpClient
          // On peut ajouter des headers spécifiques si nécessaire
        }
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Met à jour le profil de l'utilisateur actuel
   * @param userData - Les données à mettre à jour
   * @returns {Promise<User>} Les données utilisateur mises à jour
   */
  async updateCurrentUser(userData: Partial<User>): Promise<User> {
    try {
      return await httpClient.put<User>(API_ENDPOINTS.USER.ME, userData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param role - Le rôle à vérifier
   * @returns {Promise<boolean>} True si l'utilisateur a le rôle, false sinon
   */
  async hasRole(role: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user.role === role;
    } catch (error) {
      console.error(`Error checking role ${role}:`, error);
      return false;
    }
  }

  /**
   * Vérifie si l'utilisateur a l'un des rôles spécifiés
   * @param roles - Les rôles à vérifier
   * @returns {Promise<boolean>} True si l'utilisateur a l'un des rôles, false sinon
   */
  async hasAnyRole(roles: string[]): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return roles.includes(user.role);
    } catch (error) {
      console.error(`Error checking roles ${roles.join(', ')}:`, error);
      return false;
    }
  }
}

// Exporter une instance singleton par défaut
export const userService = new UserService();

// Exporter la classe pour permettre des tests ou des instances personnalisées
export default UserService;