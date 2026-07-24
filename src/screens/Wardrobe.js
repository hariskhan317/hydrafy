import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import ScreenShell from '../components/ScreenShell';
import Mascot from '../components/Mascot';
import Button from '../components/Button';
import { H2, H3, Body, BodySm } from '../components/Text';
import { CloseIcon, LockIcon } from '../components/Icons';
import { COLORS, SHADOW, FONTS } from '../constants/colors';
import { COSMETICS } from '../constants/cosmetics';
import { useStore } from '../state/store';

export default function Wardrobe({ navigation }) {
  const cosmetics    = useStore((s) => s.cosmetics);
  const wearCosmetic = useStore((s) => s.wearCosmetic);
  const name         = useStore((s) => s.profile.name);
  const [pick, setPick] = useState(cosmetics.wornId);

  const save = async () => {
    await wearCosmetic(pick);
    navigation.goBack();
  };

  const reset = () => setPick(null);

  const items = [{ id: null, label: 'None', unlockDays: 0 }, ...COSMETICS];
  const currentLabel = items.find((c) => c.id === pick)?.label || 'Nothing';

  return (
    <ScreenShell gradient={['#f4ecfb', '#f6fbfd']}>
      <View style={s.topRow}>
        <H2>{name}'s wardrobe</H2>
        <Pressable onPress={() => navigation.goBack()} style={s.closeBtn}>
          <CloseIcon color={COLORS.ink[700]} />
        </Pressable>
      </View>
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <View style={s.stage}>
          <Mascot pct={95} size={210} accessory={pick} />
        </View>
      </View>
      <View style={{ alignItems: 'center', marginTop: 14 }}>
        <H3 style={{ fontSize: 16 }}>Wearing: {currentLabel}</H3>
        <BodySm>Try on anything you've unlocked.</BodySm>
      </View>
      <View style={{ paddingHorizontal: 18, marginTop: 22 }}>
        <View style={s.grid}>
          {items.map((c) => {
            const unlocked = c.id == null || cosmetics.ownedIds.includes(c.id);
            const on = pick === c.id;
            return (
              <Pressable
                key={c.id || 'none'}
                disabled={!unlocked}
                onPress={() => setPick(c.id)}
                style={[s.tile, on && s.tileOn, !unlocked && { opacity: 0.6 }]}
              >
                <View style={s.tileMascot}>
                  <Mascot pct={85} size={56} animate={false} accessory={c.id} />
                </View>
                {!unlocked && (
                  <View style={s.lockBadge}><LockIcon size={12} color="#fff" /></View>
                )}
                <Body style={{ fontFamily: FONTS.bodySemi, fontSize: 12, marginTop: 4 }}>{c.label}</Body>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <Button title="Reset" variant="secondary" full={false} style={{ flex: 1 }} onPress={reset} />
          <Button title="Save look" full={false} style={{ flex: 2 }} onPress={save} />
        </View>
      </View>
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 16,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', ...SHADOW.sm,
  },
  stage: {
    width: 240, height: 240, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    width: '23%',
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 8, alignItems: 'center',
    ...SHADOW.sm,
  },
  tileOn: {
    borderWidth: 2, borderColor: COLORS.sky[500],
    ...SHADOW.md,
  },
  tileMascot: { height: 60, alignItems: 'center', justifyContent: 'center' },
  lockBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.ink[900],
    alignItems: 'center', justifyContent: 'center',
  },
});
