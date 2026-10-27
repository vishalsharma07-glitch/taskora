import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { Btn, Card, Field, Grad, H2, IconBtn, LinkRow, Rise, Row, Screen, Seg, T, Tag, Toggle } from '../../components/ui';
import { PORTFOLIO } from '../../data/mock';
import { useApp } from '../../store/AppStore';

type Priv = 'last' | 'area' | 'langs' | 'amounts' | 'verified';
const PRIV_ROWS: [Priv, string, string][] = [['last', 'Show last name', 'Otherwise “Ananya I.”'], ['area', 'Show neighbourhood', 'Otherwise only “Pune”'], ['langs', 'Show languages', 'Helps matching'], ['amounts', 'Amounts on reviews', 'Show task budgets'], ['verified', 'Verification badge', 'Recommended']];
const REVIEWS = [
  { task: 'React checkout fix', score: '5.0', text: 'Found the Razorpay webhook issue in an hour and explained it clearly.', who: 'Vikram S., Gurugram', a: '₹14,000' },
  { task: 'Wix to Next.js', score: '5.0', text: 'Same design, twice as fast. Updates every two days.', who: 'Studio Ekam, Mumbai', a: '₹18,000' },
];

export default function Profile() {
  const { c, isDark, toggleDark } = useApp();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'pub' | 'priv' | 'set'>('pub');
  const [lb, setLb] = useState<number | null>(null);
  const [pv, setPv] = useState<Record<Priv, boolean>>({ last: true, area: true, langs: true, amounts: false, verified: true });
  const [added, setAdded] = useState<typeof PORTFOLIO>([]);
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const [phone, setPhone] = useState('98765 43210');
  const [saved, setSaved] = useState('');

  const items = PORTFOLIO.concat(added).filter((p) => !removed[p.id]);
  const lbI = lb != null ? items[lb] : undefined;
  const digits = phone.replace(/\D/g, '');
  const fmt = digits.length > 5 ? digits.slice(0, 5) + ' ' + digits.slice(5, 10) : digits;
  const phoneOk = /^[6-9]\d{9}$/.test(digits);

  return (
    <Screen>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, gap: 12 }}>
        <Row between>
          <T size={26} weight={650} tracking={-0.04}>Profile</T>
          <Tag label="Sample profile" dashed />
        </Row>
        <Seg options={[{ key: 'pub', label: 'Profile' }, { key: 'priv', label: 'Privacy' }, { key: 'set', label: 'Settings' }]} value={tab} onChange={setTab} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24, gap: 18 }} keyboardShouldPersistTaps="handled">
        {tab === 'pub' && (
          <>
            <Rise style={{ alignItems: 'center', gap: 10, paddingTop: 6 }}>
              <View style={{ width: 96, height: 96, borderRadius: 32, backgroundColor: '#D9E4C4', alignItems: 'center', justifyContent: 'center' }}>
                <T size={32} weight={600} color="#101010">AI</T>
              </View>
              <T size={28} weight={650} tracking={-0.045}>{pv.last ? 'Ananya Iyer' : 'Ananya I.'}</T>
              <T size={14} color="ink2" lh={1.5} center style={{ maxWidth: 320 }}>Shopify and Next.js stores for small Indian brands — fast, tidy, easy to run.</T>
              <Row gap={6} wrap style={{ justifyContent: 'center' }}>
                <Tag tone="lime" label="● Available this week" />
                {pv.verified && <Tag label="✓ ID verified" />}
              </Row>
              <T size={13} color="muted">{pv.area ? 'Kothrud, Pune' : 'Pune'} · Remote & on-site within 8 km</T>
              {pv.langs && <T size={13} color="muted">English · Hindi · Tamil · Marathi (basic)</T>}
            </Rise>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[['14', 'Tasks completed'], ['100%', 'Without a dispute'], ['13/14', 'On or before deadline'], ['~2 hrs', 'Typical first reply']].map(([v, k]) => (
                <Card key={k} pad={14} style={{ width: '48.5%' }}>
                  <T size={22} weight={600} mono>{v}</T>
                  <T size={12} color="muted" lh={1.35} style={{ marginTop: 2 }}>{k}</T>
                </Card>
              ))}
            </View>
            <Row gap={6} wrap>
              {['Shopify', 'Next.js', 'React', 'Razorpay'].map((s) => <Tag key={s} tone="lime" label={s} />)}
              {['Webflow', 'Laptop repair'].map((s) => <Tag key={s} label={s} />)}
            </Row>
            <View style={{ gap: 12 }}>
              <Row between>
                <H2>Portfolio</H2>
                <T size={13} color="muted">{items.length} items</T>
              </Row>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {items.map((p, i) => (
                  <Pressable key={p.id} accessibilityLabel={`Open ${p.title}`} onPress={() => setLb(i)} style={({ pressed }) => ({ width: '47.5%', gap: 6, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
                    <Grad colors={p.g} style={{ aspectRatio: 1, borderRadius: 16 }} />
                    <T size={13} weight={600} lh={1.3}>{p.title}</T>
                    <T size={12} color="muted">{p.sub}</T>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={{ gap: 10 }}>
              <H2>Verified reviews · 11</H2>
              {REVIEWS.map((r) => (
                <Card key={r.task} style={{ gap: 8 }}>
                  <Row between>
                    <T size={14} weight={600}>{r.task}</T>
                    <T size={13} mono>{r.score}/5</T>
                  </Row>
                  <T size={14} lh={1.55} color="ink2">“{r.text}”</T>
                  <T size={12} color="muted">{r.who} · {pv.amounts ? r.a : 'Verified task'}</T>
                </Card>
              ))}
            </View>
          </>
        )}

        {tab === 'priv' && (
          <>
            <Rise>
              <H2 style={{ marginBottom: 4 }}>What's public</H2>
              {PRIV_ROWS.map(([k, l, s]) => (
                <Row key={k} between gap={14} style={{ minHeight: 58, borderBottomWidth: 1, borderColor: c.line }}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <T size={15}>{l}</T>
                    <T size={12} color="muted">{s}</T>
                  </View>
                  <Toggle on={pv[k]} label={l} onPress={() => setPv({ ...pv, [k]: !pv[k] })} />
                </Row>
              ))}
              <T size={12} color="muted" lh={1.5} style={{ marginTop: 10 }}>Changes show instantly on your profile tab. Phone number and exact address are never public.</T>
            </Rise>
            <Rise delay={50} style={{ gap: 12 }}>
              <H2>Portfolio items</H2>
              <Pressable
                onPress={() => {
                  const n = added.length + 1;
                  setAdded(added.concat({ id: 'n' + n, title: 'New sample ' + n, sub: 'Added just now', g: n % 2 ? ['#C6F36A', '#7FA83A'] : ['#F0D9B5', '#D19A4F'] }));
                }}
                style={{ alignItems: 'center', gap: 6, padding: 22, borderRadius: 18, borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.line2, backgroundColor: c.surface }}
              >
                <Icon name="upload" size={22} color={c.ink2} />
                <T size={15} weight={600} color="ink2">Add photos, PDFs or links</T>
                <T size={12} color="muted">Demo: adds a sample item</T>
              </Pressable>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {items.map((p) => (
                  <View key={p.id} style={{ width: '31.5%', gap: 4 }}>
                    <Grad colors={p.g} style={{ aspectRatio: 1, borderRadius: 12 }} />
                    <Pressable accessibilityLabel={`Remove ${p.title}`} onPress={() => setRemoved({ ...removed, [p.id]: true })} style={{ minHeight: 32, alignItems: 'center', justifyContent: 'center' }}>
                      <T size={12} color="danger">Remove</T>
                    </Pressable>
                  </View>
                ))}
              </View>
              <T size={12} color="muted">{added.length ? `${added.length} added in this demo — nothing is uploaded.` : `${items.length} items`}</T>
            </Rise>
          </>
        )}

        {tab === 'set' && (
          <>
            <Rise style={{ gap: 14 }}>
              <View style={{ gap: 6 }}>
                <T size={14} weight={600}>Full name</T>
                <Field defaultValue="Ananya Iyer" />
              </View>
              <View style={{ gap: 6 }}>
                <T size={14} weight={600}>Mobile number</T>
                <Row gap={8}>
                  <View style={{ width: 70, minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: c.line2, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}>
                    <T mono weight={600}>+91</T>
                  </View>
                  <Field mono style={{ flex: 1 }} keyboardType="phone-pad" value={fmt} onChangeText={(v) => { setPhone(v); setSaved(''); }} error={!phoneOk} accessibilityLabel="Mobile number" />
                </Row>
                <T size={12} color={phoneOk ? 'muted' : 'danger'}>{phoneOk ? `Shown as +91 ${fmt} only to people you work with` : 'Enter a 10-digit mobile number starting 6–9.'}</T>
              </View>
              <Row between style={{ minHeight: 56, borderBottomWidth: 1, borderTopWidth: 1, borderColor: c.line }}>
                <View>
                  <T size={15}>Dark mode</T>
                  <T size={12} color="muted">Preview the dark theme</T>
                </View>
                <Toggle on={isDark} label="Dark mode" onPress={toggleDark} />
              </Row>
              <Btn label="Save" onPress={() => setSaved(phoneOk ? 'Saved (demo)' : 'Fix the mobile number first')} />
              {!!saved && <T size={13} color="muted">{saved}</T>}
            </Rise>
            <Rise delay={50}>
              <LinkRow label="Payments & payouts" onPress={() => router.push('/earnings')} />
              <LinkRow label="My contracts" onPress={() => router.push('/contract')} />
              <LinkRow label="Compare proposals (hiring)" onPress={() => router.push('/proposals')} />
              <LinkRow label="Redo onboarding answers" onPress={() => router.push('/onboarding')} />
              <LinkRow label="Sign out" onPress={() => router.replace('/')} />
            </Rise>
          </>
        )}
      </ScrollView>

      <Modal visible={!!lbI} animationType="fade" onRequestClose={() => setLb(null)}>
        {lbI && lb != null && (
          <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <Row between style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <IconBtn icon="close" iconSize={18} label="Close" onPress={() => setLb(null)} />
              <T size={13} mono color="muted">{lb + 1} / {items.length}</T>
              <View style={{ width: 44 }} />
            </Row>
            <Grad colors={lbI.g} style={{ flex: 1, marginHorizontal: 16, borderRadius: 24 }} />
            <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, gap: 6 }}>
              <T size={22} weight={650} tracking={-0.03}>{lbI.title}</T>
              <T size={14} color="ink2">{lbI.sub} · image placeholder</T>
              <Row gap={8} style={{ marginTop: 10 }}>
                <Btn variant="ghost" label="Previous" style={{ flex: 1 }} onPress={() => setLb((lb - 1 + items.length) % items.length)} />
                <Btn variant="ghost" label="Next" style={{ flex: 1 }} onPress={() => setLb((lb + 1) % items.length)} />
              </Row>
            </View>
          </View>
        )}
      </Modal>
    </Screen>
  );
}
