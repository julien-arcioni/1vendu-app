import axios from 'axios';
import { getStoredUserData } from './user';

interface UserData {
  jwt: string;
  [key: string]: any;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Créer une instance axios avec l'URL de base
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Ajouter un intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Récupérer les données utilisateur stockées
      const userData = await getStoredUserData() as UserData | null;
      
      // Si l'utilisateur est connecté, ajouter le token d'authentification
      if (userData && userData.jwt) {
        config.headers.Authorization = `Bearer ${userData.jwt}`;
      }
      
      return config;
    } catch (error) {
      console.error('Erreur dans l\'intercepteur de requête:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ajouter un intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gérer les erreurs d'authentification (401)
    if (error.response && error.response.status === 401) {
      // Ici, on pourrait déclencher la déconnexion ou le rafraîchissement du token
      console.warn('Erreur d\'authentification 401:', error);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 