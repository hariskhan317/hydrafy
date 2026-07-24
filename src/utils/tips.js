import { TIPS, TIP_MILESTONES } from '../constants/tips';

// Given a list of tip IDs the user has already seen, plus the milestone tier
// being unlocked (25/50/75/100), return one tip ID (preferring unseen, in tier).
export function pickTipForMilestone(tier, seenIds = []) {
  const inTier = TIPS.filter((t) => t.tier === tier);
  if (inTier.length === 0) return null;
  const unseen = inTier.filter((t) => !seenIds.includes(t.id));
  const pool   = unseen.length > 0 ? unseen : inTier;
  const pick   = pool[Math.floor(Math.random() * pool.length)];
  return pick.id;
}

export function getTipById(id) {
  return TIPS.find((t) => t.id === id) || null;
}

// Compare previous and new % to figure out which milestone bands have been
// crossed in this single update. Returns ascending list of tier numbers crossed.
export function milestonesCrossed(prevPct, nextPct) {
  return TIP_MILESTONES.filter((m) => prevPct < m && nextPct >= m);
}
