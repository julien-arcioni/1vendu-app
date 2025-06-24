import * as SecureStore from 'expo-secure-store';
import axiosInstance from './axiosConfig';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface UserData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  jwt: string;
  user?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Authentifie un utilisateur avec son identifiant et mot de passe
 * @param {string} identifier - Email ou nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Données de l'utilisateur authentifié
 */
export const loginUser = async (identifier: string, password: string) => {
  try {
    // On utilise axios directement pour l'authentification
    const response = await axios.post(`${API_URL}/api/auth/local`, {
      identifier,
      password,
    });
    await saveUserData(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Inscrit un nouvel utilisateur
 * @param {string} username - Nom d'utilisateur
 * @param {string} email - Adresse email
 * @param {string} password - Mot de passe
 * @param {string} firstname - Prénom
 * @param {string} lastname - Nom de famille
 * @param {boolean} isSeller - Indique si l'utilisateur est un vendeur
 * @returns {Promise<Object>} Données de l'utilisateur créé
 */
export const registerUser = async (
  username: string, 
  email: string, 
  password: string, 
  firstname: string, 
  lastname: string, 
  isSeller: boolean
) => {
  try {
    // On utilise axios directement pour l'inscription
    const response = await axios.post(`${API_URL}/api/auth/local/register`, {
      username,
      email,
      password,
      firstname,
      lastname,
      isSeller
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Met à jour les informations d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Données de l'utilisateur mises à jour
 */
export const updateUser = async (userId: string, updateData: Record<string, any>) => {
  try {
    // Utilise l'instance axiosInstance qui ajoute automatiquement le token
    const response = await axiosInstance.put(`/api/users/${userId}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère les informations de l'utilisateur courant
 * @returns {Promise<Object>} Données de l'utilisateur
 */
export const getCurrentUser = async (token?: string) => {
  try {
    if (token) {
      // Si un token est fourni explicitement
      const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } else {
      // Utiliser l'instance configurée qui ajoute automatiquement le token
      const response = await axiosInstance.get('/api/users/me');
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère une adresse spécifique
 * @param {string} addressId - ID de l'adresse
 * @returns {Promise<Object>} Données de l'adresse
 */
export const getAddress = async (addressId: string) => {
  try {
    const response = await axiosInstance.get(`/api/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Crée une nouvelle adresse
 * @param {Object} addressData - Données de l'adresse
 * @returns {Promise<Object>} Données de l'adresse créée
 */
export const createAddress = async (addressData: Record<string, any>) => {
  try {
    const response = await axiosInstance.post('/api/addresses', addressData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Met à jour une adresse existante
 * @param {string} addressId - ID de l'adresse
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Données de l'adresse mises à jour
 */
export const updateAddress = async (addressId: string, updateData: Record<string, any>) => {
  try {
    const response = await axiosInstance.put(`/api/addresses/${addressId}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Crée un nouveau profil vendeur
 * @param {Object} sellerData - Données du vendeur
 * @returns {Promise<Object>} Données du vendeur créé
 */
export const createSeller = async (sellerData: Record<string, any>) => {
  try {
    const response = await axiosInstance.post('/api/sellers', sellerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Met à jour un profil vendeur
 * @param {string} sellerId - ID du vendeur
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Données du vendeur mises à jour
 */
export const updateSeller = async (sellerId: string, updateData: Record<string, any>) => {
  try {
    const response = await axiosInstance.put(`/api/sellers/${sellerId}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère les informations d'un vendeur
 * @param {string} sellerId - ID du vendeur
 * @returns {Promise<Object>} Données du vendeur
 */
export const getSeller = async (sellerId: string) => {
  try {
    const response = await axiosInstance.get(`/api/sellers/${sellerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Vérifie si le token JWT est valide en faisant une requête à l'API Strapi
 * @param {string} token - Token JWT à vérifier
 * @returns {Promise<boolean>} Vrai si le token est valide, faux sinon
 */
export const verifyToken = async (token: string) => {
  if (!token) return false;
  
  try {
    // Essaie de récupérer l'utilisateur courant avec le token
    const response = await axios.get(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Si la requête réussit, le token est valide
    return !!response.data;
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return false;
  }
};

/**
 * Supprime les données utilisateur du Secure Store
 * @returns {Promise<void>}
 */
export const clearUserData = async () => {
  try {
    await SecureStore.deleteItemAsync('userData');
  } catch (error) {
    console.error('Erreur lors de la suppression des données utilisateur:', error);
    throw error;
  }
};

/**
 * Sauvegarde les informations de l'utilisateur dans le Secure Store
 * @param {Object} userData - Données de l'utilisateur et JWT
 * @returns {Promise<void>}
 */
export const saveUserData = async (userData: UserData) => {
  try {
    const userDataToStore = {
      id: userData.user?.id || userData.id,
      firstname: userData.user?.firstname || userData.firstname,
      lastname: userData.user?.lastname || userData.lastname,
      email: userData.user?.email || userData.email,
      jwt: userData.jwt
    };

    await SecureStore.setItemAsync('userData', JSON.stringify(userDataToStore));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données utilisateur:', error);
    throw error;
  }
};

/**
 * Récupère les informations de l'utilisateur depuis le Secure Store
 * @returns {Promise<Object|null>}
 */
export const getStoredUserData = async (): Promise<UserData | null> => {
  try {
    const userData = await SecureStore.getItemAsync('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    throw error;
  }
};

/**
 * Supprime le compte de l'utilisateur connecté
 * @returns {Promise<void>}
 */
export const deleteUserAccount = async () => {
  try {
    // Récupérer l'utilisateur actuel pour obtenir son ID
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      throw new Error('Utilisateur non trouvé');
    }

    // Supprimer le compte via l'API Strapi
    await axiosInstance.delete(`/api/users/${currentUser.id}`);
    
    // Nettoyer les données locales
    await clearUserData();
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    throw error;
  }
}; 