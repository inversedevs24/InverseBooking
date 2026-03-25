import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'

interface Banner {
  id: number
  image: string
  to: string
  eyebrow: string
  headline: React.ReactNode
  sub: string
  cta: string
  dark: boolean
  ctaBg: string
  ctaText: string
  ringColor: string
  eyebrowColor?: string
}

//  Each `to` matches the ServiceKey in ServiceBookingForm 
const BANNERS: Banner[] = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/36377058/pexels-photo-36377058.jpeg',
    to: '/book?service=transfer',
    eyebrow: 'Private Transfer',
    headline: (
      <span className="font-head text-[24px] sm:text-[28px] font-bold leading-tight" style={{ color: '#0F172A' }}>
        Luxury Door-to-Door<br />Service
      </span>
    ),
    sub: 'Premium private transfers with professional chauffeurs.',
    cta: 'Book Private Transfer',
    dark: false,
    ctaBg: '#0f4c3e',
    ctaText: '#ffffff',
    ringColor: '#0f766e',
    eyebrowColor: '#0f766e',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/28350362/pexels-photo-28350362.jpeg',
    to: '/book?service=city-to-city',
    eyebrow: 'City to City',
    headline: (
      <span className="font-head text-[24px] sm:text-[28px] font-bold text-white leading-tight">
        Seamless<br />Intercity Travel
      </span>
    ),
    sub: 'Comfortable transfers between cities with premium vehicles.',
    cta: 'Book Intercity',
    dark: true,
    ctaBg: '#2d9c84',
    ctaText: '#ffffff',
    ringColor: '#2d9c84',
    eyebrowColor: '#6ee7d8',
  },
  {
    id: 3,
    image: 'https://assets.grab.com/wp-content/uploads/sites/41/2023/03/15073057/Grab-Airport_rev20-1-17.jpg',
    to: '/book?service=airport',
    eyebrow: 'Airport Rides',
    headline: (
      <span className="font-head text-[24px] sm:text-[28px] font-bold text-white leading-tight">
        On Time.<br />Every Time.
      </span>
    ),
    sub: 'Stress-free airport pickups & drop-offs with flight tracking.',
    cta: 'Book Airport Ride',
    dark: true,
    ctaBg: '#1e3a5f',
    ctaText: '#ffffff',
    ringColor: '#334e80',
    eyebrowColor: '#93b4d8',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/3769312/pexels-photo-3769312.jpeg',
    to: '/book?service=city-tour',
    eyebrow: 'City Tour',
    headline: (
      <span className="font-head text-[24px] sm:text-[28px] font-bold leading-tight" style={{ color: '#0F172A' }}>
        Explore the City<br />In Style
      </span>
    ),
    sub: 'Personalized city tours with expert chauffeur guides.',
    cta: 'Book City Tour',
    dark: false,
    ctaBg: '#0f4c3e',
    ctaText: '#ffffff',
    ringColor: '#1a6b5a',
    eyebrowColor: '#1a6b5a',
  },
  {
    id: 5,
    image: 'https://cdn.prod.website-files.com/656e39bd8b07a811ace24224/656e39bd8b07a811ace2462a_falt.webp',
    to: '/book?service=hourly',
    eyebrow: 'Hourly Hire',
    headline: (
      <span className="font-head text-[24px] sm:text-[28px] font-bold text-white leading-tight">
        Your Car.<br />Your Time.
      </span>
    ),
    sub: 'Flexible hourly rentals, pay only for what you use.',
    cta: 'Book Hourly',
    dark: true,
    ctaBg: '#0f766e',
    ctaText: '#ffffff',
    ringColor: '#0f766e',
    eyebrowColor: '#5ecfc6',
  },
  {
    id: 6,
    image: 'https://images.pexels.com/photos/5604852/pexels-photo-5604852.jpeg',
    to: '/book?service=desert-safari',
    eyebrow: 'Desert Safari',
    headline: (
      <span className="font-head text-[24px] sm:text-[28px] font-bold leading-tight" style={{ color: '#0F172A' }}>
        Desert Adventure<br />Awaits
      </span>
    ),
    sub: 'Experience thrilling dunes & desert adventures in luxury.',
    cta: 'Book Safari',
    dark: false,
    ctaBg: '#475569',
    ctaText: '#ffffff',
    ringColor: '#64748b',
    eyebrowColor: '#475569',
  },
]

export default function PromoBanners() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products, initialized } = useAppSelector(s => s.shopify)

  console.log("products",products);
  

  useEffect(() => {
    dispatch(fetchTaxiProducts())
  }, [dispatch])

  const activeTypes = new Set(products.map(p => p.serviceType).filter(Boolean))

  // Once loaded, show only banners whose service type exists in Shopify; before that show all
  const visibleBanners = initialized && activeTypes.size > 0
    ? BANNERS.filter(b => activeTypes.has(b.eyebrow))
    : BANNERS

  return (
    <div className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">

        <style>{`
          .promo-swiper .swiper-slide {
            height: clamp(200px, 15vw, 360px) !important;
          }
          .promo-swiper .swiper-wrapper {
            align-items: stretch;
          }
          .promo-swiper .swiper-pagination {
            bottom: 0px;
            display: flex;
            justify-content: center;
            gap: 8px;
          }
          .promo-swiper .swiper-pagination-bullet {
            width: 8px; height: 8px;
            border-radius: 9999px;
            background: rgba(15,23,42,0.3);
            opacity: 1;
            transition: all 0.3s;
            cursor: pointer;
            border: none;
          }
          .promo-swiper .swiper-pagination-bullet-active {
            width: 24px;
            background: #0F172A;
          }
          .promo-swiper .swiper-pagination-bullet:hover {
            background: rgba(15,23,42,0.6);
          }
        `}</style>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 16 } }}
          autoplay={{ delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          loop
          className="promo-swiper !pb-8"
        >
          {visibleBanners.map(b => (
            <SwiperSlide key={b.id}>
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group shadow-lg transition-shadow hover:shadow-xl"
                style={{ backgroundColor: b.dark ? '#0F172A' : '#E8F0EF' }}
                onClick={() => navigate(b.to)}
                role="button"
                tabIndex={0}
                aria-label={b.cta}
                onKeyDown={e => e.key === 'Enter' && navigate(b.to)}
              >
                {/* Background image — right-aligned, fades left */}
                <img
                  src={b.image}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="absolute top-0 right-0 h-full w-[62%] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Gradient fade */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: b.dark
                      ? 'linear-gradient(90deg, #0F172A 0%, #0F172A 40%, rgba(15,23,42,0.7) 60%, rgba(15,23,42,0.2) 100%)'
                      : 'linear-gradient(90deg, #E8F0EF 0%, #E8F0EF 40%, rgba(232,240,239,0.8) 60%, rgba(232,240,239,0.1) 100%)',
                  }}
                />

                {/* Decorative rings — top-left + bottom-left */}
                <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full pointer-events-none"
                  style={{ backgroundColor: b.ringColor, opacity: b.dark ? 0.50 : 0.42 }} />
                <div className="absolute -top-1 left-10 w-20 h-20 rounded-full pointer-events-none"
                  style={{ backgroundColor: b.ringColor, opacity: b.dark ? 0.35 : 0.28 }} />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
                  style={{ backgroundColor: b.ringColor, opacity: b.dark ? 0.50 : 0.42 }} />
                <div className="absolute -bottom-1 left-14 w-24 h-24 rounded-full pointer-events-none"
                  style={{ backgroundColor: b.ringColor, opacity: b.dark ? 0.32 : 0.26 }} />

                {/* Content — vertically centered */}
                <div className="relative z-10 h-full flex flex-col justify-center px-5 py-5 max-w-[55%] min-w-0 gap-3">
                  {/* Eyebrow */}
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider truncate"
                    style={{ color: b.eyebrowColor ?? (b.dark ? '#a7c8c2' : '#0f766e') }}
                  >
                    {b.eyebrow}
                  </p>

                  {/* Headline */}
                  <div className="min-w-0">{b.headline}</div>

                  {/* Sub */}
                  <p
                    className="text-[12px] font-body leading-relaxed line-clamp-2"
                    style={{ color: b.dark ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.65)' }}
                  >
                    {b.sub}
                  </p>
                  
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  )
}
