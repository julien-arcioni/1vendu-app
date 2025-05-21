import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ProducerView from '@/components/ProducerView';
import ProducerTabBar from '@/components/navigation/ProducerTabBar';

// Exemple de données de producteur (à remplacer par des données réelles provenant d'une API)
const mockProducer = {
  id: '1',
  name: 'La Ferme Locale',
  description: 'Je suis Mathieu, agriculteur passionné, et je cultive ici des fruits et légumes de saison, ' +
    'sans pesticides chimiques, dans le respect de la terre et des cycles naturels. ' +
    'Mon objectif est simple : vous offrir des produits locaux, sains et savoureux, directement du champ à votre assiette.',
  details: 'Tomates juteuses, courgettes croquantes ou pommes parfumées, tout est cultivé avec soin pour garantir goût et qualité. ' +
    'Venez à la ferme cueillir vos produits, remplir un panier frais, ou simplement échanger sur ma passion pour l\'agriculture durable.',
  distance: 2.7,
  image: 'https://res.cloudinary.com/opquast/image/upload/c_fill,g_face,h_180,r_max,w_180/v1677530011/yvcykbk7b0wbs5a72q2p.jpg',
  profileImage: 'https://res.cloudinary.com/opquast/image/upload/c_fill,g_face,h_180,r_max,w_180/v1677530011/yvcykbk7b0wbs5a72q2p.jpg',
  isFavorite: false,
};

export default function ProducerScreen() {
  const { id } = useLocalSearchParams();
  const [producer, setProducer] = useState(mockProducer);

  // Dans une application réelle, vous chargeriez les données du producteur en fonction de l'ID
  // Exemple : useEffect(() => { fetchProducerData(id); }, [id]);

  const handleToggleFavorite = () => {
    setProducer(prev => ({
      ...prev,
      isFavorite: !prev.isFavorite
    }));
  };

  return (
    <View style={styles.container}>
      <ProducerView 
        producer={producer} 
        onToggleFavorite={handleToggleFavorite} 
      />
      <ProducerTabBar activeTab="explorer" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 