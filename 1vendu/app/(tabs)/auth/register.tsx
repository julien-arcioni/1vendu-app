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

import { Text } from '@/components/Themed';
import CustomButton from '@/components/button/CustomButton';
import CustomInput from '@/components/input/CustomInput';
import Colors from '@/constants/Colors';
import { registerUser } from '@/api/user';

export default function RegisterScreen() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ICI on gère l'état isSeller : j’achète => false, je vends => true
  const [isSeller, setIsSeller] = useState(false);

  // Génération automatique d'un username unique
  const generateUsername = (firstname: string, lastname: string) => {
    const normalizedFirstname = firstname
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const normalizedLastname = lastname
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const random = Math.floor(Math.random() * 1000);
    return `${normalizedFirstname.toLowerCase()}.${normalizedLastname.toLowerCase()}${random}`;
  };

  // Simple validation avant l’inscription
  const validateForm = () => {
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  // Au clic sur "S'inscrire"
  const handleRegister = async () => {
    try {
      setError('');
      setIsLoading(true);

      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      const username = generateUsername(firstname, lastname);

      await registerUser(
        username,
        email,
        password,
        firstname,
        lastname,
        isSeller // ICI on passe la valeur du toggle
      );

      Alert.alert(
        'Inscription réussie',
        'Votre compte a été créé avec succès',
        [
          {
            text: 'OK',
            onPress: () => router.push('/auth/login'),
          },
        ],
      );
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      if (err.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else {
        setError("Une erreur est survenue lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.topContainer}>
        {/* Flèche de retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/")}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        
        {/* Titre */}
        <Text style={styles.title}>Créez votre compte</Text>

        {/* Boutons "J'achète" / "Je vends" */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isSeller && styles.toggleButtonActive,
            ]}
            onPress={() => setIsSeller(false)}
          >
            <Text
              style={!isSeller ? styles.toggleTextActive : styles.toggleText}
            >
              J’achète
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              isSeller && styles.toggleButtonActive,
            ]}
            onPress={() => setIsSeller(true)}
          >
            <Text
              style={isSeller ? styles.toggleTextActive : styles.toggleText}
            >
              Je vends
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire d'inscription */}
        <CustomInput
          label="Prénom"
          placeholder="Entrez votre prénom"
          value={firstname}
          onChangeText={(text) => {
            setFirstname(text);
            setError('');
          }}
          icon="person-outline"
          error={error && !firstname ? 'Ce champ est requis' : ''}
        />

        <CustomInput
          label="Nom"
          placeholder="Entrez votre nom"
          value={lastname}
          onChangeText={(text) => {
            setLastname(text);
            setError('');
          }}
          icon="person-outline"
          error={error && !lastname ? 'Ce champ est requis' : ''}
        />

        <CustomInput
          label="Email"
          placeholder="Entrez votre email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="mail-outline"
          error={error && !email ? 'Ce champ est requis' : ''}
        />

        <CustomInput
          label="Mot de passe"
          placeholder="Créez votre mot de passe"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
          icon="lock-closed-outline"
          error={error && !password ? 'Ce champ est requis' : ''}
        />

        <CustomInput
          label="Confirmation du mot de passe"
          placeholder="Confirmez votre mot de passe"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError('');
          }}
          secureTextEntry
          icon="lock-closed-outline"
          error={error}
        />

        {/* Message d'erreur général */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Bouton d'inscription */}
        <CustomButton
          title="S'inscrire"
          type="secondary"
          onPress={handleRegister}
          style={styles.registerButton}
          disabled={isLoading}
        />

        {/* Lien vers la connexion */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.link}>Connectez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  topContainer : {
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  // -- Boutons "J'achète" / "Je vends" --
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 20,
    paddingVertical: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.secondary,
  },
  toggleText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  registerButton: {
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
  errorText: {
    color: Colors.red,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
