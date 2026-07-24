import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SHADOW } from '../constants/colors';

export default function Card({ children, style, flat = false, padding }) {
  return (
    <View style={[
      flat ? s.flat : s.card,
      padding != null && { padding },
      style,
    ]}>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    ...SHADOW.md,
    overflow: 'hidden',
  },
  flat: {
    backgroundColor: COLORS.surfaceMute,
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
  },
});
