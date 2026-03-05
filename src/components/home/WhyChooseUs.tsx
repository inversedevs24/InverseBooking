import { ShieldCheck, RotateCcw, Award, Headphones, CreditCard, Smartphone, CalendarCheck, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Reason = { Icon: LucideIcon; title: string; sub: string }
type Badge  = { Icon: LucideIcon; text: string }

const REASONS: Reason[] = [
  { Icon: ShieldCheck,  title: 'Fixed Price Guarantee',  sub: 'No hidden fees or surge pricing — ever.'          },
  { Icon: RotateCcw,    title: 'Free Cancellation',       sub: 'Cancel up to 24 hours before, no charge.'        },
  { Icon: Award,        title: 'Licensed Chauffeurs',     sub: 'Vetted, professional drivers you can trust.'      },
  { Icon: Headphones,   title: '24/7 Support',            sub: 'Our team is available around the clock for you.'  },
]

const BADGES: Badge[] = [
  { Icon: CreditCard,    text: 'Secure Payments'      },
  { Icon: Smartphone,    text: 'Easy Booking'         },
  { Icon: CalendarCheck, text: 'Flexible Scheduling'  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-10 md:py-[60px]" style={{ backgroundColor: '#d5e0de' }}>
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* Left — text + reason cards */}
          <div>
            <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">
              Why Choose Us
            </p>
            <h2 className="font-head text-heading text-primary leading-none mb-3">
              The Smarter Way to Ride
            </h2>
            <p className="text-[14px] text-muted font-body leading-relaxed mb-7">
              Travel in luxury with expert drivers who adapt to your schedule — every ride guaranteed to be smooth, safe, and on time.
            </p>

            <div className="flex flex-col gap-2">
              {REASONS.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary flex-shrink-0"
                    style={{ backgroundColor: '#e8eeec' }}
                  >
                    <r.Icon size={17} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold font-head text-primary leading-tight">{r.title}</div>
                    <div className="text-[12px] text-muted font-body mt-[2px]">{r.sub}</div>
                  </div>
                  <Check size={14} className="text-secondary ml-auto flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Right — image with floating badge chips */}
          <div className="relative rounded-2xl overflow-hidden min-h-[300px]">
            <img
              src="https://images.pexels.com/photos/10216079/pexels-photo-10216079.jpeg"
              alt="Luxury car"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Bottom gradient for badge readability */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.72) 0%, transparent 55%)' }}
            />
            {/* Floating badge pills */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {BADGES.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-[12px] font-semibold text-primary flex-shrink-0"
                >
                  <b.Icon size={13} className="text-secondary flex-shrink-0" />
                  {b.text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
