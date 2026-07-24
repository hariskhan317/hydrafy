// A thin SafeAreaView wrapper with a consistent background.
// Use this on every screen instead of repeating SafeAreaView + ScrollView.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

export default function ScreenShell({ children, gradient, bg, style, edges = ['top', 'left', 'right'] }) {
  return (
    <SafeAreaView style={[s.container, { backgroundColor: bg || COLORS.bg }, style]} edges={edges}>
      {gradient && (
        <LinearGradient
          colors={gradient}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={s.inner}>{children}</View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  inner:     { flex: 1 },
});
