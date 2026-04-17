import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft, MapPin, Clock, Ruler, Car, Users,
  Luggage, User, Mail, Phone, Plane, MessageSquare,
  CheckCircle2, CreditCard, ExternalLink, Loader2,
  AlertCircle,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createCheckout } from '../../store/slices/cartSlice'
import { useAuth } from '../../context/AuthContext'
import type { BookingState, TaxiOption, SearchDetails } from '../../types'

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
                  style={{ width: done ? 40 : 28, backgroundColor: done ? '#FFC857' : '#D4DDE5' }} />
              )}
              <div className={`flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold ${active ? 'text-slate-800' : done ? 'text-slate-400' : 'text-slate-300'
                }`}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={active ? { backgroundColor: '#2E4052', color: 'white' }
                    : done ? { backgroundColor: '#2E4052', color: 'white' }
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
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100" style={{ backgroundColor: '#FAFAFA' }}>
        <Icon size={14} style={{ color: '#2E4052' }} />
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
    <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: '#F0F5F0' }}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon size={11} style={{ color: '#2E4052' }} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-[12px] font-semibold text-slate-700 truncate">{value}</div>
    </div>
  )
}


//  Derive currency symbol from a variant price currencyCode
function currencySymbol(code?: string): string {
  const map: Record<string, string> = { USD: '$', EUR: '€', AED: 'AED ' }
  return map[code ?? ''] ?? (code ? code + ' ' : 'AED ')
}

//  Main
export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking: BookingState = location.state || {}
  const v = booking.vehicle || ({} as NonNullable<BookingState['vehicle']>)
  const p = booking.passenger || ({} as NonNullable<BookingState['passenger']>)

  const dispatch = useAppDispatch()
  const { checkoutUrl, loading: cartLoading, error: cartError } = useAppSelector(s => s.cart)
  const { customer } = useAuth()

  const [showSummary, setShowSummary] = useState(false)

  // Derive currency from the taxiOption variant price, fall back to AED
  const taxiOption = (booking as any).taxiOption as TaxiOption | undefined
  const variantCurrency = taxiOption?.variants?.[0]?.price?.currencyCode
  const sym = currencySymbol(variantCurrency)

  const subtotal = Number(booking.price || 0)
  const tax = +(subtotal * 0.05).toFixed(2)
  const total = (subtotal + tax).toFixed(2)

  const formatDatetime = (dt?: string) => {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('en-AE', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  // Redirect to Shopify as soon as checkoutUrl is ready
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }, [checkoutUrl])

  const handleShopifyRedirect = () => {
    const selectedVariantId = (booking as any).selectedVariantId as string | undefined
    const rawSearchDetails = (booking as any).searchDetails as SearchDetails | undefined
    const quantity: number = (booking as any).quantity ?? 1

    if (taxiOption && selectedVariantId && rawSearchDetails) {
      // Use the email from the passenger form, or from the logged-in customer as fallback
      const email = p.email || customer?.email || undefined
      const item = {
        taxi: {
          ...taxiOption,
          shopifyId: selectedVariantId,
        },
        search: {
          ...rawSearchDetails,
          flightNumber: p.flightNumber || rawSearchDetails.flightNumber || undefined,
        },
        totalPrice: subtotal,
        quantity,
      }
      dispatch(createCheckout({ item, email }))
    }
  }

  const redirecting = cartLoading

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#F0F5F0' }}>

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
              ? { backgroundColor: '#2E4052', color: 'white' }
              : { backgroundColor: '#BDD9BF', color: '#2E4052' }
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
            sym={sym} subtotal={subtotal} tax={tax} total={total}
            redirecting={redirecting} error={cartError} onPay={handleShopifyRedirect}
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
                <div className="flex items-center gap-1.5 flex-1 rounded-xl px-3 py-2" style={{ backgroundColor: '#F0F5F0' }}>
                  <Ruler size={12} style={{ color: '#2E4052' }} />
                  <span className="text-[12px] font-semibold text-slate-700">
                    {booking.distance ? `${booking.distance} km` : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-1 rounded-xl px-3 py-2" style={{ backgroundColor: '#F0F5F0' }}>
                  <Clock size={12} style={{ color: '#2E4052' }} />
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
                <div className="mt-3 rounded-xl px-3 py-2.5" style={{ backgroundColor: '#F0F5F0' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare size={11} style={{ color: '#2E4052' }} />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Special Requests</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{p.specialRequests}</p>
                </div>
              )}
            </SectionCard>

          </div>

          {/*  Right: payment sidebar (desktop)  */}
          <div className="hidden lg:block w-[300px] xl:w-[320px] flex-shrink-0 sticky top-[112px]">
            <PaymentPanel
              sym={sym} subtotal={subtotal} tax={tax} total={total}
              redirecting={redirecting} error={cartError} onPay={handleShopifyRedirect}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

//  Payment panel (extracted so it can be used in both mobile + desktop)
function PaymentPanel({
  sym, subtotal, tax, total, redirecting, error, onPay,
}: {
  sym: string; subtotal: number; tax: number; total: string
  redirecting: boolean; error?: string | null; onPay: () => void
}) {
  return (
    <div className="flex flex-col gap-3">

      {/* Price breakdown */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#BDD9BF' }}>
            Payment Summary
          </div>
          <div className="text-[28px] font-bold text-white font-head leading-none">
            {sym}{total}
          </div>
          <div className="text-[11px] mt-1" style={{ color: '#BDD9BF' }}>Total inc. VAT</div>
        </div>

        {/* Breakdown rows */}
        <div className="px-5 py-4">
          {[
            { label: 'Base fare', value: `${sym}${subtotal.toFixed(2)}`, highlight: false },
            { label: 'VAT (5%)', value: `${sym}${tax.toFixed(2)}`, highlight: false },
            { label: 'Discount', value: `–${sym}0.00`, highlight: true },
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
            <span className="text-[20px] font-bold font-head" style={{ color: '#2E4052' }}>{sym}{total}</span>
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

      {/* Error from Shopify */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3 bg-red-50 border border-red-100">
          <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-red-600">{error}</p>
        </div>
      )}

      {/* CTA — redirects to Shopify */}
      <button
        onClick={onPay}
        disabled={redirecting}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(46,64,82,0.3)]"
        style={{ backgroundColor: '#2E4052' }}
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

    </div>
  )
}
