import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '../../components/Icon';
import { T } from '../../components/ui';
import { useColors } from '../../store/AppStore';

const ITEMS: { name: string; label: string; icon?: IconName }[] = [
  { name: 'home', label: 'Home', icon: 'home' },
  { name: 'explore', label: 'Explore', icon: 'explore' },
  { name: 'create', label: 'Create' },
  { name: 'messages', label: 'Messages', icon: 'msg' },
  { name: 'profile', label: 'Profile', icon: 'user' },
];

// Bottom nav from the design (.mnav): four tabs plus a lime "Create" button that opens the post wizard.
function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;
  return (
    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: c.line, backgroundColor: c.bg, paddingTop: 4, paddingHorizontal: 8, paddingBottom: Math.max(insets.bottom, 14) }}>
      {ITEMS.map((it) => {
        if (!it.icon) {
          return (
            <Pressable key={it.name} accessibilityRole="button" accessibilityLabel="Post a task" onPress={() => router.push('/post')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 56 }}>
              <View style={{ width: 50, height: 50, borderRadius: 17, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center', shadowColor: c.lime, shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
                <Icon name="plus" size={22} color={c.limeInk} stroke={2.2} />
              </View>
            </Pressable>
          );
        }
        const on = current === it.name;
        return (
          <Pressable
            key={it.name}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={it.label}
            onPress={() => {
              const r = state.routes.find((x) => x.name === it.name);
              if (r) navigateToTab(r.key);
            }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 56 }}
          >
            {on && <View style={{ position: 'absolute', top: 0, width: 24, height: 2, borderRadius: 2, backgroundColor: c.ink }} />}
            <Icon name={it.icon} size={22} color={on ? c.ink : c.muted} />
            <T size={11} weight={550} color={on ? 'ink' : 'muted'}>{it.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const c = useColors();
  return (
    <Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.bg } }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
