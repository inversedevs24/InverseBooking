import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import FleetCard from '../ui/FleetCard'
import { FLEET_HOME, TRUST_BADGES } from '../../data'

export default function FleetSection() {
  const navigate = useNavigate()

  return (
    <div className="py-10 md:py-[60px] overflow-hidden" style={{ backgroundColor: '#d5e0de' }}>
      <div className="max-w-container mx-auto px-6">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">World-Class Fleet</p>
            <h2 className="font-head text-heading text-primary leading-none mb-2">Our Fleet</h2>
            <p className="text-muted text-[14px] max-w-[360px] font-body">
              From Economy to Luxury — clean, comfortable cars for every ride.
            </p>
          </div>
          <button
            onClick={() => navigate('/fleet')}
            className="group relative overflow-hidden flex items-center gap-2 border-none text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors duration-300 self-start sm:self-auto flex-shrink-0"
            style={{ background: '#0F172A' }}
          >
            <span className="absolute inset-0 bg-secondary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10 flex items-center gap-2">
              View All Fleet
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </span>
          </button>
        </div>

        {/* Cards — Swiper carousel */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          className="pb-10"
        >
          {FLEET_HOME.map((car, i) => (
            <SwiperSlide key={i}>
              <FleetCard car={car} index={i} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Trust badges */}
        <div className="flex gap-2 flex-wrap mt-7">
          {TRUST_BADGES.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-white border border-[#c2ceca] text-primary/70 px-4 py-2 rounded-full text-[13px] font-medium"
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: b.color }} />
              {b.label}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
