import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// Composants
import CustomInput from '@/components/input/CustomInput';
import CustomButton from '@/components/button/CustomButton';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';

// API
import { resetPassword } from '@/api/user';

export default function ResetPasswordScreen() {
  const { code: urlCode } = useLocalSearchParams();
  const [code, setCode] = useState(typeof urlCode === 'string' ? urlCode : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Vérifier si le code est présent
  useEffect(() => {
    console.log("==== DEEP LINK DEBUG ====");
    console.log("Type de urlCode:", typeof urlCode);
    console.log("Valeur de urlCode:", urlCode);
    console.log("=======================");
    
    if (urlCode) {
      setCode(typeof urlCode === 'string' ? urlCode : Array.isArray(urlCode) ? urlCode[0] : '');
    }
  }, [urlCode]);

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      
      // Validation
      if (!password || !confirmPassword) {
        setError('Veuillez remplir tous les champs');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }

      if (!code) {
        setError('Code de réinitialisation manquant');
        return;
      }

      await resetPassword(code, password, confirmPassword);
      
      setSuccessMessage('Votre mot de passe a été réinitialisé avec succès');
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.replace('/auth/login');
      }, 2000);
      
    } catch (err: any) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
      
      if (err.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
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
        <Text style={styles.title}>Réinitialisation du mot de passe</Text>
        
        {/* Description */}
        <Text style={styles.description}>
          {urlCode ? 'Veuillez entrer votre nouveau mot de passe.' : 'Veuillez saisir le code reçu par email et votre nouveau mot de passe.'}
        </Text>

        {/* Champ Code (affiché seulement si pas dans l'URL) */}
        {!urlCode && (
          <CustomInput
            label="Code de réinitialisation"
            placeholder="Entrez le code reçu par email"
            value={code}
            onChangeText={setCode}
            style={{}}
            labelStyle={{}}
            inputStyle={{}}
            error={error && !code ? 'Ce champ est requis' : ''}
          />
        )}

        {/* Champ Mot de passe */}
        <CustomInput
          label="Nouveau mot de passe"
          placeholder="Entrez votre nouveau mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{}}
          labelStyle={{}}
          inputStyle={{}}
          error={error && !password ? 'Ce champ est requis' : ''}
        />

        {/* Champ Confirmation Mot de passe */}
        <CustomInput
          label="Confirmez le mot de passe"
          placeholder="Confirmez votre nouveau mot de passe"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{}}
          labelStyle={{}}
          inputStyle={{}}
          error={error && !confirmPassword ? 'Ce champ est requis' : ''}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}
        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

        {/* Bouton Réinitialiser */}
        <CustomButton
          title="Réinitialiser le mot de passe"
          type="secondary"
          onPress={handleResetPassword}
          style={styles.resetButton}
          backgroundColor={Colors.secondary}
          textColor="#fff"
          paddingVertical={15}
          paddingHorizontal={20}
          fontSize={16}
          borderRadius={8}
          borderColor={Colors.secondary}
          icon="key-outline"
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
  resetButton: {
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
}); 