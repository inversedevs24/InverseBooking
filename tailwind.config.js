/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF4433',
        secondary: '#FF4433',
        primaryBg: '#FF4433',
        secondaryBg: '#FF4433',
        muted: '#FF4433',
        border: '#FF4433',
      },
      fontFamily: {
        head: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        display: ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
        heading: ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        title: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        span: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        label: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
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