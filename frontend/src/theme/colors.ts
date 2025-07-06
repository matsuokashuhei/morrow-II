export const colors = {
  // Primary colors
  primary: '#4A90E2',
  primaryLight: '#6BA3E8',
  primaryDark: '#357ABD',

  // Secondary colors
  secondary: '#F39C12',
  secondaryLight: '#F5B041',
  secondaryDark: '#E67E22',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F8F9FA',
    100: '#E9ECEF',
    200: '#DEE2E6',
    300: '#CED4DA',
    400: '#ADB5BD',
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#212529',
    900: '#1A1A1A',
  },

  // Semantic colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',

  // Background colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Text colors
  text: {
    primary: '#212529',
    secondary: '#6C757D',
    disabled: '#ADB5BD',
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    light: '#E9ECEF',
    medium: '#DEE2E6',
    dark: '#CED4DA',
  },
} as const;

export type ColorKey = keyof typeof colors;
