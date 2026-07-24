import React from 'react';
import { View, StyleSheet } from 'react-native';

import ScreenShell from '../../components/ScreenShell';
import TopNav from '../../components/TopNav';
import Mascot from '../../components/Mascot';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { H3, Caps, DisplayXL, Body, BodySm, Mono } from '../../components/Text';
import { COLORS, FONTS } from '../../constants/colors';
import { useStore } from '../../state/store';
import { goalBreakdown, GOAL_CEILING_ML } from '../../utils/goal';

export default function Goal({ navigation }) {
  const profile = useStore((s) => s.profile);
  const { base, actBoost, climBoost, total } = goalBreakdown(profile);

  return (
    <ScreenShell gradient={['#bfe2f3', '#eaf6fc', '#f6fbfd']}>
      <TopNav step={5} total={6} />
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Mascot pct={100} size={170} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 28 }}>
        <Caps color={COLORS.sky[600]}>YOUR DAILY GOAL</Caps>
        <DisplayXL style={{ fontSize: 58, paddingTop: 40 }}>
          {total.toLocaleString()}
          <Body style={{ fontSize: 22, color: COLORS.ink[500], fontFamily: FONTS.bodySemi }}>  ml</Body>
        </DisplayXL>
        <BodySm style={{ marginTop: 4 }}>
          ≈ {Math.round(total / 250)} cups · {Math.round(total / 600)} large bottles
        </BodySm>
      </View>
      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <Card style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
          <H3 style={{ marginBottom: 8 }}>How we got there</H3>
          <BreakRow label={`Base · ${profile.weightKg} kg × 33 ml`} value={`${base} ml`} />
          <BreakRow label={`Activity · ${profile.activity === 'med' ? 'medium' : profile.activity === 'high' ? 'high' : 'low'}`} value={`+ ${actBoost} ml`} />
          <BreakRow label={`Climate · ${profile.climate === 'hot' ? 'hot' : profile.climate === 'cool' ? 'cool' : 'moderate'}`} value={`+ ${climBoost} ml`} />
          <View style={s.divider} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.coral[400] }} />
            <BodySm style={{ color: COLORS.coral[500], fontFamily: FONTS.bodySemi }}>
              Ceiling {GOAL_CEILING_ML.toLocaleString()} ml · more isn't better.
            </BodySm>
          </View>
        </Card>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: 24, paddingBottom: 50 }}>
        <Button title="Looks good" onPress={() => navigation.navigate('NotifPermission')} />
      </View>
    </ScreenShell>
  );
}

function BreakRow({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
      <BodySm>{label}</BodySm>
      <Mono style={{ color: COLORS.ink[700] }}>{value}</Mono>
    </View>
  );
}

const s = StyleSheet.create({
  divider: { height: 1, backgroundColor: COLORS.ink[100], marginVertical: 12 },
});
