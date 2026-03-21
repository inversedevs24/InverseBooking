import { BookOpen, CreditCard, ShieldCheck, Car, Headphones, Building2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import FAQ from '../components/ui/FAQ'
import { HOME_FAQS, CONTACT_FAQS } from '../data'

type Category = { Icon: LucideIcon; title: string; desc: string }

const CATEGORIES: Category[] = [
  { Icon: BookOpen,    title: 'Bookings & Rides',   desc: 'How to book, modify, or cancel a ride' },
  { Icon: CreditCard,  title: 'Payments & Billing', desc: 'Pricing, payment methods, receipts' },
  { Icon: ShieldCheck, title: 'Account & Security', desc: 'Login, registration, password reset' },
  { Icon: Car,         title: 'Vehicle & Drivers',  desc: 'Fleet info, driver standards, safety' },
  { Icon: Headphones,  title: 'Contact Support',    desc: 'Reach our team directly' },
  { Icon: Building2,   title: 'Partner Support',    desc: 'Driver & fleet partner assistance' },
]

const COMBINED_FAQS = [...HOME_FAQS.slice(0, 4), ...CONTACT_FAQS.slice(0, 4)]

export default function HelpPage() {
  return (
    <>
      <div className="bg-primary py-16 text-center">
        <div className="max-w-container mx-auto px-6">
          <h1 className="font-head text-heading text-white mb-2 leading-none">Help Center</h1>
          <p className="text-white/40 text-span">How can we help you today?</p>
        </div>
      </div>

      <section className="py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {CATEGORIES.map((c, i) => (
              <div
                key={i}
                className="border border-border rounded-card p-6 text-center cursor-pointer transition-all hover:border-secondary hover:shadow-card"
              >
                <div className="w-14 h-14 bg-secondaryBg rounded-full flex items-center justify-center text-secondary mx-auto mb-3">
                  <c.Icon size={24} />
                </div>
                <h4 className="text-span font-bold text-primary mb-1">{c.title}</h4>
                <p className="text-label text-muted">{c.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="font-head text-heading text-primary text-center mb-8 mt-4 leading-none">
            Common Questions
          </h2>
          <FAQ items={COMBINED_FAQS} />
        </div>
      </section>
    </>
  )
}
