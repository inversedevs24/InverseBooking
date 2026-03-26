import { useState } from 'react'
import {
  UserCheck, Car, Building2, Bus,
  CheckCircle2, Check, User, Phone, Mail, MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import FAQ from '../components/ui/FAQ'
import { PARTNER_FAQS } from '../data'

//  Data 
const PARTNER_TYPES = ['Individual Chauffeur', 'Fleet Owner', 'Transport Company']

type WhoItem = { Icon: LucideIcon; label: string; sub: string }

const WHO_CAN_JOIN: WhoItem[] = [
  { Icon: UserCheck, label: 'Individual Chauffeurs', sub: 'Licensed drivers ready to earn on their own terms.' },
  { Icon: Car, label: 'Fleet Owners', sub: 'Manage your vehicles and grow your fleet income.' },
  { Icon: Building2, label: 'Limousine Companies', sub: 'Expand your client base with premium ride requests.' },
  { Icon: Bus, label: 'Transport Agencies', sub: 'Handle group bookings and corporate contracts with ease.' },
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

//  Reusable dark info row (same as ContactPage) 
function DarkInfoRow({
  icon: Icon, label, children,
}: {
  icon: typeof Phone
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3 items-start py-4 border-b border-white/[0.08] last:border-0">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        <Icon size={14} className="text-white/70" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {label}
        </div>
        <div className="text-[13px] text-white/80 font-body leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

//  Light form field (same as ContactPage) 
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</div>
      {children}
    </div>
  )
}

const inputCls =
  'w-full text-[14px] text-slate-700 font-body outline-none border-none bg-transparent placeholder:text-slate-300'

//  Main 
export default function PartnerPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <>
      {/*  Hero + Form  */}
      <div className="py-12 md:py-[64px]" style={{ backgroundColor: '#BDD9BF' }}>
        <div className="max-w-container mx-auto px-6">

          {/* Page heading */}
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">Join Our Network</p>
            <h1 className="font-head text-heading text-primary leading-none mb-3">Become a Partner</h1>
            <p className="text-muted text-[14px] max-w-md mx-auto leading-relaxed">
              Drive your success with us. Join the InverseRide partner network and grow your business.
            </p>
          </div>

          {/*  Unified card: dark left + light right  */}
          <div className="rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.14)] grid grid-cols-1 md:grid-cols-[340px_1fr] lg:grid-cols-[380px_1fr] max-w-5xl mx-auto">

            {/* DARK LEFT */}
            <div
              className="relative px-7 py-8 flex flex-col"
              style={{ background: 'linear-gradient(160deg, #1E3248 0%, #2E4052 55%, #232F3D 100%)' }}
            >
              {/* Decorative blobs */}
              <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full opacity-[0.30] pointer-events-none"
                style={{ backgroundColor: '#FFC857' }} />
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-[0.20] pointer-events-none"
                style={{ backgroundColor: '#FFC857' }} />

              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Partner Information
                </p>
                <h2 className="font-head text-[22px] font-bold text-white leading-tight mb-6">
                  Grow with InverseRide
                </h2>

                {/* Why join rows */}
                <DarkInfoRow icon={CheckCircle2} label="Earnings">
                  Steady bookings with high earning potential every day.
                </DarkInfoRow>
                <DarkInfoRow icon={MapPin} label="Coverage">
                  Serve premium clients across UAE & UK markets.
                </DarkInfoRow>
                <DarkInfoRow icon={UserCheck} label="Support">
                  Dedicated partner support team available 24/7.
                </DarkInfoRow>

                {/* Response badge */}
                <div
                  className="mt-5 flex items-start gap-2.5 rounded-2xl px-4 py-3"
                  style={{ backgroundColor: 'rgba(255,200,87,0.12)', border: '1px solid rgba(255,200,87,0.2)' }}
                >
                  <CheckCircle2 size={14} style={{ color: '#FFC857' }} className="flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Applications are reviewed within{' '}
                    <span className="text-white font-semibold">3–5 business days</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* LIGHT RIGHT — form */}
            <div className="px-6 py-8 md:px-8" style={{ backgroundColor: '#F0F5F0' }}>

              {submitted && (
                <div
                  className="flex items-center gap-2.5 rounded-2xl px-4 py-3 mb-4"
                  style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
                >
                  <CheckCircle2 size={14} className="flex-shrink-0" />
                  <span className="text-[13px] font-semibold">
                    Application submitted! We'll contact you within 3–5 business days.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">

                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <FormField label="Full Name">
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-slate-300 flex-shrink-0" />
                      <input className={inputCls} placeholder="John Doe" />
                    </div>
                  </FormField>
                  <FormField label="Phone Number">
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-slate-300 flex-shrink-0" />
                      <span className="text-[14px] text-slate-300 font-body flex-shrink-0">+971</span>
                      <input className={inputCls} placeholder="050 123 4567" />
                    </div>
                  </FormField>
                </div>

                {/* Email + City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <FormField label="Email Address">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-slate-300 flex-shrink-0" />
                      <input className={inputCls} type="email" placeholder="john@email.com" />
                    </div>
                  </FormField>
                  <FormField label="City">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-slate-300 flex-shrink-0" />
                      <input className={inputCls} placeholder="Dubai, Abu Dhabi…" />
                    </div>
                  </FormField>
                </div>

                {/* Partner type */}
                <FormField label="Partner Type">
                  <div className="flex gap-x-5 gap-y-2 flex-wrap pt-0.5">
                    {PARTNER_TYPES.map(t => (
                      <label
                        key={t}
                        className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer hover:text-primary transition-colors"
                      >
                        <input
                          type="radio" name="partnerType" value={t}
                          defaultChecked={t === 'Individual Chauffeur'}
                          className="accent-primary w-3.5 h-3.5"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </FormField>

                {/* Message */}
                <FormField label="Tell Us About Yourself (optional)">
                  <textarea
                    className="w-full text-[14px] text-slate-700 font-body outline-none border-none bg-transparent resize-y min-h-[80px] placeholder:text-slate-300"
                    placeholder="Fleet size, experience, services you offer…"
                    rows={3}
                  />
                </FormField>

                {/* Submit */}
                <button
                  type="submit"
                  className="group relative overflow-hidden w-full rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body transition-colors duration-500 text-white flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(46,64,82,0.3)]"
                  style={{ backgroundColor: '#2E4052' }}
                >
                  <span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out pointer-events-none"
                    style={{ backgroundColor: '#3A5268' }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Submit Application <CheckCircle2 size={15} />
                  </span>
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>

      {/*  Why Partner  */}
      <section className="py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[60px] items-center">
            <div>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">Why Join Us</p>
              <h2 className="font-head text-heading text-primary leading-none mb-3">
                Why Partner with InverseRide?
              </h2>
              <p className="text-muted text-[14px] font-body leading-relaxed mb-6">
                We believe in growing together. Join our partner network and unlock new earning opportunities with every ride.
              </p>
              <div className="flex flex-col gap-2">
                {WHY_PARTNER_LIST.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#BDD9BF' }}>
                      <CheckCircle2 size={14} style={{ color: '#2E4052' }} />
                    </div>
                    <span className="text-[14px] text-primary font-body">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden min-h-[300px] md:h-[460px]">
              <img
                src="https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80"
                alt="Partner driver"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/*  Who Can Join  */}
      <section className="py-10 md:py-[60px]" style={{ backgroundColor: '#BDD9BF' }}>
        <div className="max-w-container mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">Open to All</p>
            <h2 className="font-head text-heading text-primary leading-none mb-3">Who Can Join?</h2>
            <p className="text-muted text-[14px] max-w-md mx-auto leading-relaxed">
              We welcome all professional and reliable transport partners.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHO_CAN_JOIN.map(({ Icon, label, sub }, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 text-center shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-primary"
                  style={{ backgroundColor: '#BDD9BF' }}
                >
                  <Icon size={24} style={{ color: '#2E4052' }} className="group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-[14px] font-bold font-head text-primary mb-1">{label}</h4>
                <p className="text-[12px] text-muted font-body leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  Requirements + Benefits  */}
      <section className="py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[60px] items-center mb-14">
            <div className="rounded-2xl overflow-hidden min-h-[260px] md:h-[340px]">
              <img
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80"
                alt="Partner requirements"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">What We Need</p>
              <h2 className="font-head text-heading text-primary leading-none mb-3">Partner Requirements</h2>
              <p className="text-muted text-[14px] font-body leading-relaxed mb-5">
                To ensure quality service for every passenger, we require:
              </p>
              <div className="flex flex-col gap-2">
                {REQUIREMENTS.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#BDD9BF' }}>
                      <Check size={13} style={{ color: '#2E4052' }} />
                    </div>
                    <span className="text-[14px] text-primary font-body">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="text-center mb-8">
            <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">What You Get</p>
            <h2 className="font-head text-heading text-primary leading-none mb-2">Partner Benefits</h2>
            <p className="text-muted text-[14px] italic font-semibold">Earn More. Work Smart.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(15,23,42,0.12)]"
                style={{ backgroundColor: '#2E4052' }}
              >
                <Check size={13} style={{ color: '#FFC857' }} className="flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  FAQ  */}
      <section className="py-10 md:py-[60px] bg-secondaryBg">
        <div className="max-w-container mx-auto px-6">
          <p className="text-[11px] font-bold text-secondary uppercase tracking-widest text-center mb-2">
            Got Questions?
          </p>
          <h2 className="font-head text-heading text-primary text-center leading-none mb-10">
            Frequently Asked Questions
          </h2>
          <FAQ items={PARTNER_FAQS} />
        </div>
      </section>
    </>
  )
}
