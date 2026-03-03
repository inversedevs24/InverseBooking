import { useNavigate } from 'react-router-dom'
import { Car, UserCheck, Compass, Landmark, CalendarDays, Wifi, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type OfferItem  = { Icon: LucideIcon; title: string; desc: string }
type WhyCard    = { Icon: LucideIcon; title: string; desc: string }

const OFFERS: OfferItem[] = [
  { Icon: Car,       title: 'Transfers: Fixed-point rides (e.g., airport, hotel, intercity)',      desc: 'Point-to-point rides suitable for airport transfers, city transport, and intercity travel. Includes 15 minutes free waiting for standard pickups and 60 minutes for airport pickups.' },
  { Icon: UserCheck, title: 'Hourly Chauffeur: Time-based vehicle hire with a professional driver', desc: 'Hire a vehicle with a professional driver based on time. Suitable for errands, business meetings, or events.' },
  { Icon: Compass,   title: 'Desert Safari',                                                        desc: "Enjoy the thrill of the UAE's desert with our exciting safari packages. From dune bashing to traditional Bedouin camps, experience the magic of the Arabian desert." },
  { Icon: Landmark,  title: 'City Tours',                                                            desc: "Discover UAE's culture and landmarks with our guided city tours. Explore Dubai's skyscrapers, Abu Dhabi's heritage sites, and more." },
]

const WHY_CARDS: WhyCard[] = [
  { Icon: CalendarDays, title: 'Flexible Booking',        desc: "Book your ride anytime — instantly or in advance. We're available 24/7 for your convenience." },
  { Icon: UserCheck,    title: 'Professional Chauffeurs', desc: 'All our drivers are trained, polite, and experienced to make your ride safe and comfortable.' },
  { Icon: Wifi,         title: 'Free Wi-Fi & Water',       desc: 'Stay connected and refreshed during your journey. Complimentary Wi-Fi and bottled water in every ride.' },
  { Icon: Car,          title: 'Multiple Ride Options',    desc: 'From airport transfers to hourly chauffeurs — choose the service that suits your needs.' },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero */}
      <section className="py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[60px] items-center">
            <div>
              <h1 className="font-head text-heading mb-4">Welcome to InverseRide</h1>
              <p className="text-muted text-span mb-[14px] leading-[1.7]">Your trusted platform for smooth and reliable travel experiences in the UAE.</p>
              <p className="text-muted text-span mb-[14px] leading-[1.7]">We specialize in providing premium ride services, including city, airport, and intercity transfers, along with hourly chauffeur services.</p>
              <p className="text-muted text-span mb-[14px] leading-[1.7]">In the UAE, we also offer exclusive Desert Safari and City Tour experiences.</p>
              <p className="text-muted text-span mb-[14px] leading-[1.7]">Whether you're a resident or a visitor, InverseRide is here to make every ride easy, comfortable, and stress-free.</p>
              <div className="mt-5 flex items-center gap-[10px] flex-wrap">
                <span className="text-secondary font-bold text-label flex items-center gap-1">
                  <ShieldCheck size={14} /> Secure Payments
                </span>
                <div className="flex gap-[5px] flex-wrap">
                  {['GPay', 'VISA', 'AMEX', 'MC', 'Stripe', 'APay'].map((p, i) => (
                    <div key={i} className="bg-secondaryBg rounded px-[6px] py-[2px] text-[10px] font-bold">{p}</div>
                  ))}
                </div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
              alt="Happy riders"
              className="w-full h-[360px] object-cover rounded-card-lg"
            />
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-10 md:py-[60px] bg-secondaryBg">
        <div className="max-w-container mx-auto px-6">
          <h2 className="font-head text-heading text-primary text-center mb-10">What We Offer</h2>
          <div className="flex flex-col gap-6 max-w-[700px] mx-auto">
            {OFFERS.map((item, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="w-[52px] h-[52px] bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <item.Icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-span mb-1">{item.title}</h4>
                  <span className="inline-block bg-secondary/10 text-secondary text-[11px] font-semibold px-[10px] py-[2px] rounded-[10px] mb-2">
                    ● Available in UAE &amp; UK
                  </span>
                  <p className="text-muted text-label">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <h2 className="font-head text-heading text-primary text-center mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CARDS.map((c, i) => (
              <div key={i} className="text-center py-7 px-5">
                <div className="w-16 h-16 bg-secondaryBg rounded-full flex items-center justify-center text-secondary mx-auto mb-4">
                  <c.Icon size={28} />
                </div>
                <h4 className="font-bold text-span mb-2">{c.title}</h4>
                <p className="text-muted text-label">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <div className="bg-secondaryBg py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[60px] items-center">
            <img
              src="https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?w=600&q=80"
              alt="Our Commitment"
              className="w-full h-[360px] object-cover rounded-card-lg"
            />
            <div>
              <h2 className="font-head text-title mb-4">Our Commitment</h2>
              <p className="text-muted text-span leading-[1.7] mb-4">
                At InverseRide, we're committed to giving you a smooth, safe, and comfortable travel experience — every time you ride with us.
              </p>
              <p className="text-muted text-span leading-[1.7] mb-6">
                Thank you for choosing InverseRide. We're here to make every ride simple, safe, and memorable.
              </p>
              <button
                className="bg-primary text-white border-none rounded-lg px-7 py-3 font-semibold text-label cursor-pointer font-body transition-colors hover:bg-secondary"
                onClick={() => navigate('/signin')}
              >
                Book with us
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
