import {
  format,
  startOfDay,
  subDays,
  parseISO,
  isSameDay,
  differenceInCalendarDays,
} from 'date-fns';

export const DATE_KEY = (d = new Date()) => format(d, 'yyyy-MM-dd');

export function todayKey() { return DATE_KEY(new Date()); }
export function yesterdayKey() { return DATE_KEY(subDays(new Date(), 1)); }

export function lastNDays(n) {
  const out = [];
  const today = startOfDay(new Date());
  for (let i = n - 1; i >= 0; i--) {
    out.push(DATE_KEY(subDays(today, i)));
  }
  return out;
}

export function lastNDayMeta(n) {
  return lastNDays(n).map((dateKey) => {
    const d = parseISO(dateKey);
    return {
      key:   dateKey,
      label: format(d, 'EEE'),       // Mon, Tue …
      short: format(d, 'd'),         // 11
      full:  format(d, 'EEE · LLL d'),
    };
  });
}

export function isToday(dateKey) {
  return isSameDay(parseISO(dateKey), new Date());
}

export function daysBetween(a, b) {
  return Math.abs(differenceInCalendarDays(parseISO(a), parseISO(b)));
}

// Build "HH:mm" → minutes since midnight (used for reminder window math).
export function hhmmToMinutes(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function minutesToHhmm(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatTime(date) {
  return format(date, 'h:mm a').toLowerCase(); // "8:14 am"
}

export function formatHeaderDate(date = new Date()) {
  return format(date, 'EEE · LLL d');           // "Mon · Nov 11"
}
