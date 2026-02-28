import React from 'react'

export default function PromoBanners() {
  return (
    <div className="container" style={{ marginBottom: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Banner 1 - 50% Off */}
        <div style={{
          background: 'linear-gradient(135deg, var(--dark), var(--dark2))',
          borderRadius: 16, padding: '28px 32px',
          position: 'relative', overflow: 'hidden', minHeight: 140,
          display: 'flex', alignItems: 'center'
        }}>
          <div>
            <span style={{
              background: 'var(--gold)', color: 'var(--dark)', fontWeight: 800,
              fontSize: 26, padding: '3px 12px', borderRadius: 6,
              display: 'inline-block', marginBottom: 8
            }}>50% OFF</span>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
              Book Your Ride at Half Price!
            </div>
          </div>
          <div style={{ position: 'absolute', right: 20, bottom: 0, fontSize: 90, opacity: 0.2 }}>🚗</div>
        </div>

        {/* Banner 2 - Your Car Your Time */}
        <div style={{
          background: 'linear-gradient(135deg, var(--dark), var(--dark2))',
          borderRadius: 16, padding: '28px 32px',
          position: 'relative', overflow: 'hidden', minHeight: 140
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', color: 'white', fontSize: 22, fontWeight: 700 }}>
              YOUR CAR.
            </div>
            <div style={{ fontFamily: 'var(--font-head)', color: 'white', fontSize: 22, fontWeight: 700 }}>
              YOUR TIME!
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>
              Hire a Chauffeur By The Hour
            </div>
          </div>
          <div style={{ position: 'absolute', right: 16, top: 16, fontSize: 60, opacity: 0.3 }}>🧑‍✈️</div>
        </div>
      </div>
    </div>
  )
}
