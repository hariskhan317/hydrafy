import React from 'react';
import { View, Pressable } from 'react-native';
import * as Notifications from 'expo-notifications';

import ScreenShell from '../../components/ScreenShell';
import TopNav from '../../components/TopNav';
import Mascot from '../../components/Mascot';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { H1, Body, BodySm } from '../../components/Text';
import { COLORS, FONTS } from '../../constants/colors';
import { useStore } from '../../state/store';

const ROWS = [
  { ic: '💧', t: 'Sip reminders',          d: 'Spaced based on your goal' },
  { ic: '🎉', t: 'Goal celebrations',      d: 'A little party at 100%' },
  { ic: '⚠️', t: 'Over-hydration warnings', d: 'Past 120% only' },
];

export default function NotifPermission({ navigation }) {
  const updateSettings = useStore((s) => s.updateSettings);

  const enable = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      await updateSettings({ remindersOn: status === 'granted' });
    } catch {
      await updateSettings({ remindersOn: false });
    }
    navigation.navigate('AllSet');
  };

  const skip = async () => {
    await updateSettings({ remindersOn: false });
    navigation.navigate('AllSet');
  };

  return (
    <ScreenShell>
      <TopNav step={6} total={6} onBack={() => navigation.goBack()} onSkip={skip} />
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Mascot pct={75} size={160} />
      </View>
      <View style={{ paddingHorizontal: 24, marginTop: 24, gap: 10 }}>
        <H1 align="center">Mind if I nudge you?</H1>
        <Body align="center">
          Gentle, smart reminders during your waking hours. No spam. No streak guilt.
        </Body>
        <View style={{ gap: 10, marginTop: 12 }}>
          {ROWS.map((r) => (
            <Card flat key={r.t} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Body style={{ fontSize: 22 }}>{r.ic}</Body>
              <View>
                <Body style={{ fontFamily: FONTS.bodySemi, color: COLORS.ink[900] }}>{r.t}</Body>
                <BodySm>{r.d}</BodySm>
              </View>
            </Card>
          ))}
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: 24, paddingBottom: 50, gap: 10 }}>
        <Button title="Enable reminders" onPress={enable} />
        <Pressable onPress={skip}>
          <Body align="center" style={{ color: COLORS.ink[500] }}>Maybe later</Body>
        </Pressable>
      </View>
    </ScreenShell>
  );
}
