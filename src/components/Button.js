import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { COLORS, FONTS, SHADOW } from '../constants/colors';
import { Body } from './Text';

// variant: 'primary' | 'coral' | 'secondary' | 'ghost'
export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  full = true,
  style,
  iconLeft,
  iconRight,
}) {
  const handlePress = () => {
    if (disabled) return;
    Haptics.selectionAsync().catch(() => {});
    onPress && onPress();
  };

  if (variant === 'ghost') {
    return (
      <Pressable onPress={handlePress} disabled={disabled} style={[s.ghost, style]}>
        <Body style={{ color: COLORS.sky[600], fontFamily: FONTS.bodySemi }}>{title}</Body>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          s.base,
          s.secondary,
          full && s.full,
          pressed && { transform: [{ translateY: 1 }] },
          disabled && { opacity: 0.5 },
          style,
        ]}
      >
        {iconLeft}
        <View style={s.label}><LabelText color={COLORS.ink[900]}>{title}</LabelText></View>
        {iconRight}
      </Pressable>
    );
  }

  const gradient = variant === 'coral'
    ? [COLORS.coral[300], COLORS.coral[400]]
    : [COLORS.sky[400], COLORS.sky[500]];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        full && s.full,
        pressed && { transform: [{ translateY: 1 }] },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <LinearGradient colors={gradient} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={[s.base, s.primary]}>
        {iconLeft}
        <View style={s.label}><LabelText color="#fff">{title}</LabelText></View>
        {iconRight}
      </LinearGradient>
    </Pressable>
  );
}

function LabelText({ color, children }) {
  return (
    <Body style={{ color, fontFamily: FONTS.bodySemi, fontSize: 16 }}>
      {children}
    </Body>
  );
}

const s = StyleSheet.create({
  base: {
    minHeight: 54,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  full: { width: '100%' },
  primary: {
    ...SHADOW.md,
    shadowColor: '#0f7ba7',
    shadowOpacity: 0.32,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.ink[100],
    ...SHADOW.sm,
  },
  ghost: {
    minHeight: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  label: { flexDirection: 'row', alignItems: 'center' },
});
