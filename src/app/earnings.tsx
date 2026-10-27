import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutAnimation, Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '../components/Icon';
import { Card, Chip, H2, IconBtn, Row, Screen, Seg, T, Tag, type Tone } from '../components/ui';
import { inr } from '../data/mock';
import { useColors } from '../store/AppStore';

type Tx = { date: string; desc: string; type: string; st: string; tone: Tone; amt: string; muted?: boolean; kind: 'payout' | 'fee' | 'refund' };

const MONTHS: [string, number][] = [['May', 6400], ['Jun', 9800], ['Jul', 7200], ['Aug', 12600], ['Sep', 10400], ['Oct', 18450]];
const WTX: Tx[] = [
  { date: '27 Oct', desc: 'Milestone 1 · Mehta Handlooms', type: 'Payout', st: '◔ Processing', tone: 'warn', amt: '+₹3,150', kind: 'payout' },
  { date: '27 Oct', desc: 'Platform fee · M1', type: 'Fee (placeholder 10%)', st: '✓ Settled', tone: 'neutral', amt: '−₹350', muted: true, kind: 'fee' },
  { date: '18 Oct', desc: 'Zoho Books setup', type: 'Payout', st: '✓ Payout completed', tone: 'lime', amt: '+₹2,700', kind: 'payout' },
  { date: '09 Oct', desc: 'React checkout fix', type: 'Payout', st: '✓ Payout completed', tone: 'lime', amt: '+₹12,600', kind: 'payout' },
  { date: '02 Oct', desc: 'Cancelled before start', type: 'Adjustment', st: '✓ Settled', tone: 'neutral', amt: '₹0', muted: true, kind: 'refund' },
];
const CTX: Tx[] = [
  { date: '25 Oct', desc: 'Explainer · Milestone 1', type: 'Payment to Kabir', st: 'Payment collected', tone: 'info', amt: '₹3,000', kind: 'payout' },
  { date: '25 Oct', desc: 'Service fee', type: 'Fee · [RATE]', st: '✓ Settled', tone: 'neutral', amt: '₹90', muted: true, kind: 'fee' },
  { date: '14 Sep', desc: 'Office photos · partial refund', type: 'Refund · case decision', st: '✓ Refunded', tone: 'lime', amt: '+₹1,500', kind: 'refund' },
];
const FAQ = [
  { q: 'What does “Payment collected” mean?', a: 'The customer paid for that milestone and [PAYMENT PARTNER] confirmed it. It becomes eligible for release when the work is approved.' },
  { q: 'Approved, but not paid out yet?', a: 'The partner processes the release; bank transfers usually take 1–2 working days, longer over weekends and bank holidays.' },
  { q: 'Does a deadline passing release payment?', a: 'No. Payment follows approval of the work or a dispute outcome — never just the calendar.' },
];

function Bar({ h, color, delay }: { h: number; color: string; delay: number }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: h, duration: 900, delay, easing: Easing.bezier(0.2, 0.8, 0.2, 1), useNativeDriver: false }).start();
  }, [a, h, delay]);
  return <Animated.View style={{ width: '100%', height: a, backgroundColor: color, borderTopLeftRadius: 7, borderTopRightRadius: 7, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }} />;
}

function TxRow({ t }: { t: Tx }) {
  const c = useColors();
  return (
    <Row between gap={12} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: c.line }}>
      <View style={{ flex: 1, gap: 4 }}>
        <T size={14} weight={550}>{t.desc}</T>
        <T size={12} color="muted">{t.date} · {t.type}</T>
        <Tag tone={t.tone} label={t.st} />
      </View>
      <T mono weight={600} color={t.muted ? 'muted' : 'ink'}>{t.amt}</T>
    </Row>
  );
}

export default function Earnings() {
  const c = useColors();
  const [as, setAs] = useState<'w' | 'c'>('w');
  const [f, setF] = useState<'all' | Tx['kind']>('all');
  const [dl, setDl] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [k, setK] = useState(0);
  const W = as === 'w';

  // Count-up for the headline numbers.
  useEffect(() => {
    const t0 = Date.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / 900);
      setK(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const list = (W ? WTX : CTX).filter((t) => f === 'all' || t.kind === f);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, gap: 12 }}>
        <Row gap={12}>
          <IconBtn icon="back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/profile'))} />
          <T size={26} weight={650} tracking={-0.04} style={{ flex: 1 }}>Payments</T>
          <Tag label="Demo data" dashed />
        </Row>
        <Seg options={[{ key: 'w', label: 'Earnings' }, { key: 'c', label: 'Spending' }]} value={as} onChange={(v) => { setAs(v); setF('all'); }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 4, paddingBottom: 28, gap: 18 }}>
        {W ? (
          <>
            <View style={{ marginHorizontal: 16, padding: 20, borderRadius: 22, backgroundColor: c.ink, gap: 6 }}>
              <T size={13} color={c.bg} style={{ opacity: 0.7 }}>Paid out in 2026 · confirmed</T>
              <T size={40} weight={600} mono tracking={-0.035} color={c.bg}>{inr(64850 * k)}</T>
              <T size={12} color={c.bg} style={{ opacity: 0.65 }}>Net of platform fees · arrives in HDFC ·· 4821</T>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
              {[{ tag: '◔ Pending', tone: 'info' as Tone, v: inr(4500 * k), sub: 'M2 payment collected · released after approval' }, { tag: '◔ Processing', tone: 'warn' as Tone, v: inr(3150 * k), sub: 'M1 payout · usually 1–2 working days' }, { tag: 'Eligible', tone: 'neutral' as Tone, v: '₹0', sub: 'Approved, awaiting release' }].map((t) => (
                <Card key={t.tag} pad={14} style={{ width: 168, gap: 6 }}>
                  <Tag tone={t.tone} label={t.tag} />
                  <T size={22} weight={600} mono>{t.v}</T>
                  <T size={12} color="muted" lh={1.4}>{t.sub}</T>
                </Card>
              ))}
            </ScrollView>
            <Card style={{ marginHorizontal: 16, gap: 12 }}>
              <Row between>
                <H2>Paid out per month</H2>
                <T size={12} color="muted">May–Oct</T>
              </Row>
              <View accessibilityLabel={'Monthly payouts: ' + MONTHS.map((m) => `${m[0]} ${inr(m[1])}`).join(', ')} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end', height: 150, borderBottomWidth: 1, borderColor: c.line2 }}>
                {MONTHS.map(([mon, v], i) => (
                  <View key={mon} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6, height: '100%' }}>
                    <T size={10} mono color="ink2">{(v / 1000).toFixed(1)}k</T>
                    <Bar h={Math.round((v / 20000) * 120)} color={i === MONTHS.length - 1 ? c.lime : c.ink} delay={i * 70} />
                  </View>
                ))}
              </View>
              <Row gap={10}>
                {MONTHS.map(([mon]) => <T key={mon} size={11} color="muted" center style={{ flex: 1 }}>{mon}</T>)}
              </Row>
            </Card>
            <View style={{ paddingHorizontal: 16 }}>
              <H2 style={{ marginBottom: 4 }}>Upcoming</H2>
              {[{ t: 'M2 · Mehta Handlooms', s: 'Payment collected', tone: 'info' as Tone, a: '₹4,500' }, { t: 'M3 · Mehta Handlooms', s: 'Awaiting payment', tone: 'neutral' as Tone, a: '₹2,700' }].map((u) => (
                <Row key={u.t} between style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: c.line }}>
                  <View style={{ gap: 4 }}>
                    <T size={14} weight={550}>{u.t}</T>
                    <Tag tone={u.tone} label={u.s} />
                  </View>
                  <T mono weight={600}>{u.a}</T>
                </Row>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={{ paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[{ k: 'Paid for active milestones', v: '₹6,000', s: 'Held per partner terms [TO CONFIRM]' }, { k: 'Upcoming commitments', v: '₹4,500', s: 'Not charged until funded' }, { k: 'Spent in 2026', v: '₹21,300', s: '5 completed tasks' }, { k: 'Refunded', v: '₹1,500', s: '1 partial refund' }].map((t) => (
                <Card key={t.k} pad={14} style={{ width: '48.5%', gap: 4 }}>
                  <T size={12} color="muted" lh={1.35}>{t.k}</T>
                  <T size={22} weight={600} mono>{t.v}</T>
                  <T size={11} color="muted" lh={1.4}>{t.s}</T>
                </Card>
              ))}
            </View>
            <View style={{ paddingHorizontal: 16 }}>
              <H2 style={{ marginBottom: 4 }}>Milestone commitments</H2>
              {[{ t: 'Explainer · M1', s: 'In review — approve?', tone: 'warn' as Tone, a: '₹3,000' }, { t: 'Explainer · M2', s: 'Not yet funded', tone: 'neutral' as Tone, a: '₹4,500' }].map((u) => (
                <Row key={u.t} between style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: c.line }}>
                  <View style={{ gap: 4 }}>
                    <T size={14} weight={550}>{u.t}</T>
                    <Tag tone={u.tone} label={u.s} />
                  </View>
                  <T mono weight={600}>{u.a}</T>
                </Row>
              ))}
            </View>
          </>
        )}

        <View style={{ gap: 10 }}>
          <H2 style={{ paddingHorizontal: 16 }}>{W ? 'Transactions' : 'Payment history'}</H2>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
            {([['all', 'All'], ['payout', W ? 'Payouts' : 'Payments'], ['fee', 'Fees'], ['refund', W ? 'Adjustments' : 'Refunds']] as const).map(([key, n]) => <Chip key={key} label={n} on={f === key} onPress={() => setF(key)} />)}
          </ScrollView>
          <View style={{ paddingHorizontal: 16 }}>
            {list.map((t) => <TxRow key={t.desc} t={t} />)}
            {list.length === 0 && <T size={14} color="muted">Nothing of this type yet.</T>}
          </View>
          <Pressable onPress={() => setDl(true)} style={{ marginHorizontal: 16, minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: c.line2, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}>
            <T size={15} weight={560}>{dl ? 'Statements are demo-only in this prototype' : 'Download statement / receipts'}</T>
          </Pressable>
        </View>

        <Card style={{ marginHorizontal: 16, gap: 4 }}>
          <H2 style={{ marginBottom: 6 }}>{W ? 'Payout methods' : 'Payment methods'}</H2>
          {[['HDFC Bank ·· 4821', 'Primary', '✓ Verified', 'lime'], ['ananya@okaxis · UPI', 'Backup', '◔ Verifying', 'warn'], ['PAN · identity', '', '✓ Verified', 'lime']].map(([a, b, tag, tone], i) => (
            <Row key={a} between style={{ paddingVertical: 12, borderBottomWidth: i < 2 ? 1 : 0, borderColor: c.line }}>
              <View>
                <T weight={550}>{a}</T>
                {!!b && <T size={12} color="muted">{b}</T>}
              </View>
              <Tag tone={tone as Tone} label={tag} />
            </Row>
          ))}
          <T size={12} color="muted">Checks by [VERIFICATION PARTNER]. Documents are never shown to customers.</T>
        </Card>

        <View style={{ paddingHorizontal: 16 }}>
          <H2 style={{ marginBottom: 4 }}>Why is a payment taking a while?</H2>
          {FAQ.map((x, i) => (
            <View key={x.q} style={{ borderBottomWidth: 1, borderColor: c.line }}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: openFaq === i }} onPress={() => { LayoutAnimation.easeInEaseOut(); setOpenFaq(openFaq === i ? null : i); }} style={{ minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <T size={15} weight={550} style={{ flex: 1 }}>{x.q}</T>
                <View style={{ transform: [{ rotate: openFaq === i ? '180deg' : '0deg' }] }}><Icon name="chevD" size={16} color={c.ink} stroke={2} /></View>
              </Pressable>
              {openFaq === i && <T size={14} color="ink2" lh={1.55} style={{ paddingBottom: 14 }}>{x.a}</T>}
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
