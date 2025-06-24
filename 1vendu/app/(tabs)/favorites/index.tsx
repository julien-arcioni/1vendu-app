import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/navigation/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

// Type pour un produit favori depuis l'API
type FavoriteItem = {
  id: string;
  product: {
    id: number;
    title: string;
    price: number;
    gallery?: Array<{
      url: string;
    }>;
  };
  createdAt: string;
};

const FavoritesScreen = () => {
  const { isAuthenticated } = useAuth();
  const { favorites, isLoading, removeFavorite, getFavoriteId } = useFavorites();

  // Rediriger vers la connexion si pas authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour voir vos favoris.',
        [
          { text: 'Se connecter', onPress: () => router.push('/(tabs)/auth/login') },
          { text: 'Annuler', style: 'cancel' }
        ]
      );
    }
  }, [isAuthenticated]);

  const handleRemoveFavorite = async (productId: number) => {
    try {
      const favoriteId = getFavoriteId(productId);
      if (favoriteId) {
        await removeFavorite(favoriteId);
        Alert.alert('Succès', 'Produit retiré des favoris');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de retirer le produit des favoris');
    }
  };

  const handleProductPress = (productId: number) => {
    // Navigation vers les détails du produit
    // Nous devrons d'abord trouver le producteur de ce produit
    console.log('Navigation vers le produit:', productId);
    // router.push(`/producer/${producerId}`); // À implémenter avec l'ID du producteur
  };

  const renderFavoriteItem = ({ item }: { item: any }) => {
    const product = item.product;
    const productImage = product.gallery && product.gallery.length > 0 
      ? { uri: `http://localhost:1337${product.gallery[0].url}` }
      : require('@/assets/images/icon.png');

    return (
      <TouchableOpacity 
        style={styles.favoriteItem}
        onPress={() => handleProductPress(product.id)}
      >
        <Image source={productImage} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{product.title}</Text>
          <Text style={styles.itemPrice}>{product.price.toFixed(2).replace('.', ',')} €/kg</Text>
          <Text style={styles.itemDate}>
            Ajouté le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => handleRemoveFavorite(product.id)}
        >
          <FontAwesome name="heart" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.emptyContainer}>
          <FontAwesome name="user" size={50} color="#ddd" />
          <Text style={styles.emptyText}>Connexion requise</Text>
          <Text style={styles.emptySubText}>
            Connectez-vous pour voir vos favoris
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/(tabs)/auth/login')}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
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
          <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Vos Favoris</Text>
        {favorites.length > 0 && (
          <Text style={styles.count}>{favorites.length} produit{favorites.length > 1 ? 's' : ''}</Text>
        )}
      </View>
      
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="heart-o" size={50} color="#ddd" />
          <Text style={styles.emptyText}>Vous n'avez pas encore de favoris</Text>
          <Text style={styles.emptySubText}>
            Ajoutez des produits à vos favoris pour les retrouver ici
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.exploreButtonText}>Explorer les produits</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  count: {
    fontSize: 14,
    color: '#666',
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
  itemDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  favoriteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
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
  loginButton: {
    backgroundColor: Colors.primary || '#e67e22',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default FavoritesScreen; 