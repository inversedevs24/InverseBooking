import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logo({ onClick }) {
  const navigate = useNavigate()
  const handleClick = onClick || (() => navigate('/'))
  return (
    <div className="logo" onClick={handleClick}>
      <div className="logo-icon">I</div>
      <span className="logo-text">INV<span>E</span>RSE</span>
    </div>
  )
}
