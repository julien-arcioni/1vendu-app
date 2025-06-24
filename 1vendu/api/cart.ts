import axiosInstance from './axiosConfig';

interface CartItem {
  id?: number;
  user: number;
  product: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Récupère le panier de l'utilisateur connecté
 * @returns {Promise<Array>} Liste des articles du panier
 */
export const getUserCart = async () => {
  try {
    const response = await axiosInstance.get('/api/carts?populate=product.gallery,product.type');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    throw error;
  }
};

/**
 * Récupère le panier avec les informations des producteurs
 * @returns {Promise<Array>} Liste des articles du panier avec info producteur
 */
export const getUserCartWithProducers = async () => {
  try {
    // D'abord récupérer le panier de base
    const cartItems = await getUserCart();
    
    if (cartItems.length === 0) {
      return cartItems;
    }
    
    // Utiliser exactement la même requête que dans la page home qui fonctionne
    const producersResponse = await axiosInstance.get('/api/users?filters%5BisSeller%5D%5B%24eq%5D=true&populate%5Bseller%5D%5Bpopulate%5D%5B0%5D=addressPickUp&populate%5Bseller%5D%5Bpopulate%5D%5B1%5D=sellerPhoto&populate%5Bseller%5D%5Bpopulate%5D%5B2%5D=products');
    const producers = producersResponse.data;
    
    // Créer un map des produits vers leurs producteurs
    const productToProducerMap: Record<number, any> = {};
    
    producers.forEach((producer: any) => {
      if (producer.seller && producer.seller.products) {
        const products = Array.isArray(producer.seller.products) 
          ? producer.seller.products 
          : producer.seller.products.data || [];
        
        products.forEach((product: any) => {
          productToProducerMap[product.id] = {
            id: producer.id,
            username: producer.username,
            seller: {
              companyName: producer.seller.companyName
            }
          };
        });
      }
    });
    
    // Maintenant ajouter les informations du producteur à chaque article du panier
    const cartWithProducers = cartItems.map((item: any) => {
      const productId = item.product.id;
      const productProducer = productToProducerMap[productId] || null;
      
      return {
        ...item,
        product: {
          ...item.product,
          producer: productProducer
        }
      };
    });
    
    return cartWithProducers;
  } catch (error) {
    console.error('Erreur lors de la récupération du panier avec producteurs:', error);
    
    // En cas d'erreur, retourner le panier de base sans les infos producteurs
    try {
      const fallbackCart = await getUserCart();
      return fallbackCart.map((item: any) => ({
        ...item,
        product: {
          ...item.product,
          producer: null
        }
      }));
    } catch (fallbackError) {
      console.error('Erreur fallback:', fallbackError);
      throw error;
    }
  }
};

/**
 * Ajoute un produit au panier
 * @param {number} productId - ID du produit
 * @param {number} quantity - Quantité (par défaut 1)
 * @returns {Promise<Object>} Article de panier créé
 */
export const addToCart = async (productId: number, quantity: number = 1) => {
  try {
    const response = await axiosInstance.post('/api/carts', {
      data: {
        product: productId,
        quantity: quantity
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    throw error;
  }
};

/**
 * Met à jour la quantité d'un article dans le panier
 * @param {number} cartItemId - ID de l'article du panier
 * @param {number} quantity - Nouvelle quantité
 * @returns {Promise<Object>} Article mis à jour
 */
export const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
  try {
    const response = await axiosInstance.put(`/api/carts/${cartItemId}`, {
      data: {
        quantity: quantity
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la quantité:', error);
    throw error;
  }
};

/**
 * Supprime un article du panier
 * @param {number} cartItemId - ID de l'article à supprimer
 * @returns {Promise<Object>} Article supprimé
 */
export const removeFromCart = async (cartItemId: number) => {
  try {
    const response = await axiosInstance.delete(`/api/carts/${cartItemId}`);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
    throw error;
  }
};

/**
 * Vide complètement le panier de l'utilisateur
 * @returns {Promise<void>}
 */
export const clearCart = async () => {
  try {
    const cartItems = await getUserCart();
    
    // Supprimer tous les articles
    await Promise.all(
      cartItems.map((item: any) => removeFromCart(item.id))
    );
  } catch (error) {
    console.error('Erreur lors du vidage du panier:', error);
    throw error;
  }
};

/**
 * Vérifie si un produit est dans le panier
 * @param {number} productId - ID du produit
 * @returns {Promise<Object|null>} Article trouvé ou null
 */
export const checkIfInCart = async (productId: number) => {
  try {
    // Récupérer tous les articles du panier et chercher le produit
    const cartItems = await getUserCart();
    const cartItem = cartItems.find((item: any) => 
      item.product?.id === productId || item.product?.data?.id === productId
    );
    return cartItem || null;
  } catch (error) {
    console.error('Erreur lors de la vérification du panier:', error);
    throw error;
  }
};

/**
 * Calcule le total du panier
 * @returns {Promise<number>} Total du panier
 */
export const getCartTotal = async () => {
  try {
    const cartItems = await getUserCart();
    
    let total = 0;
    cartItems.forEach((item: any) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      total += price * quantity;
    });
    
    return total;
  } catch (error) {
    console.error('Erreur lors du calcul du total:', error);
    throw error;
  }
}; 