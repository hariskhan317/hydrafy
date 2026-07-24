// Goal calculation — derived from the design's example math:
//   base = weightKg × 33 ml
//   activity:  low 0 | medium +10% | high +20%
//   climate:   cool 0 | moderate 0 | hot +10%
//   ceiling:   3500 ml (more isn't better)
//
// Note: original product brief used 35 ml/kg and 4000 ceiling. We use the
// design's numbers because the goal-reveal screen shows them explicitly.

export const ML_PER_KG          = 33;
export const ACTIVITY_BOOST     = { low: 0,    med: 0.10, high: 0.20 };
export const CLIMATE_BOOST      = { cool: 0,   mod: 0.0,  hot:  0.10 };
export const GOAL_CEILING_ML    = 3500;
export const GOAL_FLOOR_ML      = 1000;
export const LBS_PER_KG         = 2.20462;
export const OZ_PER_ML          = 0.033814;

export function lbsToKg(lbs) { return lbs / LBS_PER_KG; }
export function kgToLbs(kg)  { return kg * LBS_PER_KG; }
export function mlToOz(ml)   { return ml * OZ_PER_ML; }
export function ozToMl(oz)   { return oz / OZ_PER_ML; }

export function computeGoal({ weightKg, activity = 'med', climate = 'mod' }) {
  if (!weightKg) return 2000;
  const base       = weightKg * ML_PER_KG;
  const actBoost   = base * (ACTIVITY_BOOST[activity] ?? 0);
  const climBoost  = base * (CLIMATE_BOOST[climate]   ?? 0);
  const raw        = base + actBoost + climBoost;
  const capped     = Math.min(GOAL_CEILING_ML, Math.max(GOAL_FLOOR_ML, raw));
  return Math.round(capped / 10) * 10;
}

export function goalBreakdown({ weightKg, activity = 'med', climate = 'mod' }) {
  const base      = Math.round(weightKg * ML_PER_KG);
  const actBoost  = Math.round(base * (ACTIVITY_BOOST[activity] ?? 0));
  const climBoost = Math.round(base * (CLIMATE_BOOST[climate]   ?? 0));
  const total     = computeGoal({ weightKg, activity, climate });
  return { base, actBoost, climBoost, total };
}

// Format helpers shared between Home / Settings / History
export function formatVolume(ml, unit = 'ml') {
  if (unit === 'oz') return `${Math.round(mlToOz(ml))} oz`;
  return `${Math.round(ml).toLocaleString()} ml`;
}

export function formatWeight(kg, unit = 'kg') {
  if (unit === 'lbs') return `${Math.round(kgToLbs(kg))} lbs`;
  return `${Math.round(kg)} kg`;
}
