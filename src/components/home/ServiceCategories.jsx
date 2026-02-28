import React from 'react'
import { SERVICES } from '../../data'

export default function ServiceCategories() {
  return (
    <div className="container">
      <div className="service-icons-grid">
        {SERVICES.map((s, i) => (
          <div className="service-icon-card" key={i}>
            <div style={{ fontSize: 36 }}>{s.icon}</div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
