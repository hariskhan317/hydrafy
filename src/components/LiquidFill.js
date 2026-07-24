import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// A subtle water-fill that rises to `pct` of the available container height.
// The wave continually drifts left for life. Used on Home variant B.
export default function LiquidFill({ pct = 0, style }) {
  const { width: w } = Dimensions.get('window');
  const heightAnim = useRef(new Animated.Value(0)).current;
  const drift      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: Math.max(0, Math.min(100, pct)),
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, heightAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(drift, {
        toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true,
      })
    ).start();
  }, [drift]);

  const translateX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -w] });

  return (
    <Animated.View style={[{
      position: 'absolute', left: 0, right: 0, bottom: 0, overflow: 'hidden',
      height: heightAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
    }, style]}>
      <Animated.View style={{ width: w * 2.4, height: '100%', transform: [{ translateX }] }}>
        <Svg width="100%" height="100%" viewBox="0 0 800 100" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="lq" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%"   stopColor={COLORS.sky[300]} stopOpacity="0.55" />
              <Stop offset="100%" stopColor={COLORS.sky[500]} stopOpacity="0.88" />
            </LinearGradient>
          </Defs>
          <Path
            d="M0 14 C 100 0, 200 28, 300 14 S 500 0, 600 14 S 800 28, 800 14 L 800 100 L 0 100 Z"
            fill="url(#lq)"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}
