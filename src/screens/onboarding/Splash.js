import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenShell from '../../components/ScreenShell';
import Mascot from '../../components/Mascot';
import Button from '../../components/Button';
import { Caps, DisplayLG, Body } from '../../components/Text';
import { COLORS } from '../../constants/colors';

export default function Splash({ navigation }) {
  return (
    <ScreenShell gradient={['#bfe2f3', '#eaf6fc', '#f6fbfd']} edges={['top', 'left', 'right']}>
      <View style={{ position: 'absolute', top: 80, left: -30 }}>
        <View style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.35)' }} />
      </View>
      <View style={{ position: 'absolute', top: 300, right: -40 }}>
        <View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.25)' }} />
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 30 }}>
        <Mascot pct={85} size={260} />
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 50, gap: 14 }}>
        <Caps align="center" color={COLORS.sky[500]}>HYDRAFY · v1.0</Caps>
        <DisplayLG align="center">Meet your hydration buddy.</DisplayLG>
        <Body align="center" style={{ marginBottom: 10 }}>
          Track water. Watch Drip thrive. No accounts. No noise.
        </Body>
        <Button title="Get started →" onPress={() => navigation.navigate('Name')} />
      </View>
    </ScreenShell>
  );
}
