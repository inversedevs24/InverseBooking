import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    MapPin, Clock, Calendar, Users, Plus, Minus, ArrowRight,
    RotateCcw, Ruler, AlertCircle, Loader2,
    User, Mail, Phone, CheckCircle2,
} from 'lucide-react'
import { loadGoogleMaps } from '../../services/googleMapsLoader'
import { PlacesInput } from '../ui/PlacesInput'
import type { PlaceResult } from '../ui/PlacesInput'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import {
    SERVICE_CONFIG,
    SHOPIFY_LABEL_TO_KEY,
    DEFAULT_SERVICE,
    WHATSAPP_NUMBER,
} from '../../config/serviceConfig'
import type { ServiceKey } from '../../config/serviceConfig'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalISO(d: Date) {
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">
            {children}
        </div>
    )
}

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null
    return <p className="text-[11px] text-red-400 font-medium mt-1 ml-1">{msg}</p>
}

function RouteInfoCard({ distanceKm, durationText, loading, error }: {
    distanceKm: number | null; durationText: string; loading: boolean; error: string
}) {
    if (loading) return (
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-2 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <Loader2 size={14} className="text-primary animate-spin flex-shrink-0" />
            <span className="text-[13px] text-muted">Calculating route…</span>
        </div>
    )
    if (error) return (
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-2 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
            <span className="text-[13px] text-red-400">{error}</span>
        </div>
    )
    if (distanceKm === null) return null
    return (
        <div className="rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.06)]" style={{ backgroundColor: '#2E4052' }}>
            <div className="flex divide-x divide-white/10">
                <div className="flex-1 flex flex-col items-center py-3 px-2 gap-0.5">
                    <Ruler size={13} style={{ color: '#BDD9BF' }} />
                    <span className="text-[15px] font-bold text-white font-head leading-tight">{distanceKm.toFixed(1)} km</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>Distance</span>
                </div>
                <div className="flex-1 flex flex-col items-center py-3 px-2 gap-0.5">
                    <Clock size={13} style={{ color: '#BDD9BF' }} />
                    <span className="text-[15px] font-bold text-white font-head leading-tight">{durationText}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>Est. drive time</span>
                </div>
            </div>
        </div>
    )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ServiceBookingForm() {
    const navigate = useNavigate()
    const [params] = useSearchParams()

    // ── Shopify: only used to know which service types exist ──────────────────
    const dispatch = useAppDispatch()
    const { products, initialized } = useAppSelector(s => s.shopify)
    useEffect(() => { dispatch(fetchTaxiProducts()) }, [dispatch])

    // Build available tabs from Shopify service_type metafields, ordered by SERVICE_CONFIG
    const availableServiceKeys = useMemo<ServiceKey[]>(() => {
        if (!initialized || products.length === 0) return Object.keys(SERVICE_CONFIG) as ServiceKey[]
        const seen = new Set<ServiceKey>()
        for (const p of products) {
            if (!p.serviceType) continue
            const key = SHOPIFY_LABEL_TO_KEY[p.serviceType]
            if (key) seen.add(key)
        }
        const ordered = (Object.keys(SERVICE_CONFIG) as ServiceKey[]).filter(k => seen.has(k))
        return ordered.length > 0 ? ordered : Object.keys(SERVICE_CONFIG) as ServiceKey[]
    }, [products, initialized])

    const rawServiceKey = (params.get('service') ?? DEFAULT_SERVICE) as ServiceKey
    const serviceKey = availableServiceKeys.includes(rawServiceKey) ? rawServiceKey : (availableServiceKeys[0] ?? DEFAULT_SERVICE)
    const config = SERVICE_CONFIG[serviceKey]
    const isWhatsApp = config.whatsappFlow

    // ── Shopify-driven hero image + description ───────────────────────────────
    const serviceProduct = useMemo(
        () => products.find(p => p.serviceType === config.shopifyLabel && p.bannerImage)
           ?? products.find(p => p.serviceType === config.shopifyLabel),
        [products, config.shopifyLabel],
    )
    const heroImage = serviceProduct?.bannerImage ?? ''
    const heroDescription = serviceProduct?.serviceDescription ?? ''

    // ── Google Maps ───────────────────────────────────────────────────────────
    const [mapsReady, setMapsReady] = useState(false)
    useEffect(() => {
        loadGoogleMaps().then(() => setMapsReady(true)).catch(e => console.warn('Maps load failed:', e))
    }, [])

    // ── Location ──────────────────────────────────────────────────────────────
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

    // ── Contact fields (WhatsApp flow only) ───────────────────────────────────
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    // ── Validation ────────────────────────────────────────────────────────────
    const [errors, setErrors] = useState<{
        from?: string; to?: string; datetime?: string; returnDatetime?: string
        name?: string; email?: string; phone?: string
    }>({})

    // ── Success screen (WhatsApp flow only) ───────────────────────────────────
    const [submitted, setSubmitted] = useState(false)

    // Reset all state when switching tabs
    useEffect(() => {
        setFrom(''); setTo(''); setFromCoords(null); setToCoords(null)
        setDistanceKm(null); setDurationText(''); setRouteError('')
        setDatetime(toLocalISO(new Date()))
        setReturnDatetime(''); setShowReturn(false)
        setHours(3); setPassengers(1)
        setName(''); setEmail(''); setPhone('')
        setErrors({}); setSubmitted(false)
    }, [serviceKey])

    // Distance matrix
    useEffect(() => {
        if (!fromCoords || !toCoords) { setDistanceKm(null); setDurationText(''); setRouteError(''); return }
        const maps = (window as any).google?.maps
        if (!maps?.DistanceMatrixService) return
        setRouteLoading(true); setRouteError('')
        new maps.DistanceMatrixService().getDistanceMatrix(
            { origins: [fromCoords], destinations: [toCoords], travelMode: maps.TravelMode.DRIVING },
            (response: google.maps.DistanceMatrixResponse, status: google.maps.DistanceMatrixStatus) => {
                setRouteLoading(false)
                if (status !== 'OK' || !response) { setRouteError('Could not calculate route between these locations.'); return }
                const el = response.rows[0]?.elements[0]
                if (!el || el.status !== 'OK') { setRouteError('No driving route found between these locations.'); return }
                setDistanceKm(el.distance.value / 1000)
                setDurationText(el.duration.text)
            }
        )
    }, [fromCoords, toCoords])

    function handleFromChange(r: PlaceResult) { setFrom(r.address); setFromCoords(r.coords); setErrors(e => ({ ...e, from: '' })) }
    function handleToChange(r: PlaceResult) { setTo(r.address); setToCoords(r.coords); setErrors(e => ({ ...e, to: '' })) }
    function handlePickupTimeChange(val: string) {
        setDatetime(val); setErrors(e => ({ ...e, datetime: '' }))
        if (returnDatetime && returnDatetime <= val) setReturnDatetime('')
    }

    function handleSubmit() {
        const e: typeof errors = {}
        if (!from.trim()) e.from = 'Please enter a pickup location'
        if (config.showTo && !to.trim()) e.to = 'Please enter a destination'
        if (!datetime) e.datetime = 'Please select a date and time'
        if (config.showReturn && showReturn && !returnDatetime) e.returnDatetime = 'Please select a return date and time'

        if (isWhatsApp) {
            if (!name.trim()) e.name = 'Full name is required'
            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
            if (!phone.match(/^\+?[\d\s\-]{7,15}$/)) e.phone = 'Valid phone number required'
        }

        if (Object.keys(e).length) { setErrors(e); return }

        if (isWhatsApp) {
            const lines = [
                `🚗 *${config.label} Enquiry*`,
                '',
                `📍 Pickup: ${from}`,
            ]
            if (config.showTo && to) lines.push(`📍 Drop-off: ${to}`)
            lines.push(`📅 Date & Time: ${datetime.replace('T', ' ')}`)
            lines.push(`👥 Passengers: ${passengers}`)
            if (config.showHours) lines.push(`⏱ Duration: ${hours} hour${hours > 1 ? 's' : ''}`)
            lines.push('', `👤 Name: ${name}`, `📧 Email: ${email}`, `📞 Phone: ${phone}`)
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
            setSubmitted(true)
            return
        }

        navigate('/vehicles', {
            state: {
                from, to, datetime,
                returnDatetime: showReturn ? returnDatetime : undefined,
                service: serviceKey,
                passengers,
                hours: config.showHours ? hours : undefined,
                type: 'transfer',
                distanceKm: distanceKm ?? undefined,
                duration: durationText || undefined,
                fromCoords: fromCoords ?? undefined,
                toCoords: toCoords ?? undefined,
            },
        })
    }

    const inputCls = 'flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]'
    const contactInputCls = (err?: string) =>
        `w-full bg-white border rounded-xl px-4 py-2.5 text-[14px] text-primary font-body outline-none transition-all placeholder:text-[#aaa] ${err ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-2 focus:ring-[#EAF0EA]'}`
    const showRouteInfo = config.showTo && (routeLoading || routeError !== '' || distanceKm !== null)

    // ── Success screen (WhatsApp flow only) ───────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F5F0' }}>
                <div className="relative h-[200px] sm:h-[240px] overflow-hidden bg-primary">
                    {heroImage && <img src={heroImage} alt={config.label} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.45)' }} />
                </div>

                <div className="flex-1 flex items-center justify-center px-5 py-10">
                    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(15,23,42,0.08)] max-w-sm w-full px-8 py-10 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#BDD9BF' }}>
                            <CheckCircle2 size={30} style={{ color: '#2E4052' }} />
                        </div>
                        <h2 className="font-head font-bold text-slate-800 text-[22px] mb-2">Enquiry Sent!</h2>
                        <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
                            Thank you, <strong>{name}</strong>. We've received your {config.label.toLowerCase()} request and will contact you on WhatsApp shortly to confirm everything.
                        </p>
                        <div className="rounded-xl px-4 py-3 mb-6 text-left" style={{ backgroundColor: '#F0F5F0' }}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Summary</p>
                            <div className="space-y-1 text-[12px] text-slate-600">
                                <div><span className="font-semibold">Pickup:</span> {from}</div>
                                {config.showTo && to && <div><span className="font-semibold">Drop-off:</span> {to}</div>}
                                <div><span className="font-semibold">Date & Time:</span> {datetime.replace('T', ' ')}</div>
                                {config.showHours && <div><span className="font-semibold">Duration:</span> {hours} hour{hours > 1 ? 's' : ''}</div>}
                                <div><span className="font-semibold">Passengers:</span> {passengers}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full rounded-xl py-3 text-[13px] font-bold text-white"
                            style={{ backgroundColor: '#2E4052' }}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F0F5F0' }}>

            {/* Hero banner */}
            <div className="relative h-[200px] sm:h-[240px] overflow-hidden bg-primary">
                {heroImage && <img src={heroImage} alt={config.label} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="font-head text-[24px] sm:text-[30px] font-bold text-white leading-none mb-1">{config.label}</h1>
                    {heroDescription && <p className="text-[13px] text-white/70 max-w-xs">{heroDescription}</p>}
                </div>
            </div>

            {/* Service tabs */}
            <div className="bg-white border-b border-border shadow-[0_1px_4px_rgba(15,23,42,0.05)] sticky top-0 z-10">
                <div className="flex overflow-x-auto justify-start sm:justify-center" style={{ scrollbarWidth: 'none' }}>
                    {availableServiceKeys.map(key => (
                        <button
                            key={key}
                            onClick={() => navigate(`/book?service=${key}`)}
                            className={`flex items-center gap-1.5 px-3.5 py-3.5 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${key === serviceKey ? 'text-primary border-primary' : 'text-muted border-transparent hover:text-primary hover:border-border'}`}
                        >
                            {SERVICE_CONFIG[key].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form */}
            <div className="max-w-[480px] mx-auto px-5 py-8 flex flex-col gap-2">

                {/* Pickup location */}
                <div>
                    <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${errors.from ? 'ring-2 ring-red-400' : ''}`}>
                        <FieldLabel>{serviceKey === 'airport' ? 'Airport / Terminal *' : 'Pickup Location *'}</FieldLabel>
                        <div className="flex items-center gap-2">
                            <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
                            <PlacesInput placeholder={config.fromPlaceholder} className={inputCls} mapsReady={mapsReady} onPlaceChange={handleFromChange} />
                        </div>
                    </div>
                    <FieldError msg={errors.from} />
                </div>

                {/* Destination */}
                {config.showTo && (
                    <div>
                        <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${errors.to ? 'ring-2 ring-red-400' : ''}`}>
                            <FieldLabel>{serviceKey === 'airport' ? 'Drop-off Address *' : 'Destination *'}</FieldLabel>
                            <div className="flex items-center gap-2">
                                <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
                                <PlacesInput placeholder={config.toPlaceholder} className={inputCls} mapsReady={mapsReady} onPlaceChange={handleToChange} />
                            </div>
                        </div>
                        <FieldError msg={errors.to} />
                    </div>
                )}

                {/* Route info */}
                {showRouteInfo && (
                    <RouteInfoCard distanceKm={distanceKm} durationText={durationText} loading={routeLoading} error={routeError} />
                )}

                {/* Pickup date & time */}
                <div>
                    <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${errors.datetime ? 'ring-2 ring-red-400' : ''}`}>
                        <FieldLabel>Pickup Date &amp; Time *</FieldLabel>
                        <div className="flex items-center gap-2">
                            <Calendar size={15} className="text-[#aaa] flex-shrink-0" />
                            <input type="datetime-local" className={inputCls} value={datetime} min={minNow} onChange={e => handlePickupTimeChange(e.target.value)} />
                        </div>
                    </div>
                    <FieldError msg={errors.datetime} />
                </div>

                {/* Duration (hourly / city tour) */}
                {config.showHours && (
                    <div className="bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                        <FieldLabel>Duration (hours)</FieldLabel>
                        <div className="flex items-center gap-3">
                            <Clock size={15} className="text-[#aaa] flex-shrink-0" />
                            <div className="flex items-center gap-3 flex-1">
                                <button type="button" onClick={() => setHours(h => Math.max(3, h - 1))} className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                                    <Minus size={13} className="text-primary" />
                                </button>
                                <span className="text-[15px] font-bold text-primary w-8 text-center">{hours}</span>
                                <button type="button" onClick={() => setHours(h => Math.min(14, h + 1))} className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
                                    <Plus size={13} className="text-primary" />
                                </button>
                                <span className="text-[13px] text-muted ml-1">{hours === 3 ? 'min 3 hrs' : `${hours} hrs`}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Passengers */}
                {config.showPassengers && (
                    <div className="bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                        <FieldLabel>Passengers</FieldLabel>
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
                )}

                {/* Return trip */}
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
                            <div>
                                <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${errors.returnDatetime ? 'ring-2 ring-red-400' : ''}`}>
                                    <FieldLabel>Return Date &amp; Time *</FieldLabel>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={15} className="text-[#aaa] flex-shrink-0" />
                                        <input type="datetime-local" className={inputCls} value={returnDatetime} min={datetime}
                                            onChange={e => { setReturnDatetime(e.target.value); setErrors(ev => ({ ...ev, returnDatetime: '' })) }} />
                                    </div>
                                </div>
                                <FieldError msg={errors.returnDatetime} />
                            </div>
                        )}
                    </>
                )}

                {/* Contact details — WhatsApp flow services only */}
                {isWhatsApp && (
                    <>
                        <div className="pt-2 pb-1">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Contact Details</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>
                        </div>

                        <div>
                            <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${errors.name ? 'ring-2 ring-red-400' : ''}`}>
                                <FieldLabel>Full Name *</FieldLabel>
                                <div className="flex items-center gap-2">
                                    <User size={15} className="text-[#aaa] flex-shrink-0" />
                                    <input
                                        className={inputCls}
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={e => { setName(e.target.value); setErrors(ev => ({ ...ev, name: '' })) }}
                                    />
                                </div>
                            </div>
                            <FieldError msg={errors.name} />
                        </div>

                        <div>
                            <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${errors.email ? 'ring-2 ring-red-400' : ''}`}>
                                <FieldLabel>Email Address *</FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Mail size={15} className="text-[#aaa] flex-shrink-0" />
                                    <input
                                        type="email"
                                        className={inputCls}
                                        placeholder="john@email.com"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setErrors(ev => ({ ...ev, email: '' })) }}
                                    />
                                </div>
                            </div>
                            <FieldError msg={errors.email} />
                        </div>

                        <div>
                            <div className={`bg-white rounded-2xl px-4 pt-3 pb-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${errors.phone ? 'ring-2 ring-red-400' : ''}`}>
                                <FieldLabel>Phone Number *</FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Phone size={15} className="text-[#aaa] flex-shrink-0" />
                                    <input
                                        type="tel"
                                        className={inputCls}
                                        placeholder="+971 50 000 0000"
                                        value={phone}
                                        onChange={e => { setPhone(e.target.value); setErrors(ev => ({ ...ev, phone: '' })) }}
                                    />
                                </div>
                            </div>
                            <FieldError msg={errors.phone} />
                        </div>
                    </>
                )}

                {/* Submit */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-2 text-white border-none rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body transition-all hover:brightness-105 mt-1 shadow-[0_4px_16px_rgba(15,76,62,0.25)]"
                    style={{ backgroundColor: isWhatsApp ? '#25D366' : '#2E4052' }}
                >
                    {isWhatsApp ? (
                        <>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Send Enquiry via WhatsApp
                        </>
                    ) : (
                        <>Check Availability <ArrowRight size={16} /></>
                    )}
                </button>

                {isWhatsApp && (
                    <p className="text-center text-[11px] text-muted">
                        We'll reply on WhatsApp to confirm your booking and pricing.
                    </p>
                )}

            </div>
        </div>
    )
}
