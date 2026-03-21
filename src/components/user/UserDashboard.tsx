import { useState } from 'react'
import {
    X, Clock, Car, ChevronRight, LogOut, User,
    CalendarDays, CheckCircle2, XCircle, Loader2,
    Phone, Mail, Star, CreditCard, ArrowRight, Search, Bell, Settings, TrendingUp, Luggage,
    MapPin, Navigation, Ruler, Timer, AlertCircle,
    Download, RotateCcw, MessageCircle, ChevronLeft,
} from 'lucide-react'

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
    'in-progress': { label: 'In Progress', color: '#0f766e', bg: '#ccfbf1', Icon: Loader2 },
    confirmed: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe', Icon: CalendarDays },
    completed: { label: 'Completed', color: '#15803d', bg: '#dcfce7', Icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2', Icon: XCircle },
}

//  Data 
const USER = {
    name: 'James Harrington', email: 'james.h@email.com',
    phone: '+971 50 123 4567', avatar: 'JH',
    memberSince: 'March 2023', totalRides: 14, totalSpent: 'AED 8,340',
}

const BOOKINGS: Booking[] = [
    {
        id: '1', reference: 'INV-2024-0091',
        date: '22 Mar 2025', time: '09:00',
        from: 'Dubai Intl Airport, T3', fromFull: 'Dubai International Airport, Terminal 3, Dubai',
        to: 'Downtown Dubai', toFull: 'Downtown Dubai, Burj Khalifa Blvd, Dubai',
        vehicle: 'Executive Saloon', vehicleImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 2, luggage: 2, status: 'in-progress', price: 'AED 285',
        breakdown: [{ label: 'Base fare', amount: 'AED 220' }, { label: 'Meet & greet', amount: 'AED 40' }, { label: 'Service charge', amount: 'AED 25' }],
        driver: 'Robert W.', driverPhone: '+971 50 900 1234', driverAvatar: 'RW',
        notes: 'Flight EK0471 — please monitor for delays.',
        timeline: [
            { time: '08:45', label: 'Driver en route to pickup', done: true },
            { time: '09:00', label: 'Passenger picked up', done: true },
            { time: '09:30', label: 'En route to destination', done: false },
            { time: '09:55', label: 'Arrived at destination', done: false },
        ],
        bookedOn: '15 Mar 2025', paymentMethod: 'Visa •••• 4242',
        distance: '14.8 mi', duration: '~35 min',
    },
    {
        id: '2', reference: 'INV-2024-0087',
        date: '18 Mar 2025', time: '14:30',
        from: 'Dubai Mall', fromFull: 'The Dubai Mall, Financial Centre Rd, Dubai',
        to: 'Abu Dhabi Intl Airport', toFull: 'Abu Dhabi International Airport, Abu Dhabi',
        vehicle: 'MPV (7 Seater)', vehicleImage: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
        passengers: 5, luggage: 6, status: 'confirmed', price: 'AED 520',
        breakdown: [{ label: 'Base fare', amount: 'AED 430' }, { label: 'Extra luggage', amount: 'AED 50' }, { label: 'Service charge', amount: 'AED 40' }],
        driver: 'Sarah M.', driverPhone: '+971 50 900 4567', driverAvatar: 'SM',
        timeline: [
            { time: '14:00', label: 'Driver assigned', done: true },
            { time: '14:30', label: 'Passenger pickup scheduled', done: false },
            { time: '16:15', label: 'Arrival at Abu Dhabi Airport', done: false },
        ],
        bookedOn: '10 Mar 2025', paymentMethod: 'Mastercard •••• 8810',
        distance: '78.4 mi', duration: '~100 min',
    },
    {
        id: '3', reference: 'INV-2024-0074',
        date: '4 Mar 2025', time: '07:15',
        from: 'Palm Jumeirah', fromFull: 'Palm Jumeirah, Atlantis The Palm, Dubai',
        to: 'Dubai Intl Airport, T1', toFull: 'Dubai International Airport, Terminal 1, Dubai',
        vehicle: 'Executive Saloon', vehicleImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 1, luggage: 1, status: 'completed', price: 'AED 195',
        breakdown: [{ label: 'Base fare', amount: 'AED 160' }, { label: 'Early morning', amount: 'AED 20' }, { label: 'Service charge', amount: 'AED 15' }],
        driver: 'David K.', driverPhone: '+971 50 900 7890', driverAvatar: 'DK',
        rating: 5, ratingNote: 'Incredibly professional. Car was immaculate. Will definitely book again.',
        timeline: [
            { time: '07:00', label: 'Driver arrived at pickup', done: true },
            { time: '07:15', label: 'Journey started', done: true },
            { time: '07:55', label: 'Arrived at Airport T1', done: true },
        ],
        bookedOn: '28 Feb 2025', paymentMethod: 'Visa •••• 4242',
        distance: '22.6 mi', duration: '~40 min',
    },
    {
        id: '4', reference: 'INV-2024-0068',
        date: '19 Feb 2025', time: '11:00',
        from: 'Dubai Marina', fromFull: 'Dubai Marina Mall, Sheikh Zayed Rd, Dubai',
        to: 'Sharjah City Centre', toFull: 'City Centre Sharjah, Al Wahda St, Sharjah',
        vehicle: 'Luxury SUV', vehicleImage: 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg',
        passengers: 3, luggage: 3, status: 'completed', price: 'AED 240',
        breakdown: [{ label: 'Base fare', amount: 'AED 200' }, { label: 'Service charge', amount: 'AED 40' }],
        driver: 'Lisa T.', driverPhone: '+971 50 900 3210', driverAvatar: 'LT',
        rating: 4, ratingNote: 'Great ride, very smooth. Slightly delayed start but communicated well.',
        timeline: [
            { time: '10:55', label: 'Driver arrived at pickup', done: true },
            { time: '11:00', label: 'Journey started', done: true },
            { time: '11:45', label: 'Arrived at Sharjah', done: true },
        ],
        bookedOn: '12 Feb 2025', paymentMethod: 'Amex •••• 1005',
        distance: '18.2 mi', duration: '~45 min',
    },
    {
        id: '5', reference: 'INV-2024-0055',
        date: '2 Feb 2025', time: '16:45',
        from: 'Business Bay', fromFull: 'Business Bay, Al Abraj St, Dubai',
        to: 'Dubai Hills Mall', toFull: 'Dubai Hills Mall, Dubai Hills Estate, Dubai',
        vehicle: 'Executive Saloon', vehicleImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 2, luggage: 1, status: 'cancelled', price: 'AED 120',
        breakdown: [{ label: 'Base fare', amount: 'AED 100' }, { label: 'Service charge', amount: 'AED 20' }],
        timeline: [
            { time: '16:30', label: 'Booking confirmed', done: true },
            { time: '16:45', label: 'Booking cancelled', done: true },
        ],
        bookedOn: '30 Jan 2025', paymentMethod: 'Visa •••• 4242',
        distance: '9.4 mi', duration: '~25 min',
    },
]

// BOOKING DETAILS PANEL
function StarRatingLg({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={15}
                    fill={i <= rating ? '#f59e0b' : 'none'}
                    stroke={i <= rating ? '#f59e0b' : '#d1d5db'}
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
    const [tab, setTab] = useState<'overview' | 'payment'>('overview')
    const s = STATUS_CONFIG[booking.status]

    const tabs = [
        { key: 'overview' as const, label: 'Overview' },
        { key: 'payment' as const, label: 'Payment' },
    ]

    return (
        <>
            {/* Backdrop — sits below navbar */}
            <div
                className="fixed top-14 bottom-0 left-0 right-0 bg-black/40 backdrop-blur-[2px] z-30"
                onClick={onClose}
            />

            {/* Panel — starts below navbar (top-14 = 56px) on all sizes, right drawer on sm+ */}
            <div
                className="fixed top-14 bottom-0 left-0 right-0 sm:left-auto sm:right-0 sm:w-[420px] md:w-[460px] z-40 flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div
                    className="relative flex-shrink-0 px-5 pt-5 pb-0"
                    style={{ background: 'linear-gradient(135deg, #0f4c3e 0%, #1a6b5a 60%, #2d9c84 100%)' }}
                >
                    <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white pointer-events-none" />

                    {/* Top row: Back link (desktop) + reference + Close button (always visible) */}
                    <div className="relative flex items-center justify-between mb-4">
                        <button onClick={onClose}
                            className="hidden sm:flex items-center gap-1 text-[12px] font-semibold hover:opacity-70 transition-opacity"
                            style={{ color: '#a7c8c2' }}>
                            <ChevronLeft size={14} /> Back
                        </button>
                        {/* On mobile the reference is left-aligned since Back is hidden */}
                        <span className="text-[10px] font-mono font-bold sm:mx-auto" style={{ color: '#a7c8c2' }}>{booking.reference}</span>
                        {/* Close × — always rendered, critical for mobile */}
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
                        >
                            <X size={17} className="text-white" />
                        </button>
                    </div>

                    {/* Status + route */}
                    <div className="relative mb-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold mb-3 bg-white/90"
                            style={{ color: s.color }}>
                            <s.Icon size={11} className={booking.status === 'in-progress' ? 'animate-spin' : ''} />
                            {s.label}
                        </div>

                        <div className="flex gap-3 items-start">
                            <div className="flex flex-col items-center mt-1 flex-shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                <div className="w-px h-6 my-1 bg-white/30" />
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-white/60" />
                            </div>
                            <div className="flex flex-col gap-3 flex-1 min-w-0">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#a7c8c2' }}>Pickup</div>
                                    <div className="text-[14px] font-bold text-white font-head leading-tight">{booking.from}</div>
                                    <div className="text-[11px] mt-0.5" style={{ color: '#a7c8c2' }}>{booking.date} · {booking.time}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#a7c8c2' }}>Drop-off</div>
                                    <div className="text-[14px] font-bold text-white font-head leading-tight">{booking.to}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat pills */}
                    <div className="relative flex gap-2 pb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                        {[{ Icon: Ruler, v: booking.distance }, { Icon: Timer, v: booking.duration }, { Icon: Car, v: booking.vehicle }].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 flex-shrink-0">
                                <item.Icon size={11} className="text-white/70" />
                                <span className="text-[11px] font-semibold text-white whitespace-nowrap">{item.v}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tab bar */}
                    <div className="relative flex gap-0 -mb-px">
                        {tabs.map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`px-5 py-2.5 text-[12px] font-bold transition-all rounded-t-xl ${tab === t.key ? 'bg-white text-slate-800' : 'text-white/60 hover:text-white/90'
                                    }`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f0f5f4' }}>
                    <div className="p-4 space-y-3">

                        {/* OVERVIEW */}
                        {tab === 'overview' && (
                            <>
                                <Section title="Journey Details">
                                    <InfoRow icon={MapPin} label="Pickup address" value={booking.fromFull} />
                                    <InfoRow icon={Navigation} label="Drop-off address" value={booking.toFull} />
                                    <InfoRow icon={CalendarDays} label="Date" value={booking.date} />
                                    <InfoRow icon={Clock} label="Pickup time" value={booking.time} />
                                    <InfoRow icon={Ruler} label="Distance" value={booking.distance} />
                                    <InfoRow icon={Timer} label="Est. duration" value={booking.duration} />
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

                                {booking.driver && (
                                    <Section title="Your Driver">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[13px] font-head flex-shrink-0"
                                                style={{ backgroundColor: '#e8eeec', color: '#0f4c3e' }}>
                                                {booking.driverAvatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[14px] font-bold text-slate-800 font-head">{booking.driver}</div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">Licensed Chauffeur</div>
                                            </div>
                                            {booking.driverPhone && (
                                                <a href={`tel:${booking.driverPhone}`}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70 transition-opacity flex-shrink-0"
                                                    style={{ backgroundColor: '#e8eeec', color: '#0f4c3e' }}>
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
                                        <span className="text-[18px] font-bold font-head" style={{ color: '#0f4c3e' }}>{booking.price}</span>
                                    </div>
                                </Section>

                                <Section title="Payment Details">
                                    <InfoRow icon={CreditCard} label="Paid with" value={booking.paymentMethod} />
                                    <InfoRow icon={CalendarDays} label="Booked on" value={booking.bookedOn} />
                                </Section>

                                {booking.status === 'completed' && (
                                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold hover:opacity-80 transition-opacity"
                                        style={{ backgroundColor: '#e8eeec', color: '#0f4c3e' }}>
                                        <Download size={14} /> Download Receipt
                                    </button>
                                )}
                            </>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-1">
                            {(booking.status === 'confirmed' || booking.status === 'in-progress') && (
                                <>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-[12px] font-bold text-white hover:opacity-80 transition-opacity"
                                        style={{ backgroundColor: '#0f4c3e' }}>
                                        <MessageCircle size={13} /> Contact Support
                                    </button>
                                    {booking.status === 'confirmed' && (
                                        <button className="flex items-center justify-center gap-1.5 rounded-xl py-3 px-4 text-[12px] font-bold border-2 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
                                            <XCircle size={13} /> Cancel
                                        </button>
                                    )}
                                </>
                            )}
                            {(booking.status === 'completed' || booking.status === 'cancelled') && (
                                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-[12px] font-bold text-white hover:opacity-80 transition-opacity"
                                    style={{ backgroundColor: '#0f4c3e' }}>
                                    <RotateCcw size={13} /> {booking.status === 'cancelled' ? 'Rebook Journey' : 'Book Again'}
                                </button>
                            )}
                        </div>

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
                    fill={i <= rating ? '#f59e0b' : 'none'}
                    stroke={i <= rating ? '#f59e0b' : '#d1d5db'}
                />
            ))}
        </div>
    )
}

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof User; label: string; value: string; sub?: string }) {
    return (
        <div className="bg-white rounded-2xl px-4 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8eeec' }}>
                <Icon size={18} style={{ color: '#0f766e' }} />
            </div>
            <div className="min-w-0">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold truncate">{label}</div>
                <div className="text-[18px] font-bold text-slate-800 font-head leading-tight">{value}</div>
                {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
            </div>
        </div>
    )
}

function BookingCard({ booking, onDetails }: { booking: Booking; onDetails: () => void }) {
    const s = STATUS_CONFIG[booking.status]
    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] transition-shadow duration-200">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">{booking.reference}</span>
                <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ color: s.color, backgroundColor: s.bg }}>
                    <s.Icon size={11} className={booking.status === 'in-progress' ? 'animate-spin' : ''} />
                    <span className="hidden xs:inline">{s.label}</span>
                </div>
            </div>

            {/* Route */}
            <div className="px-4 py-4">
                <div className="flex gap-3">
                    <div className="flex flex-col items-center pt-1 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0f766e' }} />
                        <div className="w-px flex-1 my-1" style={{ backgroundColor: '#d5e0de' }} />
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Pickup</div>
                            <div className="text-[13px] font-semibold text-slate-700 font-head leading-tight line-clamp-1">{booking.from}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Drop-off</div>
                            <div className="text-[13px] font-semibold text-slate-700 font-head leading-tight line-clamp-1">{booking.to}</div>
                        </div>
                    </div>
                </div>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><CalendarDays size={11} />{booking.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{booking.time}</span>
                    <span className="flex items-center gap-1 hidden sm:flex"><Car size={11} />{booking.vehicle}</span>
                    <span className="flex items-center gap-1"><User size={11} />{booking.passengers} pax</span>
                    <span className="flex items-center gap-1"><Luggage size={11} />{booking.luggage} bags</span>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[17px] font-bold text-slate-800 font-head">{booking.price}</span>
                        {booking.driver && (
                            <span className="text-[11px] text-slate-400 hidden sm:block truncate">
                                · <span className="text-slate-600 font-semibold">{booking.driver}</span>
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {booking.rating && <StarRatingSm rating={booking.rating} />}
                        <button
                            onClick={onDetails}
                            className="flex items-center gap-1 text-[12px] font-bold transition-opacity hover:opacity-70 rounded-lg px-2.5 py-1.5"
                            style={{ backgroundColor: '#e8eeec', color: '#0f4c3e' }}
                        >
                            Details <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// USER DASHBOARD — MAIN PAGE
type FilterTab = 'all' | BookingStatus

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState<FilterTab>('all')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<Booking | null>(null)

    const tabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'in-progress', label: 'In Progress' },
        { key: 'confirmed', label: 'Confirmed' },
        { key: 'completed', label: 'Completed' },
        { key: 'cancelled', label: 'Cancelled' },
    ]

    const filtered = BOOKINGS.filter(b => {
        const matchesTab = activeTab === 'all' || b.status === activeTab
        const matchesSearch = !search || [b.reference, b.from, b.to, b.vehicle]
            .some(f => f.toLowerCase().includes(search.toLowerCase()))
        return matchesTab && matchesSearch
    })

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f0f5f4' }}>

            {/*  Nav  */}
            <header className="bg-white border-b border-slate-100 fixed top-0 left-0 right-0 z-20 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Car size={20} style={{ color: '#0f766e' }} />
                        <span className="font-head font-bold text-slate-800 text-[15px] sm:text-[16px]">Coach Hire Compare</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                            <Bell size={16} className="text-slate-500" />
                        </button>
                        <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                            <Settings size={16} className="text-slate-500" />
                        </button>
                        <button className="hidden sm:flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-red-500 transition-colors font-semibold ml-1">
                            <LogOut size={13} /> Sign out
                        </button>
                        <button className="sm:hidden w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100">
                            <LogOut size={15} className="text-slate-500" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-[80px] pb-8 space-y-5 sm:space-y-7">

                {/*  Profile hero  */}
                <div
                    className="rounded-2xl sm:rounded-3xl overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #0f4c3e 0%, #1a6b5a 60%, #2d9c84 100%)' }}
                >
                    <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-10 bg-white pointer-events-none" />
                    <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10 bg-white pointer-events-none" />

                    <div className="relative px-5 sm:px-8 py-5 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold font-head text-lg flex-shrink-0 shadow-lg"
                            style={{ backgroundColor: '#d5e0de', color: '#0f4c3e' }}
                        >
                            {USER.avatar}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#a7c8c2' }}>My Account</p>
                            <h1 className="font-head text-white text-xl sm:text-2xl font-bold leading-none mb-1">{USER.name}</h1>
                            <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 mt-1.5" style={{ color: '#a7c8c2' }}>
                                <span className="flex items-center gap-1 text-[11px] sm:text-[12px]"><Mail size={10} />{USER.email}</span>
                                <span className="flex items-center gap-1 text-[11px] sm:text-[12px]"><Phone size={10} />{USER.phone}</span>
                                <span className="hidden sm:flex items-center gap-1 text-[12px]"><CalendarDays size={10} />Member since {USER.memberSince}</span>
                            </div>
                        </div>

                        <button
                            className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold hover:opacity-90 transition-opacity shadow flex-shrink-0"
                            style={{ backgroundColor: '#d5e0de', color: '#0f4c3e' }}
                        >
                            New Booking <ArrowRight size={13} />
                        </button>
                    </div>
                </div>

                {/*  Stats  */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard icon={Car} label="Total Rides" value={String(USER.totalRides)} sub="all time" />
                    <StatCard icon={CreditCard} label="Total Spent" value={USER.totalSpent} sub="all time" />
                    <StatCard icon={CheckCircle2} label="Completed" value={String(BOOKINGS.filter(b => b.status === 'completed').length)} />
                    <StatCard icon={TrendingUp} label="Upcoming" value={String(BOOKINGS.filter(b => ['confirmed', 'in-progress'].includes(b.status)).length)} />
                </div>

                {/*  Bookings list  */}
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <h2 className="font-head font-bold text-slate-800 text-[17px] sm:text-[18px] flex-1">My Bookings</h2>
                        <div className="flex gap-2">
                            <div className="relative flex-1 sm:flex-initial">
                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text" placeholder="Search bookings…"
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-8 pr-3 py-2 text-[12px] rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 w-full sm:w-52 text-slate-700 placeholder-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                        {tabs.map(tab => {
                            const count = tab.key === 'all' ? BOOKINGS.length : BOOKINGS.filter(b => b.status === tab.key).length
                            const active = activeTab === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-bold whitespace-nowrap flex-shrink-0 transition-all ${active ? 'text-white shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                                        }`}
                                    style={active ? { backgroundColor: '#0f4c3e' } : {}}
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