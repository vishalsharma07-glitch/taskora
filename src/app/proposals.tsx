import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '../components/Icon';
import { Avatar, Btn, Card, Chip, Grad, IconBtn, Rise, Row, Screen, Seg, Sheet, T, Tag } from '../components/ui';
import { inr, PROPOSALS, type Proposal } from '../data/mock';
import { useColors } from '../store/AppStore';

export default function Proposals() {
  const c = useColors();
  const [view, setView] = useState<'cards' | 'cmp'>('cards');
  const [sort, setSort] = useState<'fit' | 'price' | 'time'>('fit');
  const [short, setShort] = useState<Record<string, boolean>>({ meera: true });
  const [cmp, setCmp] = useState(['kabir', 'meera', 'tanvi']);
  const [shortOnly, setShortOnly] = useState(false);
  const [pending, setPending] = useState<Proposal | null>(null);
  const [hired, setHired] = useState<Proposal | null>(null);

  const list = useMemo(() => {
    const l = PROPOSALS.slice().sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'time' ? a.days - b.days : b.fit - a.fit));
    return shortOnly ? l.filter((p) => short[p.id]) : l;
  }, [sort, shortOnly, short]);
  const cmpList = PROPOSALS.filter((p) => cmp.includes(p.id));
  const minP = Math.min(...cmpList.map((p) => p.price));
  const maxD = Math.max(1, ...cmpList.map((p) => p.days));
  const shortCount = Object.values(short).filter(Boolean).length;

  const toggleShort = (id: string) => setShort({ ...short, [id]: !short[id] });
  const toggleCmp = (id: string) => setCmp(cmp.includes(id) ? cmp.filter((x) => x !== id) : cmp.length < 3 ? cmp.concat(id) : cmp.slice(1).concat(id));

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, gap: 12 }}>
        <Row gap={12}>
          <IconBtn icon="back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
          <View style={{ flex: 1 }}>
            <T size={12} color="muted">{hired ? '● Worker hired' : '◔ Proposals received'} · closes 31 Oct</T>
            <T size={18} weight={640} tracking={-0.02} lh={1.25}>Edit a 90-second explainer video</T>
          </View>
        </Row>
        <Seg options={[{ key: 'cards', label: 'Proposals · 4' }, { key: 'cmp', label: `Compare · ${cmp.length}` }]} value={view} onChange={setView} />
      </View>

      {hired && (
        <Rise>
          <Pressable onPress={() => router.push('/contract')} style={{ marginHorizontal: 16, marginBottom: 10, padding: 14, borderRadius: 18, backgroundColor: c.ink, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, gap: 2 }}>
              <T size={15} weight={600} color={c.bg}>You hired {hired.name}</T>
              <T size={12} color={c.bg} style={{ opacity: 0.7 }}>Next: pay milestone 1 via [PAYMENT PARTNER]</T>
            </View>
            <Tag solidLime label="Open →" />
          </Pressable>
        </Rise>
      )}

      {view === 'cards' ? (
        <>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 10 }}>
              {([['fit', 'Best fit'], ['price', 'Lowest price'], ['time', 'Fastest']] as const).map(([k, n]) => (
                <Chip key={k} label={n} on={sort === k && !shortOnly} onPress={() => { setSort(k); setShortOnly(false); }} />
              ))}
              <Chip label={`Shortlisted · ${shortCount}`} on={shortOnly} onPress={() => setShortOnly(!shortOnly)} />
            </ScrollView>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, gap: 10 }}>
            <T size={12} color="muted" lh={1.5}>Ratings come only from verified, completed tasks. New workers are shown on portfolio and proposal — not a missing score.</T>
            {list.map((p, i) => (
              <Rise key={p.id} delay={i * 50}>
                <Card selected={hired?.id === p.id} style={{ gap: 12 }}>
                  <Row between>
                    <Pressable onPress={() => router.navigate('/profile')}>
                      <Row gap={10}>
                        <Avatar ini={p.ini} bg={p.bg} />
                        <View>
                          <T weight={600}>{p.name}</T>
                          <T size={12} color="muted">{p.city}</T>
                        </View>
                      </Row>
                    </Pressable>
                    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: cmp.includes(p.id) }} onPress={() => toggleCmp(p.id)} style={{ flexDirection: 'row', gap: 6, alignItems: 'center', minHeight: 44 }}>
                      <View style={{ width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: c.ink, backgroundColor: cmp.includes(p.id) ? c.ink : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                        {cmp.includes(p.id) && <Icon name="check" size={12} color={c.bg} stroke={3} />}
                      </View>
                      <T size={12}>Compare</T>
                    </Pressable>
                  </Row>
                  <Row gap={8}>
                    <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: c.bg2 }}>
                      <T size={11} color="muted">Offer</T>
                      <T size={20} weight={600} mono>{inr(p.price)}</T>
                    </View>
                    <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: c.bg2 }}>
                      <T size={11} color="muted">Delivery</T>
                      <T size={17} weight={600} style={{ marginTop: 2 }}>{p.days} days</T>
                    </View>
                  </Row>
                  <Row gap={6} wrap>
                    <Tag tone={p.isNew ? 'lime' : 'neutral'} label={p.rating} />
                    <Tag label={p.reply} />
                  </Row>
                  <T size={14} lh={1.5} color="ink2">{p.pitch}</T>
                  <Row gap={6}>
                    {p.thumbs.map((g, k) => <Grad key={k} colors={g} style={{ flex: 1, height: 48, borderRadius: 10 }} />)}
                  </Row>
                  <Row gap={8}>
                    <Btn variant="ghost" sm label={short[p.id] ? 'Shortlisted ✓' : 'Shortlist'} style={{ flex: 1, paddingHorizontal: 6 }} onPress={() => toggleShort(p.id)} />
                    <Btn variant="ghost" sm label="Message" style={{ flex: 1, paddingHorizontal: 6 }} onPress={() => router.push('/chat/0')} />
                    <Btn sm label="Hire" style={{ flex: 1 }} disabled={!!hired} onPress={() => setPending(p)} />
                  </Row>
                </Card>
              </Rise>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <T size={12} color="muted" style={{ paddingHorizontal: 16, paddingBottom: 10 }}>Swipe to compare · tick “Compare” on up to 3 proposals</T>
          <ScrollView horizontal snapToInterval={246} decelerationRate="fast" showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingBottom: 16, alignItems: 'flex-start' }}>
            {cmpList.length === 0 && <T size={14} color="muted" style={{ paddingVertical: 24 }}>Tick “Compare” on proposals to see them here.</T>}
            {cmpList.map((p) => (
              <View key={p.id} style={{ width: 236, borderRadius: 20, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}>
                <Row gap={10} style={{ padding: 14 }}>
                  <Avatar ini={p.ini} bg={p.bg} size={40} />
                  <View>
                    <T weight={600}>{p.name}</T>
                    <T size={12} color="muted">{p.city}</T>
                  </View>
                </Row>
                <Cell k="Price">
                  <T size={20} weight={600} mono>{inr(p.price)}</T>
                  {p.price === minP && <T size={12} color="limeText">Lowest of selected</T>}
                </Cell>
                <Cell k="Delivery">
                  <T weight={600}>{p.days} days</T>
                  <View style={{ height: 5, borderRadius: 5, backgroundColor: c.line }}>
                    <View style={{ width: `${Math.round((p.days / maxD) * 100)}%`, height: '100%', borderRadius: 5, backgroundColor: c.ink }} />
                  </View>
                </Cell>
                <Cell k="Relevant experience"><T size={13} lh={1.45}>{p.exp}</T></Cell>
                <Cell k="Verified ratings"><T size={13}>{p.rating}</T></Cell>
                <Cell k="Communication"><T size={13} lh={1.45}>{p.reply} · {p.comm}</T></Cell>
                <Cell k="Milestones"><T size={13} lh={1.45}>{p.ms}</T></Cell>
                <Row gap={6} style={{ padding: 12, borderTopWidth: 1, borderColor: c.line }}>
                  <Btn variant="ghost" sm label={short[p.id] ? 'Shortlisted ✓' : 'Shortlist'} style={{ flex: 1, paddingHorizontal: 4 }} onPress={() => toggleShort(p.id)} />
                  <Btn sm label="Hire" style={{ flex: 1 }} disabled={!!hired} onPress={() => setPending(p)} />
                </Row>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      <Sheet visible={!!pending} onClose={() => setPending(null)}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 14 }}>
          <T size={24} weight={650} tracking={-0.03}>Hire {pending?.name}?</T>
          <Card pad={14} r={16} style={{ gap: 10 }}>
            <Row between><T size={14} color="muted">Agreed price</T><T size={14} mono weight={600}>{pending ? inr(pending.price) : ''}</T></Row>
            <Row between><T size={14} color="muted">Delivery</T><T size={14}>{pending?.days} days</T></Row>
            <Row between center={false} gap={12}><T size={14} color="muted">Milestones</T><T size={14} style={{ flex: 1, textAlign: 'right' }}>{pending?.ms}</T></Row>
          </Card>
          <T size={13} color="ink2" lh={1.5}>Their proposal becomes the contract scope. Next you pay milestone 1 through [PAYMENT PARTNER]; other applicants are told the task is filled.</T>
          <Btn variant="lime" label="Confirm hire" onPress={() => { setHired(pending); setPending(null); }} />
          <Btn variant="ghost" label="Not yet" onPress={() => setPending(null)} />
        </View>
      </Sheet>
    </Screen>
  );
}

function Cell({ k, children }: { k: string; children: React.ReactNode }) {
  const c = useColors();
  return (
    <View style={{ paddingVertical: 12, paddingHorizontal: 14, borderTopWidth: 1, borderColor: c.line, gap: 4, minHeight: 74 }}>
      <T size={11} weight={650} tracking={0.06} color="muted" style={{ textTransform: 'uppercase' }}>{k}</T>
      {children}
    </View>
  );
}
