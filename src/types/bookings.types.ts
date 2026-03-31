import { CheckCircle2 } from 'lucide-react'

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'in-progress'

export interface BookingEvent {
    time: string
    label: string
    done: boolean
}

export interface Booking {
    id: string
    reference: string
    date: string
    time: string
    from: string
    fromFull: string
    to: string
    toFull: string
    vehicle: string
    vehicleImage: string
    passengers: number
    luggage: number
    status: BookingStatus
    price: string
    breakdown: { label: string; amount: string }[]
    driver?: string
    driverPhone?: string
    driverAvatar?: string
    rating?: number
    ratingNote?: string
    notes?: string
    timeline: BookingEvent[]
    bookedOn: string
    paymentMethod: string
    distance: string
    duration: string
}

export const STATUS_CONFIG: Record<
    BookingStatus,
    { label: string; color: string; bg: string; border: string; Icon: typeof CheckCircle2 }
> = {} as any  // populated in consuming file to avoid circular icon imports

export const USER = {
    name: 'Ahmed Al Mansoori',
    email: 'ahmed.m@email.com',
    phone: '+971 50 123 4567',
    avatar: 'AM',
    memberSince: 'March 2023',
    totalRides: 14,
    totalSpent: 'AED 8,600',
}

export const BOOKINGS: Booking[] = [
    {
        id: '1',
        reference: 'CHC-2024-0091',
        date: '22 Mar 2025',
        time: '09:00',
        from: 'Dubai International, T3',
        fromFull: 'Dubai International Airport, Terminal 3, Dubai',
        to: 'Downtown Dubai',
        toFull: 'Downtown Dubai, Burj Khalifa District, Dubai',
        vehicle: 'Executive Saloon',
        vehicleImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 2,
        luggage: 2,
        status: 'in-progress',
        price: 'AED 280.00',
        breakdown: [
            { label: 'Base fare', amount: 'AED 220.00' },
            { label: 'Meet & greet', amount: 'AED 35.00' },
            { label: 'Service charge', amount: 'AED 25.00' },
        ],
        driver: 'Khalid R.',
        driverPhone: '+971 50 900 1234',
        driverAvatar: 'RW',
        notes: 'Flight BA0471 — please monitor for delays.',
        timeline: [
            { time: '08:45', label: 'Driver en route to pickup', done: true },
            { time: '09:00', label: 'Passenger picked up', done: true },
            { time: '09:45', label: 'En route to destination', done: false },
            { time: '10:15', label: 'Arrived at destination', done: false },
        ],
        bookedOn: '15 Mar 2025',
        paymentMethod: 'Visa •••• 4242',
        distance: '16.2 km',
        duration: '~45 min',
    },
    {
        id: '2',
        reference: 'CHC-2024-0087',
        date: '18 Mar 2025',
        time: '14:30',
        from: 'Dubai Marina',
        fromFull: 'Dubai Marina, Marina Walk, Dubai',
        to: 'Abu Dhabi International, T1',
        toFull: 'Abu Dhabi International Airport, Terminal 1, Abu Dhabi',
        vehicle: 'MPV (7 Seater)',
        vehicleImage: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
        passengers: 5,
        luggage: 6,
        status: 'confirmed',
        price: 'AED 420.00',
        breakdown: [
            { label: 'Base fare', amount: 'AED 340.00' },
            { label: 'Extra luggage', amount: 'AED 45.00' },
            { label: 'Service charge', amount: 'AED 35.00' },
        ],
        driver: 'Sara M.',
        driverPhone: '+971 55 900 4567',
        driverAvatar: 'SM',
        timeline: [
            { time: '14:00', label: 'Driver assigned', done: true },
            { time: '14:30', label: 'Passenger pickup scheduled', done: false },
            { time: '15:30', label: 'Arrival at Gatwick', done: false },
        ],
        bookedOn: '10 Mar 2025',
        paymentMethod: 'Mastercard •••• 8810',
        distance: '29.4 km',
        duration: '~55 min',
    },
    {
        id: '3',
        reference: 'CHC-2024-0074',
        date: '4 Mar 2025',
        time: '07:15',
        from: 'Palm Jumeirah',
        fromFull: 'Palm Jumeirah, Crescent Road, Dubai',
        to: 'Dubai International, T1',
        toFull: 'Dubai International Airport, Terminal 1, Dubai',
        vehicle: 'Executive Saloon',
        vehicleImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 1,
        luggage: 1,
        status: 'completed',
        price: 'AED 320.00',
        breakdown: [
            { label: 'Base fare', amount: 'AED 270.00' },
            { label: 'Early morning', amount: 'AED 25.00' },
            { label: 'Service charge', amount: 'AED 25.00' },
        ],
        driver: 'Dawoud K.',
        driverPhone: '+971 50 900 7890',
        driverAvatar: 'DK',
        rating: 5,
        ratingNote: 'Incredibly professional. Car was immaculate. Will definitely book again.',
        timeline: [
            { time: '07:00', label: 'Driver arrived at pickup', done: true },
            { time: '07:15', label: 'Journey started', done: true },
            { time: '08:40', label: 'Arrived at Stansted', done: true },
        ],
        bookedOn: '28 Feb 2025',
        paymentMethod: 'Visa •••• 4242',
        distance: '37.1 km',
        duration: '~80 min',
    },
    {
        id: '4',
        reference: 'CHC-2024-0068',
        date: '19 Feb 2025',
        time: '11:00',
        from: 'DIFC, Dubai',
        fromFull: 'Dubai International Financial Centre, Gate Avenue, Dubai',
        to: 'Sharjah International Airport',
        toFull: 'Sharjah International Airport, Sharjah',
        vehicle: 'Luxury SUV',
        vehicleImage: 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg',
        passengers: 3,
        luggage: 3,
        status: 'completed',
        price: 'AED 240.00',
        breakdown: [
            { label: 'Base fare', amount: 'AED 200.00' },
            { label: 'Service charge', amount: 'AED 40.00' },
        ],
        driver: 'Layla T.',
        driverPhone: '+971 55 900 3210',
        driverAvatar: 'LT',
        rating: 4,
        ratingNote: 'Great ride, very smooth. Slightly delayed start but communicated well.',
        timeline: [
            { time: '10:55', label: 'Driver arrived at pickup', done: true },
            { time: '11:00', label: 'Journey started', done: true },
            { time: '11:40', label: 'Arrived at airport', done: true },
        ],
        bookedOn: '12 Feb 2025',
        paymentMethod: 'Amex •••• 1005',
        distance: '9.8 km',
        duration: '~35 min',
    },
    {
        id: '5',
        reference: 'CHC-2024-0055',
        date: '2 Feb 2025',
        time: '16:45',
        from: 'Business Bay, Dubai',
        fromFull: 'Business Bay, Bay Square, Dubai',
        to: 'Abu Dhabi City',
        toFull: 'Corniche Road, Abu Dhabi',
        vehicle: 'Executive Saloon',
        vehicleImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 2,
        luggage: 1,
        status: 'cancelled',
        price: 'AED 160.00',
        breakdown: [
            { label: 'Base fare', amount: 'AED 135.00' },
            { label: 'Service charge', amount: 'AED 25.00' },
        ],
        timeline: [
            { time: '16:30', label: 'Booking confirmed', done: true },
            { time: '16:45', label: 'Booking cancelled', done: true },
        ],
        bookedOn: '30 Jan 2025',
        paymentMethod: 'Visa •••• 4242',
        distance: '8.4 km',
        duration: '~20 min',
    },
]