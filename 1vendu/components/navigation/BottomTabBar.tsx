import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

type BottomTabBarProps = {
  activeTab: 'home' | 'favorites' | 'cart' | 'profile';
};

const BottomTabBar = ({ activeTab }: BottomTabBarProps) => {
  return (
    <View style={styles.navBar}>
      <Link href="/(tabs)/home" asChild>
        <Pressable style={styles.navItem}>
          <FontAwesome 
            name="compass" 
            size={24} 
            color={activeTab === 'home' ? (Colors.primary || '#e67e22') : 'black'} 
          />
          <Text style={[
            styles.navText, 
            activeTab === 'home' && styles.navTextActive
          ]}>
            Explorer
          </Text>
        </Pressable>
      </Link>
      
      <Link href="/(tabs)/favorites" asChild>
        <Pressable style={styles.navItem}>
          <FontAwesome 
            name="heart-o" 
            size={24} 
            color={activeTab === 'favorites' ? (Colors.primary || '#e67e22') : 'black'} 
          />
          <Text style={[
            styles.navText, 
            activeTab === 'favorites' && styles.navTextActive
          ]}>
            Favoris
          </Text>
        </Pressable>
      </Link>
      
      <Link href="/(tabs)/cart" asChild>
        <Pressable style={styles.navItem}>
          <FontAwesome 
            name="shopping-cart" 
            size={24} 
            color={activeTab === 'cart' ? (Colors.primary || '#e67e22') : 'black'} 
          />
          <Text style={[
            styles.navText, 
            activeTab === 'cart' && styles.navTextActive
          ]}>
            Panier
          </Text>
        </Pressable>
      </Link>
      
      <Link href="/(tabs)/profile" asChild>
        <Pressable style={styles.navItem}>
          <FontAwesome 
            name="user-o" 
            size={24} 
            color={activeTab === 'profile' ? (Colors.primary || '#e67e22') : 'black'} 
          />
          <Text style={[
            styles.navText, 
            activeTab === 'profile' && styles.navTextActive
          ]}>
            Profil
          </Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  navText: {
    fontSize: 12,
    color: '#333',
  },
  navTextActive: {
    color: Colors.primary || '#e67e22',
    fontWeight: 'bold',
  },
});

export default BottomTabBar; 