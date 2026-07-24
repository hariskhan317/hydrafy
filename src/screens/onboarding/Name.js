import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';

import ScreenShell from '../../components/ScreenShell';
import TopNav from '../../components/TopNav';
import Mascot from '../../components/Mascot';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import { H1, Body, Mono } from '../../components/Text';
import { COLORS, FONTS, SHADOW } from '../../constants/colors';
import { useStore } from '../../state/store';

const SUGGESTIONS = ['Drip', 'Splash', 'Bloop', 'Mochi', 'Puddle'];

export default function Name({ navigation }) {
  const storeName = useStore((s) => s.profile.name);
  const setDraft  = useStore((s) => s.setOnboardingDraft);
  const [name, setName] = useState(storeName || 'Drip');

  const onContinue = () => {
    setDraft({ name: name.trim() || 'Drip' });
    navigation.navigate('Weight');
  };

  return (
    <ScreenShell>
      <TopNav step={1} total={6} onBack={() => navigation.goBack()} onSkip={onContinue} />
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Mascot pct={75} size={170} />
      </View>
      <View style={{ paddingHorizontal: 24, marginTop: 30, gap: 8 }}>
        <H1>Name your buddy</H1>
        <Body style={{ marginBottom: 12 }}>Optional, but it makes things 14% cuter.</Body>

        <View style={s.field}>
          <TextInput
            value={name}
            onChangeText={(t) => setName(t.slice(0, 12))}
            maxLength={12}
            style={s.input}
            selectionColor={COLORS.sky[500]}
          />
          <Mono style={{ color: COLORS.ink[300] }}>{name.length}/12</Mono>
        </View>

        <View style={s.chipRow}>
          {SUGGESTIONS.map((n) => {
            const on = n === name;
            return (
              <Pressable key={n} onPress={() => setName(n)}>
                <Chip tone={on ? 'sky' : 'default'}>{n}</Chip>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: 24, paddingBottom: 50 }}>
        <Button title="Continue" onPress={onContinue} />
      </View>
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  field: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.sky[300],
    ...SHADOW.sm,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.ink[900],
    padding: 0,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
});
