import { useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { Icon } from '../components/Icon';
import { Btn, Card, Chip, Field, H1, IconBtn, Opt, Rise, Row, Screen, T, Tag } from '../components/ui';
import { inr, toNum } from '../data/mock';
import { useColors } from '../store/AppStore';

const CATS = ['Development', 'Design', 'Video editing', 'Writing', 'Marketing', 'Tutoring', 'Tech support', 'Home services', 'Photography', 'Other'];
const GUIDE: Record<string, [number, number, number]> = { Development: [3000, 9000, 25000], Design: [1500, 4000, 10000], 'Video editing': [1000, 4500, 12000], 'Home services': [400, 1200, 4000], 'Tech support': [400, 1000, 3000], Tutoring: [300, 600, 1500] };
const STARTERS: [string, string][] = [
  ['AC leaking — fix this weekend', 'My split AC is leaking water inside the bedroom. Need someone to fix it this weekend, Andheri West.'],
  ['Restaurant menu design', 'I need a two-page menu designed for my South Indian restaurant, print-ready, Tamil and English.'],
  ['Shopify store for my brand', 'I need someone to build a Shopify store for my handloom saree brand with UPI payments.'],
];
const TIMES = ['10:00', '14:00', '18:00', '21:00'];

function suggest(t: string) {
  const x = t.toLowerCase();
  const m = ([['Development', /(website|shopify|app|bug|code)/], ['Design', /(logo|design|menu|poster)/], ['Video editing', /(video|reel|edit)/], ['Tutoring', /(tutor|teach|class)/], ['Tech support', /(laptop|computer|wifi|printer)/], ['Home services', /(plumb|electric|clean|\bac\b|leak|carpent)/], ['Photography', /(photo|shoot)/]] as [string, RegExp][]).find((c) => c[1].test(x));
  return m ? m[0] : null;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (k: number) => { const d = new Date(); d.setDate(d.getDate() + k); return d; };
const fmtDate = (s: string) => new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

export default function PostTask() {
  const c = useColors();
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [deliv, setDeliv] = useState(['']);
  const [pType, setPType] = useState<'fixed' | 'range'>('fixed');
  const [budget, setBudget] = useState('');
  const [bMin, setBMin] = useState('');
  const [bMax, setBMax] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [quick, setQuick] = useState<number | null>(null);
  const [wtype, setWtype] = useState<'remote' | 'onsite' | 'hybrid'>('remote');
  const [area, setArea] = useState('');
  const [msN, setMsN] = useState(1);
  const [err, setErr] = useState(false);
  const [savedNote, setSaved] = useState(false);
  const [done, setDone] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;

  const touch = () => { setSaved(true); setErr(false); };
  const sg = suggest(text);
  const category = cat || sg;
  const total = pType === 'fixed' ? toNum(budget) : toNum(bMax);
  const g = GUIDE[category ?? ''] ?? [1000, 4000, 12000];
  const split = msN === 1 ? [1] : msN === 2 ? [0.4, 0.6] : [0.3, 0.4, 0.3];
  const msT = msN === 1 ? ['Full delivery'] : msN === 2 ? ['First draft', 'Final delivery'] : ['Kick-off & draft', 'Revisions', 'Final delivery'];

  const ok = (k: number) => {
    if (k === 0) return text.trim().length >= 15;
    if (k === 1) return !!category;
    if (k === 2) return title.trim().length > 4 && deliv.some((d) => d.trim());
    if (k === 3) return pType === 'fixed' ? toNum(budget) > 0 : toNum(bMin) > 0 && toNum(bMax) >= toNum(bMin);
    if (k === 4) return !!date;
    if (k === 5) return wtype === 'remote' || area.trim().length > 2;
    return true;
  };
  const E = err && !ok(i);

  const next = () => {
    if (!ok(i)) {
      setErr(true);
      Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 60, useNativeDriver: true }))).start();
      return;
    }
    if (i === 0 && !title) {
      const t = text.trim().replace(/^(my\s+|i\s+need\s+(someone\s+to\s+)?)/i, '');
      setTitle((t.charAt(0).toUpperCase() + t.slice(1)).split(/[.,]/)[0].slice(0, 60));
    }
    if (i === 7) return setDone(true);
    setI(i + 1);
    setErr(false);
  };

  const close = () => (router.canGoBack() ? router.back() : router.replace('/home'));

  if (done) {
    return (
      <Screen edges={['top', 'bottom']} style={{ justifyContent: 'center', padding: 32 }}>
        <Rise style={{ gap: 20 }}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Path d="M60 6v16M60 98v16M6 60h16M98 60h16M22 22l11 11M87 87l11 11M98 22 87 33M33 87 22 98" stroke={c.lime} strokeWidth={4} strokeLinecap="round" />
            <G>
              <Rect x={28} y={28} width={64} height={64} rx={18} fill="#101010" />
              <Path d="M68 38c1.2 8.4 3.6 10.8 12 12-8.4 1.2-10.8 3.6-12 12-1.2-8.4-3.6-10.8-12-12 8.4-1.2 10.8-3.6 12-12z" fill="#C6F36A" />
              <Path d="M40 82c6-6 11-13 17-18" stroke="#C6F36A" strokeWidth={5} strokeLinecap="round" fill="none" />
            </G>
          </Svg>
          <H1 size={40}>Your task is ready.</H1>
          <T size={16} color="ink2" lh={1.55}>In the real app, matching workers would now see it and you'd be notified as proposals arrive. In this prototype it isn't published anywhere.</T>
          <Btn variant="lime" label="Demo: see proposals" onPress={() => router.replace('/proposals')} />
          <Btn variant="ghost" label="Back to home" onPress={() => router.replace('/home')} />
        </Rise>
      </Screen>
    );
  }

  const hint = (bad: boolean, okText: string, badText: string) => <T size={13} lh={1.45} color={bad ? 'danger' : 'muted'}>{bad ? badText : okText}</T>;

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 12 }}>
          <Row between>
            <IconBtn icon="close" iconSize={18} label="Close and keep draft" onPress={close} />
            <T size={13} mono color="muted">Step {i + 1} of 8</T>
            <T size={12} color="muted" style={{ minWidth: 44, textAlign: 'right' }}>{savedNote ? 'Saved ✓' : ''}</T>
          </Row>
          <Row gap={4}>
            {Array.from({ length: 8 }).map((_, k) => <View key={k} style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: k <= i ? c.ink : c.line }} />)}
          </Row>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          <Rise key={i} from={0} style={{ gap: 16 }}>
            {i === 0 && (
              <>
                <H1>What do you need?</H1>
                <T size={13} color="muted">Describe it like you'd tell a friend.</T>
                <Field multiline value={text} onChangeText={(v) => { setText(v); touch(); }} error={E} placeholder="e.g. My AC is leaking water in the bedroom. Need it fixed this weekend, Andheri West." style={{ fontSize: 18, minHeight: 170, lineHeight: 26 }} />
                {hint(E, `${text.trim().length} characters · plain language is perfect`, 'Add a little more — at least a sentence.')}
                {sg && (
                  <Row gap={6}>
                    <Tag tone="lime" label={sg} />
                    {/(plumb|electric|clean|\bac\b|leak|laptop|repair|near)/i.test(text) && <Tag label="On-site" />}
                  </Row>
                )}
                <T size={14} weight={600} style={{ marginTop: 6 }}>Or start from</T>
                <View style={{ gap: 8 }}>
                  {STARTERS.map(([label, full]) => (
                    <Opt key={label} on={false} radio={false} onPress={() => { setText(full); touch(); }} style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14 }}>
                      <T size={14}>{label}</T>
                    </Opt>
                  ))}
                </View>
              </>
            )}

            {i === 1 && (
              <>
                <H1>Pick a category</H1>
                {sg && <T size={13} color="muted">We suggest <T size={13} weight={600}>{sg}</T> from your description.</T>}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {CATS.map((x) => (
                    <Opt key={x} on={x === category} radio={false} onPress={() => { setCat(x); touch(); }} style={{ width: '48.5%', flexDirection: 'column', alignItems: 'flex-start', gap: 6, paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14 }}>
                      <T size={14} weight={600}>{x}</T>
                      {x === sg && <Tag tone="lime" label="Suggested" />}
                    </Opt>
                  ))}
                </View>
                {E && hint(true, '', 'Pick a category to continue.')}
              </>
            )}

            {i === 2 && (
              <>
                <H1>Requirements</H1>
                <View style={{ gap: 6 }}>
                  <T size={14} weight={600}>Title</T>
                  <Field value={title} onChangeText={(v) => { setTitle(v); touch(); }} error={E && title.trim().length <= 4} />
                </View>
                <View style={{ gap: 8 }}>
                  <T size={14} weight={600}>Deliverables</T>
                  {deliv.map((d, k) => (
                    <Row key={k} gap={8}>
                      <Field style={{ flex: 1 }} value={d} placeholder="What you'll receive" accessibilityLabel={`Deliverable ${k + 1}`} onChangeText={(v) => { const n = deliv.slice(); n[k] = v; setDeliv(n); touch(); }} />
                      <IconBtn size={50} label={`Remove deliverable ${k + 1}`} onPress={() => setDeliv(deliv.length > 1 ? deliv.filter((_, j) => j !== k) : [''])}>
                        <T size={20}>−</T>
                      </IconBtn>
                    </Row>
                  ))}
                  <Btn variant="ghost" sm label="+ Add deliverable" style={{ alignSelf: 'flex-start' }} onPress={() => setDeliv(deliv.concat(''))} />
                  {hint(E, 'One line each — what you will actually receive.', 'Add a title and at least one deliverable.')}
                </View>
                <View style={{ gap: 6 }}>
                  <T size={14} weight={600}>Done means…</T>
                  <Field multiline placeholder="e.g. No leak for 48 hours after the visit" />
                </View>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.line2 }}>
                  <Icon name="upload" size={20} color={c.ink2} />
                  <T size={14} color="ink2">Add photos or files</T>
                </Pressable>
              </>
            )}

            {i === 3 && (
              <>
                <H1>Budget</H1>
                <Row gap={8}>
                  <Opt on={pType === 'fixed'} onPress={() => { setPType('fixed'); touch(); }} title="Fixed" style={{ flex: 1 }} />
                  <Opt on={pType === 'range'} onPress={() => { setPType('range'); touch(); }} title="Range" style={{ flex: 1 }} />
                </Row>
                {pType === 'fixed' ? (
                  <View>
                    <T size={22} mono color="muted" style={{ position: 'absolute', left: 16, top: 20, zIndex: 1 }}>₹</T>
                    <Field mono keyboardType="number-pad" accessibilityLabel="Budget in rupees" value={budget} onChangeText={(v) => { setBudget(v); touch(); }} error={E} style={{ paddingLeft: 38, fontSize: 28, minHeight: 68 }} />
                  </View>
                ) : (
                  <Row gap={8}>
                    <View style={{ flex: 1, gap: 6 }}><T size={14} weight={600}>From</T><Field mono keyboardType="number-pad" value={bMin} onChangeText={(v) => { setBMin(v); touch(); }} error={E} /></View>
                    <View style={{ flex: 1, gap: 6 }}><T size={14} weight={600}>To</T><Field mono keyboardType="number-pad" value={bMax} onChangeText={(v) => { setBMax(v); touch(); }} error={E} /></View>
                  </Row>
                )}
                {hint(E, total ? `Workers see ${pType === 'fixed' ? inr(total) : inr(toNum(bMin)) + '–' + inr(total)}. GST may apply.` : 'Amounts in Indian rupees.', pType === 'range' ? '“To” must be at least “From”.' : 'Enter a budget in rupees.')}
                <Card r={16} style={{ gap: 10 }}>
                  <Row between>
                    <T size={14} weight={600}>Indicative · {category || 'General'}</T>
                    <Tag label="Illustrative" dashed />
                  </Row>
                  <View style={{ height: 28, justifyContent: 'center' }}>
                    <View style={{ height: 6, borderRadius: 6, backgroundColor: c.line }} />
                    <View style={{ position: 'absolute', left: '22%', right: '30%', height: 6, borderRadius: 6, backgroundColor: c.ink }} />
                    <View style={{ position: 'absolute', left: `${total ? Math.max(4, Math.min(96, ((total - g[0]) / (g[2] - g[0])) * 100)) : 50}%`, marginLeft: -12, width: 24, height: 24, borderRadius: 12, backgroundColor: c.lime, borderWidth: 3, borderColor: c.surface }} />
                  </View>
                  <Row between>
                    <T size={12} mono color="muted">{inr(g[0])}</T>
                    <T size={12} mono color="muted">~{inr(g[1])}</T>
                    <T size={12} mono color="muted">{inr(g[2])}+</T>
                  </Row>
                  <T size={12} color="muted">Not based on real market data in this prototype. You decide.</T>
                </Card>
              </>
            )}

            {i === 4 && (
              <>
                <H1>When do you need it?</H1>
                <Row gap={8} wrap>
                  {([['Tomorrow', 1], ['In 3 days', 3], ['In a week', 7], ['In 2 weeks', 14]] as const).map(([n, k]) => (
                    <Chip key={n} label={n} on={quick === k} onPress={() => { setQuick(k); setDate(iso(addDays(k))); touch(); }} />
                  ))}
                </Row>
                <T size={14} weight={600}>Or pick a date</T>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                  {Array.from({ length: 21 }).map((_, k) => {
                    const d = addDays(k + 1);
                    const on = date === iso(d);
                    return (
                      <Pressable key={k} onPress={() => { setDate(iso(d)); setQuick(null); touch(); }} style={{ width: 56, height: 64, borderRadius: 14, borderWidth: 1, borderColor: on ? c.ink : c.line, backgroundColor: on ? c.ink : c.surface, alignItems: 'center', justifyContent: 'center' }}>
                        <T size={11} weight={600} color={on ? c.bg : c.muted} style={{ textTransform: 'uppercase' }}>{d.toLocaleDateString('en-IN', { weekday: 'short' })}</T>
                        <T size={18} mono weight={600} color={on ? c.bg : c.ink}>{d.getDate()}</T>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                <T size={14} weight={600}>Time (IST)</T>
                <Row gap={8} wrap>
                  {TIMES.map((t) => <Chip key={t} label={t} on={time === t} onPress={() => { setTime(t); touch(); }} />)}
                </Row>
                {hint(E, date ? `Due ${fmtDate(date)}, ${time} IST` : 'Shorter deadlines may get fewer proposals.', 'Pick a deadline date.')}
              </>
            )}

            {i === 5 && (
              <>
                <H1>Where will it happen?</H1>
                <View style={{ gap: 8 }}>
                  {([['remote', 'Remote', 'Online, from anywhere in India'], ['onsite', 'On-site', 'Someone comes to you'], ['hybrid', 'Hybrid', 'Mostly online, with a visit']] as const).map((w) => (
                    <Opt key={w[0]} on={wtype === w[0]} onPress={() => { setWtype(w[0]); touch(); }} title={w[1]} sub={w[2]} />
                  ))}
                </View>
                {wtype !== 'remote' && (
                  <View style={{ gap: 6 }}>
                    <T size={14} weight={600}>Service area</T>
                    <Field value={area} onChangeText={(v) => { setArea(v); touch(); }} placeholder="e.g. Andheri West, Mumbai" error={E} />
                    {hint(E, 'Only the neighbourhood is public. Your address goes to the person you hire, after hiring.', 'Add the neighbourhood and city.')}
                  </View>
                )}
              </>
            )}

            {i === 6 && (
              <>
                <H1>Split the payment</H1>
                <Row gap={8} wrap>
                  {([[1, 'Single'], [2, '2 milestones'], [3, '3 milestones']] as const).map(([k, n]) => <Chip key={k} label={n} on={msN === k} onPress={() => { setMsN(k); touch(); }} />)}
                </Row>
                {msT.map((t, k) => (
                  <Card key={t} pad={14} r={16}>
                    <Row gap={12}>
                      <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}><T size={12} mono>{k + 1}</T></View>
                      <T weight={550} style={{ flex: 1 }}>{t}</T>
                      <T mono weight={600}>{total ? inr(Math.round(total * split[k])) : '—'}</T>
                    </Row>
                  </Card>
                ))}
                <View style={{ padding: 16, borderRadius: 16, backgroundColor: c.bg2, gap: 8 }}>
                  <T size={14} weight={600}>How paying works</T>
                  {['1 · After hiring, you pay each milestone through [PAYMENT PARTNER].', '2 · The worker delivers; you approve or ask for changes.', "3 · Approved milestones become eligible for payout under the partner's terms."].map((l) => <T key={l} size={14} lh={1.5} color="ink2">{l}</T>)}
                  <T size={12} color="muted">Whether funds are held before release depends on the partner arrangement. Nothing is charged here.</T>
                </View>
              </>
            )}

            {i === 7 && (
              <>
                <H1>Review</H1>
                <View style={{ borderRadius: 22, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, overflow: 'hidden' }}>
                  <View style={{ padding: 18, gap: 10, borderBottomWidth: 1, borderColor: c.line }}>
                    <Row gap={6} wrap>
                      <Tag label={category || 'General'} />
                      <Tag label={wtype === 'remote' ? 'Remote' : (wtype === 'onsite' ? 'On-site' : 'Hybrid') + (area ? ' · ' + area : '')} />
                    </Row>
                    <T size={21} weight={650} tracking={-0.025} lh={1.25}>{title}</T>
                    <T size={28} weight={600} mono>{pType === 'fixed' ? inr(toNum(budget)) : inr(toNum(bMin)) + '–' + inr(toNum(bMax))}</T>
                  </View>
                  <View style={{ paddingHorizontal: 18, paddingTop: 4, paddingBottom: 10 }}>
                    {[
                      { k: 'Deliverables', v: deliv.filter((d) => d.trim()).join(' · ') || '—', s: 2 },
                      { k: 'Deadline', v: date ? `${fmtDate(date)}, ${time}` : '—', s: 4 },
                      { k: 'Where', v: wtype === 'remote' ? 'Remote' : area, s: 5 },
                      { k: 'Payment', v: msN === 1 ? 'Single milestone' : `${msN} milestones`, s: 6 },
                    ].map((r) => (
                      <Row key={r.k} gap={10} style={{ paddingVertical: 12, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: c.line2 }}>
                        <T size={13} color="muted" style={{ width: 96 }}>{r.k}</T>
                        <T size={14} style={{ flex: 1 }}>{r.v}</T>
                        <Pressable accessibilityLabel={`Edit ${r.k}`} onPress={() => setI(r.s)} style={{ minHeight: 36, justifyContent: 'center' }}>
                          <T size={13} color="ink2" style={{ textDecorationLine: 'underline' }}>Edit</T>
                        </Pressable>
                      </Row>
                    ))}
                  </View>
                </View>
                <T size={13} color="muted" lh={1.45}>Workers see your first name, area and verification. Phone and exact address stay private.</T>
              </>
            )}
          </Rise>
        </ScrollView>

        <Animated.View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, borderTopWidth: 1, borderColor: c.line, transform: [{ translateX: shake }] }}>
          <Btn variant="ghost" label="Back" disabled={i === 0} style={{ width: 96 }} onPress={() => { setI(Math.max(0, i - 1)); setErr(false); }} />
          <Btn variant={i === 7 ? 'lime' : 'primary'} label={i === 7 ? 'Publish task' : 'Continue'} style={{ flex: 1 }} onPress={next} />
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
