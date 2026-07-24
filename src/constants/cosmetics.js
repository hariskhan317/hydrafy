// Cosmetic items shown on the mascot. Each accessory id is recognized by the
// Mascot component. unlockDays gates them behind streak milestones.
export const COSMETICS = [
  { id: 'flower', label: 'Petal',  unlockDays: 3  },
  { id: 'scarf',  label: 'Scarf',  unlockDays: 7  },
  { id: 'cap',    label: 'Cap',    unlockDays: 14 },
  { id: 'crown',  label: 'Crown',  unlockDays: 30 },
  { id: 'shades', label: 'Shades', unlockDays: 60 },
];

export const STREAK_MILESTONES = COSMETICS.map((c) => c.unlockDays);
