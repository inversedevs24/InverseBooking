import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from '../ui/Logo'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Logo />
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
            Contact Us
          </NavLink>
        </div>
        <div className="nav-user" onClick={() => navigate('/signin')}>
          <div className="nav-user-icon">👤</div>
          <div className="nav-user-text">
            <span>Welcome</span>
            <strong>Sign in / Register</strong>
          </div>
        </div>
      </div>
    </nav>
  )
}
