/**
 * CrownFruits visual theme.
 * Preset: CASINO_GOLD (design-system/presets.ts) with brief-specific accents.
 * The `name` field stays exactly as the preset ships it.
 */
export const theme = {
  name: 'CASINO_GOLD',

  colors: {
    bgBase: '#18233B',
    bgMid: '#101A2E',
    bgDeep: '#0A1220',
    bgInk: '#070C18',

    surface: 'rgba(255,241,215,0.06)',
    surfaceStrong: 'rgba(255,241,215,0.10)',
    sheet: 'rgba(24,35,59,0.94)',
    board: 'rgba(8,13,26,0.60)',

    gold: '#F3C64C',
    goldLight: '#F5D77A',
    goldDeep: '#D99A2B',

    danger: '#E84C5C',
    success: '#54C37B',
    info: '#55AEE2',

    text: '#FFF1D7',
    textSoft: 'rgba(255,241,215,0.72)',
    textMuted: 'rgba(255,241,215,0.45)',

    borderGold: 'rgba(243,198,76,0.40)',
    borderGoldStrong: 'rgba(243,198,76,0.70)',
    borderSubtle: 'rgba(255,241,215,0.10)',
    gloss: 'rgba(255,255,255,0.30)',
    glossSoft: 'rgba(255,255,255,0.12)',
  },

  gradients: {
    gold: ['#F5D77A', '#F3C64C', '#D99A2B'],
    sheet: ['rgba(24,35,59,0.94)', 'rgba(12,19,35,0.96)'],
    screen: ['#18233B', '#101A2E', '#0A1220'],
    result: ['#18233B', '#0C1526', '#070C18'],
    loader: ['rgba(9,14,28,0.92)', 'rgba(24,35,59,0.88)', 'rgba(6,10,20,0.96)'],
    menuArt: ['rgba(24,35,59,0.10)', 'rgba(24,35,59,0.72)'],
    glossTop: ['rgba(255,255,255,0.30)', 'rgba(255,255,255,0.00)'],
  },

  radius: { sm: 10, md: 14, lg: 18, xl: 22, sheet: 28, pill: 999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 30 },
};

export const C = theme.colors;
export const G = theme.gradients;
export const R = theme.radius;

/** Colored shadow used under every gold surface. */
export const goldShadow = {
  shadowColor: '#F3C64C',
  shadowOpacity: 0.45,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 10,
} as const;

export const darkShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.45,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 8,
} as const;

export const NUMERIC = { fontVariant: ['tabular-nums'] as ['tabular-nums'] };
