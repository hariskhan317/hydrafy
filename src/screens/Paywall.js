// Custom Hydrafy-styled paywall. Fetches the "current" RevenueCat offering and
// lets the user buy a package directly (no RevenueCat dashboard paywall needed).
// Presented as a modal — open it with navigation.navigate('Paywall'), or pass
// { unlock: 'SomeRoute' } to jump there after a successful purchase.

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, Linking, Alert, StyleSheet } from 'react-native';

import ScreenShell from '../components/ScreenShell';
import Mascot from '../components/Mascot';
import Button from '../components/Button';
import { H1, H3, Body, BodySm, Caps } from '../components/Text';
import { CloseIcon, CheckIcon } from '../components/Icons';
import { COLORS, FONTS, SHADOW } from '../constants/colors';
import { useStore } from '../state/store';
import { getOffering, purchasePackage, restore } from '../purchases/purchases';
import { LEGAL } from '../purchases/config';

const BENEFITS = [
  'Compare weeks & unlock deep stats',
  'All mascot cosmetics, no streak needed',
  'Priority new features',
  'Support an indie maker 💧',
];

export default function Paywall({ navigation, route }) {
  const setPro = useStore((s) => s.setPro);
  const unlock = route?.params?.unlock;
  const blocking = route?.params?.blocking; // hard paywall: no free tier, can't dismiss

  const [offering, setOffering]   = useState(null);
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [buying, setBuying]       = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const off = await getOffering();
      if (!alive) return;
      setOffering(off);
      // Default to the annual package if present (best value), else the first.
      const pkgs = off?.availablePackages || [];
      const annual = pkgs.find((p) => p.packageType === 'ANNUAL');
      setSelected(annual || pkgs[0] || null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const onSuccess = () => {
    setPro(true);
    // In blocking (hard-paywall) mode the navigator swaps to the app the moment
    // isPro flips, so there's nothing to navigate to here.
    if (blocking) return;
    if (unlock) navigation.replace(unlock);
    else navigation.goBack();
  };

  const buy = async () => {
    if (!selected || buying) return;
    setBuying(true);
    const res = await purchasePackage(selected);
    setBuying(false);
    if (res.ok && res.isPro) onSuccess();
    else if (res.error) Alert.alert('Purchase failed', res.error);
    // res.cancelled → silently do nothing
  };

  const onRestore = async () => {
    setBuying(true);
    const pro = await restore();
    setBuying(false);
    if (pro) onSuccess();
    else Alert.alert('Nothing to restore', "We couldn't find an active subscription on this Apple ID.");
  };

  const pkgs = offering?.availablePackages || [];
  const trial = freeTrialOf(selected);
  const ctaTitle = buying
    ? 'Processing…'
    : trial ? `Start ${trial.label} free trial` : 'Start Hydrafy Pro';

  return (
    <ScreenShell gradient={['#d9eefb', '#f0eefb']} edges={['top', 'left', 'right', 'bottom']}>
      <View style={s.topRow}>
        <View style={{ width: 40 }} />
        <Caps style={{ color: COLORS.sky[600] }}>HYDRAFY PRO</Caps>
        {blocking ? (
          <View style={{ width: 40 }} />
        ) : (
          <Pressable onPress={() => navigation.goBack()} style={s.closeBtn}>
            <CloseIcon color={COLORS.ink[700]} />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <Mascot pct={100} size={132} accessory="crown" />
          <H1 style={{ marginTop: 8, textAlign: 'center' }}>Go Pro</H1>
          <BodySm style={{ textAlign: 'center', marginTop: 4, paddingHorizontal: 30 }}>
            Get the most out of your hydration journey.
          </BodySm>
        </View>

        {/* Benefits */}
        <View style={{ paddingHorizontal: 24, marginTop: 22, gap: 12 }}>
          {BENEFITS.map((b) => (
            <View key={b} style={s.benefitRow}>
              <View style={s.checkDot}><CheckIcon size={14} color="#fff" /></View>
              <Body style={{ flex: 1, color: COLORS.ink[900] }}>{b}</Body>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={{ paddingHorizontal: 18, marginTop: 26, gap: 12 }}>
          {loading ? (
            <ActivityIndicator color={COLORS.sky[500]} style={{ marginVertical: 24 }} />
          ) : pkgs.length === 0 ? (
            <View style={s.empty}>
              <Body style={{ textAlign: 'center', color: COLORS.ink[500] }}>
                Plans aren't available right now. Please check back soon.
              </Body>
            </View>
          ) : (
            pkgs.map((p) => (
              <PlanCard
                key={p.identifier}
                pkg={p}
                packages={pkgs}
                selected={selected?.identifier === p.identifier}
                onSelect={() => setSelected(p)}
              />
            ))
          )}
        </View>

        {/* CTA */}
        {!loading && pkgs.length > 0 && (
          <View style={{ paddingHorizontal: 18, marginTop: 18 }}>
            <Button title={ctaTitle} onPress={buy} disabled={buying || !selected} />
            {trial && selected?.product?.priceString && (
              <BodySm style={{ textAlign: 'center', marginTop: 8 }}>
                {trial.label} free, then {selected.product.priceString}{trialPer(selected)} · cancel anytime
              </BodySm>
            )}
          </View>
        )}

        {/* Dev-only escape hatch so a hard paywall doesn't lock you out while
            building (before the offering/trial is live). Stripped from release builds. */}
        {blocking && __DEV__ && (
          <View style={{ paddingHorizontal: 18, marginTop: 6 }}>
            <Button title="Skip (dev only)" variant="ghost" onPress={() => setPro(true)} />
          </View>
        )}

        {/* Restore + legal */}
        <View style={{ alignItems: 'center', marginTop: 10, paddingHorizontal: 24 }}>
          <Button title="Restore purchases" variant="ghost" onPress={onRestore} disabled={buying} />
          <BodySm style={s.legal}>
            Subscriptions auto-renew until cancelled. Payment is charged to your Apple ID and renews
            unless turned off at least 24h before the period ends. Manage or cancel anytime in your
            App Store account settings.
          </BodySm>
          <View style={s.legalLinks}>
            <Pressable onPress={() => Linking.openURL(LEGAL.terms)}>
              <BodySm style={s.linkText}>Terms</BodySm>
            </Pressable>
            <BodySm style={{ color: COLORS.ink[300] }}>·</BodySm>
            <Pressable onPress={() => Linking.openURL(LEGAL.privacy)}>
              <BodySm style={s.linkText}>Privacy</BodySm>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

// One selectable plan row. Shows price + a "Best value / Save X%" badge on the
// annual plan when both a monthly and annual package are available.
function PlanCard({ pkg, packages, selected, onSelect }) {
  const isAnnual  = pkg.packageType === 'ANNUAL';
  const title =
    isAnnual ? 'Yearly' :
    pkg.packageType === 'MONTHLY' ? 'Monthly' :
    (pkg.product?.title || pkg.identifier);
  const per = isAnnual ? '/ year' : pkg.packageType === 'MONTHLY' ? '/ month' : '';

  // Savings vs paying monthly for a year.
  let badge = null;
  const monthly = packages.find((p) => p.packageType === 'MONTHLY');
  if (isAnnual && monthly?.product?.price && pkg.product?.price) {
    const pct = Math.round((1 - pkg.product.price / (monthly.product.price * 12)) * 100);
    badge = pct > 0 ? `Save ${pct}%` : 'Best value';
  } else if (isAnnual) {
    badge = 'Best value';
  }

  return (
    <Pressable onPress={onSelect} style={[s.plan, selected && s.planOn]}>
      <View style={[s.radio, selected && s.radioOn]}>
        {selected && <View style={s.radioDot} />}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <H3 style={{ fontSize: 16 }}>{title}</H3>
          {badge && (
            <View style={s.badge}><Caps style={{ color: '#fff', fontSize: 10 }}>{badge}</Caps></View>
          )}
        </View>
        {!!pkg.product?.description && (
          <BodySm style={{ marginTop: 2 }}>{pkg.product.description}</BodySm>
        )}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Body style={{ fontFamily: FONTS.display, color: COLORS.ink[900] }}>
          {pkg.product?.priceString}
        </Body>
        {!!per && <BodySm>{per}</BodySm>}
      </View>
    </Pressable>
  );
}

// Reads a package's introductory free trial (configured in App Store Connect /
// RevenueCat as an intro offer). Returns { label } like { label: '3-day' }, or
// null if the package has no free trial.
function freeTrialOf(pkg) {
  const ip = pkg?.product?.introPrice;
  if (!ip || ip.price !== 0) return null;
  const n = ip.periodNumberOfUnits || 0;
  const unit = (ip.periodUnit || '').toLowerCase(); // 'day' | 'week' | 'month' | 'year'
  if (!n || !unit) return { label: 'free' };
  return { label: `${n}-${unit}` };
}

// "/ year" or "/ month" suffix for the post-trial price line.
function trialPer(pkg) {
  if (pkg?.packageType === 'ANNUAL') return '/year';
  if (pkg?.packageType === 'MONTHLY') return '/month';
  return '';
}

const s = StyleSheet.create({
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 8, paddingBottom: 4,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', ...SHADOW.sm,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkDot: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.sky[500],
    alignItems: 'center', justifyContent: 'center',
  },
  empty: {
    backgroundColor: COLORS.surfaceMute, borderRadius: 18, padding: 20,
  },
  plan: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: 18, padding: 16,
    borderWidth: 2, borderColor: 'transparent', ...SHADOW.sm,
  },
  planOn: { borderColor: COLORS.sky[500], ...SHADOW.md },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.ink[300],
    alignItems: 'center', justifyContent: 'center',
  },
  radioOn: { borderColor: COLORS.sky[500] },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.sky[500] },
  badge: {
    backgroundColor: COLORS.coral[400], borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2,
  },
  legal: { textAlign: 'center', color: COLORS.ink[300], fontSize: 11, lineHeight: 16, marginTop: 4 },
  legalLinks: { flexDirection: 'row', gap: 10, marginTop: 8, alignItems: 'center' },
  linkText: { color: COLORS.ink[500], fontFamily: FONTS.bodySemi },
});
