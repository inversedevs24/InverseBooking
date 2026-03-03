/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',        // Deep navy (brand authority)
        secondary: '#1E293B',
        accent: '#2563EB',         // Premium blue for CTAs
        primaryBg: '#F8FAFC',
        secondaryBg: '#FFFFFF',
        muted: '#64748B',
        border: '#E2E8F0',
        textPrimary: '#0F172A',
        textSecondary: '#475569'
      },
      fontFamily: {
        head: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        display: ['4rem', { lineHeight: '1.1', fontWeight: '800' }],
        heading: ['4rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        title: ['3rem', { lineHeight: '2rem', fontWeight: '600' }],
        span: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        label: ['1rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        content:['2rem', { lineHeight: '2rem', fontWeight: '500' }],
      },
      borderRadius: {
        card: '12px',
        'card-lg': '20px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(15,23,42,0.1)',
        'card-lg': '0 8px 40px rgba(15,23,42,0.15)',
      },
      maxWidth: {
        container: '1200px',
      },
      keyframes: {
        hbgZoom: {
          from: { transform: 'scale(1.0)' },
          to: { transform: 'scale(1.06)' },
        },
        hscrollBob: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(6px)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        spinRing: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'hero-zoom': 'hbgZoom 20s ease-in-out infinite alternate',
        'scroll-bob': 'hscrollBob 2s ease-in-out infinite',
        'pop-in': 'popIn 0.5s ease both',
        'spin-ring': 'spinRing 0.7s linear infinite',
      },
    },
  },
  plugins: [],
}

module.exports = config