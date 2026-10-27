import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, Logo } from '../components/Icon';
import { Btn, Chip, Rise, Row, Screen, T, Tag } from '../components/ui';
import { useColors } from '../store/AppStore';
import { fontFor } from '../theme/tokens';

const WORDS = ['build', 'earn today', 'hire help', 'fix things', 'learn', 'get it done'];
const LINE = 50;

// Rotating highlighted word under "I want to…".
function Ticker() {
  const c = useColors();
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      Animated.timing(y, { toValue: -i * LINE, duration: 700, easing: Easing.bezier(0.77, 0, 0.18, 1), useNativeDriver: true }).start(() => {
        if (i === WORDS.length) {
          i = 0;
          y.setValue(0);
        }
      });
    }, 2500);
    return () => clearInterval(id);
  }, [y]);
  return (
    <View style={{ height: LINE, overflow: 'hidden' }}>
      <Animated.View style={{ transform: [{ translateY: y }] }}>
        {[...WORDS, WORDS[0]].map((w, i) => (
          <View key={i} style={{ height: LINE, justifyContent: 'center', alignItems: 'flex-start' }}>
            <View>
              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 6, height: 11, backgroundColor: c.lime }} />
              <T size={46} weight={650} tracking={-0.05}>{w}</T>
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

type Path = 'hire' | 'earn' | null;

export default function Welcome() {
  const c = useColors();
  const [q, setQ] = useState('');
  const [path, setPath] = useState<Path>(null);

  const r = useMemo(() => {
    const t = q.toLowerCase();
    const has = q.trim().length > 1;
    const earn = /(\bearn\b|\bi can\b|paid|looking for work|freelanc|i edit|i design|i teach|i repair)/.test(t) && !/need (someone|a |an )/.test(t);
    const cats: [string, RegExp][] = [['Development', /(website|shopify|app\b|bug|code|wordpress)/], ['Design', /(logo|design|menu|poster)/], ['Video editing', /(video|edit|reel|youtube)/], ['Tutoring', /(tutor|teach|learn|class)/], ['Tech support', /(laptop|computer|wifi|printer|repair)/], ['Home services', /(plumber|electrician|clean|\bac\b|leak)/], ['Photography', /(photo|shoot)/]];
    const hit = cats.find((x) => x[1].test(t));
    const m = q.match(/(?:₹|rs\.?|inr)\s?([\d,]+)/i);
    const budget = m ? '₹' + (parseInt(m[1].replace(/,/g, ''), 10) || 0).toLocaleString('en-IN') : null;
    const local = /(near me|nearby|at home|plumber|electrician|repair|mumbai|pune|delhi|bengaluru|chennai|kochi)/.test(t);
    const detected: string[] = [];
    if (hit) detected.push(hit[0]);
    if (budget) detected.push(budget);
    if (has) detected.push(local ? 'On-site · near you' : 'Remote');
    const isEarn = has ? earn : path === 'earn';
    return { has, isEarn, detected, budget };
  }, [q, path]);

  const examples = path === 'earn' ? ['I edit Reels in Hindi', 'I repair laptops in Pune', 'I can build websites'] : path === 'hire' ? ['Shopify site for ₹5,000', 'Plumber near me', 'Python tutor, Class 12'] : ['Shopify site for ₹5,000', 'I want to earn editing videos', 'Plumber near me'];

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View pointerEvents="none" style={{ position: 'absolute', left: -60, top: 40, width: 340, height: 300, borderRadius: 170, backgroundColor: c.lime, opacity: 0.18 }} />
        <Row between style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <Row gap={8}>
            <Logo size={28} />
            <T size={19} weight={650} tracking={-0.045}>taskora</T>
          </Row>
          <Pressable accessibilityRole="link" onPress={() => router.replace('/home')} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 }}>
            <T size={15} weight={550}>Sign in</T>
          </Pressable>
        </Row>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 24, gap: 22 }} keyboardShouldPersistTaps="handled">
          <Rise delay={80}>
            <T size={46} weight={650} tracking={-0.05} lh={1.08}>
              I want to<T size={46} color="muted">…</T>
            </T>
            <Ticker />
          </Rise>
          <Rise delay={180}>
            <T size={16} lh={1.55} color="ink2">Post a task and hire someone you trust — or turn your skills into income. One account for both.</T>
          </Rise>

          <Rise delay={300}>
            <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 22, padding: 16, gap: 12, shadowColor: '#101010', shadowOpacity: 0.12, shadowRadius: 24, shadowOffset: { width: 0, height: 16 }, elevation: 3 }}>
              <T size={11} weight={650} tracking={0.08} color="muted" style={{ textTransform: 'uppercase' }}>
                {path === 'earn' ? 'What can you do?' : path === 'hire' ? 'What do you need done?' : 'Tell us in your own words'}
              </T>
              <TextInput
                value={q}
                onChangeText={setQ}
                multiline
                placeholder={path === 'earn' ? 'e.g. I edit YouTube videos in Hindi' : 'e.g. I need a Shopify website for ₹5,000'}
                placeholderTextColor={c.muted}
                style={{ fontSize: 17, lineHeight: 24, color: c.ink, fontFamily: fontFor(400), minHeight: 48, padding: 0, textAlignVertical: 'top' }}
              />
              {!r.has ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} keyboardShouldPersistTaps="handled">
                  {examples.map((x) => <Chip key={x} label={x} onPress={() => setQ(x)} />)}
                </ScrollView>
              ) : (
                <Rise from={8} style={{ gap: 10, borderTopWidth: 1, borderColor: c.line, paddingTop: 12 }}>
                  <Row gap={6} wrap>
                    <Tag tone="lime" label={r.isEarn ? 'You want to earn' : 'You want to hire'} />
                    {r.detected.map((d) => <Tag key={d} label={d} />)}
                  </Row>
                  <T size={13} color="ink2" lh={1.45}>
                    {r.isEarn ? 'Next: set up your skills, then see tasks that match.' : !r.budget ? "Add a budget — or we'll suggest an indicative range." : 'Next: we turn this into a clear brief with a deadline.'}
                  </T>
                  <Btn variant="lime" label={r.isEarn ? 'See matching tasks' : 'Turn into a task'} icon="arrow" iconRight onPress={() => (r.isEarn ? router.replace('/explore') : router.push('/post'))} />
                </Rise>
              )}
            </View>
          </Rise>

          <Rise delay={420} style={{ gap: 10 }}>
            <PathCard on={path === 'hire'} onPress={() => setPath(path === 'hire' ? null : 'hire')} title="Get something done" sub="Post a task, compare, hire" icon="plus" iconBg={c.ink} iconFg={c.bg} />
            <PathCard on={path === 'earn'} onPress={() => setPath(path === 'earn' ? null : 'earn')} title="Earn money" sub="Find tasks, propose, get paid" icon="trend" iconBg={c.lime} iconFg={c.limeInk} />
          </Rise>
          <T size={12} color="muted" center>Working name · prototype with sample data</T>
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, borderTopWidth: 1, borderColor: c.line }}>
          <Btn label={path === 'earn' ? 'Start earning' : path === 'hire' ? 'Start hiring' : 'Get started'} onPress={() => router.push({ pathname: '/onboarding', params: path ? { role: path } : {} })} style={{ minHeight: 52, borderRadius: 16 }} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function PathCard({ on, onPress, title, sub, icon, iconBg, iconFg }: { on: boolean; onPress: () => void; title: string; sub: string; icon: 'plus' | 'trend'; iconBg: string; iconFg: string }) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, borderWidth: on ? 2 : 1, borderColor: on ? c.ink : c.line, backgroundColor: c.surface, transform: [{ scale: pressed ? 0.98 : 1 }] })}
    >
      <View style={{ width: 48, height: 48, borderRadius: 15, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={22} color={iconFg} stroke={2} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <T size={18} weight={620} tracking={-0.02}>{title}</T>
        <T size={13} color="muted">{sub}</T>
      </View>
    </Pressable>
  );
}
