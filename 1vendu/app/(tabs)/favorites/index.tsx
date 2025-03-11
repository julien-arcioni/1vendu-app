import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Header from '@/components/navigation/Header';
import BottomTabBar from '@/components/navigation/BottomTabBar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

// Données fictives pour les favoris
const favoritesData = [
  {
    id: '1',
    title: 'Panier de légumes bio',
    price: '15,99 €',
    seller: 'Ferme des Oliviers',
    distance: '3,2 km',
    image: require('@/assets/images/brand/logo.png') // Utiliser une image temporaire
  },
  {
    id: '2',
    title: 'Assortiment de fromages',
    price: '24,50 €',
    seller: 'Fromagerie Martin',
    distance: '5,7 km',
    image: require('@/assets/images/brand/logo.png')
  },
  {
    id: '3',
    title: 'Panier fruits de saison',
    price: '18,75 €',
    seller: 'Vergers du Sud',
    distance: '4,1 km',
    image: require('@/assets/images/brand/logo.png')
  },
  {
    id: '4',
    title: 'Miel local 500g',
    price: '12,00 €',
    seller: 'Rucher des Cévennes',
    distance: '7,3 km',
    image: require('@/assets/images/brand/logo.png')
  },
];

// Définition du type pour un produit favori
type FavoriteItem = {
  id: string;
  title: string;
  price: string;
  seller: string;
  distance: string;
  image: any; // Idéalement, vous utiliseriez un type plus précis pour les images
};

const FavoritesScreen = () => {
  const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => (
    <View style={styles.favoriteItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <Text style={styles.itemSeller}>{item.seller}</Text>
        <Text style={styles.itemDistance}>
          <FontAwesome name="map-marker" size={14} color="#666" /> {item.distance}
        </Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <FontAwesome name="heart" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Vos Favoris</Text>
      </View>
      
      {favoritesData.length > 0 ? (
        <FlatList
          data={favoritesData}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="heart-o" size={50} color="#ddd" />
          <Text style={styles.emptyText}>Vous n'avez pas encore de favoris</Text>
          <Text style={styles.emptySubText}>
            Ajoutez des produits à vos favoris pour les retrouver ici
          </Text>
        </View>
      )}
      
      <BottomTabBar activeTab="favorites" />
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
  favoriteItem: {
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
    width: 80,
    height: 80,
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
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primary || '#e67e22',
    marginTop: 4,
  },
  itemSeller: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemDistance: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  favoriteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
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

export default FavoritesScreen; 