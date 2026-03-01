import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function BookingDetails() {
    const navigate = useNavigate()
    const location = useLocation()
    const booking = location.state || {}

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        passengers: '1',
        flightNumber: '',
        specialRequests: '',
    })

    const [errors, setErrors] = useState({})

    const set = (key, val) => {
        setForm(f => ({ ...f, [key]: val }))
        setErrors(e => ({ ...e, [key]: '' }))
    }

    const validate = () => {
        const e = {}
        if (!form.firstName.trim()) e.firstName = 'Required'
        if (!form.lastName.trim()) e.lastName = 'Required'
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
        if (!form.phone.match(/^\+?[\d\s\-]{7,15}$/)) e.phone = 'Valid phone required'
        return e
    }

    const handleContinue = () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }
        navigate('/checkout', { state: { ...booking, passenger: form } })
    }

    const v = booking.vehicle || {}

    return (
        <>
            <style>{`
        .bd-wrap {
          min-height: 100vh;
          background: #0f1f19;
          font-family: var(--font-body, 'DM Sans', sans-serif);
        }

        .bd-topbar {
          background: #122a20;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 14px 28px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .bd-back {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          padding: 7px 14px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .bd-back:hover { background: rgba(255,255,255,0.14); color: #fff; }

        .bd-topbar-title {
          font-family: var(--font-head, serif);
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        /* Steps */
        .bd-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px 28px;
          background: #122a20;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .bd-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
        }

        .bd-step.active { color: #22c55e; }
        .bd-step.done { color: rgba(255,255,255,0.5); }

        .bd-step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }

        .bd-step.active .bd-step-num { background: #22c55e; color: #fff; }
        .bd-step.done .bd-step-num { background: rgba(255,255,255,0.15); }

        .bd-step-connector {
          width: 40px;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }

        /* Main content */
        .bd-content {
          max-width: 900px;
          margin: 36px auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        .bd-form-card {
          background: #1a3028;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px;
        }

        .bd-form-title {
          font-family: var(--font-head, serif);
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .bd-form-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 24px;
        }

        .bd-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }

        .bd-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .bd-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .bd-input {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 14px;
          color: #fff;
          font-family: var(--font-body, sans-serif);
          outline: none;
          transition: border 0.2s, background 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .bd-input::placeholder { color: rgba(255,255,255,0.25); }
        .bd-input:focus { border-color: #22c55e; background: rgba(255,255,255,0.1); }
        .bd-input.error { border-color: #ef4444; }

        .bd-error { font-size: 11px; color: #ef4444; margin-top: -2px; }

        .bd-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .bd-continue-btn {
          width: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          border-radius: 10px;
          padding: 14px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-body, sans-serif);
          transition: all 0.25s;
          margin-top: 8px;
          box-shadow: 0 4px 20px rgba(34,197,94,0.35);
        }

        .bd-continue-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(34,197,94,0.5);
        }

        /* Summary sidebar */
        .bd-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bd-summary-card {
          background: #1a3028;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
        }

        .bd-summary-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }

        .bd-summary-body { padding: 16px; }

        .bd-summary-name {
          font-family: var(--font-head, serif);
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .bd-summary-model {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 12px;
        }

        .bd-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 13px;
        }

        .bd-summary-row:last-child { border-bottom: none; }

        .bd-summary-key { color: rgba(255,255,255,0.45); }
        .bd-summary-val { color: #fff; font-weight: 600; }
        .bd-summary-val.green { color: #22c55e; font-size: 18px; font-family: var(--font-head, serif); }

        @media (max-width: 700px) {
          .bd-content { grid-template-columns: 1fr; }
          .bd-row { grid-template-columns: 1fr; }
        }
      `}</style>

            <div className="bd-wrap">
                <div className="bd-topbar">
                    <button className="bd-back" onClick={() => navigate(-1)}>← Back</button>
                    <span className="bd-topbar-title">Passenger Details</span>
                </div>

                {/* Steps */}
                <div className="bd-steps">
                    <div className="bd-step done">
                        <div className="bd-step-num">✓</div> Vehicle
                    </div>
                    <div className="bd-step-connector" />
                    <div className="bd-step active">
                        <div className="bd-step-num">2</div> Details
                    </div>
                    <div className="bd-step-connector" />
                    <div className="bd-step">
                        <div className="bd-step-num">3</div> Checkout
                    </div>
                </div>

                <div className="bd-content">
                    {/* Form */}
                    <div className="bd-form-card">
                        <div className="bd-form-title">Your Details</div>
                        <div className="bd-form-sub">Fill in your information to complete the booking</div>

                        <div className="bd-row">
                            <div className="bd-field">
                                <label className="bd-label">First Name</label>
                                <input
                                    className={`bd-input${errors.firstName ? ' error' : ''}`}
                                    placeholder="John"
                                    value={form.firstName}
                                    onChange={e => set('firstName', e.target.value)}
                                />
                                {errors.firstName && <span className="bd-error">{errors.firstName}</span>}
                            </div>
                            <div className="bd-field">
                                <label className="bd-label">Last Name</label>
                                <input
                                    className={`bd-input${errors.lastName ? ' error' : ''}`}
                                    placeholder="Doe"
                                    value={form.lastName}
                                    onChange={e => set('lastName', e.target.value)}
                                />
                                {errors.lastName && <span className="bd-error">{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className="bd-row">
                            <div className="bd-field">
                                <label className="bd-label">Email Address</label>
                                <input
                                    className={`bd-input${errors.email ? ' error' : ''}`}
                                    placeholder="john@email.com"
                                    type="email"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                />
                                {errors.email && <span className="bd-error">{errors.email}</span>}
                            </div>
                            <div className="bd-field">
                                <label className="bd-label">Phone Number</label>
                                <input
                                    className={`bd-input${errors.phone ? ' error' : ''}`}
                                    placeholder="+971 50 000 0000"
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => set('phone', e.target.value)}
                                />
                                {errors.phone && <span className="bd-error">{errors.phone}</span>}
                            </div>
                        </div>

                        <div className="bd-row">
                            <div className="bd-field">
                                <label className="bd-label">Number of Passengers</label>
                                <select
                                    className="bd-input"
                                    value={form.passengers}
                                    onChange={e => set('passengers', e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(n => (
                                        <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="bd-field">
                                <label className="bd-label">Flight Number (optional)</label>
                                <input
                                    className="bd-input"
                                    placeholder="EK 203"
                                    value={form.flightNumber}
                                    onChange={e => set('flightNumber', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bd-field">
                            <label className="bd-label">Special Requests (optional)</label>
                            <textarea
                                className="bd-input bd-textarea"
                                placeholder="Child seat, meet & greet, specific route..."
                                value={form.specialRequests}
                                onChange={e => set('specialRequests', e.target.value)}
                            />
                        </div>

                        <button className="bd-continue-btn" onClick={handleContinue}>
                            Continue to Checkout →
                        </button>
                    </div>

                    {/* Sidebar */}
                    <div className="bd-sidebar">
                        <div className="bd-summary-card">
                            {v.image && <img src={v.image} alt={v.name} className="bd-summary-img" />}
                            <div className="bd-summary-body">
                                <div className="bd-summary-name">{v.name || 'Selected Vehicle'}</div>
                                <div className="bd-summary-model">{v.model || ''}</div>

                                <div className="bd-summary-row">
                                    <span className="bd-summary-key">From</span>
                                    <span className="bd-summary-val">{booking.from || '—'}</span>
                                </div>
                                <div className="bd-summary-row">
                                    <span className="bd-summary-key">To</span>
                                    <span className="bd-summary-val">{booking.to || '—'}</span>
                                </div>
                                <div className="bd-summary-row">
                                    <span className="bd-summary-key">Distance</span>
                                    <span className="bd-summary-val">{booking.distance || '—'} km</span>
                                </div>
                                <div className="bd-summary-row">
                                    <span className="bd-summary-key">Duration</span>
                                    <span className="bd-summary-val">{booking.duration || '—'} min</span>
                                </div>
                                <div className="bd-summary-row">
                                    <span className="bd-summary-key">Total</span>
                                    <span className="bd-summary-val green">${booking.price || '—'}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                            🔒 Your information is secure and will only be used for this booking.
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}