import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Avatar, Btn, Card, Eyebrow, Field, IconBtn, Opt, Progress, Rise, Row, Screen, Seg, Sheet, T, Tag, type Tone } from '../components/ui';
import { useColors } from '../store/AppStore';

type M2 = 'progress' | 'submitted' | 'approved';
type Pay = 'collected' | 'processing' | 'eligible';
type Dialog = 'submit' | 'approve' | 'revise' | null;
type Tab = 'ms' | 'scope' | 'upd' | 'issue';

const PIPE = ['Open', 'Proposals', 'Hired', 'In progress', 'Submitted', 'In review', 'Completed'];
const REASONS = ["Work doesn't match the scope", 'Deadline missed without agreement', 'No response to a submission', 'Payment issue', 'Something else'];
const STEPS: [string, string][] = [['Case opened', 'Both notified; scope and records attached'], ['Other party responds', 'Due within 3 days · 29 Oct, 6 pm IST'], ['Support review', 'A neutral reviewer reads both sides'], ['Decision', 'Outcome with reasoning, applied to M2 only'], ['Appeal window', '7 days to appeal with new evidence']];
const CASE_TAGS: [Tone, string][] = [['warn', 'Opened'], ['warn', 'Awaiting response'], ['info', 'Under review'], ['lime', 'Decision made'], ['neutral', 'Closed']];
const SUPPORT = ["We've paused milestone 2 and asked Rohan to respond by 29 Oct. Approved milestones aren't affected.", "Rohan responded with two screenshots. You can both see each other's submissions.", "We're reviewing the scope, preview store and messages.", 'Decision: 30 of 40 products delivered as agreed. 75% of M2 is released to you; the rest moves to a revised milestone if you both agree.', 'Case closed. You can still raise a new issue for other milestones.'];

type Update = { ini: string; bg: string; text: string; when: string; file?: string };

export default function Contract() {
  const c = useColors();
  const [as, setAs] = useState<'w' | 'c'>('w');
  const [tab, setTab] = useState<Tab>('ms');
  const [m2, setM2] = useState<M2>('progress');
  const [pay, setPay] = useState<Pay>('collected');
  const [rev, setRev] = useState(0);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [upd, setUpd] = useState('');
  const [updates, setUpdates] = useState<Update[]>([]);
  const [reason, setReason] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [tried, setTried] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const W = as === 'w';
  const disputed = step >= 0 && step < 4;
  const stage = disputed ? 3 : m2 === 'submitted' ? 4 : 3;
  const payInfo: Record<Pay, [string, Tone]> = { collected: ['Payment collected', 'info'], processing: ['Waiting for partner confirmation', 'warn'], eligible: ['Eligible for release · simulated', 'lime'] };
  const overall: [Tone, string] = disputed ? ['danger', '! Disputed · paused'] : m2 === 'submitted' ? ['warn', '↑ M2 submitted'] : ['lime', '▶ In progress'];

  const D = {
    submit: { title: 'Submit milestone 2?', body: 'Rohan will be asked to review the product catalogue.', note: 'Note + preview link', cta: 'Submit for review', variant: 'lime' as const, run: () => setM2('submitted') },
    approve: {
      title: 'Approve milestone 2?', body: "Confirms the catalogue meets the agreed scope. ₹5,000 then becomes eligible for release under [PAYMENT PARTNER]'s terms. This can't be undone.", note: '', cta: 'Approve milestone', variant: 'lime' as const,
      run: () => {
        setM2('approved');
        setPay('processing');
        timer.current = setTimeout(() => setPay('eligible'), 2600);
      },
    },
    revise: { title: 'Request a revision', body: "Be specific about what doesn't match the scope. Revision 1 of 2.", note: 'What needs to change?', cta: 'Send request', variant: 'primary' as const, run: () => { setM2('progress'); setRev(rev + 1); } },
  };
  const dlg = dialog ? D[dialog] : null;

  const actions: { n: string; variant: 'lime' | 'ghost'; run: () => void }[] = disputed
    ? []
    : W
      ? m2 === 'progress' ? [{ n: 'Submit milestone', variant: 'lime', run: () => setDialog('submit') }, { n: 'Post update', variant: 'ghost', run: () => setTab('upd') }] : []
      : m2 === 'submitted' ? [{ n: 'Approve', variant: 'lime', run: () => setDialog('approve') }, { n: 'Request revision', variant: 'ghost', run: () => setDialog('revise') }] : [];

  const ms = [
    { mark: '✓', dotBg: c.ink, dotFg: c.bg, title: 'Theme & brand setup', due: 'Fri 1 Nov', amt: '₹3,500', work: ['✓ Delivered', 'neutral'], rev: ['✓ Approved', 'lime'], pay: ['◔ Payout processing', 'warn'], waiting: false, prog: 0, note: '', actions: [] as typeof actions },
    {
      mark: '2', dotBg: c.lime, dotFg: '#101010', title: 'Product catalogue (40)', due: 'Mon 4 Nov', amt: '₹5,000',
      work: disputed ? ['‖ Paused', 'danger'] : m2 === 'progress' ? ['▶ In progress', 'lime'] : m2 === 'submitted' ? ['↑ Submitted', 'warn'] : ['✓ Delivered', 'neutral'],
      rev: m2 === 'submitted' ? ['◎ Awaiting review', 'warn'] : m2 === 'approved' ? ['✓ Approved', 'lime'] : rev ? [`↺ Revision ${rev}`, 'info'] : ['— Not submitted', 'neutral'],
      pay: payInfo[pay], waiting: pay === 'processing', prog: m2 === 'progress' && !disputed ? (rev ? 85 : 45) : 0,
      note: m2 === 'submitted' ? 'Ananya: “All 40 products are live on the preview store with variants.”' : '', actions,
    },
    { mark: '3', dotBg: c.surface, dotFg: c.ink, title: 'Payments & launch', due: 'Sat 9 Nov', amt: '₹3,000', work: ['○ Not started', 'neutral'], rev: ['—', 'neutral'], pay: ['Awaiting payment', 'neutral'], waiting: false, prog: 0, note: '', actions: [] as typeof actions },
  ];

  const baseUpdates: Update[] = [
    { ini: 'AI', bg: '#D9E4C4', text: '28 of 40 products imported. Need silk colour names.', when: 'Today, 11:20' },
    { ini: 'RM', bg: '#F0D9B5', text: 'Shared silk colour names.', when: 'Yesterday', file: ' · silk-colours.xlsx' },
    { ini: 'AI', bg: '#D9E4C4', text: 'Milestone 1 delivered: theme live on preview.', when: '26 Oct', file: ' · theme-preview.png' },
  ];
  const tg = CASE_TAGS[Math.max(0, step)];

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
        <Row gap={12}>
          <IconBtn icon="back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
          <View style={{ flex: 1, gap: 4 }}>
            <Tag tone={overall[0]} label={overall[1]} />
            <T size={18} weight={640} tracking={-0.02}>Shopify store · Mehta Handlooms</T>
          </View>
          <IconBtn icon="msg" iconSize={18} label="Open conversation" onPress={() => router.push('/chat/0')} />
        </Row>
        <Row between>
          <T size={12} color="muted">Viewing as</T>
          <Seg style={{ width: 200 }} options={[{ key: 'w', label: 'Worker' }, { key: 'c', label: 'Customer' }]} value={as} onChange={setAs} />
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingVertical: 6 }}>
          {PIPE.map((l, k) => {
            const done = k < stage;
            const cur = k === stage;
            return (
              <Row key={l} gap={0}>
                <Row gap={6}>
                  <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: done || cur ? c.ink : c.line2, backgroundColor: done ? c.ink : cur ? c.lime : c.surface, alignItems: 'center', justifyContent: 'center' }}>
                    {done && <T size={10} color={c.bg}>✓</T>}
                  </View>
                  <T size={12} weight={cur ? 650 : 400} color={cur ? 'ink' : done ? 'ink2' : 'muted'}>{l}</T>
                </Row>
                {k < PIPE.length - 1 && <View style={{ width: 14, height: 1.5, backgroundColor: c.line2, marginHorizontal: 4 }} />}
              </Row>
            );
          })}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, borderBottomWidth: 1, borderColor: c.line }} contentContainerStyle={{ paddingHorizontal: 6 }}>
          {([['ms', 'Milestones'], ['scope', 'Scope & fees'], ['upd', 'Updates'], ['issue', disputed ? 'Dispute · open' : 'Report issue']] as const).map(([k, n]) => (
            <Pressable key={k} accessibilityRole="tab" accessibilityState={{ selected: tab === k }} onPress={() => setTab(k)} style={{ minHeight: 46, paddingHorizontal: 14, justifyContent: 'center' }}>
              <T size={14} weight={580} color={tab === k ? 'ink' : 'muted'}>{n}</T>
              {tab === k && <View style={{ position: 'absolute', left: 10, right: 10, bottom: 0, height: 2, borderRadius: 2, backgroundColor: c.ink }} />}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 12 }} keyboardShouldPersistTaps="handled">
        {tab === 'ms' && (
          <>
            {ms.map((m, i) => (
              <Rise key={m.title} delay={i * 50}>
                <Card style={{ gap: 12 }}>
                  <Row gap={12} center={false}>
                    <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: m.dotBg, borderWidth: 1, borderColor: c.line2, alignItems: 'center', justifyContent: 'center' }}>
                      <T size={13} weight={600} mono color={m.dotFg}>{m.mark}</T>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <T size={15} weight={600}>{m.title}</T>
                      <T size={12} color="muted">Due {m.due}</T>
                    </View>
                    <T size={16} weight={600} mono>{m.amt}</T>
                  </Row>
                  <Row gap={8} center={false}>
                    <View style={{ flex: 1, gap: 4 }}><T size={11} color="muted">Work</T><Tag tone={m.work[1] as Tone} label={m.work[0]} /></View>
                    <View style={{ flex: 1, gap: 4 }}><T size={11} color="muted">Review</T><Tag tone={m.rev[1] as Tone} label={m.rev[0]} /></View>
                  </Row>
                  <View style={{ gap: 4 }}>
                    <T size={11} color="muted">Payment</T>
                    <Row gap={6}>
                      {m.waiting && <ActivityIndicator size="small" color={c.warn} />}
                      <Tag tone={m.pay[1] as Tone} label={m.pay[0]} />
                    </Row>
                  </View>
                  {m.prog > 0 && (
                    <View style={{ gap: 6 }}>
                      <Row between><T size={12} color="muted">Progress</T><T size={12} mono color="muted">{m.prog}%</T></Row>
                      <Progress pct={m.prog} />
                    </View>
                  )}
                  {!!m.note && <View style={{ padding: 12, borderRadius: 12, backgroundColor: c.bg2 }}><T size={13} lh={1.5} color="ink2">{m.note}</T></View>}
                  {m.actions.length > 0 && (
                    <Row gap={8}>
                      {m.actions.map((a) => <Btn key={a.n} sm variant={a.variant} label={a.n} style={{ flex: 1 }} onPress={a.run} />)}
                    </Row>
                  )}
                </Card>
              </Rise>
            ))}
            <T size={12} color="muted" lh={1.5}>Payment statuses change only on a confirmed event from [PAYMENT PARTNER] — simulated here, and labelled. Work is never marked complete just because a deadline passes.</T>
          </>
        )}

        {tab === 'scope' && (
          <>
            <Rise><Card style={{ gap: 14 }}>
              <Eyebrow>Agreed scope</Eyebrow>
              <T size={15} lh={1.6} color="ink2">Shopify store with the customer's branding; 40 sarees with fabric and colour variants from the sheet; Razorpay (UPI, cards, COD) and India shipping; one 20-minute handover. Two revision rounds per milestone.</T>
            </Card></Rise>
            <Rise delay={50}><Card style={{ gap: 10 }}>
              <Row between><T size={14} color="muted">Contract price</T><T size={14} mono weight={600}>₹11,500</T></Row>
              <Row between><T size={14} color="muted">Platform fee (worker, placeholder 10%)</T><T size={14} mono>− ₹1,150</T></Row>
              <Row between style={{ borderTopWidth: 1, borderStyle: 'dashed', borderColor: c.line2, paddingTop: 10 }}><T size={14} weight={650}>Worker net</T><T size={14} mono weight={650}>₹10,350</T></Row>
              <Row between><T size={14} color="muted">Deadline</T><T size={14} color="muted">Sat 9 Nov, 6 pm IST</T></Row>
            </Card></Rise>
          </>
        )}

        {tab === 'upd' && (
          <>
            <Row gap={8}>
              <Field style={{ flex: 1 }} placeholder="Post an update for the record" value={upd} onChangeText={setUpd} accessibilityLabel="Post an update" />
              <Btn label="Post" onPress={() => {
                if (!upd.trim()) return;
                setUpdates([{ ini: W ? 'AI' : 'RM', bg: W ? '#D9E4C4' : '#F0D9B5', text: upd.trim(), when: 'Just now (demo)' }, ...updates]);
                setUpd('');
              }} />
            </Row>
            {[...updates, ...baseUpdates].map((u, i) => (
              <Rise key={i + u.text}>
                <Card pad={14} style={{ flexDirection: 'row', gap: 12 }}>
                  <Avatar ini={u.ini} bg={u.bg} size={34} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <T size={14} lh={1.5}>{u.text}</T>
                    <T size={12} color="muted">{u.when}{u.file ?? ''}</T>
                  </View>
                </Card>
              </Rise>
            ))}
          </>
        )}

        {tab === 'issue' && (step < 0 ? (
          <Rise style={{ gap: 14 }}>
            <T size={14} lh={1.55} color="ink2">Most issues resolve with a message. If not, a neutral reviewer looks at the agreed scope, milestone records and both sides.</T>
            <T size={15} weight={600}>What's the issue?</T>
            <View style={{ gap: 8 }}>
              {REASONS.map((r) => <Opt key={r} on={reason === r} onPress={() => setReason(r)} style={{ padding: 14, borderRadius: 14 }}><T size={14} style={{ flex: 1 }}>{r}</T></Opt>)}
            </View>
            <T size={15} weight={600}>What happened?</T>
            <Field multiline placeholder="Facts only: what was agreed, delivered, missing." />
            <View style={{ padding: 14, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.line2 }}>
              <T size={13} color="ink2">Add evidence — messages & milestone records attach automatically</T>
            </View>
            <T size={12} color={tried && !reason ? 'danger' : 'muted'}>{tried && !reason ? 'Choose what the issue is.' : 'Both parties see the case. Facts help more than blame.'}</T>
            <Btn label="Open a case" onPress={() => (reason ? setStep(0) : setTried(true))} />
          </Rise>
        ) : (
          <Rise><Card style={{ gap: 16 }}>
            <Row between center={false}>
              <View style={{ flex: 1, gap: 2 }}>
                <T size={12} mono color="muted">Case #TK-D-0193 · M2</T>
                <T size={17} weight={620}>{reason}</T>
              </View>
              <Tag tone={tg[0]} label={tg[1]} />
            </Row>
            <View>
              {STEPS.map(([t, s], k) => (
                <Row key={t} gap={12} center={false}>
                  <View style={{ alignItems: 'center', width: 22 }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: c.line2, backgroundColor: k < step ? c.ink : k === step ? c.lime : c.surface, alignItems: 'center', justifyContent: 'center' }}>
                      <T size={10} color={k < step ? c.bg : '#101010'}>{k < step ? '✓' : k === step ? '●' : ''}</T>
                    </View>
                    {k < STEPS.length - 1 && <View style={{ flex: 1, width: 1.5, backgroundColor: c.line2, minHeight: 12 }} />}
                  </View>
                  <View style={{ flex: 1, paddingBottom: 14, gap: 2 }}>
                    <T size={14} weight={k === step ? 650 : 400}>{t}</T>
                    <T size={12} color="muted" lh={1.4}>{s}</T>
                  </View>
                </Row>
              ))}
            </View>
            <View style={{ padding: 12, borderRadius: 14, backgroundColor: c.bg2, gap: 2 }}>
              <T size={13} weight={600}>Support · Priya</T>
              <T size={13} lh={1.5} color="ink2">{SUPPORT[Math.max(0, step)]}</T>
            </View>
            <Row gap={8}>
              <Btn sm variant="ghost" label="Demo: advance" style={{ flex: 1 }} disabled={step >= 4} onPress={() => setStep(Math.min(4, step + 1))} />
              <Btn sm variant="ghost" label="Appeal" style={{ flex: 1 }} disabled={step !== 3} onPress={() => setStep(2)} />
            </Row>
          </Card></Rise>
        ))}
      </ScrollView>

      <Sheet visible={!!dlg} onClose={() => setDialog(null)}>
        {dlg && (
          <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 14 }}>
            <T size={22} weight={650} tracking={-0.03}>{dlg.title}</T>
            <T size={14} lh={1.55} color="ink2">{dlg.body}</T>
            {!!dlg.note && (
              <View style={{ gap: 6 }}>
                <T size={14} weight={600}>{dlg.note}</T>
                <Field multiline />
              </View>
            )}
            <Btn variant={dlg.variant} label={dlg.cta} onPress={() => { dlg.run(); setDialog(null); }} />
            <Btn variant="ghost" label="Cancel" onPress={() => setDialog(null)} />
          </View>
        )}
      </Sheet>
    </Screen>
  );
}
