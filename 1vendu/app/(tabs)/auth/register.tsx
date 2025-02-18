import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import CustomButton from "@/components/button/CustomButton";
import { router } from 'expo-router';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      {/* Ajoutez ici votre formulaire d'inscription */}
      <CustomButton 
        title="Retour" 
        type="light"
        onPress={() => router.back()}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
  }
}); 