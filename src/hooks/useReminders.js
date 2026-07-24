// Schedules local notifications between wake and sleep, spaced ~90 min apart.
// Re-runs whenever the relevant inputs change. Cancels everything if the user
// pauses, disables, or hits 100% (autoCancelWhenAhead).
//
// Notification copy is selected from three tone buckets:
//   behind   — currently below expected pace
//   ontrack  — within tolerance of pace
//   ahead    — already at goal
//
// We compute "expected" naively as a linear ramp from wake → sleep.

import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useStore } from '../state/store';
import { hhmmToMinutes } from '../utils/date';

const COPY = {
  behind: [
    { title: 'Time for a sip?',     body: '{name} is getting drowsy — a glass would help.' },
    { title: 'Hydration check ☕',   body: 'You\'re behind pace. Even a sip is a win.' },
    { title: 'Lil reminder',        body: '{name} is yawning. Refill that bottle?' },
  ],
  ontrack: [
    { title: 'Looking steady',      body: '{name} is happy. Keep the sips coming.' },
    { title: 'On pace · 💧',         body: 'Right where you should be. Tiny sip = compound interest.' },
    { title: 'Hi 👋',                body: '{name} suggests a quick sip while you read this.' },
  ],
  ahead: [
    { title: 'Goal hit! 🎉',         body: 'You poured your way to 100%. {name} is glowing.' },
    { title: 'Easy with the refills', body: '{name} is shining — no need to push past today.' },
  ],
};

export default function useReminders() {
  const profile  = useStore((s) => s.profile);
  const settings = useStore((s) => s.settings);
  const todayLog = useStore((s) => s.todayLog);

  useEffect(() => {
    let cancelled = false;

    async function reschedule() {
      try { await Notifications.cancelAllScheduledNotificationsAsync(); } catch {}
      if (cancelled) return;

      const paused = settings.pausedUntil && new Date(settings.pausedUntil) > new Date();
      if (!settings.remindersOn || paused) return;

      const wakeM  = hhmmToMinutes(profile.wakeTime  || '07:00');
      const sleepM = hhmmToMinutes(profile.sleepTime || '23:30');
      if (sleepM <= wakeM + 90) return;

      const intervalM = 90;
      const slots = [];
      for (let m = wakeM + 60; m <= sleepM - 30; m += intervalM) slots.push(m);

      const now      = new Date();
      const todayMin = now.getHours() * 60 + now.getMinutes();
      const hitGoal  = (todayLog?.pct ?? 0) >= 100;

      for (const m of slots) {
        if (m <= todayMin) continue;       // already passed
        if (hitGoal) continue;             // auto-cancel-when-ahead behaviour

        const fire = new Date();
        fire.setHours(Math.floor(m / 60), m % 60, 0, 0);

        const tone = hitGoal ? 'ahead' :
          isBehind(m, wakeM, sleepM, settings.goalMl, todayLog?.totalMl ?? 0) ? 'behind' : 'ontrack';
        const pick = pickRandom(COPY[tone]);
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: pick.title,
              body:  pick.body.replace(/\{name\}/g, profile.name || 'Drip'),
              sound: false,
            },
            // SDK 52+ trigger format: tag the shape with `type: 'date'`.
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fire },
          });
        } catch {}
      }
    }

    reschedule();
    return () => { cancelled = true; };
  }, [
    profile.wakeTime, profile.sleepTime, profile.name,
    settings.remindersOn, settings.pausedUntil, settings.goalMl,
    todayLog?.pct, todayLog?.totalMl,
  ]);
}

function isBehind(minuteOfDay, wakeM, sleepM, goalMl, totalMl) {
  const fraction = Math.max(0, Math.min(1, (minuteOfDay - wakeM) / (sleepM - wakeM)));
  const expected = goalMl * fraction * 0.9; // slight buffer
  return totalMl < expected;
}

function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
