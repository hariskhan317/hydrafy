// Map hydration % → mascot state name. Mirrors the design's stateForPct().
export function stateForPct(pct) {
  if (pct >= 150) return 'bloated_strong';
  if (pct >= 120) return 'bloated';
  if (pct >= 100) return 'glow';
  if (pct >=  61) return 'happy';
  if (pct >=  26) return 'waking';
  return 'tired';
}

export const STATE_LABEL = {
  tired:           'tired',
  waking:          'waking',
  happy:           'happy',
  glow:            'glowing',
  bloated:         'bloated',
  bloated_strong:  'overhydrated',
};
