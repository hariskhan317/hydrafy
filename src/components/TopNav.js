import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { COLORS, SHADOW } from '../constants/colors';
import { BackIcon } from './Icons';
import { Body } from './Text';
import Dots from './Dots';

export default function TopNav({ step, total = 9, onBack, onSkip }) {
  return (
    <View style={s.row}>
      <View style={s.side}>
        {onBack ? (
          <Pressable onPress={onBack} style={s.backBtn}>
            <BackIcon color={COLORS.ink[700]} />
          </Pressable>
        ) : null}
      </View>
      <Dots step={step} total={total} />
      <View style={[s.side, { alignItems: 'flex-end' }]}>
        {onSkip ? (
          <Pressable onPress={onSkip} hitSlop={10} style={{ paddingHorizontal: 8 }}>
            <Body style={{ color: COLORS.ink[500], fontFamily: 'PlusJakartaSans-SemiBold' }}>Skip</Body>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    height: 48,
  },
  side: { width: 60 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOW.sm,
  },
});
