import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys + shapes
//   @hydrafy/profile      → { weightKg, weightUnit, activity, climate, wakeTime, sleepTime, name, createdAt }
//   @hydrafy/settings     → { goalMl, displayUnit, remindersOn, pausedUntil, lastResetCheck }
//   @hydrafy/log/<YYYY-MM-DD>
//                         → { date, entries:[{ id, ts, ml, kind }], totalMl, goalMl, pct, unlockedTierIdsToday:[], lastWarnedAt }
//   @hydrafy/history      → { days: { 'YYYY-MM-DD': { totalMl, goalMl, pct, mascotState } } }  (rolling 30-day cache)
//   @hydrafy/streak       → { current, longest, lastHitDate }
//   @hydrafy/cosmetics    → { ownedIds:[], wornId|null }
//   @hydrafy/tipsSeen     → [tipId, ...]
//   @hydrafy/onboarded    → 'true' | null

const K = {
  profile:    '@hydrafy/profile',
  settings:   '@hydrafy/settings',
  log:        (date) => `@hydrafy/log/${date}`,
  history:    '@hydrafy/history',
  streak:     '@hydrafy/streak',
  cosmetics:  '@hydrafy/cosmetics',
  tipsSeen:   '@hydrafy/tipsSeen',
  onboarded:  '@hydrafy/onboarded',
};

async function getJSON(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function setJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

async function remove(key) {
  try { await AsyncStorage.removeItem(key); } catch {}
}

export const Storage = {
  // Profile
  getProfile:  ()    => getJSON(K.profile),
  saveProfile: (p)   => setJSON(K.profile, p),

  // Settings
  getSettings:  ()   => getJSON(K.settings, {
    goalMl: 2400,
    displayUnit: 'ml',
    remindersOn: true,
    pausedUntil: null,
  }),
  saveSettings: (s)  => setJSON(K.settings, s),

  // Today's log
  getLog:  (date)    => getJSON(K.log(date), null),
  saveLog: (date, l) => setJSON(K.log(date), l),

  // History (rolling cache, used for weekly/comparison views)
  getHistory:  ()    => getJSON(K.history, { days: {} }),
  saveHistory: (h)   => setJSON(K.history, h),

  // Streak
  getStreak:  ()     => getJSON(K.streak, { current: 0, longest: 0, lastHitDate: null }),
  saveStreak: (s)    => setJSON(K.streak, s),

  // Cosmetics
  getCosmetics:  ()  => getJSON(K.cosmetics, { ownedIds: [], wornId: null }),
  saveCosmetics: (c) => setJSON(K.cosmetics, c),

  // Tips seen (across all days)
  getTipsSeen:  ()    => getJSON(K.tipsSeen, []),
  saveTipsSeen: (a)   => setJSON(K.tipsSeen, a),

  // Onboarding flag
  isOnboarded:    async () => (await AsyncStorage.getItem(K.onboarded)) === 'true',
  setOnboarded:   ()   => AsyncStorage.setItem(K.onboarded, 'true'),

  // Wipe everything
  async resetAll() {
    const keys = await AsyncStorage.getAllKeys();
    const ours = keys.filter((k) => k.startsWith('@hydrafy/'));
    if (ours.length) await AsyncStorage.multiRemove(ours);
  },
};

export { K as STORAGE_KEYS };
