import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { Avatar, Btn, Card, Chip, Eyebrow, Field, Grad, IconBtn, Rise, Row, Screen, T, Tag } from '../../components/ui';
import { inr, modeLabel, TASKS, toNum } from '../../data/mock';
import { useApp } from '../../store/AppStore';

const PORTFOLIO: [string, [string, string]][] = [
  ['Kaarigar store', ['#E9D8B8', '#C99A5B']],
  ['Razorpay + COD', ['#D9E4C4', '#8FAF6A']],
  ['Chai brand page', ['#F2D6C9', '#C7735A']],
  ['Jewellery catalogue', ['#D6E2F0', '#7E9CC4']],
];

export default function TaskDetail() {
  const { c, saved, toggleSaved } = useApp();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = TASKS.find((t) => String(t.id) === id) ?? TASKS[0];
  const isSample = task.id === 1;
  const sv = !!saved[task.id];

  const [qa, setQa] = useState([{ q: 'Do you already have a domain?', a: 'Yes — mehtahandlooms.in.', m: 'Answered by Rohan · 1 day ago' }]);
  const [qd, setQd] = useState('');
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [ok, setOk] = useState(false);

  // Proposal form
  const [offer, setOffer] = useState(String(Math.round(task.budget * 0.96)));
  const [days, setDays] = useState(10);
  const [msg, setMsg] = useState("I've set up 9 Shopify stores for Indian D2C brands, including two handloom labels. I'd start with theme and variants, import your sheet, then configure Razorpay and shipping zones.");
  const [picked, setPicked] = useState(['Kaarigar store']);
  const [useMs, setUseMs] = useState(true);
  const [ms, setMs] = useState(isSample ? ['3500', '5000', '3000'] : [String(Math.round(task.budget * 0.96))]);
  const [tried, setTried] = useState(false);

  const n = toNum(offer);
  const fee = Math.round(n * 0.1);
  const msSum = ms.reduce((a, x) => a + toNum(x), 0);
  const offerBad = n <= 0;
  const msgBad = msg.trim().length < 60;
  const msBad = useMs && msSum !== n;
  const by = new Date();
  by.setDate(by.getDate() + days);
  const msNames = isSample ? ['Theme & brand', 'Catalogue', 'Payments & launch'] : ['Full delivery'];

  const submit = () => {
    if (offerBad || msgBad || msBad) return setTried(true);
    setSent(true);
    setOpen(false);
    setOk(true);
  };

  const deliv = isSample ? ['Theme set up with our logo and colours', '40 products with fabric & colour variants', 'UPI, cards and COD via Razorpay', 'India shipping rules + 20-min handover call'] : ['Work delivered as described in the brief', 'A short handover so you can take it from there'];
  const criteria = isSample ? ['A test order completes end-to-end with UPI', 'All 40 products live with correct prices', "Passes Shopify's launch checklist"] : ['The customer confirms the result matches the brief'];

  return (
    <Screen edges={['top', 'bottom']}>
      <Row between style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <IconBtn icon="back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/explore'))} />
        <Tag label="Sample task" dashed />
        <IconBtn icon="bookmark" iconSize={18} label={sv ? 'Remove from saved' : 'Save task'} bg={sv ? c.lime : undefined} fill={sv ? '#101010' : 'none'} onPress={() => toggleSaved(task.id)} />
      </Row>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 20 }} keyboardShouldPersistTaps="handled">
        <Row gap={6} wrap>
          <Tag label="○ Open" />
          <Tag label={modeLabel(task)} />
          <Tag label={task.cat} />
        </Row>
        <T size={28} weight={650} tracking={-0.04} lh={1.12}>{task.title}</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {[['Budget · fixed', inr(task.budget), true], ['Deadline', isSample ? 'Sat 9 Nov, 6 pm' : task.due, false], ['Effort', task.effort.replace('hrs', 'hours'), false], ['Proposals', `${task.props} so far`, false]].map(([k, v, mono]) => (
            <Card key={k as string} pad={14} r={16} style={{ width: '48.5%' }}>
              <T size={12} color="muted">{k as string}</T>
              <T size={mono ? 22 : 15} weight={600} mono={!!mono} style={{ marginTop: 4 }}>{v as string}</T>
            </Card>
          ))}
        </View>
        <T size={15} lh={1.65} color="ink2">
          {isSample
            ? 'We sell handloom cotton and silk sarees from Jaipur through Instagram DMs and want a proper Shopify store — our colours, fabric & colour variants, UPI and card payments, India shipping. Hindi or English is fine.'
            : `Looking for someone reliable in or around ${task.where}. Details are shared after you send a proposal; ask a public question below if anything is unclear.`}
        </T>

        <View style={{ gap: 10 }}>
          <Eyebrow>Deliverables</Eyebrow>
          {deliv.map((d) => (
            <Row key={d} gap={10} center={false}>
              <View style={{ marginTop: 2 }}><Icon name="check" size={18} color={c.ink} stroke={2} /></View>
              <T size={15} lh={1.45} style={{ flex: 1 }}>{d}</T>
            </Row>
          ))}
        </View>
        <View style={{ gap: 10 }}>
          <Eyebrow>Done means</Eyebrow>
          {criteria.map((d) => (
            <Row key={d} gap={10} center={false}>
              <View style={{ width: 18, height: 18, marginTop: 2, borderRadius: 6, borderWidth: 1.5, borderColor: c.line2 }} />
              <T size={15} lh={1.45} style={{ flex: 1 }}>{d}</T>
            </Row>
          ))}
        </View>
        {isSample && (
          <View style={{ gap: 8 }}>
            <Eyebrow>Milestones</Eyebrow>
            {[['1', 'Theme & brand setup', '1 Nov', '₹3,500'], ['2', 'Product catalogue', '4 Nov', '₹5,000'], ['3', 'Payments & launch', '9 Nov', '₹3,500']].map((m) => (
              <Card key={m[0]} pad={12} r={16}>
                <Row gap={12}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}><T size={12} mono>{m[0]}</T></View>
                  <View style={{ flex: 1 }}>
                    <T size={14} weight={600}>{m[1]}</T>
                    <T size={12} color="muted">Due {m[2]}</T>
                  </View>
                  <T mono weight={600}>{m[3]}</T>
                </Row>
              </Card>
            ))}
          </View>
        )}
        {isSample && (
          <View style={{ gap: 10 }}>
            <Eyebrow>Attachments</Eyebrow>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {[['products-oct.xlsx', '40 rows'], ['brand-colours.pdf', '1 page'], ['reference-stores', '3 links']].map((f) => (
                <Card key={f[0]} pad={10} r={14} style={{ paddingHorizontal: 12 }}>
                  <T size={13} weight={600}>{f[0]}</T>
                  <T size={12} color="muted">{f[1]}</T>
                </Card>
              ))}
            </ScrollView>
          </View>
        )}
        <Pressable onPress={() => router.push('/chat/0')}>
          <Card pad={14} r={16}>
            <Row gap={12}>
              <Avatar ini="RM" bg="#F0D9B5" />
              <View style={{ flex: 1, gap: 3 }}>
                <T weight={600}>{isSample ? 'Rohan Mehta · Mehta Handlooms' : `Customer · ${task.where}`}</T>
                <T size={12} color="muted">✓ Phone & payment verified · 6 tasks · 0 disputes</T>
              </View>
            </Row>
          </Card>
        </Pressable>
        <View style={{ gap: 10 }}>
          <Eyebrow>Questions · public</Eyebrow>
          {qa.map((x, i) => (
            <Card key={i} pad={14} r={16} style={{ gap: 6 }}>
              <T size={14} weight={600}>Q · {x.q}</T>
              <T size={14} color="ink2">{x.a}</T>
              <T size={12} color="muted">{x.m}</T>
            </Card>
          ))}
          <Row gap={8}>
            <Field style={{ flex: 1 }} placeholder="Ask a clarifying question" value={qd} onChangeText={setQd} accessibilityLabel="Ask a question" />
            <Btn variant="ghost" label="Ask" onPress={() => {
              if (!qd.trim()) return;
              setQa(qa.concat({ q: qd.trim(), a: "Awaiting the customer's answer.", m: 'Asked by you · just now (demo)' }));
              setQd('');
            }} />
          </Row>
        </View>
      </ScrollView>

      <Row gap={12} style={{ borderTopWidth: 1, borderColor: c.line, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 6 }}>
        <View>
          <T size={19} weight={600} mono>{inr(task.budget)}</T>
          <T size={12} color="muted">{sent ? 'Proposal sent ✓' : `${task.props} proposals · closes 31 Oct`}</T>
        </View>
        {sent ? (
          <Btn label="Demo: get hired →" style={{ flex: 1 }} onPress={() => router.push('/contract')} />
        ) : (
          <Btn variant="lime" label="Submit proposal" style={{ flex: 1 }} onPress={() => setOpen(true)} />
        )}
      </Row>

      {/* Proposal form */}
      <Modal visible={open} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top, paddingBottom: insets.bottom }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: c.line }}>
            <IconBtn icon="close" iconSize={18} label="Close" onPress={() => setOpen(false)} />
            <View style={{ flex: 1 }}>
              <T size={18} weight={650} tracking={-0.02}>Your proposal</T>
              <T size={12} color="muted" numberOfLines={1}>{task.title}</T>
            </View>
          </Row>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 18, gap: 20 }} keyboardShouldPersistTaps="handled">
            <View style={{ gap: 6 }}>
              <T size={14} weight={600}>Your offer</T>
              <View>
                <T size={18} mono color="muted" style={{ position: 'absolute', left: 16, top: 17, zIndex: 1 }}>₹</T>
                <Field mono big keyboardType="number-pad" value={offer} onChangeText={setOffer} error={tried && offerBad} accessibilityLabel="Your offer in rupees" style={{ paddingLeft: 34, minHeight: 58 }} />
              </View>
              <T size={12} color={tried && offerBad ? 'danger' : 'muted'}>
                {tried && offerBad ? 'Enter an amount in rupees.' : n > task.budget ? 'Above the budget — explain why below.' : `Customer's budget: ${inr(task.budget)}`}
              </T>
            </View>
            <View style={{ padding: 14, borderRadius: 16, backgroundColor: c.ink, gap: 8 }}>
              <Row between>
                <T size={13} color={c.bg} style={{ opacity: 0.75 }}>Platform fee ([FEE %], 10% shown)</T>
                <T size={13} mono color={c.bg} style={{ opacity: 0.75 }}>− {inr(fee)}</T>
              </Row>
              <Row between>
                <T size={15} weight={600} color={c.bg}>You'd receive</T>
                <T size={26} weight={600} mono color={c.lime}>{inr(Math.max(0, n - fee))}</T>
              </Row>
              <T size={11} color={c.bg} style={{ opacity: 0.65 }}>Indicative, before taxes. Timing depends on [PAYMENT PARTNER].</T>
            </View>
            <View style={{ gap: 8 }}>
              <T size={14} weight={600}>Delivery time</T>
              <Row gap={8} wrap>
                {[7, 10, 12, 14].map((x) => <Chip key={x} label={`${x} days`} on={days === x} onPress={() => setDays(x)} />)}
              </Row>
              <T size={12} color="muted">Delivers by {by.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} (IST)</T>
            </View>
            <View style={{ gap: 6 }}>
              <T size={14} weight={600}>Short proposal</T>
              <Field multiline value={msg} onChangeText={setMsg} error={tried && msgBad} style={{ minHeight: 130, lineHeight: 22 }} accessibilityLabel="Short proposal" />
              <T size={12} color={tried && msgBad ? 'danger' : 'muted'}>{(tried && msgBad ? 'At least 60 characters, please. ' : '') + msg.trim().length + ' / 1,000'}</T>
            </View>
            <View style={{ gap: 8 }}>
              <T size={14} weight={600}>Relevant work · up to 3</T>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {PORTFOLIO.map(([name, g]) => {
                  const on = picked.includes(name);
                  return (
                    <Pressable key={name} accessibilityState={{ selected: on }} onPress={() => setPicked(on ? picked.filter((x) => x !== name) : picked.length < 3 ? picked.concat(name) : picked)} style={{ width: 132, gap: 6, padding: 6, borderRadius: 14, borderWidth: on ? 2 : 1, borderColor: on ? c.ink : c.line, backgroundColor: c.surface }}>
                      <Grad colors={g} style={{ height: 72, borderRadius: 9 }} />
                      <T size={12} weight={550} lh={1.3}>{name}</T>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
            <View style={{ gap: 10 }}>
              <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: useMs }} onPress={() => setUseMs(!useMs)} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', minHeight: 32 }}>
                <View style={{ width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: c.ink, backgroundColor: useMs ? c.ink : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {useMs && <Icon name="check" size={14} color={c.bg} stroke={3} />}
                </View>
                <T size={14} weight={600}>Propose milestones</T>
              </Pressable>
              {useMs && (
                <>
                  {msNames.map((name, i) => (
                    <Row key={name} gap={8}>
                      <T size={14} style={{ flex: 1 }}>{name}</T>
                      <Field mono keyboardType="number-pad" value={ms[i]} onChangeText={(v) => { const m = ms.slice(); m[i] = v; setMs(m); }} style={{ width: 110, minHeight: 44 }} accessibilityLabel={name} />
                    </Row>
                  ))}
                  <T size={12} color={msSum === n ? 'limeText' : 'danger'}>{msSum === n ? 'Adds up to your offer ✓' : `Adds up to ${inr(msSum)} — should equal ${inr(n)}`}</T>
                </>
              )}
            </View>
            <View style={{ gap: 6 }}>
              <T size={14} weight={600}>Question for the customer <T size={14} color="muted">· optional</T></T>
              <Field placeholder="e.g. Do you already own a domain?" />
            </View>
          </ScrollView>
          <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, borderTopWidth: 1, borderColor: c.line }}>
            <Btn variant="lime" label="Submit proposal" onPress={submit} />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Success */}
      <Modal visible={ok} animationType="fade" onRequestClose={() => setOk(false)}>
        <View style={{ flex: 1, backgroundColor: c.bg, justifyContent: 'center', padding: 32 }}>
          <Rise style={{ gap: 18 }}>
            <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={32} color="#101010" stroke={2.4} />
            </View>
            <T size={36} weight={650} tracking={-0.05} lh={1.05}>Proposal sent.</T>
            <T size={16} lh={1.55} color="ink2">
              You offered <T size={16} mono weight={600}>{inr(n)}</T> in {days} days. In the real app the customer would be notified — in this prototype nothing is sent.
            </T>
            <Btn label="Demo: skip ahead to “Hired”" onPress={() => { setOk(false); router.push('/contract'); }} />
            <Btn variant="ghost" label="Back to task" onPress={() => setOk(false)} />
          </Rise>
        </View>
      </Modal>
    </Screen>
  );
}
