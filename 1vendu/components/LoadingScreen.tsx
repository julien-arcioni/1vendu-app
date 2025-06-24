import React from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import Colors from '@/constants/Colors';

interface LoadingScreenProps {
  backgroundColor?: string;
  logoSize?: { width: number; height: number };
  spinnerColor?: string;
}

export default function LoadingScreen({ 
  backgroundColor = '#ffffff',
  logoSize = { width: 180, height: 80 },
  spinnerColor = Colors.secondary
}: LoadingScreenProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image 
        source={require('@/assets/images/brand/logo.png')} 
        style={[styles.logo, logoSize]} 
      />
      <ActivityIndicator 
        size="large" 
        color={spinnerColor} 
        style={styles.spinner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 30,
    resizeMode: 'contain',
  },
  spinner: {
    marginTop: 20,
  },
}); 