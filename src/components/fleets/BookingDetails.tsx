import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft, User, Mail, Phone, Users, Plane,
  Clock, Ruler, CheckCircle2,
  ShieldCheck, ArrowRight, Car, LogIn, UserPlus, X,
} from 'lucide-react'
import type { BookingState, PassengerForm, ValidationErrors } from '../../types'
import { useAuth } from '../../context/AuthContext'

//  Step indicator
const STEPS = [
  { label: 'Vehicle' },
  { label: 'Details' },
  { label: 'Checkout' },
]

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
                <div className={`h-px flex-shrink-0 transition-colors ${done ? 'w-8 sm:w-12' : 'w-6 sm:w-10'}`}
                  style={{ backgroundColor: done ? '#FFC857' : '#D4DDE5', width: undefined }}
                >
                  <div className={`h-px ${done ? 'w-8 sm:w-12' : 'w-6 sm:w-10'}`}
                    style={{ backgroundColor: done ? '#FFC857' : '#D4DDE5' }} />
                </div>
              )}
              <div className={`flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold transition-colors ${active ? 'text-slate-800' : done ? 'text-slate-400' : 'text-slate-300'
                }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all ${active ? 'text-white' : done ? 'text-white' : 'text-slate-400 bg-slate-100'
                  }`} style={active ? { backgroundColor: '#2E4052' } : done ? { backgroundColor: '#2E4052' } : {}}>
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

//  Labelled input wrapper 
function Field({
  label, error, children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      {children}
      {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}
    </div>
  )
}

//  Input style factory 
const inputCls = (hasError?: string) =>
  `w-full bg-white border rounded-xl px-4 py-2.5 text-[13px] text-slate-700 font-body outline-none transition-all placeholder:text-slate-300 ${hasError
    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
    : 'border-slate-200 focus:border-[#2E4052] focus:ring-2 focus:ring-[#EAF0EA]'
  }`

const iconInputWrapper = 'relative'
const iconCls = 'absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none'
const iconInputCls = (err?: string) => inputCls(err) + ' pl-10'

//  Booking summary sidebar 
function BookingSummary({ booking }: { booking: BookingState }) {
  const v = booking.vehicle
  return (
    <div className="flex flex-col gap-3">
      {/* Vehicle card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">
        {v?.image && (
          <div className="h-[130px] overflow-hidden relative">
            <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.4) 0%, transparent 60%)' }} />
            {v.tag && (
              <div
                className="absolute bottom-3 left-3 text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white uppercase tracking-wide"
                style={{ backgroundColor: v.tagColor }}
              >
                {v.tag}
              </div>
            )}
          </div>
        )}
        <div className="px-4 pt-3 pb-4">
          <div className="text-[15px] font-bold text-slate-800 font-head">{v?.name || 'Selected Vehicle'}</div>
          <div className="text-[11px] text-slate-400 mb-3">{v?.model}</div>

          {/* Route */}
          <div className="flex gap-2.5 mb-3">
            <div className="flex flex-col items-center flex-shrink-0 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FFC857' }} />
              <div className="w-px flex-1 my-1" style={{ backgroundColor: '#BDD9BF', minHeight: 20 }} />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">From</div>
                <div className="text-[12px] font-semibold text-slate-700 leading-tight truncate">{booking.from || '—'}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">To</div>
                <div className="text-[12px] font-semibold text-slate-700 leading-tight truncate">{booking.to || '—'}</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { Icon: Ruler, val: booking.distance ? `${booking.distance} km` : '—' },
              { Icon: Clock, val: booking.duration ? `${booking.duration} min` : '—' },
            ].map(({ Icon, val }, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ backgroundColor: '#F0F5F0' }}>
                <Icon size={12} style={{ color: '#2E4052' }} />
                <span className="text-[12px] font-semibold text-slate-700">{val}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-[12px] text-slate-500 font-body">Total</span>
            <span className="text-[20px] font-bold font-head" style={{ color: '#2E4052' }}>
              ${booking.price || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Trust note */}
      <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3" style={{ backgroundColor: '#BDD9BF' }}>
        <ShieldCheck size={14} style={{ color: '#2E4052' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed" style={{ color: '#2E4052' }}>
          Your information is secure and will only be used for this booking.
        </p>
      </div>
    </div>
  )
}

//  Main
export default function BookingDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking: BookingState = location.state || {}
  const { customer, isLoggedIn } = useAuth()

  const [form, setForm] = useState<PassengerForm>({
    firstName: '', lastName: '', email: '', phone: '',
    passengers: '1', flightNumber: '', specialRequests: '',
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [showSummary, setShowSummary] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  // Pre-fill from logged-in customer
  useEffect(() => {
    if (customer) {
      setForm(f => ({
        ...f,
        firstName: customer.firstName || f.firstName,
        lastName:  customer.lastName  || f.lastName,
        email:     customer.email     || f.email,
        phone:     customer.phone     || f.phone,
      }))
    }
  }, [customer])

  const set = (key: keyof PassengerForm, val: string) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = (): ValidationErrors => {
    const e: ValidationErrors = {}
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
            Passenger Details
          </h1>

          <div className="flex-1" />

          {/* Mobile summary toggle */}
          <button
            className="lg:hidden flex items-center gap-1.5 text-[12px] font-semibold rounded-xl px-2.5 sm:px-3 py-1.5 transition-colors flex-shrink-0"
            style={showSummary
              ? { backgroundColor: '#2E4052', color: 'white' }
              : { backgroundColor: '#BDD9BF', color: '#2E4052' }
            }
            onClick={() => setShowSummary(v => !v)}
          >
            <Car size={13} />
            <span className="hidden sm:inline">{showSummary ? 'Hide' : 'Your'} Booking</span>
          </button>
        </div>
      </div>

      {/*  Steps  */}
      <StepBar current={1} />

      {/*  Mobile summary (collapsible)  */}
      {showSummary && (
        <div className="lg:hidden px-4 pt-4 pb-2 max-w-5xl mx-auto">
          <BookingSummary booking={booking} />
        </div>
      )}

      {/*  Body  */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-6 items-start">

          {/*  Form  */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">

              {/* Form header */}
              <div
                className="px-5 sm:px-6 py-4 border-b border-slate-100"
                style={{ backgroundColor: '#FAFAFA' }}
              >
                <h2 className="font-head font-bold text-slate-800 text-[16px]">Your Details</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  {isLoggedIn
                    ? `Signed in as ${customer?.email} — details pre-filled`
                    : 'Fill in your information to complete the booking'}
                </p>
              </div>

              {/* Sign-in banner (guests only) */}
              {!isLoggedIn && !bannerDismissed && (
                <div
                  className="mx-5 sm:mx-6 mt-5 rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  style={{ backgroundColor: '#EEF4EE', border: '1px solid #BDD9BF' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-700 font-head mb-0.5">Sign in for a faster checkout</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Your details will be auto-filled and you can track your bookings from your account.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate('/signin', { state: { from: '/booking-details', bookingState: location.state } })}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#2E4052' }}
                    >
                      <LogIn size={13} /> Sign In
                    </button>
                    <button
                      onClick={() => navigate('/signup', { state: { from: '/booking-details', bookingState: location.state } })}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                    >
                      <UserPlus size={13} /> Register
                    </button>
                    <button
                      onClick={() => setBannerDismissed(true)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/10 transition-colors flex-shrink-0"
                      title="Continue as guest"
                    >
                      <X size={14} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              <div className="px-5 sm:px-6 py-5 space-y-4">

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" error={errors.firstName}>
                    <div className={iconInputWrapper}>
                      <User size={13} className={iconCls} />
                      <input
                        className={iconInputCls(errors.firstName)}
                        placeholder="John"
                        value={form.firstName}
                        onChange={e => set('firstName', e.target.value)}
                      />
                    </div>
                  </Field>
                  <Field label="Last Name" error={errors.lastName}>
                    <div className={iconInputWrapper}>
                      <User size={13} className={iconCls} />
                      <input
                        className={iconInputCls(errors.lastName)}
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={e => set('lastName', e.target.value)}
                      />
                    </div>
                  </Field>
                </div>

                {/* Contact row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email Address" error={errors.email}>
                    <div className={iconInputWrapper}>
                      <Mail size={13} className={iconCls} />
                      <input
                        className={iconInputCls(errors.email)}
                        placeholder="john@email.com"
                        type="email"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                      />
                    </div>
                  </Field>
                  <Field label="Phone Number" error={errors.phone}>
                    <div className={iconInputWrapper}>
                      <Phone size={13} className={iconCls} />
                      <input
                        className={iconInputCls(errors.phone)}
                        placeholder="+971 50 000 0000"
                        type="tel"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                      />
                    </div>
                  </Field>
                </div>

                {/* Passengers + flight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Number of Passengers">
                    <div className={iconInputWrapper}>
                      <Users size={13} className={iconCls} />
                      <select
                        className={iconInputCls()}
                        value={form.passengers}
                        onChange={e => set('passengers', e.target.value)}
                      >
                        {Array.from({ length: 14 }, (_, i) => i + 1).map(n => (
                          <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </Field>
                  <Field label="Flight Number (optional)">
                    <div className={iconInputWrapper}>
                      <Plane size={13} className={iconCls} />
                      <input
                        className={iconInputCls()}
                        placeholder="EK 203"
                        value={form.flightNumber}
                        onChange={e => set('flightNumber', e.target.value)}
                      />
                    </div>
                  </Field>
                </div>

                {/* CTA */}
                <button
                  onClick={handleContinue}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] shadow-[0_4px_16px_rgba(46,64,82,0.3)]"
                  style={{ backgroundColor: '#2E4052' }}
                >
                  Continue to Checkout
                  <ArrowRight size={16} />
                </button>

              </div>
            </div>
          </div>

          {/*  Sidebar (desktop only)  */}
          <div className="hidden lg:block w-[300px] xl:w-[320px] flex-shrink-0 sticky top-[112px]">
            <BookingSummary booking={booking} />
          </div>
        </div>
      </div>
    </div>
  )
}