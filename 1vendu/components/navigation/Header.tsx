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
          <Image source={require('@/assets/icon/icon-bell.png')} style={{ width: 24, height: 24 }} />
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
    width: 70,
    height: 28,
  },
  notificationButton: {
    padding: 5,
  },
});

export default Header; 