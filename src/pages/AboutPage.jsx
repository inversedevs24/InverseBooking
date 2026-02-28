import React from 'react'
import { useNavigate } from 'react-router-dom'

const OFFERS = [
  {
    icon: '🚗',
    title: 'Transfers: Fixed-point rides (e.g., airport, hotel, intercity)',
    desc: 'Point-to-point rides suitable for airport transfers, city transport, and intercity travel. Includes 15 minutes free waiting for standard pickups and 60 minutes for airport pickups.',
  },
  {
    icon: '🧑‍✈️',
    title: 'Hourly Chauffeur: Time-based vehicle hire with a professional driver',
    desc: 'Hire a vehicle with a professional driver based on time. Suitable for errands, business meetings, or events.',
  },
  {
    icon: '🏜️',
    title: 'Desert Safari',
    desc: "Enjoy the thrill of the UAE's desert with our exciting safari packages. From dune bashing to traditional Bedouin camps, experience the magic of the Arabian desert.",
  },
  {
    icon: '🏛️',
    title: 'City Tours',
    desc: "Discover UAE's culture and landmarks with our guided city tours. Explore Dubai's skyscrapers, Abu Dhabi's heritage sites, and more.",
  },
]

const WHY_CARDS = [
  { icon: '📅', title: 'Flexible Booking',        desc: "Book your ride anytime — instantly or in advance. We're available 24/7 for your convenience." },
  { icon: '👨‍✈️', title: 'Professional Chauffeurs', desc: 'All our drivers are trained, polite, and experienced to make your ride safe and comfortable.' },
  { icon: '💧', title: 'Free Wi-Fi & Water',       desc: 'Stay connected and refreshed during your journey. Complimentary Wi-Fi and bottled water in every ride.' },
  { icon: '🚗', title: 'Multiple Ride Options',    desc: 'From airport transfers to hourly chauffeurs — choose the service that suits your needs.' },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container">
          <div className="about-hero-grid">
            <div>
              <h1>Welcome to InverseRide</h1>
              <p>Your trusted platform for smooth and reliable travel experiences in the UAE.</p>
              <p>We specialize in providing premium ride services, including city, airport, and intercity transfers, along with hourly chauffeur services.</p>
              <p>In the UAE, we also offer exclusive Desert Safari and City Tour experiences.</p>
              <p>Whether you're a resident or a visitor, InverseRide is here to make every ride easy, comfortable, and stress-free.</p>
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 13 }}>🛡️ Secure Payments</span>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {['GPay', 'VISA', 'AMEX', 'MC', 'Stripe', 'APay'].map((p, i) => (
                    <div key={i} style={{ background: 'var(--gray-light)', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 700 }}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
              alt="Happy riders"
              className="about-img"
            />
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="offer-grid">
            {OFFERS.map((item, i) => (
              <div className="offer-item" key={i}>
                <div className="offer-icon-wrap">{item.icon}</div>
                <div className="offer-text">
                  <h4>{item.title}</h4>
                  <span className="available-badge">● Available in UAE &amp; UK</span>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="why-cards-grid">
            {WHY_CARDS.map((c, i) => (
              <div className="why-card" key={i}>
                <div className="why-card-icon">{c.icon}</div>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <div style={{ background: 'var(--gray-light)', padding: '60px 0' }}>
        <div className="container">
          <div className="commitment-grid">
            <img
              src="https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?w=600&q=80"
              alt="Our Commitment"
              className="commitment-img"
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 30, fontWeight: 700, marginBottom: 16 }}>
                Our Commitment
              </h2>
              <p style={{ color: 'var(--gray)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                At InverseRide, we're committed to giving you a smooth, safe, and comfortable travel experience — every time you ride with us. Whether you're a visitor exploring the UAE or UK, or a resident looking for reliable transport, we're here to serve you.
              </p>
              <p style={{ color: 'var(--gray)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                Thank you for choosing InverseRide. We're here to make every ride simple, safe, and memorable.
              </p>
              <button className="btn-primary" onClick={() => navigate('/signin')}>Book with us</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
