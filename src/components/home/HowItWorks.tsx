import { CalendarDays, User, Navigation2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Step = { Icon: LucideIcon; title: string; desc: string }

const STEPS: Step[] = [
  {
    Icon:  CalendarDays,
    title: 'Book Your Chauffeur Online',
    desc:  'Enter your pickup details, choose your vehicle, and customise your ride. Cancel or change up to 24 hours before pickup.',
  },
  {
    Icon:  User,
    title: 'Meet Your Driver',
    desc:  "Your driver will be waiting at the meeting point with a signboard — tracking your flight even if it's delayed.",
  },
  {
    Icon:  Navigation2,
    title: 'Enjoy a Comfortable Ride',
    desc:  'Skip the queues and crowded transport. We get you to your destination on time, stress-free.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">

        <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2 text-center">
          Simple Process
        </p>
        <h2 className="font-head text-heading text-primary text-center leading-none mb-3">
          Go Anywhere, Anytime
        </h2>
        <p className="text-center text-[14px] text-muted font-body mb-10 max-w-[420px] mx-auto">
          Instant booking, smooth travel — no delays, no hassle.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.07)]" >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-primary flex-shrink-0"
                  style={{ backgroundColor: '#BDD9BF' }}
                >
                  <s.Icon size={17} />
                </div>
                <h4 className="text-[15px] font-bold font-head text-primary leading-tight">{s.title}</h4>
              </div>
              <p className="text-[13px] text-muted font-body leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
