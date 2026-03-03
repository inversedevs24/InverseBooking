import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { BookingState, PassengerForm, ValidationErrors } from '../../types'

export default function BookingDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking: BookingState = location.state || {}

  const [form, setForm] = useState<PassengerForm>({
    firstName: '', lastName: '', email: '', phone: '',
    passengers: '1', flightNumber: '', specialRequests: '',
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

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

  const v = booking.vehicle || {}

  const inputCls = (hasError?: string) =>
    `bg-white/[0.07] border rounded-lg px-[14px] py-[11px] text-label text-white font-body outline-none transition-all w-full placeholder:text-white/25 ${
      hasError
        ? 'border-red-500'
        : 'border-white/12 focus:border-secondary focus:bg-white/10'
    }`

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
        <span className="font-head text-span font-bold text-white">Passenger Details</span>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-2 px-7 py-5 bg-[#122a20] border-b border-white/[0.06]">
        {[
          { label: 'Vehicle', state: 'done' },
          { label: 'Details', state: 'active' },
          { label: 'Checkout', state: 'pending' },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <div className="w-10 h-px bg-white/10" />}
            <div className={`flex items-center gap-2 text-[11px] font-semibold ${step.state === 'active' ? 'text-secondary' : step.state === 'done' ? 'text-white/50' : 'text-white/30'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step.state === 'active' ? 'bg-secondary text-white' : step.state === 'done' ? 'bg-white/15' : 'bg-white/[0.08]'}`}>
                {step.state === 'done' ? '✓' : i + 1}
              </div>
              {step.label}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto my-9 px-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Form */}
        <div className="bg-[#1a3028] border border-white/[0.08] rounded-2xl p-7">
          <div className="font-head text-span font-bold text-white mb-[6px]">Your Details</div>
          <div className="text-label text-white/40 mb-6">Fill in your information to complete the booking</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-[14px]">
            <div className="flex flex-col gap-[6px]">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[1px]">First Name</label>
              <input className={inputCls(errors.firstName)} placeholder="John" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
              {errors.firstName && <span className="text-[11px] text-red-500">{errors.firstName}</span>}
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[1px]">Last Name</label>
              <input className={inputCls(errors.lastName)} placeholder="Doe" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
              {errors.lastName && <span className="text-[11px] text-red-500">{errors.lastName}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-[14px]">
            <div className="flex flex-col gap-[6px]">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[1px]">Email Address</label>
              <input className={inputCls(errors.email)} placeholder="john@email.com" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <span className="text-[11px] text-red-500">{errors.email}</span>}
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[1px]">Phone Number</label>
              <input className={inputCls(errors.phone)} placeholder="+971 50 000 0000" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
              {errors.phone && <span className="text-[11px] text-red-500">{errors.phone}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-[14px]">
            <div className="flex flex-col gap-[6px]">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[1px]">Number of Passengers</label>
              <select className={inputCls()} value={form.passengers} onChange={e => set('passengers', e.target.value)}>
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => (
                  <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[1px]">Flight Number (optional)</label>
              <input className={inputCls()} placeholder="EK 203" value={form.flightNumber} onChange={e => set('flightNumber', e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-[6px] mb-[14px]">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[1px]">Special Requests (optional)</label>
            <textarea
              className={`${inputCls()} resize-y min-h-[80px]`}
              placeholder="Child seat, meet & greet, specific route..."
              value={form.specialRequests}
              onChange={e => set('specialRequests', e.target.value)}
            />
          </div>

          <button
            className="w-full bg-gradient-to-br from-secondary to-secondary/80 border-none rounded-[10px] py-[14px] text-white text-span font-bold cursor-pointer font-body transition-all mt-2 shadow-[0_4px_20px_rgba(203,161,53,0.35)] hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(203,161,53,0.5)]"
            onClick={handleContinue}
          >
            Continue to Checkout →
          </button>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#1a3028] border border-white/[0.08] rounded-2xl overflow-hidden">
            {'image' in v && v.image && <img src={v.image as string} alt={v.name as string} className="w-full h-[140px] object-cover" />}
            <div className="p-4">
              <div className="font-head text-[17px] font-bold text-white mb-1">{(v.name as string) || 'Selected Vehicle'}</div>
              <div className="text-[11px] text-white/40 mb-3">{(v.model as string) || ''}</div>
              {[
                { key: 'From', val: booking.from },
                { key: 'To', val: booking.to },
                { key: 'Distance', val: booking.distance ? `${booking.distance} km` : undefined },
                { key: 'Duration', val: booking.duration ? `${booking.duration} min` : undefined },
              ].map(row => row.val && (
                <div key={row.key} className="flex justify-between items-center py-2 border-b border-white/[0.06] text-label">
                  <span className="text-white/45">{row.key}</span>
                  <span className="text-white font-semibold">{row.val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 text-label">
                <span className="text-white/45">Total</span>
                <span className="text-secondary font-bold text-span font-head">${booking.price || '—'}</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary/[0.08] border border-secondary/20 rounded-[10px] px-4 py-3 text-[11px] text-white/50 leading-[1.7]">
            🔒 Your information is secure and will only be used for this booking.
          </div>
        </div>
      </div>
    </div>
  )
}
