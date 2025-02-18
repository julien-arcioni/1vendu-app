import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Votre composant CustomInput
import CustomInput from '@/components/input/CustomInput';
import CustomButton from '@/components/button/CustomButton';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* Flèche de retour */}

        {/* Titre */}
        <Text style={styles.title}>Contents de vous revoir !</Text>

        {/* Champ Email */}
        <CustomInput
          label="E-mail"
          placeholder="Entrez votre adresse mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Champ Mot de passe */}
        <CustomInput
          label="Mot de passe"
          placeholder="Entrez votre mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Lien Mot de passe oublié */}
        <TouchableOpacity onPress={() => console.log('Mot de passe oublié')}>
          <Text style={styles.forgotPassword}>Mot de passe oublié</Text>
        </TouchableOpacity>

        {/* Bouton Se connecter */}
        <CustomButton
          title="Se connecter"
          type="secondary"
          onPress={() => console.log('Tentative de connexion')}
          style={styles.loginButton}
        />

        {/* Lien d’inscription */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous n’avez pas de compte ?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.link}>Inscrivez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer : {
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  forgotPassword: {
    marginTop: 5,
    fontSize: 13,
    color: '#666',
    textDecorationLine: 'underline',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  loginButton: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#000',
  },
  link: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '600',
  },
});
