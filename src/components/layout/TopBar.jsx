import React from 'react'
import { Link } from 'react-router-dom'

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <Link to="/partner">Become a Partner</Link>
          <span className="topbar-sep">|</span>
          <Link to="/help">Help Center</Link>
        </div>
        <div className="topbar-right">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a8c4b4', fontSize: 12 }}>
            <span>🇦🇪</span> +971 66 666 6666
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a8c4b4', fontSize: 12 }}>
            ✉ info@InverseRide.com
          </span>
          <div className="topbar-pill">🇦🇪 AED</div>
          <div className="topbar-pill">🇬🇧 English</div>
        </div>
      </div>
    </div>
  )
}
