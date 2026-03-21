import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft, MapPin, Clock, Ruler, Car, Users,
  Luggage, User, Mail, Phone, Plane, MessageSquare,
  CheckCircle2, ArrowRight, ShieldCheck, CreditCard, ExternalLink, Loader2,
} from 'lucide-react'
import type { BookingState } from '../../types'

//  Step bar (shared pattern with BookingDetails) 
const STEPS = [{ label: 'Vehicle' }, { label: 'Details' }, { label: 'Checkout' }]

function StepBar({ current }: { current: number }) {
  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-2 sm:gap-3">
        {STEPS.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <div key={i} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && (
                <div className="h-px flex-shrink-0"
                  style={{ width: done ? 40 : 28, backgroundColor: done ? '#0f766e' : '#e2e8f0' }} />
              )}
              <div className={`flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold ${active ? 'text-slate-800' : done ? 'text-slate-400' : 'text-slate-300'
                }`}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={active ? { backgroundColor: '#0f4c3e', color: 'white' }
                    : done ? { backgroundColor: '#0f766e', color: 'white' }
                      : { backgroundColor: '#f1f5f9', color: '#94a3b8' }}
                >
                  {done ? <CheckCircle2 size={13} /> : i + 1}
                </div>
                <span className="hidden sm:block">{step.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

//  Section card wrapper 
function SectionCard({ title, icon: Icon, children }: {
  title: string; icon: typeof Car; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100" style={{ backgroundColor: '#f8fafa' }}>
        <Icon size={14} style={{ color: '#0f766e' }} />
        <span className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">{title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

//  Info row 
function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-[12px] text-slate-400 flex-shrink-0">{label}</span>
      <span className="text-[12px] font-semibold text-slate-700 text-right">{value}</span>
    </div>
  )
}

//  Info chip 
function InfoChip({ icon: Icon, label, value }: { icon: typeof User; label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: '#f0f5f4' }}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon size={11} style={{ color: '#0f766e' }} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-[12px] font-semibold text-slate-700 truncate">{value}</div>
    </div>
  )
}

//  Confirmed screen 
function ConfirmedScreen({ firstName, email }: { firstName: string; email: string }) {
  const navigate = useNavigate()
  const ref = `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-body" style={{ backgroundColor: '#f0f5f4' }}>
      <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(15,23,42,0.12)] px-8 py-10 text-center max-w-[420px] w-full">
        {/* Check circle */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_4px_20px_rgba(15,118,110,0.25)]"
          style={{ backgroundColor: '#0f4c3e' }}
        >
          <CheckCircle2 size={30} className="text-white" />
        </div>

        <h2 className="font-head text-[22px] font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
        <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
          Thank you, <span className="font-semibold text-slate-700">{firstName}</span>!
          Your ride has been booked. A confirmation has been sent to{' '}
          <span className="font-semibold text-slate-700">{email}</span>.
        </p>

        {/* Reference chip */}
        <div
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 mb-7 border border-dashed"
          style={{ backgroundColor: '#e8eeec', borderColor: '#a7c8c2' }}
        >
          <span className="text-[11px] text-slate-500">Booking Ref</span>
          <span className="text-[14px] font-bold font-mono tracking-widest" style={{ color: '#0f4c3e' }}>{ref}</span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-bold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#0f4c3e' }}
        >
          Back to Home <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

//  Main 
export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking: BookingState = location.state || {}
  const v = booking.vehicle || ({} as NonNullable<BookingState['vehicle']>)
  const p = booking.passenger || ({} as NonNullable<BookingState['passenger']>)

  const [redirecting, setRedirecting] = useState(false)
  const [done, setDone] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  const subtotal = Number(booking.price || 0)
  const tax = +(subtotal * 0.05).toFixed(2)
  const total = (subtotal + tax).toFixed(2)

  const formatDatetime = (dt?: string) => {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const handleShopifyRedirect = () => {
    setRedirecting(true)
    //  TODO: Replace this timeout with your real Shopify Storefront API cart/checkout URL 
    // Example:
    //   const checkoutUrl = await createShopifyCheckout({ booking, total })
    //   window.location.href = checkoutUrl
    setTimeout(() => {
      // Simulating redirect completion — remove this and redirect to Shopify in production
      setRedirecting(false)
      setDone(true)
    }, 2000)
  }

  if (done) {
    return <ConfirmedScreen firstName={p.firstName || 'there'} email={p.email || ''} />
  }

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#f0f5f4' }}>

      {/*  Top bar  */}
      <div className="bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(15,23,42,0.06)] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 sm:gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors px-2 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 flex-shrink-0"
          >
            <ChevronLeft size={15} />
            <span className="hidden xs:inline">Back</span>
          </button>

          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

          <h1 className="font-head font-bold text-slate-800 text-[14px] sm:text-[16px] truncate min-w-0">
            Review & Checkout
          </h1>

          <div className="flex-1" />

          {/* Mobile summary toggle */}
          <button
            className="lg:hidden flex items-center gap-1.5 text-[12px] font-semibold rounded-xl px-2.5 sm:px-3 py-1.5 transition-colors flex-shrink-0"
            style={showSummary
              ? { backgroundColor: '#0f4c3e', color: 'white' }
              : { backgroundColor: '#e8eeec', color: '#0f4c3e' }
            }
            onClick={() => setShowSummary(s => !s)}
          >
            <CreditCard size={13} />
            <span className="hidden sm:inline">{showSummary ? 'Hide' : 'Payment'}</span>
          </button>
        </div>
      </div>

      {/*  Steps  */}
      <StepBar current={2} />

      {/*  Mobile payment panel (collapsible)  */}
      {showSummary && (
        <div className="lg:hidden px-4 pt-4 pb-2 max-w-5xl mx-auto">
          <PaymentPanel
            subtotal={subtotal} tax={tax} total={total}
            redirecting={redirecting} onPay={handleShopifyRedirect}
          />
        </div>
      )}

      {/*  Body  */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-6 items-start">

          {/*  Left: review cards  */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Trip details */}
            <SectionCard title="Trip Details" icon={MapPin}>
              <InfoRow label="From" value={booking.from} />
              <InfoRow label="To" value={booking.to} />
              <InfoRow label="Date & Time" value={formatDatetime(booking.datetime)} />
              <div className="flex gap-3 pt-1 mt-1">
                <div className="flex items-center gap-1.5 flex-1 rounded-xl px-3 py-2" style={{ backgroundColor: '#f0f5f4' }}>
                  <Ruler size={12} style={{ color: '#0f766e' }} />
                  <span className="text-[12px] font-semibold text-slate-700">
                    {booking.distance ? `${booking.distance} km` : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-1 rounded-xl px-3 py-2" style={{ backgroundColor: '#f0f5f4' }}>
                  <Clock size={12} style={{ color: '#0f766e' }} />
                  <span className="text-[12px] font-semibold text-slate-700">
                    {booking.duration ? `${booking.duration} min` : '—'}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Vehicle */}
            <SectionCard title="Vehicle" icon={Car}>
              <div className="flex gap-4 items-center">
                {v.image && (
                  <div className="w-[100px] h-[68px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-slate-800 font-head">{v.name || '—'}</div>
                  <div className="text-[11px] text-slate-400 mb-2">{v.model}</div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Users size={10} />{v.passengers} pax
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Luggage size={10} />{v.luggage} bags
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Passenger info */}
            <SectionCard title="Passenger Info" icon={User}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <InfoChip icon={User} label="Full Name" value={`${p.firstName || ''} ${p.lastName || ''}`.trim() || undefined} />
                <InfoChip icon={Mail} label="Email" value={p.email} />
                <InfoChip icon={Phone} label="Phone" value={p.phone} />
                <InfoChip icon={Users} label="Passengers" value={p.passengers ? `${p.passengers} pax` : undefined} />
                {p.flightNumber && <InfoChip icon={Plane} label="Flight No." value={p.flightNumber} />}
              </div>
              {p.specialRequests && (
                <div className="mt-3 rounded-xl px-3 py-2.5" style={{ backgroundColor: '#f0f5f4' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare size={11} style={{ color: '#0f766e' }} />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Special Requests</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{p.specialRequests}</p>
                </div>
              )}
            </SectionCard>

            {/* Mobile CTA (below cards, above sidebar) */}
            <div className="lg:hidden">
              <PaymentPanel
                subtotal={subtotal} tax={tax} total={total}
                redirecting={redirecting} onPay={handleShopifyRedirect}
              />
            </div>
          </div>

          {/*  Right: payment sidebar (desktop)  */}
          <div className="hidden lg:block w-[300px] xl:w-[320px] flex-shrink-0 sticky top-[112px]">
            <PaymentPanel
              subtotal={subtotal} tax={tax} total={total}
              redirecting={redirecting} onPay={handleShopifyRedirect}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

//  Payment panel (extracted so it can be used in both mobile + desktop) 
function PaymentPanel({
  subtotal, tax, total, redirecting, onPay,
}: {
  subtotal: number; tax: number; total: string
  redirecting: boolean; onPay: () => void
}) {
  return (
    <div className="flex flex-col gap-3">

      {/* Price breakdown */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{ background: 'linear-gradient(135deg, #0f4c3e 0%, #1a6b5a 60%, #2d9c84 100%)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#a7c8c2' }}>
            Payment Summary
          </div>
          <div className="text-[28px] font-bold text-white font-head leading-none">
            ${total}
          </div>
          <div className="text-[11px] mt-1" style={{ color: '#a7c8c2' }}>Total inc. VAT</div>
        </div>

        {/* Breakdown rows */}
        <div className="px-5 py-4">
          {[
            { label: 'Base fare', value: `$${subtotal.toFixed(2)}`, highlight: false },
            { label: 'VAT (5%)', value: `$${tax.toFixed(2)}`, highlight: false },
            { label: 'Discount', value: '–$0.00', highlight: true },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-[12px] text-slate-500">{row.label}</span>
              <span className={`text-[13px] font-semibold ${row.highlight ? 'text-emerald-600' : 'text-slate-700'}`}>
                {row.value}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-200">
            <span className="text-[13px] font-bold text-slate-800">Total</span>
            <span className="text-[20px] font-bold font-head" style={{ color: '#0f4c3e' }}>${total}</span>
          </div>
        </div>

        {/* Accepted payment methods */}
        <div className="px-5 pb-4 flex gap-2">
          {['Card', 'Apple Pay', 'Google Pay'].map(m => (
            <span key={m}
              className="flex-1 text-center text-[10px] font-semibold text-slate-400 border border-slate-200 rounded-lg px-2 py-1.5">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* CTA — redirects to Shopify */}
      <button
        onClick={onPay}
        disabled={redirecting}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(15,76,62,0.3)]"
        style={{ backgroundColor: '#0f4c3e' }}
      >
        {redirecting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Redirecting to Checkout…
          </>
        ) : (
          <>
            Proceed to Payment
            <ExternalLink size={15} />
          </>
        )}
      </button>

      {/* Shopify note */}
      <div
        className="flex items-start gap-2.5 rounded-2xl px-4 py-3"
        style={{ backgroundColor: '#e8eeec' }}
      >
        <ShieldCheck size={14} style={{ color: '#0f766e' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed" style={{ color: '#0f4c3e' }}>
          You'll be securely redirected to our Shopify checkout to complete your payment. 256-bit SSL encrypted.
        </p>
      </div>
    </div>
  )
}
