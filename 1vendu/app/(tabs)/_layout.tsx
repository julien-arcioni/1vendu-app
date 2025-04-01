import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Image } from 'react-native';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuthentication();

  useEffect(() => {
    // Ce hook va automatiquement vérifier l'authentification au démarrage
    console.log('État d\'authentification:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'FirstScreen',
          headerShown: false,
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
        <Tabs.Screen
        name="home"
        options={({ navigation }) => ({
          title: 'Explorer',
          tabBarIcon: () => <Image source={require('@/assets/icon/icon-logo.png')} style={{ width: 28, height: 28}} />,
          headerShown: false,
          tabBarActiveTintColor: Colors.secondary,
          tabBarItemStyle: navigation.isFocused() ? { borderTopWidth: 2, borderTopColor: Colors.secondary } : {},
        })}
        />
        <Tabs.Screen
        name="favorites" 
        options={({ navigation }) => ({
          title: 'Favoris',
          tabBarIcon: ({ color }) => <Image source={require('@/assets/icon/icon-favoris.png')} style={{ width: 28, height: 28}} />,
          headerShown: false,
          tabBarActiveTintColor: Colors.secondary,
          tabBarItemStyle: navigation.isFocused() ? { borderTopWidth: 2, borderTopColor: Colors.secondary } : {},
        })}
        />
        <Tabs.Screen
        name="cart"
        options={({ navigation }) => ({
          title: 'Panier',
          tabBarIcon: ({ color }) => <Image source={require('@/assets/icon/icon-panier.png')} style={{ width: 28, height: 28}} />,
          headerShown: false,
          tabBarActiveTintColor: Colors.secondary,
          tabBarItemStyle: navigation.isFocused() ? { borderTopWidth: 2, borderTopColor: Colors.secondary } : {},
        })}
        />
        <Tabs.Screen
        name="profile"
        options={({ navigation }) => ({
          title: 'Profil',
          tabBarIcon: ({ color }) => <Image source={require('@/assets/icon/icon-stats.png')} style={{ width: 28, height: 28}} />,
          headerShown: false,
          tabBarActiveTintColor: Colors.secondary,
          tabBarItemStyle: navigation.isFocused() ? { borderTopWidth: 2, borderTopColor: Colors.secondary } : {},
        })}
        />
        <Tabs.Screen
        name="auth"
        options={{
          title: "Authentification",
          headerShown: false,
          tabBarStyle: { display: "none"},
          tabBarIcon: undefined,
          href: null
        }}
        />
      </Tabs>
      );
}
