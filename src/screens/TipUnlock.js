import React, { useEffect, useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Mascot from '../components/Mascot';
import Card from '../components/Card';
import Button from '../components/Button';
import { H1, Body, Caps, Mono } from '../components/Text';
import { COLORS } from '../constants/colors';
import { useStore } from '../state/store';
import { getTipById } from '../utils/tips';
import { TIPS } from '../constants/tips';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TipUnlock({ navigation }) {
  const pendingTipId    = useStore((s) => s.pendingTipId);
  const consumePending  = useStore((s) => s.consumePendingTip);
  const tipsSeen        = useStore((s) => s.tipsSeen);
  const name            = useStore((s) => s.profile.name);

  const tip = useMemo(() => getTipById(pendingTipId), [pendingTipId]);
  const seenCount = tipsSeen.length;

  // Auto-dismiss if there's nothing to show.
  useEffect(() => {
    if (!tip) navigation.goBack();
  }, [tip, navigation]);

  if (!tip) return null;

  const dismiss = () => {
    consumePending();
    navigation.goBack();
  };

  return (
    <View style={s.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      <SafeAreaView edges={['top']} style={{ paddingHorizontal: 18, marginTop: 80 }}>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <LinearGradient colors={['#ffffff', '#eaf6fc']} style={s.body}>
            <Caps color={COLORS.sky[500]}>YOU UNLOCKED A TIP</Caps>
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <Mascot pct={100} size={140} />
            </View>
            <H1 style={{ fontSize: 24, marginTop: 8 }} align="center">{tip.title}</H1>
            <Body align="center" style={{ marginTop: 8 }}>{tip.body} {name} approves.</Body>
          </LinearGradient>
          <View style={s.progressRow}>
            <Mono style={{ color: COLORS.sky[600] }}>TIP {seenCount} / {TIPS.length}</Mono>
            <View style={s.track}>
              <View style={[s.fill, { width: `${(seenCount / TIPS.length) * 100}%` }]} />
            </View>
          </View>
        </Card>
        <View style={{ marginTop: 16 }}>
          <Button title="Got it ✨" onPress={dismiss} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(14,36,51,0.55)' },
  body:     { padding: 22, alignItems: 'center' },
  progressRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.sky[50], padding: 14,
  },
  track: { flex: 1, height: 6, backgroundColor: '#d4ecf8', borderRadius: 3, overflow: 'hidden' },
  fill:  { height: '100%', backgroundColor: COLORS.sky[500] },
});
