import { Stack } from 'expo-router';

export default function ProducerLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{
          headerShown: false, // On cache le header car on a un bouton de retour personnalisé
        }}
      />
    </Stack>
  );
} 