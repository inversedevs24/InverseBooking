# INTEGRATIONS.md — External Integrations

## External Image CDNs
- **Unsplash** (`images.unsplash.com`) — All vehicle and service images
  - Used in `src/data/index.ts` (FLEET, SERVICES arrays)
  - Used in `src/components/fleets/VehicleSelect.tsx` (inline vehicle data)
  - Used in `src/pages/PartnerPage.tsx`
- **Pexels** (`images.pexels.com`) — Hero background image
  - Used in `src/components/home/HeroBooking.tsx`
- No self-hosted images; all images are external URLs with width/quality params (`?w=400&q=80`)

## Maps
- **OpenStreetMap** (embedded iframe, `openstreetmap.org/export/embed.html`)
  - Used in `src/components/fleets/VehicleSelect.tsx` — Route Preview panel
  - Hardcoded to Dubai, UAE bounding box
  - No API key required (free embed)
  - No real route calculation — purely decorative

## Fonts
- **Google Fonts** (implied by font names used in Tailwind config)
  - `Outfit` (font-head) — headings
  - `Plus Jakarta Sans` (font-body) — body text
  - Loaded via CSS `@import` or `<link>` in `index.html` (to verify)

## Backend / API
- **None** — This is a fully frontend-only SPA
- No REST API calls, no GraphQL, no Supabase, no Firebase
- No authentication backend
- No booking submission endpoint
- All booking data is managed via React Router `location.state` (in-memory, non-persistent)

## Payment
- **No real payment gateway integrated**
- Checkout page (`src/components/fleets/Checkout.tsx`) simulates payment with `setTimeout(2200ms)`
- UI shows "Card", "Apple Pay", "Google Pay" labels — these are decorative only
- Booking reference is a random string: `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

## Email / Notifications
- **None** — No email sending, no SMS, no push notifications
- Contact form (`ContactPage`) and partner form (`PartnerPage`) have `onSubmit` handlers that set a `submitted` state flag and reset after 3 seconds — no actual form submission

## Analytics / Monitoring
- **None** — No Google Analytics, Segment, Sentry, LogRocket, or similar

## Auth Providers
- **None** — Sign In (`/signin`) and Sign Up (`/signup`) pages exist as UI shells only
- No OAuth, no JWT, no session management implemented

## Summary
This codebase has **zero real external service integrations** beyond image CDNs and an OpenStreetMap embed. All functional integrations (payment, auth, booking backend, email) are UI mockups/simulations.
