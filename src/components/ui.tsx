import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
import { useColors } from '../store/AppStore';
import { fontFor, radius, type Palette, type Weight } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

/* ---------- Text ---------- */

type TProps = {
  children: ReactNode;
  size?: number;
  weight?: Weight;
  color?: keyof Palette | string;
  mono?: boolean;
  tracking?: number; // em, like the design's letter-spacing
  lh?: number; // line-height multiplier
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  center?: boolean;
};

export function T({ children, size = 15, weight = 400, color = 'ink', mono, tracking, lh, style, numberOfLines, center }: TProps) {
  const c = useColors();
  const resolved = (c as Record<string, string>)[color] ?? color;
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize: size,
          fontFamily: fontFor(weight, mono),
          color: resolved,
          letterSpacing: tracking ? tracking * size : undefined,
          lineHeight: lh ? lh * size : undefined,
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export const H1 = ({ children, size = 32, style }: { children: ReactNode; size?: number; style?: StyleProp<TextStyle> }) => (
  <T size={size} weight={650} tracking={-0.045} lh={1.08} style={style}>
    {children}
  </T>
);

export const H2 = ({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) => (
  <T size={17} weight={600} tracking={-0.02} style={style}>
    {children}
  </T>
);

export const Eyebrow = ({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) => (
  <T size={12} weight={650} color="muted" tracking={0.08} style={[{ textTransform: 'uppercase' }, style]}>
    {children}
  </T>
);

/* ---------- Layout ---------- */

export function Screen({ children, edges = ['top'], style }: { children: ReactNode; edges?: Edge[]; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  return <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: c.bg }, style]}>{children}</SafeAreaView>;
}

export function Row({ children, gap = 8, style, between, center = true, wrap }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle>; between?: boolean; center?: boolean; wrap?: boolean }) {
  return (
    <View style={[{ flexDirection: 'row', gap, alignItems: center ? 'center' : undefined, justifyContent: between ? 'space-between' : undefined, flexWrap: wrap ? 'wrap' : undefined }, style]}>
      {children}
    </View>
  );
}

export function Card({ children, style, selected, pad = 16, r = 20 }: { children: ReactNode; style?: StyleProp<ViewStyle>; selected?: boolean; pad?: number; r?: number }) {
  const c = useColors();
  return (
    <View style={[{ padding: pad, borderRadius: r, borderWidth: selected ? 2 : 1, borderColor: selected ? c.ink : c.line, backgroundColor: c.surface }, style]}>
      {children}
    </View>
  );
}

export function Divider({ dashed, style }: { dashed?: boolean; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  return <View style={[{ height: 0, borderTopWidth: 1, borderColor: dashed ? c.line2 : c.line, borderStyle: dashed ? 'dashed' : 'solid' }, style]} />;
}

export function Grad({ colors, style, children }: { colors: [string, string]; style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={style}>
      {children}
    </LinearGradient>
  );
}

export function Avatar({ ini, bg, size = 44, r }: { ini: string; bg: string; size?: number; r?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: r ?? size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <T size={size * 0.32} weight={600} color="#101010">{ini}</T>
    </View>
  );
}

/* ---------- Buttons ---------- */

type BtnVariant = 'primary' | 'lime' | 'ghost' | 'danger' | 'text';

type BtnProps = {
  label: string;
  onPress?: () => void;
  variant?: BtnVariant;
  sm?: boolean;
  disabled?: boolean;
  icon?: IconName;
  iconRight?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Btn({ label, onPress, variant = 'primary', sm, disabled, icon, iconRight, style, accessibilityLabel }: BtnProps) {
  const c = useColors();
  const bg = { primary: c.ink, lime: c.lime, ghost: 'transparent', danger: c.danger, text: 'transparent' }[variant];
  const fg = { primary: c.bg, lime: c.limeInk, ghost: c.ink, danger: '#fff', text: c.muted }[variant];
  const ic = icon ? <Icon name={icon} size={sm ? 15 : 16} color={fg} stroke={2} /> : null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: sm ? 40 : 50,
          paddingHorizontal: sm ? 14 : 18,
          borderRadius: sm ? 12 : 14,
          backgroundColor: bg,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: c.line2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: disabled ? 0.4 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}
    >
      {!iconRight && ic}
      <T size={sm ? 14 : 15} weight={580} color={fg}>{label}</T>
      {iconRight && ic}
    </Pressable>
  );
}

export function IconBtn({ icon, onPress, label, size = 44, bg, plain, iconSize = 20, children, iconColor, fill }: { icon?: IconName; onPress?: () => void; label: string; size?: number; bg?: string; plain?: boolean; iconSize?: number; children?: ReactNode; iconColor?: string; fill?: string }) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: 14,
        borderWidth: plain ? 0 : 1,
        borderColor: c.line,
        backgroundColor: plain ? 'transparent' : bg ?? c.surface,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {icon && <Icon name={icon} size={iconSize} color={iconColor ?? (bg === c.lime ? '#101010' : c.ink)} stroke={2} fill={fill} />}
      {children}
    </Pressable>
  );
}

export function Chip({ label, on, onPress, style, children }: { label?: string; on?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      onPress={onPress}
      style={[
        { minHeight: 40, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: on ? c.ink : c.line, backgroundColor: on ? c.ink : c.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
        style,
      ]}
    >
      {children}
      {label != null && <T size={14} color={on ? c.bg : c.ink2}>{label}</T>}
    </Pressable>
  );
}

export type Tone = 'neutral' | 'lime' | 'info' | 'warn' | 'danger';

export function Tag({ label, tone = 'neutral', dashed, style, solidLime }: { label: string; tone?: Tone; dashed?: boolean; style?: StyleProp<ViewStyle>; solidLime?: boolean }) {
  const c = useColors();
  const map: Record<Tone, [string, string]> = {
    neutral: [c.bg2, c.ink2],
    lime: [c.limeSoft, c.limeText],
    info: [c.infoSoft, c.info],
    warn: [c.warnSoft, c.warn],
    danger: [c.dangerSoft, c.danger],
  };
  const [bg, fg] = solidLime ? [c.lime, '#101010'] : map[tone];
  return (
    <View style={[{ alignSelf: 'flex-start', height: 24, paddingHorizontal: 9, borderRadius: 7, backgroundColor: bg, borderWidth: tone === 'neutral' && !solidLime ? 1 : 0, borderColor: c.line, borderStyle: dashed ? 'dashed' : 'solid', justifyContent: 'center' }, style]}>
      <T size={12} weight={550} color={fg} numberOfLines={1}>{label}</T>
    </View>
  );
}

/* ---------- Form controls ---------- */

export function Field({ error, style, mono, big, ...rest }: TextInputProps & { error?: boolean; mono?: boolean; big?: boolean }) {
  const c = useColors();
  return (
    <TextInput
      placeholderTextColor={c.muted}
      selectionColor={c.ink}
      {...rest}
      style={[
        {
          minHeight: rest.multiline ? 96 : 50,
          paddingHorizontal: 14,
          paddingVertical: rest.multiline ? 12 : 0,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: error ? c.danger : c.line2,
          backgroundColor: c.surface,
          color: c.ink,
          fontSize: big ? 22 : 16,
          fontFamily: fontFor(mono ? 600 : 400, mono),
          textAlignVertical: rest.multiline ? 'top' : 'center',
        },
        style,
      ]}
    />
  );
}

export function Seg<K extends string>({ options, value, onChange, style }: { options: { key: K; label: string }[]; value: K; onChange: (k: K) => void; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  return (
    <View style={[{ flexDirection: 'row', padding: 3, borderRadius: 12, backgroundColor: c.bg2, borderWidth: 1, borderColor: c.line }, style]}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable
            key={o.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.key)}
            style={{ flex: 1, minHeight: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.surface : 'transparent', shadowColor: '#000', shadowOpacity: on ? 0.08 : 0, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: on ? 1 : 0 }}
          >
            <T size={14} weight={560} color={on ? 'ink' : 'muted'}>{o.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Toggle({ on, onPress, label }: { on: boolean; onPress: () => void; label: string }) {
  const c = useColors();
  const x = useRef(new Animated.Value(on ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(x, { toValue: on ? 1 : 0, useNativeDriver: true, bounciness: 6, speed: 18 }).start();
  }, [on, x]);
  return (
    <Pressable accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: on }} onPress={onPress} hitSlop={8} style={{ width: 46, height: 28, borderRadius: 14, backgroundColor: on ? c.ink : c.line2, justifyContent: 'center' }}>
      <Animated.View style={{ width: 22, height: 22, borderRadius: 11, marginLeft: 3, backgroundColor: on ? c.lime : '#fff', transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) }], shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 2 }} />
    </Pressable>
  );
}

export function Radio({ on }: { on: boolean }) {
  const c = useColors();
  return (
    <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: on ? c.ink : c.line2, backgroundColor: on ? c.ink : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      {on && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.lime }} />}
    </View>
  );
}

// Selectable option card (.opt in the design).
export function Opt({ on, onPress, title, sub, radio = true, style, children }: { on: boolean; onPress: () => void; title?: string; sub?: string; radio?: boolean; style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: on }}
      onPress={onPress}
      style={({ pressed }) => [
        { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, borderWidth: on ? 2 : 1, borderColor: on ? c.ink : c.line, backgroundColor: c.surface, transform: [{ scale: pressed ? 0.98 : 1 }] },
        style,
      ]}
    >
      {radio && <Radio on={on} />}
      {children ?? (
        <View style={{ flex: 1, gap: 3 }}>
          {title && <T size={16} weight={600}>{title}</T>}
          {sub && <T size={13} color="muted">{sub}</T>}
        </View>
      )}
    </Pressable>
  );
}

export function Progress({ pct, height = 5, color }: { pct: number; height?: number; color?: string }) {
  const c = useColors();
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: pct, duration: 600, useNativeDriver: false }).start();
  }, [pct, w]);
  return (
    <View style={{ height, borderRadius: height, backgroundColor: c.line, overflow: 'hidden' }}>
      <Animated.View style={{ height: '100%', backgroundColor: color ?? c.ink, borderRadius: height, width: w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }} />
    </View>
  );
}

/* ---------- Motion ---------- */

// Fade + rise on mount (.stag / .rise in the design).
export function Rise({ children, delay = 0, style, from = 12 }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle>; from?: number }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 450, delay, useNativeDriver: true }).start();
  }, [a, delay]);
  return (
    <Animated.View style={[{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );
}

/* ---------- Bottom sheet ---------- */

export function Sheet({ visible, onClose, children, top, style }: { visible: boolean; onClose: () => void; children: ReactNode; top?: number; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable accessibilityLabel="Close" onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]} />
        <View
          style={[
            { backgroundColor: c.bg, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingBottom: Math.max(insets.bottom, 16), maxHeight: '92%' },
            top != null && { position: 'absolute', left: 0, right: 0, bottom: 0, top: insets.top + top, maxHeight: undefined },
            style,
          ]}
        >
          <View style={{ width: 40, height: 4, borderRadius: 4, backgroundColor: c.line2, alignSelf: 'center', marginTop: 10 }} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

/* ---------- Misc ---------- */

export function Stat({ k, v, mono = true, style }: { k: string; v: string; mono?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Card pad={14} r={16} style={style}>
      <T size={12} color="muted">{k}</T>
      <T size={mono ? 22 : 15} weight={600} mono={mono} style={{ marginTop: 4 }}>{v}</T>
    </Card>
  );
}

export function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="link" onPress={onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 58, borderBottomWidth: 1, borderColor: c.line }}>
      <T size={15}>{label}</T>
      <Icon name="chevR" size={16} color={c.muted} stroke={2} />
    </Pressable>
  );
}
