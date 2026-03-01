import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const vehicles = [
    {
        id: 1,
        name: 'Luxury SUV',
        model: 'Escalade / Range Rover',
        type: 'SUV',
        passengers: 6,
        luggage: 6,
        image: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=300&q=80',
        pricePerKm: 4.5,
        basePrice: 45,
        features: ['WiFi', 'Leather', 'Climate'],
        tag: 'Popular',
        tagColor: '#f59e0b',
    },
    {
        id: 2,
        name: 'Family Ride',
        model: 'Prado / Chrysler C4',
        type: 'Van',
        passengers: 7,
        luggage: 7,
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&q=80',
        pricePerKm: 3.2,
        basePrice: 35,
        features: ['Child Seats', 'USB', 'Spacious'],
        tag: 'Value',
        tagColor: '#10b981',
    },
    {
        id: 3,
        name: 'Elite Van',
        model: 'Mercedes V-Class',
        type: 'Van',
        passengers: 8,
        luggage: 9,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
        pricePerKm: 5.2,
        basePrice: 55,
        features: ['Executive', 'Minibar', 'Tinted'],
        tag: 'Premium',
        tagColor: '#8b5cf6',
    },
    {
        id: 4,
        name: 'Mini Bus',
        model: 'Mercedes Sprinter',
        type: 'Bus',
        passengers: 14,
        luggage: 14,
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&q=80',
        pricePerKm: 6.0,
        basePrice: 80,
        features: ['PA System', 'Luggage Bay', 'Reclining'],
        tag: 'Group',
        tagColor: '#3b82f6',
    },
    {
        id: 5,
        name: 'Economy Sedan',
        model: 'Toyota Camry / Skoda',
        type: 'Sedan',
        passengers: 3,
        luggage: 3,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&q=80',
        pricePerKm: 2.1,
        basePrice: 20,
        features: ['A/C', 'Clean', 'Punctual'],
        tag: 'Budget',
        tagColor: '#6b7280',
    },
    {
        id: 6,
        name: 'Business Class',
        model: 'BMW 7 / Mercedes S',
        type: 'Sedan',
        passengers: 3,
        luggage: 3,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&q=80',
        pricePerKm: 7.0,
        basePrice: 90,
        features: ['Champagne', 'Chauffeur', 'Privacy'],
        tag: 'Ultra',
        tagColor: '#ec4899',
    },
]

const TEST_DISTANCE_KM = 24
const TEST_DURATION_MIN = 38

export default function VehicleSelect() {
    const navigate = useNavigate()
    const location = useLocation()
    const booking = location.state || {
        from: 'Dubai Mall',
        to: 'Dubai Airport (DXB)',
        datetime: '2026-02-27T15:12',
        type: 'transfer',
    }

    const [selected, setSelected] = useState(null)
    const [hoveredId, setHoveredId] = useState(null)

    const getPrice = (v) => (v.basePrice + TEST_DISTANCE_KM * v.pricePerKm).toFixed(0)

    const handleSelect = (v) => {
        setSelected(v.id)
        setTimeout(() => {
            navigate('/booking-details', {
                state: {
                    ...booking,
                    vehicle: v,
                    price: getPrice(v),
                    distance: TEST_DISTANCE_KM,
                    duration: TEST_DURATION_MIN,
                },
            })
        }, 350)
    }

    const formatDt = (dt) => {
        if (!dt) return '—'
        return new Date(dt).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    }

    return (
        <>
            <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .vs-wrap {
          min-height: 100vh;
          background: #0c1a13;
          display: flex;
          flex-direction: column;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          color: #fff;
        }

        /* ── Topbar ── */
        .vs-topbar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 24px;
          background: #0f1f19;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .vs-back {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          color: rgba(255,255,255,0.65);
          padding: 6px 13px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
          font-family: inherit;
        }
        .vs-back:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .vs-topbar-title {
          font-family: var(--font-head, serif);
          font-size: 17px;
          font-weight: 700;
          color: #fff;
        }
        .vs-topbar-sub {
          margin-left: auto;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
        }

        /* ── Body split ── */
        .vs-body {
          display: grid;
          grid-template-columns: 420px 1fr;
          flex: 1;
          min-height: calc(100vh - 50px);
        }

        /* ── LEFT ── */
        .vs-left {
          overflow-y: auto;
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 16px 14px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
          background: #0f1f19;
        }

        .vs-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 0 2px;
        }
        .vs-list-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .vs-list-count {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
        }

        /* Compact horizontal card */
        .vs-card {
          display: flex;
          align-items: center;
          gap: 0;
          background: #1a3028;
          border: 1.5px solid transparent;
          border-radius: 11px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.22s ease;
          margin-bottom: 8px;
          position: relative;
        }
        .vs-card:hover {
          border-color: rgba(34,197,94,0.35);
          background: #1e352b;
          transform: translateX(3px);
        }
        .vs-card.vs-selected {
          border-color: #22c55e;
          background: #1e3a2e;
          box-shadow: 0 0 0 1px rgba(34,197,94,0.25), 4px 0 20px rgba(0,0,0,0.3);
        }

        /* Selected indicator bar */
        .vs-card.vs-selected::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #22c55e;
          border-radius: 0;
        }

        .vs-card-img-wrap {
          width: 100px;
          height: 72px;
          flex-shrink: 0;
          overflow: hidden;
          position: relative;
        }
        .vs-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .vs-card:hover .vs-card-img { transform: scale(1.08); }

        .vs-card-tag {
          position: absolute;
          top: 5px;
          left: 5px;
          font-size: 8px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #fff;
          line-height: 1.4;
        }

        .vs-card-info {
          flex: 1;
          padding: 10px 12px;
          min-width: 0;
        }

        .vs-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 5px;
        }

        .vs-card-name {
          font-family: var(--font-head, serif);
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .vs-card-model {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vs-card-price {
          font-family: var(--font-head, serif);
          font-size: 17px;
          font-weight: 700;
          color: #22c55e;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .vs-card-price-unit {
          font-size: 9px;
          font-weight: 500;
          color: rgba(255,255,255,0.3);
          display: block;
          text-align: right;
          margin-top: 1px;
        }

        .vs-card-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .vs-meta-pill {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.07);
          padding: 2px 7px;
          border-radius: 20px;
        }

        .vs-meta-chip {
          font-size: 9px;
          color: rgba(34,197,94,0.85);
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .vs-card-arrow {
          padding: 0 12px 0 4px;
          font-size: 14px;
          color: rgba(255,255,255,0.15);
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .vs-card:hover .vs-card-arrow { color: #22c55e; transform: translateX(2px); }
        .vs-card.vs-selected .vs-card-arrow { color: #22c55e; }

        /* ── RIGHT ── */
        .vs-right {
          overflow-y: auto;
          padding: 20px;
          background: #0c1a13;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }

        .vs-panel {
          background: #1a3028;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px;
        }

        .vs-panel-title {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        /* Route */
        .vs-route {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .vs-route-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .vs-route-dot-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          flex-shrink: 0;
          margin-top: 3px;
        }
        .vs-rdot {
          width: 9px; height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .vs-rline {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.03));
          margin: 3px 0;
        }
        .vs-rlabel {
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 1px;
        }
        .vs-rval {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }

        /* Stats grid */
        .vs-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 14px;
        }
        .vs-stat-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 9px;
          padding: 10px;
          text-align: center;
        }
        .vs-stat-val {
          font-family: var(--font-head, serif);
          font-size: 18px;
          font-weight: 700;
          color: #22c55e;
          line-height: 1;
        }
        .vs-stat-lbl {
          font-size: 9px;
          color: rgba(255,255,255,0.35);
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* Map */
        .vs-map-wrap {
          border-radius: 11px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          position: relative;
          height: 260px;
        }
        .vs-map-wrap iframe {
          width: 100%;
          height: 100%;
          border: none;
          filter: invert(0.88) hue-rotate(140deg) saturate(0.65) brightness(0.82);
        }
        .vs-map-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent, #0c1a13);
          pointer-events: none;
        }
        .vs-map-badge {
          position: absolute;
          bottom: 10px;
          left: 12px;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          background: rgba(0,0,0,0.4);
          padding: 4px 9px;
          border-radius: 6px;
          backdrop-filter: blur(6px);
        }

        /* Info note */
        .vs-note {
          background: rgba(34,197,94,0.06);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
        }

        @media (max-width: 860px) {
          .vs-body { grid-template-columns: 1fr; min-height: auto; }
          .vs-right { border-top: 1px solid rgba(255,255,255,0.06); }
        }
      `}</style>

            <div className="vs-wrap">
                {/* Topbar */}
                <div className="vs-topbar">
                    <button className="vs-back" onClick={() => navigate(-1)}>← Back</button>
                    <span className="vs-topbar-title">Choose Your Vehicle</span>
                    <span className="vs-topbar-sub">{vehicles.length} options available</span>
                </div>

                <div className="vs-body">
                    {/* ── LEFT: compact vehicle list ── */}
                    <div className="vs-left">
                        <div className="vs-list-header">
                            <span className="vs-list-label">Available Vehicles</span>
                            <span className="vs-list-count">{vehicles.length} results</span>
                        </div>

                        {vehicles.map((v) => {
                            const isSelected = selected === v.id
                            return (
                                <div
                                    key={v.id}
                                    className={`vs-card${isSelected ? ' vs-selected' : ''}`}
                                    onClick={() => handleSelect(v)}
                                    onMouseEnter={() => setHoveredId(v.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Image */}
                                    <div className="vs-card-img-wrap">
                                        <img src={v.image} alt={v.name} className="vs-card-img" />
                                        <div className="vs-card-tag" style={{ background: v.tagColor }}>{v.tag}</div>
                                    </div>

                                    {/* Info */}
                                    <div className="vs-card-info">
                                        <div className="vs-card-top">
                                            <div style={{ minWidth: 0 }}>
                                                <div className="vs-card-name">{v.name}</div>
                                                <div className="vs-card-model">{v.model}</div>
                                            </div>
                                            <div>
                                                <div className="vs-card-price">${getPrice(v)}</div>
                                                <span className="vs-card-price-unit">est. total</span>
                                            </div>
                                        </div>
                                        <div className="vs-card-meta">
                                            <span className="vs-meta-pill">👥 {v.passengers}</span>
                                            <span className="vs-meta-pill">🧳 {v.luggage}</span>
                                            {v.features.slice(0, 2).map(f => (
                                                <span key={f} className="vs-meta-chip">{f}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="vs-card-arrow">
                                        {isSelected ? '✓' : '›'}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* ── RIGHT: trip summary + map ── */}
                    <div className="vs-right">
                        {/* Route summary */}
                        <div className="vs-panel">
                            <div className="vs-panel-title">Trip Summary</div>
                            <div className="vs-route">
                                <div className="vs-route-item">
                                    <div className="vs-route-dot-col">
                                        <div className="vs-rdot" style={{ background: '#22c55e' }} />
                                        <div className="vs-rline" />
                                    </div>
                                    <div style={{ paddingBottom: 12 }}>
                                        <div className="vs-rlabel">Pickup</div>
                                        <div className="vs-rval">{booking.from || 'Dubai Mall'}</div>
                                    </div>
                                </div>
                                <div className="vs-route-item">
                                    <div className="vs-route-dot-col">
                                        <div className="vs-rdot" style={{ background: '#ef4444' }} />
                                    </div>
                                    <div>
                                        <div className="vs-rlabel">Drop-off</div>
                                        <div className="vs-rval">{booking.to || 'Dubai Airport (DXB)'}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="vs-rlabel" style={{ marginBottom: 4 }}>Date &amp; Time</div>
                                <div className="vs-rval" style={{ fontSize: 12 }}>{formatDt(booking.datetime)}</div>
                            </div>

                            <div className="vs-stats-grid">
                                <div className="vs-stat-box">
                                    <div className="vs-stat-val">{TEST_DISTANCE_KM}</div>
                                    <div className="vs-stat-lbl">km</div>
                                </div>
                                <div className="vs-stat-box">
                                    <div className="vs-stat-val">{TEST_DURATION_MIN}</div>
                                    <div className="vs-stat-lbl">mins</div>
                                </div>
                                <div className="vs-stat-box">
                                    <div className="vs-stat-val">{booking.type === 'hourly' ? 'Hrly' : 'Fix'}</div>
                                    <div className="vs-stat-lbl">rate</div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="vs-panel">
                            <div className="vs-panel-title">Route Preview</div>
                            <div className="vs-map-wrap">
                                <iframe
                                    title="map"
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=55.1304931640625%2C25.0657305%2C55.4162597%2C25.2769055&layer=mapnik"
                                    allowFullScreen
                                />
                                <div className="vs-map-fade" />
                                <div className="vs-map-badge">📍 Dubai, UAE</div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="vs-note">
                            💡 Prices include base fare + {TEST_DISTANCE_KM}km distance. Free cancellation up to 1 hour before pickup.
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}