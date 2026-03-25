# Coding Conventions

**Analysis Date:** 2026-03-21

## Naming Patterns

**Files:**
- React components: PascalCase matching the exported component name — `FleetCard.tsx`, `BookingDetails.tsx`, `DateTimePicker.tsx`
- Data/utility modules: lowercase `index.ts` — `src/data/index.ts`, `src/types/index.ts`, `src/env.ts`
- Pages: PascalCase with `Page` suffix — `HomePage.tsx`, `SignInPage.tsx`, `PartnerPage.tsx`
- Layout components: PascalCase without suffix — `Navbar.tsx`, `Footer.tsx`, `TopBar.tsx`

**Functions / Event Handlers:**
- Handler functions: `handle` prefix for user events — `handleSelect`, `handleContinue`, `handlePay`, `handleSubmit`, `handlePickupChange`
- Helper/utility functions: descriptive camelCase — `getPrice`, `formatDt`, `formatDatetime`, `deriveType`, `toLocalISO`, `parseISO`, `toISO`, `formatDisplay`
- Boolean helpers: verb-based — `isDisabled`, `canGoPrev`, `sameDay`
- Adjustment helpers: action-based — `adjustHour`, `adjustMinute`, `toggleAmPm`, `prevMonth`, `nextMonth`
- Apply/cancel pattern: `apply`, `cancel` for picker commit/revert operations

**Variables / State:**
- State variables: descriptive camelCase noun — `selected`, `paying`, `done`, `open`, `liked`, `submitted`
- Draft state (unpersisted UI state): `draft` prefix — `draftDate`, `draftHour`, `draftMinute`
- View state (calendar navigation): `view` prefix — `viewYear`, `viewMonth`
- Boolean flags: `is` prefix — `isSelected`, `isAuth`, `isOpen`, `isDisabled`
- Module-level constants: SCREAMING_SNAKE_CASE — `FLEET`, `SERVICES`, `FEATURES`, `HOME_FAQS`, `AUTH_ROUTES`, `WEEKDAYS`, `MONTH_NAMES`, `GRADIENTS`, `GRAIN_SVG`, `GRID_BG`, `TEST_DISTANCE_KM`

**Types / Interfaces:**
- All in `src/types/index.ts`, PascalCase — `FleetItem`, `Vehicle`, `BookingState`, `PassengerForm`, `ValidationErrors`
- Inline prop interfaces: `Props` or `interface XxxProps { ... }` — `interface Props` in `DateTimePicker.tsx`, `interface FAQProps` in `FAQ.tsx`
- Local type aliases: `type WhoItem = { ... }` used sparingly for data shape definitions

**CSS Class Variables:**
- Module-level class string constants: suffix `Cls` — `cardCls`, `labelCls`, `inputCls`, `wrapperCls`, `inputInnerCls`, `labelInnerCls`, `linkCls`

## Code Style

**Formatting:**
- No Prettier or ESLint config detected at root level — formatting is author-maintained
- Single quotes for strings in TypeScript/TSX
- No semicolons at end of statements (semicolons appear only inside for-loops and similar constructs)
- 2-space indentation throughout
- Arrow functions used for event handlers and callbacks
- Implicit returns avoided — function bodies use explicit `return` statements unless extremely short

**TypeScript:**
- `import type { ... }` used for type-only imports (strict separation from value imports)
- `as` type assertion used sparingly for env var strings: `import.meta.env.VITE_BRAND_NAME as string`
- Non-null assertion `!` used at root mount: `document.getElementById('root')!`
- Generic state: `useState<number | null>(null)`, `useState<PassengerForm>({...})`

**Component File Structure Order:**
1. Imports (React hooks, router, types, lucide icons, local components)
2. Module-level constants (SCREAMING_SNAKE_CASE)
3. Helper functions (pure utilities)
4. Default exported component function
5. Local CSS class variables declared inside component body at top (before hooks)

## Import Organization

**Order within files:**
1. React and React hooks (`import { useState, useMemo } from 'react'`)
2. React Router (`import { useNavigate, useLocation } from 'react-router-dom'`)
3. Third-party icons (`import { Menu, X } from 'lucide-react'`)
4. Type imports (`import type { Vehicle, BookingState } from '../../types'`)
5. Local components (`import Logo from '../ui/Logo'`)
6. Data / env imports (`import { brandPhone } from '../../env'`)

**Path Aliases:**
- None configured. Relative paths used throughout: `../../types`, `../env`, `../ui/Logo`

**Barrel exports:**
- `src/types/index.ts` — all shared interfaces exported from single file
- `src/data/index.ts` — all data arrays exported from single file
- No barrel for components; each imported directly by path

## Tailwind Usage Patterns

**Design Tokens (always use these instead of raw values):**
- Colors: `text-primary`, `bg-primaryBg`, `bg-secondary`, `text-muted`, `border-border`, `bg-secondaryBg`
- Typography: `text-display`, `text-heading`, `text-title`, `text-span`, `text-label`
- Fonts: `font-head` (Outfit), `font-body` (Plus Jakarta Sans)
- Radii: `rounded-card`, `rounded-card-lg`
- Shadows: `shadow-card`, `shadow-card-lg`
- Max-width: `max-w-container`
- Animations: `animate-hero-zoom`, `animate-scroll-bob`, `animate-pop-in`, `animate-spin-ring`

**Arbitrary values vs tokens:**
- Pixel-precise spacing that falls outside Tailwind's scale uses bracket notation: `px-[14px]`, `py-[13px]`, `text-[11px]`, `w-[100px]`
- Raw hex colors in `style={}` only when dynamic (tagColor, GRADIENTS array): `style={{ background: v.tagColor }}`
- Complex backgrounds (grid overlays, grain SVG, multi-stop gradients) kept as inline `style={}` — never in Tailwind classes
- Opacity modifiers on tokens: `text-primary/70`, `bg-secondary/10`, `border-secondary/20`

**Hover and Group patterns:**
- Direct hover: `hover:border-primary`, `hover:text-primary`, `hover:brightness-105`
- Group hover: `group` on parent, `group-hover:scale-[1.08]`, `group-hover:text-primary` on children
- Conditional indicator elements replace CSS `::before` pseudo-elements: `{isSelected && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}`

**Responsive breakpoints:**
- `md:` and `lg:` breakpoints used for layout grid changes
- `max-sm:` used for mobile-specific overrides (floating stats widget position)
- Booking flow pages (`VehicleSelect`, `BookingDetails`, `Checkout`) use intentional dark hex bg — not Tailwind tokens

## Error Handling

**Form validation pattern (`src/components/fleets/BookingDetails.tsx`):**
```typescript
const validate = (): ValidationErrors => {
  const e: ValidationErrors = {}
  if (!form.firstName.trim()) e.firstName = 'Required'
  if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
  if (!form.phone.match(/^\+?[\d\s\-]{7,15}$/)) e.phone = 'Valid phone required'
  return e
}

const handleContinue = () => {
  const e = validate()
  if (Object.keys(e).length) { setErrors(e); return }
  navigate('/checkout', { state: { ...booking, passenger: form } })
}
```

**Inline error display:**
```tsx
{errors.firstName && <span className="text-[11px] text-red-500">{errors.firstName}</span>}
```

**Error clearing on field change:**
```typescript
const set = (key: keyof PassengerForm, val: string) => {
  setForm(f => ({ ...f, [key]: val }))
  setErrors(e => ({ ...e, [key]: '' }))
}
```

**Null-safety patterns:**
- Optional chaining for possibly-undefined booking state: `v?.image`, `v?.name`
- Fallback defaults via `||`: `location.state || {}`, `booking.price || '—'`
- Guard returns: `if (!draftDate) return` before committing picker value
- Conditional rendering instead of throws: `{row.val && (<div>...</div>)}`

**No global error boundaries** — errors propagate silently. No try/catch in any source file.

## Logging

- Zero `console.log` / `console.error` / `console.warn` calls anywhere in `src/`
- No error tracking or logging library integrated

## Comments

**Style used:**
- Section divider comments in complex files: `// ─── Helpers ───────`, `// ─── Component ───────`
- Inline `//` comments for non-obvious logic in `src/components/ui/DateTimePicker.tsx` (e.g., `// 12-hour display helpers`, `// Sync draft when value is changed externally`)
- JSDoc-style block comment in `vite.config.ts` explaining the HMR plugin root cause and fix
- Commented-out JSX blocks remain in code: `{/* <div className="hidden md:block"><TopBar /></div> */}` in `App.tsx`, scroll hint in `HeroBooking.tsx`

**When to comment:**
- Non-obvious browser API interactions (position detection, event listener cleanup)
- Workarounds that have a specific root cause requiring explanation
- Do not comment standard React hooks or obvious renders

## Function Design

**Size:** Components range from 30 lines (`src/components/ui/FAQ.tsx`) to ~390 lines (`src/components/ui/DateTimePicker.tsx`). Booking flow pages are 100-200 lines each. Complex UI components are self-contained rather than decomposed into sub-components.

**Parameters:**
- Props destructured inline with type: `function FleetCard({ car, index = 0 }: { car: FleetItem; index?: number })`
- Named interface for multi-prop reusable components: `interface Props { value: string; onChange: (v: string) => void; min?: string }`

**Return values:**
- All components use single `export default function ComponentName()`
- Validation returns the error accumulator object (empty object = all valid)
- Helpers return typed primitives or null

## Module Design

**Exports:**
- Every component file has exactly one `export default function ComponentName()`
- `src/data/index.ts` and `src/types/index.ts` use named exports only
- No component barrel file — each component imported by its full relative path

**Shared modules:**
- `src/data/index.ts` — all static content arrays (FLEET, SERVICES, TRUST_BADGES, FEATURES, HOME_FAQS, CONTACT_FAQS, PARTNER_FAQS)
- `src/types/index.ts` — all TypeScript interfaces and type definitions
- `src/env.ts` — all environment variable accessors (`brandName`, `brandEmail`, `brandPhone`, `brandAddress`)

---

*Convention analysis: 2026-03-21*
