# ARCHITECTURE.md — System Architecture

## Pattern
**Single-Page Application (SPA)** — React 18, client-side rendering only. No backend, no SSR.

## Application Layers

```
┌─────────────────────────────────────────────┐
│              Entry Point                     │
│  src/main.tsx → <BrowserRouter><App />       │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              Routing Layer                   │
│  src/App.tsx — React Router v6 <Routes>      │
│  Conditionally renders Navbar/Footer         │
│  Scroll-to-top on route change (useEffect)   │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              Page Layer                      │
│  src/pages/*.tsx — page-level compositions   │
│  Each page assembles section components      │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│           Component Layer                    │
│  src/components/                             │
│  ├── layout/   — Navbar, Footer, TopBar      │
│  ├── home/     — HeroBooking, Fleet, etc.    │
│  ├── fleets/   — booking flow components     │
│  └── ui/       — reusable primitives         │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              Data Layer                      │
│  src/data/index.ts — all static arrays       │
│  src/types/index.ts — TypeScript interfaces  │
│  src/env.ts — brand config from env vars     │
└─────────────────────────────────────────────┘
```

## Booking Flow (Core User Journey)

```
HomePage (/HeroBooking)
  → user fills from/to/datetime/type
  → navigate('/vehicles', { state: BookingState })

VehicleSelect (/vehicles)
  → reads BookingState from location.state
  → user selects vehicle
  → navigate('/booking-details', { state: BookingState + vehicle })

BookingDetails (/booking-details)
  → reads BookingState from location.state
  → user fills PassengerForm
  → client-side validation (email regex, phone regex, required fields)
  → navigate('/checkout', { state: BookingState + passenger })

Checkout (/checkout)
  → reads full BookingState from location.state
  → displays trip/vehicle/passenger summary
  → calculates subtotal + 5% VAT
  → "Pay" → setTimeout(2200ms) → shows confirmation screen
  → random booking ref: INV-XXXXXX
```

## State Management
- **No global state** (no Redux, Zustand, Context API for booking)
- State flows exclusively through **React Router `location.state`** between booking steps
- Each booking step reads prior state and extends it before navigating forward
- `BookingState` interface in `src/types/index.ts` is the shared data shape
- `useLocation().state` can be empty/undefined (pages have fallback defaults)
- **Risk:** Refreshing mid-booking loses all state (no persistence)

## Auth Flow
- Routes `/signin` and `/signup` exist as page stubs
- `App.tsx` detects auth routes via `AUTH_ROUTES = ['/signin', '/signup']`
- On auth routes: Navbar and Footer are hidden
- No actual authentication logic implemented

## Layout Architecture
- `App.tsx` wraps all routes with conditional Navbar/Footer
- Auth pages (`/signin`, `/signup`) get no chrome (full-page layout)
- All other pages get `<Navbar>` at top and `<Footer>` at bottom
- `<main>` wraps `<Routes>` — semantic HTML

## Component Patterns
- **Functional components** with React hooks only (no class components)
- **Local state** via `useState` — no lifting state up beyond booking flow
- **No custom hooks** — logic inline in components
- **Prop drilling** avoided — components read from `location.state` directly
- Booking flow components are self-contained pages, not reusable sub-components

## Data Flow
```
src/env.ts ──────────────────→ brand constants (name, email, phone, address)
src/data/index.ts ──────────→ FLEET, SERVICES, FEATURES, FAQs, etc.
src/types/index.ts ─────────→ TypeScript interfaces shared across components
React Router location.state → booking data between flow steps
```

## Entry Points
- `index.html` — Vite HTML template with `<div id="root">`
- `src/main.tsx` — React 18 `createRoot`, wraps App in `<BrowserRouter>`
- `src/App.tsx` — route definitions, layout shell
