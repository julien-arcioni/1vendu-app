import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Composants
import CustomInput from '@/components/input/CustomInput';
import CustomButton from '@/components/button/CustomButton';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';

// Cette fonction sera créée dans api/user.js
import { forgotPassword } from '@/api/user';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      
      if (!email) {
        setError('Veuillez entrer votre adresse email');
        return;
      }

      await forgotPassword(email);
      
      // Afficher un message de succès
      setSuccessMessage('Un email de réinitialisation a été envoyé à votre adresse si celle-ci est associée à un compte. Si vous ne voyez pas le lien complet dans l\'email, copiez le code et utilisez-le directement dans l\'application.');
      
    } catch (err: any) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
      
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      setSuccessMessage('Un email de réinitialisation a été envoyé à votre adresse si celle-ci est associée à un compte. Si vous ne voyez pas le lien complet dans l\'email, copiez le code et utilisez-le directement dans l\'application.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToResetPassword = () => {
    router.push('/auth/reset-password');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* Titre */}
        <Text style={styles.title}>Mot de passe oublié</Text>
        
        {/* Description */}
        <Text style={styles.description}>
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </Text>

        {/* Champ Email */}
        <CustomInput
          label="E-mail"
          placeholder="Entrez votre adresse mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={{}}
          labelStyle={{}}
          inputStyle={{}}
          error={error && !email ? 'Ce champ est requis' : ''}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}
        {successMessage && (
          <>
            <Text style={styles.successText}>{successMessage}</Text>
            <CustomButton
              title="Saisir le code manuellement"
              type="tertiary"
              onPress={navigateToResetPassword}
              style={styles.manualCodeButton}
              backgroundColor="transparent"
              textColor={Colors.secondary}
              paddingVertical={10}
              paddingHorizontal={15}
              fontSize={14}
              borderRadius={8}
              borderColor="transparent"
            />
          </>
        )}

        {/* Bouton Envoyer */}
        <CustomButton
          title="Envoyer le lien de réinitialisation"
          type="secondary"
          onPress={handleForgotPassword}
          style={styles.sendButton}
          backgroundColor={Colors.secondary}
          textColor="#fff"
          paddingVertical={15}
          paddingHorizontal={20}
          fontSize={16}
          borderRadius={8}
          borderColor={Colors.secondary}
          icon="send-outline"
        />

        {/* Lien pour retourner à la page de connexion */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous vous souvenez de votre mot de passe ?</Text>
          <TouchableOpacity onPress={() => router.replace('/auth/login')}>
            <Text style={styles.link}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
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
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  sendButton: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    color: Colors.red,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  successText: {
    color: Colors.green,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  manualCodeButton: {
    marginTop: 10,
  },
}); 