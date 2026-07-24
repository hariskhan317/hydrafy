import React, { useState } from 'react';
import { View, Pressable, Platform, Modal, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenShell from '../../components/ScreenShell';
import TopNav from '../../components/TopNav';
import Mascot from '../../components/Mascot';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { H1, H2, H3, Body, BodySm, DisplayLG } from '../../components/Text';
import { SunIcon, MoonIcon } from '../../components/Icons';
import { COLORS, SHADOW, FONTS } from '../../constants/colors';
import { useStore } from '../../state/store';

function dateFromHHMM(s) {
  const [h, m] = (s || '07:00').split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}
function hhmmFromDate(d) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function Schedule({ navigation }) {
  const profile          = useStore((s) => s.profile);
  const saveOnboarding   = useStore((s) => s.setOnboardingDraft);
  const [wake,  setWake]  = useState(profile.wakeTime  || '07:00');
  const [sleep, setSleep] = useState(profile.sleepTime || '23:30');
  const [picking, setPicking]   = useState(null);          // 'wake' | 'sleep' | null
  const [pickerDate, setPickerDate] = useState(new Date());

  const openPicker = (which) => {
    setPickerDate(dateFromHHMM(which === 'wake' ? wake : sleep));
    setPicking(which);
  };

  const onAndroidChange = (event, selectedDate) => {
    setPicking(null);
    if (event.type === 'dismissed' || !selectedDate) return;
    if (picking === 'wake') setWake(hhmmFromDate(selectedDate));
    else setSleep(hhmmFromDate(selectedDate));
  };

  const onIOSChange = (_event, selectedDate) => {
    if (selectedDate) setPickerDate(selectedDate);
  };

  const confirmIOS = () => {
    if (picking === 'wake') setWake(hhmmFromDate(pickerDate));
    else setSleep(hhmmFromDate(pickerDate));
    setPicking(null);
  };

  const onContinue = () => {
    saveOnboarding({ wakeTime: wake, sleepTime: sleep });
    navigation.navigate('Goal');
  };

  return (
    <ScreenShell>
      <TopNav step={4} total={6} onBack={() => navigation.goBack()} />
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Mascot pct={60} size={130} />
      </View>
      <View style={{ paddingHorizontal: 24, marginTop: 26, gap: 12 }}>
        <H1>When are you up?</H1>
        <Body style={{ marginBottom: 4 }}>I'll only nudge you while you're awake. Promise.</Body>

        <Pressable onPress={() => openPicker('wake')}>
          <Card style={s.row}>
            <View style={s.icon}><SunIcon color={COLORS.sky[600]} /></View>
            <View style={{ flex: 1 }}>
              <BodySm style={{ fontFamily: FONTS.bodySemi, color: COLORS.ink[700] }}>Wake up</BodySm>
              <DisplayLG style={{ fontSize: 30, marginTop: 2 }}>{wake}</DisplayLG>
            </View>
            <Body style={{ color: COLORS.ink[500], fontSize: 18 }}>›</Body>
          </Card>
        </Pressable>

        <Pressable onPress={() => openPicker('sleep')}>
          <Card style={s.row}>
            <View style={s.icon}><MoonIcon color={COLORS.sky[600]} /></View>
            <View style={{ flex: 1 }}>
              <BodySm style={{ fontFamily: FONTS.bodySemi, color: COLORS.ink[700] }}>Bedtime</BodySm>
              <DisplayLG style={{ fontSize: 30, marginTop: 2 }}>{sleep}</DisplayLG>
            </View>
            <Body style={{ color: COLORS.ink[500], fontSize: 18 }}>›</Body>
          </Card>
        </Pressable>

        <Card flat style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 4 }}>
          <Body style={{ fontSize: 18 }}>🔕</Body>
          <BodySm style={{ flex: 1 }}>No notifications between bedtime and wake.</BodySm>
        </Card>
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ paddingHorizontal: 24, paddingBottom: 50 }}>
        <Button title="Continue" onPress={onContinue} />
      </View>

      {/* iOS — bottom-sheet modal with Done/Cancel header. */}
      {Platform.OS === 'ios' && (
        <Modal visible={!!picking} transparent animationType="slide" onRequestClose={() => setPicking(null)}>
          <View style={s.modalBg}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setPicking(null)} />
            <SafeAreaView edges={['bottom']} style={s.sheet}>
              <View style={s.handle} />
              <View style={s.sheetHeader}>
                <Pressable onPress={() => setPicking(null)} hitSlop={10}>
                  <Body style={{ color: COLORS.ink[500] }}>Cancel</Body>
                </Pressable>
                <H3>{picking === 'wake' ? 'Wake up' : 'Bedtime'}</H3>
                <Pressable onPress={confirmIOS} hitSlop={10}>
                  <Body style={{ color: COLORS.sky[600], fontFamily: FONTS.bodySemi }}>Done</Body>
                </Pressable>
              </View>
              <DateTimePicker
                value={pickerDate}
                mode="time"
                display="spinner"
                onChange={onIOSChange}
                themeVariant="light"
                style={{ alignSelf: 'stretch' }}
              />
            </SafeAreaView>
          </View>
        </Modal>
      )}

      {/* Android — uses the native modal dialog directly. */}
      {Platform.OS === 'android' && picking && (
        <DateTimePicker
          value={pickerDate}
          mode="time"
          display="default"
          onChange={onAndroidChange}
        />
      )}
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  icon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: COLORS.sky[50],
    alignItems: 'center', justifyContent: 'center',
  },
  modalBg: { flex: 1, backgroundColor: 'rgba(14,36,51,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12,
    ...SHADOW.lg,
  },
  handle: {
    width: 40, height: 5, borderRadius: 3,
    backgroundColor: COLORS.ink[300],
    alignSelf: 'center', marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 4, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: COLORS.ink[100],
    marginBottom: 4,
  },
});
