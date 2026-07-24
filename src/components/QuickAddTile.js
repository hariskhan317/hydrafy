import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SHADOW } from '../constants/colors';
import { H2, BodySm } from './Text';

// Variant 'sky' applies the soft sky-100 gradient look used on Home.
export default function QuickAddTile({ amount, label, onPress, variant = 'sky', wide = false }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress && onPress();
      }}
      style={({ pressed }) => [
        s.tile,
        variant === 'sky' ? s.sky : s.plain,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <H2 style={{ color: variant === 'sky' ? COLORS.sky[600] : COLORS.ink[900] }}>
        {amount}
        {amount === '+···' ? null : (
          <BodySm style={{ color: variant === 'sky' ? COLORS.sky[500] : COLORS.ink[500], fontFamily: FONTS.bodySemi }}>
            {'  ml'}
          </BodySm>
        )}
      </H2>
      <BodySm>{label}</BodySm>
    </Pressable>
  );
}

const s = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 22,
    gap: 4,
    minHeight: 86,
  },
  plain: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.ink[100],
    ...SHADOW.sm,
  },
  sky: {
    backgroundColor: COLORS.sky[100],
    ...SHADOW.sm,
  },
});
