import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Luggage, Loader2, AlertCircle, Star } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import type { TaxiOption } from '../../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVICE_ROUTE_MAP: Record<string, string> = {
  'Private Transfer': '/book?service=transfer',
  'City to City':     '/book?service=city-to-city',
  'Airport Rides':    '/book?service=airport',
  'City Tour':        '/book?service=city-tour',
  'Hourly Hire':      '/book?service=hourly',
  'Desert Safari':    '/book?service=desert-safari',
}

function getBookRoute(product: TaxiOption): string {
  return SERVICE_ROUTE_MAP[product.serviceType] ?? '/book?service=transfer'
}

/** Derive a display category from the product name for filter tabs. */
function getCategory(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('coach')) return 'Coach'
  if (lower.includes('minibus') || lower.includes('mini bus')) return 'Minibus'
  return 'Other'
}

// ─── Fleet Card ───────────────────────────────────────────────────────────────

function FleetCard({ fleet }: { fleet: TaxiOption }) {
  const navigate = useNavigate()
  const category = getCategory(fleet.name)

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.07)] group hover:shadow-[0_6px_24px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative h-[160px] overflow-hidden bg-slate-100 flex-shrink-0">
        {fleet.image ? (
          <img
            src={fleet.image}
            alt={fleet.name}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users size={32} className="text-slate-300" />
          </div>
        )}
        <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide backdrop-blur-sm">
          {category}
        </span>
        {fleet.popular && (
          <span className="absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white uppercase tracking-wide"
            style={{ backgroundColor: '#FFC857', color: '#2E4052' }}>
            Popular
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-head text-[14px] font-bold text-slate-800 mb-1.5 leading-tight">{fleet.name}</h3>

        {/* Service type badge */}
        {fleet.serviceType && (
          <span className="inline-block self-start text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
            style={{ color: '#2E4052', backgroundColor: '#BDD9BF' }}>
            {fleet.serviceType}
          </span>
        )}

        {/* Pax + luggage */}
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            <Users size={10} />{fleet.passengers} pax
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            <Luggage size={10} />{fleet.luggage} bags
          </span>
          {fleet.rating > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
              <Star size={9} style={{ color: '#FFC857' }} fill="#FFC857" />
              {fleet.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {fleet.features.slice(0, 3).map(f => (
            <span
              key={f}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
              style={{ color: '#2E4052', backgroundColor: '#BDD9BF', borderColor: '#A8C9AA' }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="border-t border-slate-100 mt-auto pt-3 flex items-center justify-between">
          {fleet.baseFare > 0 ? (
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-widest">From</div>
              <div className="font-head text-[18px] font-bold text-slate-800 leading-tight">
                £{fleet.baseFare.toFixed(0)}
              </div>
            </div>
          ) : (
            <div className="text-[12px] text-slate-400">Contact for price</div>
          )}
          <button
            onClick={() => navigate(getBookRoute(fleet))}
            className="flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-xl transition-all"
            style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2E4052'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#BDD9BF'; e.currentTarget.style.color = '#2E4052' }}
          >
            Book →
          </button>
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

  // Derive filter categories from actual product names
  const categories = ['All', ...Array.from(new Set(products.map(p => getCategory(p.name))))]

  const filtered = activeFilter === 'All'
    ? products
    : products.filter(p => getCategory(p.name) === activeFilter)

  return (
    <section className="py-12 md:py-[30px]" style={{ backgroundColor: '#F0F5F0' }}>
      <div className="max-w-container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">
            Ride in Comfort
          </p>
          <h2 className="font-head text-heading text-primary leading-none mb-3">
            Our Fleet
          </h2>
          <p className="text-[14px] text-muted font-body max-w-md mx-auto leading-relaxed">
            From compact minibuses to spacious coaches — clean, premium vehicles for every journey.
          </p>
        </div>

        {/* Filter tabs — only shown once products load */}
        {!loading && !error && products.length > 0 && (
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-semibold transition-all border ${
                  activeFilter === cat
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
                style={activeFilter === cat ? { backgroundColor: '#2E4052' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin" style={{ color: '#2E4052' }} />
            <p className="text-[13px] text-slate-500">Loading fleet…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <AlertCircle size={24} className="text-red-400" />
            <p className="text-[14px] font-semibold text-slate-700">Could not load fleet</p>
            <p className="text-[12px] text-slate-400">{error}</p>
            <button
              onClick={() => dispatch(fetchTaxiProducts())}
              className="text-[12px] font-semibold px-4 py-2 rounded-xl text-white"
              style={{ backgroundColor: '#2E4052' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
            {filtered.map(fleet => (
              <FleetCard key={fleet.id} fleet={fleet} />
            ))}
            {filtered.length === 0 && products.length > 0 && (
              <div className="col-span-full text-center py-12 text-slate-400 text-[14px]">
                No vehicles found for this category.
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
