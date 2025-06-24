import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import WelcomeScreen from '@/components/WelcomeScreen';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Utilisateur connecté - rediriger vers l'accueil
        router.replace('/(tabs)/home');
      }
      // Si non connecté, on affiche l'écran de bienvenue (pas de redirection)
    }
  }, [isLoading, isAuthenticated]);

  // Afficher un spinner pendant le chargement de l'état d'authentification
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si non connecté, afficher l'écran de bienvenue
  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }

  // Si connecté, on ne devrait pas arriver ici car on redirige vers /home
  return null;
}
