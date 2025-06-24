import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/navigation/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/button/CustomButton';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

// Type pour un produit du panier depuis l'API
type CartItem = {
  id: string;
  product: {
    id: number;
    title: string;
    price: number;
    type?: string;
    category?: string;
    gallery?: Array<{
      url: string;
    }>;
    producer?: {
      id: number;
      username: string;
      seller?: {
        companyName?: string;
      };
    };
  };
  quantity: number;
  createdAt: string;
};

const CartScreen = () => {
  const { isAuthenticated } = useAuth();
  const { 
    cartItems, 
    isLoading, 
    total,
    removeItemFromCart, 
    updateQuantity,
    clearCartItems,
    getCartItemsCount 
  } = useCart();

  // Rediriger vers la connexion si pas authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour voir votre panier.',
        [
          { text: 'OK' }
        ]
      );
    }
  }, [isAuthenticated]);

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeItemFromCart(parseInt(cartItemId));
      Alert.alert('Succès', 'Produit retiré du panier');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de retirer le produit du panier');
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      await updateQuantity(parseInt(cartItemId), newQuantity);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour la quantité');
    }
  };

  const handleClearCart = async () => {
    Alert.alert(
      'Vider le panier',
      'Êtes-vous sûr de vouloir vider votre panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Vider', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCartItems();
              Alert.alert('Succès', 'Panier vidé');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de vider le panier');
            }
          }
        }
      ]
    );
  };

  const renderCartItem = ({ item }: { item: any }) => {
    const product = item.product;
    const productImage = product.gallery && product.gallery.length > 0 
      ? { uri: `http://localhost:1337${product.gallery[0].url}` }
      : require('@/assets/images/icon.png');

    // Calculer le prix total pour cet item
    const itemTotal = (product.price * item.quantity).toFixed(2);

    return (
      <View style={styles.cartItemContainer}>
        <Image source={productImage} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <View style={styles.itemInfoTop}>
            <Text style={styles.itemTitle}>{product.title}</Text>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{product.type || product.category || 'Produit'}</Text>
            </View>
          </View>
          <Text style={styles.itemUnitPrice}>{product.price.toFixed(2).replace('.', ',')} €/kg</Text>
          
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantité:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                disabled={item.quantity <= 1}
              >
                <FontAwesome name="minus" size={12} color={item.quantity <= 1 ? "#ccc" : "#333"} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity} kg</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              >
                <FontAwesome name="plus" size={12} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.itemCalculatedPrice}>{itemTotal.replace('.', ',')} €</Text>
          
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveItem(item.id)}>
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Grouper les items par vendeur basé sur les vraies données
  const groupedItems: Record<string, { items: any[], producerId: number, producerName: string }> = {};
  
  cartItems.forEach(item => {
    const product = item.product;
    const producerId = product.producer?.id;
    const producerName = product.producer?.seller?.companyName || product.producer?.username || 'Producteur inconnu';
    
    if (producerId) {
      const key = `${producerId}-${producerName}`;
      if (!groupedItems[key]) {
        groupedItems[key] = {
          items: [],
          producerId,
          producerName
        };
      }
      groupedItems[key].items.push(item);
    } else {
      // Fallback pour les produits sans producteur défini
      const fallbackKey = 'unknown-Vendeur inconnu';
      if (!groupedItems[fallbackKey]) {
        groupedItems[fallbackKey] = {
          items: [],
          producerId: 0,
          producerName: 'Vendeur inconnu'
        };
      }
      groupedItems[fallbackKey].items.push(item);
    }
  });

  const sellers = Object.keys(groupedItems).filter(seller => groupedItems[seller]?.items.length > 0);

  // Composant pour l'en-tête de la liste
  const ListHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.mainTitle}>Panier</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Vider</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.infoText}>
        Une fois validée, récupérez votre commande <Text style={styles.boldText}>sous 2 jours</Text>. Pour toute information complémentaire, n'hésitez pas à contacter directement le producteur.
      </Text>
      {cartItems.length > 0 && (
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total: {total.toFixed(2).replace('.', ',')} €</Text>
          <Text style={styles.itemCount}>{getCartItemsCount()} article{getCartItemsCount() > 1 ? 's' : ''}</Text>
        </View>
      )}
    </View>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.emptyContainer}>
          <FontAwesome name="user" size={50} color="#ddd" />
          <Text style={styles.emptyText}>Connexion requise</Text>
          <Text style={styles.emptySubText}>
            Connectez-vous pour voir votre panier
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement de votre panier...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      {sellers.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={sellers}
            keyExtractor={(seller) => seller}
            ListHeaderComponent={ListHeader}
            renderItem={({ item: seller }) => {
              const sellerData = groupedItems[seller];
              return (
                <View style={styles.sellerSection}>
                  <View style={styles.sellerHeader}>
                    <View>
                      <Text style={styles.sellerName}>{sellerData.producerName}</Text>
                      <Text style={styles.productCount}>{sellerData.items.length} produit{sellerData.items.length > 1 ? 's' : ''}</Text>
                    </View>
                    {sellerData.producerId > 0 && (
                      <CustomButton
                        title="voir"
                        type="link"
                        size="medium"
                        fontSize={12}
                        backgroundColor="#000000"
                        textColor="#FFFFFF"
                        onPress={() => router.push(`/producer/${sellerData.producerId}`)}
                        borderRadius={30}
                      />
                    )}
                  </View>
                  <FlatList
                    data={sellerData.items}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCartItem}
                    scrollEnabled={false}
                  />
                </View>
              );
            }}
            contentContainerStyle={styles.listContainer}
          />
          {/* Bouton de paiement en bas */}
          <View style={styles.paymentButtonContainer}>
            <CustomButton
              title="Continuer vers le paiement"
              type="primary"
              size="large"
              backgroundColor={Colors.primary || '#e67e22'}
              textColor="#FFFFFF"
              onPress={() => router.push('/payment')}
              borderRadius={8}
            />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ListHeader /> 
          <View style={styles.emptyContainer}>
            <FontAwesome name="shopping-cart" size={50} color="#ddd" />
            <Text style={styles.emptyText}>Votre panier est vide</Text>
            <Text style={styles.emptySubText}>
              Parcourez les produits et ajoutez-les à votre panier
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.exploreButtonText}>Explorer les produits</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  clearButton: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 20,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  totalSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 16,
    paddingTop: 16,
  },
  sellerSection: {
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  sellerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#FBFBFB',
    marginBottom: 0,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  productCount: {
    fontSize: 14,
    color: '#000',
    marginTop: 2,
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FBFBFB',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 130,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 15,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemInfoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1,
    marginRight: 8,
  },
  itemUnitPrice: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#000',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 15,
    minWidth: 40,
    textAlign: 'center',
  },
  itemCalculatedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#666',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: '#999',
    maxWidth: '80%',
  },
  exploreButton: {
    backgroundColor: Colors.primary || '#e67e22',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryChip: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
  },
  paymentButtonContainer: {
    padding: 16,
    backgroundColor: '#FBFBFB',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default CartScreen; 