import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { loginUser } from '@/api/user';

// Votre composant CustomInput
import CustomInput from '@/components/input/CustomInput';
import CustomButton from '@/components/button/CustomButton';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!email || !password) {
        setError('Veuillez remplir tous les champs');
        return;
      }

      const response = await loginUser(email, password);
      
      // Stockage du token à implémenter ici
      // await AsyncStorage.setItem('userToken', response.jwt);
      
      router.replace('/(tabs)/home');
    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      if (err.response?.data?.error?.message === 'Invalid identifier or password') {
        setError('Email ou mot de passe incorrect. Veuillez réessayer.');
      } else if (err.response?.data?.error?.message) {
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/")}>
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
          style={{}}
          labelStyle={{}}
          inputStyle={{}}
          error={error && !email ? 'Ce champ est requis' : ''}
        />

        {/* Champ Mot de passe */}
        <CustomInput
          label="Mot de passe"
          placeholder="Entrez votre mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{}}
          labelStyle={{}}
          inputStyle={{}}
          error={error && !password ? 'Ce champ est requis' : ''}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Lien Mot de passe oublié */}
        <TouchableOpacity onPress={() => console.log('Mot de passe oublié')}>
          <Text style={styles.forgotPassword}>Mot de passe oublié</Text>
        </TouchableOpacity>

        {/* Bouton Se connecter */}
        <CustomButton
          title="Se connecter"
          type="secondary"
          onPress={handleLogin}
          style={styles.loginButton}
          disabled={isLoading}
          backgroundColor={Colors.secondary}
          textColor="#fff"
          paddingVertical={15}
          paddingHorizontal={20}
          fontSize={16}
          borderRadius={8}
          borderColor={Colors.secondary}
        />

        {/* Lien d'inscription */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
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
  errorText: {
    color: Colors.red,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
