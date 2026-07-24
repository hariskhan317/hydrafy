// Mascot — the Hydrafy droplet ("Drip") ported from the design's SVG.
//
// Why SVG and not Lottie:
//   The shipped design renders the mascot as a parameter-driven SVG that
//   morphs continuously with hydration %. A 5-Lottie swap would *lose* that
//   continuous behaviour. If you later want true Lottie-rendered animations,
//   install lottie-react-native and replace the <Svg> tree below — keep the
//   `pct` / `accessory` / `size` props the same and the rest of the app just
//   works.
//
// Hydration → state buckets:
//   0–25  tired  | 26–60 waking | 61–99 happy
//   100   glow   | 120+  bloated | 150+ bloated_strong

import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, {
  Defs, LinearGradient, RadialGradient, Stop, Path, Ellipse, Circle, G, Rect,
} from 'react-native-svg';

import { stateForPct } from '../utils/mascotState';

const AnimatedView = Animated.createAnimatedComponent(View);

function stateConfig(state) {
  return {
    tired: {
      fillTop: '#cdd9e2', fillBot: '#9eb1be', stroke: '#6e8493',
      eyeOpen: 0.35, mouth: 'frown', blush: false, sweat: false, halo: false,
      sparkles: 0, squish: 0.02, bob: 2,
    },
    waking: {
      fillTop: '#b6dcef', fillBot: '#74b3d4', stroke: '#3c7c9e',
      eyeOpen: 0.7, mouth: 'neutral', blush: true, sweat: false, halo: false,
      sparkles: 0, squish: 0, bob: 3,
    },
    happy: {
      fillTop: '#9fd4ee', fillBot: '#3fa8d6', stroke: '#1d6f99',
      eyeOpen: 1, mouth: 'smile', blush: true, sweat: false, halo: false,
      sparkles: 2, squish: -0.02, bob: 4,
    },
    glow: {
      fillTop: '#b9e6f8', fillBot: '#3fb6e8', stroke: '#0f7aa8',
      eyeOpen: 1, mouth: 'smile-big', blush: true, sweat: false, halo: true,
      sparkles: 5, squish: -0.04, bob: 5,
    },
    bloated: {
      fillTop: '#bcd8e6', fillBot: '#7aa3b8', stroke: '#3e6378',
      eyeOpen: 0.6, mouth: 'queasy', blush: false, sweat: true, halo: false,
      sparkles: 0, squish: 0.08, bob: 1, coralWash: 0.35,
    },
    bloated_strong: {
      fillTop: '#c4cdd3', fillBot: '#85909a', stroke: '#3e4a55',
      eyeOpen: 0.45, mouth: 'queasy-x', blush: false, sweat: true, halo: false,
      sparkles: 0, squish: 0.14, bob: 0, coralWash: 0.6,
    },
  }[state];
}

// Build the droplet body path. `squish` widens or narrows the bell.
function dropletPath(squish = 0) {
  const w = 38 + squish * 30;
  const tipY = 6 - squish * 6;
  const bellY = 64;
  return `M50 ${tipY}
    C ${50 - w * 0.55} ${24 + squish * 4}, ${50 - w} ${42 + squish * 6}, ${50 - w} ${bellY}
    a ${w} ${w * 0.95 + squish * 4} 0 1 0 ${w * 2} 0
    C ${50 + w} ${42 + squish * 6}, ${50 + w * 0.55} ${24 + squish * 4}, 50 ${tipY} Z`;
}

let UID = 0;
function nextId() { return `m${++UID}`; }

export default function Mascot({
  pct = 75,
  size = 220,
  animate = true,
  accessory = null,
  // also accepts cosmetic id via `wornId`/`cosmetic` for convenience
  cosmetic = null,
  wornId = null,
  // optional spark-on-state-change toggle from caller
  pulseKey,
}) {
  const state = stateForPct(pct);
  const cfg = stateConfig(state);
  const acc = accessory ?? cosmetic ?? wornId;
  const uid = useMemo(() => nextId(), []);

  // Idle bob (every render-instance gets its own offset for variety)
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animate || cfg.bob === 0) return undefined;
    const dur = 1700 + (5 - cfg.bob) * 100;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: dur, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animate, cfg.bob, bob]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -cfg.bob] });

  // Pulse on drink-log (caller passes a changing pulseKey).
  const pulse = useRef(new Animated.Value(1)).current;
  const prevKey = useRef(pulseKey);
  useEffect(() => {
    if (pulseKey == null || pulseKey === prevKey.current) return undefined;
    prevKey.current = pulseKey;
    pulse.setValue(1);
    Animated.sequence([
      Animated.spring(pulse, { toValue: 1.12, useNativeDriver: true, friction: 4, tension: 140 }),
      Animated.spring(pulse, { toValue: 1,    useNativeDriver: true, friction: 5, tension: 120 }),
    ]).start();
  }, [pulseKey, pulse]);

  // Idle micro-blink every ~5s for the happy/glow states
  const blink = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animate) return undefined;
    let cancelled = false;
    const schedule = () => {
      if (cancelled) return;
      const delay = 4000 + Math.random() * 2000;
      const t = setTimeout(() => {
        Animated.sequence([
          Animated.timing(blink, { toValue: 1, duration: 80, useNativeDriver: false }),
          Animated.timing(blink, { toValue: 0, duration: 80, useNativeDriver: false }),
        ]).start(schedule);
      }, delay);
      return () => clearTimeout(t);
    };
    const teardown = schedule();
    return () => { cancelled = true; teardown && teardown(); };
  }, [animate, blink]);

  // Eye geometry
  const eyeRY  = 4 * cfg.eyeOpen + 0.5;
  const eyeY   = 52;
  const pupilDy = cfg.eyeOpen > 0.8 ? -0.6 : cfg.eyeOpen < 0.5 ? 1 : 0;

  // For idle-blink we shrink ry briefly (only when eyes are normally open)
  const [animatedRY, setAnimatedRY] = React.useState(eyeRY);
  useEffect(() => {
    const id = blink.addListener(({ value }) => {
      setAnimatedRY(Math.max(0.4, eyeRY * (1 - value * 0.9)));
    });
    return () => blink.removeListener(id);
  }, [eyeRY, blink]);

  return (
    <AnimatedView
      style={{
        width: size,
        height: size * 1.05,
        transform: [{ translateY }, { scale: pulse }],
      }}
      pointerEvents="none"
    >
      <Svg viewBox="0 0 100 105" width={size} height={size * 1.05}>
        <Defs>
          <LinearGradient id={`g-body-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor={cfg.fillTop} />
            <Stop offset="100%" stopColor={cfg.fillBot} />
          </LinearGradient>
          <RadialGradient id={`g-shine-${uid}`} cx="40%" cy="45%" rx="25%" ry="25%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <Stop offset="60%" stopColor="#ffffff" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`g-glow-${uid}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#bff0ff" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#bff0ff" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Halo (glow only) */}
        {cfg.halo && (
          <>
            <Circle cx="50" cy="55" r="55" fill={`url(#g-glow-${uid})`} opacity="0.8" />
            <Circle cx="50" cy="55" r="46" fill="none" stroke="#bff0ff" strokeWidth="0.5" opacity="0.5" />
          </>
        )}

        {/* Drop shadow */}
        <Ellipse cx="50" cy="98" rx={20 + cfg.squish * 20} ry="2.6" fill="rgba(14,36,51,0.18)" />

        {/* Body */}
        <G>
          <Path d={dropletPath(cfg.squish)} fill={`url(#g-body-${uid})`} stroke={cfg.stroke} strokeWidth="1.4" strokeLinejoin="round" />
          {cfg.coralWash > 0 && (
            <Path d={dropletPath(cfg.squish)} fill="#ff8676" opacity={cfg.coralWash * 0.22} />
          )}

          {/* Shine */}
          <Ellipse cx="38" cy="38" rx="11" ry="14" fill={`url(#g-shine-${uid})`} transform="rotate(-15 38 38)" />
          <Ellipse cx="34" cy="32" rx="2.4" ry="3.2" fill="#ffffff" opacity="0.9" transform="rotate(-15 34 32)" />

          {/* Blush */}
          {cfg.blush && (
            <>
              <Ellipse cx="36" cy="60" rx="4" ry="2.3" fill="#ff9aa5" opacity="0.55" />
              <Ellipse cx="64" cy="60" rx="4" ry="2.3" fill="#ff9aa5" opacity="0.55" />
            </>
          )}

          {/* Eyes */}
          <G>
            <Ellipse cx="41" cy={eyeY} rx="2.6" ry={animatedRY} fill={cfg.stroke} />
            <Ellipse cx="59" cy={eyeY} rx="2.6" ry={animatedRY} fill={cfg.stroke} />
            {cfg.eyeOpen > 0.5 && (
              <>
                <Circle cx={41.6} cy={eyeY - 0.6 + pupilDy} r="0.9" fill="#fff" opacity="0.95" />
                <Circle cx={59.6} cy={eyeY - 0.6 + pupilDy} r="0.9" fill="#fff" opacity="0.95" />
              </>
            )}
            {cfg.eyeOpen < 0.5 && (
              <>
                <Path d={`M38 ${eyeY} q 3 1 6 0`} stroke={cfg.stroke} strokeWidth="1.2" fill="none" strokeLinecap="round" />
                <Path d={`M56 ${eyeY} q 3 1 6 0`} stroke={cfg.stroke} strokeWidth="1.2" fill="none" strokeLinecap="round" />
              </>
            )}
          </G>

          {/* Mouth */}
          <MouthPath kind={cfg.mouth} stroke={cfg.stroke} />

          {/* Sweat (bloat) */}
          {cfg.sweat && (
            <G>
              <Path d="M70 40 q 1.5 3 0 5 q -1.5 -2 0 -5 Z" fill="#9ed8f0" stroke="#3f7a98" strokeWidth="0.5" />
              <Path d="M28 44 q 1.2 2.4 0 4 q -1.2 -1.6 0 -4 Z" fill="#9ed8f0" stroke="#3f7a98" strokeWidth="0.5" opacity="0.85" />
            </G>
          )}
        </G>

        {/* Sparkles */}
        {Array.from({ length: cfg.sparkles }).map((_, i) => {
          const positions = [[18, 30], [82, 28], [80, 70], [22, 70], [50, 12]];
          const [x, y] = positions[i % positions.length];
          return (
            <G key={i} transform={`translate(${x} ${y})`}>
              <Path d="M0 -3 L 0.7 -0.7 L 3 0 L 0.7 0.7 L 0 3 L -0.7 0.7 L -3 0 L -0.7 -0.7 Z"
                fill="#fff8c4" stroke="#f5c945" strokeWidth="0.3" />
            </G>
          );
        })}

        {/* Cosmetic accessory */}
        <Accessory id={acc} />
      </Svg>
    </AnimatedView>
  );
}

function MouthPath({ kind, stroke }) {
  const y = 64;
  switch (kind) {
    case 'frown':
      return <Path d={`M45 ${y + 3} Q 50 ${y - 1} 55 ${y + 3}`} stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />;
    case 'neutral':
      return <Path d={`M45.5 ${y + 1.2} L 54.5 ${y + 1.2}`} stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />;
    case 'smile':
      return <Path d={`M45 ${y} Q 50 ${y + 3.4} 55 ${y}`} stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />;
    case 'smile-big':
      return (
        <G>
          <Path d={`M43.5 ${y - 0.5} Q 50 ${y + 5.5} 56.5 ${y - 0.5} Z`} fill={stroke} opacity="0.9" />
          <Path d={`M45 ${y + 2.5} Q 50 ${y + 4} 55 ${y + 2.5}`} stroke="#ff8a98" strokeWidth="1.1" fill="#ff8a98" opacity="0.9" strokeLinecap="round" />
        </G>
      );
    case 'queasy':
      return <Path d={`M44 ${y + 2} q 1.5 -2 3 0 t 3 0 t 3 0 t 3 0`} stroke={stroke} strokeWidth="1.3" fill="none" strokeLinecap="round" />;
    case 'queasy-x':
      return (
        <G>
          <Path d={`M44 ${y + 2.5} q 1.5 -2 3 0 t 3 0 t 3 0 t 3 0`} stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <Path d={`M45.5 ${y - 0.5} l 1.4 1.4 m 0 -1.4 l -1.4 1.4`} stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
          <Path d={`M53.1 ${y - 0.5} l 1.4 1.4 m 0 -1.4 l -1.4 1.4`} stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
        </G>
      );
    default:
      return null;
  }
}

function Accessory({ id }) {
  switch (id) {
    case 'cap':
      return (
        <G>
          <Ellipse cx="50" cy="14" rx="16" ry="3" fill="#1d6f99" />
          <Path d="M34 14 q 16 -16 32 0 Z" fill="#1d6f99" />
          <Path d="M50 8 q 12 -4 16 6" stroke="#fff" strokeWidth="0.7" fill="none" />
        </G>
      );
    case 'flower':
      return (
        <G transform="translate(70 18)">
          <Circle r="3" fill="#ff8a98" />
          <Circle cx="-3.5" r="2.4" fill="#ff8a98" />
          <Circle cx="3.5"  r="2.4" fill="#ff8a98" />
          <Circle cy="-3.5" r="2.4" fill="#ff8a98" />
          <Circle cy="3.5"  r="2.4" fill="#ff8a98" />
          <Circle r="1.3" fill="#fff5b6" />
        </G>
      );
    case 'scarf':
      return (
        <G>
          <Path d="M30 78 q 20 8 40 0 l 2 6 q -22 8 -44 0 Z" fill="#ff7a6b" stroke="#b54737" strokeWidth="0.6" />
          <Path d="M66 84 l 4 8 l 6 -1 l -3 -8 Z" fill="#ff7a6b" stroke="#b54737" strokeWidth="0.6" />
        </G>
      );
    case 'crown':
      return (
        <G transform="translate(50 12)">
          <Path d="M -12 0 L -8 -8 L -4 -2 L 0 -10 L 4 -2 L 8 -8 L 12 0 Z" fill="#ffd24a" stroke="#a17b14" strokeWidth="0.6" strokeLinejoin="round" />
          <Circle r="1" cx="0" cy="-6" fill="#ff7a6b" />
        </G>
      );
    case 'shades':
      return (
        <G>
          <Rect x="32" y="49" width="14" height="8" rx="2" fill="#0e2433" />
          <Rect x="54" y="49" width="14" height="8" rx="2" fill="#0e2433" />
          <Path d="M46 53 L 54 53" stroke="#0e2433" strokeWidth="1.2" />
          <Rect x="34" y="50" width="4" height="2" rx="1" fill="#fff" opacity="0.5" />
          <Rect x="56" y="50" width="4" height="2" rx="1" fill="#fff" opacity="0.5" />
        </G>
      );
    default:
      return null;
  }
}
