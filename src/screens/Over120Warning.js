import React from 'react';
import { View, StyleSheet } from 'react-native';

import ScreenShell from '../components/ScreenShell';
import Mascot from '../components/Mascot';
import Card from '../components/Card';
import Button from '../components/Button';
import { H2, H3, DisplayXL, BodySm } from '../components/Text';
import { COLORS, FONTS } from '../constants/colors';
import { useStore } from '../state/store';
import * as Notifications from 'expo-notifications';

export default function Over120Warning({ navigation }) {
  const todayLog       = useStore((s) => s.todayLog);
  const updateSettings = useStore((s) => s.updateSettings);
  const consumeWarning = useStore((s) => s.consumePendingWarning);
  const name           = useStore((s) => s.profile.name);

  const dismiss = () => {
    consumeWarning();
    navigation.goBack();
  };

  const pause = async () => {
    const until = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    await updateSettings({ pausedUntil: until });
    try { await Notifications.cancelAllScheduledNotificationsAsync(); } catch {}
    dismiss();
  };

  return (
    <ScreenShell gradient={['#fff3ee', '#f6fbfd']}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 16 }}>
        <View>
          <BodySm>Mon · today</BodySm>
          <H2>Easy there, friend</H2>
        </View>
      </View>
      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <Mascot pct={Math.max(125, todayLog.pct)} size={210} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <DisplayXL style={{ fontSize: 46 }}>
          {Math.round(todayLog.totalMl).toLocaleString()}
          <H3 style={{ color: COLORS.ink[500] }}>  ml</H3>
        </DisplayXL>
        <BodySm style={{ color: COLORS.coral[500], fontFamily: FONTS.bodySemi }}>
          {Math.round(todayLog.pct)}% · over goal
        </BodySm>
      </View>
      <View style={{ paddingHorizontal: 18, marginTop: 28 }}>
        <Card style={[s.card, { borderColor: COLORS.coral[200] }]}>
          <View style={s.iconBadge}><BodySm style={{ color: COLORS.coral[500], fontFamily: FONTS.bodyBold, fontSize: 16 }}>!</BodySm></View>
          <View style={{ flex: 1 }}>
            <H3 style={{ fontSize: 16 }}>You've passed today's goal.</H3>
            <BodySm style={{ marginTop: 6 }}>
              More water isn't always better. {name} suggests pausing for a bit and letting your body catch up.
            </BodySm>
          </View>
        </Card>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Button title="Got it" variant="secondary" onPress={dismiss} />
          <Button title="Pause logging" variant="coral" onPress={pause} />
        </View>
      </View>
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: '#fff7f1', borderWidth: 1.5,
  },
  iconBadge: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.coral[100],
    alignItems: 'center', justifyContent: 'center',
  },
});
