import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Connexion',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Inscription',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Mot de passe oublié',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="reset-password" 
        options={{ 
          title: 'Réinitialiser le mot de passe',
          headerShown: false 
        }} 
      />
    </Stack>
  );
} 