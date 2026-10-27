// Design tokens from the Taskora design canvas (.tk / .tk.dark).

export type Palette = {
  bg: string;
  bg2: string;
  surface: string;
  ink: string;
  ink2: string;
  muted: string;
  line: string;
  line2: string;
  lime: string;
  limeInk: string;
  limeSoft: string;
  limeText: string;
  info: string;
  infoSoft: string;
  warn: string;
  warnSoft: string;
  danger: string;
  dangerSoft: string;
  map: string;
  road: string;
  scrim: string;
};

export const light: Palette = {
  bg: '#F7F7F2',
  bg2: '#EFEFE8',
  surface: '#FFFFFF',
  ink: '#101010',
  ink2: '#3D3D3A',
  muted: '#5F5F59',
  line: '#E5E5DF',
  line2: '#D6D6CE',
  lime: '#C6F36A',
  limeInk: '#101010',
  limeSoft: '#EEF8D8',
  limeText: '#476210',
  info: '#1E4BB8',
  infoSoft: '#E6EDFC',
  warn: '#8A5300',
  warnSoft: '#FFF1D6',
  danger: '#9E2F27',
  dangerSoft: '#FBE9E7',
  map: '#E9EAE1',
  road: '#FBFBF7',
  scrim: 'rgba(0,0,0,0.4)',
};

export const dark: Palette = {
  bg: '#0D0D0C',
  bg2: '#141413',
  surface: '#161615',
  ink: '#F3F3EE',
  ink2: '#CFCFC7',
  muted: '#A0A098',
  line: '#262624',
  line2: '#353532',
  lime: '#B9E067',
  limeInk: '#0D0D0C',
  limeSoft: '#1E2614',
  limeText: '#C6F36A',
  info: '#93B4FF',
  infoSoft: '#151D2E',
  warn: '#F0B35A',
  warnSoft: '#2A2013',
  danger: '#FF9C93',
  dangerSoft: '#2B1614',
  map: '#151614',
  road: '#22231F',
  scrim: 'rgba(0,0,0,0.55)',
};

// Avatar / portfolio swatches used across screens (fixed, not themed).
export const swatch = {
  sage: '#D9E4C4',
  sky: '#D6E2F0',
  rose: '#EBD6E6',
  sand: '#F0D9B5',
  moss: '#DDE7D0',
};

export const fonts = {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold',
  bold: 'Geist_700Bold',
  mono: 'GeistMono_400Regular',
  monoSemibold: 'GeistMono_600SemiBold',
};

export type Weight = number;

export function fontFor(weight: Weight = 400, mono = false) {
  if (mono) return weight >= 550 ? fonts.monoSemibold : fonts.mono;
  if (weight >= 650) return fonts.bold;
  if (weight >= 580) return fonts.semibold;
  if (weight >= 500) return fonts.medium;
  return fonts.regular;
}

export const radius = { sm: 12, md: 14, lg: 16, xl: 18, xxl: 22, sheet: 26, pill: 999 };
