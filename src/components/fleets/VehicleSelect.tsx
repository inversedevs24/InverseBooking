import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft, Users, Luggage, MapPin, CalendarDays,
  Clock, Ruler, CheckCircle2, ArrowRight, Zap, Loader2,
  AlertCircle, Star, Car, ChevronDown, ChevronUp, Expand,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import { getVariantIdForDistance } from '../../services/shopifyClient'
import { loadGoogleMaps } from '../../services/googleMapsLoader'
import VehicleDetailModal from './VehicleDetailModal'
import type { TaxiOption, TaxiVariant, SearchDetails } from '../../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-AE', {
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
      .catch(() => { /* silently skip */ })
  }, [])

  return <div ref={divRef} style={{ height: 160, borderRadius: 16, overflow: 'hidden' }} />
}

// ─── Trip Summary ─────────────────────────────────────────────────────────────

function TripSummary({ search }: { search: SearchDetails }) {
  const hasRoute = !!(search.fromCoords && search.toCoords)

  return (
    <div className="flex flex-col gap-3">
      {hasRoute && (
        <RouteMapPreview fromCoords={search.fromCoords!} toCoords={search.toCoords!} />
      )}

      {/* Route card */}
      <div
        className="rounded-[20px] overflow-hidden"
        style={{ boxShadow: '0 4px 24px rgba(46,64,82,0.12)' }}
      >
        <div
          className="px-5 pt-5 pb-4"
          style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}
        >
          <p className="text-[9px] font-extrabold uppercase tracking-widest mb-4 font-body" style={{ color: '#BDD9BF' }}>
            Trip Summary
          </p>

          <div className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <div className="w-px flex-1 my-1.5" style={{ minHeight: 28, backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: 'rgba(255,255,255,0.5)' }} />
            </div>
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5 font-body" style={{ color: '#BDD9BF' }}>
                  Pickup
                </p>
                <p className="text-[13px] font-bold text-white leading-tight font-head">{search.from || '—'}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5 font-body" style={{ color: '#BDD9BF' }}>
                  Drop-off
                </p>
                <p className="text-[13px] font-bold text-white leading-tight font-head">{search.to || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x bg-white" style={{ borderColor: '#F0F5F0' }}>
          {[
            { Icon: CalendarDays, val: formatDate(search.date), sub: 'Date' },
            { Icon: Ruler, val: search.distance ? `${search.distance.toFixed(1)} km` : '—', sub: 'Distance' },
            { Icon: Clock, val: search.duration || '—', sub: 'Est. time' },
          ].map(({ Icon, val, sub }, i) => (
            <div key={i} className="px-3 py-3 text-center" style={{ borderColor: '#F0F5F0' }}>
              <Icon size={12} className="mx-auto mb-1" style={{ color: '#BDD9BF' }} />
              <p className="text-[11px] font-bold font-head leading-tight" style={{ color: '#2E4052' }}>{val}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'rgba(46,64,82,0.4)' }}>
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Return trip */}
      {search.tripType === 'return' && (
        <div className="bg-white rounded-2xl px-4 py-3" style={{ boxShadow: '0 2px 12px rgba(46,64,82,0.07)' }}>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-1 font-body" style={{ color: 'rgba(46,64,82,0.4)' }}>
            Return Trip
          </p>
          <p className="text-[13px] font-semibold font-head" style={{ color: '#2E4052' }}>
            {search.returnDate ? formatDate(search.returnDate) : '—'}
            {search.returnTime ? ` at ${search.returnTime}` : ''}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden animate-pulse" style={{ boxShadow: '0 4px 24px rgba(46,64,82,0.08)' }}>
      <div className="aspect-[16/7] bg-slate-100" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-slate-100 rounded-lg w-36" />
            <div className="h-3 bg-slate-100 rounded-lg w-24" />
          </div>
          <div className="h-7 bg-slate-100 rounded-xl w-28 flex-shrink-0" />
        </div>
        <div className="flex gap-2">
          <div className="h-7 bg-slate-100 rounded-full w-16" />
          <div className="h-7 bg-slate-100 rounded-full w-16" />
          <div className="h-7 bg-slate-100 rounded-full w-20" />
        </div>
      </div>
    </div>
  )
}

//  Vehicle Card 

function VehicleCard({
  vehicle,
  selected,
  priceDisplay,
  currencyCode,
  isEstimate,
  isReturn,
  onSelect,
  onViewDetails,
}: {
  vehicle: TaxiOption
  selected: boolean
  priceDisplay: string
  currencyCode: string
  isEstimate: boolean
  isReturn: boolean
  onSelect: () => void
  onViewDetails: () => void
}) {
  const sym = currencyCode === 'USD' ? '$' : currencyCode === 'AED' ? 'AED ' : currencyCode

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
      className="group relative bg-white overflow-hidden cursor-pointer flex flex-col md:flex-row"
      style={{
        borderRadius: 24,
        boxShadow: selected
          ? '0 0 0 2.5px #FFC857, 0 16px 48px rgba(46,64,82,0.16)'
          : '0 4px 24px rgba(46,64,82,0.08)',
        transform: selected ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        touchAction: 'manipulation',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.boxShadow = '0 12px 36px rgba(46,64,82,0.14)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(46,64,82,0.08)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {/* Gold top accent stripe when selected */}
      {selected && (
        <div
          className="absolute top-0 inset-x-0 z-10 pointer-events-none"
          style={{ height: 3, backgroundColor: '#FFC857', borderRadius: '24px 24px 0 0' }}
        />
      )}

      {/* ── Image column ── */}
      <div
        className="relative aspect-[16/7] md:aspect-auto md:w-[210px] flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: '#EAF0EA', minHeight: 120 }}
        onClick={e => { e.stopPropagation(); onViewDetails() }}
      >
        {vehicle.image ? (
          <img
            src={vehicle.image}
            alt={vehicle.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.05]"
            style={{ padding: 10 }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Car size={48} style={{ color: '#BDD9BF' }} />
          </div>
        )}

        {/* View details overlay hint */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ backgroundColor: 'rgba(46,64,82,0.18)' }}
        >
          <div
            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#2E4052' }}
          >
            <Expand size={11} />
            View Details
          </div>
        </div>

        {/* Popular badge */}
        {vehicle.popular && (
          <div
            className="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#FFC857', color: '#2E4052', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
          >
            Popular
          </div>
        )}

        {/* Rating badge */}
        {vehicle.rating > 0 && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Star size={10} fill="#FFC857" stroke="none" />
            <span className="text-[10px] font-bold font-body" style={{ color: '#2E4052' }}>
              {vehicle.rating.toFixed(1)}
              {vehicle.reviews > 0 && (
                <span className="font-normal" style={{ color: 'rgba(46,64,82,0.55)' }}> ({vehicle.reviews})</span>
              )}
            </span>
          </div>
        )}

        {/* Selected check overlay */}
        {selected && (
          <div
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#2E4052', boxShadow: '0 2px 10px rgba(46,64,82,0.4)' }}
          >
            <CheckCircle2 size={16} className="text-white" />
          </div>
        )}

        {/* Subtle right-edge fade for desktop */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{ background: 'linear-gradient(to right, transparent 70%, rgba(255,255,255,0.15) 100%)' }}
        />
      </div>

      {/* ── Info column ── */}
      <div className="flex-1 min-w-0 px-5 py-4 flex flex-col justify-between gap-3">

        {/* Name + Price */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3
              className="font-head font-bold text-[15px] sm:text-[16px] leading-snug line-clamp-2"
              style={{ color: '#2E4052' }}
            >
              {vehicle.name}
            </h3>
            {vehicle.vehicleType && (
              <p className="text-[12px] mt-0.5 font-body truncate" style={{ color: '#6B7A8A' }}>
                {vehicle.vehicleType}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex-shrink-0 text-right">
            {priceDisplay !== '—' ? (
              <>
                {isReturn && (
                  <span
                    className="inline-block text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1"
                    style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                  >
                    Return Trip
                  </span>
                )}
                <p
                  className="font-head font-bold leading-none"
                  style={{ color: '#2E4052', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}
                >
                  {isEstimate && (
                    <span className="text-[11px] font-semibold mr-0.5" style={{ color: '#6B7A8A' }}>From </span>
                  )}
                  {sym}{priceDisplay}
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-wide mt-1 font-body" style={{ color: '#6B7A8A' }}>
                  {isEstimate ? 'starting price' : 'est. total'}
                </p>
              </>
            ) : (
              <span className="text-[12px] font-semibold font-body" style={{ color: '#6B7A8A' }}>
                Contact us
              </span>
            )}
          </div>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
          >
            <Users size={9} /> {vehicle.passengers} pax
          </span>
          <span
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
          >
            <Luggage size={9} /> {vehicle.luggage} bags
          </span>
          {vehicle.features.slice(0, 3).map(f => (
            <span
              key={f}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── Desktop arrow indicator ── */}
      <div className="hidden md:flex items-center px-4 flex-shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: selected ? '#2E4052' : '#F0F5F0',
            transform: selected ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {selected
            ? <CheckCircle2 size={17} className="text-white" />
            : <ArrowRight size={15} style={{ color: '#2E4052' }} className="transition-transform duration-200 group-hover:translate-x-0.5" />
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
  const { distance: distanceKm, passengers: requiredPassengers } = searchDetails

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [summaryOpen, setSummaryOpen] = useState(true)
  const [detailVehicle, setDetailVehicle] = useState<TaxiOption | null>(null)

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

  const getVariantForProduct = (product: TaxiOption): { variant: TaxiVariant | null; isEstimate: boolean } => {
    if (product.variants.length === 0) return { variant: null, isEstimate: false }

    const bandVariants = product.variants.filter(v => /^\d+-\d+\s*(km|miles?)$/i.test(v.title))
    const pool = bandVariants.length > 0 ? bandVariants : product.variants

    if (!distanceKm) {
      const sorted = [...pool].sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount))
      return { variant: sorted[0] ?? null, isEstimate: true }
    }

    const id = getVariantIdForDistance(product.variants, distanceKm)
    const variant = product.variants.find(v => v.id === id) ?? null
    return { variant, isEstimate: false }
  }

  const selectedProduct = selectedId ? available.find(p => p.id === selectedId) ?? null : null
  const selectedVariantData = selectedProduct ? getVariantForProduct(selectedProduct) : null

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
          serviceType: product.serviceType,
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
    }, 260)
  }

  // Currency symbol helper for sticky bar
  const getCurrencySymbol = (code: string) =>
    code === 'USD' ? '$' : code === 'AED' ? 'AED ' : code

  return (
    <div className="min-h-dvh font-body" style={{ backgroundColor: '#F0F5F0' }}>

      {/* ── Sticky frosted header ── */}
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[12px] font-semibold rounded-xl px-2.5 py-1.5 transition-all duration-150 cursor-pointer border-none flex-shrink-0"
            style={{ color: 'rgba(46,64,82,0.55)', backgroundColor: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F5F0'; e.currentTarget.style.color = '#2E4052' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(46,64,82,0.55)' }}
            aria-label="Go back"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="w-px h-5 flex-shrink-0" style={{ backgroundColor: 'rgba(46,64,82,0.1)' }} />

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="font-head font-bold text-[15px] sm:text-[16px] truncate" style={{ color: '#2E4052' }}>
              Choose Your Vehicle
            </h1>
            {searchDetails.from && searchDetails.to && (
              <p className="text-[11px] truncate hidden sm:block" style={{ color: 'rgba(46,64,82,0.45)' }}>
                {searchDetails.from} → {searchDetails.to}
              </p>
            )}
          </div>

          {/* Available count pill — desktop */}
          {!loading && !error && available.length > 0 && (
            <span
              className="hidden sm:block text-[11px] font-bold px-3 py-1 rounded-full flex-shrink-0 font-body"
              style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
            >
              {available.length} available
            </span>
          )}

          {/* Trip summary toggle — mobile */}
          <button
            onClick={() => setSummaryOpen(v => !v)}
            className="lg:hidden flex items-center gap-1.5 text-[12px] font-bold rounded-xl px-3 py-1.5 flex-shrink-0 cursor-pointer border-none transition-all duration-200"
            style={summaryOpen
              ? { backgroundColor: '#2E4052', color: '#fff' }
              : { backgroundColor: '#BDD9BF', color: '#2E4052' }
            }
            aria-expanded={summaryOpen}
            aria-label="Toggle trip summary"
          >
            <MapPin size={13} />
            <span className="hidden xs:inline">Trip</span>
            {summaryOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* ── Mobile collapsible trip summary ── */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: summaryOpen ? 600 : 0, opacity: summaryOpen ? 1 : 0 }}
      >
        <div className="px-4 pt-4 pb-2">
          <TripSummary search={searchDetails} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        <div className="flex gap-7 items-start">

          {/* ── Vehicle list ── */}
          <div className="flex-1 min-w-0">

            {/* Section header */}
            {!loading && !error && available.length > 0 && (
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest font-body" style={{ color: 'rgba(46,64,82,0.4)' }}>
                    Available Vehicles
                  </p>
                  <p className="text-[14px] font-semibold font-head mt-0.5" style={{ color: '#2E4052' }}>
                    Select a vehicle to continue
                  </p>
                </div>
                <span
                  className="sm:hidden text-[11px] font-bold px-2.5 py-1 rounded-full font-body"
                  style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                >
                  {available.length}
                </span>
              </div>
            )}

            {/* ── Loading skeletons ── */}
            {loading && (
              <div className="flex flex-col gap-4">
                <div className="h-4 w-40 bg-white rounded-lg animate-pulse mb-1" style={{ opacity: 0.7 }} />
                {[1, 2, 3].map(i => <VehicleCardSkeleton key={i} />)}
              </div>
            )}

            {/* ── Error state ── */}
            {!loading && error && (
              <div
                className="bg-white rounded-[24px] px-6 py-12 flex flex-col items-center gap-4 text-center"
                style={{ boxShadow: '0 4px 24px rgba(46,64,82,0.08)' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                  <AlertCircle size={22} className="text-red-400" />
                </div>
                <div>
                  <p className="text-[15px] font-bold font-head" style={{ color: '#2E4052' }}>
                    Could not load vehicles
                  </p>
                  <p className="text-[12px] mt-1 font-body" style={{ color: '#6B7A8A' }}>{error}</p>
                </div>
                <button
                  onClick={() => dispatch(fetchTaxiProducts())}
                  className="text-[13px] font-bold px-6 py-2.5 rounded-xl text-white cursor-pointer border-none transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#2E4052' }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* ── Empty state ── */}
            {!loading && !error && available.length === 0 && products.length > 0 && (
              <div
                className="bg-white rounded-[24px] px-6 py-14 text-center"
                style={{ boxShadow: '0 4px 24px rgba(46,64,82,0.08)' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F0F5F0' }}>
                  <Car size={26} style={{ color: '#BDD9BF' }} />
                </div>
                <p className="text-[15px] font-bold font-head" style={{ color: '#2E4052' }}>
                  No vehicles for {requiredPassengers} passengers
                </p>
                <p className="text-[12px] mt-1 font-body" style={{ color: '#6B7A8A' }}>
                  Try reducing the passenger count.
                </p>
              </div>
            )}

            {/* ── Vehicle cards ── */}
            {!loading && !error && (
              <div className="flex flex-col gap-4">
                {available.map(product => {
                  const { variant, isEstimate } = getVariantForProduct(product)
                  const isReturn = searchDetails.tripType === 'return'
                  const quantity = isReturn ? 2 : 1
                  const priceDisplay = variant
                    ? (parseFloat(variant.price.amount) * quantity).toFixed(2)
                    : '—'
                  const currencyCode = variant?.price.currencyCode ?? 'AED'

                  return (
                    <VehicleCard
                      key={product.id}
                      vehicle={product}
                      selected={selectedId === product.id}
                      priceDisplay={priceDisplay}
                      currencyCode={currencyCode}
                      isEstimate={isEstimate}
                      isReturn={isReturn}
                      onSelect={() => handleSelect(product)}
                      onViewDetails={() => setDetailVehicle(product)}
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

      {/* ── Vehicle detail modal ── */}
      {detailVehicle && (
        <VehicleDetailModal
          vehicle={detailVehicle}
          onClose={() => setDetailVehicle(null)}
          onSelect={() => { setDetailVehicle(null); handleSelect(detailVehicle) }}
        />
      )}

      {/* ── Sticky bottom selected bar (mobile / tablet) ── */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 transition-all duration-300 ease-in-out"
        style={{
          transform: selectedProduct ? 'translateY(0)' : 'translateY(100%)',
          opacity: selectedProduct ? 1 : 0,
          pointerEvents: selectedProduct ? 'auto' : 'none',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div
          className="mx-4 mb-4 rounded-[20px] px-4 py-3 flex items-center gap-3"
          style={{
            backgroundColor: '#2E4052',
            boxShadow: '0 -4px 32px rgba(46,64,82,0.25)',
          }}
        >
          {/* Vehicle thumb */}
          {selectedProduct?.image && (
            <div className="w-12 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: '#EAF0EA' }}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-contain"
                style={{ padding: 2 }}
              />
            </div>
          )}

          {/* Name + price */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white font-head truncate leading-tight">
              {selectedProduct?.name}
            </p>
            {selectedVariantData?.variant && (
              <p className="text-[11px] font-semibold font-body" style={{ color: '#BDD9BF' }}>
                {getCurrencySymbol(selectedVariantData.variant.price.currencyCode)}
                {(parseFloat(selectedVariantData.variant.price.amount) * (searchDetails.tripType === 'return' ? 2 : 1)).toFixed(2)}
                <span className="opacity-60"> est. total</span>
              </p>
            )}
          </div>

          {/* Loading spinner while navigating */}
          <div className="flex items-center gap-1.5 flex-shrink-0 text-[12px] font-bold rounded-xl px-4 py-2"
            style={{ backgroundColor: '#FFC857', color: '#2E4052' }}>
            <Loader2 size={13} className="animate-spin" />
            <span>Loading…</span>
          </div>
        </div>
      </div>

    </div>
  )
}
