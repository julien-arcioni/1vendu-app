import React from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingScreen from '@/components/LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  redirectAuthenticatedTo?: string;
}

/**
 * Composant pour protéger les routes en fonction de l'état d'authentification
 */
export default function AuthGuard({
  children,
  requireAuth = false,
  redirectTo = '/',
  redirectIfAuthenticated = false,
  redirectAuthenticatedTo = '/(tabs)/home'
}: AuthGuardProps) {
  const { canAccess, isLoading } = useAuthGuard({
    requireAuth,
    redirectTo,
    redirectIfAuthenticated,
    redirectAuthenticatedTo
  });

  // Afficher l'écran de chargement pendant la vérification
  if (isLoading || !canAccess) {
    return <LoadingScreen />;
  }

  // Afficher le contenu protégé
  return <>{children}</>;
} 