import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function FleetCard({ car }) {
  const navigate = useNavigate()

  return (
    <div className="fleet-card" onClick={() => navigate('/fleet')}>
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