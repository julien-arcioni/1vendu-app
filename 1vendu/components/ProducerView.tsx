import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

type ProducerViewProps = {
  producer: {
    id: string;
    name: string;
    description: string;
    details: string;
    distance: number;
    image: string;
    profileImage: string;
    isFavorite?: boolean;
  };
  onToggleFavorite?: () => void;
};

const ProducerView = ({ producer, onToggleFavorite }: ProducerViewProps) => {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Simulation de plusieurs images (dans une vraie application, cela viendrait des données du producteur)
  const images = [
    producer.image,
    'https://res.cloudinary.com/opquast/image/upload/c_fill,g_face,h_180,r_max,w_180/v1677530011/yvcykbk7b0wbs5a72q2p.jpg',
    'https://res.cloudinary.com/opquast/image/upload/c_fill,g_face,h_180,r_max,w_180/v1677530011/yvcykbk7b0wbs5a72q2p.jpg',
  ];

  return (
    <View style={styles.container}>
      {/* Header with back button and share button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Producteur</Text>
        <TouchableOpacity style={styles.shareButton}>
          <FontAwesome name="share-alt" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Producer cover image */}
        <View style={styles.coverImageContainer}>
          <Image 
            source={{ uri: images[activeImageIndex] }} 
            style={styles.coverImage} 
          />
          
          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.paginationDot, 
                  index === activeImageIndex && styles.paginationDotActive
                ]}
                onPress={() => setActiveImageIndex(index)}
              />
            ))}
          </View>
          
          <View style={styles.profileImageContainer}>r
            <Image 
              source={ { uri: producer.profileImage }} 
              style={styles.profileImage} 
            />
          </View>
        </View>

        {/* Producer information */}
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{producer.name}</Text>
            <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
              <FontAwesome 
                name={producer.isFavorite ? "heart" : "heart-o"} 
                size={24} 
                color={producer.isFavorite ? Colors.primary : "black"} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={18} color={Colors.primary} />
            <Text style={styles.distance}> à {producer.distance} km</Text>
          </View>

          <Text style={styles.description}>{producer.description}</Text>
          <Text style={styles.details}>{producer.details}</Text>
        </View>
      </ScrollView>

      {/* Bottom tab navigation will be rendered separately */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  coverImageContainer: {
    position: 'relative',
    height: 250,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary || '#e67e22',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  infoContainer: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  favoriteButton: {
    padding: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  distance: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  details: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
});

export default ProducerView; 