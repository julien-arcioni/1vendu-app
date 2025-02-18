import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '@/components/button/CustomButton';
import CustomInput from '@/components/input/CustomInput';
import Colors from '@/constants/Colors';

export default function RegisterScreen() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Logique d'inscription à implémenter
    console.log('S\'inscrire');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff"}}>
      <View style={styles.topContainer}>
        {/* Flèche de retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>


        {/* Titre */}
        <Text style={styles.title}>Créez votre compte</Text>

        {/* Formulaire d'inscription */}
        <CustomInput
          label="Prénom"
          placeholder="Entrez votre prénom"
          value={firstname}
          onChangeText={setFirstname}
          icon="person-outline"
        />

        <CustomInput
          label="Nom"
          placeholder="Entrez votre nom"
          value={lastname}
          onChangeText={setLastname}
          icon="person-outline"
        />

        <CustomInput
          label="Email"
          placeholder="Entrez votre email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="mail-outline"
        />

        <CustomInput
          label="Mot de passe"
          placeholder="Créez votre mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="lock-closed-outline"
        />

        <CustomInput
          label=""
          placeholder="Confirmez votre mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          icon="lock-closed-outline"
          error={error}
        />

        {/* Bouton d'inscription */}
        <CustomButton
          title="S'inscrire"
          type="secondary"
          onPress={handleRegister}
          style={styles.registerButton}
        />

        {/* Lien vers la connexion */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Vous avez déjà un compte ?
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.link}>
              Connectez-vous
            </Text>
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
  registerButton: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: 30,
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
