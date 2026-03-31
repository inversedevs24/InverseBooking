import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    X, Clock, Car, ChevronRight, LogOut, User,
    CalendarDays, CheckCircle2, XCircle, Loader2,
    Phone, Mail, Star, CreditCard, ArrowRight, Search, Bell, Settings, TrendingUp, Luggage,
    MapPin, Navigation, Ruler, Timer, AlertCircle,
    Download, RotateCcw, MessageCircle, ChevronLeft, RefreshCw, Hash,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getCustomerOrders, ShopifyOrder } from '../../services/shopifyAuthService'

//  Types 
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'in-progress'

export interface BookingEvent { time: string; label: string; done: boolean }

export interface Booking {
    id: string
    reference: string
    date: string; time: string
    from: string; fromFull: string
    to: string; toFull: string
    vehicle: string; vehicleImage: string
    passengers: number; luggage: number
    status: BookingStatus
    price: string
    breakdown: { label: string; amount: string }[]
    driver?: string; driverPhone?: string; driverAvatar?: string
    rating?: number; ratingNote?: string
    notes?: string
    timeline: BookingEvent[]
    bookedOn: string; paymentMethod: string
    distance: string; duration: string
}

//  Status config 
const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }> = {
    'in-progress': { label: 'In Progress', color: '#2E4052', bg: '#BDD9BF', Icon: Loader2 },
    confirmed: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe', Icon: CalendarDays },
    completed: { label: 'Completed', color: '#15803d', bg: '#dcfce7', Icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2', Icon: XCircle },
}

// ─── Order mapping helpers ────────────────────────────────────────────────────

function fmtPrice(amount: string, currencyCode: string): string {
    const n = parseFloat(amount)
    const symbols: Record<string, string> = { USD: '$', EUR: '€', AED: 'AED ' }
    return `${symbols[currencyCode] ?? currencyCode + ' '}${n.toFixed(2)}`
}

function parseMetafieldString(raw: string | null | undefined): string | undefined {
    if (!raw) return undefined
    const trimmed = raw.trim()
    if (trimmed.startsWith('[')) {
        try {
            const arr = JSON.parse(trimmed)
            return Array.isArray(arr) && arr[0] ? String(arr[0]).trim() : undefined
        } catch { /* fall through */ }
    }
    return trimmed || undefined
}

function mapOrderToBooking(order: ShopifyOrder): Booking | null {
    const lines = order.lineItems.edges.map(e => e.node)
    const mainLine = lines.find(li =>
        li.customAttributes.find(a => a.key === 'Type')?.value !== 'Airport Parking Fee'
    )
    if (!mainLine) return null

    const attrs: Record<string, string> = Object.fromEntries(
        mainLine.customAttributes.map(a => [a.key, a.value])
    )

    const fs = order.financialStatus
    const ff = order.fulfillmentStatus
    let status: BookingStatus
    if (fs === 'REFUNDED' || fs === 'PARTIALLY_REFUNDED' || fs === 'VOIDED') {
        status = 'cancelled'
    } else if (ff === 'FULFILLED') {
        status = 'completed'
    } else if (ff === 'IN_PROGRESS') {
        status = 'in-progress'
    } else {
        status = 'confirmed'
    }

    const processedDate = new Date(order.processedAt)
    const bookedOn = processedDate.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })

    const breakdown = lines.map(li => ({
        label: li.customAttributes.find(a => a.key === 'Type')?.value === 'Airport Parking Fee'
            ? 'Airport Parking Fee'
            : li.title,
        amount: li.variant
            ? fmtPrice(String(parseFloat(li.variant.price.amount) * li.quantity), li.variant.price.currencyCode)
            : '—',
    }))

    const timeline: BookingEvent[] = status === 'completed'
        ? [
            { time: attrs['Pickup Time'] ?? '', label: 'Journey started', done: true },
            { time: '', label: 'Arrived at destination', done: true },
        ]
        : status === 'in-progress'
            ? [
                { time: attrs['Pickup Time'] ?? '', label: 'Driver en route to pickup', done: true },
                { time: attrs['Pickup Time'] ?? '', label: 'Journey started', done: false },
            ]
            : status === 'cancelled'
                ? [{ time: bookedOn, label: 'Booking cancelled', done: true }]
                : [{ time: bookedOn, label: 'Booking confirmed', done: true }]

    const driverName = parseMetafieldString(order.driver?.value)
    const driverPhone = parseMetafieldString(order.driverPhone?.value)

    return {
        id: order.id,
        reference: `INV-${order.orderNumber}`,
        date: attrs['Pickup Date'] ?? bookedOn,
        time: attrs['Pickup Time'] ?? '',
        from: attrs['From'] ?? '',
        fromFull: attrs['From'] ?? '',
        to: attrs['To'] ?? '',
        toFull: attrs['To'] ?? '',
        vehicle: attrs['Vehicle'] ?? mainLine.title,
        vehicleImage: mainLine.variant?.image?.url ?? 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 1,
        luggage: 0,
        status,
        price: fmtPrice(order.totalPrice.amount, order.totalPrice.currencyCode),
        breakdown,
        driver: driverName,
        driverPhone,
        driverAvatar: driverName ? driverName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : undefined,
        notes: attrs['Flight Number'] ? `Flight ${attrs['Flight Number']}` : undefined,
        timeline,
        bookedOn,
        paymentMethod: order?.paymentGatewayNames?.length > 0
            ? order?.paymentGatewayNames?.join(', ')
            : 'Paid online',
        distance: attrs['Distance'] ?? '',
        duration: attrs['Duration'] ?? '',
    }
}

//  Fallback user display
const DEFAULT_AVATAR = '?'


// BOOKING DETAILS PANEL
function StarRatingLg({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={15}
                    fill={i <= rating ? '#FFC857' : 'none'}
                    stroke={i <= rating ? '#FFC857' : '#d1d5db'}
                />
            ))}
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <div className="px-4 py-2.5 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
            </div>
            <div className="px-4 py-3">{children}</div>
        </div>
    )
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Car; label: string; value: string }) {
    return (
        <div className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0 gap-3">
            <div className="flex items-center gap-2 text-slate-400 flex-shrink-0">
                <Icon size={12} />
                <span className="text-[12px] font-body text-slate-500">{label}</span>
            </div>
            <span className="text-[12px] font-semibold text-slate-700 font-head text-right">{value}</span>
        </div>
    )
}

function BookingDetailsPanel({ booking, onClose }: { booking: Booking; onClose: () => void }) {
    const navigate = useNavigate()
    const [tab, setTab] = useState<'overview' | 'payment'>('overview')
    const s = STATUS_CONFIG[booking.status]

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
        }
    }, [])

    const tabs = [
        { key: 'overview' as const, label: 'Overview' },
        { key: 'payment' as const, label: 'Payment' },
    ]

    return (
        <>
            {/* Backdrop — full screen, above navbar */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[110]"
                onClick={onClose}
            />

            {/* Panel — full screen on mobile, right drawer on sm+ */}
            <div
                className="fixed inset-0 sm:inset-auto sm:top-0 sm:bottom-0 sm:right-0 sm:w-[420px] md:w-[460px] z-[120] flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div
                    className="relative flex-shrink-0 px-5 pt-5 pb-0"
                    style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}
                >
                    <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white pointer-events-none" />

                    {/* Top row: tabs + close button */}
                    <div className="relative flex items-end justify-between -mb-px">
                        <div className="flex gap-0">
                            {tabs.map(t => (
                                <button key={t.key} onClick={() => setTab(t.key)}
                                    className={`px-5 py-2.5 text-[12px] font-bold transition-all rounded-t-xl ${tab === t.key ? 'bg-white text-slate-800' : 'text-white/60 hover:text-white/90'
                                        }`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0 mb-2.5"
                        >
                            <X size={17} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#F0F5F0' }}>
                    <div className="p-4 space-y-3">

                        {/* OVERVIEW */}
                        {tab === 'overview' && (
                            <>
                                <Section title="Booking">
                                    <InfoRow icon={Hash} label="Order ID" value={booking.reference} />
                                    <div className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0 gap-3">
                                        <div className="flex items-center gap-2 text-slate-400 flex-shrink-0">
                                            <s.Icon size={12} />
                                            <span className="text-[12px] font-body text-slate-500">Status</span>
                                        </div>
                                        <span className="text-[12px] font-bold font-head" style={{ color: s.color }}>{s.label}</span>
                                    </div>
                                </Section>

                                <Section title="Journey Details">
                                    <InfoRow icon={MapPin} label="Pickup" value={booking.fromFull} />
                                    <InfoRow icon={Navigation} label="Drop-off" value={booking.toFull} />
                                    {booking.date ? <InfoRow icon={CalendarDays} label="Date" value={booking.date} /> : null}
                                    {booking.time ? <InfoRow icon={Clock} label="Time" value={booking.time} /> : null}
                                    {booking.distance ? <InfoRow icon={Ruler} label="Distance" value={booking.distance} /> : null}
                                    {booking.duration ? <InfoRow icon={Timer} label="Est. duration" value={booking.duration} /> : null}
                                </Section>

                                <Section title="Vehicle">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                                            <img src={booking.vehicleImage} alt={booking.vehicle} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-[14px] font-bold text-slate-800 font-head">{booking.vehicle}</div>
                                            <div className="flex gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-[12px] text-slate-500"><User size={12} />{booking.passengers} pax</span>
                                                <span className="flex items-center gap-1 text-[12px] text-slate-500"><Luggage size={12} />{booking.luggage} bags</span>
                                            </div>
                                        </div>
                                    </div>
                                </Section>

                                {booking.driver && booking.driverPhone && booking.status !== 'completed' && (
                                    <Section title="Your Driver">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[13px] font-head flex-shrink-0"
                                                style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}>
                                                {booking.driverAvatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[14px] font-bold text-slate-800 font-head">{booking.driver}</div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">Licensed Chauffeur</div>
                                            </div>
                                            {booking.driverPhone && (
                                                <a href={`tel:${booking.driverPhone}`}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70 transition-opacity flex-shrink-0"
                                                    style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}>
                                                    <Phone size={15} />
                                                </a>
                                            )}
                                        </div>
                                    </Section>
                                )}

                                {booking.notes && (
                                    <Section title="Special Notes">
                                        <div className="flex gap-2 items-start">
                                            <AlertCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-[12px] text-slate-600 leading-relaxed">{booking.notes}</p>
                                        </div>
                                    </Section>
                                )}

                                {booking.status === 'completed' && booking.rating && (
                                    <Section title="Your Rating">
                                        <div className="flex items-center gap-2 mb-2">
                                            <StarRatingLg rating={booking.rating} />
                                            <span className="text-[13px] font-bold text-slate-700">{booking.rating} / 5</span>
                                        </div>
                                        {booking.ratingNote && (
                                            <p className="text-[12px] text-slate-500 italic leading-relaxed">"{booking.ratingNote}"</p>
                                        )}
                                    </Section>
                                )}
                            </>
                        )}

                        {/* PAYMENT */}
                        {tab === 'payment' && (
                            <>
                                <Section title="Price Breakdown">
                                    {booking.breakdown.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                                            <span className="text-[12px] text-slate-500">{item.label}</span>
                                            <span className="text-[13px] font-semibold text-slate-700 font-head">{item.amount}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-200">
                                        <span className="text-[14px] font-bold text-slate-800 font-head">Total</span>
                                        <span className="text-[18px] font-bold font-head" style={{ color: '#2E4052' }}>{booking.price}</span>
                                    </div>
                                </Section>

                                <Section title="Payment Details">
                                    <InfoRow icon={CreditCard} label="Paid with" value={booking.paymentMethod} />
                                    <InfoRow icon={CalendarDays} label="Booked on" value={booking.bookedOn} />
                                </Section>

                            </>
                        )}

                    </div>
                </div>

                {/* Sticky bottom action buttons */}
                <div
                    className="flex-shrink-0 px-4 py-3 bg-white border-t border-slate-100"
                    style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
                >
                    <div className="flex gap-2">
                        {(booking.status === 'confirmed' || booking.status === 'in-progress') && (
                            <button
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-[12px] font-bold text-white hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: '#2E4052' }}
                                onClick={() => navigate('/contact')}
                            >
                                <MessageCircle size={13} /> Contact Support
                            </button>
                        )}
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                            <button
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-[12px] font-bold text-white hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: '#2E4052' }}
                                onClick={() => navigate('/book')}
                            >
                                <RotateCcw size={13} /> {booking.status === 'cancelled' ? 'Rebook Journey' : 'Book Again'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

// SHARED SUB-COMPONENTS
function StarRatingSm({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={11}
                    fill={i <= rating ? '#FFC857' : 'none'}
                    stroke={i <= rating ? '#FFC857' : '#d1d5db'}
                />
            ))}
        </div>
    )
}

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof User; label: string; value: string; sub?: string }) {
    return (
        <div className="bg-white rounded-2xl px-4 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#BDD9BF' }}>
                <Icon size={18} style={{ color: '#2E4052' }} />
            </div>
            <div className="min-w-0">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold truncate">{label}</div>
                <div className="text-[14px] sm:text-[18px] font-bold text-slate-800 font-head leading-tight truncate">{value}</div>
                {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
            </div>
        </div>
    )
}


function BookingCard({ booking, onDetails }: { booking: Booking; onDetails: () => void }) {
    const s = STATUS_CONFIG[booking.status]
    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] transition-shadow duration-200">
            {/* Top bar: reference + status */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">{booking.reference}</span>
                <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ color: s.color, backgroundColor: s.bg }}>
                    <s.Icon size={11} className={booking.status === 'in-progress' ? 'animate-spin' : ''} />
                    <span>{s.label}</span>
                </div>
            </div>

            <div className="px-4 py-4">
                {/* Route */}
                <div className="flex gap-3 mb-3">
                    <div className="flex flex-col items-center pt-1 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2E4052' }} />
                        <div className="w-px flex-1 my-1" style={{ backgroundColor: '#BDD9BF' }} />
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                    <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-slate-700 font-head leading-tight line-clamp-1">{booking.from}</div>
                        <div className="text-[13px] font-semibold text-slate-700 font-head leading-tight line-clamp-1">{booking.to}</div>
                    </div>
                </div>

                {/* Date · time */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
                    <CalendarDays size={11} />
                    <span>{booking.date}</span>
                    {booking.time && <><span>·</span><Clock size={11} /><span>{booking.time}</span></>}
                </div>

                {/* Footer: price + details */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[17px] font-bold text-slate-800 font-head">{booking.price}</span>
                    <button
                        onClick={onDetails}
                        className="flex items-center gap-1 text-[12px] font-bold transition-opacity hover:opacity-70 rounded-lg px-2.5 py-1.5"
                        style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                    >
                        Details <ChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    )
}

// USER DASHBOARD — MAIN PAGE
type FilterTab = 'all' | BookingStatus

export default function UserDashboard() {
    const navigate = useNavigate()
    const { customer, accessToken, logout } = useAuth()
    const [activeTab, setActiveTab] = useState<FilterTab>('all')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<Booking | null>(null)
    const [orders, setOrders] = useState<Booking[]>([])
    const [ordersLoading, setOrdersLoading] = useState(false)

    const fetchOrders = (token: string) => {
        setOrdersLoading(true)
        getCustomerOrders(token)
            .then(raw => {
                const mapped = raw.flatMap(o => {
                    const b = mapOrderToBooking(o)
                    return b ? [b] : []
                })
                setOrders(mapped)
            })
            .catch(console.error)
            .finally(() => setOrdersLoading(false))
    }

    useEffect(() => {
        if (!accessToken) return
        fetchOrders(accessToken)
    }, [accessToken])

    async function handleSignOut() {
        await logout()
        navigate('/')
    }

    const avatarInitials = customer
        ? `${customer.firstName?.[0] ?? ''}${customer.lastName?.[0] ?? ''}`.toUpperCase() || DEFAULT_AVATAR
        : DEFAULT_AVATAR
    const displayName = customer
        ? `${customer.firstName} ${customer.lastName}`.trim() || customer.email
        : ''
    const displayEmail = customer?.email ?? ''

    const totalRides = orders.filter(b => b.status !== 'cancelled').length
    const totalSpentPence = orders
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, b) => sum + parseFloat(b.price.replace(/[^0-9.]/g, '')), 0)
    const totalSpentDisplay = orders[0]
        ? `${orders[0].price.replace(/[\d.,]+$/, '')}${totalSpentPence.toFixed(2)}`
        : 'AED 0.00'

    const tabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'in-progress', label: 'In Progress' },
        { key: 'confirmed', label: 'Confirmed' },
        { key: 'completed', label: 'Completed' },
        { key: 'cancelled', label: 'Cancelled' },
    ]

    const filtered = orders.filter(b => {
        const matchesTab = activeTab === 'all' || b.status === activeTab
        const matchesSearch = !search || [b.reference, b.from, b.to, b.vehicle]
            .some(f => f.toLowerCase().includes(search.toLowerCase()))
        return matchesTab && matchesSearch
    })

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F0F5F0' }}>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-8 space-y-5 sm:space-y-7">

                {/*  Profile hero  */}
                <div
                    className="rounded-2xl sm:rounded-3xl overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}
                >
                    <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-10 bg-white pointer-events-none" />
                    <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10 bg-white pointer-events-none" />

                    <div className="relative px-5 sm:px-8 py-5 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold font-head text-lg flex-shrink-0 shadow-lg"
                            style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                        >
                            {avatarInitials}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#BDD9BF' }}>My Account</p>
                            <h1 className="font-head text-white text-xl sm:text-2xl font-bold leading-none mb-1">{displayName}</h1>
                            <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 mt-1.5" style={{ color: '#BDD9BF' }}>
                                <span className="flex items-center gap-1 text-[11px] sm:text-[12px]"><Mail size={10} />{displayEmail}</span>
                                {customer?.phone && (
                                    <span className="flex items-center gap-1 text-[11px] sm:text-[12px]"><Phone size={10} />{customer.phone}</span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/book')}
                            className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold hover:opacity-90 transition-opacity shadow flex-shrink-0"
                            style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                        >
                            New Booking <ArrowRight size={13} />
                        </button>
                    </div>
                </div>

                {/*  Stats  */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard icon={Car} label="Total Rides" value={String(totalRides)} sub="all time" />
                    <StatCard icon={CreditCard} label="Total Spent" value={totalSpentDisplay} sub="all time" />
                    <StatCard icon={CheckCircle2} label="Completed" value={String(orders.filter(b => b.status === 'completed').length)} />
                    <StatCard icon={TrendingUp} label="Upcoming" value={String(orders.filter(b => ['confirmed', 'in-progress'].includes(b.status)).length)} />
                </div>

                {/*  Bookings list  */}
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <h2 className="font-head font-bold text-slate-800 text-[17px] sm:text-[18px] flex-1">My Bookings</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => accessToken && fetchOrders(accessToken)}
                                disabled={ordersLoading}
                                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold transition-opacity hover:opacity-70 disabled:opacity-50 flex-shrink-0"
                                style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                                title="Refresh bookings"
                            >
                                <RefreshCw size={13} className={ordersLoading ? 'animate-spin' : ''} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                            <div className="relative flex-1 sm:flex-initial">
                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text" placeholder="Search bookings…"
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-8 pr-3 py-2 text-[12px] rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#BDD9BF] w-full sm:w-52 text-slate-700 placeholder-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                        {tabs.map(tab => {
                            const count = tab.key === 'all' ? orders.length : orders.filter(b => b.status === tab.key).length
                            const active = activeTab === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-bold whitespace-nowrap flex-shrink-0 transition-all ${active ? 'text-white shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                                        }`}
                                    style={active ? { backgroundColor: '#2E4052' } : {}}
                                >
                                    {tab.label}
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>{count}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Cards */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {filtered.map(b => (
                                <BookingCard key={b.id} booking={b} onDetails={() => setSelected(b)} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl py-16 flex flex-col items-center gap-3 text-slate-400 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                            <CalendarDays size={36} className="opacity-30" />
                            <p className="font-head font-semibold text-[15px]">No bookings found</p>
                            <p className="text-[12px]">Try a different filter or search term.</p>
                        </div>
                    )}
                </div>

            </div>

            {/*  Details panel  */}
            {selected && (
                <BookingDetailsPanel booking={selected} onClose={() => setSelected(null)} />
            )}

        </div>
    )
}