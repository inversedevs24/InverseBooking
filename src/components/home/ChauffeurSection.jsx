import React from 'react'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: '🏆', text: 'Luxury & Comfort Fleet' },
  { icon: '🕐', text: '24/7 Service & Support' },
  { icon: '📍', text: 'Go Anywhere, Stop Anywhere' },
  { icon: '⚡', text: 'Simple & Fast Booking' },
]

const GALLERY = ['Professional Chauffeurs', 'Premium Vehicles', 'Free Waiting', 'Timely Pickup']

export default function ChauffeurSection() {
  const navigate = useNavigate()

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Image grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80"
              alt="Chauffeur"
              style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12 }}
            />
            <div style={{ background: 'var(--dark)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 6 }}>
                Chauffeur Transfer
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>
                Effortlessly book your City-to-City, Airport, or Local Transfer with us.
              </div>
              <button className="btn-check-fare" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => navigate('/signin')}>
                Check Fare
              </button>
            </div>

            {GALLERY.map((t, i) => (
              <div key={i} style={{ borderRadius: 10, overflow: 'hidden', position: 'relative', height: 100, background: 'var(--gray-light)', display: 'flex', alignItems: 'flex-end', padding: 8 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80) center/cover', filter: 'brightness(0.6)' }} />
                <span style={{ position: 'relative', color: 'white', fontSize: 11, fontWeight: 600 }}>{t}</span>
              </div>
            ))}
          </div>

          {/* Text content */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
              Hourly Chauffeur
            </h2>
            <p style={{ color: 'var(--gray)', marginBottom: 20 }}>
              Hire a vehicle with a professional driver based on time. Suitable for errands, business meetings, or events.
            </p>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 14 }}>{f.text}</span>
              </div>
            ))}
            <button className="btn-primary" style={{ marginTop: 8 }} onClick={() => navigate('/signin')}>
              Check Fare
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
