import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Ruler, Clock, Loader2, Users, Minus, Plus } from 'lucide-react'
import DateTimePicker from '../ui/DateTimePicker'
import { PlacesInput } from '../ui/PlacesInput'
import type { PlaceResult } from '../ui/PlacesInput'
import { loadGoogleMaps } from '../../services/googleMapsLoader'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts, fetchHomepageImages } from '../../store/slices/shopifySlice'

const FALLBACK_IMAGE = '/images/hero.png'

const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")"

function toLocalISO(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

type Tab = 'transfer' | 'airport'

const TAB_CONFIG: Record<Tab, {
  label: string
  service: string
  fromLabel: string
  fromPlaceholder: string
  toLabel: string
  toPlaceholder: string
}> = {
  transfer: {
    label: 'City to City',
    service: 'city-to-city',
    fromLabel: 'From',
    fromPlaceholder: 'Enter pickup location',
    toLabel: 'To',
    toPlaceholder: 'Enter drop-off location',
  },
  airport: {
    label: 'Airport Rides',
    service: 'airport',
    fromLabel: 'Airport / Terminal',
    fromPlaceholder: 'e.g. Dubai International Airport',
    toLabel: 'Drop-off Address',
    toPlaceholder: 'Hotel / home / office address',
  },
}

export default function HeroBooking() {
  const dispatch = useAppDispatch()
  const { products, initialized, heroImages, heroImagesInitialized } = useAppSelector(s => s.shopify)

  useEffect(() => {
    dispatch(fetchTaxiProducts())
    dispatch(fetchHomepageImages())
  }, [dispatch])

  //  Slideshow ─────────────────────────────────────────────────────────────
  const images = heroImagesInitialized && heroImages.length > 0 ? heroImages : [FALLBACK_IMAGE]
  const [activeIdx, setActiveIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (images.length <= 1) return
    timerRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % images.length)
    }, 2000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [images.length])

  //  Google Maps 
  const [mapsReady, setMapsReady] = useState(false)
  useEffect(() => {
    loadGoogleMaps().then(() => setMapsReady(true)).catch(e => console.warn('Maps load failed:', e))
  }, [])

  //  Derive available tabs from Shopify 
  const activeTypes = new Set(products.map(p => p.serviceType).filter(Boolean))
  const showTransfer = !initialized || activeTypes.size === 0 || activeTypes.has('City to City') || activeTypes.has('Private Transfer')
  const showAirport = !initialized || activeTypes.size === 0 || activeTypes.has('Airport Rides')

  //  Form state 
  const [tab, setTab] = useState<Tab>('transfer')
  const cfg = TAB_CONFIG[tab]

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [toCoords, setToCoords] = useState<{ lat: number; lng: number } | null>(null)

  const minNow = useMemo(() => toLocalISO(new Date()), [])
  const [datetime, setDatetime] = useState(minNow)
  const [passengers, setPassengers] = useState(1)
  const [showReturn, setShowReturn] = useState(false)
  const [returnDatetime, setReturnDatetime] = useState('')
  const navigate = useNavigate()

  const [errors, setErrors] = useState<{
    from?: string; to?: string; datetime?: string; returnDatetime?: string
  }>({})

  //  Route calculation (distance + ETA) 
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [durationText, setDurationText] = useState('')
  const [routeLoading, setRouteLoading] = useState(false)

  useEffect(() => {
    if (!fromCoords || !toCoords) {
      setDistanceKm(null); setDurationText(''); return
    }
    const maps = (window as any).google?.maps
    if (!maps?.DistanceMatrixService) return

    setRouteLoading(true)
    new maps.DistanceMatrixService().getDistanceMatrix(
      {
        origins: [fromCoords],
        destinations: [toCoords],
        travelMode: maps.TravelMode.DRIVING,
        unitSystem: maps.UnitSystem.METRIC,
      },
      (response: google.maps.DistanceMatrixResponse, status: google.maps.DistanceMatrixStatus) => {
        setRouteLoading(false)
        if (status !== 'OK' || !response) return
        const el = response.rows[0]?.elements[0]
        if (!el || el.status !== 'OK') return
        setDistanceKm(el.distance.value / 1000)
        setDurationText(el.duration.text)
      }
    )
  }, [fromCoords, toCoords])

  //  Tab switch 
  function switchTab(next: Tab) {
    setTab(next)
    setFrom(''); setTo('')
    setFromCoords(null); setToCoords(null)
    setDistanceKm(null); setDurationText('')
    setShowReturn(false); setReturnDatetime('')
    setErrors({})
  }

  //  Field handlers 
  function handleFromChange(r: PlaceResult) {
    setFrom(r.address); setFromCoords(r.coords ?? null)
    setErrors(e => ({ ...e, from: '' }))
    // Reset route when either location changes
    if (!r.coords) { setDistanceKm(null); setDurationText('') }
  }

  function handleToChange(r: PlaceResult) {
    setTo(r.address); setToCoords(r.coords ?? null)
    setErrors(e => ({ ...e, to: '' }))
    if (!r.coords) { setDistanceKm(null); setDurationText('') }
  }

  function handlePickupChange(val: string) {
    setDatetime(val)
    setErrors(e => ({ ...e, datetime: '' }))
    if (returnDatetime && returnDatetime <= val) setReturnDatetime('')
  }

  const handleCheckFare = () => {
    const e: typeof errors = {}
    if (!from.trim()) e.from = 'Please enter a pickup location'
    if (!to.trim()) e.to = tab === 'airport' ? 'Please enter a drop-off address' : 'Please enter a drop-off location'
    if (!datetime) e.datetime = 'Please select a date and time'
    if (tab === 'transfer' && showReturn && !returnDatetime) e.returnDatetime = 'Please select a return date and time'
    if (Object.keys(e).length) { setErrors(e); return }

    navigate('/vehicles', {
      state: {
        from, to, datetime,
        fromCoords: fromCoords ?? undefined,
        toCoords: toCoords ?? undefined,
        distanceKm: distanceKm ?? undefined,
        duration: durationText || undefined,
        returnDatetime: tab === 'transfer' && showReturn ? returnDatetime : undefined,
        service: cfg.service,
        type: 'transfer',
        passengers,
      },
    })
  }

  const inputCls = 'flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]'
  const showRouteInfo = routeLoading || (distanceKm !== null && durationText !== '')

  return (
    <div className="flex flex-col md:relative md:flex-row md:items-center">
      {/* Mobile-only hero image */}
      <div className="md:hidden relative h-[240px] overflow-hidden flex-shrink-0">
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url('${src}')`, opacity: i === activeIdx ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.35) 100%)' }} />
      </div>

      {/* Desktop-only background slideshow */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center filter brightness-[0.82] saturate-[0.9] transition-opacity duration-1000"
            style={{ backgroundImage: `url('${src}')`, opacity: i === activeIdx ? 1 : 0 }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(110deg, rgba(189,217,191,0.82) 0%, rgba(189,217,191,0.65) 35%, rgba(189,217,191,0.2) 65%, rgba(189,217,191,0.05) 100%)' }}
        />
        <div className="absolute inset-0 opacity-[0.018] pointer-events-none" style={{ backgroundImage: GRAIN_SVG }} />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-container mx-auto px-4 md:px-10 py-5 md:pt-8 md:pb-20 md:py-16 bg-primaryBg md:bg-transparent">
        <div className="flex items-stretch gap-8 lg:gap-16">
          <div className="w-full md:max-w-[420px] md:flex-shrink-0 flex flex-col relative">

            {/* Tabs */}
            <div className="flex gap-2 mb-2">
              {showTransfer && (
                <button
                  type="button"
                  className={`flex-1 py-[13px] text-[14px] font-semibold rounded-2xl cursor-pointer font-body transition-all ${tab === 'transfer' ? 'text-white border-none' : 'bg-white text-muted hover:text-primary border border-[#D4DDE5]'}`}
                  style={tab === 'transfer' ? { background: '#2E4052' } : undefined}
                  onClick={() => switchTab('transfer')}
                >
                  City to City
                </button>
              )}
              {showAirport && (
                <button
                  type="button"
                  className={`flex-1 py-[13px] text-[14px] font-semibold rounded-2xl cursor-pointer font-body transition-all ${tab === 'airport' ? 'text-white border-none' : 'bg-white text-muted hover:text-primary border border-[#D4DDE5]'}`}
                  style={tab === 'airport' ? { background: '#2E4052' } : undefined}
                  onClick={() => switchTab('airport')}
                >
                  Airport Rides
                </button>
              )}
            </div>

            {/* From */}
            <div className="mb-2">
              <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 ${errors.from ? 'ring-2 ring-red-400' : 'border border-[#D4DDE5]'}`}>
                <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">{cfg.fromLabel} *</div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
                  <PlacesInput
                    key={`from-${tab}`}
                    placeholder={cfg.fromPlaceholder}
                    className={inputCls}
                    mapsReady={mapsReady}
                    onPlaceChange={handleFromChange}
                  />
                </div>
              </div>
              {errors.from && <p className="text-[11px] text-red-400 font-medium mt-1 ml-1">{errors.from}</p>}
            </div>

            {/* To */}
            <div className="mb-2">
              <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 ${errors.to ? 'ring-2 ring-red-400' : 'border border-[#D4DDE5]'}`}>
                <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">{cfg.toLabel} *</div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
                  <PlacesInput
                    key={`to-${tab}`}
                    placeholder={cfg.toPlaceholder}
                    className={inputCls}
                    mapsReady={mapsReady}
                    onPlaceChange={handleToChange}
                  />
                </div>
              </div>
              {errors.to && <p className="text-[11px] text-red-400 font-medium mt-1 ml-1">{errors.to}</p>}
            </div>

            {/* Route info — distance & ETA */}
            {showRouteInfo && (
              <div className="mb-2 rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(46,64,82,0.88)', backdropFilter: 'blur(8px)' }}>
                {routeLoading ? (
                  <div className="flex items-center gap-2 px-4 py-3">
                    <Loader2 size={13} className="text-white/60 animate-spin flex-shrink-0" />
                    <span className="text-[13px] text-white/60">Calculating route…</span>
                  </div>
                ) : (
                  <div className="flex divide-x divide-white/10">
                    <div className="flex-1 flex items-center gap-2 px-4 py-3">
                      <Ruler size={13} style={{ color: '#BDD9BF' }} className="flex-shrink-0" />
                      <div>
                        <div className="text-[15px] font-bold text-white font-head leading-none">
                          {distanceKm!.toFixed(1)} km
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          Distance
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 px-4 py-3">
                      <Clock size={13} style={{ color: '#BDD9BF' }} className="flex-shrink-0" />
                      <div>
                        <div className="text-[15px] font-bold text-white font-head leading-none">
                          {durationText}
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          Est. drive time
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pickup date & time */}
            <div className="mb-2">
              <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 ${errors.datetime ? 'ring-2 ring-red-400' : 'border border-[#D4DDE5]'}`}>
                <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">Pickup Date &amp; Time *</div>
                <DateTimePicker
                  value={datetime}
                  onChange={handlePickupChange}
                  min={minNow}
                  placeholder="Select pickup date & time"
                />
              </div>
              {errors.datetime && <p className="text-[11px] text-red-400 font-medium mt-1 ml-1">{errors.datetime}</p>}
            </div>

            {/* Passengers */}
            <div className="mb-2">
              <div className="bg-white rounded-2xl px-4 pt-3 pb-4 border border-[#D4DDE5]">
                <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">Passengers *</div>
                <div className="flex items-center gap-3">
                  <Users size={15} className="text-[#aaa] flex-shrink-0" />
                  <div className="flex items-center gap-3 flex-1">
                    <button type="button" onClick={() => setPassengers(p => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Minus size={13} className="text-primary" />
                    </button>
                    <span className="text-[15px] font-bold text-primary w-8 text-center">{passengers}</span>
                    <button type="button" onClick={() => setPassengers(p => Math.min(14, p + 1))} className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Plus size={13} className="text-primary" />
                    </button>
                    <span className="text-[13px] text-muted ml-1">{passengers === 1 ? '1 passenger' : `${passengers} passengers`}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Return date & time — transfer only */}
            {tab === 'transfer' && showReturn && (
              <div className="mb-2">
                <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 ${errors.returnDatetime ? 'ring-2 ring-red-400' : 'border border-[#D4DDE5]'}`}>
                  <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">Return Date &amp; Time *</div>
                  <DateTimePicker
                    value={returnDatetime}
                    onChange={val => { setReturnDatetime(val); setErrors(e => ({ ...e, returnDatetime: '' })) }}
                    min={datetime}
                    placeholder="Select return date & time"
                  />
                </div>
                {errors.returnDatetime && <p className="text-[11px] text-red-400 font-medium mt-1 ml-1">{errors.returnDatetime}</p>}
              </div>
            )}

            {/* Add / Remove Return — transfer only */}
            {tab === 'transfer' && (
              <div className="bg-white rounded-2xl px-4 py-4 mb-2 flex items-center justify-center border border-[#D4DDE5]">
                <button
                  type="button"
                  className="text-[15px] font-semibold text-primary cursor-pointer bg-transparent border-none font-body transition-colors hover:opacity-70"
                  onClick={() => setShowReturn(v => !v)}
                >
                  {showReturn ? '— Remove Return' : '+ Add Return'}
                </button>
              </div>
            )}

            {/* Check Fare */}
            <button
              type="button"
              className="w-full text-white border-none rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body transition-all hover:brightness-105"
              style={{ background: '#2E4052' }}
              onClick={handleCheckFare}
            >
              Check Fare
            </button>

            {/* Payment methods */}
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[1.4px]">We Accept</span>
              <div className="flex items-center gap-2">
                {[
                  { src: '/payments/visa-svgrepo-com.svg', alt: 'Visa' },
                  { src: '/payments/mastercard-svgrepo-com.svg', alt: 'Mastercard' },
                  { src: '/payments/amex-svgrepo-com.svg', alt: 'American Express' },
                  { src: '/payments/paypal-3-svgrepo-com.svg', alt: 'PayPal' },
                  { src: '/payments/apple-pay-svgrepo-com.svg', alt: 'Apple Pay' },
                  { src: '/payments/google-pay-svgrepo-com.svg', alt: 'Google Pay' },
                  { src: '/payments/stripe-svgrepo-com.svg', alt: 'Stripe' },
                  { src: '/payments/cash-svgrepo-com.svg', alt: 'Cash' },
                ].map(({ src, alt }) => (
                  <img key={alt} src={src} alt={alt} className="h-9 w-auto rounded object-contain" />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Stats pill — mobile only */}
      <div className="md:hidden flex justify-center mx-4 mb-5 bg-white/80 border border-[#D4DDE5] rounded-[14px] overflow-hidden">
        {[
          { num: '4.9★', lbl: 'Rating' },
          { num: '12k+', lbl: 'Rides' },
          { num: '24/7', lbl: 'Support' },
        ].map((s, i) => (
          <div key={i} className={`flex-1 px-4 py-[14px] text-center ${i < 2 ? 'border-r border-[#D4DDE5]' : ''}`}>
            <div className="font-head text-xl font-bold text-primary leading-none">{s.num}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-[0.8px]">{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
