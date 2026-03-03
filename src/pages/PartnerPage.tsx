import { useState } from 'react'
import FAQ from '../components/ui/FAQ'
import { PARTNER_FAQS } from '../data'

const PARTNER_TYPES = ['Individual Chauffeur', 'Fleet Owner', 'Transport Company']

const WHO_CAN_JOIN = [
  { icon: '🧑‍✈️', label: 'Individual Chauffeurs' },
  { icon: '🚗',    label: 'Fleet Owners' },
  { icon: '🚙',    label: 'Limousine Companies' },
  { icon: '🚌',    label: 'Transport Agencies' },
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

export default function PartnerPage() {
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const inputCls = 'w-full border-none border-b border-b-border pb-[10px] text-label font-body outline-none text-primary bg-transparent transition-colors focus:border-b-secondary placeholder:text-[#aaa]'

  return (
    <>
      {/* Hero + Form */}
      <div className="max-w-container mx-auto px-6">
        <div className="text-center py-12 pb-8">
          <h1 className="font-head text-heading mb-2">Become a InverseRide Partner</h1>
          <p className="text-muted text-span">Drive your success with us. Join the InverseRide partner network and grow your business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] rounded-card-lg overflow-hidden shadow-card-lg max-w-[860px] mx-auto mb-10 md:mb-[60px]">
          <div className="bg-primary p-9 px-7 flex flex-col">
            <h3 className="text-white text-span font-bold mb-5">Contact Information</h3>
            <div className="text-[80px] text-center mt-5 opacity-60">🤝</div>
          </div>
          <div className="bg-white p-9">
            {submitted && (
              <div className="bg-secondary/10 border border-secondary/30 text-secondary px-4 py-3 rounded-lg text-label mb-4">
                ✅ Application submitted! We'll review and contact you within 3-5 business days.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="mb-4">
                  <label className="block text-label font-semibold text-primary mb-[6px]">Name</label>
                  <input className={inputCls} placeholder="Name" />
                </div>
                <div className="mb-4">
                  <label className="block text-label font-semibold text-primary mb-[6px]">Phone Number</label>
                  <div className="flex items-center gap-2 border-b border-border focus-within:border-secondary transition-colors">
                    <span className="text-lg">🇦🇪</span>
                    <input className="border-none outline-none text-label font-body flex-1 pb-[10px] bg-transparent" placeholder="(231) 555-0123" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="mb-4">
                  <label className="block text-label font-semibold text-primary mb-[6px]">Email</label>
                  <input className={inputCls} type="email" placeholder="Email" />
                </div>
                <div className="mb-4">
                  <label className="block text-label font-semibold text-primary mb-[6px]">City</label>
                  <input className={inputCls} placeholder="Enter City" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-label font-semibold text-primary mb-2">Partner Type:</label>
                <div className="flex gap-4 flex-wrap mt-2">
                  {PARTNER_TYPES.map(t => (
                    <label key={t} className="flex items-center gap-[6px] text-label cursor-pointer">
                      <input type="radio" name="pt" defaultChecked={t === 'Individual Chauffeur'} className="accent-secondary" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <button type="submit" className="bg-primary text-white border-none rounded-lg px-7 py-3 font-semibold text-label cursor-pointer font-body transition-colors hover:bg-secondary">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Why Partner */}
      <section className="py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[60px] items-center mb-[60px]">
            <div>
              <h2 className="font-head text-title mb-2">Why Partner with InverseRide?</h2>
              <p className="text-muted text-label mb-4">We believe in growing together. Join our partner network and unlock new earning opportunities with every ride.</p>
              <p className="font-bold mb-3">What You Get:</p>
              {WHY_PARTNER_LIST.map((item, i) => (
                <div key={i} className="flex items-center gap-[10px] text-label mb-[10px]">
                  <span className="text-secondary">✅</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <img src="https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80" alt="Partner driver" className="w-full h-[360px] object-cover rounded-card-lg" />
          </div>

          <h2 className="font-head text-heading text-primary text-center mb-2">Who Can Join?</h2>
          <p className="text-center text-muted text-span mb-10">We welcome all professional and reliable transport partners to join InverseRide:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px] mb-12">
            {WHO_CAN_JOIN.map((item, i) => (
              <div key={i} className="border border-[1.5px] border-border rounded-card p-[22px] text-center cursor-pointer transition-all hover:border-secondary hover:shadow-card">
                <div className="text-[60px] mb-3">{item.icon}</div>
                <h4 className="text-label font-semibold">{item.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-10 md:py-[60px] bg-secondaryBg">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[60px] items-center mb-[60px]">
            <img src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80" alt="Requirements" className="w-full h-[320px] object-cover rounded-card-lg" />
            <div>
              <h2 className="font-head text-title mb-3">Partner Requirements</h2>
              <p className="text-muted text-label mb-4">To ensure quality service, we require:</p>
              {REQUIREMENTS.map((r, i) => (
                <div key={i} className="flex items-center gap-[10px] text-label mb-3">
                  <span className="text-secondary">✅</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <div className="bg-secondaryBg py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <h2 className="font-head text-heading text-primary text-center mb-2">Partner Benefits</h2>
          <p className="text-center text-secondary italic font-semibold mb-2">Earn More. Work Smart.</p>
          <p className="text-center text-muted mb-8 text-label">At InverseRide, we believe in sharing success with our partners. You'll get:</p>
          <div className="flex flex-wrap justify-center gap-[14px]">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-primary text-white px-[22px] py-3 rounded-lg text-label font-semibold flex items-center gap-[10px]">
                <span className="text-secondary">✓</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <h2 className="font-head text-heading text-primary text-center mb-10">Frequently Asked Questions</h2>
          <FAQ items={PARTNER_FAQS} />
        </div>
      </section>
    </>
  )
}
