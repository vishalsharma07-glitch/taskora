import { useSyncExternalStore } from 'react';
import { CONVOS, type Msg } from '../data/mock';

// In-memory chat store shared by the inbox and thread screens.
// Replace `send` with a real API / socket call when the backend is ready.

type State = { extra: Record<number, Msg[]>; read: Record<number, boolean>; typing: Record<number, boolean>; blocked: Record<number, boolean>; reported: Record<number, boolean>; muted: Record<number, boolean> };

let state: State = { extra: { 0: [], 1: [], 2: [], 3: [] }, read: {}, typing: {}, blocked: {}, reported: {}, muted: {} };
const subs = new Set<() => void>();
const set = (fn: (s: State) => State) => {
  state = fn(state);
  subs.forEach((f) => f());
};

export function useChat() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => state,
  );
}

const patchMsg = (sel: number, id: number, patch: Partial<Extract<Msg, { dir: 'in' | 'out' }>>) =>
  set((s) => ({ ...s, extra: { ...s.extra, [sel]: s.extra[sel].map((m) => ('id' in m && m.id === id ? { ...m, ...patch } : m)) } }));

function deliver(sel: number, id: number, text: string) {
  const fail = /fail/i.test(text);
  setTimeout(() => {
    patchMsg(sel, id, { st: fail ? 'failed' : 'Delivered' });
    set((s) => ({ ...s, typing: { ...s.typing, [sel]: !fail } }));
  }, 900);
  if (!fail) {
    setTimeout(() => {
      set((s) => ({ ...s, typing: { ...s.typing, [sel]: false }, extra: { ...s.extra, [sel]: s.extra[sel].concat({ id: Date.now(), dir: 'in', text: 'Got it, thanks! (simulated reply)' }) } }));
    }, 2600);
  }
}

export const chat = {
  markRead: (sel: number) => set((s) => ({ ...s, read: { ...s.read, [sel]: true } })),
  send: (sel: number, text: string) => {
    const id = Date.now();
    set((s) => ({ ...s, extra: { ...s.extra, [sel]: s.extra[sel].concat({ id, dir: 'out', text, st: 'sending' }) } }));
    deliver(sel, id, text);
  },
  retry: (sel: number, id: number, text: string) => {
    const t = text.replace(/fail/gi, 'resend');
    patchMsg(sel, id, { text: t, st: 'sending' });
    deliver(sel, id, t);
  },
  toggle: (key: 'blocked' | 'reported' | 'muted', sel: number) => set((s) => ({ ...s, [key]: { ...s[key], [sel]: !s[key][sel] } })),
};

export function lastText(sel: number, s: State) {
  const all = CONVOS[sel].msgs.concat(s.extra[sel]);
  for (let i = all.length - 1; i >= 0; i--) {
    const m = all[i];
    if ('dir' in m && m.text) return m.text;
  }
  return '';
}
