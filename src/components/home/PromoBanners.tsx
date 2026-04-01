import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts, fetchServiceImages } from '../../store/slices/shopifySlice'
import { SERVICE_ROUTE_MAP } from '../../data'

// Visual design per service type — purely frontend styling, not content
const BANNER_DARK_SET = new Set([
  'City to City',
  'Airport Rides',
  'Hourly Hire',
])

const RING_COLOR = '#FFC857'
const CTA_BG = '#2E4052'

// Maps serviceType → key in the "services" Shopify collection (for fallback images)
const SERVICE_COLLECTION_KEY: Record<string, string> = {
  'Private Transfer': 'private_transfer',
  'City to City':     'city_to_city',
  'Airport Rides':    'airport_rides',
  'City Tour':        'city_tour',
  'Hourly Hire':      'hourly_hire',
  'Desert Safari':    'desert_safari',
  'Hourly Chauffeur': 'hourly_chauffeur',
}

export default function PromoBanners() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products, initialized, serviceImages, serviceImagesInitialized } = useAppSelector(s => s.shopify)

  useEffect(() => {
    dispatch(fetchTaxiProducts())
    dispatch(fetchServiceImages())
  }, [dispatch])

  // One slide per unique serviceType — first product wins for image/headline/sub
  const seen = new Set<string>()
  const slides = products
    .filter(p => {
      if (!p.serviceType || seen.has(p.serviceType)) return false
      seen.add(p.serviceType)
      return true
    })
    .map(p => {
      const dark = BANNER_DARK_SET.has(p.serviceType)
      const key = SERVICE_COLLECTION_KEY[p.serviceType]
      const image =
        p.bannerImage ||
        (serviceImagesInitialized && key ? serviceImages[key] : '') ||
        ''
      return {
        serviceType: p.serviceType,
        image,
        to: SERVICE_ROUTE_MAP[p.serviceType] ?? '/book',
        headline: p.bannerHeadline,
        sub: p.bannerSub,
        dark,
      }
    })

  if (!initialized || slides.length === 0) return null

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
            background: rgba(46,64,82,0.3);
            opacity: 1;
            transition: all 0.3s;
            cursor: pointer;
            border: none;
          }
          .promo-swiper .swiper-pagination-bullet-active {
            width: 24px;
            background: #2E4052;
          }
          .promo-swiper .swiper-pagination-bullet:hover {
            background: rgba(46,64,82,0.6);
          }
        `}</style>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 16 } }}
          autoplay={{ delay: 1200, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          loop
          className="promo-swiper !pb-8"
        >
          {slides.map(b => (
            <SwiperSlide key={b.serviceType}>
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group shadow-lg transition-shadow hover:shadow-xl"
                style={{ backgroundColor: b.dark ? CTA_BG : '#EAF0EA' }}
                onClick={() => navigate(b.to)}
                role="button"
                tabIndex={0}
                aria-label={`Book ${b.serviceType}`}
                onKeyDown={e => e.key === 'Enter' && navigate(b.to)}
              >
                {/* Background image — right-aligned, fades left */}
                {b.image && (
                  <img
                    src={b.image}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="absolute top-0 right-0 h-full w-[62%] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
                {/* Gradient fade */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: b.dark
                      ? `linear-gradient(90deg, ${CTA_BG} 0%, ${CTA_BG} 40%, rgba(46,64,82,0.7) 60%, rgba(46,64,82,0.2) 100%)`
                      : 'linear-gradient(90deg, #EAF0EA 0%, #EAF0EA 40%, rgba(234,240,234,0.8) 60%, rgba(234,240,234,0.1) 100%)',
                  }}
                />

                {/* Decorative rings */}
                <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full pointer-events-none"
                  style={{ backgroundColor: RING_COLOR, opacity: b.dark ? 0.50 : 0.42 }} />
                <div className="absolute -top-1 left-10 w-20 h-20 rounded-full pointer-events-none"
                  style={{ backgroundColor: RING_COLOR, opacity: b.dark ? 0.35 : 0.28 }} />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
                  style={{ backgroundColor: RING_COLOR, opacity: b.dark ? 0.50 : 0.42 }} />
                <div className="absolute -bottom-1 left-14 w-24 h-24 rounded-full pointer-events-none"
                  style={{ backgroundColor: RING_COLOR, opacity: b.dark ? 0.32 : 0.26 }} />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center px-5 py-5 max-w-[55%] min-w-0 gap-3">
                  {/* Eyebrow */}
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider truncate"
                    style={{ color: b.dark ? '#BDD9BF' : CTA_BG }}
                  >
                    {b.serviceType}
                  </p>

                  {/* Headline — supports newlines from Shopify multi_line_text_field */}
                  {b.headline && (
                    <span
                      className="font-head text-[24px] sm:text-[28px] font-bold leading-tight"
                      style={{ color: b.dark ? '#ffffff' : CTA_BG, whiteSpace: 'pre-line' }}
                    >
                      {b.headline}
                    </span>
                  )}

                  {/* Sub */}
                  {b.sub && (
                    <p
                      className="text-[12px] font-body leading-relaxed line-clamp-2"
                      style={{ color: b.dark ? 'rgba(255,255,255,0.7)' : 'rgba(46,64,82,0.65)' }}
                    >
                      {b.sub}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  )
}
