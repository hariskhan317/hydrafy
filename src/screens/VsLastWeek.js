import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenShell from '../components/ScreenShell';
import Mascot from '../components/Mascot';
import Card from '../components/Card';
import { H2, H3, Body, BodySm, Mono, DisplayLG, Caps } from '../components/Text';
import { COLORS, FONTS } from '../constants/colors';
import { useStore } from '../state/store';
import { lastNDays, todayKey } from '../utils/date';
import { format, parseISO, subDays, startOfDay } from 'date-fns';
import { formatVolume } from '../utils/goal';

export default function VsLastWeek() {
  const history  = useStore((s) => s.history);
  const todayLog = useStore((s) => s.todayLog);
  const settings = useStore((s) => s.settings);
  const name     = useStore((s) => s.profile.name);

  const stats = useMemo(() => {
    const todayKeyStr = todayKey();
    const last7  = lastNDays(7);
    const prev7  = lastNDays(14).slice(0, 7);
    const getDay = (k) => k === todayKeyStr
      ? { pct: todayLog.pct, totalMl: todayLog.totalMl }
      : (history.days[k] || { pct: 0, totalMl: 0 });

    const summarize = (keys) => {
      const days = keys.map(getDay);
      const avgPct  = Math.round(days.reduce((s, d) => s + (d.pct || 0), 0) / days.length);
      const avgMl   = Math.round(days.reduce((s, d) => s + (d.totalMl || 0), 0) / days.length);
      const hits    = days.filter((d) => (d.pct || 0) >= 100).length;
      const skipped = days.filter((d) => (d.totalMl || 0) === 0).length;
      let bestStreak = 0, cur = 0;
      for (const d of days) {
        if ((d.pct || 0) >= 100) { cur += 1; bestStreak = Math.max(bestStreak, cur); }
        else cur = 0;
      }
      return { avgPct, avgMl, hits, skipped, bestStreak };
    };
    return { now: summarize(last7), prev: summarize(prev7) };
  }, [history, todayLog]);

  const delta = {
    hits:    stats.now.hits    - stats.prev.hits,
    avgMl:   stats.now.avgMl   - stats.prev.avgMl,
    best:    stats.now.bestStreak - stats.prev.bestStreak,
    skipped: stats.now.skipped - stats.prev.skipped,
  };

  const fmtDelta = (n, suffix = '') => {
    if (n === 0) return '0';
    return `${n > 0 ? '+' : '−'}${Math.abs(n)}${suffix}`;
  };

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ padding: 20, paddingTop: 16 }}>
          <BodySm>Compare</BodySm>
          <H2>This week vs last</H2>
        </View>

        <View style={{ paddingHorizontal: 18, flexDirection: 'row', gap: 12 }}>
          <PeriodCard label="THIS WEEK" pct={stats.now.avgPct} highlight />
          <PeriodCard label="LAST WEEK" pct={stats.prev.avgPct} />
        </View>

        <View style={{ paddingHorizontal: 18, marginTop: 22 }}>
          <Card>
            <H3 style={{ fontSize: 14, marginBottom: 10 }}>Side by side</H3>
            <Row title="Days at goal" a={`${stats.now.hits}`}    b={`${stats.prev.hits}`}    d={fmtDelta(delta.hits, ' days')} />
            <Row title="Avg intake"   a={formatVolume(stats.now.avgMl, settings.displayUnit)} b={formatVolume(stats.prev.avgMl, settings.displayUnit)} d={fmtDelta(delta.avgMl, ' ml')} />
            <Row title="Best streak"  a={`${stats.now.bestStreak} days`} b={`${stats.prev.bestStreak} days`} d={fmtDelta(delta.best)} />
            <Row title="Skipped days" a={`${stats.now.skipped}`} b={`${stats.prev.skipped}`} d={fmtDelta(-delta.skipped)} />
          </Card>
          <Card flat style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Body style={{ fontSize: 22 }}>🎉</Body>
            <BodySm style={{ flex: 1, color: COLORS.ink[900] }}>
              {delta.hits >= 0 ? `Big week. ${name} grew brighter.` : `Slipped a bit. ${name} still believes in you.`}
            </BodySm>
          </Card>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

function PeriodCard({ label, pct, highlight }) {
  const colors = highlight ? ['#ffffff', '#eaf6fc'] : ['#ffffff', '#f4f4f6'];
  return (
    <LinearGradient colors={colors} style={s.period}>
      <Caps color={highlight ? COLORS.sky[500] : COLORS.ink[500]}>{label}</Caps>
      <View style={{ marginVertical: 10 }}>
        <Mascot pct={pct || 0} size={110} animate={false} />
      </View>
      <DisplayLG style={{ fontSize: 30, color: highlight ? COLORS.ink[900] : COLORS.ink[700] }}>{pct || 0}%</DisplayLG>
      <BodySm>avg / day</BodySm>
    </LinearGradient>
  );
}

function Row({ title, a, b, d }) {
  return (
    <View style={s.row}>
      <BodySm style={{ flex: 1.3, fontFamily: FONTS.bodySemi, color: COLORS.ink[900] }}>{title}</BodySm>
      <Mono style={{ flex: 1, color: COLORS.sky[600], textAlign: 'center' }}>{a}</Mono>
      <Mono style={{ flex: 1, color: COLORS.ink[500], textAlign: 'center' }}>{b}</Mono>
      <Mono style={{ flex: 1, color: COLORS.coral[500], textAlign: 'right', fontFamily: FONTS.bodyBold }}>{d}</Mono>
    </View>
  );
}

const s = StyleSheet.create({
  period: {
    flex: 1, alignItems: 'center', borderRadius: 22, paddingVertical: 18, paddingHorizontal: 12,
    shadowColor: '#0e2433', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 18, elevation: 3,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: COLORS.ink[100],
  },
});
