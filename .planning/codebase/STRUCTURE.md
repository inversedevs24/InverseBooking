# STRUCTURE.md — Directory Layout

## Root
```
InverseBooking/
├── index.html              # Vite HTML entry
├── package.json            # Dependencies & scripts
├── tailwind.config.js      # Design tokens (single source of truth)
├── postcss.config.js       # PostCSS (tailwind + autoprefixer)
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config (React plugin)
├── .env                    # Brand env vars (gitignored)
├── .env.example            # Env var template
├── CLAUDE.md               # Claude Code workflow instructions
├── README.md               # Project readme
├── node_modules/           # Dependencies
├── .planning/              # GSD planning artifacts
│   └── codebase/           # Codebase map documents
└── src/                    # All application source code
```

## Source Tree (`src/`)
```
src/
├── main.tsx                # App entry — createRoot, BrowserRouter
├── App.tsx                 # Route definitions, layout shell
├── env.ts                  # Brand env var exports
├── index.css               # Tailwind directives + .scrollbar-dark
├── vite-env.d.ts           # Vite type declarations
├── types/
│   └── index.ts            # All shared TypeScript interfaces
├── data/
│   └── index.ts            # Static data arrays (FLEET, SERVICES, FAQs, etc.)
├── pages/
│   ├── HomePage.tsx        # / — hero + sections composition
│   ├── AboutPage.tsx       # /about
│   ├── ContactPage.tsx     # /contact
│   ├── PartnerPage.tsx     # /partner — partner registration
│   ├── SignInPage.tsx      # /signin (auth stub)
│   ├── SignUpPage.tsx      # /signup (auth stub)
│   ├── TermsPage.tsx       # /terms
│   ├── PrivacyPage.tsx     # /privacy
│   ├── BookingConditionsPage.tsx  # /booking-conditions
│   ├── RefundPage.tsx      # /refund
│   └── HelpPage.tsx        # /help
└── components/
    ├── layout/
    │   ├── Navbar.tsx      # Top navigation (mobile responsive, Menu/X icons)
    │   ├── Footer.tsx      # Site footer (links, contact info)
    │   └── TopBar.tsx      # Top bar with phone/email (commented out in App.tsx)
    ├── home/
    │   ├── HeroBooking.tsx     # Hero + booking widget (tab: transfer/hourly)
    │   ├── FeaturesBar.tsx     # Feature highlights bar
    │   ├── PromoBanners.tsx    # Promotional banner cards
    │   ├── ServiceCategories.tsx  # Service type grid
    │   ├── FleetSection.tsx    # Fleet preview (FLEET_HOME slice)
    │   ├── ChauffeurSection.tsx   # Chauffeur quality section
    │   ├── WhyChooseUs.tsx     # Trust/value prop section
    │   ├── HowItWorks.tsx      # Step-by-step process
    │   └── RideSmileBanner.tsx # CTA banner
    ├── fleets/
    │   ├── AllFleets.tsx       # /fleet — full fleet catalog
    │   ├── VehicleSelect.tsx   # /vehicles — step 1: pick vehicle
    │   ├── BookingDetails.tsx  # /booking-details — step 2: passenger form
    │   └── Checkout.tsx        # /checkout — step 3: payment & confirm
    └── ui/
        ├── FAQ.tsx             # Accordion FAQ component (reused on 3 pages)
        ├── Fleets.tsx          # Fleet card list component
        ├── FleetCard.tsx       # Individual fleet card
        ├── Logo.tsx            # Brand logo component
        └── DateTimePicker.tsx  # Custom datetime input component
```

## Key File Locations
| Purpose | Path |
|---|---|
| Design tokens | `tailwind.config.js` |
| TypeScript types | `src/types/index.ts` |
| Static data | `src/data/index.ts` |
| Brand env vars | `src/env.ts` |
| Route map | `src/App.tsx` |
| Global styles | `src/index.css` |
| Booking step 1 | `src/components/fleets/VehicleSelect.tsx` |
| Booking step 2 | `src/components/fleets/BookingDetails.tsx` |
| Booking step 3 | `src/components/fleets/Checkout.tsx` |

## Naming Conventions
- **Files:** PascalCase for components/pages (`HeroBooking.tsx`, `VehicleSelect.tsx`)
- **Files:** camelCase for non-component files (`index.ts`, `env.ts`)
- **Components:** Named exports via `export default function ComponentName()`
- **Constants:** SCREAMING_SNAKE_CASE for data arrays (`FLEET`, `SERVICES`, `HOME_FAQS`)
- **Types/Interfaces:** PascalCase (`BookingState`, `Vehicle`, `PassengerForm`)
- **CSS:** Tailwind utility classes only; custom utilities in `src/index.css` `@layer utilities`

## Directory Rules
- `pages/` — route-level components, composed from components
- `components/layout/` — persistent chrome (Navbar, Footer)
- `components/home/` — homepage section components
- `components/fleets/` — booking flow pages (act as pages despite being in components/)
- `components/ui/` — reusable, domain-agnostic primitives
- `data/` — all hardcoded data; only file importing from `env.ts`
- `types/` — shared interfaces; no implementation code
