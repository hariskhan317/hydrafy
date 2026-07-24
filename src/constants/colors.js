import { DefaultTheme } from '@react-navigation/native';

export const COLORS = {
  sky: {
    50:  '#eaf6fc',
    100: '#d4ecf8',
    200: '#a8d6ee',
    300: '#74bee0',
    400: '#3fa8d6',
    500: '#1d8ec1',
    600: '#0e6e9c',
    700: '#0a567b',
  },
  coral: {
    50:  '#ffeee9',
    100: '#ffd9d0',
    200: '#ffb8a8',
    300: '#ff9986',
    400: '#ff7a6b',
    500: '#ee5a4a',
    600: '#c2402f',
  },
  ink: {
    900: '#0e2433',
    700: '#3a566a',
    500: '#6b8294',
    300: '#b3c3cf',
    100: '#e3edf3',
  },
  bg: '#f6fbfd',
  surface: '#ffffff',
  surfaceMute: '#eef6fb',
  white: '#ffffff',
  black: '#000000',
};

export const RADIUS = { sm: 8, md: 14, lg: 22, pill: 999 };
export const SPACE  = [0, 4, 8, 12, 16, 20, 24, 32, 40, 56];

export const FONTS = {
  display:  'Sora-Bold',
  heading:  'Sora-SemiBold',
  body:     'PlusJakartaSans-Regular',
  bodyMed:  'PlusJakartaSans-Medium',
  bodyBold: 'PlusJakartaSans-Bold',
  bodySemi: 'PlusJakartaSans-SemiBold',
  mono:     'JetBrainsMono-Regular',
};

export const SHADOW = {
  sm: {
    shadowColor: '#0e2433',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0e2433',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0e2433',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 40,
    elevation: 12,
  },
};

export const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.bg,
    card: COLORS.surface,
    text: COLORS.ink[900],
    border: COLORS.ink[100],
    primary: COLORS.sky[500],
  },
};
