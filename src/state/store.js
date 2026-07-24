import { create } from 'zustand';
import { Storage } from '../storage/storage';
import { computeGoal } from '../utils/goal';
import { todayKey, lastNDays } from '../utils/date';
import { stateForPct } from '../utils/mascotState';
import { milestonesCrossed, pickTipForMilestone } from '../utils/tips';
import { STREAK_MILESTONES, COSMETICS } from '../constants/cosmetics';

// Zustand store — single source of truth for app state.
// Persistence is manual (per-slice) so we keep AsyncStorage shape stable and
// don't blow away unrelated keys on schema bumps.

const DEFAULT_PROFILE = {
  name: 'Drip',
  weightKg: 68,
  weightUnit: 'kg',
  activity: 'med',
  climate: 'mod',
  wakeTime: '07:00',
  sleepTime: '23:30',
  createdAt: null,
};

function emptyLog(date, goalMl) {
  return { date, entries: [], totalMl: 0, goalMl, pct: 0, unlockedTipsToday: [], pausedReason: null };
}

export const useStore = create((set, get) => ({
  ready: false,

  profile:   DEFAULT_PROFILE,
  settings:  { goalMl: 2400, displayUnit: 'ml', remindersOn: true, pausedUntil: null },
  todayLog:  emptyLog(todayKey(), 2400),
  history:   { days: {} },
  streak:    { current: 0, longest: 0, lastHitDate: null },
  cosmetics: { ownedIds: [], wornId: null },
  tipsSeen:  [],
  pendingTipId: null,       // tip waiting to be shown via TipUnlock screen
  pendingWarning: null,     // '120' | '150' | null — over-hydration banner
  lastLog: null,            // { ml, key } — drives the floating-bubble animation
  isPro: false,             // RevenueCat 'pro' entitlement; synced from App.js
  proReady: false,          // true once RevenueCat has reported entitlement state at least once

  // Set by the RevenueCat listener in App.js on launch + every entitlement change.
  setPro(isPro) {
    set({ isPro: !!isPro, proReady: true });
  },

  // ── HYDRATION ────────────────────────────────────────────────────────
  async hydrate() {
    const [profile, settings, history, streak, cosmetics, tipsSeen, onboarded] = await Promise.all([
      Storage.getProfile(),
      Storage.getSettings(),
      Storage.getHistory(),
      Storage.getStreak(),
      Storage.getCosmetics(),
      Storage.getTipsSeen(),
      Storage.isOnboarded(),
    ]);
    const goalMl   = settings?.goalMl ?? 2400;
    const today    = todayKey();
    const todayLog = (await Storage.getLog(today)) || emptyLog(today, goalMl);

    set({
      ready: true,
      profile: profile || DEFAULT_PROFILE,
      settings: settings || { goalMl, displayUnit: 'ml', remindersOn: true, pausedUntil: null },
      todayLog,
      history: history || { days: {} },
      streak: streak || { current: 0, longest: 0, lastHitDate: null },
      cosmetics: cosmetics || { ownedIds: [], wornId: null },
      tipsSeen: tipsSeen || [],
      onboarded: !!onboarded,
    });
  },

  // ── ONBOARDING ───────────────────────────────────────────────────────
  onboarded: false,
  setOnboardingDraft(patch) {
    set((s) => ({ profile: { ...s.profile, ...patch } }));
  },
  async completeOnboarding() {
    const { profile } = get();
    const finalProfile = { ...profile, createdAt: new Date().toISOString() };
    const goalMl = computeGoal({
      weightKg: finalProfile.weightKg,
      activity: finalProfile.activity,
      climate:  finalProfile.climate,
    });
    const settings = { ...get().settings, goalMl };
    const today = todayKey();
    const log = emptyLog(today, goalMl);

    await Promise.all([
      Storage.saveProfile(finalProfile),
      Storage.saveSettings(settings),
      Storage.saveLog(today, log),
      Storage.setOnboarded(),
    ]);
    set({ profile: finalProfile, settings, todayLog: log, onboarded: true });
  },

  // ── LOGGING ──────────────────────────────────────────────────────────
  async logDrink(ml, kind = 'glass') {
    if (!ml || ml <= 0) return;
    const { todayLog, settings, tipsSeen } = get();
    const prevPct = todayLog.pct;
    const entry   = { id: `${Date.now()}`, ts: new Date().toISOString(), ml, kind };
    const totalMl = todayLog.totalMl + ml;
    const pct     = Math.round((totalMl / settings.goalMl) * 1000) / 10;

    // Determine if we crossed any 25/50/75/100 boundaries.
    const tiers = milestonesCrossed(prevPct, pct).filter(
      (t) => !todayLog.unlockedTipsToday.includes(t)
    );
    let unlockedTipsToday = [...todayLog.unlockedTipsToday];
    let pendingTipId      = get().pendingTipId;
    const newSeen         = [...tipsSeen];

    for (const tier of tiers) {
      const tipId = pickTipForMilestone(tier, newSeen);
      if (tipId != null) {
        unlockedTipsToday.push(tier);
        newSeen.push(tipId);
        // Only the first un-shown tip per logDrink call surfaces immediately.
        if (pendingTipId == null) pendingTipId = tipId;
      }
    }

    const updated = { ...todayLog, totalMl, pct, entries: [...todayLog.entries, entry], unlockedTipsToday };

    // Streak: counts when crossing 100% in this very call.
    let streak = get().streak;
    if (prevPct < 100 && pct >= 100) {
      streak = bumpStreak(streak);
      maybeUnlockCosmetic(streak.current, get, set);
    }

    // Over-hydration banner fires once per upward crossing.
    let pendingWarning = get().pendingWarning;
    if (prevPct < 150 && pct >= 150)      pendingWarning = '150';
    else if (prevPct < 120 && pct >= 120) pendingWarning = '120';

    set({
      todayLog: updated,
      tipsSeen: newSeen,
      pendingTipId,
      streak,
      pendingWarning,
      lastLog: { ml, key: Date.now() },
    });

    await Promise.all([
      Storage.saveLog(updated.date, updated),
      Storage.saveTipsSeen(newSeen),
      Storage.saveStreak(streak),
    ]);
    cacheDayInHistory(updated, get, set);
  },

  async removeEntry(entryId) {
    const { todayLog, settings } = get();
    const entries = todayLog.entries.filter((e) => e.id !== entryId);
    const totalMl = entries.reduce((s, e) => s + e.ml, 0);
    const pct     = Math.round((totalMl / settings.goalMl) * 1000) / 10;
    const updated = { ...todayLog, entries, totalMl, pct };
    set({ todayLog: updated });
    await Storage.saveLog(updated.date, updated);
    cacheDayInHistory(updated, get, set);
  },

  consumePendingTip() {
    set({ pendingTipId: null });
  },
  consumePendingWarning() {
    set({ pendingWarning: null });
  },

  // ── SETTINGS ─────────────────────────────────────────────────────────
  async updateSettings(patch) {
    const settings = { ...get().settings, ...patch };
    set({ settings });
    await Storage.saveSettings(settings);

    // If goal changed, recompute today's pct.
    if (patch.goalMl != null) {
      const { todayLog } = get();
      const pct = Math.round((todayLog.totalMl / patch.goalMl) * 1000) / 10;
      const updated = { ...todayLog, goalMl: patch.goalMl, pct };
      set({ todayLog: updated });
      await Storage.saveLog(updated.date, updated);
    }
  },

  async updateProfile(patch) {
    const profile = { ...get().profile, ...patch };
    set({ profile });
    await Storage.saveProfile(profile);

    // If any goal-affecting field changed, recompute goal.
    if (['weightKg', 'activity', 'climate'].some((k) => k in patch)) {
      const goalMl = computeGoal(profile);
      await get().updateSettings({ goalMl });
    }
  },

  // ── COSMETICS ────────────────────────────────────────────────────────
  async wearCosmetic(id) {
    const cosmetics = { ...get().cosmetics, wornId: id };
    set({ cosmetics });
    await Storage.saveCosmetics(cosmetics);
  },

  // ── RESET ────────────────────────────────────────────────────────────
  async resetAll() {
    await Storage.resetAll();
    set({
      profile: DEFAULT_PROFILE,
      settings: { goalMl: 2400, displayUnit: 'ml', remindersOn: true, pausedUntil: null },
      todayLog: emptyLog(todayKey(), 2400),
      history: { days: {} },
      streak: { current: 0, longest: 0, lastHitDate: null },
      cosmetics: { ownedIds: [], wornId: null },
      tipsSeen: [],
      pendingTipId: null,
      onboarded: false,
    });
  },
}));

// Pure helpers (kept outside the store so they can be unit-tested easily).
function bumpStreak(streak) {
  const today = todayKey();
  if (streak.lastHitDate === today) return streak;
  // If yesterday wasn't a hit, the streak resets to 1, else it grows.
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yKey = y.toISOString().slice(0, 10);
  const next = streak.lastHitDate === yKey ? streak.current + 1 : 1;
  return {
    current: next,
    longest: Math.max(next, streak.longest || 0),
    lastHitDate: today,
  };
}

function maybeUnlockCosmetic(streakDays, get, set) {
  const { cosmetics } = get();
  const earned = COSMETICS.filter((c) => streakDays >= c.unlockDays).map((c) => c.id);
  const merged = Array.from(new Set([...cosmetics.ownedIds, ...earned]));
  if (merged.length !== cosmetics.ownedIds.length) {
    const next = { ...cosmetics, ownedIds: merged };
    set({ cosmetics: next });
    Storage.saveCosmetics(next).catch(() => {});
  }
}

function cacheDayInHistory(log, get, set) {
  const days = { ...(get().history.days || {}) };
  days[log.date] = {
    totalMl: log.totalMl,
    goalMl:  log.goalMl,
    pct:     log.pct,
    mascotState: stateForPct(log.pct),
  };
  // Trim to last 60 days
  const keepKeys = lastNDays(60);
  const trimmed = {};
  for (const k of keepKeys) if (days[k]) trimmed[k] = days[k];
  // Also keep today's full data even if not in keepKeys (always is, defensively)
  if (!trimmed[log.date]) trimmed[log.date] = days[log.date];
  const next = { days: trimmed };
  set({ history: next });
  Storage.saveHistory(next).catch(() => {});
}
