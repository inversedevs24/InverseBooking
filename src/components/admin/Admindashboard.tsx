import { useState } from 'react'
import {
    Search, LayoutDashboard, ShoppingBag,
    Users, Car, CheckCircle2, XCircle, Loader2,
    CalendarDays, ChevronDown, X, Phone, Mail,
    MapPin, Clock, Luggage, ArrowRight, AlertTriangle,
    TrendingUp, DollarSign, RefreshCw, Eye,
} from 'lucide-react'

//  Types 
type OrderStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'

interface Driver {
    id: string
    name: string
    phone: string
    avatar: string
    vehicle: string
    available: boolean
}

interface Order {
    id: string
    reference: string
    customer: string
    customerEmail: string
    customerPhone: string
    date: string
    time: string
    from: string
    to: string
    vehicle: string
    passengers: number
    luggage: number
    status: OrderStatus
    price: string
    driver?: string
    driverId?: string
    driverPhone?: string
    bookedOn: string
    distance: string
    duration: string
    notes?: string
}

//  Hardcoded data 
const DRIVERS: Driver[] = [
    { id: 'd1', name: 'Robert Wilson', phone: '+971 50 900 1234', avatar: 'RW', vehicle: 'Mercedes S-Class', available: false },
    { id: 'd2', name: 'Sarah Mitchell', phone: '+971 50 900 4567', avatar: 'SM', vehicle: 'BMW 7 Series', available: true },
    { id: 'd3', name: 'David Khan', phone: '+971 50 900 7890', avatar: 'DK', vehicle: 'Range Rover Vogue', available: true },
    { id: 'd4', name: 'Lisa Thomas', phone: '+971 50 900 3210', avatar: 'LT', vehicle: 'Cadillac Escalade', available: true },
    { id: 'd5', name: 'Ahmed Hassan', phone: '+971 55 100 2233', avatar: 'AH', vehicle: 'Mercedes V-Class', available: false },
    { id: 'd6', name: 'Omar Farooq', phone: '+971 55 100 4455', avatar: 'OF', vehicle: 'Toyota Prado', available: true },
]

const INITIAL_ORDERS: Order[] = [
    {
        id: '1', reference: 'INV-2024-0091',
        customer: 'James Harrington', customerEmail: 'james.h@email.com', customerPhone: '+971 50 123 4567',
        date: '22 Mar 2025', time: '09:00',
        from: 'Dubai Intl Airport, T3', to: 'Downtown Dubai',
        vehicle: 'Executive Saloon', passengers: 2, luggage: 2,
        status: 'in-progress', price: 'AED 285',
        driver: 'Robert Wilson', driverId: 'd1', driverPhone: '+971 50 900 1234',
        bookedOn: '15 Mar 2025', distance: '14.8 mi', duration: '~35 min',
        notes: 'Flight EK0471 — monitor for delays.',
    },
    {
        id: '2', reference: 'INV-2024-0087',
        customer: 'Fatima Al Rashid', customerEmail: 'fatima.r@email.com', customerPhone: '+971 52 234 5678',
        date: '18 Mar 2025', time: '14:30',
        from: 'Dubai Mall', to: 'Abu Dhabi Intl Airport',
        vehicle: 'MPV (7 Seater)', passengers: 5, luggage: 6,
        status: 'confirmed', price: 'AED 520',
        driver: 'Sarah Mitchell', driverId: 'd2', driverPhone: '+971 50 900 4567',
        bookedOn: '10 Mar 2025', distance: '78.4 mi', duration: '~100 min',
    },
    {
        id: '3', reference: 'INV-2024-0074',
        customer: 'Mohammed Al Maktoum', customerEmail: 'm.maktoum@email.com', customerPhone: '+971 50 345 6789',
        date: '4 Mar 2025', time: '07:15',
        from: 'Palm Jumeirah', to: 'Dubai Intl Airport, T1',
        vehicle: 'Executive Saloon', passengers: 1, luggage: 1,
        status: 'completed', price: 'AED 195',
        driver: 'David Khan', driverId: 'd3', driverPhone: '+971 50 900 7890',
        bookedOn: '28 Feb 2025', distance: '22.6 mi', duration: '~40 min',
    },
    {
        id: '4', reference: 'INV-2024-0068',
        customer: 'Sarah Johnson', customerEmail: 's.johnson@email.com', customerPhone: '+971 54 456 7890',
        date: '19 Feb 2025', time: '11:00',
        from: 'Dubai Marina', to: 'Sharjah City Centre',
        vehicle: 'Luxury SUV', passengers: 3, luggage: 3,
        status: 'completed', price: 'AED 240',
        driver: 'Lisa Thomas', driverId: 'd4', driverPhone: '+971 50 900 3210',
        bookedOn: '12 Feb 2025', distance: '18.2 mi', duration: '~45 min',
    },
    {
        id: '5', reference: 'INV-2024-0055',
        customer: 'Khalid Al Nasser', customerEmail: 'khalid.n@email.com', customerPhone: '+971 56 567 8901',
        date: '2 Feb 2025', time: '16:45',
        from: 'Business Bay', to: 'Dubai Hills Mall',
        vehicle: 'Executive Saloon', passengers: 2, luggage: 1,
        status: 'cancelled', price: 'AED 120',
        bookedOn: '30 Jan 2025', distance: '9.4 mi', duration: '~25 min',
    },
    {
        id: '6', reference: 'INV-2024-0101',
        customer: 'Priya Sharma', customerEmail: 'priya.s@email.com', customerPhone: '+971 55 678 9012',
        date: '25 Mar 2025', time: '08:00',
        from: 'Jumeirah Beach Residence', to: 'DIFC',
        vehicle: 'Business Class', passengers: 1, luggage: 1,
        status: 'pending', price: 'AED 175',
        bookedOn: '20 Mar 2025', distance: '12.3 mi', duration: '~30 min',
    },
    {
        id: '7', reference: 'INV-2024-0102',
        customer: 'David Lee', customerEmail: 'd.lee@email.com', customerPhone: '+971 50 789 0123',
        date: '26 Mar 2025', time: '10:30',
        from: 'Deira City Centre', to: 'Dubai Intl Airport, T2',
        vehicle: 'Economy Sedan', passengers: 2, luggage: 2,
        status: 'pending', price: 'AED 95',
        bookedOn: '21 Mar 2025', distance: '6.1 mi', duration: '~20 min',
    },
]

//  Status config 
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }> = {
    pending: { label: 'Pending', color: '#92400e', bg: '#fef3c7', Icon: Clock },
    confirmed: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe', Icon: CalendarDays },
    'in-progress': { label: 'In Progress', color: '#2E4052', bg: '#BDD9BF', Icon: Loader2 },
    completed: { label: 'Completed', color: '#15803d', bg: '#dcfce7', Icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2', Icon: XCircle },
}

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']

//  Stat card 
function StatCard({ icon: Icon, label, value, sub, color }: {
    icon: typeof TrendingUp; label: string; value: string; sub: string; color: string
}) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: color + '18' }}>
                <Icon size={18} style={{ color }} />
            </div>
            <div className="min-w-0">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold truncate">{label}</div>
                <div className="text-[18px] font-bold text-slate-800 font-head leading-tight truncate">{value}</div>
                <div className="text-[10px] text-slate-400 truncate">{sub}</div>
            </div>
        </div>
    )
}

//  Assign Driver Modal 
function AssignDriverModal({ order, onAssign, onClose }: {
    order: Order
    onAssign: (orderId: string, driver: Driver) => void
    onClose: () => void
}) {
    const [selected, setSelected] = useState<string>(order.driverId ?? '')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
                    style={{ backgroundColor: '#F0F5F0' }}>
                    <div>
                        <h3 className="font-head font-bold text-slate-800 text-[16px]">Assign Driver</h3>
                        <p className="text-[12px] text-slate-400 mt-0.5">{order.reference} · {order.from} → {order.to}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <X size={16} className="text-slate-500" />
                    </button>
                </div>

                {/* Driver list */}
                <div className="p-4 flex flex-col gap-2 max-h-[360px] overflow-y-auto">
                    {DRIVERS.map(d => (
                        <button
                            key={d.id}
                            onClick={() => setSelected(d.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all border-2 ${selected === d.id
                                    ? 'border-[#2E4052] bg-[#EAF0EA]'
                                    : 'border-transparent bg-slate-50 hover:bg-slate-100'
                                }`}
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[12px] flex-shrink-0"
                                style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}>
                                {d.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-slate-800">{d.name}</div>
                                <div className="text-[11px] text-slate-400">{d.vehicle}</div>
                            </div>
                            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.available ? 'text-green-700 bg-green-100' : 'text-slate-400 bg-slate-100'
                                }`}>
                                {d.available ? 'Available' : 'On Ride'}
                            </div>
                            {selected === d.id && <CheckCircle2 size={16} className="text-[#2E4052] flex-shrink-0" />}
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-4 pb-4 flex gap-2">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            const driver = DRIVERS.find(d => d.id === selected)
                            if (driver) { onAssign(order.id, driver); onClose() }
                        }}
                        disabled={!selected}
                        className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                        style={{ backgroundColor: '#2E4052' }}
                    >
                        Assign Driver
                    </button>
                </div>
            </div>
        </div>
    )
}

//  Cancel Confirm Modal 
function CancelModal({ order, onConfirm, onClose }: {
    order: Order; onConfirm: () => void; onClose: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={24} className="text-red-500" />
                </div>
                <h3 className="font-head font-bold text-slate-800 text-[17px] mb-2">Cancel Order?</h3>
                <p className="text-[13px] text-slate-500 mb-1">{order.reference}</p>
                <p className="text-[12px] text-slate-400 mb-6">{order.customer} · {order.price}</p>
                <div className="flex gap-2">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                        Keep Order
                    </button>
                    <button onClick={() => { onConfirm(); onClose() }}
                        className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

//  Order Detail Panel 
function OrderDetailPanel({ order, onClose, onAssignDriver, onStatusChange, onCancel }: {
    order: Order
    onClose: () => void
    onAssignDriver: () => void
    onStatusChange: (status: OrderStatus) => void
    onCancel: () => void
}) {
    const s = STATUS_CONFIG[order.status]
    const [statusOpen, setStatusOpen] = useState(false)

    return (
        <>
            {/* Backdrop — only on sm+ since mobile is full screen */}
            <div className="hidden sm:block fixed top-14 bottom-0 left-0 right-0 bg-black/40 backdrop-blur-[2px] z-30" onClick={onClose} />
            {/* Panel — starts below navbar on all sizes, full width on mobile, drawer on sm+ */}
            <div className="fixed top-14 bottom-0 left-0 right-0 sm:left-auto sm:right-0 sm:w-[420px] z-40 flex flex-col bg-white shadow-2xl">
                {/* Header */}
                <div className="flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2E4052 0%, #3A5268 60%, #4A6278 100%)' }}>
                    <div className="px-5 pt-5 pb-0">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono font-bold" style={{ color: '#BDD9BF' }}>{order.reference}</span>
                            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0">
                                <X size={15} className="text-white" />
                            </button>
                        </div>

                        {/* Status pill */}
                        <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold mb-3 bg-white/90"
                            style={{ color: s.color }}>
                            <s.Icon size={11} className={order.status === 'in-progress' ? 'animate-spin' : ''} />
                            {s.label}
                        </div>

                        {/* Route */}
                        <div className="flex gap-3 mb-4">
                            <div className="flex flex-col items-center flex-shrink-0 mt-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                <div className="w-px h-6 my-1 bg-white/30" />
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-white/60" />
                            </div>
                            <div className="flex flex-col gap-3 flex-1 min-w-0">
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: '#BDD9BF' }}>Pickup</div>
                                    <div className="text-[13px] font-bold text-white">{order.from}</div>
                                    <div className="text-[11px] mt-0.5" style={{ color: '#BDD9BF' }}>{order.date} · {order.time}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: '#BDD9BF' }}>Drop-off</div>
                                    <div className="text-[13px] font-bold text-white">{order.to}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tab bar placeholder */}
                        <div className="flex gap-0 -mb-px">
                            <div className="px-5 py-2.5 text-[12px] font-bold bg-white text-slate-800 rounded-t-xl">Details</div>
                        </div>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: '#F0F5F0' }}>

                    {/* Customer */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                        <div className="px-4 py-2.5 border-b border-slate-100" style={{ backgroundColor: '#f8fafa' }}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</span>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                            {[
                                { Icon: Users, label: order.customer },
                                { Icon: Mail, label: order.customerEmail },
                                { Icon: Phone, label: order.customerPhone },
                            ].map(({ Icon, label }, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-[12px] text-slate-600">
                                    <Icon size={13} className="text-slate-400 flex-shrink-0" />{label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trip info */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                        <div className="px-4 py-2.5 border-b border-slate-100" style={{ backgroundColor: '#f8fafa' }}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trip Details</span>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                            {[
                                { Icon: Car, label: 'Vehicle', val: order.vehicle },
                                { Icon: Users, label: 'Passengers', val: `${order.passengers} pax` },
                                { Icon: Luggage, label: 'Luggage', val: `${order.luggage} bags` },
                                { Icon: MapPin, label: 'Distance', val: order.distance },
                                { Icon: Clock, label: 'Duration', val: order.duration },
                                { Icon: DollarSign, label: 'Price', val: order.price },
                                { Icon: CalendarDays, label: 'Booked On', val: order.bookedOn },
                            ].map(({ Icon, label, val }, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Icon size={12} />
                                        <span className="text-[12px]">{label}</span>
                                    </div>
                                    <span className="text-[12px] font-semibold text-slate-700">{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Driver */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between" style={{ backgroundColor: '#f8fafa' }}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Driver</span>
                            {order.status !== 'cancelled' && order.status !== 'completed' && (
                                <button onClick={onAssignDriver}
                                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors"
                                    style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}>
                                    {order.driver ? 'Reassign' : 'Assign Driver'}
                                </button>
                            )}
                        </div>
                        <div className="px-4 py-3">
                            {order.driver ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[12px] flex-shrink-0"
                                        style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}>
                                        {order.driver.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[13px] font-bold text-slate-800">{order.driver}</div>
                                        <div className="text-[11px] text-slate-400">{order.driverPhone}</div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[12px] text-slate-400 italic">No driver assigned yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3" style={{ backgroundColor: '#fef3c7' }}>
                            <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[12px] text-amber-800 leading-relaxed">{order.notes}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2 pt-1">
                        {/* Update status */}
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <div className="relative">
                                <button
                                    onClick={() => setStatusOpen(v => !v)}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                                    style={{ backgroundColor: '#2E4052' }}
                                >
                                    <span className="flex items-center gap-2"><RefreshCw size={14} /> Update Status</span>
                                    <ChevronDown size={14} className={`transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {statusOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-10">
                                        {STATUS_OPTIONS.filter(s => s !== order.status && s !== 'cancelled').map(s => {
                                            const cfg = STATUS_CONFIG[s]
                                            return (
                                                <button key={s} onClick={() => { onStatusChange(s); setStatusOpen(false) }}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold hover:bg-slate-50 transition-colors text-left">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                                                    {cfg.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cancel */}
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button onClick={onCancel}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border-2 border-red-200">
                                <XCircle size={14} /> Cancel Order
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

//  Main Admin Dashboard 
type FilterTab = 'all' | OrderStatus

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
    const [activeTab, setActiveTab] = useState<FilterTab>('all')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<Order | null>(null)
    const [assignTarget, setAssignTarget] = useState<Order | null>(null)
    const [cancelTarget, setCancelTarget] = useState<Order | null>(null)

    const tabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'confirmed', label: 'Confirmed' },
        { key: 'in-progress', label: 'In Progress' },
        { key: 'completed', label: 'Completed' },
        { key: 'cancelled', label: 'Cancelled' },
    ]

    const filtered = orders.filter(o => {
        const matchTab = activeTab === 'all' || o.status === activeTab
        const matchSearch = !search || [o.reference, o.customer, o.from, o.to, o.vehicle]
            .some(f => f.toLowerCase().includes(search.toLowerCase()))
        return matchTab && matchSearch
    })

    const handleAssignDriver = (orderId: string, driver: Driver) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId
                ? {
                    ...o, driver: driver.name, driverId: driver.id, driverPhone: driver.phone,
                    status: o.status === 'pending' ? 'confirmed' : o.status
                }
                : o
        ))
        setSelected(prev => prev?.id === orderId
            ? {
                ...prev, driver: driver.name, driverId: driver.id, driverPhone: driver.phone,
                status: prev.status === 'pending' ? 'confirmed' : prev.status
            }
            : prev
        )
    }

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
        setSelected(prev => prev?.id === orderId ? { ...prev, status } : prev)
    }

    const handleCancel = (orderId: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
        setSelected(prev => prev?.id === orderId ? { ...prev, status: 'cancelled' } : prev)
    }

    // Stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        active: orders.filter(o => ['confirmed', 'in-progress'].includes(o.status)).length,
        completed: orders.filter(o => o.status === 'completed').length,
        revenue: 'AED ' + orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + parseInt(o.price.replace(/\D/g, '')), 0)
            .toLocaleString(),
    }

    return (
        <div className="min-h-screen font-body" style={{ backgroundColor: '#F0F5F0' }}>

            {/*  Top bar  */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E4052' }}>
                            <LayoutDashboard size={14} className="text-white" />
                        </div>
                        <span className="font-head font-bold text-slate-800 text-[15px] sm:text-[16px]">Admin Dashboard</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                {/*  Stats  */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard icon={ShoppingBag} label="Total Orders" value={String(stats.total)} sub="all time" color="#2E4052" />
                    <StatCard icon={Clock} label="Pending" value={String(stats.pending)} sub="need action" color="#d97706" />
                    <StatCard icon={TrendingUp} label="Active" value={String(stats.active)} sub="in progress" color="#1d4ed8" />
                    <StatCard icon={DollarSign} label="Revenue" value={stats.revenue} sub="excl. cancelled" color="#15803d" />
                </div>

                {/*  Orders table  */}
                <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">

                    {/* Table header */}
                    <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
                        <h2 className="font-head font-bold text-slate-800 text-[17px] flex-1">All Orders</h2>
                        <div className="flex gap-2">
                            <div className="relative flex-1 sm:flex-initial">
                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text" placeholder="Search orders…"
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-8 pr-3 py-2 text-[12px] rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#BDD9BF] w-full sm:w-52 text-slate-700 placeholder-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1.5 px-5 py-3 overflow-x-auto border-b border-slate-100" style={{ scrollbarWidth: 'none' }}>
                        {tabs.map(tab => {
                            const count = tab.key === 'all' ? orders.length : orders.filter(o => o.status === tab.key).length
                            const active = activeTab === tab.key
                            return (
                                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-bold whitespace-nowrap flex-shrink-0 transition-all ${active ? 'text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                        }`}
                                    style={active ? { backgroundColor: '#2E4052' } : {}}>
                                    {tab.label}
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                                        }`}>{count}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Table — desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100" style={{ backgroundColor: '#f8fafa' }}>
                                    {['Reference', 'Customer', 'Route', 'Date & Time', 'Vehicle', 'Driver', 'Price', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => {
                                    const s = STATUS_CONFIG[order.status]
                                    return (
                                        <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="text-[11px] font-mono font-bold text-slate-600">{order.reference}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-[12px] font-semibold text-slate-800 whitespace-nowrap">{order.customer}</div>
                                                <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                                            </td>
                                            <td className="px-4 py-3 max-w-[160px]">
                                                <div className="text-[11px] text-slate-700 truncate">{order.from}</div>
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <ArrowRight size={10} />
                                                    <span className="text-[11px] truncate">{order.to}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-[12px] text-slate-700">{order.date}</div>
                                                <div className="text-[11px] text-slate-400">{order.time}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-[11px] text-slate-600 whitespace-nowrap">{order.vehicle}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {order.driver
                                                    ? <span className="text-[11px] font-semibold text-slate-700 whitespace-nowrap">{order.driver}</span>
                                                    : <span className="text-[11px] text-slate-300 italic">Unassigned</span>
                                                }
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-[13px] font-bold text-slate-800 whitespace-nowrap font-head">{order.price}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold whitespace-nowrap"
                                                    style={{ color: s.color, backgroundColor: s.bg }}>
                                                    <s.Icon size={10} className={order.status === 'in-progress' ? 'animate-spin' : ''} />
                                                    {s.label}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => setSelected(order)}
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#EAF0EA] transition-colors"
                                                        title="View Details">
                                                        <Eye size={13} style={{ color: '#2E4052' }} />
                                                    </button>
                                                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                                                        <>
                                                            <button onClick={() => { setSelected(order); setAssignTarget(order) }}
                                                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                                                                title="Assign Driver">
                                                                <Car size={13} className="text-blue-500" />
                                                            </button>
                                                            <button onClick={() => setCancelTarget(order)}
                                                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                                                                title="Cancel Order">
                                                                <XCircle size={13} className="text-red-400" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="py-16 text-center text-slate-400">
                                <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
                                <p className="font-head font-semibold text-[15px]">No orders found</p>
                            </div>
                        )}
                    </div>

                    {/* Cards — mobile */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {filtered.map(order => {
                            const s = STATUS_CONFIG[order.status]
                            const canAct = order.status !== 'cancelled' && order.status !== 'completed'
                            return (
                                <div key={order.id} className="p-4 space-y-3">
                                    {/* Top row — ref + status */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <span className="text-[10px] font-mono font-bold text-slate-400 block">{order.reference}</span>
                                            <div className="text-[14px] font-bold text-slate-800 truncate">{order.customer}</div>
                                            <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold flex-shrink-0"
                                            style={{ color: s.color, backgroundColor: s.bg }}>
                                            <s.Icon size={10} className={order.status === 'in-progress' ? 'animate-spin' : ''} />
                                            {s.label}
                                        </div>
                                    </div>

                                    {/* Route */}
                                    <div className="flex gap-2.5">
                                        <div className="flex flex-col items-center flex-shrink-0 mt-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2E4052' }} />
                                            <div className="w-px flex-1 my-1" style={{ backgroundColor: '#BDD9BF', minHeight: 16 }} />
                                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                                        </div>
                                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                                            <div>
                                                <div className="text-[9px] text-slate-400 uppercase tracking-widest">Pickup</div>
                                                <div className="text-[12px] font-semibold text-slate-700 truncate">{order.from}</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] text-slate-400 uppercase tracking-widest">Drop-off</div>
                                                <div className="text-[12px] font-semibold text-slate-700 truncate">{order.to}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meta chips */}
                                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                                            <CalendarDays size={10} />{order.date} · {order.time}
                                        </span>
                                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                                            <Car size={10} />{order.vehicle}
                                        </span>
                                        {order.driver
                                            ? <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}>
                                                <Users size={10} />{order.driver}
                                            </span>
                                            : <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                                                <AlertTriangle size={10} />No driver
                                            </span>
                                        }
                                    </div>

                                    {/* Bottom row — price + actions */}
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                        <span className="text-[16px] font-bold text-slate-800 font-head">{order.price}</span>
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => setSelected(order)}
                                                className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors"
                                                style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}>
                                                <Eye size={12} /> View
                                            </button>
                                            {canAct && (
                                                <button onClick={() => setAssignTarget(order)}
                                                    className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 transition-colors">
                                                    <Car size={12} /> Driver
                                                </button>
                                            )}
                                            {canAct && (
                                                <button onClick={() => setCancelTarget(order)}
                                                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 transition-colors">
                                                    <XCircle size={14} className="text-red-400" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {filtered.length === 0 && (
                            <div className="py-14 text-center text-slate-400">
                                <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="font-head font-semibold text-[14px]">No orders found</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/*  Order detail side panel  */}
            {selected && (
                <OrderDetailPanel
                    order={selected}
                    onClose={() => setSelected(null)}
                    onAssignDriver={() => setAssignTarget(selected)}
                    onStatusChange={status => handleStatusChange(selected.id, status)}
                    onCancel={() => setCancelTarget(selected)}
                />
            )}

            {/*  Assign driver modal  */}
            {assignTarget && (
                <AssignDriverModal
                    order={assignTarget}
                    onAssign={handleAssignDriver}
                    onClose={() => setAssignTarget(null)}
                />
            )}

            {/*  Cancel confirm modal  */}
            {cancelTarget && (
                <CancelModal
                    order={cancelTarget}
                    onConfirm={() => handleCancel(cancelTarget.id)}
                    onClose={() => setCancelTarget(null)}
                />
            )}
        </div>
    )
}