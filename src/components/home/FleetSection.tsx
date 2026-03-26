import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Users, Luggage, Loader2 } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import type { TaxiOption } from '../../types'

const SERVICE_ROUTE_MAP: Record<string, string> = {
  'Private Transfer': '/book?service=transfer',
  'City to City':     '/book?service=city-to-city',
  'Airport Rides':    '/book?service=airport',
  'City Tour':        '/book?service=city-tour',
  'Hourly Hire':      '/book?service=hourly',
  'Desert Safari':    '/book?service=desert-safari',
}

// ─── Internal Fleet Card ──────────────────────────────────────────────────────

function FleetCard({ car }: { car: TaxiOption }) {
  const navigate = useNavigate()
  const bookRoute = SERVICE_ROUTE_MAP[car.serviceType] ?? '/book?service=transfer'

  return (
    <div
      onClick={() => navigate(bookRoute)}
      className="group bg-white rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
      style={{ boxShadow: '0 4px 20px rgba(46,64,82,0.09)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(46,64,82,0.17)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(46,64,82,0.09)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '185px', backgroundColor: '#F0F5F0' }}>
        {car.image ? (
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users size={32} className="text-slate-300" />
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(46,64,82,0.72) 0%, rgba(46,64,82,0.1) 48%, transparent 100%)' }}
        />

        {/* Service type badge */}
        {car.serviceType && (
          <div
            className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-[5px] rounded-full"
            style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
          >
            {car.serviceType}
          </div>
        )}

        {/* Name on image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8">
          <h3 className="font-head text-[15px] font-bold text-white leading-tight drop-shadow-sm">
            {car.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">

        {/* Specs */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
          >
            <Users size={10} /> {car.passengers} pax
          </span>
          <span
            className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
          >
            <Luggage size={10} /> {car.luggage} bags
          </span>
        </div>

        {/* Vehicle sub-type */}
        {(car.vehicleType || car.displayName) && (
          <p className="text-[11px] text-muted font-body leading-relaxed line-clamp-2 flex-1 mb-3">
            {car.vehicleType || car.displayName}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); navigate(bookRoute) }}
          className="w-full flex items-center justify-center gap-2 text-[12px] font-bold py-2.5 rounded-xl border-none cursor-pointer transition-all duration-300 mt-auto text-white"
          style={{ backgroundColor: '#2E4052' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3A5268' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2E4052' }}
        >
          Book Now <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FleetSection() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector(s => s.shopify)

  useEffect(() => {
    dispatch(fetchTaxiProducts())
  }, [dispatch])

  const display = products.slice(0, 6)

  return (
    <section className="py-10 md:py-[60px] bg-white overflow-hidden">
      <div className="max-w-container mx-auto px-6">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">
              Premium Vehicles
            </p>
            <h2 className="font-head text-heading text-primary leading-none mb-3">
              Our Fleet
            </h2>
            <p className="text-muted text-[14px] max-w-[380px] font-body leading-relaxed">
              From executive saloons to spacious coaches — every vehicle driven by a professional chauffeur.
            </p>
          </div>

          <button
            onClick={() => navigate('/fleet')}
            className="group relative overflow-hidden flex items-center gap-2 border-2 text-[13px] font-bold px-5 py-2.5 rounded-full transition-colors duration-300 self-start sm:self-auto flex-shrink-0 cursor-pointer"
            style={{ borderColor: '#2E4052', color: '#2E4052', backgroundColor: 'transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#2E4052'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#2E4052'
            }}
          >
            View All Fleet
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && products.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="animate-spin" style={{ color: '#2E4052' }} />
              <p className="text-[13px] text-muted font-body">Loading fleet…</p>
            </div>
          </div>
        )}

        {/* ── Swiper carousel ── */}
        {display.length > 0 && (
          <>
            <style>{`
              .fleet-swiper { touch-action: pan-y; }
              .fleet-swiper .swiper-slide { height: auto; }
              .fleet-swiper .swiper-wrapper { align-items: stretch; }
              .fleet-swiper .swiper-pagination {
                bottom: 0;
                display: flex;
                justify-content: center;
                gap: 6px;
              }
              .fleet-swiper .swiper-pagination-bullet {
                width: 8px; height: 8px;
                border-radius: 9999px;
                background: rgba(46,64,82,0.2);
                opacity: 1;
                transition: all 0.3s;
              }
              .fleet-swiper .swiper-pagination-bullet-active {
                width: 24px;
                background: #2E4052;
              }
              .fleet-swiper .swiper-pagination-bullet:hover {
                background: rgba(46,64,82,0.5);
              }
            `}</style>
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.15}
              breakpoints={{
                480: { slidesPerView: 1.6, spaceBetween: 16 },
                640: { slidesPerView: 2.1, spaceBetween: 16 },
                900: { slidesPerView: 2.8, spaceBetween: 20 },
                1024: { slidesPerView: 3.2, spaceBetween: 20 },
                1280: { slidesPerView: 4, spaceBetween: 20 },
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true }}
              grabCursor
              touchEventsTarget="container"
              touchStartPreventDefault={false}
              simulateTouch
              allowTouchMove
              className="fleet-swiper !pb-10"
            >
              {display.map(car => (
                <SwiperSlide key={car.id}>
                  <FleetCard car={car} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}

      </div>
    </section>
  )
}
