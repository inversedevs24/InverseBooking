import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Luggage, Loader2, AlertCircle, Star, Car, ArrowRight, Check } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import { SERVICE_ROUTE_MAP } from '../../data'
import type { TaxiOption } from '../../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBookRoute(product: TaxiOption): string {
  return SERVICE_ROUTE_MAP[product.serviceType] ?? '/book?service=transfer'
}

// ─── Fleet Card ───────────────────────────────────────────────────────────────

function FleetCard({ fleet }: { fleet: TaxiOption }) {
  const navigate = useNavigate()

  return (
    <div
      className="group bg-white rounded-[20px] overflow-hidden flex flex-col cursor-pointer"
      style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.08)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
      onClick={() => navigate(`/fleet/${fleet.id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 18px 48px rgba(46,64,82,0.16)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(46,64,82,0.08)'
      }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 200, backgroundColor: '#EAF0EA' }}>
        {fleet.image ? (
          <img
            src={fleet.image}
            alt={fleet.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={40} style={{ color: '#BDD9BF' }} />
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(46,64,82,0.82) 0%, rgba(46,64,82,0.12) 50%, transparent 100%)' }}
        />

        {/* Popular badge */}
        {fleet.popular && (
          <div
            className="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-[5px] rounded-full"
            style={{ backgroundColor: '#FFC857', color: '#2E4052' }}
          >
            Popular
          </div>
        )}

        {/* Service type badge — top-right */}
        {fleet.serviceType && (
          <div
            className="absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-[5px] rounded-full"
            style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
          >
            {fleet.serviceType}
          </div>
        )}

        {/* Name + type overlaid */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10">
          <h3 className="font-head text-[16px] font-bold text-white leading-tight drop-shadow">
            {fleet.name}
          </h3>
          {fleet.vehicleType && (
            <p className="text-[10px] mt-0.5 font-body" style={{ color: 'rgba(255,255,255,0.68)' }}>
              {fleet.vehicleType}
            </p>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Specs row — clean icon + label, no pill backgrounds */}
        <div className="flex items-center gap-4 pb-3 border-b" style={{ borderColor: 'rgba(46,64,82,0.08)' }}>
          <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: '#0F172A' }}>
            <Users size={13} style={{ color: '#2E4052' }} />
            {fleet.passengers} Passengers
          </span>
          <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: '#0F172A' }}>
            <Luggage size={13} style={{ color: '#2E4052' }} />
            {fleet.luggage} Bags
          </span>
          {fleet.rating > 0 && (
            <span className="flex items-center gap-1 ml-auto text-[11px] font-semibold" style={{ color: '#0F172A' }}>
              <Star size={11} fill="#0F172A" stroke="none" />
              {fleet.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Features — checklist style */}
        {fleet.features.length > 0 && (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 py-3">
            {fleet.features.slice(0, 4).map(f => (
              <span key={f} className="flex items-center gap-1.5 text-[11px] font-medium font-body truncate" style={{ color: '#2E4052' }}>
                <Check size={10} strokeWidth={2.5} style={{ color: '#2E4052', flexShrink: 0 }} />
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t mt-auto" style={{ borderColor: 'rgba(46,64,82,0.08)' }} />

        {/* CTA */}
        <div className="flex items-center gap-2 pt-0.5 w-full">
            <button
              onClick={e => { e.stopPropagation(); navigate(`/fleet/${fleet.id}`) }}
              className="flex-1 text-[12px] font-bold px-4 py-2.5 rounded-xl cursor-pointer border-none text-white"
              style={{ backgroundColor: '#2E4052', transition: 'background-color 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3A5268' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2E4052' }}
            >
              Details
            </button>
            <button
              onClick={e => { e.stopPropagation(); navigate(getBookRoute(fleet)) }}
              className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-bold px-4 py-2.5 rounded-xl cursor-pointer border-none text-white"
              style={{ backgroundColor: '#2E4052', transition: 'background-color 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3A5268' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2E4052' }}
            >
              Book
              <ArrowRight size={12} />
            </button>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton loader card ─────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.06)' }}>
      <div className="animate-pulse">
        <div style={{ height: 200, backgroundColor: '#EAF0EA' }} />
        <div className="p-4 flex flex-col gap-3">
          <div className="h-4 rounded-full w-3/4" style={{ backgroundColor: '#EAF0EA' }} />
          <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: '#F0F5F0' }} />
          <div className="flex gap-2">
            <div className="h-6 rounded-full w-20" style={{ backgroundColor: '#F0F5F0' }} />
            <div className="h-6 rounded-full w-16" style={{ backgroundColor: '#F0F5F0' }} />
          </div>
          <div className="h-10 rounded-xl mt-2" style={{ backgroundColor: '#F0F5F0' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AllFleets() {
  const dispatch = useAppDispatch()
  const { products, loading, error } = useAppSelector(s => s.shopify)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    dispatch(fetchTaxiProducts())
  }, [dispatch])

  const serviceTypes = ['All', ...Array.from(new Set(products.map(p => p.serviceType).filter(Boolean)))]

  const filtered = activeFilter === 'All'
    ? products
    : products.filter(p => p.serviceType === activeFilter)

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#F0F5F0' }}>

      {/* ── Hero header band ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}
      >
        {/* Subtle decorative circle */}
        <div
          className="absolute -right-24 -top-24 rounded-full pointer-events-none"
          style={{ width: 320, height: 320, background: 'rgba(189,217,191,0.06)' }}
        />
        <div
          className="absolute -left-16 -bottom-16 rounded-full pointer-events-none"
          style={{ width: 240, height: 240, background: 'rgba(189,217,191,0.04)' }}
        />

        <div className="relative max-w-container mx-auto px-6 py-12 md:py-16 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3 font-body" style={{ color: '#BDD9BF' }}>
            Ride in Comfort
          </p>
          <h1 className="font-head text-heading text-white leading-none mb-4">
            Our Fleet
          </h1>
          <p className="text-[14px] font-body leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            From compact minibuses to spacious coaches — clean, premium vehicles driven by professional chauffeurs.
          </p>

          {/* Stats row */}
          {!loading && !error && products.length > 0 && (
            <div className="flex items-center justify-center gap-8 mt-8">
              {[
                { val: `${products.length}+`, label: 'Vehicles' },
                { val: '5★', label: 'Rated Service' },
                { val: '24/7', label: 'Available' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div className="font-head text-[22px] font-bold text-white leading-none">{val}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-container mx-auto px-6 py-10">

        {/* ── Filter tabs ── */}
        {!loading && !error && products.length > 0 && (
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {serviceTypes.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="px-5 py-2 rounded-full text-[12px] font-bold transition-all duration-200 border-none cursor-pointer"
                style={activeFilter === cat
                  ? { backgroundColor: '#2E4052', color: '#ffffff', boxShadow: '0 4px 14px rgba(46,64,82,0.25)' }
                  : { backgroundColor: '#ffffff', color: '#2E4052', boxShadow: '0 1px 6px rgba(46,64,82,0.08)' }
                }
                onMouseEnter={e => {
                  if (activeFilter !== cat) e.currentTarget.style.boxShadow = '0 4px 14px rgba(46,64,82,0.14)'
                }}
                onMouseLeave={e => {
                  if (activeFilter !== cat) e.currentTarget.style.boxShadow = '0 1px 6px rgba(46,64,82,0.08)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Skeleton loading ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div
            className="bg-white rounded-[20px] px-8 py-14 flex flex-col items-center gap-4 text-center max-w-sm mx-auto"
            style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.08)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <div>
              <p className="text-[15px] font-bold font-head" style={{ color: '#2E4052' }}>Could not load fleet</p>
              <p className="text-[12px] text-muted mt-1 font-body">{error}</p>
            </div>
            <button
              onClick={() => dispatch(fetchTaxiProducts())}
              className="text-[13px] font-bold px-6 py-2.5 rounded-xl text-white border-none cursor-pointer"
              style={{ backgroundColor: '#2E4052' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(fleet => (
                <FleetCard key={fleet.id} fleet={fleet} />
              ))}
            </div>

            {filtered.length === 0 && products.length > 0 && (
              <div
                className="bg-white rounded-[20px] py-16 text-center"
                style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.08)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#F0F5F0' }}
                >
                  <Car size={24} style={{ color: '#BDD9BF' }} />
                </div>
                <p className="text-[15px] font-bold font-head" style={{ color: '#2E4052' }}>
                  No vehicles in this category
                </p>
                <p className="text-[12px] text-muted mt-1 font-body">Try selecting a different filter above.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
