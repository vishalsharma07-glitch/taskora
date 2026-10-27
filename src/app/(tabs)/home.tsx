import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '../../components/Icon';
import { TaskCard } from '../../components/TaskCard';
import { Avatar, Btn, Chip, Field, H1, H2, IconBtn, Rise, Row, Screen, Seg, Sheet, T, Tag, Toggle } from '../../components/ui';
import { ARRIVING_TASK, CATEGORIES, NOTIFICATIONS, TASKS, WORKERS, type NoteCat } from '../../data/mock';
import { useApp } from '../../store/AppStore';

function Pulse() {
  const { c } = useApp();
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(a, { toValue: 1, duration: 1800, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [a]);
  return (
    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.lime }}>
      <Animated.View style={{ position: 'absolute', left: -4, top: -4, width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: c.lime, opacity: a.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.8] }) }] }} />
    </View>
  );
}

const PREF_LABELS: Record<NoteCat, string> = { Opportunities: 'Matching opportunities', Proposals: 'Proposals', Contracts: 'Hires & contract updates', Messages: 'Messages', Payments: 'Payments', Disputes: 'Disputes & support' };

export default function Home() {
  const { c, mode, setMode } = useApp();
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [nOpen, setN] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [ntab, setNtab] = useState<'All' | NoteCat>('All');
  const [read, setRead] = useState<Record<number, boolean>>({});
  const [arrived, setArrived] = useState(false);
  const [pref, setPref] = useState<Record<NoteCat, boolean>>({ Opportunities: true, Proposals: true, Contracts: true, Messages: true, Payments: true, Disputes: true });

  // Simulate a new task arriving in the feed.
  useEffect(() => {
    const t = setTimeout(() => setArrived(true), 4500);
    return () => clearTimeout(t);
  }, []);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const feed = useMemo(() => {
    const base = [1, 2, 3, 10].map((id) => TASKS.find((t) => t.id === id)!).map((t, i) => ({ t, label: i < 2 ? 'New' : undefined }));
    type Item = { t: typeof ARRIVING_TASK; label?: string };
    let list: Item[] = [...(arrived ? [{ t: ARRIVING_TASK, label: 'Just added · sample' }] : []), ...base];
    if (cat) list = list.filter((x) => x.t.cat === cat);
    return list.slice(0, 3);
  }, [arrived, cat]);

  const unreadFn = (id: number) => !read[id] && id <= 4;
  const unread = NOTIFICATIONS.filter((n) => unreadFn(n.id)).length;
  const earnish = /(earn|i can|paid|work)/i.test(q.trim());

  return (
    <Screen>
      <Row between style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 }}>
        <Pressable accessibilityRole="link" accessibilityLabel="Your profile" onPress={() => router.navigate('/profile')}>
          <Row gap={10}>
            <Avatar ini="AI" bg="#D9E4C4" size={42} />
            <View>
              <T size={13} color="muted">{greeting}</T>
              <T size={16} weight={620}>Ananya</T>
            </View>
          </Row>
        </Pressable>
        <Row gap={8}>
          <Pressable accessibilityRole="link" accessibilityLabel="Earnings, demo data" onPress={() => router.push('/earnings')} style={{ height: 44, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, justifyContent: 'center' }}>
            <T size={13} mono weight={600}>₹18,450</T>
          </Pressable>
          <View>
            <IconBtn icon="bell" label={'Notifications' + (unread ? `, ${unread} unread` : '')} onPress={() => { setN(true); setPrefs(false); }} />
            {unread > 0 && <View style={{ position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: c.lime, borderWidth: 2, borderColor: c.surface }} />}
          </View>
        </Row>
      </Row>

      <ScrollView contentContainerStyle={{ paddingTop: 6, paddingBottom: 24, gap: 22 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          <Seg options={[{ key: 'work', label: 'Working' }, { key: 'hire', label: 'Hiring' }]} value={mode} onChange={setMode} />
          <H1>What would you like to do today?</H1>
          <Field placeholder={mode === 'hire' ? 'I need someone to…' : 'I want to…'} value={q} onChangeText={setQ} accessibilityLabel="Describe what you need or want to do" style={{ minHeight: 52, borderRadius: 16 }} />
          {q.trim().length > 1 ? (
            <Rise from={10}>
              <Btn variant="lime" label={earnish ? 'See matching tasks →' : 'Turn this into a task →'} onPress={() => (earnish ? router.navigate('/explore') : router.push('/post'))} />
            </Rise>
          ) : (
            <Row gap={8}>
              <Btn variant="lime" label="Find work" style={{ flex: 1 }} onPress={() => router.navigate('/explore')} />
              <Btn label="Post a task" style={{ flex: 1 }} onPress={() => router.push('/post')} />
            </Row>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {CATEGORIES.map((x) => <Chip key={x} label={x} on={cat === x} onPress={() => setCat(cat === x ? null : x)} />)}
        </ScrollView>

        {mode === 'work' ? (
          <>
            <Pressable onPress={() => router.push('/contract')} style={{ marginHorizontal: 20, padding: 16, borderRadius: 18, backgroundColor: c.ink, gap: 10 }}>
              <Row between>
                <T size={12} color={c.bg} style={{ opacity: 0.7 }}>Active contract · Milestone 2 of 3</T>
                <Tag solidLime label="Due 4 Nov" />
              </Row>
              <T size={16} weight={600} color={c.bg}>Shopify store · Mehta Handlooms</T>
              <View style={{ height: 5, borderRadius: 5, backgroundColor: 'rgba(127,127,127,0.35)' }}>
                <View style={{ width: '45%', height: '100%', borderRadius: 5, backgroundColor: c.lime }} />
              </View>
            </Pressable>

            <View style={{ paddingHorizontal: 20, gap: 12 }}>
              <Row between>
                <Row gap={8}>
                  <H2>Recommended</H2>
                  <Pulse />
                </Row>
                <Pressable onPress={() => router.navigate('/explore')} style={{ minHeight: 44, justifyContent: 'center' }}>
                  <T size={14} color="ink2" style={{ textDecorationLine: 'underline' }}>See all</T>
                </Pressable>
              </Row>
              {feed.map((x, i) => (
                <Rise key={x.t.id} delay={i * 60}>
                  <TaskCard task={x.t} newLabel={x.label} compact />
                </Rise>
              ))}
              {feed.length === 0 && (
                <View style={{ padding: 24, borderRadius: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: c.line2, alignItems: 'center', gap: 10 }}>
                  <T size={14} color="muted">Nothing in {cat} right now.</T>
                  <Btn variant="ghost" sm label="Show all" onPress={() => setCat(null)} />
                </View>
              )}
            </View>

            <View style={{ paddingHorizontal: 20, gap: 10 }}>
              <H2>Upcoming deadlines</H2>
              {[{ mon: 'Oct', day: '30', title: 'Checkout bug — proposal closes', sub: '6:00 pm IST' }, { mon: 'Nov', day: '4', title: 'Milestone 2 · Product catalogue', sub: 'Mehta Handlooms' }].map((d) => (
                <Row key={d.title} gap={12} style={{ padding: 12, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}>
                  <View style={{ width: 44, height: 48, borderRadius: 12, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
                    <T size={10} weight={650} color="muted" style={{ textTransform: 'uppercase' }}>{d.mon}</T>
                    <T size={17} weight={600} mono>{d.day}</T>
                  </View>
                  <View style={{ gap: 2 }}>
                    <T size={15} weight={550}>{d.title}</T>
                    <T size={12} color="muted">{d.sub}</T>
                  </View>
                </Row>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={{ paddingHorizontal: 20, gap: 12 }}>
              <H2>Your posted tasks</H2>
              <Rise>
                <Pressable onPress={() => router.push('/proposals')} style={{ gap: 10, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}>
                  <Row between>
                    <Tag tone="info" label="◔ 4 proposals" />
                    <T size={12} color="muted">2 days ago</T>
                  </Row>
                  <T size={16} weight={600} lh={1.3}>Edit a 90-second explainer video for my agency site</T>
                  <Row between>
                    <T size={18} weight={600} mono>₹6,000–8,000</T>
                    <T size={14} weight={600}>Review →</T>
                  </Row>
                </Pressable>
              </Rise>
              <Rise delay={60}>
                <Pressable onPress={() => router.push('/post')} style={{ gap: 10, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}>
                  <Tag label="○ Draft" />
                  <T size={16} weight={600}>Office Wi-Fi setup — 3 access points</T>
                  <T size={13} color="muted">Continue where you left off</T>
                </Pressable>
              </Rise>
            </View>
            <View style={{ gap: 12 }}>
              <H2 style={{ paddingHorizontal: 20 }}>People who fit</H2>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
                {WORKERS.map((w) => (
                  <Pressable key={w.name} onPress={() => router.navigate('/profile')} style={{ width: 160, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, gap: 8 }}>
                    <Avatar ini={w.ini} bg={w.bg} />
                    <T size={15} weight={600}>{w.name}</T>
                    <T size={12} color="muted" lh={1.4}>{w.role}</T>
                    <T size={12} color="ink2">{w.proof}</T>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>

      <Sheet visible={nOpen} onClose={() => setN(false)} top={64}>
        <Row between style={{ paddingTop: 12, paddingBottom: 8, paddingLeft: 20, paddingRight: 16 }}>
          <T size={22} weight={650} tracking={-0.03}>{prefs ? 'Preferences' : 'Notifications'}</T>
          <Row gap={8}>
            <IconBtn icon={prefs ? 'list' : 'gear'} iconSize={18} label={prefs ? 'Back to notifications' : 'Notification preferences'} onPress={() => setPrefs(!prefs)} />
            <IconBtn icon="close" iconSize={18} label="Close" onPress={() => setN(false)} />
          </Row>
        </Row>
        {!prefs ? (
          <>
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 8 }}>
                {(['All', 'Opportunities', 'Proposals', 'Contracts', 'Messages', 'Payments', 'Disputes'] as const).map((t) => <Chip key={t} label={t} on={ntab === t} onPress={() => setNtab(t)} />)}
              </ScrollView>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 4 }}>
              {NOTIFICATIONS.filter((n) => ntab === 'All' || n.cat === ntab).map((n) => {
                const un = unreadFn(n.id);
                return (
                  <Pressable key={n.id} onPress={() => setRead({ ...read, [n.id]: true })} style={({ pressed }) => ({ flexDirection: 'row', gap: 12, padding: 12, borderRadius: 16, backgroundColor: pressed ? c.bg2 : 'transparent' })}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={n.icon as IconName} size={18} color={c.ink} />
                    </View>
                    <View style={{ flex: 1, gap: 3 }}>
                      <T size={14} lh={1.4} weight={un ? 600 : 400}>{n.text}</T>
                      <T size={12} color="muted">{n.cat} · {n.time}</T>
                    </View>
                    {un && <View accessibilityLabel="Unread" style={{ width: 8, height: 8, marginTop: 6, borderRadius: 4, backgroundColor: c.lime }} />}
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={{ paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderColor: c.line }}>
              <Btn variant="ghost" label="Mark all as read" onPress={() => setRead({ 1: true, 2: true, 3: true, 4: true })} />
            </View>
          </>
        ) : (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, gap: 4 }}>
            {(Object.keys(pref) as NoteCat[]).map((k) => (
              <Row key={k} between style={{ minHeight: 56, borderBottomWidth: 1, borderColor: c.line }}>
                <T size={15}>{PREF_LABELS[k]}</T>
                <Toggle on={pref[k]} label={PREF_LABELS[k]} onPress={() => setPref({ ...pref, [k]: !pref[k] })} />
              </Row>
            ))}
            <T size={12} color="muted" style={{ marginTop: 14 }}>Quiet hours 22:00 – 08:00 · payment and dispute updates still come through.</T>
          </ScrollView>
        )}
      </Sheet>
    </Screen>
  );
}
