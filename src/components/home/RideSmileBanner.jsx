import React from 'react'

export default function RideSmileBanner() {
  return (
    <div className="container" style={{ marginBottom: 48 }}>
      <div style={{
        background: 'var(--dark)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 40, fontWeight: 800, color: 'white', zIndex: 1 }}>
          RIDE.{' '}
          <span style={{ color: 'var(--accent)' }}>SMILE</span>
          <br />
          <span style={{ color: 'var(--gold)' }}>REPEAT.</span>
        </div>
        <div style={{ position: 'absolute', right: 180, top: '50%', transform: 'translateY(-50%)', fontSize: 120, opacity: 0.08 }}>
          🚗
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 24px', textAlign: 'center', zIndex: 1 }}>
          <div style={{ color: 'white', fontFamily: 'var(--font-head)', fontSize: 20 }}>InverseRide</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Premium Ride Partner UAE</div>
        </div>
      </div>
    </div>
  )
}
