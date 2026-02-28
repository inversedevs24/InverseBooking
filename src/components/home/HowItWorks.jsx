import React from 'react'

const STEPS = [
  {
    icon: '📅',
    title: 'Book Your Chauffeur Online',
    desc: 'Enter your pickup details, choose your chauffeur, and customize your ride. You can cancel or change your ride up to 24 hours before the pickup.',
    color: 'rgba(42,122,75,0.1)',
  },
  {
    icon: '👤',
    title: 'Meet Your Driver',
    desc: "Your driver will be waiting at the meeting spot with a signboard. They'll track your flight and be there even if your flight is delayed.",
    color: 'rgba(245,166,35,0.1)',
  },
  {
    icon: '🎯',
    title: 'Enjoy a Comfortable Ride',
    desc: 'Skip the taxi lines and crowded buses. InverseRide will get you to your destination on time, stress-free.',
    color: 'rgba(74,144,226,0.1)',
  },
]

const FLOW = [
  { step: 'Book Online',           icon: '💻', color: 'var(--green)' },
  { step: 'Instant Confirmation',  icon: '✅', color: 'var(--gold)'  },
  { step: 'Meet your driver',      icon: '🧑‍✈️', color: 'var(--green)' },
  { step: 'Get to Your Destination', icon: '📍', color: 'var(--green)' },
  { step: 'Enjoy your trip',       icon: '🎉', color: 'var(--gold)'  },
]

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="container">
        {/* Promo strip */}
        <div style={{ background: 'var(--green)', borderRadius: 16, padding: '24px 32px', marginBottom: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ color: 'var(--accent-bright)', fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800 }}>
              BOOK YOUR TRANSFER NOW
            </div>
            <div style={{ color: 'white', fontWeight: 600 }}>BOOK NOW, RIDE LATER</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>No Last-Minute Hassles</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 20px', borderRadius: 10 }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>✅ Secure Payments</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Book with Confidence</div>
          </div>
        </div>

        <h2 className="section-title">Go Anywhere, Anytime</h2>
        <p className="section-subtitle">Instant booking, smooth travel — no delays, no hassle.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          {/* Steps list */}
          <div>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.title}</h4>
                  <p style={{ color: 'var(--gray)', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual flow diagram */}
          <div style={{ background: 'var(--gray-light)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 18, fontFamily: 'var(--font-head)', marginBottom: 16, textAlign: 'center' }}>
              How it works?
            </div>
            {FLOW.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{item.step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
