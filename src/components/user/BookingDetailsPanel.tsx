import { useState } from 'react'
import {
    MapPin, Clock, Car, CalendarDays, CheckCircle2,
    XCircle, Loader2, Phone, Star, CreditCard, User,
    Luggage, Ruler, Timer, ChevronLeft, MessageCircle,
    Download, RotateCcw, AlertCircle, Navigation,
} from 'lucide-react'
import { Booking, BookingStatus } from '../../types/bookings.types';

//  Status config 
const STATUS_CONFIG: Record<BookingStatus, {
    label: string; color: string; bg: string; border: string; Icon: typeof CheckCircle2
}> = {
    'in-progress': { label: 'In Progress', color: '#2E4052', bg: '#BDD9BF', border: '#A8C9AA', Icon: Loader2 },
    confirmed: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe', Icon: CalendarDays },
    completed: { label: 'Completed', color: '#15803d', bg: '#dcfce7', border: '#bbf7d0', Icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2', border: '#fecaca', Icon: XCircle },
}

//  Star rating 
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={size}
                    fill={i <= rating ? '#FFC857' : 'none'}
                    stroke={i <= rating ? '#FFC857' : '#d1d5db'}
                />
            ))}
        </div>
    )
}

//  Section wrapper 
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <div className="px-5 py-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    )
}

//  Info row 
function InfoRow({ icon: Icon, label, value }: { icon: typeof Car; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-2 text-slate-500">
                <Icon size={13} />
                <span className="text-[12px] font-body">{label}</span>
            </div>
            <span className="text-[13px] font-semibold text-slate-700 font-head">{value}</span>
        </div>
    )
}

//  Props 
interface BookingDetailsProps {
    booking: Booking
    onClose: () => void
    /** if true, renders as a full page instead of a slide-over */
    fullPage?: boolean
}

//  Main component 
export default function BookingDetailsPanel({ booking, onClose, fullPage = false }: BookingDetailsProps) {
    const [tab, setTab] = useState<'overview' | 'timeline' | 'payment'>('overview')
    const s = STATUS_CONFIG[booking.status]

    const tabs = [
        { key: 'overview' as const, label: 'Overview' },
        { key: 'timeline' as const, label: 'Timeline' },
        { key: 'payment' as const, label: 'Payment' },
    ]

    const content = (
        <div className="flex flex-col h-full bg-white" style={{ fontFamily: 'inherit' }}>

            {/*  Header  */}
            <div
                className="relative flex-shrink-0 px-5 pt-5 pb-0"
                style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white pointer-events-none" />
                <div className="absolute bottom-0 left-4 w-20 h-20 rounded-full opacity-5 bg-white pointer-events-none" />

                {/* Back / close */}
                <div className="relative flex items-center justify-between mb-4">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1.5 text-[12px] font-semibold transition-opacity hover:opacity-70"
                        style={{ color: '#BDD9BF' }}
                    >
                        <ChevronLeft size={15} />
                        {fullPage ? 'Back to bookings' : 'Close'}
                    </button>
                    <span className="text-[11px] font-mono font-bold" style={{ color: '#BDD9BF' }}>{booking.reference}</span>
                </div>

                {/* Status + route summary */}
                <div className="relative mb-5">
                    <div
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold mb-3"
                        style={{ color: s.color, backgroundColor: 'rgba(255,255,255,0.9)' }}
                    >
                        <s.Icon size={11} className={booking.status === 'in-progress' ? 'animate-spin' : ''} />
                        {s.label}
                    </div>

                    <div className="flex gap-3 items-start">
                        {/* Timeline dots */}
                        <div className="flex flex-col items-center mt-1 flex-shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            <div className="w-px h-6 my-1 bg-white/30" />
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-white/60" />
                        </div>
                        {/* Locations */}
                        <div className="flex flex-col gap-4 flex-1 min-w-0">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#BDD9BF' }}>Pickup</div>
                                <div className="text-[14px] font-bold text-white font-head leading-tight">{booking.from}</div>
                                <div className="text-[11px] mt-0.5" style={{ color: '#BDD9BF' }}>{booking.date} · {booking.time}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#BDD9BF' }}>Drop-off</div>
                                <div className="text-[14px] font-bold text-white font-head leading-tight">{booking.to}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pill stats */}
                <div className="relative flex gap-2 pb-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    {[
                        { Icon: Ruler, value: booking.distance },
                        { Icon: Timer, value: booking.duration },
                        { Icon: Car, value: booking.vehicle },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 flex-shrink-0">
                            <item.Icon size={11} className="text-white/70" />
                            <span className="text-[11px] font-semibold text-white whitespace-nowrap">{item.value}</span>
                        </div>
                    ))}
                </div>

                {/* Tab bar sits on header bottom edge */}
                <div className="relative flex gap-0 -mb-px">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-5 py-2.5 text-[12px] font-bold transition-all rounded-t-xl ${tab === t.key
                                ? 'bg-white text-slate-800'
                                : 'text-white/60 hover:text-white/90'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/*  Scrollable body  */}
            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#F0F5F0' }}>
                <div className="p-4 space-y-3">

                    {/*  OVERVIEW tab  */}
                    {tab === 'overview' && (
                        <>
                            {/* Journey details */}
                            <Section title="Journey Details">
                                <div className="space-y-1">
                                    <InfoRow icon={MapPin} label="Pickup address" value={booking.fromFull} />
                                    <InfoRow icon={Navigation} label="Drop-off address" value={booking.toFull} />
                                    <InfoRow icon={CalendarDays} label="Date" value={booking.date} />
                                    <InfoRow icon={Clock} label="Pickup time" value={booking.time} />
                                    <InfoRow icon={Ruler} label="Distance" value={booking.distance} />
                                    <InfoRow icon={Timer} label="Est. duration" value={booking.duration} />
                                </div>
                            </Section>

                            {/* Vehicle */}
                            <Section title="Vehicle">
                                <div className="flex gap-4 items-center">
                                    <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                                        <img src={booking.vehicleImage} alt={booking.vehicle}
                                            className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[15px] font-bold text-slate-800 font-head">{booking.vehicle}</div>
                                        <div className="flex gap-3 mt-1">
                                            <span className="flex items-center gap-1 text-[12px] text-slate-500">
                                                <User size={12} />{booking.passengers} passengers
                                            </span>
                                            <span className="flex items-center gap-1 text-[12px] text-slate-500">
                                                <Luggage size={12} />{booking.luggage} bags
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* Driver */}
                            {booking.driver && (
                                <Section title="Your Driver">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[14px] font-head flex-shrink-0"
                                            style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                                        >
                                            {booking.driverAvatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[14px] font-bold text-slate-800 font-head">{booking.driver}</div>
                                            <div className="text-[12px] text-slate-400 font-body mt-0.5">Licensed Chauffeur</div>
                                        </div>
                                        {booking.driverPhone && (
                                            <a
                                                href={`tel:${booking.driverPhone}`}
                                                className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity hover:opacity-70 flex-shrink-0"
                                                style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                                            >
                                                <Phone size={15} />
                                            </a>
                                        )}
                                    </div>
                                </Section>
                            )}

                            {/* Notes */}
                            {booking.notes && (
                                <Section title="Special Notes">
                                    <div className="flex gap-2 items-start">
                                        <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-[13px] text-slate-600 font-body leading-relaxed">{booking.notes}</p>
                                    </div>
                                </Section>
                            )}

                            {/* Rating (completed) */}
                            {booking.status === 'completed' && booking.rating && (
                                <Section title="Your Rating">
                                    <div className="flex items-center gap-3 mb-2">
                                        <StarRating rating={booking.rating} size={16} />
                                        <span className="text-[13px] font-bold text-slate-700 font-head">{booking.rating} / 5</span>
                                    </div>
                                    {booking.ratingNote && (
                                        <p className="text-[12px] text-slate-500 font-body leading-relaxed italic">"{booking.ratingNote}"</p>
                                    )}
                                </Section>
                            )}
                        </>
                    )}

                    {/*  TIMELINE tab  */}
                    {tab === 'timeline' && (
                        <Section title="Journey Timeline">
                            <div className="flex flex-col gap-0">
                                {booking.timeline.map((event, i) => {
                                    const isLast = i === booking.timeline.length - 1
                                    return (
                                        <div key={i} className="flex gap-3">
                                            {/* dot + line */}
                                            <div className="flex flex-col items-center flex-shrink-0">
                                                <div
                                                    className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 border-2 transition-colors ${event.done
                                                        ? 'border-[#2E4052] bg-[#2E4052]'
                                                        : 'border-slate-300 bg-white'
                                                        }`}
                                                />
                                                {!isLast && (
                                                    <div
                                                        className="w-px flex-1 my-1"
                                                        style={{ backgroundColor: event.done ? '#2E4052' : '#e2e8f0', minHeight: '28px' }}
                                                    />
                                                )}
                                            </div>
                                            {/* content */}
                                            <div className={`pb-4 flex-1 min-w-0 ${isLast ? '' : ''}`}>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`text-[13px] font-semibold font-head leading-tight ${event.done ? 'text-slate-700' : 'text-slate-400'
                                                        }`}>{event.label}</span>
                                                    <span className={`text-[11px] font-mono font-bold flex-shrink-0 ${event.done ? 'text-[#2E4052]' : 'text-slate-400'
                                                        }`}>{event.time}</span>
                                                </div>
                                                {event.done && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <CheckCircle2 size={10} className="text-[#2E4052]" />
                                                        <span className="text-[10px] text-[#2E4052] font-body">Completed</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Section>
                    )}

                    {/*  PAYMENT tab  */}
                    {tab === 'payment' && (
                        <>
                            <Section title="Price Breakdown">
                                <div className="space-y-0">
                                    {booking.breakdown.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                                            <span className="text-[13px] text-slate-500 font-body">{item.label}</span>
                                            <span className="text-[13px] font-semibold text-slate-700 font-head">{item.amount}</span>
                                        </div>
                                    ))}
                                    {/* Total */}
                                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-200">
                                        <span className="text-[14px] font-bold text-slate-800 font-head">Total</span>
                                        <span className="text-[18px] font-bold font-head" style={{ color: '#2E4052' }}>{booking.price}</span>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Payment Method">
                                <InfoRow icon={CreditCard} label="Paid with" value={booking.paymentMethod} />
                                <InfoRow icon={CalendarDays} label="Booked on" value={booking.bookedOn} />
                            </Section>

                            {booking.status === 'completed' && (
                                <button
                                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold transition-opacity hover:opacity-80"
                                    style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                                >
                                    <Download size={14} /> Download Receipt
                                </button>
                            )}
                        </>
                    )}

                    {/*  Action buttons  */}
                    <div className="flex gap-2 pt-1">
                        {(booking.status === 'confirmed' || booking.status === 'in-progress') && (
                            <>
                                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-[12px] font-bold text-white transition-opacity hover:opacity-80"
                                    style={{ backgroundColor: '#2E4052' }}>
                                    <MessageCircle size={13} /> Contact Support
                                </button>
                                {booking.status === 'confirmed' && (
                                    <button className="flex items-center justify-center gap-1.5 rounded-xl py-3 px-4 text-[12px] font-bold border-2 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
                                        <XCircle size={13} /> Cancel
                                    </button>
                                )}
                            </>
                        )}
                        {booking.status === 'completed' && (
                            <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-[12px] font-bold text-white transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#2E4052' }}>
                                <RotateCcw size={13} /> Book Again
                            </button>
                        )}
                        {booking.status === 'cancelled' && (
                            <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-[12px] font-bold text-white transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#2E4052' }}>
                                <RotateCcw size={13} /> Rebook This Journey
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )

    if (fullPage) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: '#F0F5F0' }}>
                <div className="max-w-2xl mx-auto h-screen">{content}</div>
            </div>
        )
    }

    // Slide-over overlay
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 transition-opacity"
                onClick={onClose}
            />
            {/* Panel */}
            <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] md:w-[460px] shadow-2xl flex flex-col"
                style={{ maxHeight: '100dvh' }}>
                {content}
            </div>
        </>
    )
}