import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useStore } from '../state/store';
import useReminders from '../hooks/useReminders';

import Splash         from '../screens/onboarding/Splash';
import Name           from '../screens/onboarding/Name';
import Weight         from '../screens/onboarding/Weight';
import Lifestyle      from '../screens/onboarding/Lifestyle';
import Schedule       from '../screens/onboarding/Schedule';
import Goal           from '../screens/onboarding/Goal';
import NotifPermission from '../screens/onboarding/NotifPermission';
import AllSet         from '../screens/onboarding/AllSet';

import Home            from '../screens/Home';
import History         from '../screens/History';
import VsLastWeek      from '../screens/VsLastWeek';
import Streaks         from '../screens/Streaks';
import Wardrobe        from '../screens/Wardrobe';
import Settings        from '../screens/Settings';
import Paywall         from '../screens/Paywall';
import CustomAmount    from '../screens/CustomAmount';
import Over120Warning  from '../screens/Over120Warning';
import Over150Warning  from '../screens/Over150Warning';
import TipUnlock       from '../screens/TipUnlock';

import { HomeIcon, ChartIcon, FireIcon, GearIcon } from '../components/Icons';
import TabPill from '../components/TabPill';
import { COLORS, SHADOW } from '../constants/colors';

const TAB_ICONS = {
  Today:    HomeIcon,
  History:  ChartIcon,
  Streaks:  FireIcon,
  Settings: GearIcon,
};

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function MainTabs() {
  useReminders();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute', left: 18, right: 18, bottom: 24, height: 60,
          backgroundColor: COLORS.surface, borderRadius: 30, borderTopWidth: 0,
          paddingHorizontal: 8, paddingTop: 0, paddingBottom: 0, ...SHADOW.lg,
        },
        tabBarButton: (props) => (
          <TabPill
            label={route.name}
            icon={TAB_ICONS[route.name]}
            focused={!!props.accessibilityState?.selected}
            onPress={props.onPress}
            onLongPress={props.onLongPress}
          />
        ),
      })}
    >
      <Tab.Screen name="Today"    component={Home}     />
      <Tab.Screen name="History"  component={History}  />
      <Tab.Screen name="Streaks"  component={Streaks}  />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Splash"          component={Splash} />
      <Stack.Screen name="Name"            component={Name} />
      <Stack.Screen name="Weight"          component={Weight} />
      <Stack.Screen name="Lifestyle"       component={Lifestyle} />
      <Stack.Screen name="Schedule"        component={Schedule} />
      <Stack.Screen name="Goal"            component={Goal} />
      <Stack.Screen name="NotifPermission" component={NotifPermission} />
      <Stack.Screen name="AllSet"          component={AllSet} />
    </Stack.Navigator>
  );
}

function ProLoading() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={COLORS.sky[500]} />
    </View>
  );
}

export default function RootNavigator() {
  const onboarded = useStore((s) => s.onboarded);
  const isPro     = useStore((s) => s.isPro);
  const proReady  = useStore((s) => s.proReady);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboarded ? (
        // 1) New user → onboard first.
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      ) : !proReady ? (
        // 2) Onboarded, but waiting on RevenueCat to report entitlement state.
        <Stack.Screen name="ProLoading" component={ProLoading} />
      ) : !isPro ? (
        // 3) No active subscription → hard paywall (no free tier), can't dismiss.
        <Stack.Screen name="Paywall" component={Paywall} initialParams={{ blocking: true }} />
      ) : (
        // 4) Subscribed → the full app.
        <>
          <Stack.Screen name="Main"          component={MainTabs} />
          <Stack.Screen name="Wardrobe"      component={Wardrobe} options={{ presentation: 'modal' }} />
          <Stack.Screen name="VsLastWeek"    component={VsLastWeek} />
          <Stack.Screen name="CustomAmount"  component={CustomAmount}    options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="Over120"       component={Over120Warning}  options={{ presentation: 'modal' }} />
          <Stack.Screen name="Over150"       component={Over150Warning}  options={{ presentation: 'modal' }} />
          <Stack.Screen name="TipUnlock"     component={TipUnlock}       options={{ presentation: 'transparentModal', animation: 'fade' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
