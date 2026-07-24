// Custom tab-bar button: icon above, label below, centered as one group.
// Focused tab gets a sky-tinted pill background; inactive tabs are transparent.

import React from 'react';
import { Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '../constants/colors';
import { Body } from './Text';

export default function TabPill({
  label, icon: IconCmp, focused, onPress, onLongPress,
}) {
  const tint = focused ? COLORS.sky[600] : COLORS.ink[500];
  return (
    <Pressable
      onPress={() => { Haptics.selectionAsync().catch(() => {}); onPress && onPress(); }}
      onLongPress={onLongPress}
      hitSlop={6}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        style={{
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          paddingVertical: 6, paddingHorizontal: 14,
          borderRadius: 16,
          backgroundColor: focused ? COLORS.sky[50] : 'transparent',
        }}
      >
        <IconCmp size={20} color={tint} />
        <Body
          numberOfLines={1}
          style={{
            fontSize: 11, lineHeight: 13, marginTop: 3,
            fontFamily: FONTS.bodySemi, color: tint,
          }}
        >
          {label}
        </Body>
      </View>
    </Pressable>
  );
}
