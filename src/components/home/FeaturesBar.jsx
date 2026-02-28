import React from 'react'
import { FEATURES } from '../../data'

export default function FeaturesBar() {
  return (
    <div className="features-bar">
      <div className="features-grid">
        {FEATURES.map((f, i) => (
          <div className="feature-item" key={i}>
            <div className="feature-icon-wrap">{f.icon}</div>
            <div className="feature-text">
              <h4>{f.title}</h4>
              <p>{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
