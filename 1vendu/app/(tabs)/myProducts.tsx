import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function MyProductsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Produits</Text>
      {/* Vous pouvez ajouter ici le contenu de l'écran de vos produits */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 