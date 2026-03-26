import { useState } from 'react'
import {
  Phone, Mail, MapPin, Clock, CheckCircle2,
  Send, User, MessageSquare,
} from 'lucide-react'
import FAQ from '../components/ui/FAQ'
import { CONTACT_FAQS } from '../data'
import { brandPhone, brandEmail } from '../env'

const SUBJECTS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'fare', label: 'Fare Dispute' },
  { value: 'technical', label: 'Technical Error' },
  { value: 'quote', label: 'Get a Quote' },
]

//  Dark side info row 
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
        <Icon size={14} className="text-white" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white">
          {label}
        </div>
        <div className="text-[13px] text-white font-body leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

//  Light form field 
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
      <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-2">{label}</div>
      {children}
    </div>
  )
}

const inputCls =
  'w-full text-[14px] text-slate-700 font-body outline-none border-none bg-transparent placeholder:text-slate-300'

export default function ContactPage() {
  const [subject, setSubject] = useState('general')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <>
      {/*  Main section  */}
      <div className="py-12 md:py-[30px]" style={{ backgroundColor: '#F0F5F0' }}>
        <div className="max-w-container mx-auto px-6">

          {/* Page heading */}
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">Get in Touch</p>
            <h1 className="font-head text-heading text-primary leading-none mb-3">Contact Us</h1>
            <p className="text-muted text-[14px] max-w-md mx-auto leading-relaxed">
              Got something on your mind? We'd love to hear from you.
            </p>
          </div>

          {/*  Unified card: dark left + light right  */}
          <div className="rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.14)] grid grid-cols-1 md:grid-cols-[340px_1fr] lg:grid-cols-[380px_1fr]">

            {/*  DARK LEFT — contact info  */}
            <div
              className="relative px-7 py-8 flex flex-col overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #1E3248 0%, #2E4052 55%, #232F3D 100%)' }}
            >
              {/* Decorative blobs */}
              <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full opacity-[0.30]"
                style={{ backgroundColor: '#FFC857' }} />
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-[0.36]"
                style={{ backgroundColor: '#BDD9BF' }} />

              <div className="relative">
                {/* Label */}
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white">
                  Contact Information
                </p>
                <h2 className="font-head text-[22px] font-bold text-white leading-tight mb-6">
                  We're here to help
                </h2>

                {/* Info rows */}
                <DarkInfoRow icon={Phone} label="Phone">
                  <a href={`tel:${brandPhone}`}
                    className="no-underline text-white hover:text-white/80 transition-colors">
                    {brandPhone}
                  </a>
                </DarkInfoRow>

                <DarkInfoRow icon={Mail} label="Email">
                  <a href={`mailto:${brandEmail}`}
                    className="no-underline text-white/80 hover:text-white transition-colors break-all">
                    {brandEmail}
                  </a>
                </DarkInfoRow>

                <DarkInfoRow icon={MapPin} label="Address">
                  Floor 1, Office no. 127, AlHisn Baskin
                </DarkInfoRow>

                <DarkInfoRow icon={Clock} label="Business Hours">
                  <span className="block">Mon – Fri: 8:00 AM – 8:00 PM</span>
                  <span className="block">Sat – Sun: 9:00 AM – 6:00 PM</span>
                </DarkInfoRow>

                {/* Response badge */}
                <div
                  className="mt-5 flex items-start gap-2.5 rounded-2xl px-4 py-3"
                  style={{ backgroundColor: 'rgba(255,200,87,0.15)', border: '1px solid rgba(255,200,87,0.25)' }}
                >
                  <CheckCircle2 size={14} style={{ color: '#FFC857' }} className="flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] leading-relaxed text-white">
                    We typically respond within{' '}
                    <span className="font-semibold">2 hours</span>{' '}
                    during business hours.
                  </p>
                </div>
              </div>
            </div>

            {/*  LIGHT RIGHT — contact form  */}
            <div className="px-6 py-8 md:px-8" style={{ backgroundColor: '#F0F5F0' }}>

              {/* Success banner */}
              {submitted && (
                <div
                  className="flex items-center gap-2.5 rounded-2xl px-4 py-3 mb-4"
                  style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
                >
                  <CheckCircle2 size={14} className="flex-shrink-0" />
                  <span className="text-[13px] font-semibold">
                    Message sent! We'll get back to you soon.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <FormField label="First Name">
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-slate-300 flex-shrink-0" />
                      <input className={inputCls} placeholder="John" />
                    </div>
                  </FormField>
                  <FormField label="Last Name">
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-slate-300 flex-shrink-0" />
                      <input className={inputCls} placeholder="Doe" />
                    </div>
                  </FormField>
                </div>

                {/* Email + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <FormField label="Email">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-slate-300 flex-shrink-0" />
                      <input className={inputCls} type="email" placeholder="john@email.com" />
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

                {/* Subject */}
                <FormField label="Subject">
                  <div className="flex gap-x-5 gap-y-2 flex-wrap pt-0.5">
                    {SUBJECTS.map(s => (
                      <label
                        key={s.value}
                        className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer hover:text-primary transition-colors"
                      >
                        <input
                          type="radio" name="subject" value={s.value}
                          checked={subject === s.value}
                          onChange={() => setSubject(s.value)}
                          className="accent-primary w-3.5 h-3.5"
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </FormField>

                {/* Message */}
                <FormField label="Message">
                  <div className="flex items-start gap-2">
                    <MessageSquare size={13} className="text-slate-300 flex-shrink-0 mt-0.5" />
                    <textarea
                      className="flex-1 text-[14px] text-slate-700 font-body outline-none border-none bg-transparent resize-y min-h-[90px] placeholder:text-slate-300"
                      placeholder="Write your message…"
                      rows={4}
                    />
                  </div>
                </FormField>

                {/* Submit */}
                <button
                  type="submit"
                  className="group relative overflow-hidden w-full rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body transition-colors duration-500 text-white flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(46,64,82,0.3)]"
                  style={{ backgroundColor: '#2E4052' }}
                >
                  {/* Teal wipe on hover */}
                  <span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out pointer-events-none"
                    style={{ backgroundColor: '#3A5268' }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Send Message <Send size={15} />
                  </span>
                </button>

              </form>
            </div>

          </div>
        </div>
      </div>

      {/*  FAQ section  */}
      <section className="py-10 md:py-[60px] bg-secondaryBg">
        <div className="max-w-container mx-auto px-6">
          <p className="text-[11px] font-bold text-primary uppercase tracking-widest text-center mb-2">
            Got Questions?
          </p>
          <h2 className="font-head text-heading text-primary text-center leading-none mb-10">
            Frequently Asked Questions
          </h2>
          <FAQ items={CONTACT_FAQS} />
        </div>
      </section>
    </>
  )
}