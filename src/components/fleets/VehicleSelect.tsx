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

/** Parse raw location.state (from ServiceBookingForm) into SearchDetails. */
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
    // distanceMiles is set by Google Maps integration; falls back to 0 (all bands show)
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
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">
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
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] px-4 py-3">
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
  const tag = vehicle.popular ? 'Popular' : ''

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${
        selected
          ? 'shadow-[0_0_0_2px_#2E4052,0_8px_24px_rgba(46,64,82,0.15)]'
          : 'shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] hover:-translate-y-0.5'
      }`}
    >
      {selected && (
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: '#FFC857' }} />
      )}

      <div className="flex items-stretch">
        {/* Image */}
        <div className="w-[110px] sm:w-[130px] flex-shrink-0 relative overflow-hidden">
          {vehicle.image ? (
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
              style={{ minHeight: 90 }}
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center" style={{ minHeight: 90 }}>
              <Users size={24} className="text-slate-300" />
            </div>
          )}
          {tag && (
            <div
              className="absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white uppercase tracking-wide"
              style={{ backgroundColor: '#FFC857', color: '#2E4052' }}
            >
              {tag}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 px-4 py-3 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-slate-800 font-head leading-tight truncate">
                {vehicle.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">{vehicle.vehicleType}</div>
              {vehicle.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} style={{ color: '#FFC857' }} fill="#FFC857" />
                  <span className="text-[10px] font-semibold text-slate-500">
                    {vehicle.rating.toFixed(1)} ({vehicle.reviews})
                  </span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-[18px] font-bold font-head leading-tight" style={{ color: '#2E4052' }}>
                {currencyCode === 'GBP' ? '£' : currencyCode === 'USD' ? '$' : currencyCode}
                {priceDisplay}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                {vehicle.variants.length > 0 ? 'est. total' : 'contact for price'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              <Users size={9} />{vehicle.passengers}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              <Luggage size={9} />{vehicle.luggage}
            </span>
            {vehicle.features.slice(0, 2).map(f => (
              <span
                key={f}
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full border"
                style={{ color: '#2E4052', backgroundColor: '#BDD9BF', borderColor: '#A8C9AA' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow / check */}
        <div className={`flex items-center px-3 flex-shrink-0 transition-colors ${
          selected ? '' : 'text-slate-300 group-hover:text-slate-400'
        }`}>
          {selected
            ? <CheckCircle2 size={20} style={{ color: '#FFC857' }} />
            : <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          }
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

  // Filter by passenger capacity
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
          // Legacy BookingState fields (for existing BookingDetails/Checkout UI)
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
          // Shopify-specific extras threaded through for Checkout
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

      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(15,23,42,0.06)] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 sm:gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors px-2 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 flex-shrink-0"
          >
            <ChevronLeft size={15} />
            <span className="hidden xs:inline">Back</span>
          </button>

          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

          <h1 className="font-head font-bold text-slate-800 text-[14px] sm:text-[16px] truncate min-w-0">
            Choose Your Vehicle
          </h1>

          <div className="flex-1" />

          {!loading && !error && (
            <span className="text-[11px] text-slate-400 hidden sm:block flex-shrink-0 whitespace-nowrap">
              {available.length} options
            </span>
          )}

          <button
            className="lg:hidden flex items-center gap-1.5 text-[12px] font-semibold rounded-xl px-2.5 sm:px-3 py-1.5 transition-colors flex-shrink-0 whitespace-nowrap"
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

      {showSummary && (
        <div className="lg:hidden px-4 pt-4 pb-2">
          <TripSummary search={searchDetails} />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">

          {/* Vehicle list */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Available Vehicles
              </p>
              {!loading && !error && (
                <span className="text-[11px] text-slate-400">{available.length} results</span>
              )}
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 size={28} className="animate-spin" style={{ color: '#2E4052' }} />
                <p className="text-[13px] text-slate-500">Loading available vehicles…</p>
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] px-5 py-6 flex flex-col items-center gap-3 text-center">
                <AlertCircle size={24} className="text-red-400" />
                <div>
                  <p className="text-[14px] font-semibold text-slate-700">Could not load vehicles</p>
                  <p className="text-[12px] text-slate-400 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => dispatch(fetchTaxiProducts())}
                  className="text-[12px] font-semibold px-4 py-2 rounded-xl text-white"
                  style={{ backgroundColor: '#2E4052' }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && available.length === 0 && products.length > 0 && (
              <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] px-5 py-8 text-center">
                <p className="text-[14px] font-semibold text-slate-700">No vehicles for {requiredPassengers} passengers</p>
                <p className="text-[12px] text-slate-400 mt-1">Try reducing the passenger count.</p>
              </div>
            )}

            {/* Vehicle cards */}
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

          {/* Trip summary — desktop sticky sidebar */}
          <div className="hidden lg:block w-[320px] xl:w-[340px] flex-shrink-0 sticky top-[72px]">
            <TripSummary search={searchDetails} />
          </div>

        </div>
      </div>
    </div>
  )
}

