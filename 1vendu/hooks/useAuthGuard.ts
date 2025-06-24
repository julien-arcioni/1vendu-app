import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  redirectAuthenticatedTo?: string;
}

/**
 * Hook pour protéger les routes en fonction de l'état d'authentification
 * @param options Options de configuration pour la protection des routes
 */
export const useAuthGuard = (options: AuthGuardOptions = {}) => {
  const {
    requireAuth = false,
    redirectTo = '/',
    redirectIfAuthenticated = false,
    redirectAuthenticatedTo = '/(tabs)/home'
  } = options;

  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Attendre que le chargement soit terminé avant de faire des redirections
    if (!isLoading) {
      // Si l'authentification est requise mais l'utilisateur n'est pas connecté
      if (requireAuth && !isAuthenticated) {
        router.replace(redirectTo as any);
      }
      
      // Si l'utilisateur est connecté mais ne devrait pas accéder à cette page
      if (redirectIfAuthenticated && isAuthenticated) {
        router.replace(redirectAuthenticatedTo as any);
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, redirectIfAuthenticated, redirectTo, redirectAuthenticatedTo]);

  return {
    isAuthenticated,
    isLoading,
    canAccess: isLoading ? false : (requireAuth ? isAuthenticated : !redirectIfAuthenticated || !isAuthenticated)
  };
}; 