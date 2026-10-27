import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { dark, light, type Palette } from '../theme/tokens';

type Mode = 'work' | 'hire';

type AppState = {
  c: Palette;
  isDark: boolean;
  toggleDark: () => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  saved: Record<number, boolean>;
  toggleSaved: (id: number) => void;
};

const Ctx = createContext<AppState | null>(null);

// Client-only state for the prototype. Swap pieces for API-backed hooks later.
export function AppProvider({ children }: { children: ReactNode }) {
  const [isDark, setDark] = useState(false);
  const [mode, setMode] = useState<Mode>('work');
  const [saved, setSaved] = useState<Record<number, boolean>>({ 2: true });

  const value = useMemo<AppState>(
    () => ({
      c: isDark ? dark : light,
      isDark,
      toggleDark: () => setDark((d) => !d),
      mode,
      setMode,
      saved,
      toggleSaved: (id) => setSaved((s) => ({ ...s, [id]: !s[id] })),
    }),
    [isDark, mode, saved],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}

export const useColors = () => useApp().c;
