import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Header from '@/components/navigation/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/button/CustomButton';

// Définition mise à jour du type pour un produit du panier
type CartItem = {
  id: string;
  title: string;
  unitPrice: number; // ex: 2.40
  unit: string; // ex: '€/kg'
  seller: string;
  quantityValue: number; // ex: 500
  quantityUnit: string; // ex: 'g'
  category: string; // ex: 'Fruits'
  image: any; // Garder 'any' pour l'instant, idéalement string pour URI
};

// Données fictives avec l'image logo.png
const initialCartItems: CartItem[] = [
  {
    id: '1',
    title: 'Courgettes',
    unitPrice: 2.40,
    unit: '€/kg',
    seller: 'La Ferme Locale',
    quantityValue: 500,
    quantityUnit: 'g',
    category: 'Légumes',
    image: require('@/assets/images/brand/logo.png')
  },
  {
    id: '2',
    title: 'Fraises',
    unitPrice: 5.80,
    unit: '€/kg',
    seller: 'La Ferme Locale',
    quantityValue: 200,
    quantityUnit: 'g',
    category: 'Fruits',
    image: require('@/assets/images/brand/logo.png')
  },
  {
    id: '3',
    title: 'Tomates',
    unitPrice: 2.50,
    unit: '€/kg',
    seller: 'La Ferme Locale',
    quantityValue: 100,
    quantityUnit: 'g',
    category: 'Fruits',
    image: require('@/assets/images/brand/logo.png')
  },
];

// Fonction pour grouper les items par vendeur
const groupItemsBySeller = (items: CartItem[]) => {
  return items.reduce((acc, item) => {
    const seller = item.seller;
    if (!acc[seller]) {
      acc[seller] = [];
    }
    acc[seller].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);
};

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  
  // Mettre à jour pour supprimer un article (similaire à updateQuantity avec change = -quantité)
  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Calculer le prix total de l'item
  const calculateItemTotal = (item: CartItem) => {
      // Convertir la quantité en kg si l'unité est €/kg
      let quantityInKg = item.quantityValue;
      if (item.quantityUnit === 'g') {
          quantityInKg /= 1000;
      } else if (item.quantityUnit === 'mg') {
          quantityInKg /= 1000000;
      } // Ajouter d'autres conversions si nécessaire
      
      // Si le prix est par pièce ou autre unité non basée sur le poids, ajuster la logique
      if (item.unit !== '€/kg') {
          // Pour l'instant, supposons que unitPrice est le prix pour la quantityValue donnée si ce n'est pas €/kg
          // Ou retourner une logique différente basée sur l'unité.
          // Pour l'exemple, on va juste calculer basé sur €/kg
          console.warn(`Calcul du prix non implémenté pour l'unité : ${item.unit}`);
          // return item.unitPrice * item.quantityValue; // Logique simplifiée si ce n'est pas au poids
      }

      return item.unitPrice * quantityInKg;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const totalItemPrice = calculateItemTotal(item);

    return (
      <View style={styles.cartItemContainer}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <View style={styles.itemInfoTop}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.categoryChip}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
            </View>
          <Text style={styles.itemUnitPrice}>{item.unitPrice.toFixed(2).replace('.', ',')}{item.unit}</Text>
          
          <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>Quantité:</Text>
                {/* Remplacer par un vrai Picker/Dropdown plus tard */}
               <TouchableOpacity style={styles.quantitySelector}> 
                  <Text style={styles.quantitySelectorText}>{item.quantityValue} {item.quantityUnit}</Text>
                  <FontAwesome name="chevron-down" size={12} color="#666" />
               </TouchableOpacity>
          </View>

          <Text style={styles.itemCalculatedPrice}>{totalItemPrice.toFixed(2).replace('.', ',')}€</Text>
          
          <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const groupedItems = groupItemsBySeller(cartItems);
  const sellers = Object.keys(groupedItems);

  // Composant pour l'en-tête de la liste
  const ListHeader = () => (
    <View>
      <Text style={styles.mainTitle}>Panier</Text>
      <Text style={styles.infoText}>
        Une fois validée, récupérez votre commande <Text style={styles.boldText}>sous 2 jours</Text>. Pour toute information complémentaire, n'hésitez pas à contacter directement le producteur.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      {sellers.length > 0 ? (
        <FlatList
          data={sellers}
          keyExtractor={(seller) => seller}
          ListHeaderComponent={ListHeader}
          renderItem={({ item: seller }) => (
            <View style={styles.sellerSection}>
              <View style={styles.sellerHeader}>
                <View>
                    <Text style={styles.sellerName}>{seller}</Text>
                    <Text style={styles.productCount}>{groupedItems[seller].length} produit{groupedItems[seller].length > 1 ? 's' : ''}</Text>
                </View>
                  <CustomButton
                    title="voir"
                    type="link"
                    size="medium"
                    fontSize={12}
                    backgroundColor={Colors.secondary}
                    textColor={Colors.primary}
                    onPress={() => {console.log('voir')}}
                    borderRadius={30}
                  />
              </View>
              <FlatList
                data={groupedItems[seller]}
                keyExtractor={(item) => item.id}
                renderItem={renderCartItem}
                scrollEnabled={false}
              />
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <ListHeader /> 
          <View style={styles.emptyContainer}>
            <FontAwesome name="shopping-cart" size={50} color="#ddd" />
            <Text style={styles.emptyText}>Votre panier est vide</Text>
            <Text style={styles.emptySubText}>
              Parcourez les produits et ajoutez-les à votre panier
            </Text>
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
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 16,
    paddingBottom: 10,
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
  viewButtonText: {
    color: '#8C5B2A',
    fontWeight: 'bold',
    fontSize: 14,
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
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FBFBFB',
  },
  quantitySelectorText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
      marginRight: 8,
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
});

export default CartScreen; 