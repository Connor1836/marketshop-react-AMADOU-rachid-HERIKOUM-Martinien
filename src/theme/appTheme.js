export const Colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  accent: '#43E97B',
  error: '#FF4757',
  white: '#FFFFFF',
  black: '#000000',

  light: {
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#1A1A2E',
    subtext: '#6B7280',
    border: '#E5E7EB',
    tabBar: '#FFFFFF',
  },

  dark: {
    background: '#121212',
    card: '#1E1E1E',
    text: '#F9FAFB',
    subtext: '#9CA3AF',
    border: '#374151',
    tabBar: '#1E1E1E',
  },
};

export const getTheme = (isDark) => ({
  isDark,
  colors: isDark ? Colors.dark : Colors.light,
  primary: Colors.primary,
  secondary: Colors.secondary,
  error: Colors.error,
});

export const Typography = {
  h1: { fontSize: 24, fontWeight: 'bold' },
  h2: { fontSize: 20, fontWeight: 'bold' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 14 },
  caption: { fontSize: 12, color: '#6B7280' },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 20,
  full: 999,
};
