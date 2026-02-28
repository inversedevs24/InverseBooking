import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'

export default function SignInPage() {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <Logo onClick={() => navigate('/')} />
      </div>
      <div className="auth-card">
        <h2>
          <span className="auth-icon">👤</span> Sign In
        </h2>

        <div className="auth-input-wrap">
          <span className="auth-input-icon">✉</span>
          <input className="auth-input" type="email" placeholder="Email Address" />
        </div>

        <div className="auth-input-wrap">
          <span className="auth-input-icon">🔑</span>
          <input className="auth-input" type="password" placeholder="Password" />
          <span className="auth-input-eye">👁</span>
        </div>

        <div className="auth-options">
          <label className="auth-check">
            <input type="checkbox" /> Remember Me
          </label>
          <a className="auth-link" href="#">Forgot Password?</a>
        </div>

        <button className="btn-auth" onClick={() => navigate('/')}>Sign In</button>

        <div className="auth-divider">OR</div>

        <button className="btn-google">
          <span className="g-logo">G</span> Continue with Google
        </button>

        <p className="auth-text">
          New to InverseRide? <Link to="/signup">Signup now</Link>
        </p>

        <div className="auth-divider">OR</div>

        <button className="btn-guest" onClick={() => navigate('/')}>
          👤 Book as a Guest
        </button>

        <p className="auth-terms">
          By proceeding you agree to InverseRide{' '}
          <Link to="/terms">Terms</Link> &amp; <Link to="/privacy">Privacy</Link>
        </p>
      </div>
    </div>
  )
}
