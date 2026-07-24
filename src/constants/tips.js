// 30 hydration / skin / health tips. Each tip carries a tier; tiers determine
// the milestone at which the tip can unlock (25 / 50 / 75 / 100 % of goal).
// `tipSelector` in utils/tips.js picks a fresh tip per milestone per day.

export const TIPS = [
  { id: 1,  tier: 25,  title: 'Start with a glass before coffee.',     body: 'Sleep dries you out. 250 ml of water on waking jump-starts metabolism and hydrates faster than caffeine.' },
  { id: 2,  tier: 25,  title: 'Pale lemonade is the color you want.',   body: 'Urine that is pale yellow says hydrated. Dark amber says drink up.' },
  { id: 3,  tier: 25,  title: 'Thirst lags behind dehydration.',         body: 'By the time you feel thirsty you may already be 1–2% down. Sip steadily instead of chugging.' },
  { id: 4,  tier: 25,  title: 'Pair water with every coffee.',           body: 'Caffeine is a mild diuretic. Match cups 1:1 to stay even.' },
  { id: 5,  tier: 25,  title: 'Cold water hydrates faster.',             body: 'Your stomach empties cold liquids quicker, so they reach circulation sooner.' },
  { id: 6,  tier: 25,  title: 'Keep a bottle in your eye-line.',         body: 'Out of sight, out of sips. Visual cues are the single best behavior nudge.' },
  { id: 7,  tier: 25,  title: 'Mornings are critical.',                  body: 'Front-load 30–40% of your goal before noon and the rest of the day gets easy.' },

  { id: 8,  tier: 50,  title: 'Hydration plumps your skin.',             body: 'Studies link adequate water intake to improved skin elasticity within 2–4 weeks.' },
  { id: 9,  tier: 50,  title: 'Water sharpens focus.',                   body: 'A 1% dip in hydration measurably reduces concentration and short-term memory.' },
  { id: 10, tier: 50,  title: 'You eat water too.',                      body: 'Cucumbers, watermelon, lettuce, and oranges are 90%+ water. They count.' },
  { id: 11, tier: 50,  title: 'Hydration smooths headaches.',            body: 'About one in three migraine sufferers can trace triggers to mild dehydration.' },
  { id: 12, tier: 50,  title: 'Salt belongs in the equation.',           body: 'Long workouts? A pinch of salt with electrolytes helps water actually stay in.' },
  { id: 13, tier: 50,  title: 'Sip, do not gulp.',                       body: 'Slow sips give your kidneys time to keep up. Chugging just flushes through.' },
  { id: 14, tier: 50,  title: 'Lemon is optional, kind of nice.',        body: 'A wedge of lemon adds vitamin C and a flavor cue that helps you drink more.' },
  { id: 15, tier: 50,  title: 'Workouts: pre-load.',                     body: 'Drink 400–500 ml about 2 hours before exercise — your performance will thank you.' },

  { id: 16, tier: 75,  title: 'You are 60% water.',                      body: 'Every cell needs it for chemistry, temperature, joint cushioning, the works.' },
  { id: 17, tier: 75,  title: 'Sleep on it — hydrated.',                 body: 'Hydration in the evening (not too late) supports overnight cellular repair.' },
  { id: 18, tier: 75,  title: 'Bedtime cutoff: 90 minutes.',             body: 'Stop big drinks 90 min before sleep to avoid 3am wake-ups.' },
  { id: 19, tier: 75,  title: 'Travel doubles your needs.',              body: 'Plane cabin air sits around 10% humidity. Drink an extra 250 ml per flight hour.' },
  { id: 20, tier: 75,  title: 'Alcohol is a thirsty friend.',            body: 'A glass of water between drinks halves the next-morning headache.' },
  { id: 21, tier: 75,  title: 'Hot showers wick water.',                 body: 'Long, hot showers dehydrate skin. Follow with a glass and a moisturizer.' },
  { id: 22, tier: 75,  title: 'Tea counts (mostly).',                    body: 'Herbal teas are nearly all water. Strong black tea less so, but still net positive.' },
  { id: 23, tier: 75,  title: 'Crave sweets? Try water first.',          body: 'Your brain confuses thirst for sugar cravings about 60% of the time.' },

  { id: 24, tier: 100, title: 'Glowing buddy, glowing you.',             body: 'Hitting your goal daily for two weeks is when most people notice clearer skin and steadier energy.' },
  { id: 25, tier: 100, title: 'Hydration helps mood.',                   body: 'Even mild dehydration is linked to lower mood and more fatigue. Today, you ate the cue.' },
  { id: 26, tier: 100, title: 'Goal is a floor, not a ceiling.',         body: 'On hot or active days you may need more. Listen to thirst and pee color over apps.' },
  { id: 27, tier: 100, title: 'Maintenance beats catch-up.',             body: 'Daily consistency outperforms one heroic 3L day. You are doing the consistency thing.' },
  { id: 28, tier: 100, title: 'Bonus: water helps digestion.',           body: 'Adequate hydration keeps things moving, literally — fiber needs water to do its job.' },
  { id: 29, tier: 100, title: 'You inspired your buddy today.',          body: 'Reaching 100% changes the mascot animation. Tomorrow it resets and we go again.' },
  { id: 30, tier: 100, title: 'Hydration compounds.',                    body: 'The benefits stack: skin, focus, mood, joints. Small daily sip > rare big effort.' },
];

export const TIP_MILESTONES = [25, 50, 75, 100];
