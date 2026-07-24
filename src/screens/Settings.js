import React, { useState } from 'react';
import { View, ScrollView, Pressable, Switch, Alert, TextInput, Modal, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

import ScreenShell from '../components/ScreenShell';
import Mascot from '../components/Mascot';
import Card from '../components/Card';
import Button from '../components/Button';
import { H2, H3, Body, BodySm, Caps, Mono, DisplayLG } from '../components/Text';
import { DropIcon, BoltIcon, SunIcon, MoonIcon, BellIcon, ChartIcon, CloseIcon, LockIcon } from '../components/Icons';
import { COLORS, FONTS, SHADOW } from '../constants/colors';
import { useStore } from '../state/store';
import { usePro } from '../purchases/usePro';
import { restore } from '../purchases/purchases';
import { formatVolume, GOAL_CEILING_ML, GOAL_FLOOR_ML } from '../utils/goal';

export default function Settings({ navigation }) {
  const profile        = useStore((s) => s.profile);
  const settings       = useStore((s) => s.settings);
  const streak         = useStore((s) => s.streak);
  const cosmetics      = useStore((s) => s.cosmetics);
  const updateSettings = useStore((s) => s.updateSettings);
  const resetAll       = useStore((s) => s.resetAll);
  const setPro         = useStore((s) => s.setPro);
  const { isPro }      = usePro();

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft,   setGoalDraft]   = useState(String(settings.goalMl));
  const [restoring,   setRestoring]   = useState(false);

  const upgrade = () => navigation.navigate('Paywall');

  const onRestore = async () => {
    setRestoring(true);
    const pro = await restore();
    setRestoring(false);
    setPro(pro);
    Alert.alert(
      pro ? 'Pro restored' : 'Nothing to restore',
      pro ? 'Welcome back — your Pro features are unlocked.'
          : 'We couldn\'t find an active subscription on this Apple ID.'
    );
  };

  const togglePaused = () => {
    if (settings.pausedUntil) {
      updateSettings({ pausedUntil: null });
    } else {
      // Paused until end-of-day
      const end = new Date(); end.setHours(23, 59, 59, 0);
      updateSettings({ pausedUntil: end.toISOString() });
      Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
    }
  };

  const toggleReminders = () => updateSettings({ remindersOn: !settings.remindersOn });
  const toggleUnits     = () => updateSettings({ displayUnit: settings.displayUnit === 'ml' ? 'oz' : 'ml' });

  const saveGoal = async () => {
    const n = parseInt(goalDraft, 10);
    if (Number.isNaN(n)) return setEditingGoal(false);
    const clamped = Math.max(GOAL_FLOOR_ML, Math.min(GOAL_CEILING_ML, n));
    await updateSettings({ goalMl: clamped });
    setEditingGoal(false);
  };

  const confirmReset = () => {
    Alert.alert(
      'Reset everything?',
      'Profile, goal, history, streak, and cosmetics will be erased. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetAll() },
      ]
    );
  };

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ padding: 20, paddingTop: 16 }}>
          <BodySm>Settings</BodySm>
          <H2>Profile & preferences</H2>
        </View>

        <View style={{ paddingHorizontal: 18, gap: 14 }}>
          <Card style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Mascot pct={88} size={64} animate={false} wornId={cosmetics.wornId} />
            <View style={{ flex: 1 }}>
              <H3>{profile.name}</H3>
              <BodySm>{streak.current} day streak · {cosmetics.ownedIds.length} cosmetics</BodySm>
            </View>
            <Body style={{ color: COLORS.ink[500], fontSize: 18 }}>›</Body>
          </Card>

          {/* Hydrafy Pro */}
          <View>
            <Caps style={{ paddingHorizontal: 4, marginBottom: 6 }}>HYDRAFY PRO</Caps>
            <View style={s.list}>
              {isPro ? (
                <View style={s.row}>
                  <BoltIcon color={COLORS.sky[500]} />
                  <Body style={{ flex: 1, fontFamily: FONTS.bodySemi }}>Pro member</Body>
                  <Body style={{ color: COLORS.sky[600], fontFamily: FONTS.bodySemi }}>Active ✓</Body>
                </View>
              ) : (
                <Pressable style={s.row} onPress={upgrade}>
                  <BoltIcon color={COLORS.sky[500]} />
                  <View style={{ flex: 1 }}>
                    <Body style={{ fontFamily: FONTS.bodySemi }}>Upgrade to Pro</Body>
                    <BodySm>Unlock advanced insights & more</BodySm>
                  </View>
                  <Body style={{ color: COLORS.ink[300], marginLeft: 4 }}>›</Body>
                </Pressable>
              )}
              <Pressable style={[s.row, s.rowBorder]} onPress={onRestore} disabled={restoring}>
                <LockIcon size={18} color={COLORS.ink[500]} />
                <Body style={{ flex: 1, fontFamily: FONTS.bodySemi }}>Restore purchases</Body>
                {restoring && <Body style={{ color: COLORS.ink[300] }}>…</Body>}
              </Pressable>
            </View>
          </View>

          {/* Goal section */}
          <View>
            <Caps style={{ paddingHorizontal: 4, marginBottom: 6 }}>GOAL</Caps>
            <View style={s.list}>
              <Pressable style={s.row} onPress={() => setEditingGoal(true)}>
                <DropIcon color={COLORS.sky[500]} />
                <Body style={{ flex: 1, fontFamily: FONTS.bodySemi }}>Daily goal</Body>
                <Body style={{ color: COLORS.ink[500] }}>{formatVolume(settings.goalMl, settings.displayUnit)}</Body>
                <Body style={{ color: COLORS.ink[300], marginLeft: 4 }}>›</Body>
              </Pressable>
              <Pressable style={[s.row, s.rowBorder]} onPress={toggleUnits}>
                <BoltIcon color={COLORS.sky[500]} />
                <Body style={{ flex: 1, fontFamily: FONTS.bodySemi }}>Units</Body>
                <Body style={{ color: COLORS.ink[500] }}>{settings.displayUnit}</Body>
                <Body style={{ color: COLORS.ink[300], marginLeft: 4 }}>›</Body>
              </Pressable>
              <View style={[s.row, s.rowBorder]}>
                <SunIcon color={COLORS.sky[500]} />
                <Body style={{ flex: 1, fontFamily: FONTS.bodySemi }}>Activity & climate</Body>
                <Body style={{ color: COLORS.ink[500] }}>
                  {labelActivity(profile.activity)} · {labelClimate(profile.climate)}
                </Body>
              </View>
            </View>
          </View>

          {/* Reminders */}
          <View>
            <Caps style={{ paddingHorizontal: 4, marginBottom: 6 }}>REMINDERS</Caps>
            <View style={s.list}>
              <View style={s.row}>
                <BellIcon color={COLORS.coral[400]} />
                <Body style={{ flex: 1, fontFamily: FONTS.bodySemi }}>Sip reminders</Body>
                <Switch
                  value={settings.remindersOn}
                  onValueChange={toggleReminders}
                  trackColor={{ true: COLORS.sky[500], false: COLORS.ink[100] }}
                  thumbColor="#fff"
                />
              </View>
              <View style={[s.row, s.rowBorder]}>
                <MoonIcon color={COLORS.coral[400]} />
                <Body style={{ flex: 1, fontFamily: FONTS.bodySemi }}>Schedule</Body>
                <Body style={{ color: COLORS.ink[500] }}>{profile.wakeTime} – {profile.sleepTime}</Body>
              </View>
              <View style={[s.row, s.rowBorder]}>
                <BoltIcon color={COLORS.coral[400]} />
                <Body style={{ flex: 1, fontFamily: FONTS.bodySemi }}>Pause for today</Body>
                <Switch
                  value={!!settings.pausedUntil}
                  onValueChange={togglePaused}
                  trackColor={{ true: COLORS.sky[500], false: COLORS.ink[100] }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>

          {/* Data */}
          <View>
            <Caps style={{ paddingHorizontal: 4, marginBottom: 6 }}>DATA</Caps>
            <View style={s.list}>
              <View style={s.row}>
                <ChartIcon color={COLORS.ink[500]} />
                <Body style={{ flex: 1, fontFamily: FONTS.bodySemi }}>Export history (CSV)</Body>
                <Body style={{ color: COLORS.ink[300] }}>›</Body>
              </View>
              <Pressable style={[s.row, s.rowBorder]} onPress={confirmReset}>
                <CloseIcon color={COLORS.coral[500]} />
                <Body style={{ flex: 1, fontFamily: FONTS.bodySemi, color: COLORS.coral[500] }}>Reset all data</Body>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Goal editor */}
      <Modal visible={editingGoal} transparent animationType="fade" onRequestClose={() => setEditingGoal(false)}>
        <View style={s.modalBg}>
          <Card style={{ width: '80%' }}>
            <H3>Daily goal (ml)</H3>
            <TextInput
              keyboardType="numeric"
              value={goalDraft}
              onChangeText={(t) => setGoalDraft(t.replace(/[^0-9]/g, ''))}
              style={s.input}
            />
            <Mono>
              {GOAL_FLOOR_ML.toLocaleString()} – {GOAL_CEILING_ML.toLocaleString()} ml
            </Mono>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Button title="Cancel" variant="secondary" onPress={() => setEditingGoal(false)} />
              <Button title="Save"    onPress={saveGoal} />
            </View>
          </Card>
        </View>
      </Modal>
    </ScreenShell>
  );
}

function labelActivity(a) { return a === 'low' ? 'Low' : a === 'high' ? 'High' : 'Medium'; }
function labelClimate(c)  { return c === 'cool' ? 'Cool' : c === 'hot' ? 'Hot' : 'Mod.'; }

const s = StyleSheet.create({
  list: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: 'hidden',
    ...SHADOW.sm,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 16,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: COLORS.ink[100] },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  input: {
    borderWidth: 1, borderColor: COLORS.ink[100], borderRadius: 12,
    padding: 12, fontSize: 20, fontFamily: FONTS.display, marginTop: 10, marginBottom: 6,
  },
});
