import React from 'react';
import { View } from 'react-native';
import * as Notifications from 'expo-notifications';

import ScreenShell from '../components/ScreenShell';
import Mascot from '../components/Mascot';
import Card from '../components/Card';
import Button from '../components/Button';
import { H2, H3, DisplayXL, BodySm } from '../components/Text';
import { COLORS, FONTS } from '../constants/colors';
import { useStore } from '../state/store';

export default function Over150Warning({ navigation }) {
  const todayLog       = useStore((s) => s.todayLog);
  const updateSettings = useStore((s) => s.updateSettings);
  const consumeWarning = useStore((s) => s.consumePendingWarning);

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
    <ScreenShell gradient={['#ffe5dd', '#fff3ee']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <H2 style={{ color: COLORS.coral[500] }}>Slow down 🛟</H2>
      </View>
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Mascot pct={Math.max(160, todayLog.pct)} size={200} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <DisplayXL style={{ fontSize: 46, color: COLORS.coral[500] }}>
          {Math.round(todayLog.pct)}%
        </DisplayXL>
        <BodySm style={{ color: COLORS.coral[500], fontFamily: FONTS.bodySemi }}>
          {Math.round(todayLog.totalMl).toLocaleString()} ml · well over ceiling
        </BodySm>
      </View>
      <View style={{ paddingHorizontal: 18, marginTop: 22 }}>
        <Card style={{ backgroundColor: '#ffeae3', borderWidth: 1.5, borderColor: COLORS.coral[300] }}>
          <H3 style={{ color: COLORS.coral[600], fontSize: 16, marginBottom: 6 }}>Drinking too much, too fast?</H3>
          <BodySm style={{ color: '#7a3023' }}>
            At very high intakes blood sodium can drop — a rare condition called <BodySm style={{ fontFamily: FONTS.bodyBold }}>hyponatremia</BodySm>.
            If you feel headache-y, nauseous, or fuzzy, please pause and check in with a doctor.
          </BodySm>
        </Card>
        <View style={{ marginTop: 14, gap: 10 }}>
          <Button title="Pause logging for 2 hr" variant="coral" onPress={pause} />
          <Button title="Got it" variant="secondary" onPress={dismiss} />
        </View>
      </View>
    </ScreenShell>
  );
}
