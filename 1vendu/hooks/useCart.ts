import { useState, useEffect } from 'react';
import { 
  getUserCart, 
  getUserCartWithProducers,
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity,
  clearCart,
  getCartTotal,
  checkIfInCart
} from '@/api/cart';
import { useAuth } from '@/contexts/AuthContext';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { isAuthenticated } = useAuth();

  // Charger le panier au démarrage
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const userCart = await getUserCartWithProducers();
      setCartItems(userCart);
      
      // Calculer le total
      const cartTotal = await getCartTotal();
      setTotal(cartTotal);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToCart = async (productId: number, quantity: number = 1) => {
    try {
      await addToCart(productId, quantity);
      await loadCart(); // Recharger le panier
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      throw error;
    }
  };

  const removeItemFromCart = async (cartItemId: number) => {
    try {
      await removeFromCart(cartItemId);
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      
      // Recalculer le total
      const cartTotal = await getCartTotal();
      setTotal(cartTotal);
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await updateCartItemQuantity(cartItemId, quantity);
      await loadCart(); // Recharger le panier
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      throw error;
    }
  };

  const clearCartItems = async () => {
    try {
      await clearCart();
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      throw error;
    }
  };

  const isInCart = (productId: number) => {
    return cartItems.some(item => {
      const itemProductId = item.product?.id || item.product?.data?.id;
      return itemProductId === productId;
    });
  };

  const getCartItemId = (productId: number) => {
    const item = cartItems.find(item => {
      const itemProductId = item.product?.id || item.product?.data?.id;
      return itemProductId === productId;
    });
    return item?.id || null;
  };

  const getCartItemQuantity = (productId: number) => {
    const item = cartItems.find(item => {
      const itemProductId = item.product?.id || item.product?.data?.id;
      return itemProductId === productId;
    });
    return item?.quantity || 0;
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => 
      count + (item.quantity || 0), 0
    );
  };

  return {
    cartItems,
    isLoading,
    total,
    addItemToCart,
    removeItemFromCart,
    updateQuantity,
    clearCartItems,
    isInCart,
    getCartItemId,
    getCartItemQuantity,
    getCartItemsCount,
    loadCart
  };
}; 