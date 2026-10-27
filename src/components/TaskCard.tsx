import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { inr, modeLabel, type Task } from '../data/mock';
import { useApp } from '../store/AppStore';
import { IconBtn, Row, T, Tag } from './ui';

type Props = { task: Task; newLabel?: string; showSave?: boolean; compact?: boolean };

export function TaskCard({ task: t, newLabel, showSave, compact }: Props) {
  const { c, saved, toggleSaved } = useApp();
  const sv = !!saved[t.id];
  const open = () => router.push(`/task/${t.id}`);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={open}
      style={({ pressed }) => ({ gap: 10, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, transform: [{ scale: pressed ? 0.985 : 1 }] })}
    >
      <Row between>
        <Row gap={6} wrap style={{ flex: 1 }}>
          <Tag label={modeLabel(t)} />
          <Tag label={t.effort} />
          {newLabel && showSave && <Tag tone="lime" label={'● ' + newLabel} />}
        </Row>
        {showSave ? (
          <IconBtn icon="bookmark" size={40} iconSize={16} label={sv ? 'Remove from saved' : 'Save task'} bg={sv ? c.lime : undefined} fill={sv ? '#101010' : 'none'} onPress={() => toggleSaved(t.id)} />
        ) : (
          newLabel && <Tag tone="lime" label={'● ' + newLabel} />
        )}
      </Row>
      <T size={16} weight={600} lh={1.3} tracking={-0.015}>{t.title}</T>
      <Row between center={false} style={{ alignItems: 'flex-end' }}>
        <T size={22} weight={600} mono tracking={-0.03}>{inr(t.budget)}</T>
        <T size={12} color="muted" style={{ textAlign: 'right' }}>
          Due {t.due} · {t.props} proposal{t.props === 1 ? '' : 's'}
        </T>
      </Row>
      {compact ? (
        <T size={12} color="ink2">{(t.verified ? '✓ Verified customer · ' : 'Unverified · ') + t.where}</T>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: c.line, paddingTop: 10 }}>
          <T size={12} color="ink2">{(t.verified ? '✓ Verified · ' : 'Unverified · ') + t.where}</T>
          <T size={14} weight={600}>View task →</T>
        </View>
      )}
    </Pressable>
  );
}
