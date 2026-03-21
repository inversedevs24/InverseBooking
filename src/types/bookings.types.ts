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
    name: 'James Harrington',
    email: 'james.h@email.com',
    phone: '+44 7911 123456',
    avatar: 'JH',
    memberSince: 'March 2023',
    totalRides: 14,
    totalSpent: '£2,340',
}

export const BOOKINGS: Booking[] = [
    {
        id: '1',
        reference: 'CHC-2024-0091',
        date: '22 Mar 2025',
        time: '09:00',
        from: 'London Heathrow, T5',
        fromFull: 'London Heathrow Airport, Terminal 5, Hounslow TW6 2GA',
        to: 'Canary Wharf, London',
        toFull: 'Canary Wharf, London E14 5AB',
        vehicle: 'Executive Saloon',
        vehicleImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 2,
        luggage: 2,
        status: 'in-progress',
        price: '£78.00',
        breakdown: [
            { label: 'Base fare', amount: '£60.00' },
            { label: 'Meet & greet', amount: '£10.00' },
            { label: 'Service charge', amount: '£8.00' },
        ],
        driver: 'Robert W.',
        driverPhone: '+44 7700 900123',
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
        distance: '16.2 mi',
        duration: '~45 min',
    },
    {
        id: '2',
        reference: 'CHC-2024-0087',
        date: '18 Mar 2025',
        time: '14:30',
        from: "King's Cross St. Pancras",
        fromFull: "King's Cross St. Pancras Station, London N1 9AL",
        to: 'Gatwick Airport, South T.',
        toFull: 'Gatwick Airport, South Terminal, Horley RH6 0NP',
        vehicle: 'MPV (7 Seater)',
        vehicleImage: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
        passengers: 5,
        luggage: 6,
        status: 'confirmed',
        price: '£112.00',
        breakdown: [
            { label: 'Base fare', amount: '£90.00' },
            { label: 'Extra luggage', amount: '£12.00' },
            { label: 'Service charge', amount: '£10.00' },
        ],
        driver: 'Sarah M.',
        driverPhone: '+44 7700 900456',
        driverAvatar: 'SM',
        timeline: [
            { time: '14:00', label: 'Driver assigned', done: true },
            { time: '14:30', label: 'Passenger pickup scheduled', done: false },
            { time: '15:30', label: 'Arrival at Gatwick', done: false },
        ],
        bookedOn: '10 Mar 2025',
        paymentMethod: 'Mastercard •••• 8810',
        distance: '29.4 mi',
        duration: '~55 min',
    },
    {
        id: '3',
        reference: 'CHC-2024-0074',
        date: '4 Mar 2025',
        time: '07:15',
        from: 'Mayfair, London',
        fromFull: 'Berkeley Square, Mayfair, London W1J 6BR',
        to: 'Stansted Airport',
        toFull: 'London Stansted Airport, Stansted CM24 1QW',
        vehicle: 'Executive Saloon',
        vehicleImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 1,
        luggage: 1,
        status: 'completed',
        price: '£94.00',
        breakdown: [
            { label: 'Base fare', amount: '£80.00' },
            { label: 'Early morning', amount: '£6.00' },
            { label: 'Service charge', amount: '£8.00' },
        ],
        driver: 'David K.',
        driverPhone: '+44 7700 900789',
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
        distance: '37.1 mi',
        duration: '~80 min',
    },
    {
        id: '4',
        reference: 'CHC-2024-0068',
        date: '19 Feb 2025',
        time: '11:00',
        from: 'Manchester Piccadilly',
        fromFull: 'Manchester Piccadilly Station, Manchester M60 7RA',
        to: 'Manchester Airport, T2',
        toFull: 'Manchester Airport, Terminal 2, Manchester M90 1QX',
        vehicle: 'Luxury SUV',
        vehicleImage: 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg',
        passengers: 3,
        luggage: 3,
        status: 'completed',
        price: '£65.00',
        breakdown: [
            { label: 'Base fare', amount: '£55.00' },
            { label: 'Service charge', amount: '£10.00' },
        ],
        driver: 'Lisa T.',
        driverPhone: '+44 7700 900321',
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
        distance: '9.8 mi',
        duration: '~35 min',
    },
    {
        id: '5',
        reference: 'CHC-2024-0055',
        date: '2 Feb 2025',
        time: '16:45',
        from: 'Birmingham New Street',
        fromFull: 'Birmingham New Street Station, Birmingham B2 4QA',
        to: 'NEC Birmingham',
        toFull: 'National Exhibition Centre, Birmingham B40 1NT',
        vehicle: 'Executive Saloon',
        vehicleImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        passengers: 2,
        luggage: 1,
        status: 'cancelled',
        price: '£42.00',
        breakdown: [
            { label: 'Base fare', amount: '£35.00' },
            { label: 'Service charge', amount: '£7.00' },
        ],
        timeline: [
            { time: '16:30', label: 'Booking confirmed', done: true },
            { time: '16:45', label: 'Booking cancelled', done: true },
        ],
        bookedOn: '30 Jan 2025',
        paymentMethod: 'Visa •••• 4242',
        distance: '8.4 mi',
        duration: '~20 min',
    },
]