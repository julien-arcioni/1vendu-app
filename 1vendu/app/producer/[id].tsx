import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Imports spécifiques à iOS
import RNMapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

// TODO: Intégrer l'API pour récupérer les données détaillées du producteur
// TODO: Implémenter un système de commentaires et notations
// TODO: Ajouter des fonctionnalités de partage sur les réseaux sociaux
// TODO: Intégrer un système de commande et de panier

// TODO: Remplacer par un vrai appel d'API
const getProducerById = (id: number) => {
  // Données fictives pour la démonstration
  const producers = [
    { 
      id: 1, 
      name: "La Ferme Locale", 
      description: "Au cœur de votre région, La Ferme Locale est une exploitation à taille humaine...", 
      latitude: 48.856614, 
      longitude: 2.3522219,
      categories: ["Fruits", "Légumes"],
      distance: 2.7,
      image: require('@/assets/images/icon.png'), // Image temporaire
      bio: "Je suis Mathieu, agriculteur passionné, et je cultive ici des fruits et légumes de saison, sans pesticides chimiques, dans le respect de la terre et des cycles naturels. Mon objectif est simple : vous offrir des produits locaux, sains et savoureux, directement du champ à votre assiette.",
      products: [
        { id: 1, name: "Tomates juteuses", price: "3,50 €/kg", image: require('@/assets/images/icon.png') },
        { id: 2, name: "Courgettes croquantes", price: "2,80 €/kg", image: require('@/assets/images/icon.png') },
        { id: 3, name: "Pommes parfumées", price: "4,20 €/kg", image: require('@/assets/images/icon.png') }
      ],
      address: "123 Chemin des Agriculteurs, 75000 Paris",
      phone: "+33 1 23 45 67 89",
      email: "mathieu@lafermelocale.fr",
      hours: "Lundi au Samedi: 9h - 18h\nDimanche: Fermé",
      website: "https://lafermelocale.fr"
    },
    // TODO: Ajouter d'autres producteurs
  ];
  
  return producers.find(p => p.id === id) || null;
};

type Product = {
  id: number;
  name: string;
  price: string;
  image: any;
};

type Producer = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  categories: string[];
  distance: number;
  image: any;
  bio: string;
  products: Product[];
  address: string;
  phone: string;
  email: string;
  hours: string;
  website: string;
};

export default function ProducerDetailScreen() {
  const { id } = useLocalSearchParams();
  const [producer, setProducer] = useState<Producer | null>(null);
  
  // Sections pour l'onglet sélectionné
  const [activeTab, setActiveTab] = useState('products');
  
  useEffect(() => {
    // Conversion de l'ID en nombre
    const producerId = typeof id === 'string' ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : 0;
    
    if (producerId) {
      // TODO: Remplacer par un appel d'API réel
      const data = getProducerById(producerId);
      setProducer(data);
    }
  }, [id]);

  if (!producer) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* En-tête avec image et bouton retour */}
      <View style={styles.header}>
        <Image source={producer.image} style={styles.headerImage} />
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <FontAwesome name="heart-o" size={24} color="#000" />
          {/* TODO: Implémenter la fonctionnalité de favoris (ajout/suppression) */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <FontAwesome name="share" size={24} color="#000" />
          {/* TODO: Implémenter la fonctionnalité de partage */}
        </TouchableOpacity>
      </View>

      {/* Information du producteur */}
      <View style={styles.infoContainer}>
        <Text style={styles.producerName}>{producer.name}</Text>
        <View style={styles.locationContainer}>
          <FontAwesome name="map-marker" size={16} color="#e74c3c" />
          <Text style={styles.locationText}> à {producer.distance} km</Text>
          {/* TODO: Calculer dynamiquement la distance en fonction de la position de l'utilisateur */}
        </View>

        <View style={styles.categoriesContainer}>
          {producer.categories.map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
        {/* TODO: Ajouter un système de notation avec étoiles */}
      </View>

      {/* Onglets de navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'products' && styles.activeTab]} 
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>Produits</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bio' && styles.activeTab]} 
          onPress={() => setActiveTab('bio')}
        >
          <Text style={[styles.tabText, activeTab === 'bio' && styles.activeTabText]}>À propos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'location' && styles.activeTab]} 
          onPress={() => setActiveTab('location')}
        >
          <Text style={[styles.tabText, activeTab === 'location' && styles.activeTabText]}>Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu des onglets */}
      <View style={styles.tabContent}>
        {/* Produits */}
        {activeTab === 'products' && (
          <View style={styles.productsList}>
            {/* TODO: Ajouter filtrage et tri des produits */}
            {/* TODO: Implémenter la pagination pour les listes longues */}
            {producer.products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <Image source={product.image} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
                {/* TODO: Ajouter un bouton pour ajouter au panier */}
                <TouchableOpacity style={styles.addToCartButton}>
                  <FontAwesome name="plus" size={18} color="#e67e22" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Biographie */}
        {activeTab === 'bio' && (
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{producer.bio}</Text>
            <View style={styles.photographContainer}>
              <Image source={producer.image} style={styles.bioPicture} />
              {/* TODO: Ajouter une galerie d'images du producteur et de la ferme */}
              {/* TODO: Ajouter vidéo de présentation si disponible */}
            </View>
          </View>
        )}

        {/* Localisation et contact */}
        {activeTab === 'location' && (
          <View style={styles.locationSection}>
            <View style={styles.contactInfoContainer}>
              <View style={styles.contactItem}>
                <FontAwesome name="map-marker" size={20} color="#e67e22" />
                <Text style={styles.contactText}>{producer.address}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => Linking.openURL(`tel:${producer.phone}`)}
              >
                <FontAwesome name="phone" size={20} color="#e67e22" />
                <Text style={styles.contactText}>{producer.phone}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => Linking.openURL(`mailto:${producer.email}`)}
              >
                <FontAwesome name="envelope" size={20} color="#e67e22" />
                <Text style={styles.contactText}>{producer.email}</Text>
              </TouchableOpacity>
              
              <View style={styles.contactItem}>
                <FontAwesome name="clock-o" size={20} color="#e67e22" />
                <Text style={styles.contactText}>{producer.hours}</Text>
              </View>
              
              {producer.website && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => Linking.openURL(producer.website)}
                >
                  <FontAwesome name="globe" size={20} color="#e67e22" />
                  <Text style={styles.contactText}>{producer.website}</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Mini map */}
            <View style={styles.mapContainer}>
              <RNMapView
                style={styles.map}
                initialRegion={{
                  latitude: producer.latitude,
                  longitude: producer.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                // TODO: Améliorer la carte avec plus d'informations (points d'intérêt proches, etc.)
              >
                <Marker
                  coordinate={{
                    latitude: producer.latitude,
                    longitude: producer.longitude
                  }}
                  title={producer.name}
                />
              </RNMapView>
              {/* TODO: Ajouter un bouton pour obtenir l'itinéraire */}
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => {
                  const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
                  const url = `${scheme}${producer.latitude},${producer.longitude}`;
                  Linking.openURL(url);
                }}
              >
                <Text style={styles.directionsButtonText}>Itinéraire</Text>
                <FontAwesome name="location-arrow" size={16} color="#fff" style={styles.directionsIcon} />
              </TouchableOpacity>
            </View>
            {/* TODO: Ajouter un formulaire de contact direct au producteur */}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'relative',
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  favoriteButton: {
    position: 'absolute',
    top: 40,
    right: 70,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  shareButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  infoContainer: {
    padding: 20,
  },
  producerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  categoryTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 15,
    marginRight: 30,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#e67e22',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#e67e22',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 20,
  },
  productsList: {
    marginTop: 10,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    color: '#e67e22',
  },
  addToCartButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e67e22',
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioContainer: {
    marginTop: 10,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 20,
  },
  photographContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bioPicture: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationSection: {
    marginTop: 10,
  },
  contactInfoContainer: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#555',
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  directionsButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#e67e22',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  directionsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  directionsIcon: {
    marginLeft: 5,
  },
}); 