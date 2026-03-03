import { CreditCard, Smartphone, CalendarCheck, Check, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Badge = { Icon: LucideIcon; text: string }

const OVERLAY_BADGES: Badge[] = [
  { Icon: CreditCard,    text: 'Secure Payments' },
  { Icon: Smartphone,    text: 'Easy Booking' },
  { Icon: CalendarCheck, text: 'Flexible Scheduling' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-10 md:py-[60px] bg-secondaryBg">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-secondary rounded px-2 py-[2px] text-[11px] font-bold flex items-center gap-1">
                <Trophy size={11} className="text-primary" />
              </span>
              <span className="font-bold text-label">Why Choose Us</span>
            </div>
            <h2 className="text-muted mb-5">
              Travel in our luxurious Cars with expert drivers and customize your ride to fit your interests &amp; schedule.
            </h2>
            <div className="mt-3 mb-4">
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-[10px] text-[11px] font-semibold">
                Free Cancellation
              </span>
              <div className="font-bold text-span mt-[10px]">Fixed Price Guarantee</div>
              <div className="text-muted text-label mt-1">Comprehensive Services</div>
            </div>
          </div>

          {/* Image with badges */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/10216079/pexels-photo-10216079.jpeg"
              alt="Luxury car"
              className="w-full h-[360px] object-cover rounded-card-lg"
            />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-[10px]">
              {OVERLAY_BADGES.map((b, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[10px] px-[14px] py-[10px] text-[11px] font-semibold flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.1)] whitespace-nowrap"
                >
                  <b.Icon size={14} className="text-secondary flex-shrink-0" />
                  {b.text}
                  <Check size={12} className="text-secondary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
