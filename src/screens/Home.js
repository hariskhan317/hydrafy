import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

import ScreenShell from '../components/ScreenShell';
import Mascot from '../components/Mascot';
import ProgressRing from '../components/ProgressRing';
import QuickAddTile from '../components/QuickAddTile';
import Chip from '../components/Chip';
import Card from '../components/Card';
import FloatingDrop from '../components/FloatingDrop';
import { H2, H3, DisplayXL, Body, BodySm } from '../components/Text';
import { DropIcon, FireIcon } from '../components/Icons';
import { COLORS, FONTS } from '../constants/colors';
import { useStore } from '../state/store';
import { formatHeaderDate, formatTime } from '../utils/date';
import { formatVolume } from '../utils/goal';

export default function Home({ navigation }) {
  const todayLog       = useStore((s) => s.todayLog);
  const settings       = useStore((s) => s.settings);
  const streak         = useStore((s) => s.streak);
  const cosmetics      = useStore((s) => s.cosmetics);
  const pendingTipId    = useStore((s) => s.pendingTipId);
  const pendingWarning  = useStore((s) => s.pendingWarning);
  const logDrink        = useStore((s) => s.logDrink);
  const removeEntry     = useStore((s) => s.removeEntry);

  // Drives the floating "+ml" bubble + mascot pulse. The store sets `lastLog`
  // on every logDrink so this works for quick-add + custom modal alike.
  const burst = useStore((s) => s.lastLog);
  const onAdd = (ml, kind) => logDrink(ml, kind);

  // Toast shown when an entry is removed, so a long-press isn't silent.
  const [toast, setToast] = useState(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef(null);

  const onRemove = useCallback((entry) => {
    removeEntry(entry.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setToast(`Removed ${formatVolume(entry.ml, settings.displayUnit)}`);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    Animated.spring(toastAnim, { toValue: 1, useNativeDriver: true, friction: 8, tension: 80 }).start();
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setToast(null));
    }, 2200);
  }, [removeEntry, settings.displayUnit, toastAnim]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // Surface tip modal as soon as one is queued.
  useEffect(() => {
    if (pendingTipId != null) navigation.navigate('TipUnlock');
  }, [pendingTipId, navigation]);

  // Surface over-hydration modal once per upward crossing.
  useEffect(() => {
    if (pendingWarning === '150') navigation.navigate('Over150');
    else if (pendingWarning === '120') navigation.navigate('Over120');
  }, [pendingWarning, navigation]);

  const pct = todayLog.pct || 0;
  const ml  = todayLog.totalMl || 0;
  const goal = settings.goalMl;

  return (
    <ScreenShell gradient={['#e6f3fa', '#f6fbfd']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={s.headerRow}>
          <View>
            <BodySm>{formatHeaderDate()}</BodySm>
            <H2>Good day</H2>
          </View>
          {streak.current > 0 && (
            <Chip tone="coral" icon={<FireIcon size={14} color={COLORS.coral[500]} />}>
              {streak.current}
            </Chip>
          )}
        </View>

        {/* Ring + Mascot */}
        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <View style={s.ringHalo}>
            <ProgressRing pct={pct} size={260} stroke={10}>
              <Mascot pct={pct} size={200} wornId={cosmetics.wornId} pulseKey={burst?.key} />
            </ProgressRing>
            <FloatingDrop burst={burst} top={20} />
          </View>
        </View>

        {/* Readout */}
        <View style={{ alignItems: 'center', marginTop: 18 }}>
          <DisplayXL style={{ fontSize: 46, lineHeight: 56 }}>
            {Math.round(ml).toLocaleString()}
            <Body style={{ fontSize: 18, fontFamily: FONTS.bodySemi, color: COLORS.ink[500] }}>  ml</Body>
          </DisplayXL>
          <BodySm style={{ color: COLORS.sky[600], fontFamily: FONTS.bodySemi }}>
            {Math.round(pct)}% of {formatVolume(goal, settings.displayUnit)}
          </BodySm>
        </View>

        {/* Quick-add */}
        <View style={s.quickRow}>
          <QuickAddTile amount="+250" label="glass"  onPress={() => onAdd(250, 'glass')} />
          <QuickAddTile amount="+500" label="bottle" onPress={() => onAdd(500, 'bottle')} />
          <QuickAddTile amount="+···" label="custom" onPress={() => navigation.navigate('CustomAmount')} />
        </View>

        {/* Today's log */}
        <View style={{ paddingHorizontal: 18, marginTop: 22 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <H3 style={{ fontSize: 15 }}>Today</H3>
            <BodySm>{todayLog.entries.length} {todayLog.entries.length === 1 ? 'entry' : 'entries'}</BodySm>
          </View>
          {todayLog.entries.length === 0 ? (
            <Card flat><BodySm>No sips yet. Tap a quick-add tile to log one.</BodySm></Card>
          ) : (
            <Card padding={0}>
              {[...todayLog.entries].reverse().map((e, i) => (
                <Pressable
                  key={e.id}
                  onLongPress={() => onRemove(e)}
                  style={[s.logRow, i !== 0 && { borderTopWidth: 1, borderTopColor: COLORS.ink[100] }]}
                >
                  <View style={s.logIcon}><DropIcon size={18} color={COLORS.sky[500]} /></View>
                  <Body style={{ flex: 1, color: COLORS.ink[900], fontFamily: FONTS.bodySemi }}>
                    {formatVolume(e.ml, settings.displayUnit)}
                  </Body>
                  <Body style={{ color: COLORS.ink[500] }}>{formatTime(new Date(e.ts))}</Body>
                </Pressable>
              ))}
              <BodySm style={{ padding: 12, color: COLORS.ink[300], textAlign: 'center' }}>
                Long-press an entry to remove
              </BodySm>
            </Card>
          )}
        </View>
      </ScrollView>

      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            s.toast,
            {
              opacity: toastAnim,
              transform: [
                { translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
              ],
            },
          ]}
        >
          <DropIcon size={16} color={COLORS.white} />
          <Body style={{ color: COLORS.white, fontFamily: FONTS.bodySemi }}>{toast}</Body>
        </Animated.View>
      )}
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: 20, paddingTop: 16,
  },
  ringHalo: {
    width: 260, height: 260, borderRadius: 130, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(180,225,245,0.25)',
  },
  quickRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, marginTop: 22 },
  logRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16,
  },
  logIcon: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.sky[50],
    alignItems: 'center', justifyContent: 'center',
  },
  toast: {
    position: 'absolute', left: 24, right: 24, bottom: 96,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.ink[900], borderRadius: 999,
    paddingVertical: 12, paddingHorizontal: 18,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
