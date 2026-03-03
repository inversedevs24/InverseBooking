import { useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
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

  const inputCls = 'w-full border-none border-b border-b-border pb-[10px] text-label font-body outline-none text-primary bg-transparent transition-colors focus:border-b-secondary placeholder:text-[#aaa]'

  return (
    <>
      <div className="py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <h1 className="font-head text-heading text-center mb-2 text-primary">Contact Us</h1>
          <p className="text-center text-muted mb-10">Got something on your mind? We'd love to hear from you!</p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-7">
            {/* Info panel */}
            <div className="bg-primary text-white rounded-card-lg p-8 relative overflow-hidden">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              {[
                { icon: <Phone size={18} />, text: brandPhone },
                { icon: <Mail size={18} />,  text: brandEmail },
                { icon: <MapPin size={18} />, text: 'Floor 1, Office no. 127, AlHisn Baskin Robins Building, Kulaib Bin Abdullah Al Hameli Street, Abu Dhabi' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 mb-[18px]">
                  <span className="text-secondary flex-shrink-0 mt-1">{item.icon}</span>
                  <p className="text-white/80 text-label leading-[1.5]">{item.text}</p>
                </div>
              ))}
              <div className="flex gap-[10px] mt-6">
                <div className="w-[34px] h-[34px] rounded-full bg-[#1877f2] text-white flex items-center justify-center text-label cursor-pointer font-bold hover:opacity-80 transition-opacity">f</div>
                <div className="w-[34px] h-[34px] rounded-full bg-[#e1306c] text-white flex items-center justify-center text-label cursor-pointer font-bold hover:opacity-80 transition-opacity">📷</div>
                <div className="w-[34px] h-[34px] rounded-full bg-[#ff0000] text-white flex items-center justify-center text-label cursor-pointer font-bold hover:opacity-80 transition-opacity">▶</div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-border rounded-card-lg p-8">
              {submitted && (
                <div className="bg-secondary/10 border border-secondary/30 text-secondary px-4 py-3 rounded-lg text-label mb-4">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="mb-4">
                    <label className="block text-label font-semibold text-primary mb-[6px]">Name</label>
                    <input className={inputCls} placeholder="Name" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-label font-semibold text-primary mb-[6px]">Last Name</label>
                    <input className={inputCls} placeholder="Last Name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="mb-4">
                    <label className="block text-label font-semibold text-primary mb-[6px]">Email</label>
                    <input className={inputCls} type="email" placeholder="Email" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-label font-semibold text-primary mb-[6px]">Phone Number</label>
                    <div className="flex items-center gap-2 border-b border-border focus-within:border-secondary transition-colors">
                      <span className="text-lg">🇦🇪</span>
                      <input className="border-none outline-none text-label font-body flex-1 pb-[10px] bg-transparent" placeholder="050 123 4567" />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-label font-semibold text-primary mb-[6px]">Select Subject?</label>
                  <div className="flex gap-4 flex-wrap">
                    {SUBJECTS.map(s => (
                      <label key={s.value} className="flex items-center gap-[6px] text-label cursor-pointer">
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
                <div className="mb-4">
                  <label className="block text-label font-semibold text-primary mb-[6px]">Message</label>
                  <textarea
                    className="w-full border border-border rounded-lg p-[10px] text-label font-body outline-none text-primary bg-transparent transition-colors focus:border-secondary resize-y min-h-[80px] placeholder:text-[#aaa]"
                    placeholder="Write your message..."
                    rows={4}
                  />
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
      </div>

      <section className="py-10 md:py-[60px] bg-secondaryBg">
        <div className="max-w-container mx-auto px-6">
          <h2 className="font-head text-heading text-primary text-center mb-10">Frequently Asked Questions</h2>
          <FAQ items={CONTACT_FAQS} />
        </div>
      </section>
    </>
  )
}
