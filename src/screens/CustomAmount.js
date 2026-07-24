import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import Mascot from '../components/Mascot';
import Button from '../components/Button';
import { H2, DisplayXL, Body, Mono } from '../components/Text';
import { CloseIcon } from '../components/Icons';
import { COLORS, FONTS, SHADOW } from '../constants/colors';
import { useStore } from '../state/store';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRESETS = [100, 200, 250, 330, 400, 500, 600, 750];

export default function CustomAmount({ navigation }) {
  const logDrink = useStore((s) => s.logDrink);
  const [amt, setAmt] = useState(330);

  const onLog = async () => {
    await logDrink(amt, 'custom');
    navigation.goBack();
  };

  return (
    <View style={s.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => navigation.goBack()} />
      <SafeAreaView edges={['bottom']} style={s.sheet}>
        <View style={s.handle} />
        <View style={s.headerRow}>
          <H2>Custom amount</H2>
          <Pressable onPress={() => navigation.goBack()} style={s.closeBtn}>
            <CloseIcon size={18} color={COLORS.ink[700]} />
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', marginTop: 14 }}>
          <DisplayXL style={{ fontSize: 56 }}>
            <DisplayXL color={COLORS.sky[600]}>{amt}</DisplayXL>
            <Body style={{ fontSize: 22, color: COLORS.ink[500], fontFamily: FONTS.bodySemi }}>  ml</Body>
          </DisplayXL>
        </View>

        <Slider
          style={{ width: '100%', height: 40, marginTop: 14 }}
          minimumValue={50}
          maximumValue={1000}
          step={10}
          value={amt}
          minimumTrackTintColor={COLORS.sky[500]}
          maximumTrackTintColor={COLORS.ink[100]}
          thumbTintColor={COLORS.sky[500]}
          onValueChange={setAmt}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -6, marginBottom: 8 }}>
          <Mono>50 ml</Mono>
          <Mono>1000 ml</Mono>
        </View>

        <View style={s.grid}>
          {PRESETS.map((v) => (
            <Pressable
              key={v}
              onPress={() => setAmt(v)}
              style={[s.preset, amt === v && s.presetOn]}
            >
              <Body style={{ fontFamily: FONTS.display, color: amt === v ? '#fff' : COLORS.ink[900] }}>{v}</Body>
            </Pressable>
          ))}
        </View>

        <Button title={`Log ${amt} ml`} onPress={onLog} style={{ marginTop: 16 }} />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(14,36,51,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 22, paddingTop: 12, paddingBottom: 24,
    ...SHADOW.lg,
  },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: COLORS.ink[300], alignSelf: 'center', marginBottom: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceMute,
    alignItems: 'center', justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  preset: {
    width: '23.5%', paddingVertical: 12, borderRadius: 12,
    backgroundColor: COLORS.surfaceMute, alignItems: 'center', justifyContent: 'center',
  },
  presetOn: { backgroundColor: COLORS.sky[500] },
});
