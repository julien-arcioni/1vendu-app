import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Authentifie un utilisateur avec son identifiant et mot de passe
 * @param {string} identifier - Email ou nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Données de l'utilisateur authentifié
 */
export const loginUser = async (identifier, password) => {
  try {
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
export const registerUser = async (username, email, password, firstname, lastname, isSeller) => {
  try {
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
 * @param {string} token - Token d'authentification
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Données de l'utilisateur mises à jour
 */
export const updateUser = async (userId, token, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/api/users/${userId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère les informations de l'utilisateur courant
 * @param {string} token - Token d'authentification
 * @returns {Promise<Object>} Données de l'utilisateur
 */
export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère une adresse spécifique
 * @param {string} token - Token d'authentification
 * @param {string} addressId - ID de l'adresse
 * @returns {Promise<Object>} Données de l'adresse
 */
export const getAddress = async (token, addressId) => {
  try {
    const response = await axios.get(`${API_URL}/api/addresses/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Crée une nouvelle adresse
 * @param {string} token - Token d'authentification
 * @param {Object} addressData - Données de l'adresse
 * @returns {Promise<Object>} Données de l'adresse créée
 */
export const createAddress = async (token, addressData) => {
  try {
    const response = await axios.post(`${API_URL}/api/addresses`, addressData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Met à jour une adresse existante
 * @param {string} token - Token d'authentification
 * @param {string} addressId - ID de l'adresse
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Données de l'adresse mises à jour
 */
export const updateAddress = async (token, addressId, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/api/addresses/${addressId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Crée un nouveau profil vendeur
 * @param {string} token - Token d'authentification
 * @param {Object} sellerData - Données du vendeur
 * @returns {Promise<Object>} Données du vendeur créé
 */
export const createSeller = async (token, sellerData) => {
  try {
    const response = await axios.post(`${API_URL}/api/sellers`, sellerData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Met à jour un profil vendeur
 * @param {string} token - Token d'authentification
 * @param {string} sellerId - ID du vendeur
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Données du vendeur mises à jour
 */
export const updateSeller = async (token, sellerId, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/api/sellers/${sellerId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère les informations d'un vendeur
 * @param {string} token - Token d'authentification
 * @param {string} sellerId - ID du vendeur
 * @returns {Promise<Object>} Données du vendeur
 */
export const getSeller = async (token, sellerId) => {
  try {
    const response = await axios.get(`${API_URL}/api/sellers/${sellerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Sauvegarde les informations de l'utilisateur dans le Secure Store
 * @param {Object} userData - Données de l'utilisateur et JWT
 * @returns {Promise<void>}
 */
export const saveUserData = async (userData) => {
  try {
    const userDataToStore = {
      id: userData.user.id,
      firstname: userData.user.firstname,
      lastname: userData.user.lastname,
      email: userData.user.email,
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
export const getStoredUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    throw error;
  }
};

/**
 * Demande une réinitialisation de mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Réponse de l'API
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Réinitialise le mot de passe avec le code reçu par email
 * @param {string} code - Code de réinitialisation reçu par email
 * @param {string} password - Nouveau mot de passe
 * @param {string} passwordConfirmation - Confirmation du nouveau mot de passe
 * @returns {Promise<Object>} Réponse de l'API
 */
export const resetPassword = async (code, password, passwordConfirmation) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
      code,
      password,
      passwordConfirmation,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
