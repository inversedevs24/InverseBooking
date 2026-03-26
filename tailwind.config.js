/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2E4052',        // Dark navy (brand authority)
        secondary: '#FFC857',      // Golden yellow (accent/highlight)
        accent: '#BDD9BF',         // Sage green (chips, soft accents)
        primaryBg: '#FFFFFF',
        secondaryBg: '#F0F5F0',
        muted: '#6B7A8A',
        border: '#D4DDE5',
        textPrimary: '#2E4052',
        textSecondary: '#5A6775'
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
        card: '0 4px 24px rgba(46,64,82,0.1)',
        'card-lg': '0 8px 40px rgba(46,64,82,0.15)',
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