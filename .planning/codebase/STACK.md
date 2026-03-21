# STACK.md — Technology Stack

## Language & Runtime
- **Language:** TypeScript 5.9 (strict mode implied by TSX files)
- **Runtime:** Browser (SPA — no server-side runtime)
- **Module system:** ESM (`"type": "module"` in package.json)

## Build Tooling
- **Bundler:** Vite 7.x (`@vitejs/plugin-react` for JSX/React Fast Refresh)
- **Scripts:**
  - `npm run dev` — Vite dev server
  - `npm run build` — Production build
  - `npm run preview` — Preview production build locally

## Frontend Framework
- **UI library:** React 18.2
- **Rendering:** Client-side only (no SSR/SSG)
- **Entry point:** `src/main.tsx` → mounts `<App />` into `#root`
- **JSX runtime:** React automatic (`@vitejs/plugin-react`)

## Routing
- **Library:** React Router DOM 6.22
- **Mode:** Client-side hash/history routing via `<BrowserRouter>` (in `src/main.tsx`)
- **Routes defined:** `src/App.tsx`

## Styling
- **Framework:** Tailwind CSS 3.4 (v3, NOT v4)
- **PostCSS:** `autoprefixer` + `tailwindcss` via `postcss.config.js`
- **Config:** `tailwind.config.js` — single source of truth for design tokens
- **Global CSS:** `src/index.css` (Tailwind base/components/utilities + `.scrollbar-dark` utility)
- **Content scan:** `./index.html`, `./src/**/*.{ts,tsx}`

## Icon Library
- **Library:** `lucide-react` ^0.576.0
- **Usage:** Navbar (Menu/X), TopBar (Phone/Mail), Footer (Mail/Phone/MapPin), ContactPage, ChauffeurSection, PartnerPage

## Carousel / Slider
- **Library:** `swiper` ^12.1.2
- **Usage:** Fleet/promo sections (imported but verify active usage)

## Design Tokens (`tailwind.config.js`)
```js
colors: {
  primary: '#0F172A',       // Deep navy
  secondary: '#1E293B',     // Dark secondary
  accent: '#2563EB',        // Premium blue CTAs
  primaryBg: '#F8FAFC',     // Light background
  secondaryBg: '#FFFFFF',
  muted: '#64748B',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
}
fontFamily: { head: ['Outfit'], body: ['Plus Jakarta Sans'] }
fontSize: { display, heading, title, span, label, content }
borderRadius: { card: '12px', 'card-lg': '20px' }
boxShadow: { card, 'card-lg' }
maxWidth: { container: '1200px' }
animations: { 'hero-zoom', 'scroll-bob', 'pop-in', 'spin-ring' }
```

## Environment Variables
- Managed via Vite (`import.meta.env`)
- Exported from `src/env.ts`:
  - `VITE_BRAND_NAME`
  - `VITE_BRAND_EMAIL`
  - `VITE_BRAND_PHONE`
  - `VITE_BRAND_ADDRESS`
- `.env` / `.env.example` files at project root

## TypeScript Config
- `tsconfig.json` — standard Vite React TS config
- Type declarations: `src/vite-env.d.ts`
- Dev types: `@types/react`, `@types/react-dom`, `@types/node`

## Key Dependencies Summary
| Package | Version | Role |
|---|---|---|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | DOM rendering |
| react-router-dom | ^6.22.0 | Client routing |
| lucide-react | ^0.576.0 | Icons |
| swiper | ^12.1.2 | Carousel/slider |
| tailwindcss | ^3.4.19 | Utility CSS |
| vite | ^7.3.1 | Build tool |
| typescript | ^5.9.3 | Type checking |
