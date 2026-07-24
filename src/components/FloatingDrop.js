// Brief floating bubble that emits when the user logs a drink.
// Renders absolute-positioned, fades + rises, then disposes itself.
//
// Usage: pass a `burst` object `{ key, ml }`. A new `key` triggers a new burst.

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import { COLORS, FONTS, SHADOW } from '../constants/colors';

export default function FloatingDrop({ burst, top = 280, left = 0, right = 0 }) {
  const [render, setRender] = useState(null); // currently-rendered burst
  const opacity   = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(0)).current;
  const scale     = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (!burst) return undefined;
    setRender(burst);
    opacity.setValue(0);
    translate.setValue(0);
    scale.setValue(0.7);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 140, useNativeDriver: true }),
        Animated.delay(420),
        Animated.timing(opacity, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
      Animated.timing(translate, {
        toValue: -80, duration: 940,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start(({ finished }) => { if (finished) setRender(null); });

    return undefined;
  }, [burst, opacity, translate, scale]);

  if (!render) return null;

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top, left, right, alignItems: 'center' }}>
      <Animated.View
        style={[
          s.bubble,
          { opacity, transform: [{ translateY: translate }, { scale }] },
        ]}
      >
        <Animated.Text style={s.text}>+{render.ml} ml</Animated.Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  bubble: {
    backgroundColor: COLORS.sky[500],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    ...SHADOW.md,
    shadowColor: '#0f7ba7',
    shadowOpacity: 0.4,
  },
  text: {
    color: '#fff',
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
  },
});
