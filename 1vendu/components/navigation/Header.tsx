import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type HeaderProps = {
  showNotification?: boolean;
  onNotificationPress?: () => void;
};

const Header = ({ 
  showNotification = true, 
  onNotificationPress = () => {} 
}: HeaderProps) => {
  return (
    <View style={styles.header}>
      <Image 
        source={require('@/assets/images/brand/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      {showNotification && (
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <FontAwesome name="bell" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 40,
  },
  notificationButton: {
    padding: 5,
  },
});

export default Header; 