# Taskora — mobile prototype

An Expo (SDK 58) + Expo Router build of the Taskora mobile design. It runs in Expo Go and uses sample data only, with no backend.

## Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. If your phone and computer are on different networks, use `npx expo start --tunnel`.

## Structure

- `src/app/`: routes. `index` (welcome), `onboarding`, `(tabs)/` (home, explore, messages, profile), `task/[id]`, `post` (8-step wizard), `proposals`, `contract`, `chat/[id]`, `earnings`
- `src/components/ui.tsx`: shared design-system pieces (T, Btn, Chip, Tag, Field, Seg, Toggle, Opt, Sheet, Card…)
- `src/theme/tokens.ts`: colour tokens (light/dark) and Geist font mapping
- `src/data/mock.ts`: all sample data. Replace it with API calls when the backend is ready.
- `src/store/`: client state (`AppStore` for theme, mode and saved tasks; `chat` for messages)

You can turn on dark mode under Profile → Settings.
