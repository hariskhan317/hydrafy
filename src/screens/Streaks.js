import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenShell from '../components/ScreenShell';
import Mascot from '../components/Mascot';
import Card from '../components/Card';
import { H2, H3, Body, BodySm, Mono, DisplayXL, Caps } from '../components/Text';
import { LockIcon } from '../components/Icons';
import { COLORS, FONTS } from '../constants/colors';
import { COSMETICS } from '../constants/cosmetics';
import { useStore } from '../state/store';

export default function Streaks({ navigation }) {
  const streak    = useStore((s) => s.streak);
  const cosmetics = useStore((s) => s.cosmetics);

  const unlocked     = cosmetics.ownedIds.length;
  const total        = COSMETICS.length;
  const nextTarget   = COSMETICS.find((c) => streak.current < c.unlockDays);
  const daysToNext   = nextTarget ? nextTarget.unlockDays - streak.current : 0;

  return (
    <ScreenShell gradient={['#eaf6fc', '#f6fbfd']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ padding: 20, paddingTop: 16 }}>
          <BodySm>Streaks & unlocks</BodySm>
          <H2>Keep glowing</H2>
        </View>

        <View style={{ paddingHorizontal: 18 }}>
          <LinearGradient
            colors={['#ffd5cb', '#ff9986', '#ff7a6b']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.streakCard}
          >
            <Caps color="rgba(255,255,255,0.85)">CURRENT STREAK</Caps>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
              <DisplayXL color="#fff">{streak.current}</DisplayXL>
              <Body style={{ color: '#fff', fontFamily: FONTS.bodySemi }}>day fire 🔥</Body>
            </View>
            <BodySm style={{ color: 'rgba(255,255,255,0.9)', marginTop: 6 }}>
              {nextTarget
                ? `${daysToNext} more day${daysToNext === 1 ? '' : 's'} until your ${nextTarget.label} unlocks.`
                : 'All cosmetics unlocked. Drip is fully accessorized.'}
            </BodySm>
            <View style={s.track}>
              <View style={[s.fill, {
                width: `${Math.min(100, (streak.current / (nextTarget?.unlockDays || streak.current || 1)) * 100)}%`,
              }]} />
            </View>
            <BodySm style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
              Longest streak · {streak.longest || 0}
            </BodySm>
          </LinearGradient>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, marginBottom: 8 }}>
            <H3 style={{ fontSize: 14 }}>Wardrobe milestones</H3>
            <BodySm>{unlocked} / {total} unlocked</BodySm>
          </View>

          <View style={s.grid}>
            {COSMETICS.map((c) => {
              const owned = cosmetics.ownedIds.includes(c.id);
              return (
                <View key={c.id} style={[s.cosCard, !owned && { opacity: 0.65 }]}>
                  <View style={s.cosMascot}>
                    <Mascot pct={owned ? 90 : 70} size={70} animate={false} accessory={owned ? c.id : null} />
                    {!owned && (
                      <View style={s.lockOverlay}>
                        <LockIcon size={22} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Mono style={{ fontSize: 10 }}>{c.unlockDays} days</Mono>
                  <Body style={{ fontFamily: FONTS.bodySemi, fontSize: 13 }}>{owned ? c.label : 'Locked'}</Body>
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={() => navigation.navigate('Wardrobe')}
            style={{ marginTop: 18 }}
          >
            <Card flat style={{ alignItems: 'center' }}>
              <Body style={{ color: COLORS.sky[600], fontFamily: FONTS.bodySemi }}>
                Open wardrobe →
              </Body>
            </Card>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  streakCard: {
    borderRadius: 22, padding: 20,
    shadowColor: '#0e2433', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 4,
  },
  track: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  fill:  { height: '100%', backgroundColor: '#ffffff' },
  grid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cosCard: {
    width: '31.5%',
    backgroundColor: COLORS.surface,
    borderRadius: 22, padding: 10, alignItems: 'center',
    shadowColor: '#0e2433', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2,
  },
  cosMascot: { width: 72, height: 76, alignItems: 'center', justifyContent: 'center' },
  lockOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
});
