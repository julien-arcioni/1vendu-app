import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default function ProfileHeader() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/brand/logo.png')} 
        style={styles.logo} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
}); 