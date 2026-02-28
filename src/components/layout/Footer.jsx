import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'

const PAYMENTS = ['GPay', 'VISA', 'AMEX', 'MC', 'Stripe', '💳', 'APay', 'JCB']

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Logo />
            <div style={{ marginTop: 16 }}>
              <div className="footer-contact-item">
                <div className="footer-contact-icon" style={{ background: 'rgba(76,175,80,0.2)' }}>✉</div>
                <span>info@InverseRide.com</span>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon" style={{ background: 'rgba(200,50,50,0.2)' }}>🇦🇪</div>
                <span>+971 66 666 6666</span>
              </div>
            </div>
            <div className="footer-social">
              <div className="social-btn" style={{ background: '#1877f2', color: 'white' }}>f</div>
              <div className="social-btn" style={{ background: '#e1306c', color: 'white' }}>📷</div>
              <div className="social-btn" style={{ background: '#ff9500', color: 'white' }}>★</div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="footer-col">
            <h4>Useful Links</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/partner">Become a Partner</Link>
            </div>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Our Services</h4>
            <div className="footer-links">
              <a>Airport Transfer</a>
              <a>City Transfer</a>
              <a>Car Hire</a>
            </div>
          </div>

          {/* Terms */}
          <div className="footer-col">
            <h4>InverseRide Terms</h4>
            <div className="footer-links">
              <Link to="/terms">Terms and Conditions</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/booking-conditions">Booking Conditions</Link>
              <Link to="/refund">Cancellation &amp; Refund Policy</Link>
              <Link to="/help">Help Center</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>CopyRight - InverseRide © All Right Reserved..</p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {PAYMENTS.map((p, i) => (
              <div key={i} className="payment-icon">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
