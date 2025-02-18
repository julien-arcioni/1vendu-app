import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * CustomInput
 * 
 * @param {string}  label            - Label affiché au-dessus (optionnel)
 * @param {string}  placeholder      - Placeholder du champ
 * @param {boolean} secureTextEntry  - True si c'est un champ de type mot de passe
 * @param {string}  value            - Valeur du champ
 * @param {function} onChangeText    - Callback de changement de texte
 * @param {...any}  props            - Autres props TextInput (keyboardType, etc.)
 */
export default function CustomInput({
  label,
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  style,
  labelStyle,
  inputStyle,
  ...props
}) {
  // État local pour gérer la visibilité du mot de passe
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {/* Label au-dessus du champ */}
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      {/* Zone englobante (texte + icône œil) */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          value={value}
          onChangeText={onChangeText}
          // Si vous voulez un autre comportement : email, numeric, etc.
          autoCapitalize="none"
          {...props}
        />
        {/* Icône pour afficher/cacher le password si c'est un champ mot de passe */}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // espace sous le champ
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    height: 50,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
