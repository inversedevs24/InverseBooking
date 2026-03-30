import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ruler, Clock } from 'lucide-react'
import DateTimePicker from '../ui/DateTimePicker'
import { Mastercard, Visa, Paypal, Generic } from 'react-payment-logos/dist/flat'
import CashLogo from '../ui/CashLogo'
import { PlacesInput } from '../ui/PlacesInput'
import type { PlaceResult } from '../ui/PlacesInput'
import { loadGoogleMaps } from '../../services/googleMapsLoader'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'

const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")"

function toLocalISO(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function HeroBooking() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products, initialized } = useAppSelector(s => s.shopify)

  useEffect(() => { dispatch(fetchTaxiProducts()) }, [dispatch])

  // Derive tabs from Shopify service types
  const activeTypes = new Set(products.map(p => p.serviceType).filter(Boolean))
  const showTransfer = !initialized || activeTypes.size === 0 || activeTypes.has('Private Transfer')
  const showHourly = !initialized || activeTypes.size === 0 || activeTypes.has('Hourly Hire')

  // Google Maps
  const [mapsReady, setMapsReady] = useState(false)
  useEffect(() => {
    loadGoogleMaps().then(() => setMapsReady(true)).catch(() => {})
  }, [])

  const [tab, setTab] = useState<'transfer' | 'hourly'>('transfer')

  // Location
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [toCoords, setToCoords] = useState<{ lat: number; lng: number } | null>(null)

  // Route result
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null)
  const [durationText, setDurationText] = useState('')

  const minNow = useMemo(() => toLocalISO(new Date()), [])
  const [datetime, setDatetime] = useState(minNow)
  const [showReturn, setShowReturn] = useState(false)
  const [returnDatetime, setReturnDatetime] = useState('')

  // Compute distance when both coords are set
  useEffect(() => {
    if (!fromCoords || !toCoords) { setDistanceMiles(null); setDurationText(''); return }
    const maps = (window as any).google?.maps
    if (!maps?.DistanceMatrixService) return

    new maps.DistanceMatrixService().getDistanceMatrix(
      {
        origins: [fromCoords],
        destinations: [toCoords],
        travelMode: maps.TravelMode.DRIVING,
        unitSystem: maps.UnitSystem.IMPERIAL,
      },
      (response: google.maps.DistanceMatrixResponse, status: google.maps.DistanceMatrixStatus) => {
        if (status !== 'OK') return
        const el = response.rows[0]?.elements[0]
        if (el?.status !== 'OK') return
        setDistanceMiles(el.distance.value / 1609.34)
        setDurationText(el.duration.text)
      }
    )
  }, [fromCoords, toCoords])

  function handleFromChange(r: PlaceResult) { setFrom(r.address); setFromCoords(r.coords) }
  function handleToChange(r: PlaceResult) { setTo(r.address); setToCoords(r.coords) }

  function handlePickupChange(val: string) {
    setDatetime(val)
    if (returnDatetime && returnDatetime <= val) setReturnDatetime('')
  }

  const handleCheckFare = () => {
    navigate('/vehicles', {
      state: {
        from, to, datetime,
        returnDatetime: showReturn ? returnDatetime : undefined,
        type: tab,
        service: tab === 'transfer' ? 'transfer' : 'hourly',
        distanceMiles: distanceMiles ?? undefined,
        duration: durationText || undefined,
        fromCoords: fromCoords ?? undefined,
        toCoords: toCoords ?? undefined,
      },
    })
  }

  const inputCls = 'flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]'

  return (
    <div className="relative flex items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.82] saturate-[0.9] animate-hero-zoom origin-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(110deg, rgba(189,217,191,0.82) 0%, rgba(189,217,191,0.65) 35%, rgba(189,217,191,0.2) 65%, rgba(189,217,191,0.05) 100%)' }}
        />
        <div className="absolute inset-0 opacity-[0.018] pointer-events-none" style={{ backgroundImage: GRAIN_SVG }} />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-container mx-auto px-6 md:px-10 pt-8 pb-20 md:py-16 max-sm:pb-32">

        {/* Heading — mobile only */}
        <div className="md:hidden text-center mb-5">
          <h1 className="font-head text-[2.4rem] text-primary font-extrabold leading-[1.1] mb-3">
            Premium Chauffeur Service in UAE
          </h1>
          <p className="font-head text-[1.1rem] font-semibold text-primary/70 leading-snug mb-1">
            Book Your Ride in 30 Seconds
          </p>
          <p className="font-body text-[0.9rem] font-medium text-muted tracking-wide uppercase">
            Safe, Reliable &amp; Luxury
          </p>
        </div>

        <div className="flex items-center gap-8 lg:gap-16">

          {/* Left: form */}
          <div className="max-w-[420px] w-full flex-shrink-0 flex flex-col">

            {/* Tabs */}
            <div className="flex gap-2 mb-2">
              {showTransfer && (
                <button
                  type="button"
                  className={`flex-1 py-[13px] text-[14px] font-semibold rounded-2xl border-none cursor-pointer font-body transition-all ${tab === 'transfer' ? 'text-white' : 'bg-white text-muted hover:text-primary'}`}
                  style={tab === 'transfer' ? { background: '#2E4052' } : undefined}
                  onClick={() => setTab('transfer')}
                >
                  Private Transfer
                </button>
              )}
              {showHourly && (
                <button
                  type="button"
                  className={`flex-1 py-[13px] text-[14px] font-semibold rounded-2xl border-none cursor-pointer font-body transition-all ${tab === 'hourly' ? 'text-white' : 'bg-white text-muted hover:text-primary'}`}
                  style={tab === 'hourly' ? { background: '#2E4052' } : undefined}
                  onClick={() => { setTab('hourly'); setShowReturn(false) }}
                >
                  Hourly Hire
                </button>
              )}
            </div>

            {/* From */}
            <div className="bg-white rounded-2xl px-4 pt-3 pb-4 mb-2">
              <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">From</div>
              <div className="flex items-center gap-2">
                <span className="text-[#aaa] flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <PlacesInput
                  placeholder="Enter a pickup location"
                  className={inputCls}
                  mapsReady={mapsReady}
                  onPlaceChange={handleFromChange}
                />
              </div>
            </div>

            {/* To */}
            {tab === 'transfer' && (
              <div className="bg-white rounded-2xl px-4 pt-3 pb-4 mb-2">
                <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">To</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#aaa] flex-shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  <PlacesInput
                    placeholder="Enter a dropoff location"
                    className={inputCls}
                    mapsReady={mapsReady}
                    onPlaceChange={handleToChange}
                  />
                </div>
              </div>
            )}

            {/* Route info badge — shows after both locations picked */}
            {tab === 'transfer' && distanceMiles !== null && (
              <div
                className="rounded-2xl px-4 py-2.5 mb-2 flex items-center gap-4"
                style={{ backgroundColor: '#2E4052' }}
              >
                <div className="flex items-center gap-1.5">
                  <Ruler size={12} style={{ color: '#BDD9BF' }} />
                  <span className="text-[13px] font-bold text-white font-head">{distanceMiles.toFixed(1)} mi</span>
                </div>
                <div className="w-px h-3.5 bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <Clock size={12} style={{ color: '#BDD9BF' }} />
                  <span className="text-[13px] font-bold text-white font-head">{durationText}</span>
                </div>
              </div>
            )}

            {/* Pickup date & time */}
            <div className="bg-white rounded-2xl px-4 pt-3 pb-4 mb-2">
              <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">Pickup Date &amp; Time</div>
              <DateTimePicker
                value={datetime}
                onChange={handlePickupChange}
                min={minNow}
                placeholder="Select pickup date & time"
              />
            </div>

            {/* Return date & time */}
            {tab === 'transfer' && showReturn && (
              <div className="bg-white rounded-2xl px-4 pt-3 pb-4 mb-2">
                <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">Return Date &amp; Time</div>
                <DateTimePicker
                  value={returnDatetime}
                  onChange={setReturnDatetime}
                  min={datetime}
                  placeholder="Select return date & time"
                />
              </div>
            )}

            {/* Add / Remove Return */}
            {tab === 'transfer' && (
              <div className="bg-white rounded-2xl px-4 py-4 mb-2 flex items-center justify-center">
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
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[1.4px] whitespace-nowrap flex-shrink-0">We Accept</span>
              <div className="w-px h-5 bg-border flex-shrink-0" />
              <div className="flex items-center gap-3">
                <Visa style={{ height: 28, width: 'auto' }} />
                <Mastercard style={{ height: 28, width: 'auto' }} />
                <Paypal style={{ height: 28, width: 'auto' }} />
                <Generic style={{ height: 28, width: 'auto' }} />
                <CashLogo style={{ height: 28, width: 'auto' }} />
              </div>
            </div>
          </div>

          {/* Right: hero text — desktop only */}
          <div className="hidden md:flex flex-1 flex-col justify-center">
            <p className="font-body text-[0.85rem] font-bold text-primary/60 tracking-[2px] uppercase mb-4">
              Safe, Reliable &amp; Luxury
            </p>
            <h1 className="font-head text-[3rem] lg:text-[3.8rem] text-primary font-extrabold leading-[1.08] mb-5">
              Premium<br />Chauffeur<br />Service in UAE
            </h1>
            <p className="font-head text-[1.15rem] lg:text-[1.3rem] font-semibold text-primary/70 leading-snug mb-8">
              Book Your Ride in 30 Seconds
            </p>
            <div className="flex items-center gap-6">
              {[{ num: '4.9★', lbl: 'Rating' }, { num: '12k+', lbl: 'Rides' }, { num: '24/7', lbl: 'Support' }].map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-head text-[1.6rem] font-bold text-primary leading-none">{s.num}</span>
                  <span className="text-[11px] text-muted uppercase tracking-[0.8px] mt-1">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats pill — mobile only */}
      <div className="md:hidden absolute bottom-4 right-4 left-4 z-[3] flex justify-center bg-white/80 backdrop-blur-[12px] border border-[#D4DDE5] rounded-[14px] overflow-hidden">
        {[{ num: '4.9★', lbl: 'Rating' }, { num: '12k+', lbl: 'Rides' }, { num: '24/7', lbl: 'Support' }].map((s, i) => (
          <div key={i} className={`flex-1 px-4 py-[14px] text-center ${i < 2 ? 'border-r border-[#D4DDE5]' : ''}`}>
            <div className="font-head text-xl font-bold text-primary leading-none">{s.num}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-[0.8px]">{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
