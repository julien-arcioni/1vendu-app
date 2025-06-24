import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { deleteUserAccount } from '@/api/user';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LoadingScreen from '@/components/LoadingScreen';
import Colors from '@/constants/Colors';

interface MenuOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Protéger cette route - rediriger si non connecté
  const { canAccess, isLoading: authLoading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/'
  });

  // Options du menu principal
  const menuOptions: MenuOption[] = [
    {
      id: 'personal-info',
      title: 'Informations personnelles',
      icon: 'person-outline',
      onPress: () => {
        // Pour l'instant, on affiche une alerte, plus tard on naviguera vers une vraie page
        Alert.alert('Information', 'Cette fonctionnalité sera bientôt disponible');
      }
    },
    {
      id: 'payment-info',
      title: 'Coordonnées bancaires',
      icon: 'card-outline',
      onPress: () => {
        Alert.alert('Information', 'Cette fonctionnalité sera bientôt disponible');
      }
    },
    {
      id: 'expenses',
      title: 'Dépenses',
      icon: 'receipt-outline',
      onPress: () => {
        Alert.alert('Information', 'Cette fonctionnalité sera bientôt disponible');
      }
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: 'mail-outline',
      onPress: () => {
        Alert.alert('Information', 'Cette fonctionnalité sera bientôt disponible');
      }
    }
  ];

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
            } finally {
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteUserAccount();
              router.replace('/');
            } catch (error) {
              console.error('Erreur lors de la suppression du compte:', error);
              Alert.alert(
                'Erreur', 
                'Une erreur est survenue lors de la suppression du compte. Veuillez réessayer.'
              );
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const renderMenuItem = (option: MenuOption) => (
    <TouchableOpacity 
      key={option.id} 
      style={styles.menuItem}
      onPress={option.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemText}>{option.title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  // Afficher un spinner pendant le chargement
  if (isLoading || authLoading || !canAccess || isDeleting || isLoggingOut) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Menu principal */}
        <View style={styles.menuContainer}>
          {menuOptions.map(renderMenuItem)}
        </View>

        {/* Espace vide pour pousser les boutons vers le bas */}
        <View style={styles.spacer} />

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
    minHeight: 100,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
  },
}); 