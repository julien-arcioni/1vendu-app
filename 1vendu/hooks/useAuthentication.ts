import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface AuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  redirectAuthenticatedTo?: string;
}

/**
 * Hook personnalisé pour gérer l'authentification dans les composants
 * 
 * @param {AuthOptions} options Options de configuration
 * @returns Un objet contenant les informations d'authentification et des méthodes utiles
 */
export const useAuthentication = (options: AuthOptions = {
  requireAuth: false,
  redirectTo: '/auth/login',
  redirectIfAuthenticated: false,
  redirectAuthenticatedTo: '/(tabs)/home'
}) => {
  const { user, token, isLoading, isAuthenticated, loadUser, logout } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Si l'authentification est requise mais l'utilisateur n'est pas authentifié
      if (options.requireAuth && !isAuthenticated) {
        router.replace(options.redirectTo as any);
      }
      
      // Si l'utilisateur est authentifié mais qu'il ne devrait pas accéder à cette page
      if (options.redirectIfAuthenticated && isAuthenticated) {
        router.replace(options.redirectAuthenticatedTo as any);
      }
    }
  }, [isLoading, isAuthenticated, options.requireAuth, options.redirectIfAuthenticated]);

  return {
    user,
    token, 
    isLoading,
    isAuthenticated,
    loadUser,
    logout
  };
}; 