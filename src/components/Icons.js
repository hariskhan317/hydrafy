// Stroke-style icons matching the design (22px @ 1.8 stroke, rounded).
import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const make = (paths, opts = {}) => function Icon({ size = 22, color = '#0e2433', strokeWidth = 1.8 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      {paths({ stroke: color, strokeWidth, fill: opts.fill ?? 'none' })}
    </Svg>
  );
};

export const BackIcon = make(({ stroke, strokeWidth }) => (
  <Path d="M14 5l-6 6 6 6" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
));
export const CloseIcon = make(({ stroke }) => (
  <Path d="M5 5l12 12M17 5L5 17" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
));
export const PlusIcon = make(({ stroke }) => (
  <Path d="M11 4v14M4 11h14" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" />
));
export const DropIcon = make(({ stroke, strokeWidth }) => (
  <Path d="M11 3 C 6 9, 5 12, 5 14 a6 6 0 0 0 12 0 c 0 -2 -1 -5 -6 -11 Z"
        stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
));
export const BoltIcon = make(({ stroke, strokeWidth }) => (
  <Path d="M12 2 L 5 12 h 5 l -1 8 l 7 -10 h -5 l 1 -8 Z"
        stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
));
export const SunIcon = make(({ stroke, strokeWidth }) => (
  <>
    <Circle cx={11} cy={11} r={4} stroke={stroke} strokeWidth={strokeWidth} fill="none" />
    <Path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.5 4.5l1.4 1.4M16.1 16.1l1.4 1.4M4.5 17.5l1.4-1.4M16.1 5.9l1.4-1.4"
          stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
  </>
));
export const MoonIcon = make(({ stroke, strokeWidth }) => (
  <Path d="M17 13a7 7 0 1 1-8-9 5 5 0 0 0 8 9Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
));
export const ChartIcon = make(({ stroke, strokeWidth }) => (
  <Path d="M4 18V8M10 18V4M16 18v-7" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
));
export const HomeIcon = make(({ stroke, strokeWidth }) => (
  <Path d="M3 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-5h-6v5H4a1 1 0 0 1-1-1Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
));
export const StarIcon = make(({ stroke, strokeWidth }) => (
  <Path d="M11 3 13.5 8.4 19.5 9.1 15 13.2 16.2 19 11 16 5.8 19 7 13.2 2.5 9.1 8.5 8.4 Z"
        stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
));
export const GearIcon = make(({ stroke, strokeWidth }) => (
  <>
    <Path
      d="M11 2 12.6 4.1 15.2 3.5 15.8 6.1 18.1 7.4 17 9.8 18.1 12.2 15.8 13.5 15.2 16.1 12.6 15.5 11 17.6 9.4 15.5 6.8 16.1 6.2 13.5 3.9 12.2 5 9.8 3.9 7.4 6.2 6.1 6.8 3.5 9.4 4.1 Z"
      stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" fill="none" />
    <Circle cx={11} cy={11} r={3} stroke={stroke} strokeWidth={strokeWidth} fill="none" />
  </>
));
export const BellIcon = make(({ stroke, strokeWidth }) => (
  <>
    <Path d="M5 16l-1 2h14l-1-2V11a6 6 0 0 0-12 0Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 19a2 2 0 0 0 4 0" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
  </>
));
export const ShirtIcon = make(({ stroke, strokeWidth }) => (
  <Path d="M7 3l4 2 4-2 4 3-2 3-2-1v9H7v-9l-2 1-2-3Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
));
export const CheckIcon = make(({ stroke }) => (
  <Path d="M4 11l5 5 9-11" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
));
export const LockIcon = make(({ stroke, strokeWidth }) => (
  <>
    <Rect x={4} y={10} width={14} height={9} rx={2} stroke={stroke} strokeWidth={strokeWidth} fill="none" />
    <Path d="M7 10V7a4 4 0 0 1 8 0v3" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </>
));
export const FireIcon = make(({ stroke, strokeWidth }) => (
  <Path d="M11 3c0 4-5 5-5 10a5 5 0 0 0 10 0c0-2-1-3-2-4 0 2-1 3-3 3 0-3 1-4 0-9Z"
        stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
));
