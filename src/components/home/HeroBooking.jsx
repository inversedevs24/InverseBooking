import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HeroBooking() {
  const [tab, setTab] = useState('transfer')
  const navigate = useNavigate()

  return (
    <div className="hero-wrap">
      <div className="hero-card hero-v2">
        <div style={{ maxWidth: 420 }}>
          {/* Promo badges */}
          <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8 }}>
            <span style={{ background: 'var(--gold)', color: '#1a3329', fontWeight: 800, fontSize: 11, padding: '3px 10px', borderRadius: 4 }}>
              Exculsive 50% OFF
            </span>
            <span style={{ background: 'var(--accent)', color: 'white', fontWeight: 800, fontSize: 11, padding: '3px 10px', borderRadius: 4 }}>
              BOOK IT NOW
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 4 }}>
            Book Now —
          </h1>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>
            Transfer or Hourly
          </p>

          {/* Booking form card */}
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: 20 }}>
            <div className="booking-tabs">
              <button
                className={`booking-tab${tab === 'transfer' ? ' active' : ''}`}
                onClick={() => setTab('transfer')}
              >
                Private Transfer
              </button>
              <button
                className={`booking-tab${tab === 'hourly' ? ' active' : ''}`}
                onClick={() => setTab('hourly')}
              >
                Hourly Hire
              </button>
            </div>

            <div style={{ marginBottom: 10 }}>
              <div className="form-label">FROM</div>
              <input className="form-input-white" placeholder="Enter a pickup location" />
            </div>

            {tab === 'transfer' && (
              <div style={{ marginBottom: 10 }}>
                <div className="form-label">TO</div>
                <input className="form-input-white" placeholder="Enter a dropoff location" />
              </div>
            )}

            <div style={{ marginBottom: 10 }}>
              <div className="form-label">PICKUP DATE &amp; TIME</div>
              <input type="datetime-local" className="form-input-white" defaultValue="2026-02-27T15:12" />
            </div>

            {tab === 'transfer' && (
              <button className="add-return-btn">+ Add Return</button>
            )}

            <button
              className="btn-check-fare"
              style={{ width: '100%' }}
              onClick={() => navigate('/signin')}
            >
              Check Fare
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
