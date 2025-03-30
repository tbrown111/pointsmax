// frontend/app/(tabs)/_layout.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { useRouter } from 'expo-router';

// Import your custom components and styles for the tabs
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from "@expo/vector-icons";


export default function ProtectedTabsLayout() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Redirect to login if not authenticated
        router.replace('/login');
      } else {
        setUser(currentUser);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Checking Authentication...</Text>
      </View>
    );
  }

  // Once authentication is verified, render the tab navigator:
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="money-bill-wave" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addCard"
        options={{
          title: 'Add Card',
          tabBarIcon: ({ color }) => (
            <AntDesign name="creditcard" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}