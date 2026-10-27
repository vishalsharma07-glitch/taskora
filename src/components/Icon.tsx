import Svg, { Circle, Path } from 'react-native-svg';

// Stroke paths lifted from the design's inline SVGs (24×24 viewBox).
export const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  explore: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  msg: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  work: 'M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  pay: 'M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18',
  up: 'M12 19V5M6 11l6-6 6 6',
  shield: 'M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z',
  gear: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  bell: 'M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0',
  back: 'M15 6l-6 6 6 6',
  chevR: 'M9 6l6 6-6 6',
  chevD: 'm6 9 6 6 6-6',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'm5 12 5 5L20 7',
  trend: 'M4 17 10 11l4 4 6-7M15 8h5v5',
  search: 'm20 20-3.5-3.5',
  filter: 'M4 6h16M7 12h10M10 18h4',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z',
  upload: 'M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3',
  clip: 'M21 11.5 12.5 20a5 5 0 0 1-7-7L14 4.5a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3L15 7.5',
} as const;

export type IconName = keyof typeof ICONS | 'dots';

type Props = { name: IconName; size?: number; color: string; stroke?: number; fill?: string };

export function Icon({ name, size = 20, color, stroke = 1.8, fill = 'none' }: Props) {
  if (name === 'dots') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx={5} cy={12} r={1.7} fill={color} />
        <Circle cx={12} cy={12} r={1.7} fill={color} />
        <Circle cx={19} cy={12} r={1.7} fill={color} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'search' && <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={stroke} />}
      {name === 'pin' && <Circle cx={12} cy={9.5} r={2.5} stroke={color} strokeWidth={stroke} />}
      <Path d={ICONS[name]} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill={fill} />
    </Svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path d="M9 0h14a9 9 0 0 1 9 9v14a9 9 0 0 1-9 9H9a9 9 0 0 1-9-9V9a9 9 0 0 1 9-9z" fill="#101010" />
      <Path d="M21 5c.6 4.2 1.8 5.4 6 6-4.2.6-5.4 1.8-6 6-.6-4.2-1.8-5.4-6-6 4.2-.6 5.4-1.8 6-6z" fill="#C6F36A" />
      <Path d="M7 25c3-3 5.5-6.5 8.5-9" stroke="#C6F36A" strokeWidth={2.6} strokeLinecap="round" fill="none" />
    </Svg>
  );
}
