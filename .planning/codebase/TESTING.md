# Testing Patterns

**Analysis Date:** 2026-03-21

## Test Framework

**Runner:**
- None. No test runner is installed or configured.
- `package.json` has no `test` script and no testing devDependencies.
- No `jest.config.*`, `vitest.config.*`, or equivalent config files exist.

**Assertion Library:**
- None installed.

**Run Commands:**
```bash
# No test commands available
npm run dev      # Development server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

## Test File Organization

**Location:**
- No test files exist anywhere in the project.

**Naming:**
- No `.test.tsx`, `.spec.tsx`, `.test.ts`, or `.spec.ts` files found.

**Structure:**
- Not applicable.

## Test Coverage

**Requirements:** None enforced — no coverage tooling installed.

**Current coverage:** 0%. No unit, integration, or E2E tests of any kind.

## Test Types

**Unit Tests:**
- Not present.
- Candidates for unit testing: pure helper functions in `src/components/ui/DateTimePicker.tsx` (`parseISO`, `toISO`, `formatDisplay`, `sameDay`, `startOfDay`), validation logic in `src/components/fleets/BookingDetails.tsx` (`validate`), price calculation in `src/components/fleets/VehicleSelect.tsx` (`getPrice`).

**Integration Tests:**
- Not present.
- Candidates: booking flow navigation (VehicleSelect → BookingDetails → Checkout via `react-router-dom` state), form submit + success state in `PartnerPage.tsx`.

**E2E Tests:**
- Not present.
- No Playwright, Cypress, or Puppeteer installed.

## Recommended Setup (if tests are added)

**Recommended stack for this project:**
- **Vitest** — compatible with Vite's config, zero additional setup for module resolution
- **@testing-library/react** — for component rendering and user interaction
- **@testing-library/user-event** — for realistic event simulation
- **jsdom** — browser environment for Vitest

**Minimal vitest.config.ts to add:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

**Recommended test file placement:**
- Co-locate tests alongside source: `src/components/ui/DateTimePicker.test.tsx`
- Shared test utilities: `src/test/setup.ts`, `src/test/factories.ts`

## Pure Functions Available for Immediate Testing

The following pure utility functions in `src/components/ui/DateTimePicker.tsx` have no dependencies and are ideal first test targets:

```typescript
// parseISO: parses ISO string → { date, hour, minute }
parseISO('2026-03-21T14:30') // → { date: Date, hour: 14, minute: 30 }
parseISO('')                  // → null
parseISO('2026-03-21')        // → { date: Date, hour: 0, minute: 0 }

// toISO: inverse of parseISO
toISO(new Date(2026, 2, 21), 14, 30) // → '2026-03-21T14:30'

// sameDay: date equality ignoring time
sameDay(new Date(2026, 2, 21), new Date(2026, 2, 21, 23, 59)) // → true
sameDay(new Date(2026, 2, 21), new Date(2026, 2, 22))          // → false

// formatDisplay: renders display string for trigger button
formatDisplay('2026-03-21T14:30') // → '21 Mar 2026  02:30 PM'
```

The validate function in `src/components/fleets/BookingDetails.tsx`:
```typescript
// validate: returns ValidationErrors object (empty = valid)
// Tests: missing firstName, invalid email regex, short phone, all valid
```

The price calculator in `src/components/fleets/VehicleSelect.tsx`:
```typescript
// getPrice: (vehicle: Vehicle) => string
// getPrice({ basePrice: 45, pricePerKm: 4.5 }) with TEST_DISTANCE_KM=24 → '153'
```

## Mocking Guidance (when tests are added)

**What to mock:**
- `react-router-dom` hooks (`useNavigate`, `useLocation`) — use `MemoryRouter` wrapper instead of mocking directly
- `import.meta.env` — set in vitest config or per-test via `vi.stubEnv`
- `window.scrollTo` — stub with `vi.fn()` to suppress JSDOM warnings
- `setTimeout` — use `vi.useFakeTimers()` for `Checkout.tsx` payment simulation and `VehicleSelect.tsx` navigation delay

**What NOT to mock:**
- `src/data/index.ts` — import real data; it has no side effects
- `src/types/index.ts` — type-only, no runtime behavior
- Pure date/string helpers — test them directly

**Router wrapping pattern:**
```tsx
import { MemoryRouter, Routes, Route } from 'react-router-dom'

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  )
}
```

**Route state pattern (booking flow pages read from location.state):**
```tsx
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import type { BookingState } from '../../types'

const mockState: BookingState = {
  from: 'Dubai Mall',
  to: 'Dubai Airport (DXB)',
  datetime: '2026-03-21T14:00',
  type: 'transfer',
}

render(
  <MemoryRouter initialEntries={[{ pathname: '/booking-details', state: mockState }]}>
    <Routes>
      <Route path="/booking-details" element={<BookingDetails />} />
    </Routes>
  </MemoryRouter>
)
```

---

*Testing analysis: 2026-03-21*
