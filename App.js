import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

import {
  useFonts as useSora,
  Sora_400Regular, Sora_600SemiBold, Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
  useFonts as useJakarta,
  PlusJakartaSans_400Regular, PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  useFonts as useMono,
  JetBrainsMono_400Regular,
} from '@expo-google-fonts/jetbrains-mono';

import RootNavigator from './src/navigation/RootNavigator';
import { useStore } from './src/state/store';
import { navTheme } from './src/constants/colors';
import { initPurchases } from './src/purchases/purchases';

SplashScreen.preventAutoHideAsync().catch(() => {});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Android 8+ drops notifications that aren't posted to a channel.
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Hydration reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: '#3fa8d6',
  }).catch(() => {});
}

export default function App() {
  const [hydrated, setHydrated] = useState(false);
  const hydrate = useStore((s) => s.hydrate);
  const setPro  = useStore((s) => s.setPro);

  // Family-name keys here must match FONTS in src/constants/colors.js.
  const [soraOk]   = useSora({
    'Sora-Regular':  Sora_400Regular,
    'Sora-SemiBold': Sora_600SemiBold,
    'Sora-Bold':     Sora_700Bold,
  });
  const [jakOk]    = useJakarta({
    'PlusJakartaSans-Regular':  PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium':   PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold':     PlusJakartaSans_700Bold,
  });
  const [monoOk]   = useMono({
    'JetBrainsMono-Regular': JetBrainsMono_400Regular,
  });
  const fontsLoaded = soraOk && jakOk && monoOk;

  useEffect(() => {
    hydrate().finally(() => setHydrated(true));
  }, [hydrate]);

  // Configure RevenueCat and keep the store's `isPro` in sync with the
  // 'pro' entitlement (initial fetch + every purchase/restore/renewal).
  useEffect(() => {
    initPurchases(setPro);
  }, [setPro]);

  useEffect(() => {
    if (hydrated && fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated, fontsLoaded]);

  if (!hydrated || !fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <RootNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
