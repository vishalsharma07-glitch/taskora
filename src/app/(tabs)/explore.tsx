import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Icon } from '../../components/Icon';
import { TaskCard } from '../../components/TaskCard';
import { Btn, Chip, H1, IconBtn, Rise, Row, Screen, Sheet, T, Tag, Toggle } from '../../components/ui';
import { inr, TASKS, type TaskMode } from '../../data/mock';
import { useApp } from '../../store/AppStore';
import { fontFor } from '../../theme/tokens';

const SKILLS = ['Shopify', 'React', 'Webflow', 'Video editing', 'Photography', 'Hardware', 'Networking', 'Electrical'];

function SmallSeg({ items }: { items: { key: string; on: boolean; onPress: () => void; label?: string; icon?: 'list' | 'map'; disabled?: boolean; a11y?: string }[] }) {
  const { c } = useApp();
  return (
    <View style={{ flexDirection: 'row', padding: 3, borderRadius: 12, backgroundColor: c.bg2, borderWidth: 1, borderColor: c.line }}>
      {items.map((it) => (
        <Pressable key={it.key} accessibilityLabel={it.a11y ?? it.label} accessibilityState={{ selected: it.on, disabled: it.disabled }} disabled={it.disabled} onPress={it.onPress} style={{ minHeight: 34, paddingHorizontal: 12, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: it.on ? c.surface : 'transparent', opacity: it.disabled ? 0.4 : 1 }}>
          {it.icon ? <Icon name={it.icon} size={15} color={it.on ? c.ink : c.muted} stroke={2} /> : <T size={13} weight={560} color={it.on ? 'ink' : 'muted'}>{it.label}</T>}
        </Pressable>
      ))}
    </View>
  );
}

export default function Explore() {
  const { c, saved } = useApp();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'all' | TaskMode>('all');
  const [radiusKm, setRadius] = useState(10);
  const [skills, setSkills] = useState<string[]>([]);
  const [minB, setMinB] = useState(0);
  const [dl, setDl] = useState<'any' | '7' | '30'>('any');
  const [verified, setVerified] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState<'best' | 'new'>('best');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [pick, setPick] = useState<number | null>(null);
  const [alert, setAlert] = useState(false);
  const [fOpen, setF] = useState(false);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = TASKS.filter(
      (t) =>
        (type === 'all' || t.mode === type) &&
        (!t.dist || type === 'all' || type === 'remote' || t.dist <= radiusKm) &&
        (!skills.length || t.skills.some((x) => skills.includes(x))) &&
        t.budget >= minB &&
        (dl === 'any' || t.days <= +dl) &&
        (!verified || t.verified) &&
        (!savedOnly || saved[t.id]) &&
        (!s || (t.title + ' ' + t.skills.join(' ') + ' ' + t.where).toLowerCase().includes(s)),
    );
    return r.sort((a, b) => (sort === 'new' ? a.age - b.age : b.match - a.match));
  }, [q, type, radiusKm, skills, minB, dl, verified, savedOnly, saved, sort]);

  const mapOk = type === 'local' || type === 'hybrid';
  const v = mapOk ? view : 'list';
  const local = results.filter((t) => t.x != null);
  const picked = local.find((t) => t.id === pick);
  const fc = (skills.length ? 1 : 0) + (minB ? 1 : 0) + (dl !== 'any' ? 1 : 0) + (verified ? 1 : 0);
  const savedCount = Object.values(saved).filter(Boolean).length;
  const reset = () => {
    setType('all'); setRadius(10); setSkills([]); setMinB(0); setDl('any'); setVerified(false); setSavedOnly(false); setQ('');
  };

  return (
    <Screen>
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, gap: 12 }}>
        <Row between>
          <H1 size={30}>Explore</H1>
          <Btn variant="ghost" sm icon="bell" label={alert ? 'Alerts on' : 'Alert me'} onPress={() => setAlert(!alert)} />
        </Row>
        <Row gap={8}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: c.line2, backgroundColor: c.surface }}>
            <Icon name="search" size={18} color={c.muted} stroke={2} />
            <TextInput accessibilityLabel="Search tasks" placeholder="Shopify, Reels, plumber…" placeholderTextColor={c.muted} value={q} onChangeText={setQ} style={{ flex: 1, fontSize: 16, color: c.ink, fontFamily: fontFor(400), paddingVertical: 0 }} />
          </View>
          <View>
            <IconBtn icon="filter" size={50} label={'Filters' + (fc ? `, ${fc} active` : '')} onPress={() => setF(true)} />
            {fc > 0 && (
              <View style={{ position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, paddingHorizontal: 5, borderRadius: 10, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
                <T size={11} weight={650} mono color="#101010">{fc}</T>
              </View>
            )}
          </View>
        </Row>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 10 }}>
          {([['all', 'All'], ['remote', 'Remote'], ['local', 'Nearby'], ['hybrid', 'Hybrid']] as const).map((t) => (
            <Chip key={t[0]} label={t[1]} on={type === t[0]} onPress={() => { setType(t[0]); setPick(null); }} />
          ))}
          <Chip on={savedOnly} onPress={() => setSavedOnly(!savedOnly)} label={`Saved · ${savedCount}`}>
            <Icon name="bookmark" size={14} color={savedOnly ? c.bg : c.ink2} fill={savedOnly ? c.bg : c.ink2} />
          </Chip>
        </ScrollView>
      </View>

      <Row between style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
        <T size={13} color="muted">{results.length} sample task{results.length === 1 ? '' : 's'}</T>
        <Row gap={6}>
          <SmallSeg items={[{ key: 'b', label: 'Best', on: sort === 'best', onPress: () => setSort('best') }, { key: 'n', label: 'New', on: sort === 'new', onPress: () => setSort('new') }]} />
          <SmallSeg
            items={[
              { key: 'l', icon: 'list', a11y: 'List view', on: v === 'list', onPress: () => setView('list') },
              { key: 'm', icon: 'map', a11y: mapOk ? 'Map view' : 'Map view — choose Nearby or Hybrid first', on: v === 'map', onPress: () => setView('map'), disabled: !mapOk },
            ]}
          />
        </Row>
      </Row>

      {results.length === 0 ? (
        <ScrollView contentContainerStyle={{ paddingVertical: 40, paddingHorizontal: 28, alignItems: 'center', gap: 12 }}>
          <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="search" size={26} color={c.ink} />
          </View>
          <T size={20} weight={620} tracking={-0.02}>No tasks match</T>
          <T size={14} color="muted" lh={1.55} center>Try a wider distance or a lower minimum budget. More skills on your profile also means more matches.</T>
          <Btn label="Reset filters" onPress={reset} style={{ alignSelf: 'stretch' }} />
          <Btn variant="ghost" label="Add skills" onPress={() => router.navigate('/profile')} style={{ alignSelf: 'stretch' }} />
        </ScrollView>
      ) : v === 'list' ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, gap: 10 }}>
          {results.map((t, i) => (
            <Rise key={t.id} delay={i * 40}>
              <TaskCard task={t} showSave newLabel={t.age === 0 ? 'New' : undefined} />
            </Rise>
          ))}
        </ScrollView>
      ) : (
        <MapView tasks={local} pick={pick} setPick={setPick} picked={picked} />
      )}

      <Sheet visible={fOpen} onClose={() => setF(false)}>
        <Row between style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
          <T size={22} weight={650} tracking={-0.03}>Filters</T>
          <Pressable onPress={reset} style={{ minHeight: 44, justifyContent: 'center' }}>
            <T size={15} color="ink2" style={{ textDecorationLine: 'underline' }}>Reset</T>
          </Pressable>
        </Row>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 20 }}>
          {mapOk && (
            <View style={{ gap: 8 }}>
              <Row between>
                <T size={15} weight={600}>Distance from Kothrud</T>
                <T mono weight={600}>{radiusKm} km</T>
              </Row>
              <Slider minimumValue={1} maximumValue={25} step={1} value={radiusKm} onValueChange={setRadius} minimumTrackTintColor={c.ink} maximumTrackTintColor={c.line2} thumbTintColor={c.ink} />
            </View>
          )}
          <View style={{ gap: 10 }}>
            <T size={15} weight={600}>Skills</T>
            <Row gap={8} wrap>
              {SKILLS.map((s) => <Chip key={s} label={s} on={skills.includes(s)} onPress={() => setSkills(skills.includes(s) ? skills.filter((x) => x !== s) : skills.concat(s))} />)}
            </Row>
          </View>
          <View style={{ gap: 8 }}>
            <Row between>
              <T size={15} weight={600}>Minimum budget</T>
              <T mono weight={600}>{minB ? inr(minB) + '+' : 'Any'}</T>
            </Row>
            <Slider minimumValue={0} maximumValue={15000} step={500} value={minB} onValueChange={setMinB} minimumTrackTintColor={c.ink} maximumTrackTintColor={c.line2} thumbTintColor={c.ink} />
          </View>
          <View style={{ gap: 10 }}>
            <T size={15} weight={600}>Deadline</T>
            <Row gap={8} wrap>
              {([['any', 'Any time'], ['7', 'This week'], ['30', 'This month']] as const).map((d) => <Chip key={d[0]} label={d[1]} on={dl === d[0]} onPress={() => setDl(d[0])} />)}
            </Row>
          </View>
          <Row between style={{ minHeight: 52, borderTopWidth: 1, borderColor: c.line, paddingTop: 8 }}>
            <T size={15}>Verified customers only</T>
            <Toggle on={verified} label="Verified customers only" onPress={() => setVerified(!verified)} />
          </Row>
        </ScrollView>
        <View style={{ paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderColor: c.line }}>
          <Btn label={`Show ${results.length} tasks`} onPress={() => setF(false)} />
        </View>
      </Sheet>
    </Screen>
  );
}

function MapView({ tasks, pick, setPick, picked }: { tasks: typeof TASKS; pick: number | null; setPick: (n: number) => void; picked?: (typeof TASKS)[number] }) {
  const { c } = useApp();
  return (
    <View accessibilityLabel="Map of nearby tasks, illustrative" style={{ flex: 1, backgroundColor: c.map, overflow: 'hidden' }}>
      {/* Illustrative street grid */}
      {Array.from({ length: 14 }).map((_, i) => <View key={'h' + i} style={{ position: 'absolute', left: 0, right: 0, top: i * 64, height: 2, backgroundColor: c.road }} />)}
      {Array.from({ length: 8 }).map((_, i) => <View key={'v' + i} style={{ position: 'absolute', top: 0, bottom: 0, left: i * 64, width: 2, backgroundColor: c.road }} />)}
      <View style={{ position: 'absolute', left: '-20%', top: '45%', width: '140%', height: 14, backgroundColor: c.road, transform: [{ rotate: '-28deg' }] }} />
      <View style={{ position: 'absolute', left: '48%', top: '50%', width: 18, height: 18, marginLeft: -9, marginTop: -9, borderRadius: 9, backgroundColor: c.lime, borderWidth: 3, borderColor: c.surface }} />
      {tasks.map((t) => {
        const on = pick === t.id;
        return (
          <Pressable key={t.id} accessibilityLabel={`${t.title}, ${inr(t.budget)}, ${t.dist} km`} onPress={() => setPick(t.id)} style={{ position: 'absolute', left: `${t.x}%`, top: `${t.y}%`, alignItems: 'center', transform: [{ translateX: -36 }, { translateY: -44 }, { scale: on ? 1.05 : 1 }] }}>
            <View style={{ paddingVertical: 7, paddingHorizontal: 10, borderRadius: 10, backgroundColor: on ? c.ink : c.surface, borderWidth: 1, borderColor: c.line, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 3 }}>
              <T size={13} weight={600} mono color={on ? c.bg : c.ink}>{inr(t.budget)}</T>
            </View>
            <View style={{ width: 2, height: 10, backgroundColor: c.ink }} />
          </Pressable>
        );
      })}
      <Tag label="Illustrative · approximate areas" style={{ position: 'absolute', left: 12, top: 12 }} />
      {picked && (
        <Rise style={{ position: 'absolute', left: 12, right: 12, bottom: 12, padding: 16, borderRadius: 18, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, gap: 10 }}>
          <T size={15} weight={600}>{picked.title}</T>
          <T size={13} color="muted">{picked.where} · {picked.dist} km · Due {picked.due}</T>
          <Row between>
            <T size={20} weight={600} mono>{inr(picked.budget)}</T>
            <Btn sm label="View task" onPress={() => router.push(`/task/${picked.id}`)} />
          </Row>
        </Rise>
      )}
    </View>
  );
}
