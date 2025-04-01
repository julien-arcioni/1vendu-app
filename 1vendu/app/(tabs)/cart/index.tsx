import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Header from '@/components/navigation/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

// Définition du type pour un produit du panier
type CartItem = {
  id: string;
  title: string;
  price: number;
  seller: string;
  quantity: number;
  image: any;
};

// Données fictives pour le panier
const initialCartItems: CartItem[] = [
  {
    id: '1',
    title: 'Panier de légumes bio',
    price: 15.99,
    seller: 'Ferme des Oliviers',
    quantity: 1,
    image: require('@/assets/images/brand/logo.png')
  },
  {
    id: '2',
    title: 'Assortiment de fromages',
    price: 24.50,
    seller: 'Fromagerie Martin',
    quantity: 2,
    image: require('@/assets/images/brand/logo.png')
  },
  {
    id: '3',
    title: 'Miel local 500g',
    price: 12.00,
    seller: 'Rucher des Cévennes',
    quantity: 1,
    image: require('@/assets/images/brand/logo.png')
  },
];

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  
  // Calculer le total du panier
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Mettre à jour la quantité d'un produit
  const updateQuantity = (id: string, change: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          // Supprimer l'article si la quantité devient 0
          if (newQuantity <= 0) {
            return { ...item, quantity: 0 };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0) // Enlever les articles avec quantité 0
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSeller}>{item.seller}</Text>
        <Text style={styles.itemPrice}>{item.price.toFixed(2).replace('.', ',')} €</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, -1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Votre Panier</Text>
      </View>
      
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContainer}
          />
          
          <View style={styles.summaryContainer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{cartTotal.toFixed(2).replace('.', ',')} €</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Passer la commande</Text>
              <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.checkoutIcon} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="shopping-cart" size={50} color="#ddd" />
          <Text style={styles.emptyText}>Votre panier est vide</Text>
          <Text style={styles.emptySubText}>
            Parcourez les produits et ajoutez-les à votre panier
          </Text>
        </View>
      )}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemSeller: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primary || '#e67e22',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  summaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary || '#e67e22',
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary || '#e67e22',
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  checkoutIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});

export default CartScreen; 