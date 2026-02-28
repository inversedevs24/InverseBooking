import React, { useState } from 'react'
import FAQ from '../components/ui/FAQ'
import { CONTACT_FAQS } from '../data'

const SUBJECTS = [
  { value: 'general',   label: 'General Inquiry' },
  { value: 'fare',      label: 'Fare Dispute' },
  { value: 'technical', label: 'Technical Error' },
  { value: 'quote',     label: 'Give me a Quote' },
]

export default function ContactPage() {
  const [subject, setSubject] = useState('general')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <>
      <div style={{ padding: '60px 0' }}>
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">Got something on your mind? We'd love to hear from you!</p>

          <div className="contact-grid">
            {/* Info panel */}
            <div className="contact-info-card">
              <h3>Contact Information</h3>
              <div className="contact-info-item">
                <span style={{ fontSize: 18 }}>🇦🇪</span>
                <p>+971 66 666 6666</p>
              </div>
              <div className="contact-info-item">
                <span style={{ fontSize: 18 }}>✉️</span>
                <p>support@InverseRide.com</p>
              </div>
              <div className="contact-info-item">
                <span style={{ fontSize: 18 }}>📍</span>
                <p>Floor 1, Office no. 127, AlHisn Baskin Robins Building, Kulaib Bin Abdullah Al Hameli Street, Abu Dhabi</p>
              </div>
              <div className="footer-social" style={{ marginTop: 24 }}>
                <div className="social-btn" style={{ background: '#1877f2', color: 'white' }}>f</div>
                <div className="social-btn" style={{ background: '#e1306c', color: 'white' }}>📷</div>
                <div className="social-btn" style={{ background: '#ff0000', color: 'white' }}>▶</div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card">
              {submitted && (
                <div className="alert-success">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Name</label>
                    <input className="form-control" placeholder="Name" />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input className="form-control" placeholder="Last Name" />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" type="email" placeholder="Email" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="phone-input-wrap">
                      <span style={{ fontSize: 18 }}>🇦🇪</span>
                      <input placeholder="050 123 4567" />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Select Subject?</label>
                  <div className="subject-options">
                    {SUBJECTS.map((s) => (
                      <label key={s.value} className="subject-option">
                        <input
                          type="radio"
                          name="subject"
                          value={s.value}
                          checked={subject === s.value}
                          onChange={() => setSubject(s.value)}
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea className="form-control" placeholder="Write your message..." rows={4} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn-primary">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <FAQ items={CONTACT_FAQS} />
        </div>
      </section>
    </>
  )
}
