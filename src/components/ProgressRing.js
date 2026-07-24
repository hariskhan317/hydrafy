import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { COLORS } from '../constants/colors';

export default function ProgressRing({ pct, size = 260, stroke = 10, children }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const r       = (size - stroke) / 2;
  const c       = 2 * Math.PI * r;
  const offset  = c * (1 - clamped / 100);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <Defs>
          <LinearGradient id="ring-g" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%"   stopColor={COLORS.sky[300]} />
            <Stop offset="100%" stopColor={COLORS.sky[500]} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={COLORS.ink[100]}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ring-g)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}
