import axiosInstance from './axiosConfig';

interface FavoriteItem {
  id?: number;
  user: number;
  product: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Récupère la liste des favoris de l'utilisateur connecté
 * @returns {Promise<Array>} Liste des favoris
 */
export const getUserFavorites = async () => {
  try {
    const response = await axiosInstance.get('/api/favorites?populate=product.gallery');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    throw error;
  }
};

/**
 * Ajoute un produit aux favoris
 * @param {number} productId - ID du produit
 * @returns {Promise<Object>} Favori créé
 */
export const addToFavorites = async (productId: number) => {
  try {
    const response = await axiosInstance.post('/api/favorites', {
      data: {
        product: productId
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    throw error;
  }
};

/**
 * Supprime un produit des favoris
 * @param {number} favoriteId - ID du favori à supprimer
 * @returns {Promise<Object>} Favori supprimé
 */
export const removeFromFavorites = async (favoriteId: number) => {
  try {
    const response = await axiosInstance.delete(`/api/favorites/${favoriteId}`);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
    throw error;
  }
};

/**
 * Vérifie si un produit est dans les favoris
 * @param {number} productId - ID du produit
 * @returns {Promise<Object|null>} Favori trouvé ou null
 */
export const checkIfFavorite = async (productId: number) => {
  try {
    // Récupérer tous les favoris de l'utilisateur et chercher le produit
    const favorites = await getUserFavorites();
    const favorite = favorites.find((fav: any) => 
      fav.product?.id === productId || fav.product?.data?.id === productId
    );
    return favorite || null;
  } catch (error) {
    console.error('Erreur lors de la vérification des favoris:', error);
    throw error;
  }
}; 