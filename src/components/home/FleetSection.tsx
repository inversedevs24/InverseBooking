import { useNavigate } from 'react-router-dom'
import { ArrowRight, Users, Luggage } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { FLEET_HOME } from '../../data'
import type { FleetItem } from '../../types'

//  Inline FleetCard — matches AllFleets card style exactly 
function FleetCard({ car }: { car: FleetItem }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.07)] group hover:shadow-[0_6px_24px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-[155px] overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
        />
        {/* Type badge */}
        <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide backdrop-blur-sm">
          {car.name.split(' ')[0]}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-head text-[14px] font-bold text-slate-800 mb-2 leading-tight">{car.name}</h3>

        {/* Pax + luggage */}
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            <Users size={10} />{car.pax} pax
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            <Luggage size={10} />{car.lug} bags
          </span>
        </div>

        {/* Models sub-text */}
        <p className="text-[11px] text-slate-400 font-body leading-relaxed mb-3 line-clamp-2">{car.models}</p>

        {/* Divider + CTA */}
        <div className="border-t border-slate-100 mt-auto pt-3">
          <button
            onClick={() => navigate('/book?service=transfer')}
            className="w-full flex items-center justify-center gap-1.5 text-[12px] font-bold py-2 rounded-xl transition-all"
            style={{ backgroundColor: '#e8eeec', color: '#0f4c3e' }}
            onMouseEnter={e => {
              const b = e.currentTarget
              b.style.backgroundColor = '#0f4c3e'
              b.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              const b = e.currentTarget
              b.style.backgroundColor = '#e8eeec'
              b.style.color = '#0f4c3e'
            }}
          >
            Book Now <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

//  Main section 
export default function FleetSection() {
  const navigate = useNavigate()

  return (
    <div className="py-10 md:py-[60px] overflow-hidden" style={{ backgroundColor: '#d5e0de' }}>
      <div className="max-w-container mx-auto px-6">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-head text-heading text-primary leading-none mb-2">Our Fleet</h2>
            <p className="text-muted text-[14px] max-w-[360px] font-body">
              From Economy to Luxury — clean, comfortable cars for every ride.
            </p>
          </div>

          {/* View All button — keeps original wipe hover effect */}
          <button
            onClick={() => navigate('/fleet')}
            className="group relative overflow-hidden flex items-center gap-2 border-none text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors duration-300 self-start sm:self-auto flex-shrink-0"
            style={{ background: '#0F172A' }}
          >
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out rounded-full"
              style={{ backgroundColor: '#0f4c3e' }} />
            <span className="relative z-10 flex items-center gap-2">
              View All Fleet
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </span>
          </button>
        </div>

        {/* Swiper carousel */}
        <style>{`
          .fleet-swiper {
            touch-action: pan-y;
          }
          .fleet-swiper .swiper-pagination-bullet {
            background: rgba(15,23,42,0.25);
            opacity: 1;
            transition: all 0.3s;
          }
          .fleet-swiper .swiper-pagination-bullet-active {
            background: #0f172a;
            width: 18px;
            border-radius: 9999px;
          }
        `}</style>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 1.8 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          grabCursor
          touchEventsTarget="container"
          touchStartPreventDefault={false}
          simulateTouch
          allowTouchMove
          className="fleet-swiper !pb-9"
        >
          {FLEET_HOME.map((car, i) => (
            <SwiperSlide key={i} className="h-auto">
              <FleetCard car={car} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
