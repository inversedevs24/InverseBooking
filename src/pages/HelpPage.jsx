import React from 'react'
import FAQ from '../components/ui/FAQ'
import { HOME_FAQS, CONTACT_FAQS } from '../data'

const CATEGORIES = [
  { icon: '📚', title: 'Bookings & Rides',     desc: 'How to book, modify, or cancel a ride' },
  { icon: '💳', title: 'Payments & Billing',   desc: 'Pricing, payment methods, receipts' },
  { icon: '🔐', title: 'Account & Security',   desc: 'Login, registration, password reset' },
  { icon: '🚗', title: 'Vehicle & Drivers',    desc: 'Fleet info, driver standards, safety' },
  { icon: '📞', title: 'Contact Support',      desc: 'Reach our team directly' },
  { icon: '🏢', title: 'Partner Support',      desc: 'Driver & fleet partner assistance' },
]

const COMBINED_FAQS = [...HOME_FAQS.slice(0, 4), ...CONTACT_FAQS.slice(0, 4)]

export default function HelpPage() {
  return (
    <>
      <div className="help-hero">
        <div className="container">
          <h1>Help Center</h1>
          <p style={{ color: 'var(--gray)', fontSize: 15 }}>How can we help you today?</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="help-cats">
            {CATEGORIES.map((c, i) => (
              <div className="help-cat-card" key={i}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{c.icon}</div>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="section-title">Common Questions</h2>
          <FAQ items={COMBINED_FAQS} />
        </div>
      </section>
    </>
  )
}
