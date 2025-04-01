import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Modal, Image, ScrollView, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import Header from '@/components/navigation/Header';
<<<<<<< HEAD
=======
import BottomTabBar from '@/components/navigation/BottomTabBar';
import { router } from 'expo-router';
>>>>>>> b2ad67c (Ajout de la carte interactive des producteurs avec intégration de Leaflet pour Android et React Native Maps pour iOS. Mise à jour des dépendances et ajout d'un écran de détails pour chaque producteur. Documentation mise à jour dans le README.)

// Importer MapView et Marker spécifiquement pour iOS si la plateforme est iOS
import MapView, { Marker } from 'react-native-maps';
// TODO: Importer LeafletView pour Android

// TODO: Intégrer l'API pour récupérer les données des producteurs depuis le backend
// TODO: Ajouter la gestion de l'authentification pour les fonctionnalités de favoris
// TODO: Implémenter la gestion de la géolocalisation de l'utilisateur et des permissions

// TODO: Remplacer par l'appel API pour récupérer les vraies données des producteurs
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
    products: ["Tomates", "Courgettes", "Pommes"]
  },
  { 
    id: 2, 
    name: "Les Fromages du Terroir", 
    description: "Fromages artisanaux fabriqués avec passion...", 
    latitude: 48.860294, 
    longitude: 2.338629,
    categories: ["Laitages", "Fromages"],
    distance: 3.2,
    image: require('@/assets/images/icon.png'), // Image temporaire
    bio: "Notre ferme familiale produit des fromages artisanaux depuis trois générations.",
    products: ["Comté", "Camembert", "Bleu d'Auvergne"]
  },
  // TODO: Ajouter d'autres producteurs
];

// Définition du type pour un producteur
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
  products: string[];
};

export default function HomeScreen() {
  const [mapReady, setMapReady] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Afficher les points après un court délai pour s'assurer que l'interface est chargée
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleMarkerPress = (producer: Producer) => {
    setSelectedProducer(producer);
    setModalVisible(true);
  };

  const handleViewProducerDetail = () => {
    if (selectedProducer) {
      setModalVisible(false);
      // Naviguer vers la page détaillée du producteur
      router.push({
        pathname: "/producer/[id]",
        params: { id: selectedProducer.id }
      });
    }
  };

  // Coordonnées centrales de la France pour l'initialisation de la carte
  const initialRegion = {
    latitude: 46.603354,
    longitude: 1.888334,
    latitudeDelta: 8,
    longitudeDelta: 8,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec logo et notification */}
      <Header />

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par mot-clé"
            placeholderTextColor="#999"
            // TODO: Implémenter la fonctionnalité de recherche des producteurs
          />
          <FontAwesome name="crosshairs" size={20} color="#999" style={styles.searchIcon} />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome name="filter" size={20} color="#000" />
          {/* TODO: Implémenter les filtres (par catégorie, distance, etc.) */}
        </TouchableOpacity>
      </View>

      {/* Carte interactive */}
      <View style={styles.mapContainer}>
        {mapReady && Platform.OS === 'ios' ? (
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
            // TODO: Ajouter la gestion des permissions de localisation
            // TODO: Implémenter la mise à jour de la carte lorsque l'utilisateur se déplace
            // TODO: Ajouter une animation lors du chargement de la carte
          >
            {producers.map((producer) => (
              <Marker
                key={producer.id}
                coordinate={{
                  latitude: producer.latitude,
                  longitude: producer.longitude,
                }}
                onPress={() => handleMarkerPress(producer)}
                title={producer.name}
                // TODO: Personnaliser davantage les marqueurs (couleur selon catégorie, etc.)
              />
            ))}
          </MapView>
        ) : mapReady && Platform.OS === 'android' ? (
          // TODO: Intégrer le composant LeafletView ici avec les props appropriées
          <View style={styles.map}>
            <Text>Carte Leaflet (Android) à implémenter</Text>
          </View>
        ) : (
          // Peut-être afficher un indicateur de chargement pendant que mapReady est false
          <View style={styles.map}><Text>Chargement de la carte...</Text></View>
        )}
      </View>

      {/* Modal de détail rapide du producteur */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* TODO: Améliorer le design de la modal pour ressembler exactement à la maquette */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <FontAwesome name="times" size={24} color="#000" />
            </TouchableOpacity>
            
            {selectedProducer && (
              <>
                <Image 
                  source={selectedProducer.image} 
                  style={styles.producerImage}
                  // TODO: Ajouter un indicateur de chargement pour les images
                />
                
                <View style={styles.categoriesContainer}>
                  {selectedProducer.categories.map((category, index) => (
                    <View key={index} style={styles.categoryTag}>
                      <Text style={styles.categoryText}>{category}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.producerInfo}>
                  <View style={styles.producerNameContainer}>
                    <Text style={styles.producerName}>{selectedProducer.name}</Text>
                    <View style={styles.distanceContainer}>
                      <FontAwesome name="map-marker" size={16} color="#e74c3c" />
                      <Text style={styles.distanceText}> à {selectedProducer.distance} km</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.producerDescription}>{selectedProducer.description}</Text>
                  
                  <TouchableOpacity 
                    style={styles.viewMoreButton}
                    onPress={handleViewProducerDetail}
                  >
                    <FontAwesome name="chevron-right" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// Style personnalisé pour la carte
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#D8EADC"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 12,
    height: 45,
    marginRight: 10,
  },
  searchIcon: {
    marginHorizontal: 6,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 8,
  },
  filterButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  producerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
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
  producerInfo: {
    flex: 1,
  },
  producerNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  producerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  producerDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  viewMoreButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
  }
});
