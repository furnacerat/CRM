export const colors = {
  bg: {
    primary: '#0A0A0D',
    secondary: '#121216',
    tertiary: '#18181E',
    elevated: '#1E1E24',
    surface: '#222229',
  },
  accent: {
    primary: '#F59E0B',
    primaryHover: '#FBBF24',
    primaryMuted: 'rgba(245, 158, 11, 0.15)',
    secondary: '#3B82F6',
    secondaryHover: '#60A5FA',
    secondaryMuted: 'rgba(59, 130, 246, 0.15)',
  },
  text: {
    primary: '#FAFAFA',
    secondary: '#A1A1AA',
    muted: '#71717A',
    inverse: '#0A0A0D',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.16)',
    accent: 'rgba(245, 158, 11, 0.4)',
  },
  status: {
    success: '#22C55E',
    successBg: 'rgba(34, 197, 94, 0.12)',
    warning: '#EAB308',
    warningBg: 'rgba(234, 179, 8, 0.12)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.12)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.12)',
  },
  glow: {
    accent: 'rgba(245, 158, 11, 0.25)',
    blue: 'rgba(59, 130, 246, 0.25)',
  },
};

export const typography = {
  fontFamily: {
    sans: '"Outfit", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  size: {
    xs: '0.75rem',
    sm: '0.8125rem',
    base: '0.875rem',
    lg: '0.9375rem',
    xl: '1.0625rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    '4xl': '1.875rem',
    '5xl': '2.25rem',
  },
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
  },
};

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
};

export const radius = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
  DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.4)',
  md: '0 4px 12px rgba(0, 0, 0, 0.5)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.6)',
  glow: '0 0 20px rgba(245, 158, 11, 0.2)',
  glowBlue: '0 0 20px rgba(59, 130, 246, 0.2)',
};

export const transitions = {
  fast: '120ms ease',
  DEFAULT: '200ms ease',
  slow: '300ms ease',
  spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const zIndex = {
  base: 0,
  elevated: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};