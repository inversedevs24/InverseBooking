import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { BookingState } from '../../types'

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking: BookingState = location.state || {}
  const v = booking.vehicle || ({} as NonNullable<BookingState['vehicle']>)
  const p = booking.passenger || ({} as NonNullable<BookingState['passenger']>)

  const [paying, setPaying] = useState(false)
  const [done, setDone] = useState(false)

  const subtotal = Number(booking.price || 0)
  const tax = (subtotal * 0.05).toFixed(2)
  const total = (subtotal + Number(tax)).toFixed(2)

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => { setPaying(false); setDone(true) }, 2200)
  }

  const formatDatetime = (dt?: string) => {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0f1f19] flex items-center justify-center font-body">
        <div className="bg-[#1a3028] border border-secondary/30 rounded-[20px] px-10 py-12 text-center max-w-[440px] shadow-[0_0_60px_rgba(203,161,53,0.1)] animate-pop-in">
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center text-[32px] mx-auto mb-5 shadow-[0_0_32px_rgba(203,161,53,0.4)]">
            ✓
          </div>
          <div className="font-head text-[26px] font-bold text-white mb-[10px]">Booking Confirmed!</div>
          <div className="text-label text-white/50 leading-[1.7] mb-7">
            Thank you, {p.firstName}! Your ride has been booked.<br />
            A confirmation has been sent to <strong className="text-white">{p.email}</strong>.
          </div>
          <div className="bg-secondary/10 border border-dashed border-secondary/30 rounded-[10px] px-5 py-3 text-label text-secondary font-bold tracking-[1px] mb-6">
            Booking Ref: INV-{Math.random().toString(36).slice(2, 8).toUpperCase()}
          </div>
          <button
            className="bg-gradient-to-br from-secondary to-secondary/80 border-none rounded-[10px] px-8 py-[13px] text-white text-label font-bold cursor-pointer font-body"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1f19] font-body">
      {/* Topbar */}
      <div className="bg-[#122a20] border-b border-white/[0.08] px-7 py-[14px] flex items-center gap-4">
        <button
          className="bg-white/[0.08] border border-white/12 rounded-lg text-white/70 px-[14px] py-[7px] cursor-pointer text-label font-semibold transition-all hover:bg-white/14 hover:text-white"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <span className="font-head text-span font-bold text-white">Checkout</span>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-2 px-7 py-5 bg-[#122a20] border-b border-white/[0.06]">
        {[
          { label: 'Vehicle', state: 'done' },
          { label: 'Details', state: 'done' },
          { label: 'Checkout', state: 'active' },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <div className="w-10 h-px bg-white/10" />}
            <div className={`flex items-center gap-2 text-[11px] font-semibold ${step.state === 'active' ? 'text-secondary' : 'text-white/50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step.state === 'active' ? 'bg-secondary text-white' : 'bg-white/15'}`}>
                {step.state === 'done' ? '✓' : i + 1}
              </div>
              {step.label}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto my-9 px-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left: summary cards */}
        <div>
          {/* Trip */}
          <div className="bg-[#1a3028] border border-white/[0.08] rounded-2xl p-6 mb-5">
            <div className="font-head text-span font-bold text-white mb-4 flex items-center gap-2">🗺 Trip Details</div>
            {[
              { key: 'From',         val: booking.from },
              { key: 'To',           val: booking.to },
              { key: 'Date & Time',  val: formatDatetime(booking.datetime) },
              { key: 'Distance',     val: booking.distance ? `${booking.distance} km` : '—' },
              { key: 'Duration',     val: booking.duration ? `${booking.duration} min` : '—' },
            ].map(row => (
              <div key={row.key} className="flex justify-between items-center py-[10px] border-b border-white/[0.05] text-label last:border-none">
                <span className="text-white/45">{row.key}</span>
                <span className="text-white font-semibold">{row.val || '—'}</span>
              </div>
            ))}
          </div>

          {/* Vehicle */}
          <div className="bg-[#1a3028] border border-white/[0.08] rounded-2xl p-6 mb-5">
            <div className="font-head text-span font-bold text-white mb-4 flex items-center gap-2">🚗 Vehicle</div>
            <div className="flex gap-[14px] items-center">
              {v.image && <img src={v.image} alt={v.name} className="w-[100px] h-[68px] object-cover rounded-lg flex-shrink-0" />}
              <div>
                <div className="font-bold text-white text-span mb-1">{v.name}</div>
                <div className="text-[11px] text-white/40 mb-2">{v.model}</div>
                <div className="flex gap-[6px]">
                  <span className="text-[11px] bg-white/[0.08] text-white/60 px-2 py-[2px] rounded-full">👥 {v.passengers} pax</span>
                  <span className="text-[11px] bg-white/[0.08] text-white/60 px-2 py-[2px] rounded-full">🧳 {v.luggage} bags</span>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger */}
          <div className="bg-[#1a3028] border border-white/[0.08] rounded-2xl p-6">
            <div className="font-head text-span font-bold text-white mb-4 flex items-center gap-2">👤 Passenger Info</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
              {[
                { label: 'Name',       val: `${p.firstName} ${p.lastName}` },
                { label: 'Email',      val: p.email },
                { label: 'Phone',      val: p.phone },
                { label: 'Passengers', val: p.passengers },
                ...(p.flightNumber ? [{ label: 'Flight No.', val: p.flightNumber }] : []),
              ].map(item => (
                <div key={item.label} className="bg-white/[0.04] rounded-lg px-3 py-[10px]">
                  <div className="text-[10px] text-white/35 uppercase tracking-[0.8px] mb-[3px]">{item.label}</div>
                  <div className="text-label text-white font-semibold">{item.val}</div>
                </div>
              ))}
              {p.specialRequests && (
                <div className="bg-white/[0.04] rounded-lg px-3 py-[10px] col-span-2">
                  <div className="text-[10px] text-white/35 uppercase tracking-[0.8px] mb-[3px]">Special Requests</div>
                  <div className="text-label text-white font-semibold">{p.specialRequests}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: payment */}
        <div>
          <div className="bg-[#1a3028] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 pt-5">
              <div className="font-head text-span font-bold text-white mb-4 flex items-center gap-2">💳 Payment Summary</div>
              {[
                { label: 'Base fare', val: `$${subtotal}`, color: '' },
                { label: 'VAT (5%)', val: `$${tax}`, color: '' },
                { label: 'Discount',  val: '-$0.00', color: 'text-secondary' },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-label mb-[10px] text-white/60">
                  <span>{row.label}</span>
                  <span className={row.color}>{row.val}</span>
                </div>
              ))}
              <div className="flex justify-between text-span font-bold text-white pt-3 border-t border-white/[0.08] mt-1">
                <span>Total</span>
                <span className="text-secondary font-head text-[22px]">${total}</span>
              </div>
            </div>

            <button
              className="block w-[calc(100%-40px)] mx-5 my-5 bg-gradient-to-br from-secondary to-secondary/80 border-none rounded-[10px] py-[15px] text-white text-span font-bold cursor-pointer font-body transition-all shadow-[0_4px_20px_rgba(203,161,53,0.35)] hover:shadow-[0_8px_28px_rgba(203,161,53,0.5)] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-ring align-middle mr-2" />
                  Processing...
                </>
              ) : `Confirm & Pay $${total}`}
            </button>

            <div className="flex justify-center gap-[10px] px-5 pb-[18px]">
              {['💳 Card', 'Apple Pay', 'Google Pay'].map(m => (
                <span key={m} className="bg-white/[0.07] border border-white/10 rounded-[6px] px-3 py-[5px] text-[11px] text-white/45 font-semibold">{m}</span>
              ))}
            </div>

            <div className="text-center text-[11px] text-white/30 pb-4">🔒 Secured by 256-bit SSL encryption</div>
          </div>
        </div>
      </div>
    </div>
  )
}
