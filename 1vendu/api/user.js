import axios from 'axios';

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
