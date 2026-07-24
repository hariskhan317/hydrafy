import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenShell from '../../components/ScreenShell';
import TopNav from '../../components/TopNav';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { H1, H3, Body, BodySm, Mono, Caps } from '../../components/Text';
import { CheckIcon } from '../../components/Icons';
import { COLORS, SHADOW } from '../../constants/colors';
import { useStore } from '../../state/store';

const ACTIVITY = [
  { id: 'low',  title: 'Low',    desc: 'Mostly desk-bound, casual walks.',     icon: '🪷' },
  { id: 'med',  title: 'Medium', desc: 'On your feet, a few workouts a week.', icon: '🚶' },
  { id: 'high', title: 'High',   desc: 'Daily workouts, runs, manual work.',   icon: '🏃' },
];

const CLIMATE = [
  { id: 'cool', title: 'Cool',     desc: '≤ 15°C',  emoji: '❄️', grad: ['#dff3ff', '#b9def0'] },
  { id: 'mod',  title: 'Moderate', desc: '16–25°C', emoji: '⛅', grad: ['#fff6e1', '#f8e0b4'] },
  { id: 'hot',  title: 'Hot',      desc: '≥ 26°C',  emoji: '☀️', grad: ['#ffe0d6', '#ffb09b'] },
];

export default function Lifestyle({ navigation }) {
  const setDraft   = useStore((s) => s.setOnboardingDraft);
  const storedAct  = useStore((s) => s.profile.activity);
  const storedClim = useStore((s) => s.profile.climate);
  const [activity, setActivity] = useState(storedAct || 'med');
  const [climate, setClimate]   = useState(storedClim || 'mod');

  const onContinue = () => {
    setDraft({ activity, climate });
    navigation.navigate('Schedule');
  };

  return (
    <ScreenShell>
      <TopNav step={3} total={6} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, marginTop: 8, gap: 8 }}>
          <H1>A bit about you</H1>
          <Body>This dials in your daily goal — change it anytime.</Body>

          {/* Activity */}
          <Caps style={{ marginTop: 14, color: COLORS.sky[600] }}>HOW ACTIVE ARE YOU?</Caps>
          <View style={{ gap: 8 }}>
            {ACTIVITY.map((o) => {
              const on = activity === o.id;
              return (
                <Pressable key={o.id} onPress={() => setActivity(o.id)} style={[s.row, on && s.rowOn]}>
                  <View style={[s.iconBox, on && { backgroundColor: COLORS.sky[300] }]}>
                    <Body style={{ fontSize: 22 }}>{o.icon}</Body>
                  </View>
                  <View style={{ flex: 1 }}>
                    <H3 style={{ fontSize: 15, marginBottom: 1 }}>{o.title}</H3>
                    <BodySm>{o.desc}</BodySm>
                  </View>
                  <View style={[s.radio, on && s.radioOn]}>
                    {on && <CheckIcon size={13} color="#fff" />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Climate */}
          <Caps style={{ marginTop: 18, color: COLORS.sky[600] }}>YOUR CLIMATE</Caps>
          <View style={s.grid}>
            {CLIMATE.map((o) => {
              const on = climate === o.id;
              return (
                <Pressable key={o.id} onPress={() => setClimate(o.id)} style={{ flex: 1 }}>
                  <LinearGradient colors={o.grad} style={[s.tile, on && s.tileOn]}>
                    <Body style={{ fontSize: 30, lineHeight: 34 }}>{o.emoji}</Body>
                    <H3 style={{ fontSize: 14, marginTop: 4 }}>{o.title}</H3>
                    <Mono style={{ marginTop: 1, color: COLORS.ink[700] }}>{o.desc}</Mono>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>
          <Card flat style={{ marginTop: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Body style={{ fontSize: 20, lineHeight: 24 }}>💡</Body>
            <BodySm style={{ flex: 1 }}>Hot climate = +300 ml on most days.</BodySm>
          </Card>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 8 }}>
        <Button title="Continue" onPress={onContinue} />
      </View>
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  row: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.ink[100],
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...SHADOW.sm,
  },
  rowOn: { backgroundColor: COLORS.sky[100], borderColor: COLORS.sky[400] },
  iconBox: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: COLORS.sky[50],
    alignItems: 'center', justifyContent: 'center',
  },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: COLORS.ink[300],
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOn: { backgroundColor: COLORS.sky[500], borderColor: COLORS.sky[500] },
  grid: { flexDirection: 'row', gap: 10 },
  tile: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOW.sm,
  },
  tileOn: { borderColor: COLORS.ink[900], ...SHADOW.md },
});
