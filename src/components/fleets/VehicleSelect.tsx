import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft, Users, Luggage, MapPin, CalendarDays,
  Clock, Ruler, CheckCircle2, ArrowRight, Zap, Loader2, AlertCircle, Star, Car,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import { getVariantIdForDistance } from '../../services/shopifyClient'
import { loadGoogleMaps } from '../../services/googleMapsLoader'
import type { TaxiOption, TaxiVariant, SearchDetails } from '../../types'

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
    fromCoords: state.fromCoords ?? undefined,
    toCoords: state.toCoords ?? undefined,
    distance: typeof state.distanceKm === 'number' ? state.distanceKm : 0,
    duration: state.duration ?? '',
    date,
    time,
    passengers: typeof state.passengers === 'number' ? state.passengers : 1,
    returnDate: isReturn ? returnDate : undefined,
    returnTime: isReturn ? returnTimeFull?.slice(0, 5) : undefined,
    flightNumber: state.flightNumber,
  }
}

// ─── Route Map Preview ────────────────────────────────────────────────────────

const CLEAN_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f1f5f4' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f1f5f4' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a9bb0' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#dde5e0' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#c5d4cb' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9aabb5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9dde8' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#eaf0ec' }] },
]

function RouteMapPreview({
  fromCoords,
  toCoords,
}: {
  fromCoords: { lat: number; lng: number }
  toCoords: { lat: number; lng: number }
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const didInit = useRef(false)

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    loadGoogleMaps()
      .then(() => {
        if (!divRef.current) return
        const maps = (window as any).google.maps

        const center = {
          lat: (fromCoords.lat + toCoords.lat) / 2,
          lng: (fromCoords.lng + toCoords.lng) / 2,
        }

        const map = new maps.Map(divRef.current, {
          zoom: 9,
          center,
          disableDefaultUI: true,
          gestureHandling: 'none',
          clickableIcons: false,
          styles: CLEAN_MAP_STYLES,
        })

        const renderer = new maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: { strokeColor: '#2E4052', strokeWeight: 3, strokeOpacity: 0.9 },
        })

        new maps.DirectionsService().route(
          { origin: fromCoords, destination: toCoords, travelMode: maps.TravelMode.DRIVING },
          (result: any, status: string) => {
            if (status !== 'OK') return
            renderer.setDirections(result)
            const leg = result.routes[0].legs[0]

            // Pickup marker — light green fill
            new maps.Marker({
              position: leg.start_location,
              map,
              icon: {
                path: maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#BDD9BF',
                fillOpacity: 1,
                strokeColor: '#2E4052',
                strokeWeight: 2,
              },
            })

            // Drop-off marker — dark fill
            new maps.Marker({
              position: leg.end_location,
              map,
              icon: {
                path: maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#2E4052',
                fillOpacity: 1,
                strokeColor: '#2E4052',
                strokeWeight: 2,
              },
            })
          }
        )
      })
      .catch(() => {/* silently skip map if Maps fails */})
  }, [])

  return (
    <div
      ref={divRef}
      style={{ height: 170, borderRadius: 20, overflow: 'hidden' }}
    />
  )
}

// ─── Trip Summary Sidebar ─────────────────────────────────────────────────────

function TripSummary({ search }: { search: SearchDetails }) {
  const hasRoute = !!(search.fromCoords && search.toCoords)

  return (
    <div className="flex flex-col gap-3">

      {/* Route map */}
      {hasRoute && (
        <RouteMapPreview
          fromCoords={search.fromCoords!}
          toCoords={search.toCoords!}
        />
      )}

      {/* Route card */}
      <div className="rounded-[20px] overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(46,64,82,0.12)' }}>
        {/* Gradient header */}
        <div
          className="px-5 py-5"
          style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}
        >
          <div
            className="text-[9px] font-extrabold uppercase tracking-widest mb-4 font-body"
            style={{ color: '#BDD9BF' }}
          >
            Trip Summary
          </div>

          {/* Route line */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <div className="w-px flex-1 my-1.5" style={{ minHeight: 28, backgroundColor: 'rgba(255,255,255,0.25)' }} />
              <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: 'rgba(255,255,255,0.6)' }} />
            </div>
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div>
                <div
                  className="text-[9px] font-bold uppercase tracking-widest mb-0.5 font-body"
                  style={{ color: '#BDD9BF' }}
                >
                  Pickup
                </div>
                <div className="text-[13px] font-bold text-white leading-tight">{search.from || '—'}</div>
              </div>
              <div>
                <div
                  className="text-[9px] font-bold uppercase tracking-widest mb-0.5 font-body"
                  style={{ color: '#BDD9BF' }}
                >
                  Drop-off
                </div>
                <div className="text-[13px] font-bold text-white leading-tight">{search.to || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 divide-x bg-white" style={{ borderColor: '#F0F5F0' }}>
          {[
            { Icon: CalendarDays, val: formatDate(search.date), sub: 'Date' },
            { Icon: Ruler, val: search.distance ? `${search.distance.toFixed(1)} km` : '—', sub: 'Distance' },
            { Icon: Clock, val: search.duration || '—', sub: 'Est. time' },
          ].map(({ Icon, val, sub }, i) => (
            <div key={i} className="px-3 py-3.5 text-center" style={{ borderColor: '#F0F5F0' }}>
              <Icon size={13} className="mx-auto mb-1" style={{ color: '#BDD9BF' }} />
              <div className="text-[12px] font-bold font-head leading-tight" style={{ color: '#2E4052' }}>{val}</div>
              <div className="text-[9px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'rgba(46,64,82,0.4)' }}>
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Return trip card */}
      {search.tripType === 'return' && (
        <div
          className="bg-white rounded-2xl px-4 py-3.5"
          style={{ boxShadow: '0 2px 12px rgba(46,64,82,0.07)' }}
        >
          <div
            className="text-[9px] font-bold uppercase tracking-widest mb-1.5 font-body"
            style={{ color: 'rgba(46,64,82,0.4)' }}
          >
            Return Trip
          </div>
          <div className="text-[13px] font-semibold font-head" style={{ color: '#2E4052' }}>
            {search.returnDate ? formatDate(search.returnDate) : '—'}
            {search.returnTime ? ` at ${search.returnTime}` : ''}
          </div>
        </div>
      )}

      {/* Info note */}
      <div
        className="rounded-2xl px-4 py-3.5 flex items-start gap-2.5"
        style={{ backgroundColor: '#BDD9BF' }}
      >
        <Zap size={13} style={{ color: '#2E4052' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed font-body" style={{ color: '#2E4052' }}>
          {search.distance
            ? `Prices based on a ${search.distance.toFixed(1)} km journey.`
            : 'Prices shown for the nearest distance band.'}
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
  isEstimate,
  onSelect,
}: {
  vehicle: TaxiOption
  selected: boolean
  priceDisplay: string
  currencyCode: string
  isEstimate: boolean
  onSelect: () => void
}) {
  const currencySymbol = currencyCode === 'GBP' ? '£' : currencyCode === 'USD' ? '$' : currencyCode === 'AED' ? 'AED ' : currencyCode

  return (
    <div
      onClick={onSelect}
      className="group relative bg-white rounded-[20px] overflow-hidden cursor-pointer"
      style={{
        boxShadow: selected
          ? '0 0 0 2.5px #2E4052, 0 12px 36px rgba(46,64,82,0.20)'
          : '0 2px 16px rgba(46,64,82,0.08)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        transform: selected ? 'translateY(-2px)' : undefined,
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,64,82,0.14)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.boxShadow = '0 2px 16px rgba(46,64,82,0.08)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {/* Selected top stripe in gold */}
      {selected && (
        <div
          className="absolute top-0 left-0 right-0 z-10"
          style={{ height: 3, backgroundColor: '#FFC857' }}
        />
      )}

      <div className="flex items-stretch">

        {/* ── Image column ── */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{ width: 140, minHeight: 120, backgroundColor: '#EAF0EA' }}
        >
          {vehicle.image ? (
            <img
              src={vehicle.image}
              alt={vehicle.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-[1.06]"
              style={{ minHeight: 120 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 120 }}>
              <Car size={32} style={{ color: '#BDD9BF' }} />
            </div>
          )}

          {/* Popular badge */}
          {vehicle.popular && (
            <div
              className="absolute top-2 left-2 text-[8px] font-extrabold uppercase tracking-wide px-2 py-[3px] rounded-full"
              style={{ backgroundColor: '#FFC857', color: '#2E4052' }}
            >
              Popular
            </div>
          )}

          {/* Subtle right-edge vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent 55%, rgba(46,64,82,0.06) 100%)' }}
          />
        </div>

        {/* ── Info column ── */}
        <div className="flex-1 px-4 py-4 min-w-0 flex flex-col justify-between">

          {/* Top: name + price */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold font-head leading-tight" style={{ color: '#2E4052' }}>
                {vehicle.name}
              </div>
              {vehicle.vehicleType && (
                <div className="text-[11px] mt-0.5 font-body truncate" style={{ color: 'rgba(46,64,82,0.5)' }}>
                  {vehicle.vehicleType}
                </div>
              )}
              {vehicle.rating > 0 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Star size={10} fill="#2E4052" stroke="none" />
                  <span className="text-[10px] font-semibold font-body" style={{ color: 'rgba(46,64,82,0.6)' }}>
                    {vehicle.rating.toFixed(1)}
                    {vehicle.reviews > 0 && ` (${vehicle.reviews})`}
                  </span>
                </div>
              )}
            </div>

            {/* Price block */}
            <div className="flex-shrink-0 text-right">
              {priceDisplay !== '—' ? (
                <>
                  <div className="font-head text-[22px] font-bold leading-none" style={{ color: '#2E4052' }}>
                    {isEstimate && <span className="text-[13px] font-semibold mr-0.5">From</span>}
                    {currencySymbol}{priceDisplay}
                  </div>
                  <div
                    className="text-[9px] font-semibold uppercase tracking-wide mt-1 font-body whitespace-nowrap"
                    style={{ color: 'rgba(46,64,82,0.4)' }}
                  >
                    {isEstimate ? 'starting price' : 'est. total'}
                  </div>
                </>
              ) : (
                <div className="text-[12px] font-semibold font-body" style={{ color: 'rgba(46,64,82,0.45)' }}>
                  Contact us
                </div>
              )}
            </div>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
            >
              <Users size={9} /> {vehicle.passengers} pax
            </span>
            <span
              className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
            >
              <Luggage size={9} /> {vehicle.luggage} bags
            </span>
            {vehicle.features.slice(0, 2).map(f => (
              <span
                key={f}
                className="text-[9px] font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* ── Select indicator ── */}
        <div className="flex items-center px-4 flex-shrink-0">
          {selected ? (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#2E4052', boxShadow: '0 2px 8px rgba(46,64,82,0.3)' }}
            >
              <CheckCircle2 size={16} className="text-white" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{ backgroundColor: '#F0F5F0' }}
            >
              <ArrowRight size={14} style={{ color: '#2E4052' }} className="transition-transform duration-200 group-hover:translate-x-0.5" />
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
  const { distance: distanceKm, passengers: requiredPassengers } = searchDetails

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    dispatch(fetchTaxiProducts())
  }, [dispatch])

  const SERVICE_TYPE_LABEL: Record<string, string> = {
    transfer: 'Private Transfer',
    'city-to-city': 'City to City',
    airport: 'Airport Rides',
    'city-tour': 'City Tour',
    hourly: 'Hourly Hire',
    'desert-safari': 'Desert Safari',
  }
  const serviceLabel = rawState.service ? SERVICE_TYPE_LABEL[rawState.service as string] : undefined

  const available = products.filter(p => {
    if (p.passengers < requiredPassengers) return false
    if (serviceLabel && p.serviceType && p.serviceType !== serviceLabel) return false
    return true
  })

  // Returns the best-matching variant + whether the price is an exact match or a fallback estimate
  const getVariantForProduct = (product: TaxiOption): { variant: TaxiVariant | null; isEstimate: boolean } => {
    if (product.variants.length === 0) return { variant: null, isEstimate: false }

    const bandVariants = product.variants.filter(v => /^\d+-\d+\s*(km|miles?)$/i.test(v.title))
    const pool = bandVariants.length > 0 ? bandVariants : product.variants

    // No distance calculated yet → show the cheapest band as a "from" price
    if (!distanceKm) {
      const sorted = [...pool].sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount))
      return { variant: sorted[0] ?? null, isEstimate: true }
    }

    const id = getVariantIdForDistance(product.variants, distanceKm)
    const variant = product.variants.find(v => v.id === id) ?? null
    return { variant, isEstimate: false }
  }

  const handleSelect = (product: TaxiOption) => {
    setSelectedId(product.id)

    const { variant } = getVariantForProduct(product)
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
          distance: distanceKm,
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
      <div
        className="bg-white border-b sticky top-0 z-20"
        style={{ borderColor: 'rgba(46,64,82,0.08)', boxShadow: '0 1px 12px rgba(46,64,82,0.07)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[12px] font-semibold transition-colors px-2.5 py-1.5 rounded-xl cursor-pointer border-none"
            style={{ color: 'rgba(46,64,82,0.55)', backgroundColor: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F5F0'; e.currentTarget.style.color = '#2E4052' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(46,64,82,0.55)' }}
          >
            <ChevronLeft size={16} />
            <span className="hidden xs:inline">Back</span>
          </button>

          <div className="w-px h-5" style={{ backgroundColor: 'rgba(46,64,82,0.12)' }} />

          <div className="min-w-0 flex-1">
            <h1 className="font-head font-bold text-[15px] sm:text-[16px] truncate" style={{ color: '#2E4052' }}>
              Choose Your Vehicle
            </h1>
            {searchDetails.from && searchDetails.to && (
              <p className="text-[11px] truncate hidden sm:block" style={{ color: 'rgba(46,64,82,0.45)' }}>
                {searchDetails.from} → {searchDetails.to}
              </p>
            )}
          </div>

          {!loading && !error && available.length > 0 && (
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full hidden sm:block flex-shrink-0 font-body"
              style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
            >
              {available.length} available
            </span>
          )}

          <button
            className="lg:hidden flex items-center gap-1.5 text-[12px] font-bold rounded-xl px-3 py-1.5 flex-shrink-0 whitespace-nowrap cursor-pointer border-none transition-all duration-200"
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
                <p className="text-[10px] font-bold uppercase tracking-widest font-body" style={{ color: 'rgba(46,64,82,0.45)' }}>
                  Available Vehicles
                </p>
                {!loading && !error && available.length > 0 && (
                  <p className="text-[13px] font-semibold font-head mt-0.5" style={{ color: '#2E4052' }}>
                    Select a vehicle to continue
                  </p>
                )}
              </div>
              {!loading && !error && available.length > 0 && (
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full sm:hidden font-body"
                  style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                >
                  {available.length}
                </span>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 size={28} className="animate-spin" style={{ color: '#2E4052' }} />
                <p className="text-[13px] font-body" style={{ color: 'rgba(46,64,82,0.5)' }}>
                  Loading available vehicles…
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div
                className="bg-white rounded-[20px] px-6 py-10 flex flex-col items-center gap-4 text-center"
                style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.08)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: '#FEE2E2' }}
                >
                  <AlertCircle size={22} className="text-red-400" />
                </div>
                <div>
                  <p className="text-[15px] font-bold font-head" style={{ color: '#2E4052' }}>
                    Could not load vehicles
                  </p>
                  <p className="text-[12px] mt-1 font-body" style={{ color: 'rgba(46,64,82,0.5)' }}>{error}</p>
                </div>
                <button
                  onClick={() => dispatch(fetchTaxiProducts())}
                  className="text-[13px] font-bold px-6 py-2.5 rounded-xl text-white cursor-pointer border-none"
                  style={{ backgroundColor: '#2E4052' }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && available.length === 0 && products.length > 0 && (
              <div
                className="bg-white rounded-[20px] px-6 py-12 text-center"
                style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.08)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#F0F5F0' }}
                >
                  <Car size={24} style={{ color: '#BDD9BF' }} />
                </div>
                <p className="text-[15px] font-bold font-head" style={{ color: '#2E4052' }}>
                  No vehicles for {requiredPassengers} passengers
                </p>
                <p className="text-[12px] mt-1 font-body" style={{ color: 'rgba(46,64,82,0.5)' }}>
                  Try reducing the passenger count.
                </p>
              </div>
            )}

            {/* Vehicle cards */}
            {!loading && !error && (
              <div className="flex flex-col gap-3">
                {available.map(product => {
                  const { variant, isEstimate } = getVariantForProduct(product)
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
                      isEstimate={isEstimate}
                      onSelect={() => handleSelect(product)}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Desktop sidebar ── */}
          <div className="hidden lg:block w-[300px] xl:w-[320px] flex-shrink-0 sticky top-[72px]">
            <TripSummary search={searchDetails} />
          </div>

        </div>
      </div>
    </div>
  )
}
