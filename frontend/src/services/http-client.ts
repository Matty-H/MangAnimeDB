// frontend/src/services/http-client.ts
/**
 * Client HTTP centralisé pour toutes les requêtes API
 */

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  }
  
  class HttpClient {
    private baseUrl: string;
  
    constructor(baseUrl: string = '') {
      this.baseUrl = baseUrl;
    }
  
    /**
     * Méthode générique pour effectuer des requêtes HTTP
     */
    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
      const {
        method = 'GET',
        body,
        headers = {},
      } = options;
  
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };
  
      if (body) {
        requestOptions.body = JSON.stringify(body);
      }
  
      const url = `${this.baseUrl}${endpoint}`;
  
      try {
        const response = await fetch(url, requestOptions);
  
        if (!response.ok) {
          // Tenter de récupérer les détails de l'erreur si disponibles
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error || `Erreur API: ${response.status} - ${response.statusText}`;
          throw new Error(errorMessage);
        }
  
        return await response.json();
      } catch (error) {
        console.error(`Erreur lors de la requête ${method} vers ${url}:`, error);
        throw error;
      }
    }
  
    /**
     * Méthodes d'aide pour les verbes HTTP communs
     */
    async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
      return this.request<T>(endpoint, { method: 'GET', headers });
    }
  
    async post<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
      return this.request<T>(endpoint, { method: 'POST', body, headers });
    }
  
    async put<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
      return this.request<T>(endpoint, { method: 'PUT', body, headers });
    }
  
    async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
      return this.request<T>(endpoint, { method: 'DELETE', headers });
    }
  }
  
  // Exporter une instance par défaut avec la configuration standard
  export const httpClient = new HttpClient();
  
  // Exporter la classe pour permettre des instances personnalisées si nécessaire
  export default HttpClient;