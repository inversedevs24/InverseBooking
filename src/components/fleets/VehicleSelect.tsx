import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft, Users, Luggage, MapPin, CalendarDays,
  Clock, Ruler, CheckCircle2, ArrowRight, Zap, Loader2, AlertCircle, Star,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import { getVariantIdForDistance } from '../../services/shopifyClient'
import type { TaxiOption, SearchDetails } from '../../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function buildSearchDetails(state: Record<string, any>): SearchDetails {
  const datetime: string = state.datetime ?? ''
  const [date = '', timeFull = ''] = datetime.split('T')
  const time = timeFull.slice(0, 5)

  const returnDatetime: string | undefined = state.returnDatetime
  const [returnDate, returnTimeFull] = returnDatetime ? returnDatetime.split('T') : ['', '']

  const isReturn = !!returnDatetime
  const type = isReturn ? 'return' : 'one-way'

  return {
    tripType: type,
    from: state.from ?? '',
    to: state.to ?? '',
    distance: typeof state.distanceMiles === 'number' ? state.distanceMiles : 0,
    duration: state.duration ?? '',
    date,
    time,
    passengers: typeof state.passengers === 'number' ? state.passengers : 1,
    returnDate: isReturn ? returnDate : undefined,
    returnTime: isReturn ? returnTimeFull?.slice(0, 5) : undefined,
    flightNumber: state.flightNumber,
  }
}

// ─── Trip Summary Sidebar ─────────────────────────────────────────────────────

function TripSummary({ search }: { search: SearchDetails }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.09)' }}>
        {/* Gradient header */}
        <div
          className="px-5 py-4"
          style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#BDD9BF' }}>
            Trip Summary
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <div className="w-px flex-1 my-1.5 bg-white/30" style={{ minHeight: 28 }} />
              <div className="w-2.5 h-2.5 rounded-full border-2 border-white/60" />
            </div>
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#BDD9BF' }}>Pickup</div>
                <div className="text-[13px] font-bold text-white leading-tight">{search.from || '—'}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#BDD9BF' }}>Drop-off</div>
                <div className="text-[13px] font-bold text-white leading-tight">{search.to || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          {[
            { Icon: CalendarDays, val: formatDate(search.date), sub: 'Date' },
            { Icon: Ruler, val: search.distance ? `${search.distance.toFixed(1)} mi` : '—', sub: 'Distance' },
            { Icon: Clock, val: search.duration || '—', sub: 'Est. time' },
          ].map(({ Icon, val, sub }, i) => (
            <div key={i} className="px-3 py-3 text-center">
              <Icon size={13} className="mx-auto mb-1 text-slate-400" />
              <div className="text-[12px] font-bold text-slate-700 leading-tight">{val}</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {search.tripType === 'return' && (
        <div className="bg-white rounded-2xl px-4 py-3" style={{ boxShadow: '0 2px 12px rgba(46,64,82,0.07)' }}>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Return Trip</div>
          <div className="text-[13px] font-semibold text-slate-700">
            {search.returnDate ? formatDate(search.returnDate) : '—'}
            {search.returnTime ? ` at ${search.returnTime}` : ''}
          </div>
        </div>
      )}

      <div
        className="rounded-2xl px-4 py-3 flex items-start gap-2.5"
        style={{ backgroundColor: '#BDD9BF' }}
      >
        <Zap size={13} style={{ color: '#2E4052' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed" style={{ color: '#2E4052' }}>
          {search.distance
            ? `Prices based on ${search.distance.toFixed(1)} mile journey.`
            : 'Prices shown for the selected distance band.'}
          {' '}Free cancellation up to 1 hour before pickup.
        </p>
      </div>
    </div>
  )
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({
  vehicle,
  selected,
  priceDisplay,
  currencyCode,
  onSelect,
}: {
  vehicle: TaxiOption
  selected: boolean
  priceDisplay: string
  currencyCode: string
  onSelect: () => void
}) {
  const currencySymbol = currencyCode === 'GBP' ? '£' : currencyCode === 'USD' ? '$' : currencyCode

  return (
    <div
      onClick={onSelect}
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-250"
      style={{
        boxShadow: selected
          ? '0 0 0 2.5px #2E4052, 0 8px 28px rgba(46,64,82,0.18)'
          : '0 2px 14px rgba(46,64,82,0.08)',
        transform: selected ? 'translateY(-1px)' : undefined,
      }}
      onMouseEnter={e => {
        if (!selected) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(46,64,82,0.14)'
      }}
      onMouseLeave={e => {
        if (!selected) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 14px rgba(46,64,82,0.08)'
      }}
    >
      {/* Selected gold top stripe */}
      {selected && (
        <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ backgroundColor: '#FFC857' }} />
      )}

      <div className="flex items-stretch">

        {/* ── Image column ── */}
        <div className="w-[120px] sm:w-[145px] flex-shrink-0 relative overflow-hidden">
          {vehicle.image ? (
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-[1.05]"
              style={{ minHeight: 100 }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ minHeight: 100, backgroundColor: '#F0F5F0' }}
            >
              <Users size={28} className="text-slate-300" />
            </div>
          )}

          {/* Popular badge */}
          {vehicle.popular && (
            <div
              className="absolute top-2 left-2 text-[9px] font-extrabold px-2 py-[3px] rounded-full uppercase tracking-wide"
              style={{ backgroundColor: '#FFC857', color: '#2E4052' }}
            >
              Popular
            </div>
          )}

          {/* Subtle image overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent 60%, rgba(46,64,82,0.06) 100%)' }}
          />
        </div>

        {/* ── Info column ── */}
        <div className="flex-1 px-4 py-3 min-w-0">

          {/* Top row: name + price */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-slate-800 font-head leading-tight">
                {vehicle.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">{vehicle.vehicleType}</div>
              {vehicle.rating > 0 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Star size={10} style={{ color: '#2E4052' }} fill="#2E4052" />
                  <span className="text-[10px] font-semibold text-slate-500">
                    {vehicle.rating.toFixed(1)} ({vehicle.reviews})
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex-shrink-0 text-right">
              <div
                className="font-head leading-none"
                style={{ fontSize: priceDisplay === '—' ? '14px' : '20px', fontWeight: 700, color: '#2E4052' }}
              >
                {priceDisplay !== '—' ? <>{currencySymbol}<span>{priceDisplay}</span></> : '—'}
              </div>
              <div className="text-[9px] text-slate-400 mt-1 whitespace-nowrap">
                {vehicle.variants.length > 0 ? 'est. total' : 'contact us'}
              </div>
            </div>
          </div>

          {/* Chips row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="flex items-center gap-1 text-[10px] font-semibold px-2 py-[3px] rounded-full"
              style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
            >
              <Users size={9} /> {vehicle.passengers} pax
            </span>
            <span
              className="flex items-center gap-1 text-[10px] font-semibold px-2 py-[3px] rounded-full"
              style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
            >
              <Luggage size={9} /> {vehicle.luggage} bags
            </span>
            {vehicle.features.slice(0, 2).map(f => (
              <span
                key={f}
                className="text-[9px] font-semibold px-2 py-[3px] rounded-full border"
                style={{ color: '#2E4052', backgroundColor: '#BDD9BF', borderColor: '#A8C9AA' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* ── Action indicator ── */}
        <div className="flex items-center px-3 flex-shrink-0">
          {selected ? (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#2E4052' }}
            >
              <CheckCircle2 size={15} className="text-white" />
            </div>
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{ backgroundColor: '#F0F5F0' }}
            >
              <ArrowRight size={13} style={{ color: '#2E4052' }} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VehicleSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const rawState: Record<string, any> = location.state ?? {}

  const dispatch = useAppDispatch()
  const { products, loading, error } = useAppSelector(s => s.shopify)

  const searchDetails = buildSearchDetails(rawState)
  const { distance: distanceMiles, passengers: requiredPassengers } = searchDetails

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    dispatch(fetchTaxiProducts())
  }, [dispatch])

  const available = products.filter(p => p.passengers >= requiredPassengers)

  const getVariantForProduct = (product: TaxiOption) => {
    if (!distanceMiles || product.variants.length === 0) return null
    const id = getVariantIdForDistance(product.variants, distanceMiles)
    return product.variants.find(v => v.id === id) ?? null
  }

  const handleSelect = (product: TaxiOption) => {
    setSelectedId(product.id)

    const variant = getVariantForProduct(product)
    const selectedVariantId = variant?.id ?? product.shopifyId
    const variantPrice = variant ? parseFloat(variant.price.amount) : 0
    const quantity = searchDetails.tripType === 'return' ? 2 : 1
    const totalPrice = variantPrice * quantity

    setTimeout(() => {
      navigate('/booking-details', {
        state: {
          from: searchDetails.from,
          to: searchDetails.to,
          datetime: rawState.datetime,
          returnDatetime: rawState.returnDatetime,
          type: searchDetails.tripType === 'return' ? 'return' : 'transfer',
          vehicle: {
            id: product.id,
            name: product.name,
            model: product.vehicleType,
            type: product.type,
            passengers: product.passengers,
            luggage: product.luggage,
            image: product.image,
            pricePerKm: product.perKmRate,
            basePrice: product.baseFare,
            features: product.features,
            tag: product.popular ? 'Popular' : '',
            tagColor: '#FFC857',
          },
          price: totalPrice.toFixed(2),
          distance: distanceMiles,
          duration: searchDetails.duration,
          taxiOption: product,
          selectedVariantId,
          totalPrice,
          quantity,
          searchDetails,
        },
      })
    }, 250)
  }

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#F0F5F0' }}>

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10" style={{ boxShadow: '0 1px 8px rgba(46,64,82,0.07)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-primary transition-colors px-2.5 py-1.5 rounded-xl hover:bg-slate-100 flex-shrink-0 cursor-pointer"
          >
            <ChevronLeft size={15} />
            <span className="hidden xs:inline">Back</span>
          </button>

          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

          <div className="min-w-0 flex-1">
            <h1 className="font-head font-bold text-primary text-[15px] sm:text-[16px] truncate">
              Choose Your Vehicle
            </h1>
            {searchDetails.from && searchDetails.to && (
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                {searchDetails.from} → {searchDetails.to}
              </p>
            )}
          </div>

          {!loading && !error && available.length > 0 && (
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full hidden sm:block flex-shrink-0"
              style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
            >
              {available.length} options
            </span>
          )}

          <button
            className="lg:hidden flex items-center gap-1.5 text-[12px] font-semibold rounded-xl px-3 py-1.5 transition-colors flex-shrink-0 whitespace-nowrap cursor-pointer border-none"
            style={showSummary
              ? { backgroundColor: '#2E4052', color: 'white' }
              : { backgroundColor: '#BDD9BF', color: '#2E4052' }
            }
            onClick={() => setShowSummary(v => !v)}
          >
            <MapPin size={13} />
            <span className="hidden sm:inline">{showSummary ? 'Hide' : 'Trip'} Summary</span>
          </button>
        </div>
      </div>

      {/* Mobile trip summary */}
      {showSummary && (
        <div className="lg:hidden px-4 pt-4 pb-2">
          <TripSummary search={searchDetails} />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">

          {/* ── Vehicle list ── */}
          <div className="flex-1 min-w-0">

            {/* List header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Available Vehicles
                </p>
                {!loading && !error && available.length > 0 && (
                  <p className="text-[12px] text-muted mt-0.5">
                    Select a vehicle to continue booking
                  </p>
                )}
              </div>
              {!loading && !error && available.length > 0 && (
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full sm:hidden"
                  style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                >
                  {available.length}
                </span>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={28} className="animate-spin" style={{ color: '#2E4052' }} />
                <p className="text-[13px] text-muted">Loading available vehicles…</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="bg-white rounded-2xl px-5 py-8 flex flex-col items-center gap-3 text-center" style={{ boxShadow: '0 2px 14px rgba(46,64,82,0.08)' }}>
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <AlertCircle size={22} className="text-red-400" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-700">Could not load vehicles</p>
                  <p className="text-[12px] text-slate-400 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => dispatch(fetchTaxiProducts())}
                  className="text-[12px] font-bold px-5 py-2 rounded-xl text-white cursor-pointer border-none"
                  style={{ backgroundColor: '#2E4052' }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && available.length === 0 && products.length > 0 && (
              <div className="bg-white rounded-2xl px-5 py-10 text-center" style={{ boxShadow: '0 2px 14px rgba(46,64,82,0.08)' }}>
                <Users size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-[14px] font-semibold text-slate-700">No vehicles for {requiredPassengers} passengers</p>
                <p className="text-[12px] text-slate-400 mt-1">Try reducing the passenger count.</p>
              </div>
            )}

            {/* Cards */}
            {!loading && !error && (
              <div className="flex flex-col gap-3">
                {available.map(product => {
                  const variant = getVariantForProduct(product)
                  const priceDisplay = variant
                    ? parseFloat(variant.price.amount).toFixed(2)
                    : '—'
                  const currencyCode = variant?.price.currencyCode ?? 'GBP'

                  return (
                    <VehicleCard
                      key={product.id}
                      vehicle={product}
                      selected={selectedId === product.id}
                      priceDisplay={priceDisplay}
                      currencyCode={currencyCode}
                      onSelect={() => handleSelect(product)}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Desktop sidebar ── */}
          <div className="hidden lg:block w-[320px] xl:w-[340px] flex-shrink-0 sticky top-[72px]">
            <TripSummary search={searchDetails} />
          </div>

        </div>
      </div>
    </div>
  )
}
