import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Colors from '@/constants/Colors'; // Utilisation de codes hex directs pour l'instant

// Données factices pour un produit (à remplacer par des données réelles/props)
const dummyOrderDetails = {
  id: '1',
  clientName: 'Emma Durand',
  clientPhone: '01 02 03 04 05',
  status: 'non récupérée' as const,
  timePassed: 'Passée il y a 4min',
  products: [
    { id: 'p1', name: 'Carottes', quantity: '300g', price: '2,10€', imageUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=Carottes' },
    { id: 'p2', name: 'Clémentines', quantity: '700g', price: '4,25€', imageUrl: 'https://via.placeholder.com/150/FF9800/000000?Text=Clémentines' },
    { id: 'p3', name: 'Courgettes', quantity: '3', price: '3,15€', imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?Text=Courgettes' },
    { id: 'p4', name: 'Salade', quantity: '200g', price: '2,80€', imageUrl: 'https://via.placeholder.com/150/8BC34A/FFFFFF?Text=Salade' },
  ],
  totalPrice: '12,30€',
};

interface ProductItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  imageUrl: string;
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const order = dummyOrderDetails;

  if (!order) {
    return <Text>Commande non trouvée.</Text>;
  }

  const renderProductRow = (item: ProductItem) => (
    <View style={styles.productRow} key={item.id}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <Text style={[styles.productCell, styles.productName]}>{item.name}</Text>
      <Text style={[styles.productCell, styles.productQuantity]}>{item.quantity}</Text>
      <Text style={[styles.productCell, styles.productPrice]}>{item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Commandes',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <FontAwesome name="arrow-left" size={20} color="#000" style={{ marginLeft: 0, marginRight: 15 }} />
            </Pressable>
          ),
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
          },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' }, // white
        }}
      />
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.clientName}>{order.clientName}</Text>
              <Text style={styles.clientPhone}>{order.clientPhone}</Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: order.status === 'non récupérée' ? '#FFA500' : '#28A745' }]}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
              <Text style={styles.timePassed}>{order.timePassed}</Text>
            </View>
          </View>

          <Text style={styles.productsTitle}>Produits</Text>

          <View style={styles.productsTable}>
            <View style={styles.productHeaderRow}>
              <Text style={[styles.productHeader, styles.productNameHeader]}>Produit</Text>
              <Text style={[styles.productHeader, styles.productQuantityHeader]}>Quantité</Text>
              <Text style={[styles.productHeader, styles.productPriceHeader]}>Prix total</Text>
            </View>
            {order.products.map(renderProductRow)}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.totalPriceLabel}>Total</Text>
        <Text style={styles.totalPriceValue}>{order.totalPrice}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // white
  },
  scrollViewContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // black
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 16,
    color: '#888', // grey
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 5,
  },
  statusText: {
    color: '#fff', // white
    fontSize: 12,
    fontWeight: '500',
  },
  timePassed: {
    fontSize: 12,
    color: '#888', // grey
  },
  productsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000', // black
    marginBottom: 15,
  },
  productsTable: {},
  productHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // lightGrey
    paddingBottom: 10,
    marginBottom: 10,
  },
  productHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555', // darkGrey
  },
  productNameHeader: {
    flex: 2.5,
  },
  productQuantityHeader: {
    flex: 1,
    textAlign: 'center',
  },
  productPriceHeader: {
    flex: 1,
    textAlign: 'right',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff', // white
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  productCell: {
    fontSize: 15,
    color: '#000', // black
  },
  productName: {
    flex: 2.5,
  },
  productQuantity: {
    flex: 1,
    textAlign: 'center',
    color: '#555', // darkGrey
  },
  productPrice: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee', // lightGrey
    backgroundColor: '#fff', // white
  },
  totalPriceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // black
    marginRight: 10,
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // black
  },
});

// TODO: Définir les couleurs dans @/constants/Colors.ts si elles n'existent pas encore
// (par exemple Colors.black: '#000', Colors.grey: '#888', etc.) 