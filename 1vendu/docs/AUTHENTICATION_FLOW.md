# Flux d'Authentification - 1vendu

## Vue d'ensemble

Ce document explique le flux d'authentification mis en place dans l'application 1vendu pour garantir une expérience utilisateur fluide et sécurisée.

## Problème résolu

**Problème initial** : L'application affichait directement l'écran de bienvenue sans vérifier l'état d'authentification, ce qui pouvait créer de la confusion si un utilisateur était déjà connecté.

**Solution** : Mise en place d'un système de vérification d'authentification initial avec écran de chargement.

## Architecture

### 1. Composants principaux

#### `AuthContext` (`contexts/AuthContext.tsx`)
- Gère l'état global d'authentification
- Vérifie automatiquement le token stocké au démarrage
- Fournit les informations : `user`, `token`, `isLoading`, `isAuthenticated`

#### `LoadingScreen` (`components/LoadingScreen.tsx`)
- Écran de chargement réutilisable
- Affiche le logo et un spinner pendant la vérification d'authentification

#### `WelcomeScreen` (`components/WelcomeScreen.tsx`)
- Écran de bienvenue avec boutons de connexion/inscription
- Affiché uniquement aux utilisateurs non connectés

#### `AuthGuard` (`components/AuthGuard.tsx`)
- Composant HOC pour protéger les routes
- Configuration flexible pour différents scénarios

#### `useAuthGuard` (`hooks/useAuthGuard.ts`)
- Hook personnalisé pour la protection des routes
- Gère les redirections automatiques selon l'état d'authentification

### 2. Flux d'authentification

```
App Launch
    ↓
AuthContext initialise
    ↓
[Écran de chargement]
    ↓
Vérification du token stocké
    ↓
┌─────────────────┬─────────────────┐
│   Token valide  │  Token invalide │
│                 │   ou absent     │
├─────────────────┼─────────────────┤
│  Redirect vers  │   Affichage     │
│   /(tabs)/home  │ WelcomeScreen   │
└─────────────────┴─────────────────┘
```

### 3. Protection des routes

#### Routes protégées contre les utilisateurs connectés
- `/auth/login` - Redirige vers `/home` si déjà connecté
- `/auth/register` - Redirige vers `/home` si déjà connecté

#### Routes nécessitant une authentification
- `/(tabs)/home` - Page d'accueil principale
- `/(tabs)/profile` - Profil utilisateur
- `/(tabs)/favorites` - Favoris
- `/(tabs)/cart` - Panier

## Utilisation

### Protéger une route avec le hook

```tsx
import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingScreen from '@/components/LoadingScreen';

export default function ProtectedScreen() {
  const { canAccess, isLoading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/'
  });

  if (isLoading || !canAccess) {
    return <LoadingScreen />;
  }

  return (
    // Votre contenu protégé
  );
}
```

### Protéger une route avec le composant

```tsx
import AuthGuard from '@/components/AuthGuard';

export default function MyScreen() {
  return (
    <AuthGuard requireAuth={true}>
      {/* Votre contenu protégé */}
    </AuthGuard>
  );
}
```

## États d'authentification

- **`isLoading: true`** : Vérification en cours, affichage de l'écran de chargement
- **`isAuthenticated: true`** : Utilisateur connecté, accès aux pages protégées
- **`isAuthenticated: false`** : Utilisateur non connecté, redirection vers l'accueil ou bienvenue

## Avantages de cette approche

1. **Expérience utilisateur fluide** : Pas de flash entre les écrans
2. **Sécurité** : Vérification automatique de la validité des tokens
3. **Modularité** : Composants et hooks réutilisables
4. **Performance** : Chargement asynchrone et mise en cache
5. **Maintenabilité** : Code organisé et documenté

## Navigation après authentification

Après une connexion réussie :
1. Le token est stocké de manière sécurisée
2. Le contexte d'authentification est mis à jour
3. Redirection automatique vers `/(tabs)/home`
4. L'utilisateur accède à l'interface principale de l'application 