import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import Header from '@/components/navigation/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

// Type pour les noms d'icônes FontAwesome utilisés
type IconName = 'shopping-bag' | 'credit-card' | 'map-marker' | 'bell' | 'cog' | 
  'question-circle' | 'sign-out' | 'toggle-on' | 'chevron-right';

const ProfileScreen = () => {
  // Utilisateur fictif pour démonstration
  const user = {
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    phone: '06 12 34 56 78',
    address: '123 Rue du Marché, 75001 Paris',
    image: require('@/assets/images/brand/logo.png') // Placeholder, remplacer par une vraie photo
  };

  // Options du profil
  type ProfileOption = {
    id: string;
    icon: IconName;
    title: string;
    badge?: string;
    toggle?: boolean;
  };

  const profileOptions: ProfileOption[] = [
    { id: 'orders', icon: 'shopping-bag', title: 'Mes commandes', badge: '3' },
    { id: 'payments', icon: 'credit-card', title: 'Moyens de paiement' },
    { id: 'addresses', icon: 'map-marker', title: 'Adresses de livraison' },
    { id: 'notifications', icon: 'bell', title: 'Notifications', toggle: true },
    { id: 'settings', icon: 'cog', title: 'Paramètres' },
    { id: 'help', icon: 'question-circle', title: 'Aide et support' },
  ];

  // Statistiques utilisateur
  const stats = [
    { id: 'purchases', value: '12', label: 'Achats' },
    { id: 'sellers', value: '5', label: 'Vendeurs' },
    { id: 'reviews', value: '8', label: 'Avis' },
  ];

  const renderProfileOption = (option: ProfileOption) => (
    <TouchableOpacity key={option.id} style={styles.optionItem}>
      <View style={styles.optionIconContainer}>
        <FontAwesome name={option.icon} size={18} color={Colors.primary || '#e67e22'} />
      </View>
      <Text style={styles.optionTitle}>{option.title}</Text>
      <View style={styles.optionRight}>
        {option.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{option.badge}</Text>
          </View>
        )}
        {option.toggle ? (
          <FontAwesome name="toggle-on" size={24} color={Colors.primary || '#e67e22'} />
        ) : (
          <FontAwesome name="chevron-right" size={16} color="#999" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header showNotification={false} />
      
      <ScrollView style={styles.scrollView}>
        {/* Section profil */}
        <View style={styles.profileSection}>
          <Image source={user.image} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistiques utilisateur */}
        <View style={styles.statsContainer}>
          {stats.map(stat => (
            <View key={stat.id} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Options de profil */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Mon compte</Text>
          {profileOptions.map(renderProfileOption)}
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity style={styles.logoutButton}>
          <FontAwesome name="sign-out" size={18} color="#e74c3c" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    marginTop: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.primary || '#e67e22',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary || '#e67e22',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionTitle: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.primary || '#e67e22',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 15,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '500',
  },
});

export default ProfileScreen; 