import React from 'react'

export default function FleetCard({ car }) {
  return (
    <div className="fleet-card">
      <div className="fleet-car-icon">{car.icon}</div>
      <div className="fleet-car-name">{car.name}</div>
      <div className="fleet-car-badges">
        <span className="fleet-badge">👥 {car.pax}</span>
        <span className="fleet-badge">🧳 {car.lug}</span>
      </div>
      <div className="fleet-car-models">{car.models}</div>
    </div>
  )
}
