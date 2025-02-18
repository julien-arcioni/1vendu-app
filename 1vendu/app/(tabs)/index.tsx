import React from 'react';
import { 
  StyleSheet, 
  View, 
  ImageBackground, 
  Image 
} from 'react-native';
import { router } from 'expo-router';
import CustomButton from '@/components/button/CustomButton';
import Colors from '@/constants/Colors';

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/welcome/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Logo */}
        <Image 
          source={require('@/assets/images/brand/logo.png')} 
          style={styles.logo} 
        />

        {/* Conteneur des boutons */}
        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Se connecter" 
            type="secondary" 
            onPress={() => router.push('/auth/login')}
            style={styles.button}
          />
          <CustomButton 
            title="S'inscrire" 
            type="outline"
            borderColor={Colors.secondary}
            textColor={Colors.secondary}
            onPress={() => router.push('/auth/register')}
            style={styles.button}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', 
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: "25%",
  },
  logo: {
    width: 180,
    height: 80,
    marginBottom: 50,
    resizeMode: 'contain', 
  },
  buttonContainer: {
    width: '100%',
    gap: 15, 
  },
  button: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderWidth: 3
  },
});
