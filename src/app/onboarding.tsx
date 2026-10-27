import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import Svg, { Circle, Path } from 'react-native-svg';
import { Icon } from '../components/Icon';
import { Btn, Card, Chip, H1, IconBtn, Opt, Progress, Rise, Row, Screen, T } from '../components/ui';
import { useApp } from '../store/AppStore';

type Role = 'earn' | 'hire' | 'both';
type Step = 'role' | 'skills' | 'hire' | 'work' | 'avail' | 'loc' | 'done';

const SKILLS = ['Web development', 'Shopify', 'Logo design', 'UI design', 'Video editing', 'Reels', 'Copywriting', 'Translation', 'Maths tutoring', 'Laptop repair', 'Electrical', 'Photography'];
const HIRE_CATS = ['Development', 'Design', 'Video', 'Writing', 'Tutoring', 'Tech support', 'Home services', 'Photography'];
const BUDGETS = ['< ₹2k', '₹2k–10k', '₹10k–50k', '₹50k+'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = ['Mornings', 'Afternoons', 'Evenings'];

function flowFor(role: Role | null): Step[] {
  if (role === 'hire') return ['role', 'hire', 'loc', 'done'];
  if (role === 'both') return ['role', 'skills', 'work', 'avail', 'hire', 'loc', 'done'];
  return ['role', 'skills', 'work', 'avail', 'loc', 'done'];
}

export default function Onboarding() {
  const { c, setMode } = useApp();
  const params = useLocalSearchParams<{ role?: Role }>();
  const [i, setI] = useState(0);
  const [role, setRole] = useState<Role | null>(params.role ?? null);
  const [skills, setSkills] = useState(['Web development']);
  const [hire, setHire] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [work, setWork] = useState<'remote' | 'onsite' | 'both'>('both');
  const [radiusKm, setRadius] = useState(8);
  const [days, setDays] = useState(['Mon', 'Tue', 'Sat']);
  const [slots, setSlots] = useState(['Evenings']);
  const [loc, setLoc] = useState<'gps' | 'city' | null>(null);

  const flow = flowFor(role);
  const cur = flow[i];
  const total = flow.length - 1;
  const pct = Math.round((i / total) * 100);
  const tog = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : arr.concat(v));
  const next = () => {
    if (cur === 'role' && !role) return;
    setI(Math.min(flow.length - 1, i + 1));
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
        <View style={{ opacity: i === 0 ? 0.35 : 1 }}>
          <IconBtn icon="back" label="Back" onPress={() => (i === 0 ? router.back() : setI(i - 1))} />
        </View>
        <View style={{ flex: 1 }}>
          <Progress pct={pct} height={4} />
        </View>
        <T size={13} mono color="muted" style={{ minWidth: 36, textAlign: 'right' }}>{cur === 'done' ? '✓' : `${i + 1}/${total}`}</T>
      </Row>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 24 }}>
        <Rise key={cur} from={0} style={{ gap: 20 }}>
          {cur === 'role' && (
            <>
              <H1 size={36}>What brings you here?</H1>
              <View style={{ gap: 10 }}>
                {([['earn', 'I want to earn money', 'Find tasks, send proposals, get paid'], ['hire', 'I want to hire someone', 'Post tasks and compare proposals'], ['both', 'I want to do both', 'One account, both sides']] as const).map((r) => (
                  <Opt key={r[0]} on={role === r[0]} onPress={() => setRole(r[0])} title={r[1]} sub={r[2]} style={{ padding: 18, borderRadius: 18 }} />
                ))}
              </View>
            </>
          )}

          {cur === 'skills' && (
            <>
              <H1 size={36}>What are you good at?</H1>
              <T size={15} color="ink2" lh={1.5}>Pick a few. They're for matching, not a test.</T>
              <Row gap={8} wrap>
                {SKILLS.map((s) => <Chip key={s} label={s} on={skills.includes(s)} onPress={() => tog(skills, setSkills, s)} style={{ minHeight: 44, paddingHorizontal: 16 }} />)}
              </Row>
              <T size={13} color="muted">{skills.length} selected · add portfolio work later from your profile</T>
            </>
          )}

          {cur === 'hire' && (
            <>
              <H1 size={36}>What do you usually need help with?</H1>
              <T size={15} color="ink2">Optional — helps us suggest people.</T>
              <Row gap={8} wrap>
                {HIRE_CATS.map((s) => <Chip key={s} label={s} on={hire.includes(s)} onPress={() => tog(hire, setHire, s)} style={{ minHeight: 44, paddingHorizontal: 16 }} />)}
              </Row>
              <T size={15} weight={600}>Typical budget</T>
              <Row gap={8} wrap>
                {BUDGETS.map((b) => <Chip key={b} label={b} on={budget === b} onPress={() => setBudget(b)} style={{ minHeight: 44, paddingHorizontal: 16 }} />)}
              </Row>
            </>
          )}

          {cur === 'work' && (
            <>
              <H1 size={36}>Where do you want to work?</H1>
              <View style={{ gap: 10 }}>
                {([['remote', 'Remote only', 'Digital work from anywhere'], ['onsite', 'On-site near me', 'Repairs, tutoring, shoots'], ['both', 'Both', 'Show me everything']] as const).map((w) => (
                  <Opt key={w[0]} on={work === w[0]} onPress={() => setWork(w[0])} title={w[1]} sub={w[2]} style={{ padding: 18, borderRadius: 18 }} />
                ))}
              </View>
              {work !== 'remote' && (
                <Card r={18} style={{ gap: 10 }}>
                  <Row between>
                    <T size={15} weight={600}>Service radius</T>
                    <T mono weight={600}>{radiusKm} km</T>
                  </Row>
                  <Slider minimumValue={1} maximumValue={30} step={1} value={radiusKm} onValueChange={setRadius} minimumTrackTintColor={c.ink} maximumTrackTintColor={c.line2} thumbTintColor={c.ink} accessibilityLabel="Service radius" />
                  <T size={12} color="muted">Customers never see your exact address.</T>
                </Card>
              )}
            </>
          )}

          {cur === 'avail' && (
            <>
              <H1 size={36}>When are you usually free?</H1>
              <Row gap={6}>
                {DAYS.map((d) => <Chip key={d} label={d.slice(0, 2)} on={days.includes(d)} onPress={() => tog(days, setDays, d)} style={{ flex: 1, paddingHorizontal: 0, borderRadius: 12, minHeight: 44 }} />)}
              </Row>
              <Row gap={8} wrap>
                {SLOTS.map((s) => <Chip key={s} label={s} on={slots.includes(s)} onPress={() => tog(slots, setSlots, s)} style={{ minHeight: 44, paddingHorizontal: 16 }} />)}
              </Row>
            </>
          )}

          {cur === 'loc' && (
            <>
              <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="pin" size={28} color="#101010" />
              </View>
              <H1 size={36}>Show tasks near you?</H1>
              <T size={15} color="ink2" lh={1.55}>We use your approximate area for on-site tasks and distances. Your exact location is never shown to other users.</T>
              <Opt on={loc === 'gps'} onPress={() => setLoc('gps')} title="Use approximate location" sub="Your phone will ask for permission" />
              <Opt on={loc === 'city'} onPress={() => setLoc('city')} title="I'll pick a city" sub="e.g. Pune · Kothrud" />
              <T size={12} color="muted">{loc === 'gps' ? 'Prototype: no location is actually requested.' : 'Optional — skip if you only work remotely.'}</T>
            </>
          )}

          {cur === 'done' && (
            <View style={{ gap: 20, paddingTop: 40 }}>
              <Svg width={96} height={96} viewBox="0 0 88 88">
                <Circle cx={44} cy={44} r={44} fill={c.lime} />
                <Path d="M28 45l11 11 21-23" fill="none" stroke="#101010" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <H1 size={44}>You're set up.</H1>
              <T size={16} color="ink2" lh={1.55}>
                {role === 'hire' ? "Post your first task whenever you're ready — about two minutes." : `We'll show tasks for ${skills[0] || 'your skills'}. Adding portfolio work helps you stand out from day one.`}
              </T>
            </View>
          )}
        </Rise>
      </ScrollView>

      <Row gap={10} style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, borderTopWidth: 1, borderColor: c.line }}>
        {cur === 'done' ? (
          <Btn
            variant="lime"
            label="Go to home"
            style={{ flex: 1, minHeight: 52 }}
            onPress={() => {
              setMode(role === 'hire' ? 'hire' : 'work');
              router.replace('/home');
            }}
          />
        ) : (
          <>
            {cur !== 'role' && <Btn variant="text" label="Skip" onPress={next} />}
            <Btn label="Continue" style={{ flex: 1, minHeight: 52 }} disabled={cur === 'role' && !role} onPress={next} />
          </>
        )}
      </Row>
    </Screen>
  );
}
