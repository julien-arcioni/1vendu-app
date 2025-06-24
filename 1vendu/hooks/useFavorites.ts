import { useState, useEffect } from 'react';
import { 
  getUserFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  checkIfFavorite 
} from '@/api/favorites';
import { useAuth } from '@/contexts/AuthContext';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Charger les favoris au démarrage
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const userFavorites = await getUserFavorites();
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (productId: number) => {
    try {
      const newFavorite = await addToFavorites(productId);
      setFavorites(prev => [...prev, newFavorite]);
      return newFavorite;
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  };

  const removeFavorite = async (favoriteId: number) => {
    try {
      await removeFromFavorites(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      throw error;
    }
  };

  const toggleFavorite = async (productId: number) => {
    try {
      const existingFavorite = await checkIfFavorite(productId);
      
      if (existingFavorite) {
        await removeFavorite(existingFavorite.id);
        return false; // Produit retiré des favoris
      } else {
        await addFavorite(productId);
        return true; // Produit ajouté aux favoris
      }
    } catch (error) {
      console.error('Erreur lors du toggle des favoris:', error);
      throw error;
    }
  };

  const isFavorite = (productId: number) => {
    return favorites.some(fav => {
      const favProductId = fav.product?.id || fav.product?.data?.id;
      return favProductId === productId;
    });
  };

  const getFavoriteId = (productId: number) => {
    const favorite = favorites.find(fav => {
      const favProductId = fav.product?.id || fav.product?.data?.id;
      return favProductId === productId;
    });
    return favorite?.id || null;
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoriteId,
    loadFavorites
  };
}; 