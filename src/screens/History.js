import React, { useMemo } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';

import ScreenShell from '../components/ScreenShell';
import Mascot from '../components/Mascot';
import Card from '../components/Card';
import { H1, H2, H3, Body, BodySm, Mono } from '../components/Text';
import { COLORS, FONTS } from '../constants/colors';
import { useStore } from '../state/store';
import { lastNDayMeta, todayKey } from '../utils/date';

export default function History({ navigation }) {
  const history  = useStore((s) => s.history);
  const todayLog = useStore((s) => s.todayLog);
  const name     = useStore((s) => s.profile.name);

  const week = useMemo(() => {
    const meta = lastNDayMeta(7);
    return meta.map((m) => {
      const day = m.key === todayKey() ? {
        pct: todayLog.pct, totalMl: todayLog.totalMl, goalMl: todayLog.goalMl
      } : (history.days[m.key] || { pct: 0, totalMl: 0, goalMl: 0 });
      return { ...m, ...day };
    });
  }, [history, todayLog]);

  const avg = Math.round(week.reduce((sum, d) => sum + (d.pct || 0), 0) / week.length);
  const hits = week.filter((d) => (d.pct || 0) >= 100).length;

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ padding: 20, paddingTop: 16 }}>
          <BodySm>Last 7 days</BodySm>
          <H2>Your week with {name}</H2>
        </View>

        <View style={{ paddingHorizontal: 18, gap: 14 }}>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <View>
                <BodySm>Average</BodySm>
                <H1 style={{ fontSize: 32, paddingTop: 14 }}>{avg}%</H1>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <BodySm>Days at goal</BodySm>
                <H2 style={{ color: COLORS.sky[600], paddingTop: 10 }}>{hits} / 7</H2>
              </View>
            </View>
          </Card>

          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <H3 style={{ fontSize: 14 }}>7-day buddy line-up</H3>
              <BodySm>Tap a day</BodySm>
            </View>
            <View style={s.weekRow}>
              {week.map((d) => (
                <Pressable key={d.key} style={s.dayCol}>
                  <Mascot pct={d.pct} size={48} animate={false} />
                  <Mono style={{ fontSize: 10 }}>{d.label}</Mono>
                  <Body style={{
                    fontSize: 11,
                    fontFamily: FONTS.bodyBold,
                    color: d.pct >= 100 ? COLORS.coral[500] : d.pct >= 60 ? COLORS.sky[600] : COLORS.ink[500],
                  }}>
                    {Math.round(d.pct)}%
                  </Body>
                </Pressable>
              ))}
            </View>
          </Card>

          <Card>
            <H3 style={{ fontSize: 14, marginBottom: 10 }}>Bar view</H3>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 130 }}>
              {week.map((d) => {
                const h = Math.min(120, Math.max(2, d.pct)) * 1.1;
                const bg = d.pct >= 100 ? COLORS.coral[400] : d.pct >= 60 ? COLORS.sky[500] : COLORS.ink[300];
                return (
                  <View key={d.key} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                    <View style={{ width: '100%', height: h, backgroundColor: bg, borderRadius: 8 }} />
                    <Mono style={{ fontSize: 10 }}>{d.label}</Mono>
                  </View>
                );
              })}
            </View>
          </Card>

          <Pressable onPress={() => navigation.navigate('VsLastWeek')}>
            <Card flat style={{ alignItems: 'center' }}>
              <Body style={{ color: COLORS.sky[600], fontFamily: FONTS.bodySemi }}>
                Compare with last week →
              </Body>
            </Card>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  weekRow:  { flexDirection: 'row', gap: 4 },
  dayCol:   {
    flex: 1, alignItems: 'center', gap: 6, paddingVertical: 4,
    borderRadius: 14,
  },
});
