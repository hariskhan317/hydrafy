import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import ScreenShell from '../../components/ScreenShell';
import TopNav from '../../components/TopNav';
import Mascot from '../../components/Mascot';
import Button from '../../components/Button';
import { H1, Body, DisplayXL } from '../../components/Text';
import { COLORS, FONTS } from '../../constants/colors';
import { useStore } from '../../state/store';
import { kgToLbs, lbsToKg } from '../../utils/goal';

export default function Weight({ navigation }) {
  const profile  = useStore((s) => s.profile);
  const setDraft = useStore((s) => s.setOnboardingDraft);
  const [unit, setUnit] = useState(profile.weightUnit || 'kg');
  const [kg, setKg]     = useState(profile.weightKg ?? 68);

  const value = unit === 'kg' ? Math.round(kg) : Math.round(kgToLbs(kg));
  const min   = unit === 'kg' ? 35  : 75;
  const max   = unit === 'kg' ? 180 : 400;

  const setFromSlider = (v) => {
    setKg(unit === 'kg' ? v : lbsToKg(v));
  };

  const onContinue = () => {
    setDraft({ weightKg: Math.round(kg), weightUnit: unit });
    navigation.navigate('Lifestyle');
  };

  return (
    <ScreenShell>
      <TopNav step={2} total={6} onBack={() => navigation.goBack()} />
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Mascot pct={70} size={140} />
      </View>
      <View style={{ paddingHorizontal: 24, marginTop: 30, gap: 10 }}>
        <H1>Your weight</H1>
        <Body style={{ marginBottom: 12 }}>So I can dial in your daily goal. Rough is fine — change anytime.</Body>

        <View style={s.segment}>
          {['kg', 'lbs'].map((u) => (
            <Pressable key={u} onPress={() => setUnit(u)} style={[s.segItem, unit === u && s.segItemOn]}>
              <Body style={{ fontFamily: FONTS.bodySemi, color: unit === u ? COLORS.ink[900] : COLORS.ink[500] }}>{u}</Body>
            </Pressable>
          ))}
        </View>

        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <DisplayXL style={{ fontSize: 56 }}>
            <DisplayXL color={COLORS.sky[600]}>{value}</DisplayXL>
            <Body style={{ fontSize: 22, fontFamily: FONTS.bodySemi, color: COLORS.ink[500] }}>  {unit}</Body>
          </DisplayXL>
        </View>

        <Slider
          style={{ width: '100%', height: 50, marginTop: 8 }}
          minimumValue={min}
          maximumValue={max}
          step={1}
          value={value}
          minimumTrackTintColor={COLORS.sky[500]}
          maximumTrackTintColor={COLORS.ink[100]}
          thumbTintColor={COLORS.sky[500]}
          onValueChange={setFromSlider}
        />
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: 24, paddingBottom: 50 }}>
        <Button title="Continue" onPress={onContinue} />
      </View>
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  segment: {
    backgroundColor: COLORS.ink[100],
    borderRadius: 14,
    padding: 3,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    width: 130,
  },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 11 },
  segItemOn: {
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
});
