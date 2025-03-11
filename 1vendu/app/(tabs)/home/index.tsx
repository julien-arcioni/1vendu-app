import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import Header from '@/components/navigation/Header';
import BottomTabBar from '@/components/navigation/BottomTabBar';

// Points de vente fictifs pour la démonstration
const salesPoints = [
  { id: 1, top: 30, left: 45, name: "Paris" }, // Paris
  { id: 2, top: 75, left: 40, name: "Marseille" }, // Marseille
  { id: 3, top: 55, left: 45, name: "Lyon" }, // Lyon
  { id: 4, top: 70, left: 30, name: "Toulouse" }, // Toulouse
  { id: 5, top: 40, left: 20, name: "Nantes" }, // Nantes
  { id: 6, top: 35, left: 65, name: "Strasbourg" }, // Strasbourg
  { id: 7, top: 17, left: 40, name: "Lille" }, // Lille
  { id: 8, top: 60, left: 18, name: "Bordeaux" }, // Bordeaux
  { id: 9, top: 45, left: 30, name: "Tours" }, // Tours
  { id: 10, top: 30, left: 35, name: "Rouen" }, // Rouen
  // Quelques points supplémentaires pour remplir la carte
  { id: 11, top: 20, left: 25, name: "Caen" },
  { id: 12, top: 65, left: 50, name: "Grenoble" },
  { id: 13, top: 80, left: 50, name: "Nice" },
  { id: 14, top: 25, left: 55, name: "Reims" },
  { id: 15, top: 50, left: 60, name: "Dijon" },
  { id: 16, top: 85, left: 20, name: "Bayonne" },
  { id: 17, top: 70, left: 10, name: "La Rochelle" },
  { id: 18, top: 40, left: 10, name: "Brest" },
  { id: 19, top: 50, left: 35, name: "Limoges" },
  { id: 20, top: 90, left: 30, name: "Perpignan" }
];

// Définition du type pour un point de vente
type SalesPoint = {
  id: number;
  top: number;
  left: number;
  name: string;
};

export default function HomeScreen() {
  const [mapReady, setMapReady] = useState(false);

  // Afficher les points après un court délai pour s'assurer que l'interface est chargée
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

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
          />
          <FontAwesome name="crosshairs" size={20} color="#999" style={styles.searchIcon} />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome name="filter" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Carte (remplacée par une image statique) */}
      <View style={styles.mapContainer}>
        <View style={styles.staticMapContainer}>
          {/* Fond de carte avec couleur similaire à la capture d'écran */}
          <View style={styles.staticMap}>
            {/* Points de vente */}
            {mapReady && salesPoints.map((point) => (
              <View 
                key={point.id}
                style={[
                  styles.markerContainer, 
                  { 
                    position: 'absolute',
                    top: `${point.top}%`,
                    left: `${point.left}%`
                  }
                ]}
              >
                <FontAwesome name="shopping-basket" size={20} color="#e67e22" />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Barre de navigation */}
      <BottomTabBar activeTab="home" />
    </SafeAreaView>
  );
}

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
    position: 'relative',
  },
  staticMapContainer: {
    flex: 1,
    position: 'relative',
  },
  staticMap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D8EADC', // Couleur verte claire similaire à celle de la capture d'écran
  },
  markerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e67e22',
    zIndex: 2,
  },
  customMarker: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e67e22',
  },
});
