import React from 'react'

const OVERLAY_BADGES = [
  { icon: '💳', text: 'Secure Payments' },
  { icon: '📱', text: 'Easy Booking' },
  { icon: '🗓️', text: 'Flexible Scheduling' },
]

export default function WhyChooseUs() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ background: 'var(--gold)', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>🏆</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Why Choose Us</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
              Travel in our luxurious Cars with expert drivers and customize your ride to fit your interests &amp; schedule.
            </h2>
            <div style={{ marginTop: 12, marginBottom: 16 }}>
              <span style={{ background: 'rgba(76,175,80,0.1)', color: 'var(--green)', padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                ✓ Free Cancellation
              </span>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 10 }}>Fixed Price Guarantee</div>
              <div style={{ color: 'var(--gray)', fontSize: 13, marginTop: 4 }}>Comprehensive Services</div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {['🚗', '👜', '📶', '⭐'].map((i, idx) => (
                <span key={idx} style={{ fontSize: 20 }}>{i}</span>
              ))}
            </div>
          </div>

          {/* Image with overlaid badges */}
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1521219184908-522b5e04e23d?w=600&q=80"
              alt="Luxury car"
              style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
            />
            <div style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {OVERLAY_BADGES.map((b, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 16 }}>{b.icon}</span>
                  {b.text}
                  <span style={{ color: 'var(--green)' }}>✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
