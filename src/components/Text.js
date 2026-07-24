// Pre-styled text components matching the design's typography scale.
// Sora for display/headings, Plus Jakarta Sans for body, JetBrains Mono for nums.

import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/colors';

function make(baseStyle) {
  return function Cmp({ style, children, color, align, ...rest }) {
    return (
      <RNText
        {...rest}
        style={[
          baseStyle,
          color ? { color } : null,
          align ? { textAlign: align } : null,
          style,
        ]}
      >
        {children}
      </RNText>
    );
  };
}

export const DisplayXL = make({
  fontFamily: FONTS.display, fontSize: 42, letterSpacing: -1.3, lineHeight: 44, color: COLORS.ink[900],
});

export const DisplayLG = make({
  fontFamily: FONTS.display, fontSize: 34, letterSpacing: -1, lineHeight: 36, color: COLORS.ink[900],
});

export const H1 = make({
  fontFamily: FONTS.display, fontSize: 28, letterSpacing: -0.7, lineHeight: 32, color: COLORS.ink[900],
});

export const H2 = make({
  fontFamily: FONTS.heading, fontSize: 22, letterSpacing: -0.5, lineHeight: 26, color: COLORS.ink[900],
});

export const H3 = make({
  fontFamily: FONTS.heading, fontSize: 18, letterSpacing: -0.3, lineHeight: 22, color: COLORS.ink[900],
});

export const Body = make({
  fontFamily: FONTS.body, fontSize: 15, lineHeight: 22, color: COLORS.ink[700],
});

export const BodySm = make({
  fontFamily: FONTS.body, fontSize: 13, lineHeight: 18, color: COLORS.ink[500],
});

export const Mono = make({
  fontFamily: FONTS.mono, fontSize: 12, lineHeight: 16, color: COLORS.ink[500],
});

export const Caps = make({
  fontFamily: FONTS.mono, fontSize: 10, lineHeight: 12, letterSpacing: 2.4, color: COLORS.ink[500],
});

export const styles = StyleSheet.create({});
