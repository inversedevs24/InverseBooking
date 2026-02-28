import React from 'react'
import FleetCard from '../ui/FleetCard'
import { FLEET_HOME, TRUST_BADGES } from '../../data'

export default function FleetSection() {
  return (
    <div className="fleet-section">
      <div className="container">
        <h2 className="section-title">Our Fleet</h2>
        <p className="section-subtitle">From Economy to Luxury — clean, comfortable cars for every ride.</p>

        <div className="fleet-grid">
          {FLEET_HOME.map((car, i) => (
            <FleetCard car={car} key={i} />
          ))}
        </div>

        <div className="fleet-trust-row">
          {TRUST_BADGES.map((b, i) => (
            <div className="trust-badge" key={i}>
              <div className="trust-dot" style={{ background: b.color }} />
              {b.label}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--accent)', fontSize: 13 }}>
          ✅ Licensed Vehicles
        </div>
      </div>
    </div>
  )
}
