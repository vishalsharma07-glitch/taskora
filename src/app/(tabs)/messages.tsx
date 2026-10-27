import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '../../components/Icon';
import { Avatar, H1, Row, Screen, T, Tag } from '../../components/ui';
import { CONVOS } from '../../data/mock';
import { useColors } from '../../store/AppStore';
import { lastText, useChat } from '../../store/chat';
import { fontFor } from '../../theme/tokens';

export default function Messages() {
  const c = useColors();
  const s = useChat();
  return (
    <Screen>
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, gap: 12 }}>
        <Row between>
          <H1 size={30}>Messages</H1>
          <Tag label="Demo" dashed />
        </Row>
        <Row gap={10} style={{ minHeight: 46, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}>
          <Icon name="search" size={16} color={c.muted} stroke={2} />
          <TextInput accessibilityLabel="Search conversations" placeholder="Search" placeholderTextColor={c.muted} style={{ flex: 1, fontSize: 16, color: c.ink, fontFamily: fontFor(400), paddingVertical: 0 }} />
        </Row>
      </View>
      <ScrollView>
        {CONVOS.map((cv, k) => {
          const un = !s.read[k] && k < 2;
          return (
            <Pressable key={cv.name} onPress={() => router.push(`/chat/${k}`)} style={({ pressed }) => ({ flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, minHeight: 80, backgroundColor: pressed ? c.bg2 : 'transparent' })}>
              <Avatar ini={cv.ini} bg={cv.bg} size={52} />
              <View style={{ flex: 1, gap: 3, minWidth: 0 }}>
                <Row between>
                  <T size={15} weight={un ? 650 : 550}>{cv.name}</T>
                  <T size={12} color="muted">{cv.time}</T>
                </Row>
                <T size={12} color="muted">{cv.task}</T>
                <T size={14} color="ink2" numberOfLines={1}>{lastText(k, s)}</T>
              </View>
              {un && <View accessibilityLabel="Unread" style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.lime }} />}
            </Pressable>
          );
        })}
        <T size={12} color="muted" lh={1.5} style={{ margin: 20, marginTop: 12 }}>Keep decisions here — messages form the record if a dispute is ever needed. Never share payment details or pay off-platform.</T>
      </ScrollView>
    </Screen>
  );
}
