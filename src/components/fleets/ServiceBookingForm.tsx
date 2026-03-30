import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, Clock, Calendar, Users, Plus, Minus, ArrowRight, RotateCcw, Ruler, AlertCircle, Loader2 } from 'lucide-react'
import { loadGoogleMaps } from '../../services/googleMapsLoader'
import { PlacesInput } from '../ui/PlacesInput'
import type { PlaceResult } from '../ui/PlacesInput'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'

// ─── Service definitions (full UI config; tabs filtered live by Shopify) ───────

type ServiceKey =
    | 'transfer'
    | 'city-to-city'
    | 'airport'
    | 'city-tour'
    | 'hourly'
    | 'desert-safari'

interface ServiceConfig {
    label: string
    shopifyLabel: string    // matches serviceType metafield value in Shopify
    showTo: boolean
    showReturn: boolean
    showHours: boolean
    showPassengers: boolean
    fromPlaceholder: string
    toPlaceholder: string
    image: string
    description: string
}

const SERVICE_CONFIG: Record<ServiceKey, ServiceConfig> = {
    transfer: {
        label: 'Private Transfer',
        shopifyLabel: 'Private Transfer',
        showTo: true, showReturn: true, showHours: false, showPassengers: true,
        fromPlaceholder: 'Enter pickup location',
        toPlaceholder: 'Enter drop-off location',
        image: 'https://images.pexels.com/photos/35641543/pexels-photo-35641543.jpeg',
        description: 'Door-to-door private transfer at a fixed price.',
    },
    'city-to-city': {
        label: 'City to City',
        shopifyLabel: 'City to City',
        showTo: true, showReturn: true, showHours: false, showPassengers: true,
        fromPlaceholder: 'Departure city (e.g. Dubai)',
        toPlaceholder: 'Destination city (e.g. Abu Dhabi)',
        image: 'https://images.pexels.com/photos/4491946/pexels-photo-4491946.jpeg',
        description: 'Intercity transfers between major UAE cities.',
    },
    airport: {
        label: 'Airport Rides',
        shopifyLabel: 'Airport Rides',
        showTo: true, showReturn: true, showHours: false, showPassengers: true,
        fromPlaceholder: 'Airport name or terminal',
        toPlaceholder: 'Hotel / home / office address',
        image: 'https://images.pexels.com/photos/6604557/pexels-photo-6604557.jpeg',
        description: 'Meet & greet, flight tracking, free waiting time.',
    },
    'city-tour': {
        label: 'City Tour',
        shopifyLabel: 'City Tour',
        showTo: false, showReturn: false, showHours: true, showPassengers: true,
        fromPlaceholder: 'Your hotel / starting point',
        toPlaceholder: '',
        image: 'https://images.pexels.com/photos/4348092/pexels-photo-4348092.jpeg',
        description: 'Guided city tours with a professional chauffeur.',
    },
    hourly: {
        label: 'Hourly Hire',
        shopifyLabel: 'Hourly Hire',
        showTo: false, showReturn: false, showHours: true, showPassengers: true,
        fromPlaceholder: 'Your pickup location',
        toPlaceholder: '',
        image: 'https://cdn.prod.website-files.com/656e39bd8b07a811ace24224/656e39bd8b07a811ace2462a_falt.webp',
        description: 'Hire a chauffeur by the hour — minimum 3 hours.',
    },
    'desert-safari': {
        label: 'Desert Safari',
        shopifyLabel: 'Desert Safari',
        showTo: false, showReturn: true, showHours: false, showPassengers: true,
        fromPlaceholder: 'Hotel / pickup address',
        toPlaceholder: '',
        image: 'https://images.pexels.com/photos/5604852/pexels-photo-5604852.jpeg',
        description: 'Premium desert safari transfers from your hotel.',
    },
}

// Maps Shopify serviceType string → local ServiceKey
const SHOPIFY_LABEL_TO_KEY: Record<string, ServiceKey> = Object.fromEntries(
    (Object.entries(SERVICE_CONFIG) as [ServiceKey, ServiceConfig][]).map(([k, v]) => [v.shopifyLabel, k])
) as Record<string, ServiceKey>

const DEFAULT_SERVICE: ServiceKey = 'transfer'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalISO(d: Date) {
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

// ─── Card wrapper ──────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            {children}
        </div>
    )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">
            {children}
        </div>
    )
}

// ─── Route Info Card ───────────────────────────────────────────────────────────

function RouteInfoCard({
    distanceKm,
    durationText,
    loading,
    error,
}: {
    distanceKm: number | null
    durationText: string
    loading: boolean
    error: string
}) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-2 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                <Loader2 size={14} className="text-primary animate-spin flex-shrink-0" />
                <span className="text-[13px] text-muted">Calculating route…</span>
            </div>
        )
    }
    if (error) {
        return (
            <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-2 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <span className="text-[13px] text-red-400">{error}</span>
            </div>
        )
    }
    if (distanceKm === null) return null

    return (
        <div className="rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.06)]" style={{ backgroundColor: '#2E4052' }}>
            <div className="flex divide-x divide-white/10">
                <div className="flex-1 flex flex-col items-center py-3 px-2 gap-0.5">
                    <Ruler size={13} style={{ color: '#BDD9BF' }} />
                    <span className="text-[15px] font-bold text-white font-head leading-tight">
                        {distanceKm.toFixed(1)} mi
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Distance
                    </span>
                </div>
                <div className="flex-1 flex flex-col items-center py-3 px-2 gap-0.5">
                    <Clock size={13} style={{ color: '#BDD9BF' }} />
                    <span className="text-[15px] font-bold text-white font-head leading-tight">
                        {durationText}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Est. drive time
                    </span>
                </div>
            </div>
        </div>
    )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ServiceBookingForm() {
    const navigate = useNavigate()
    const [params] = useSearchParams()

    // ── Shopify: derive available service tabs ────────────────────────────────
    const dispatch = useAppDispatch()
    const { products, initialized } = useAppSelector(s => s.shopify)

    useEffect(() => { dispatch(fetchTaxiProducts()) }, [dispatch])

    const availableServiceKeys = useMemo<ServiceKey[]>(() => {
        if (!initialized || products.length === 0) {
            return Object.keys(SERVICE_CONFIG) as ServiceKey[]
        }
        const seen = new Set<ServiceKey>()
        for (const p of products) {
            if (!p.serviceType) continue
            const key = SHOPIFY_LABEL_TO_KEY[p.serviceType]
            if (key) seen.add(key)
        }
        // preserve order from SERVICE_CONFIG
        const ordered = (Object.keys(SERVICE_CONFIG) as ServiceKey[]).filter(k => seen.has(k))
        return ordered.length > 0 ? ordered : Object.keys(SERVICE_CONFIG) as ServiceKey[]
    }, [products, initialized])

    const rawServiceKey = (params.get('service') ?? DEFAULT_SERVICE) as ServiceKey
    const serviceKey = availableServiceKeys.includes(rawServiceKey) ? rawServiceKey : (availableServiceKeys[0] ?? DEFAULT_SERVICE)
    const config = SERVICE_CONFIG[serviceKey]

    // ── Google Maps ───────────────────────────────────────────────────────────
    const [mapsReady, setMapsReady] = useState(false)

    useEffect(() => {
        loadGoogleMaps()
            .then(() => setMapsReady(true))
            .catch(e => console.warn('Maps load failed:', e))
    }, [])

    // ── Location state ────────────────────────────────────────────────────────
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null)
    const [toCoords, setToCoords] = useState<{ lat: number; lng: number } | null>(null)

    // ── Route calculation ─────────────────────────────────────────────────────
    const [distanceKm, setDistanceKm] = useState<number | null>(null)
    const [durationText, setDurationText] = useState('')
    const [routeLoading, setRouteLoading] = useState(false)
    const [routeError, setRouteError] = useState('')

    // ── Form state ────────────────────────────────────────────────────────────
    const minNow = useMemo(() => toLocalISO(new Date()), [])
    const [datetime, setDatetime] = useState(minNow)
    const [returnDatetime, setReturnDatetime] = useState('')
    const [showReturn, setShowReturn] = useState(false)
    const [passengers, setPassengers] = useState(1)
    const [hours, setHours] = useState(3)

    // Reset locations when switching service tab
    useEffect(() => {
        setFrom(''); setTo(''); setFromCoords(null); setToCoords(null)
        setDistanceKm(null); setDurationText(''); setRouteError('')
    }, [serviceKey])

    // Compute distance whenever both coords are available
    useEffect(() => {
        if (!fromCoords || !toCoords) {
            setDistanceKm(null); setDurationText(''); setRouteError(''); return
        }
        const maps = (window as any).google?.maps
        if (!maps?.DistanceMatrixService) return

        setRouteLoading(true); setRouteError('')

        new maps.DistanceMatrixService().getDistanceMatrix(
            {
                origins: [fromCoords],
                destinations: [toCoords],
                travelMode: maps.TravelMode.DRIVING,
                unitSystem: maps.UnitSystem.IMPERIAL,
            },
            (response: google.maps.DistanceMatrixResponse, status: google.maps.DistanceMatrixStatus) => {
                setRouteLoading(false)
                if (status !== 'OK' || !response) {
                    setRouteError('Could not calculate route between these locations.'); return
                }
                const el = response.rows[0]?.elements[0]
                if (!el || el.status !== 'OK') {
                    setRouteError('No driving route found between these locations.'); return
                }
                setDistanceKm(el.distance.value / 1609.34)
                setDurationText(el.duration.text)
            }
        )
    }, [fromCoords, toCoords])

    function handleFromChange(r: PlaceResult) { setFrom(r.address); setFromCoords(r.coords) }
    function handleToChange(r: PlaceResult) { setTo(r.address); setToCoords(r.coords) }

    function handlePickupTimeChange(val: string) {
        setDatetime(val)
        if (returnDatetime && returnDatetime <= val) setReturnDatetime('')
    }

    function handleSubmit() {
        navigate('/vehicles', {
            state: {
                from, to, datetime,
                returnDatetime: showReturn ? returnDatetime : undefined,
                service: serviceKey,
                passengers,
                hours: config.showHours ? hours : undefined,
                type: config.showHours ? 'hourly' : 'transfer',
                distanceKm: distanceKm ?? undefined,
                duration: durationText || undefined,
            },
        })
    }

    const inputCls = 'flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]'
    const showRouteInfo = config.showTo && (routeLoading || routeError !== '' || distanceKm !== null)

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F0F5F0' }}>

            {/* Hero banner */}
            <div className="relative h-[200px] sm:h-[240px] overflow-hidden">
                <img src={config.image} alt={config.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="font-head text-[24px] sm:text-[30px] font-bold text-white leading-none mb-1">
                        {config.label}
                    </h1>
                    <p className="text-[13px] text-white/70 max-w-xs">{config.description}</p>
                </div>
            </div>

            {/* Service tabs — only shows services that exist in Shopify */}
            <div className="bg-white border-b border-border shadow-[0_1px_4px_rgba(15,23,42,0.05)] sticky top-0 z-10">
                <div className="flex overflow-x-auto justify-start sm:justify-center" style={{ scrollbarWidth: 'none' }}>
                    {availableServiceKeys.map(key => (
                        <button
                            key={key}
                            onClick={() => navigate(`/book?service=${key}`)}
                            className={`flex items-center gap-1.5 px-3.5 py-3.5 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                                key === serviceKey
                                    ? 'text-primary border-primary'
                                    : 'text-muted border-transparent hover:text-primary hover:border-border'
                            }`}
                        >
                            {SERVICE_CONFIG[key].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form */}
            <div className="max-w-[480px] mx-auto px-5 py-8 flex flex-col gap-2">

                {/* Pickup location */}
                <Card>
                    <FieldLabel>{serviceKey === 'airport' ? 'Airport / Terminal' : 'Pickup Location'}</FieldLabel>
                    <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
                        <PlacesInput
                            placeholder={config.fromPlaceholder}
                            className={inputCls}
                            mapsReady={mapsReady}
                            onPlaceChange={handleFromChange}
                        />
                    </div>
                </Card>

                {/* Destination */}
                {config.showTo && (
                    <Card>
                        <FieldLabel>{serviceKey === 'airport' ? 'Drop-off Address' : 'Destination'}</FieldLabel>
                        <div className="flex items-center gap-2">
                            <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
                            <PlacesInput
                                placeholder={config.toPlaceholder}
                                className={inputCls}
                                mapsReady={mapsReady}
                                onPlaceChange={handleToChange}
                            />
                        </div>
                    </Card>
                )}

                {/* Route info — distance + estimated time */}
                {showRouteInfo && (
                    <RouteInfoCard
                        distanceKm={distanceKm}
                        durationText={durationText}
                        loading={routeLoading}
                        error={routeError}
                    />
                )}

                {/* Pickup date & time */}
                <Card>
                    <FieldLabel>Pickup Date &amp; Time</FieldLabel>
                    <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-[#aaa] flex-shrink-0" />
                        <input
                            type="datetime-local"
                            className={inputCls}
                            value={datetime}
                            min={minNow}
                            onChange={e => handlePickupTimeChange(e.target.value)}
                        />
                    </div>
                </Card>

                {/* Duration — hourly / city tour */}
                {config.showHours && (
                    <Card>
                        <FieldLabel>Duration (hours)</FieldLabel>
                        <div className="flex items-center gap-3">
                            <Clock size={15} className="text-[#aaa] flex-shrink-0" />
                            <div className="flex items-center gap-3 flex-1">
                                <button type="button" onClick={() => setHours(h => Math.max(3, h - 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                                    <Minus size={13} className="text-primary" />
                                </button>
                                <span className="text-[15px] font-bold text-primary w-8 text-center">{hours}</span>
                                <button type="button" onClick={() => setHours(h => Math.min(14, h + 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                                    <Plus size={13} className="text-primary" />
                                </button>
                                <span className="text-[13px] text-muted ml-1">
                                    {hours === 3 ? 'min 3 hrs' : `${hours} hrs`}
                                </span>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Passengers */}
                {config.showPassengers && (
                    <Card>
                        <FieldLabel>Passengers</FieldLabel>
                        <div className="flex items-center gap-3">
                            <Users size={15} className="text-[#aaa] flex-shrink-0" />
                            <div className="flex items-center gap-3 flex-1">
                                <button type="button" onClick={() => setPassengers(p => Math.max(1, p - 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                                    <Minus size={13} className="text-primary" />
                                </button>
                                <span className="text-[15px] font-bold text-primary w-8 text-center">{passengers}</span>
                                <button type="button" onClick={() => setPassengers(p => Math.min(14, p + 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                                    <Plus size={13} className="text-primary" />
                                </button>
                                <span className="text-[13px] text-muted ml-1">
                                    {passengers === 1 ? '1 passenger' : `${passengers} passengers`}
                                </span>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Return trip toggle + picker */}
                {config.showReturn && (
                    <>
                        <div className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center gap-2 text-[14px] font-semibold text-primary">
                                <RotateCcw size={15} className="text-[#aaa]" />
                                Add Return Trip
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowReturn(v => !v)}
                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${showReturn ? 'bg-primary' : 'bg-slate-200'}`}
                            >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${showReturn ? 'left-5' : 'left-0.5'}`} />
                            </button>
                        </div>
                        {showReturn && (
                            <Card>
                                <FieldLabel>Return Date &amp; Time</FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Calendar size={15} className="text-[#aaa] flex-shrink-0" />
                                    <input
                                        type="datetime-local"
                                        className={inputCls}
                                        value={returnDatetime}
                                        min={datetime}
                                        onChange={e => setReturnDatetime(e.target.value)}
                                    />
                                </div>
                            </Card>
                        )}
                    </>
                )}

                {/* Submit */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!from}
                    className="w-full flex items-center justify-center gap-2 text-white border-none rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body transition-all hover:brightness-105 mt-1 shadow-[0_4px_16px_rgba(15,76,62,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#2E4052' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3A5268' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2E4052' }}
                >
                    Check Availability <ArrowRight size={16} />
                </button>

            </div>
        </div>
    )
}
