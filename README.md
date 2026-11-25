# EQIP-Version-1

EQIP homepage — Next.js 16 (App Router, TypeScript) with a scroll-driven Three.js 3D scene.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3100. The dev server also listens on your local network (the terminal prints the address), so phones on the same Wi-Fi can open it.

## Production build

```bash
npm run build
npm start
```

## Where things live

| Path | What it is |
| --- | --- |
| `lib/content.ts` | All page copy, from *Homepage Content.docx* |
| `components/sections.tsx` | Page sections, and how each one steers the 3D scene |
| `components/interactive.tsx` | Pinned question, horizontal track, evidence trail, case-study stepper, tilt cards |
| `lib/estateScene.ts` | Three.js particle "software estate" that morphs between four states |
| `app/globals.css` | Brand palette (EQIP Brand Guidelines 1.0) and all styles |
| `public/assets/` | Logo lockup, wordmark and symbol, taken from the brand guide |
