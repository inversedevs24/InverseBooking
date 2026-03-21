import { useNavigate } from 'react-router-dom'
import { Car, Building2, PlaneLanding, MapPinned, Clock3, Sunset } from 'lucide-react'

const SERVICES = [
  {
    Icon: Car,
    label: 'Private Transfer',
    sub: 'Door-to-door rides with a professional chauffeur at a fixed, transparent price.',
    to: '/book?service=transfer',
  },
  {
    Icon: Building2,
    label: 'City to City',
    sub: 'Comfortable intercity journeys between Dubai, Abu Dhabi, Sharjah and beyond.',
    to: '/book?service=city-to-city',
  },
  {
    Icon: PlaneLanding,
    label: 'Airport Rides',
    sub: 'Meet & greet, real-time flight tracking, and free waiting time — stress-free every time.',
    to: '/book?service=airport',
  },
  {
    Icon: MapPinned,
    label: 'City Tour',
    sub: 'Explore iconic landmarks at your own pace with a knowledgeable private chauffeur.',
    to: '/book?service=city-tour',
  },
  {
    Icon: Clock3,
    label: 'Hourly Hire',
    sub: 'Book a chauffeur by the hour — perfect for business meetings, events or errands.',
    to: '/book?service=hourly',
  },
  {
    Icon: Sunset,
    label: 'Desert Safari',
    sub: 'Luxury transfers to the dunes and back — sunrise or sunset, in total comfort.',
    to: '/book?service=desert-safari',
  },
]

export default function FeaturesBar() {
  const navigate = useNavigate()

  return (
    <section className="py-10 md:py-[20px]">
      <div className="max-w-container mx-auto px-6">

        <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2 text-center">
          What We Offer
        </p>
        <h2 className="font-head text-heading text-primary text-center leading-none mb-10">
          Our Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(({ Icon, label, sub, to }) => (
            <div
              key={label}
              onClick={() => navigate(to)}
              className="group bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)] flex items-start gap-4 cursor-pointer transition-all hover:-translate-y-[3px] hover:shadow-[0_6px_20px_rgba(15,23,42,0.11)] hover:border-secondary border border-transparent"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary"
                style={{ backgroundColor: '#d5e0de' }}
              >
                <Icon
                  size={20}
                  className="transition-colors group-hover:text-white"
                  style={{ color: '#0f766e' }}
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-[15px] font-bold font-head text-primary leading-tight">{label}</h4>
                <p className="text-[13px] text-muted font-body mt-1 leading-snug">{sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
