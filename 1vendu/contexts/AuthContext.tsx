import React, { createContext, useState, useEffect, useContext } from 'react';
import { router } from 'expo-router';
import { getStoredUserData, verifyToken, clearUserData, getCurrentUser } from '@/api/user';

// Types pour le contexte d'authentification
interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  [key: string]: any;
}

interface UserData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  jwt: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
}

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  loadUser: async () => {},
  logout: async () => {},
});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction pour charger l'utilisateur depuis le stockage sécurisé
  const loadUser = async () => {
    try {
      setIsLoading(true);
      const userData = await getStoredUserData() as UserData | null;
      
      if (userData && userData.jwt) {
        // Vérifier si le token est valide
        const isValid = await verifyToken(userData.jwt);
        
        if (isValid) {
          // Récupérer les données utilisateur à jour
          const currentUser = await getCurrentUser(userData.jwt);
          
          setUser({
            id: userData.id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            ...currentUser
          });
          setToken(userData.jwt);
          setIsAuthenticated(true);
        } else {
          // Token invalide, supprimer les données
          await clearUserData();
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await clearUserData();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      router.replace('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    loadUser,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 