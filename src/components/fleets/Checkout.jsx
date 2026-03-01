import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Checkout() {
    const navigate = useNavigate()
    const location = useLocation()
    const booking = location.state || {}
    const v = booking.vehicle || {}
    const p = booking.passenger || {}

    const [paying, setPaying] = useState(false)
    const [done, setDone] = useState(false)

    const subtotal = Number(booking.price || 0)
    const tax = (subtotal * 0.05).toFixed(2)
    const total = (subtotal + Number(tax)).toFixed(2)

    const handlePay = () => {
        setPaying(true)
        setTimeout(() => {
            setPaying(false)
            setDone(true)
        }, 2200)
    }

    const formatDatetime = (dt) => {
        if (!dt) return '—'
        const d = new Date(dt)
        return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    if (done) {
        return (
            <>
                <style>{`
          .co-success {
            min-height: 100vh;
            background: #0f1f19;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-body, 'DM Sans', sans-serif);
          }
          .co-success-card {
            background: #1a3028;
            border: 1px solid rgba(34,197,94,0.3);
            border-radius: 20px;
            padding: 48px 40px;
            text-align: center;
            max-width: 440px;
            box-shadow: 0 0 60px rgba(34,197,94,0.1);
            animation: popIn 0.5s ease both;
          }
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.92); }
            to   { opacity: 1; transform: scale(1); }
          }
          .co-tick {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin: 0 auto 20px;
            box-shadow: 0 0 32px rgba(34,197,94,0.4);
          }
          .co-success-title {
            font-family: var(--font-head, serif);
            font-size: 26px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 10px;
          }
          .co-success-sub {
            font-size: 14px;
            color: rgba(255,255,255,0.5);
            line-height: 1.7;
            margin-bottom: 28px;
          }
          .co-ref {
            background: rgba(34,197,94,0.1);
            border: 1px dashed rgba(34,197,94,0.3);
            border-radius: 10px;
            padding: 12px 20px;
            font-size: 13px;
            color: #22c55e;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 24px;
          }
          .co-home-btn {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border: none;
            border-radius: 10px;
            padding: 13px 32px;
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            font-family: var(--font-body, sans-serif);
          }
        `}</style>
                <div className="co-success">
                    <div className="co-success-card">
                        <div className="co-tick">✓</div>
                        <div className="co-success-title">Booking Confirmed!</div>
                        <div className="co-success-sub">
                            Thank you, {p.firstName}! Your ride has been booked.<br />
                            A confirmation has been sent to <strong style={{ color: '#fff' }}>{p.email}</strong>.
                        </div>
                        <div className="co-ref">Booking Ref: INV-{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
                        <button className="co-home-btn" onClick={() => navigate('/')}>Back to Home</button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <style>{`
        .co-wrap {
          min-height: 100vh;
          background: #0f1f19;
          font-family: var(--font-body, 'DM Sans', sans-serif);
        }

        .co-topbar {
          background: #122a20;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 14px 28px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .co-back {
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
        .co-back:hover { background: rgba(255,255,255,0.14); color: #fff; }

        .co-topbar-title {
          font-family: var(--font-head, serif);
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        /* Steps */
        .co-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px 28px;
          background: #122a20;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .co-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
        }
        .co-step.active { color: #22c55e; }
        .co-step.done { color: rgba(255,255,255,0.5); }
        .co-step-num {
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
        .co-step.active .co-step-num { background: #22c55e; color: #fff; }
        .co-step.done .co-step-num { background: rgba(255,255,255,0.15); }
        .co-step-connector { width: 40px; height: 1px; background: rgba(255,255,255,0.1); }

        /* Content */
        .co-content {
          max-width: 900px;
          margin: 36px auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        .co-card {
          background: #1a3028;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .co-card-title {
          font-family: var(--font-head, serif);
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .co-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 13px;
        }
        .co-row:last-child { border-bottom: none; }
        .co-row-key { color: rgba(255,255,255,0.45); }
        .co-row-val { color: #fff; font-weight: 600; }

        /* Passenger card */
        .co-passenger-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .co-info-item {
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          padding: 10px 12px;
        }
        .co-info-label { font-size: 10px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 3px; }
        .co-info-val { font-size: 13px; color: #fff; font-weight: 600; }

        /* Vehicle card */
        .co-vehicle-row {
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .co-vehicle-img {
          width: 100px;
          height: 68px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        /* Payment card */
        .co-pay-section { background: #1a3028; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }

        .co-price-rows { padding: 20px 20px 0; }
        .co-price-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 10px;
          color: rgba(255,255,255,0.6);
        }
        .co-price-row.total {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: 4px;
        }
        .co-price-row.total span:last-child { color: #22c55e; font-family: var(--font-head, serif); font-size: 22px; }

        .co-pay-btn {
          display: block;
          width: calc(100% - 40px);
          margin: 20px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          border-radius: 10px;
          padding: 15px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-body, sans-serif);
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(34,197,94,0.35);
          position: relative;
          overflow: hidden;
        }
        .co-pay-btn:hover { box-shadow: 0 8px 28px rgba(34,197,94,0.5); transform: translateY(-1px); }
        .co-pay-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .co-pay-methods {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding: 0 20px 18px;
        }
        .co-pay-method {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          font-weight: 600;
        }

        .co-secure {
          text-align: center;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          padding-bottom: 16px;
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .co-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @media (max-width: 700px) {
          .co-content { grid-template-columns: 1fr; }
          .co-passenger-grid { grid-template-columns: 1fr; }
        }
      `}</style>

            <div className="co-wrap">
                <div className="co-topbar">
                    <button className="co-back" onClick={() => navigate(-1)}>← Back</button>
                    <span className="co-topbar-title">Checkout</span>
                </div>

                <div className="co-steps">
                    <div className="co-step done"><div className="co-step-num">✓</div> Vehicle</div>
                    <div className="co-step-connector" />
                    <div className="co-step done"><div className="co-step-num">✓</div> Details</div>
                    <div className="co-step-connector" />
                    <div className="co-step active"><div className="co-step-num">3</div> Checkout</div>
                </div>

                <div className="co-content">
                    {/* Left - Summary */}
                    <div>
                        {/* Trip card */}
                        <div className="co-card">
                            <div className="co-card-title">🗺 Trip Details</div>
                            <div className="co-row"><span className="co-row-key">From</span><span className="co-row-val">{booking.from || '—'}</span></div>
                            <div className="co-row"><span className="co-row-key">To</span><span className="co-row-val">{booking.to || '—'}</span></div>
                            <div className="co-row"><span className="co-row-key">Date &amp; Time</span><span className="co-row-val">{formatDatetime(booking.datetime)}</span></div>
                            <div className="co-row"><span className="co-row-key">Distance</span><span className="co-row-val">{booking.distance || '—'} km</span></div>
                            <div className="co-row"><span className="co-row-key">Duration</span><span className="co-row-val">{booking.duration || '—'} min</span></div>
                        </div>

                        {/* Vehicle card */}
                        <div className="co-card">
                            <div className="co-card-title">🚗 Vehicle</div>
                            <div className="co-vehicle-row">
                                {v.image && <img src={v.image} alt={v.name} className="co-vehicle-img" />}
                                <div>
                                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: 4 }}>{v.name}</div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{v.model}</div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', padding: '2px 8px', borderRadius: 20 }}>👥 {v.passengers} pax</span>
                                        <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', padding: '2px 8px', borderRadius: 20 }}>🧳 {v.luggage} bags</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Passenger card */}
                        <div className="co-card">
                            <div className="co-card-title">👤 Passenger Info</div>
                            <div className="co-passenger-grid">
                                <div className="co-info-item">
                                    <div className="co-info-label">Name</div>
                                    <div className="co-info-val">{p.firstName} {p.lastName}</div>
                                </div>
                                <div className="co-info-item">
                                    <div className="co-info-label">Email</div>
                                    <div className="co-info-val">{p.email}</div>
                                </div>
                                <div className="co-info-item">
                                    <div className="co-info-label">Phone</div>
                                    <div className="co-info-val">{p.phone}</div>
                                </div>
                                <div className="co-info-item">
                                    <div className="co-info-label">Passengers</div>
                                    <div className="co-info-val">{p.passengers}</div>
                                </div>
                                {p.flightNumber && (
                                    <div className="co-info-item">
                                        <div className="co-info-label">Flight No.</div>
                                        <div className="co-info-val">{p.flightNumber}</div>
                                    </div>
                                )}
                                {p.specialRequests && (
                                    <div className="co-info-item" style={{ gridColumn: 'span 2' }}>
                                        <div className="co-info-label">Special Requests</div>
                                        <div className="co-info-val">{p.specialRequests}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right - Payment */}
                    <div>
                        <div className="co-pay-section">
                            <div className="co-price-rows">
                                <div className="co-card-title" style={{ marginBottom: 16 }}>💳 Payment Summary</div>
                                <div className="co-price-row"><span>Base fare</span><span>${subtotal}</span></div>
                                <div className="co-price-row"><span>VAT (5%)</span><span>${tax}</span></div>
                                <div className="co-price-row"><span>Discount</span><span style={{ color: '#22c55e' }}>-$0.00</span></div>
                                <div className="co-price-row total"><span>Total</span><span>${total}</span></div>
                            </div>

                            <button className="co-pay-btn" onClick={handlePay} disabled={paying}>
                                {paying ? <><span className="co-spinner" />Processing...</> : `Confirm & Pay $${total}`}
                            </button>

                            <div className="co-pay-methods">
                                <span className="co-pay-method">💳 Card</span>
                                <span className="co-pay-method">Apple Pay</span>
                                <span className="co-pay-method">Google Pay</span>
                            </div>

                            <div className="co-secure">🔒 Secured by 256-bit SSL encryption</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}