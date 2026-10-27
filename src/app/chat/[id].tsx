import { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { Avatar, Btn, Field, Grad, IconBtn, Row, Screen, T, Tag } from '../../components/ui';
import { CONVOS } from '../../data/mock';
import { useColors } from '../../store/AppStore';
import { chat, useChat } from '../../store/chat';

function TypingDots() {
  const c = useColors();
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const l = Animated.loop(Animated.timing(a, { toValue: 1, duration: 1200, useNativeDriver: true }));
    l.start();
    return () => l.stop();
  }, [a]);
  return (
    <View accessibilityLabel="Typing" style={{ alignSelf: 'flex-start', flexDirection: 'row', gap: 4, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 20, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line }}>
      {[0, 1, 2].map((i) => (
        <Animated.View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.muted, opacity: a.interpolate({ inputRange: [0, 0.15 + i * 0.15, 0.3 + i * 0.15, 1], outputRange: [0.3, 1, 0.3, 0.3], extrapolate: 'clamp' }) }} />
      ))}
    </View>
  );
}

export default function Thread() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sel = Math.min(CONVOS.length - 1, Math.max(0, Number(id) || 0));
  const cur = CONVOS[sel];
  const s = useChat();
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [menu, setMenu] = useState<null | 'list' | 'block' | 'report'>(null);
  const scroll = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    chat.markRead(sel);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [sel]);

  const blocked = !!s.blocked[sel];
  const msgs = cur.msgs.concat(s.extra[sel]);
  const send = () => {
    const t = draft.trim();
    if (!t || blocked) return;
    chat.send(sel, t);
    setDraft('');
  };

  const confirm = menu === 'block'
    ? { title: `Block ${cur.first}?`, body: "They can't message you or send proposals. Active contract records stay in place.", cta: 'Block', variant: 'danger' as const, run: () => chat.toggle('blocked', sel) }
    : { title: 'Report this conversation?', body: `Trust & Safety will review the messages. ${cur.first} isn't told who reported.`, cta: 'Send report', variant: 'primary' as const, run: () => chat.toggle('reported', sel) };

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Row gap={10} style={{ paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: c.line }}>
          <IconBtn plain icon="back" iconSize={22} label="Back to messages" onPress={() => (router.canGoBack() ? router.back() : router.replace('/messages'))} />
          <Avatar ini={cur.ini} bg={cur.bg} size={38} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <T size={15} weight={600}>{cur.name}</T>
            <T size={12} color="muted">{cur.sub}</T>
          </View>
          <IconBtn plain icon="dots" label="More options" onPress={() => setMenu('list')} />
        </Row>
        <Pressable onPress={() => router.push(cur.href as never)} style={{ marginHorizontal: 12, marginTop: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <T size={13} weight={600} numberOfLines={1}>{cur.task}</T>
            <T size={12} color="muted">{cur.ctx}</T>
          </View>
          <Tag tone={cur.stateTone} label={cur.state} />
        </Pressable>
        {blocked && <View style={{ marginHorizontal: 12, marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: c.bg2 }}><T size={13} color="ink2">You blocked {cur.first}. Contract records stay available to both of you and to support.</T></View>}
        {s.reported[sel] && <View style={{ marginHorizontal: 12, marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: c.infoSoft }}><T size={13} color="info">Report sent to Trust & Safety (demo).</T></View>}

        <ScrollView ref={scroll} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16, gap: 6 }}>
          {loading ? (
            <>
              <View style={{ width: '60%', height: 44, borderRadius: 18, backgroundColor: c.bg2 }} />
              <View style={{ width: '45%', height: 44, borderRadius: 18, backgroundColor: c.bg2, alignSelf: 'flex-end' }} />
              <View style={{ width: '70%', height: 64, borderRadius: 18, backgroundColor: c.bg2 }} />
            </>
          ) : (
            msgs.map((m, i) => {
              if ('day' in m) return <T key={i} size={12} color="muted" style={{ alignSelf: 'center', paddingVertical: 8 }}>{m.day}</T>;
              if ('event' in m) return <View key={i} style={{ alignSelf: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.bg2, marginVertical: 4 }}><T size={12} color="ink2">{m.event}</T></View>;
              const out = m.dir === 'out';
              const failed = m.st === 'failed';
              const bubble = { maxWidth: '78%' as const, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, alignSelf: out ? ('flex-end' as const) : ('flex-start' as const), backgroundColor: failed ? c.dangerSoft : out ? c.ink : c.surface, borderWidth: out && !failed ? 0 : 1, borderColor: failed ? c.danger : c.line, borderBottomRightRadius: out ? 6 : 20, borderBottomLeftRadius: out ? 20 : 6 };
              const fg = failed ? c.danger : out ? c.bg : c.ink;
              return (
                <View key={i} style={{ gap: 4 }}>
                  {m.file ? (
                    <View style={[bubble, { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 8 }]}>
                      <Grad colors={['#E9D8B8', '#C99A5B']} style={{ width: 56, height: 44, borderRadius: 10 }} />
                      <View>
                        <T size={13} weight={600} color={fg}>{m.file}</T>
                        <T size={13} color={fg} style={{ opacity: 0.7 }}>{m.meta}</T>
                      </View>
                    </View>
                  ) : (
                    <View style={bubble}><T size={15} lh={1.48} color={fg}>{m.text}</T></View>
                  )}
                  {out && m.st && (
                    <Row gap={6} style={{ alignSelf: 'flex-end' }}>
                      <T size={11} color={failed ? 'danger' : 'muted'}>{m.st === 'sending' ? 'Sending…' : failed ? 'Not sent' : m.st}</T>
                      {failed && m.id != null && (
                        <Pressable onPress={() => chat.retry(sel, m.id!, m.text ?? '')} style={{ minHeight: 32, justifyContent: 'center' }}>
                          <T size={12} style={{ textDecorationLine: 'underline' }}>Retry</T>
                        </Pressable>
                      )}
                    </Row>
                  )}
                </View>
              );
            })
          )}
          {!loading && s.typing[sel] && <TypingDots />}
        </ScrollView>

        <Row gap={8} style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6, borderTopWidth: 1, borderColor: c.line }}>
          <IconBtn icon="clip" iconSize={18} label="Attach a file" />
          <Field style={{ flex: 1, borderRadius: 24, minHeight: 48, paddingHorizontal: 16 }} placeholder={blocked ? 'You blocked this person' : `Message ${cur.first}`} value={draft} onChangeText={setDraft} editable={!blocked} onSubmitEditing={send} returnKeyType="send" accessibilityLabel="Message" />
          <Pressable accessibilityRole="button" accessibilityLabel="Send" disabled={blocked} onPress={send} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center', opacity: blocked ? 0.4 : 1 }}>
            <Icon name="up" size={18} color="#101010" stroke={2.2} />
          </Pressable>
        </Row>
        <T size={11} color="muted" center style={{ paddingBottom: 4 }}>Include “fail” to preview a failed send · replies are simulated</T>
      </KeyboardAvoidingView>

      <Modal visible={!!menu} transparent animationType="slide" onRequestClose={() => setMenu(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: 12, paddingBottom: insets.bottom + 16 }}>
          <Pressable accessibilityLabel="Close" onPress={() => setMenu(null)} style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]} />
          <View style={{ gap: 8 }}>
            {menu === 'list' ? (
              <View style={{ borderRadius: 18, overflow: 'hidden' }}>
                {[
                  { l: s.muted[sel] ? 'Unmute notifications' : 'Mute notifications', run: () => { chat.toggle('muted', sel); setMenu(null); } },
                  { l: 'Report conversation', run: () => setMenu('report') },
                  { l: `Block ${cur.first}`, run: () => setMenu('block'), danger: true },
                ].map((a, i) => (
                  <Pressable key={a.l} onPress={a.run} style={({ pressed }) => ({ minHeight: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? c.bg2 : c.surface, borderBottomWidth: i < 2 ? 1 : 0, borderColor: c.line })}>
                    <T size={16} color={a.danger ? 'danger' : 'ink'}>{a.l}</T>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={{ borderRadius: 22, backgroundColor: c.bg, padding: 20, gap: 12 }}>
                <T size={20} weight={650} tracking={-0.02}>{confirm.title}</T>
                <T size={14} color="ink2" lh={1.5}>{confirm.body}</T>
                <Btn variant={confirm.variant} label={confirm.cta} onPress={() => { confirm.run(); setMenu(null); }} />
              </View>
            )}
            <Btn variant="ghost" label="Cancel" onPress={() => setMenu(null)} style={{ backgroundColor: c.surface, borderRadius: 18, minHeight: 56 }} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
