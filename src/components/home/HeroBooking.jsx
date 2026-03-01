import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HeroBooking() {
  const [tab, setTab] = useState('transfer')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [datetime, setDatetime] = useState('2026-02-27T15:12')
  const navigate = useNavigate()

  const handleCheckFare = () => {
    navigate('/vehicles', {
      state: { from, to, datetime, type: tab }
    })
  }

  return (
    <>
      <style>{`
        .hero-bg-img {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1800&q=85');
          background-size: cover;
          background-position: center 35%;
          filter: brightness(0.45) saturate(1.15);
          animation: hbgZoom 20s ease-in-out infinite alternate;
          transform-origin: center;
        }
        @keyframes hbgZoom {
          from { transform: scale(1.0); }
          to   { transform: scale(1.06); }
        }
        .hero-bg-gradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(110deg,
              rgba(15,31,25,0.97) 0%,
              rgba(15,31,25,0.82) 35%,
              rgba(15,31,25,0.3)  65%,
              rgba(15,31,25,0.15) 100%
            ),
            linear-gradient(to bottom,
              rgba(15,31,25,0.2) 0%,
              rgba(15,31,25,0.75) 100%
            );
        }
        .hero-bg-grain {
          position: absolute;
          inset: 0;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        /* Floating light orbs for depth */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .hero-orb-1 {
          width: 500px; height: 500px;
          right: 5%; top: -10%;
          background: radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%);
        }
        .hero-orb-2 {
          width: 300px; height: 300px;
          right: 25%; bottom: 10%;
          background: radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%);
        }

        .hero-wrap {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .hero-card.hero-v2 {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 40px 60px;
          display: flex;
          align-items: center;
        }

        /* Stats floating bottom right */
        .hero-stats-float {
          position: absolute;
          bottom: 40px;
          right: 40px;
          z-index: 3;
          display: flex;
          gap: 0;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          overflow: hidden;
        }
        .hero-stat-item {
          padding: 14px 22px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .hero-stat-item:last-child { border-right: none; }
        .hero-stat-num {
          font-family: var(--font-head);
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .hero-stat-lbl {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* Scroll hint */
        .hero-scroll-hint {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          animation: hscrollBob 2s ease-in-out infinite;
        }
        @keyframes hscrollBob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
        .hero-scroll-line {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
        }
        .hero-scroll-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
        }

        @media (max-width: 768px) {
          .hero-card.hero-v2 { padding: 90px 20px 120px; }
          .hero-stats-float { bottom: 16px; right: 16px; left: 16px; justify-content: center; }
        }
      `}</style>

      <div className="hero-wrap">
        {/* Background layers */}
        <div className="hero-bg-img" />
        <div className="hero-bg-gradient" />
        <div className="hero-bg-grain" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="hero-card hero-v2">
          <div style={{ maxWidth: 420, position: 'relative' }}>
            {/* Promo badges */}
            <div style={{ position: 'absolute', top: -48, left: 0, display: 'flex', gap: 8 }}>
              <span style={{ background: 'var(--gold)', color: '#1a3329', fontWeight: 800, fontSize: 11, padding: '3px 10px', borderRadius: 4 }}>
                Exclusive 50% OFF
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
                <input
                  className="form-input-white"
                  placeholder="Enter a pickup location"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                />
              </div>

              {tab === 'transfer' && (
                <div style={{ marginBottom: 10 }}>
                  <div className="form-label">TO</div>
                  <input
                    className="form-input-white"
                    placeholder="Enter a dropoff location"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                  />
                </div>
              )}

              <div style={{ marginBottom: 10 }}>
                <div className="form-label">PICKUP DATE &amp; TIME</div>
                <input
                  type="datetime-local"
                  className="form-input-white"
                  value={datetime}
                  onChange={e => setDatetime(e.target.value)}
                />
              </div>

              {tab === 'transfer' && (
                <button className="add-return-btn">+ Add Return</button>
              )}

              <button
                className="btn-check-fare"
                style={{ width: '100%' }}
                onClick={handleCheckFare}
              >
                Check Fare
              </button>
            </div>
          </div>
        </div>

        {/* Floating stats bottom-right */}
        <div className="hero-stats-float">
          <div className="hero-stat-item">
            <div className="hero-stat-num">4.9★</div>
            <div className="hero-stat-lbl">Rating</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-num">12k+</div>
            <div className="hero-stat-lbl">Rides</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-num">24/7</div>
            <div className="hero-stat-lbl">Support</div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <div className="hero-scroll-dot" />
          <div className="hero-scroll-line" />
        </div>
      </div>
    </>
  )
}