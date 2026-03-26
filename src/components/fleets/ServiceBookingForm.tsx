import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, Clock, Calendar, Users, Plus, Minus, ArrowRight, RotateCcw } from 'lucide-react'

//  Service definitions 
type ServiceKey =
    | 'transfer'
    | 'city-to-city'
    | 'airport'
    | 'city-tour'
    | 'hourly'
    | 'desert-safari'

interface ServiceConfig {
    label: string
    showTo: boolean         // show drop-off field
    showReturn: boolean     // can add return trip
    showHours: boolean      // show duration selector (hourly hire)
    showPassengers: boolean
    fromPlaceholder: string
    toPlaceholder: string
    image: string
    accentColor: string
    description: string
}

const SERVICE_CONFIG: Record<ServiceKey, ServiceConfig> = {
    transfer: {
        label: 'Private Transfer',
        showTo: true,
        showReturn: true,
        showHours: false,
        showPassengers: true,
        fromPlaceholder: 'Enter pickup location',
        toPlaceholder: 'Enter drop-off location',
        image: 'https://images.pexels.com/photos/35641543/pexels-photo-35641543.jpeg',
        accentColor: '#2E4052',
        description: 'Door-to-door private transfer at a fixed price.',
    },
    'city-to-city': {
        label: 'City to City',
        showTo: true,
        showReturn: true,
        showHours: false,
        showPassengers: true,
        fromPlaceholder: 'Departure city (e.g. Dubai)',
        toPlaceholder: 'Destination city (e.g. Abu Dhabi)',
        image: 'https://images.pexels.com/photos/4491946/pexels-photo-4491946.jpeg',
        accentColor: '#1d4ed8',
        description: 'Intercity transfers between major UAE cities.',
    },
    airport: {
        label: 'Airport Rides',
        showTo: true,
        showReturn: true,
        showHours: false,
        showPassengers: true,
        fromPlaceholder: 'Airport name or terminal',
        toPlaceholder: 'Hotel / home / office address',
        image: 'https://images.pexels.com/photos/6604557/pexels-photo-6604557.jpeg',
        accentColor: '#2E4052',
        description: 'Meet & greet, flight tracking, free waiting time.',
    },
    'city-tour': {
        label: 'City Tour',
        showTo: false,
        showReturn: false,
        showHours: true,
        showPassengers: true,
        fromPlaceholder: 'Your hotel / starting point',
        toPlaceholder: '',
        image: 'https://images.pexels.com/photos/4348092/pexels-photo-4348092.jpeg',
        accentColor: '#7c3aed',
        description: 'Guided city tours with a professional chauffeur.',
    },
    hourly: {
        label: 'Hourly Hire',
        showTo: false,
        showReturn: false,
        showHours: true,
        showPassengers: true,
        fromPlaceholder: 'Your pickup location',
        toPlaceholder: '',
        image: 'https://cdn.prod.website-files.com/656e39bd8b07a811ace24224/656e39bd8b07a811ace2462a_falt.webp',
        accentColor: '#FFC857',
        description: 'Hire a chauffeur by the hour — minimum 3 hours.',
    },
    'desert-safari': {
        label: 'Desert Safari',
        showTo: false,
        showReturn: true,
        showHours: false,
        showPassengers: true,
        fromPlaceholder: 'Hotel / pickup address',
        toPlaceholder: '',
        image: 'https://images.pexels.com/photos/5604852/pexels-photo-5604852.jpeg',
        accentColor: '#b45309',
        description: 'Premium desert safari transfers from your hotel.',
    },
}

const DEFAULT_SERVICE: ServiceKey = 'transfer'

//  Helpers 
function toLocalISO(d: Date) {
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

//  Card wrapper (matches HeroBooking style) 
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

//  Main component 
export default function ServiceBookingForm() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const serviceKey = (params.get('service') ?? DEFAULT_SERVICE) as ServiceKey
    const config = SERVICE_CONFIG[serviceKey] ?? SERVICE_CONFIG[DEFAULT_SERVICE]

    const minNow = useMemo(() => toLocalISO(new Date()), [])
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [datetime, setDatetime] = useState(minNow)
    const [returnDatetime, setReturnDatetime] = useState('')
    const [showReturn, setShowReturn] = useState(false)
    const [passengers, setPassengers] = useState(1)
    const [hours, setHours] = useState(3)

    function handlePickupChange(val: string) {
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
            },
        })
    }

    const inputCls =
        'flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]'

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F0F5F0' }}>

            {/*  Hero banner  */}
            <div className="relative h-[200px] sm:h-[240px] overflow-hidden">
                <img
                    src={config.image}
                    alt={config.label}
                    className="w-full h-full object-cover"
                />
                {/* <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.75) 100%)' }}
                /> */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="font-head text-[24px] sm:text-[30px] font-bold text-white leading-none mb-1">
                        {config.label}
                    </h1>
                    <p className="text-[13px] text-white/70 max-w-xs">{config.description}</p>
                </div>
            </div>

            {/*  Service tabs  */}
            <div className="bg-white border-b border-border shadow-[0_1px_4px_rgba(15,23,42,0.05)] sticky top-0 z-10">
                <div
                    className="flex overflow-x-auto justify-start sm:justify-center"
                    style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                    {(Object.entries(SERVICE_CONFIG) as [ServiceKey, ServiceConfig][]).map(([key, cfg]) => (
                        <button
                            key={key}
                            onClick={() => navigate(`/book?service=${key}`)}
                            className={`flex items-center gap-1.5 px-3.5 py-3.5 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${key === serviceKey
                                ? 'text-primary border-primary'
                                : 'text-muted border-transparent hover:text-primary hover:border-border'
                                }`}
                        >
                            <span>{cfg.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/*  Form  */}
            <div className="max-w-[480px] mx-auto px-5 py-8 flex flex-col gap-2">

                {/* From */}
                <Card>
                    <FieldLabel>
                        {serviceKey === 'airport' ? 'Airport / Terminal' : 'Pickup Location'}
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
                        <input
                            className={inputCls}
                            placeholder={config.fromPlaceholder}
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                        />
                    </div>
                </Card>

                {/* To — only for services that have a destination */}
                {config.showTo && (
                    <Card>
                        <FieldLabel>
                            {serviceKey === 'airport' ? 'Drop-off Address' : 'Destination'}
                        </FieldLabel>
                        <div className="flex items-center gap-2">
                            <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
                            <input
                                className={inputCls}
                                placeholder={config.toPlaceholder}
                                value={to}
                                onChange={e => setTo(e.target.value)}
                            />
                        </div>
                    </Card>
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
                            onChange={e => handlePickupChange(e.target.value)}
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
                                <button
                                    type="button"
                                    onClick={() => setHours(h => Math.max(3, h - 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    <Minus size={13} className="text-primary" />
                                </button>
                                <span className="text-[15px] font-bold text-primary w-8 text-center">{hours}</span>
                                <button
                                    type="button"
                                    onClick={() => setHours(h => Math.min(14, h + 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
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
                                <button
                                    type="button"
                                    onClick={() => setPassengers(p => Math.max(1, p - 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    <Minus size={13} className="text-primary" />
                                </button>
                                <span className="text-[15px] font-bold text-primary w-8 text-center">{passengers}</span>
                                <button
                                    type="button"
                                    onClick={() => setPassengers(p => Math.min(14, p + 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
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
                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${showReturn ? 'bg-primary' : 'bg-slate-200'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${showReturn ? 'left-5' : 'left-0.5'
                                        }`}
                                />
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
                    className="w-full flex items-center justify-center gap-2 text-white border-none rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body transition-all mt-1 shadow-[0_4px_16px_rgba(46,64,82,0.28)]"
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