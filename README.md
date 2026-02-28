# InverseRide — React + Vite Website

A carbon-copy implementation of the InverseRide ride booking website built with React + Vite, using React Router for client-side navigation.

---

## 📁 Project Structure

```
InverseRide-app/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # App entry point
    ├── App.jsx               # Root router + layout wrapper
    ├── styles/
    │   └── global.css        # All global styles + CSS variables
    ├── data/
    │   └── index.js          # FAQs, fleet, services, badges (static data)
    ├── components/
    │   ├── layout/
    │   │   ├── TopBar.jsx    # Dark top info bar
    │   │   ├── Navbar.jsx    # Sticky navigation
    │   │   └── Footer.jsx    # Footer with links & payment icons
    │   ├── ui/
    │   │   ├── Logo.jsx      # Reusable logo
    │   │   ├── FAQ.jsx       # Accordion FAQ component
    │   │   └── FleetCard.jsx # Vehicle card
    │   └── home/
    │       ├── HeroBooking.jsx       # Hero with booking form tabs
    │       ├── FeaturesBar.jsx       # 4-icon trust features
    │       ├── PromoBanners.jsx      # 50% off + Your Car banners
    │       ├── ServiceCategories.jsx # 6 service type icons
    │       ├── FleetSection.jsx      # Dark fleet grid
    │       ├── ChauffeurSection.jsx  # Hourly chauffeur section
    │       ├── WhyChooseUs.jsx       # Why choose with overlay badges
    │       ├── HowItWorks.jsx        # 3 steps + flow diagram
    │       └── RideSmileBanner.jsx   # Ride Smile Repeat banner
    └── pages/
        ├── HomePage.jsx
        ├── AboutPage.jsx
        ├── ContactPage.jsx
        ├── PartnerPage.jsx
        ├── SignInPage.jsx
        ├── SignUpPage.jsx
        ├── TermsPage.jsx
        ├── PrivacyPage.jsx
        ├── BookingConditionsPage.jsx
        ├── RefundPage.jsx
        └── HelpPage.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

App runs at: **http://localhost:5173**

---

## 🛣️ Routes

| Path                  | Page                      |
|-----------------------|---------------------------|
| `/`                   | Home                      |
| `/about`              | About Us                  |
| `/contact`            | Contact Us                |
| `/partner`            | Become a Partner          |
| `/signin`             | Sign In                   |
| `/signup`             | Sign Up                   |
| `/terms`              | Terms & Conditions        |
| `/privacy`            | Privacy Policy            |
| `/booking-conditions` | Booking Conditions        |
| `/refund`             | Cancellation & Refund     |
| `/help`               | Help Center               |

---

## 🎨 Design System

| Token            | Value       |
|------------------|-------------|
| `--dark`         | `#1a3329`   |
| `--green`        | `#2a7a4b`   |
| `--accent`       | `#4caf50`   |
| `--gold`         | `#f5a623`   |
| `--font-head`    | Outfit      |
| `--font-body`    | Plus Jakarta Sans |

---

## 📦 Dependencies

| Package          | Purpose              |
|------------------|----------------------|
| react            | UI library           |
| react-dom        | DOM renderer         |
| react-router-dom | Client-side routing  |
| vite             | Build tool           |
| @vitejs/plugin-react | React Vite plugin |

---

## 🔧 Next Steps (Backend Integration)

To connect to a real backend:

1. **Booking form** → POST to `/api/bookings`
2. **Contact form** → POST to `/api/contact`
3. **Partner form** → POST to `/api/partners`
4. **Auth** → POST to `/api/auth/signin` and `/api/auth/signup`
5. **Stripe** → Integrate via `@stripe/stripe-js` in checkout flow
6. **Shopify** → Call backend endpoint to create Shopify orders after payment success

---

## 📝 Notes

- All styles use CSS custom properties (no CSS-in-JS library needed)
- Design matches InverseRide screenshots with dark forest green (`#1a3329`) theme
- Auth pages (`/signin`, `/signup`) hide the TopBar and Footer for clean full-screen layout
- Static data (FAQs, fleet, services) is centralized in `src/data/index.js`
