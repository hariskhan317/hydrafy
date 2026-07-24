import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Circle as SvgCircle } from 'react-native-svg';

import ScreenShell from '../../components/ScreenShell';
import Mascot from '../../components/Mascot';
import Button from '../../components/Button';
import { DisplayLG, Body } from '../../components/Text';
import { useStore } from '../../state/store';

const CONFETTI = [
  [40, 140, '#ff7a6b'], [330, 180, '#3fa8d6'], [80, 260, '#ffd24a'],
  [300, 300, '#ff9986'], [60, 420, '#3fa8d6'], [350, 400, '#ffd24a'],
  [200, 100, '#ff9986'],
];
const DOTS = [[120, 220], [280, 150], [160, 360], [320, 260], [40, 330]];

export default function AllSet() {
  const name              = useStore((s) => s.profile.name);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  return (
    <ScreenShell gradient={['#d4ecf8', '#f6fbfd']}>
      <Svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {CONFETTI.map(([x, y, c], i) => (
          <Rect key={`c${i}`} x={x} y={y} width={6} height={10} rx={2} fill={c} transform={`rotate(${i * 30} ${x} ${y})`} />
        ))}
        {DOTS.map(([x, y], i) => (
          <SvgCircle key={`d${i}`} cx={x} cy={y} r={3} fill="#3fa8d6" opacity={0.5} />
        ))}
      </Svg>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 30 }}>
        <Mascot pct={100} size={240} />
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 50, gap: 8 }}>
        <DisplayLG align="center">You're all set!</DisplayLG>
        <Body align="center" style={{ marginBottom: 16 }}>
          {name} is ready to follow your sips. Let's pour the first one.
        </Body>
        <Button title="Start tracking 💧" onPress={completeOnboarding} />
      </View>
    </ScreenShell>
  );
}
