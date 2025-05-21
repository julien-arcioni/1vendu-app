import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, FlatList, Pressable, ScrollView, SafeAreaView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors'; // Assurez-vous que ce chemin est correct
import { useRouter } from 'expo-router'; // Importer useRouter

// Données factices pour les commandes
const dummyOrders: OrderItem[] = [
  { id: '1', status: 'non récupérée', client: 'Emma Durand', date: '10 déc 2024' },
  { id: '2', status: 'récupérée', client: 'Lucas Morel', date: '10 déc 2024' },
  { id: '3', status: 'récupérée', client: 'Chloé Bernard', date: '10 déc 2024' },
  { id: '4', status: 'récupérée', client: 'Hugo Lefèvre', date: '10 déc 2024' },
  { id: '5', status: 'récupérée', client: 'Camille Richard', date: '10 déc 2024' },
  { id: '6', status: 'récupérée', client: 'Julien Martin', date: '10 déc 2024' },
  { id: '7', status: 'récupérée', client: 'Sophie Laurent', date: '10 déc 2024' },
  { id: '8', status: 'récupérée', client: 'Maxime Fontaine', date: '10 déc 2024' },
];

type OrderStatus = 'récupérée' | 'non récupérée';

interface OrderItem {
  id: string;
  status: OrderStatus;
  client: string;
  date: string;
}

export default function OrdersScreen() {
  const [searchText, setSearchText] = useState('');
  const [orders, setOrders] = useState<OrderItem[]>(dummyOrders);
  const router = useRouter(); // Initialiser router

  // Filtrer les commandes en fonction du texte de recherche
  const filteredOrders = orders.filter(order =>
    order.client.toLowerCase().includes(searchText.toLowerCase()) ||
    order.status.toLowerCase().includes(searchText.toLowerCase()) ||
    order.date.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderOrderStatus = (status: OrderStatus) => {
    const backgroundColor = status === 'non récupérée' ? '#FFA500' : '#28A745'; // Orange for non récupérée, Green for récupérée
    const textColor = '#fff';
    return (
      <View style={[styles.statusBadge, { backgroundColor }]}>
        <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
      </View>
    );
  };

  const renderOrderRow = ({ item }: { item: OrderItem }) => (
    <Pressable onPress={() => router.push(`/order/${item.id}`)} style={({ pressed }) => [
      styles.orderRow,
      pressed && styles.orderRowPressed, // Style optionnel pour le clic
    ]}>
      <View style={styles.statusCell}>{renderOrderStatus(item.status)}</View>
      <Text style={[styles.cell, styles.clientCell]}>{item.client}</Text>
      <Text style={[styles.cell, styles.dateCell]}>{item.date}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Commandes</Text>
        
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par mot-clé"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.headerRow}>
          <Pressable style={styles.headerCellContainer} onPress={() => console.log('Sort by Status')}>
            <Text style={styles.headerText}>Statut</Text>
            <FontAwesome name="sort" size={16} color="#000" style={styles.sortIcon} />
          </Pressable>
          <Text style={[styles.headerText, styles.clientHeader]}>Client</Text>
          <Pressable style={styles.headerCellContainer} onPress={() => console.log('Sort by Date')}>
            <Text style={styles.headerText}>Date</Text>
            <FontAwesome name="sort" size={16} color="#000" style={styles.sortIcon} />
          </Pressable>
        </View>

        <FlatList
          data={filteredOrders}
          renderItem={renderOrderRow}
          keyExtractor={item => item.id}
          scrollEnabled={false} // Désactivé car nous utilisons ScrollView parent
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Correspond à la couleur de fond du ScrollView
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Un fond légèrement gris pour la page entière
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20, // Espace en haut avant le titre
    paddingBottom: 40, // Espace en bas
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#000',
    alignSelf: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Fond blanc pour la barre de recherche
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12, // Hauteur de la barre
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Ligne de séparation plus subtile
    paddingHorizontal: 5, // Léger padding pour aligner avec les items
  },
  headerCellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333', // Couleur de texte plus foncée pour les en-têtes
  },
  clientHeader: {
    flex: 1, // Pour que "Client" prenne l'espace disponible
    textAlign: 'left', // Alignement à gauche
    paddingLeft: 10, // Assurer un décalage par rapport à la pastille de statut
  },
  sortIcon: {
    marginLeft: 5,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff', // Fond blanc pour chaque item
    borderRadius: 8,
    marginBottom: 10, // Espace entre les items
    paddingHorizontal: 15, // Padding interne pour les items
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderRowPressed: { // Style optionnel pour l'état pressé
    backgroundColor: '#e9ecef',
  },
  statusCell: {
    // Pour s'assurer que la pastille a une largeur fixe ou est bien positionnée
    marginRight: 10,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    minWidth: 100, // Donne une largeur minimale à la pastille
    alignItems: 'center', // Centre le texte dans la pastille
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cell: {
    fontSize: 15,
    color: '#333',
  },
  clientCell: {
    flex: 1, // Le nom du client prendra l'espace restant
    fontWeight: '500',
  },
  dateCell: {
    minWidth: 80, // S'assurer que la date a assez d'espace
    textAlign: 'right',
    color: '#555',
  },
}); 