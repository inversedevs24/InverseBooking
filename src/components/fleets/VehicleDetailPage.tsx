import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Users, Luggage, Star, Check, ArrowRight,
  Car, AlertCircle, Loader2, ChevronLeft as PrevIcon, ChevronRight as NextIcon,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import { SERVICE_ROUTE_MAP } from '../../data'
import type { TaxiOption } from '../../types'

// ─── Image Gallery ─────────────────────────────────────────────────────────────

function ImageGallery({ vehicle }: { vehicle: TaxiOption }) {
  const extraImages = vehicle.images.length > 0
    ? vehicle.images
    : vehicle.image
      ? [vehicle.image]
      : []

  const [active, setActive] = useState(0)

  const prev = () => setActive(i => (i - 1 + extraImages.length) % extraImages.length)
  const next = () => setActive(i => (i + 1) % extraImages.length)

  if (extraImages.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center rounded-[20px]"
        style={{ height: 320, backgroundColor: '#EAF0EA' }}
      >
        <Car size={64} style={{ color: '#BDD9BF' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative w-full overflow-hidden rounded-[20px]"
        style={{ backgroundColor: '#EAF0EA', aspectRatio: '16/9' }}
      >
        <img
          key={active}
          src={extraImages[active]}
          alt={`${vehicle.name} - image ${active + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: 1 }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(46,64,82,0.35) 0%, transparent 50%)' }}
        />

        {/* Navigation arrows — only if multiple images */}
        {extraImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)', color: '#2E4052' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.88)' }}
              aria-label="Previous image"
            >
              <PrevIcon size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)', color: '#2E4052' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.88)' }}
              aria-label="Next image"
            >
              <NextIcon size={16} />
            </button>
          </>
        )}

        {/* Counter pill */}
        {extraImages.length > 1 && (
          <div
            className="absolute bottom-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(46,64,82,0.72)', color: '#fff', backdropFilter: 'blur(4px)' }}
          >
            {active + 1} / {extraImages.length}
          </div>
        )}

        {/* Badges */}
        {vehicle.popular && (
          <div
            className="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-[5px] rounded-full"
            style={{ backgroundColor: '#FFC857', color: '#2E4052' }}
          >
            Popular
          </div>
        )}
        {vehicle.rating > 0 && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}
          >
            <Star size={11} fill="#FFC857" stroke="none" />
            <span className="text-[11px] font-bold font-body" style={{ color: '#2E4052' }}>
              {vehicle.rating.toFixed(1)}
              {vehicle.reviews > 0 && (
                <span className="font-normal" style={{ color: 'rgba(46,64,82,0.55)' }}> ({vehicle.reviews})</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {extraImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {extraImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer p-0"
              style={{
                width: 72,
                height: 52,
                borderColor: active === i ? '#2E4052' : 'transparent',
                backgroundColor: '#EAF0EA',
                outline: 'none',
              }}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Spec Pill ─────────────────────────────────────────────────────────────────

function SpecPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold font-body"
      style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
    >
      {icon}
      {label}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products, loading, error } = useAppSelector(s => s.shopify)

  useEffect(() => {
    dispatch(fetchTaxiProducts())
  }, [dispatch])

  const vehicle: TaxiOption | undefined = products.find(p => String(p.id) === id)
  const bookRoute = vehicle ? (SERVICE_ROUTE_MAP[vehicle.serviceType] ?? '/book?service=transfer') : '/fleet'

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center font-body" style={{ backgroundColor: '#F0F5F0' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#2E4052' }} />
      </div>
    )
  }

  // ── Error ──
  if (!loading && error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 font-body" style={{ backgroundColor: '#F0F5F0' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <p className="text-[15px] font-bold font-head" style={{ color: '#2E4052' }}>Could not load vehicle</p>
        <button
          onClick={() => navigate('/fleet')}
          className="text-[13px] font-bold px-6 py-2.5 rounded-xl text-white border-none cursor-pointer"
          style={{ backgroundColor: '#2E4052' }}
        >
          Back to Fleet
        </button>
      </div>
    )
  }

  // ── Not found ──
  if (!loading && !vehicle) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 font-body" style={{ backgroundColor: '#F0F5F0' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#F0F5F0' }}>
          <Car size={28} style={{ color: '#BDD9BF' }} />
        </div>
        <p className="text-[15px] font-bold font-head" style={{ color: '#2E4052' }}>Vehicle not found</p>
        <button
          onClick={() => navigate('/fleet')}
          className="text-[13px] font-bold px-6 py-2.5 rounded-xl text-white border-none cursor-pointer"
          style={{ backgroundColor: '#2E4052' }}
        >
          Back to Fleet
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh font-body" style={{ backgroundColor: '#F0F5F0' }}>

      {/* ── Sticky header ── */}
      <div
        className="sticky top-0 z-20 border-b"
        style={{
          backgroundColor: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: 'rgba(46,64,82,0.07)',
          boxShadow: '0 1px 16px rgba(46,64,82,0.06)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate('/fleet')}
            className="flex items-center gap-1 text-[12px] font-semibold rounded-xl px-2.5 py-1.5 transition-all duration-150 cursor-pointer border-none flex-shrink-0"
            style={{ color: 'rgba(46,64,82,0.55)', backgroundColor: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F5F0'; e.currentTarget.style.color = '#2E4052' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(46,64,82,0.55)' }}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Our Fleet</span>
          </button>

          <div className="w-px h-5 flex-shrink-0" style={{ backgroundColor: 'rgba(46,64,82,0.1)' }} />

          <div className="flex-1 min-w-0">
            <h1 className="font-head font-bold text-[15px] sm:text-[16px] truncate" style={{ color: '#2E4052' }}>
              {vehicle!.name}
            </h1>
            {vehicle!.vehicleType && (
              <p className="text-[11px] truncate hidden sm:block" style={{ color: 'rgba(46,64,82,0.45)' }}>
                {vehicle!.vehicleType}
              </p>
            )}
          </div>

          {vehicle!.serviceType && (
            <span
              className="hidden sm:block text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex-shrink-0 font-body"
              style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
            >
              {vehicle!.serviceType}
            </span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* ── Left column: Gallery + Features ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Gallery */}
            <ImageGallery vehicle={vehicle!} />

            {/* Features card */}
            {vehicle!.features.length > 0 && (
              <div
                className="bg-white rounded-[20px] p-5 sm:p-6"
                style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.08)' }}
              >
                <p
                  className="text-[10px] font-extrabold uppercase tracking-widest mb-4 font-body"
                  style={{ color: 'rgba(46,64,82,0.4)' }}
                >
                  Features & Amenities
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {vehicle!.features.map(f => (
                    <span
                      key={f}
                      className="flex items-center gap-2.5 text-[13px] font-medium font-body"
                      style={{ color: '#2E4052' }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#BDD9BF' }}
                      >
                        <Check size={11} strokeWidth={2.5} style={{ color: '#2E4052' }} />
                      </span>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description card */}
            {vehicle!.description && (
              <div
                className="bg-white rounded-[20px] p-5 sm:p-6"
                style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.08)' }}
              >
                <p
                  className="text-[10px] font-extrabold uppercase tracking-widest mb-3 font-body"
                  style={{ color: 'rgba(46,64,82,0.4)' }}
                >
                  About This Vehicle
                </p>
                <p className="text-[14px] leading-relaxed font-body" style={{ color: '#5A6775' }}>
                  {vehicle!.description}
                </p>
              </div>
            )}
          </div>

          {/* ── Right column: Sticky info card ── */}
          <div className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-[80px] flex flex-col gap-4">

            {/* Main info card */}
            <div
              className="bg-white rounded-[20px] overflow-hidden"
              style={{ boxShadow: '0 4px 24px rgba(46,64,82,0.1)' }}
            >
              {/* Header band */}
              <div
                className="px-5 py-4"
                style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}
              >
                <p className="text-[10px] font-extrabold uppercase tracking-widest mb-1 font-body" style={{ color: '#BDD9BF' }}>
                  {vehicle!.serviceType || 'Vehicle Details'}
                </p>
                <h2 className="font-head font-bold text-[20px] text-white leading-tight">{vehicle!.name}</h2>
                {vehicle!.vehicleType && (
                  <p className="text-[12px] mt-0.5 font-body" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {vehicle!.vehicleType}
                  </p>
                )}
              </div>

              <div className="p-5 flex flex-col gap-4">

                {/* Specs */}
                <div className="flex flex-wrap gap-2">
                  <SpecPill icon={<Users size={14} style={{ color: '#2E4052' }} />} label={`${vehicle!.passengers} Passengers`} />
                  <SpecPill icon={<Luggage size={14} style={{ color: '#2E4052' }} />} label={`${vehicle!.luggage} Bags`} />
                  {vehicle!.rating > 0 && (
                    <SpecPill
                      icon={<Star size={13} fill="#FFC857" stroke="none" />}
                      label={`${vehicle!.rating.toFixed(1)} Rating`}
                    />
                  )}
                </div>

                {/* Divider */}
                <div className="border-t" style={{ borderColor: 'rgba(46,64,82,0.08)' }} />

                {/* ETA */}
                {vehicle!.estimatedArrival && (
                  <p className="text-[12px] font-body" style={{ color: '#6B7A8A' }}>
                    Estimated arrival: <span className="font-semibold" style={{ color: '#2E4052' }}>{vehicle!.estimatedArrival}</span>
                  </p>
                )}

                {/* Divider */}
                <div className="border-t" style={{ borderColor: 'rgba(46,64,82,0.08)' }} />

                {/* CTA buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => navigate(bookRoute)}
                    className="w-full flex items-center justify-center gap-2 text-[14px] font-bold py-3.5 rounded-xl border-none cursor-pointer text-white transition-all duration-200"
                    style={{ backgroundColor: '#2E4052' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3A5268' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2E4052' }}
                  >
                    Book Now
                    <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => navigate('/fleet')}
                    className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-3 rounded-xl border-none cursor-pointer transition-all duration-200"
                    style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E2EBE3' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F0F5F0' }}
                  >
                    View All Vehicles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
