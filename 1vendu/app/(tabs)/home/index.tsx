import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Modal, Image, ScrollView, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import Header from '@/components/navigation/Header';
import { router, useFocusEffect } from 'expo-router';

// Importer MapView et Marker spécifiquement pour iOS si la plateforme est iOS
import MapView, { Marker } from 'react-native-maps';
// TODO: Importer LeafletView pour Android

// TODO: Intégrer l'API pour récupérer les données des producteurs depuis le backend
// TODO: Ajouter la gestion de l'authentification pour les fonctionnalités de favoris
// TODO: Implémenter la gestion de la géolocalisation de l'utilisateur et des permissions

// Données des producteurs seront chargées depuis l'API

// Définition du type pour un producteur
type Producer = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  categories: string[];
  distance: number; 
  image: string | number; // string pour URL, number pour require()
  bio: string; 
  products: string[];
};

export default function HomeScreen() {
  const [mapReady, setMapReady] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [producersData, setProducersData] = useState<Producer[]>([]);

  // Utiliser useFocusEffect pour charger les données à chaque fois que l'écran est focus
  useFocusEffect(
    useCallback(() => {
      const fetchProducers = async () => {
        try {
          const response = await fetch('http://localhost:1337/api/users?filters%5BisSeller%5D%5B%24eq%5D=true&populate%5Bseller%5D%5Bpopulate%5D%5B0%5D=addressPickUp&populate%5Bseller%5D%5Bpopulate%5D%5B1%5D=sellerPhoto');
          if (!response.ok) {
            console.error('Erreur HTTP:', response.status, await response.text());
            setProducersData([]);
            return;
          }
          const result = await response.json();
          
          if (Array.isArray(result)) {
            const fetchedProducers = result.map((user: any) => {
              const sellerProfile = user.seller; 
              const address = sellerProfile?.addressPickUp;
              const photoObject = sellerProfile?.sellerPhoto?.[0]; 

              // Vérifier que les informations essentielles sont présentes
              if (!sellerProfile || !address || typeof address.latitude !== 'number' || typeof address.longitude !== 'number') {
                console.warn(`Producteur incomplet ignoré (ID: ${user.id}, Username: ${user.username}): Informations vendeur ou adresse manquantes/invalides.`);
                return null;
              }

              return {
                id: user.id,
                name: user.username || 'Nom indisponible',
                description: sellerProfile.description || 'Description indisponible',
                latitude: address.latitude,
                longitude: address.longitude,
                categories: sellerProfile.categories || [], 
                distance: 0, // Placeholder, à calculer
                image: photoObject?.url ? `http://localhost:1337${photoObject.url}` : require('@/assets/images/splash-icon.png'),
                bio: sellerProfile.bio || '',
                products: sellerProfile.products || [], 
              } as Producer;
            }).filter((p: Producer | null): p is Producer => p !== null);

            setProducersData(fetchedProducers);
          } else {
            console.error("Les données reçues de l'API ne sont pas au format attendu (devrait être un tableau):", result);
            setProducersData([]);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des producteurs:", error);
          setProducersData([]);
        }
      };

      fetchProducers();

      return () => {
        console.log("Nettoyage de l'effet fetchProducers (HomeScreen unfocused)");
      };
    }, [])
  );

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
            {producersData.map((producer) => (
              <Marker
                key={producer.id}
                coordinate={{
                  latitude: producer.latitude,
                  longitude: producer.longitude,
                }}
                onPress={() => handleMarkerPress(producer)}
                title={producer.name}
                pinColor="#e67e22" // Couleur orange pour les marqueurs de producteurs
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <FontAwesome name="times" size={24} color="#000" />
            </TouchableOpacity>
            
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {selectedProducer && (
                <>
                  <Image 
                    source={typeof selectedProducer.image === 'string' ? { uri: selectedProducer.image } : selectedProducer.image} 
                    style={styles.producerImage}
                    resizeMode="cover"
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
            </ScrollView>
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
    paddingBottom: 20,
    paddingTop: 0,
    maxHeight: '65%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
  },
  producerImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
  },
  producerNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 15,
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
    paddingRight: 30,
  },
  viewMoreButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
  }
});
