import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/colors';
import { Body } from './Text';

// tone: 'default' | 'sky' | 'coral'
export default function Chip({ children, tone = 'default', icon, style, textStyle }) {
  const color =
    tone === 'sky'   ? COLORS.sky[600] :
    tone === 'coral' ? COLORS.coral[500] :
                       COLORS.ink[700];
  const bg =
    tone === 'sky'   ? COLORS.sky[100] :
    tone === 'coral' ? COLORS.coral[100] :
                       COLORS.surface;
  const border =
    tone === 'default' ? { borderWidth: 1.5, borderColor: COLORS.ink[100] } : null;

  return (
    <View style={[s.chip, { backgroundColor: bg }, border, style]}>
      {icon}
      <Body style={[s.text, { color, fontFamily: FONTS.bodySemi }, textStyle]}>{children}</Body>
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 13, lineHeight: 16 },
});
