import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, CheckCircle, Send } from 'lucide-react'
import FAQ from '../components/ui/FAQ'
import { CONTACT_FAQS } from '../data'
import { brandPhone, brandEmail } from '../env'

const SUBJECTS = [
  { value: 'general',   label: 'General Inquiry' },
  { value: 'fare',      label: 'Fare Dispute' },
  { value: 'technical', label: 'Technical Error' },
  { value: 'quote',     label: 'Give me a Quote' },
]

export default function ContactPage() {
  const [subject, setSubject] = useState('general')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const inputCls = 'flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]'
  const labelCls = 'block text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]'
  const cardCls  = 'bg-white rounded-2xl px-4 pt-3 pb-4 mb-2'

  return (
    <>
      <div className="py-10 md:py-[60px]" style={{ backgroundColor:  '#d5e0de' }}>
        <div className="max-w-container mx-auto px-6">
          <h1 className="font-head text-heading text-center mb-2 text-primary">Contact Us</h1>
          <p className="text-center text-muted mb-10">Got something on your mind? We'd love to hear from you!</p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-7 md:items-start">
            {/* Info panel — second on mobile, first on desktop */}
            <div className="md:order-first order-last">
              {/* <p className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px] px-1">Contact Information</p> */}

              <div className="rounded-2xl px-4 pt-3 pb-4 mb-2" style={{ background: '#0F172A' }}>
                <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wide mb-[6px]">Phone</label>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-white/60 flex-shrink-0" />
                  <span className="text-[14px] text-white font-body">{brandPhone}</span>
                </div>
              </div>

              <div className="rounded-2xl px-4 pt-3 pb-4 mb-2" style={{ background: '#0F172A' }}>
                <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wide mb-[6px]">Email</label>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-white/60 flex-shrink-0" />
                  <span className="text-[14px] text-white font-body">{brandEmail}</span>
                </div>
              </div>

              <div className="rounded-2xl px-4 pt-3 pb-4 mb-2" style={{ background: '#0F172A' }}>
                <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wide mb-[6px]">Address</label>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-white/60 flex-shrink-0 mt-[2px]" />
                  <span className="text-[14px] text-white font-body leading-[1.5]">Floor 1, Office no. 127, AlHisn Baskin</span>
                </div>
              </div>

              <div className="rounded-2xl px-4 pt-3 pb-4 mb-2" style={{ background: '#0F172A' }}>
                <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wide mb-[6px]">Business Hours</label>
                <div className="flex items-start gap-2">
                  <Clock size={14} className="text-white/60 flex-shrink-0 mt-[2px]" />
                  <div>
                    <span className="text-[14px] text-white font-body block">Mon – Fri: 8:00 AM – 8:00 PM</span>
                    <span className="text-[14px] text-white font-body block">Sat – Sun: 9:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl px-4 pt-3 pb-4 mb-2" style={{ background: '#0F172A' }}>
                <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wide mb-[6px]">Response Time</label>
                <span className="text-[14px] text-white font-body">We typically respond within 2 hours during business hours.</span>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl px-3 pb-3" style={{ backgroundColor: '#d5e0de' }}>
              {submitted && (
                <div className="bg-green-600/10 border border-secondary/30 text-secondary px-4 py-3 rounded-lg text-label mb-4 flex items-center gap-2">
                  <CheckCircle size={14} className="flex-shrink-0" />
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {/* Name + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div className={cardCls}>
                    <label className={labelCls}>Name</label>
                    <input className={inputCls} placeholder="Name" />
                  </div>
                  <div className={cardCls}>
                    <label className={labelCls}>Last Name</label>
                    <input className={inputCls} placeholder="Last Name" />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div className={cardCls}>
                    <label className={labelCls}>Email</label>
                    <input className={inputCls} type="email" placeholder="Email" />
                  </div>
                  <div className={cardCls}>
                    <label className={labelCls}>Phone Number</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-body flex-shrink-0">+971</span>
                      <input className={inputCls} placeholder="050 123 4567" />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className={cardCls}>
                  <label className={labelCls}>Select Subject?</label>
                  <div className="flex gap-4 flex-wrap">
                    {SUBJECTS.map(s => (
                      <label key={s.value} className="flex items-center gap-[6px] text-[14px] cursor-pointer">
                        <input
                          type="radio" name="subject" value={s.value}
                          checked={subject === s.value}
                          onChange={() => setSubject(s.value)}
                          className="accent-secondary"
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className={cardCls}>
                  <label className={labelCls}>Message</label>
                  <textarea
                    className="w-full text-[14px] text-primary font-body outline-none border-none bg-transparent resize-y min-h-[80px] placeholder:text-[#aaa]"
                    placeholder="Write your message..."
                    rows={4}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group relative overflow-hidden w-full bg-white text-primary border-none rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body transition-colors duration-700 hover:text-white flex items-center justify-center gap-2"
                >
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square rounded-full bg-[#0F172A] scale-0 group-hover:scale-100 transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    Send Message
                    <Send size={16} />
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 md:py-[60px] bg-secondaryBg">
        <div className="max-w-container mx-auto px-6">
          <h2 className="font-head text-heading text-primary text-center leading-none mb-10">Frequently Asked Questions</h2>
          <FAQ items={CONTACT_FAQS} />
        </div>
      </section>
    </>
  )
}
