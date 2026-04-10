import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X, Users, Luggage, Star, Check, ArrowRight,
  Car, ChevronLeft, ChevronRight,
} from 'lucide-react'
import type { TaxiOption } from '../../types'

interface VehicleDetailModalProps {
  vehicle: TaxiOption
  onClose: () => void
  onSelect: () => void
}

// ─── Mini Image Gallery ────────────────────────────────────────────────────────

function ModalGallery({ vehicle }: { vehicle: TaxiOption }) {
  const images = vehicle.images.length > 0
    ? vehicle.images
    : vehicle.image
      ? [vehicle.image]
      : []

  const [active, setActive] = useState(0)

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActive(i => (i - 1 + images.length) % images.length)
  }
  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActive(i => (i + 1) % images.length)
  }

  if (images.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center flex-shrink-0"
        style={{ height: 200, backgroundColor: '#EAF0EA' }}
      >
        <Car size={48} style={{ color: '#BDD9BF' }} />
      </div>
    )
  }

  return (
    <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: 220, backgroundColor: '#EAF0EA' }}>
      <img
        key={active}
        src={images[active]}
        alt={`${vehicle.name} ${active + 1}`}
        className="w-full h-full object-cover"
      />

      {/* gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(46,64,82,0.4) 0%, transparent 50%)' }}
      />

      {/* nav arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(4px)', color: '#2E4052' }}
            aria-label="Previous"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(4px)', color: '#2E4052' }}
            aria-label="Next"
          >
            <ChevronRight size={15} />
          </button>

          {/* dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setActive(i) }}
                className="rounded-full border-none cursor-pointer p-0 transition-all duration-200"
                style={{
                  width: active === i ? 16 : 6,
                  height: 6,
                  backgroundColor: active === i ? '#FFC857' : 'rgba(255,255,255,0.6)',
                }}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* badges */}
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
          className="absolute top-3 right-12 flex items-center gap-1 rounded-full px-2.5 py-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}
        >
          <Star size={10} fill="#FFC857" stroke="none" />
          <span className="text-[11px] font-bold font-body" style={{ color: '#2E4052' }}>
            {vehicle.rating.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export default function VehicleDetailModal({ vehicle, onClose, onSelect }: VehicleDetailModalProps) {
  // Lock background scroll without layout shift
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = ''
      body.style.overflow = ''
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const modal = (
    // Backdrop
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(20,30,40,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full sm:w-[480px] overflow-hidden flex flex-col font-body rounded-t-[24px] sm:rounded-[24px]"
        style={{
          backgroundColor: '#fff',
          maxHeight: '92dvh',
          boxShadow: '0 -8px 48px rgba(46,64,82,0.22)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', color: '#2E4052' }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Gallery */}
        <ModalGallery vehicle={vehicle} />

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'none' }}>
          <div className="p-5 flex flex-col gap-4">

            {/* Name & type */}
            <div>
              <h2 className="font-head font-bold text-[20px] leading-tight" style={{ color: '#2E4052' }}>
                {vehicle.name}
              </h2>
              {vehicle.vehicleType && (
                <p className="text-[13px] mt-0.5 font-body" style={{ color: '#6B7A8A' }}>
                  {vehicle.vehicleType}
                </p>
              )}
              {vehicle.serviceType && (
                <span
                  className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-[5px] rounded-full font-body"
                  style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                >
                  {vehicle.serviceType}
                </span>
              )}
            </div>

            {/* Specs chips */}
            <div className="flex flex-wrap gap-2">
              <span
                className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
              >
                <Users size={12} /> {vehicle.passengers} Passengers
              </span>
              <span
                className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
              >
                <Luggage size={12} /> {vehicle.luggage} Bags
              </span>
              {vehicle.rating > 0 && (
                <span
                  className="flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
                >
                  <Star size={11} fill="#FFC857" stroke="none" /> {vehicle.rating.toFixed(1)}
                  {vehicle.reviews > 0 && (
                    <span style={{ color: 'rgba(46,64,82,0.5)' }}> ({vehicle.reviews})</span>
                  )}
                </span>
              )}
            </div>

            {/* Features */}
            {vehicle.features.length > 0 && (
              <div>
                <p
                  className="text-[10px] font-extrabold uppercase tracking-widest mb-3 font-body"
                  style={{ color: 'rgba(46,64,82,0.4)' }}
                >
                  Features
                </p>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                  {vehicle.features.map(f => (
                    <span
                      key={f}
                      className="flex items-center gap-2 text-[12px] font-medium font-body"
                      style={{ color: '#2E4052' }}
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#BDD9BF' }}
                      >
                        <Check size={9} strokeWidth={2.5} style={{ color: '#2E4052' }} />
                      </span>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div>
                <p
                  className="text-[10px] font-extrabold uppercase tracking-widest mb-2 font-body"
                  style={{ color: 'rgba(46,64,82,0.4)' }}
                >
                  About This Vehicle
                </p>
                <p className="text-[13px] leading-relaxed font-body" style={{ color: '#5A6775' }}>
                  {vehicle.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky footer CTA */}
        <div
          className="flex-shrink-0 px-5 py-4 border-t"
          style={{
            borderColor: 'rgba(46,64,82,0.08)',
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <button
            onClick={onSelect}
            className="w-full flex items-center justify-center gap-2 text-[14px] font-bold py-3.5 rounded-xl border-none cursor-pointer text-white transition-all duration-200"
            style={{ backgroundColor: '#2E4052' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3A5268' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2E4052' }}
          >
            Select This Vehicle
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
