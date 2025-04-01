import { Stack } from 'expo-router';

export default function FavoritesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Favoris' }} />
        </Stack>
    );
}
