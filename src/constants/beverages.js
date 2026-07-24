// Beverage catalog. `factor` is the hydration factor: how much of the drunk
// volume counts toward the daily water goal (500 ml coffee × 0.85 → 425 ml).
// Factors are rough consensus values from beverage-hydration research —
// caffeinated/sugary drinks hydrate less per ml, but never count as zero.

export const BEVERAGES = [
  { id: 'water',     label: 'Water',     emoji: '💧', factor: 1.0  },
  { id: 'sparkling', label: 'Sparkling', emoji: '🫧', factor: 1.0  },
  { id: 'tea',       label: 'Tea',       emoji: '🍵', factor: 0.95 },
  { id: 'coffee',    label: 'Coffee',    emoji: '☕', factor: 0.85 },
  { id: 'milk',      label: 'Milk',      emoji: '🥛', factor: 1.0  },
  { id: 'juice',     label: 'Juice',     emoji: '🧃', factor: 0.85 },
  { id: 'soda',      label: 'Soda',      emoji: '🥤', factor: 0.7  },
];

// Legacy entry kinds ('glass', 'bottle', 'custom') and unknown ids are water.
export function beverageById(id) {
  return BEVERAGES.find((b) => b.id === id) || BEVERAGES[0];
}

// Water-equivalent volume for a drink, rounded to the nearest ml.
export function waterEquivalent(ml, beverageId) {
  return Math.round(ml * beverageById(beverageId).factor);
}
