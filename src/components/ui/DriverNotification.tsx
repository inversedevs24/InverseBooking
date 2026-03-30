import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Car, Phone } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getCustomerOrders } from '../../services/shopifyAuthService'

interface DriverPopup {
    bookingRef: string
    driverName: string
    driverPhone?: string
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

export default function DriverNotification() {
    const { accessToken } = useAuth()
    const { pathname } = useLocation()
    const [popup, setPopup] = useState<DriverPopup | null>(null)

    useEffect(() => {
        if (!accessToken) return

        getCustomerOrders(accessToken)
            .then(orders => {
                const seenKey = 'inv_seen_drivers'
                const seen: Record<string, string> = JSON.parse(localStorage.getItem(seenKey) ?? '{}')

                for (const order of orders) {
                    const driverName = parseMetafieldString(order.driver?.value)
                    const driverPhone = parseMetafieldString(order.driverPhone?.value)
                    const seenOrderKey = `order_${order.orderNumber}`
                    const ref = `INV-${order.orderNumber}`

                    if (driverName && seen[seenOrderKey] !== driverName) {
                        seen[seenOrderKey] = driverName
                        localStorage.setItem(seenKey, JSON.stringify(seen))
                        setPopup({ bookingRef: ref, driverName, driverPhone })
                        break
                    }
                }
            })
            .catch(console.error)
    }, [accessToken, pathname])

    if (!popup) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 pointer-events-none">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
                onClick={() => setPopup(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4 pointer-events-auto">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: '#BDD9BF' }}
                >
                    <Car size={28} style={{ color: '#2E4052' }} />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#BDD9BF' }}>
                        {popup.bookingRef}
                    </p>
                    <h2 className="font-head font-bold text-slate-800 text-[18px] leading-snug">Driver Assigned!</h2>
                    <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
                        Your driver for this ride is{' '}
                        <span className="font-semibold text-slate-700">{popup.driverName}</span>.
                    </p>
                    {popup.driverPhone && (
                        <a
                            href={`tel:${popup.driverPhone}`}
                            className="inline-flex items-center gap-1.5 mt-2 text-[13px] font-semibold"
                            style={{ color: '#2E4052' }}
                        >
                            <Phone size={13} /> {popup.driverPhone}
                        </a>
                    )}
                </div>
                <button
                    onClick={() => setPopup(null)}
                    className="w-full rounded-xl py-3 text-[13px] font-bold text-white hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: '#2E4052' }}
                >
                    Got it
                </button>
            </div>
        </div>
    )
}
