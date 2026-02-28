import React, { useState } from 'react'
import FAQ from '../components/ui/FAQ'
import { PARTNER_FAQS } from '../data'

const PARTNER_TYPES = ['Individual Chauffeur', 'Fleet Owner', 'Transport Company']

const WHO_CAN_JOIN = [
  { icon: '🧑‍✈️', label: 'Individual Chauffeurs' },
  { icon: '🚗',    label: 'Fleet Owners' },
  { icon: '🚙',    label: 'Limousine Companies' },
  { icon: '🚌',    label: 'Transport Agencies' },
]

const REQUIREMENTS = [
  'Valid Driving License (for Chauffeurs)',
  'Clean & Well-Maintained Vehicles',
  'Professional & Polite Drivers',
  'Valid Trade License (for companies)',
  'Basic knowledge of local routes',
]

const BENEFITS = [
  'Guaranteed ride requests',
  'High earning potential',
  'Support for fleet expansion',
  'No hidden charges or unfair deductions',
  'Access to premium clients',
]

const WHY_PARTNER_LIST = [
  'Steady ride bookings every day',
  'On-time and hassle-free payments',
  'Fair & transparent commission',
  'Flexible working hours — work when you want',
  'Dedicated partner support team',
  'Opportunity to serve premium clients in UAE & UK',
]

export default function PartnerPage() {
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <>
      {/* Hero + Form */}
      <div className="container">
        <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
            Become a InverseRide Partner
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 15 }}>
            Drive your success with us. Join the InverseRide partner network and grow your business.
          </p>
        </div>

        <div className="partner-form-card">
          <div className="partner-form-left">
            <h3>Contact Information</h3>
            <div style={{ fontSize: 80, textAlign: 'center', marginTop: 20, opacity: 0.6 }}>🤝</div>
          </div>
          <div className="partner-form-right">
            {submitted && (
              <div className="alert-success">
                ✅ Application submitted! We'll review and contact you within 3-5 business days.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Name</label>
                  <input className="form-control" placeholder="Name" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="phone-input-wrap">
                    <span style={{ fontSize: 18 }}>🇦🇪</span>
                    <input placeholder="(231) 555-0123" />
                  </div>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" type="email" placeholder="Email" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input className="form-control" placeholder="Enter City" />
                </div>
              </div>
              <div className="form-group">
                <label>Partner Type:</label>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
                  {PARTNER_TYPES.map((t) => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input type="radio" name="pt" defaultChecked={t === 'Individual Chauffeur'} style={{ accentColor: 'var(--green)' }} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button type="submit" className="btn-primary">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Why Partner */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 60 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
                Why Partner with InverseRide?
              </h2>
              <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 16 }}>
                We believe in growing together. Join our partner network and unlock new earning opportunities with every ride.
              </p>
              <p style={{ fontWeight: 700, marginBottom: 12 }}>What You Get:</p>
              {WHY_PARTNER_LIST.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, marginBottom: 10 }}>
                  <span style={{ color: 'var(--green)' }}>✅</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <img
              src="https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80"
              alt="Partner driver"
              style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 16 }}
            />
          </div>

          {/* Who Can Join */}
          <h2 className="section-title" style={{ marginBottom: 8 }}>Who Can Join?</h2>
          <p className="section-subtitle">We welcome all professional and reliable transport partners to join InverseRide:</p>
          <div className="who-join-grid">
            {WHO_CAN_JOIN.map((item, i) => (
              <div className="who-join-card" key={i}>
                <div style={{ fontSize: 60, marginBottom: 12 }}>{item.icon}</div>
                <h4>{item.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section section-alt">
        <div className="container">
          <div className="requirements-grid">
            <img
              src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80"
              alt="Requirements"
              className="requirements-img"
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
                Partner Requirements
              </h2>
              <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 16 }}>
                To ensure quality service, we require:
              </p>
              {REQUIREMENTS.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, marginBottom: 12 }}>
                  <span style={{ color: 'var(--green)' }}>✅</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <div className="benefits-section">
        <div className="container">
          <h2 className="section-title">Partner Benefits</h2>
          <p style={{ textAlign: 'center', color: 'var(--green)', fontStyle: 'italic', fontWeight: 600, marginBottom: 8 }}>
            Earn More. Work Smart.
          </p>
          <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: 32, fontSize: 14 }}>
            At InverseRide, we believe in sharing success with our partners. You'll get:
          </p>
          <div className="benefits-grid">
            {BENEFITS.map((b, i) => (
              <div className="benefit-badge" key={i}>
                <span style={{ color: 'var(--accent)' }}>✓</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <FAQ items={PARTNER_FAQS} />
        </div>
      </section>
    </>
  )
}
