// ─── Data types ───────────────────────────────────────────────────────────────

export interface FleetItem {
  name: string
  pax: string
  lug: string
  models: string
  icon: string
  image: string
}

export interface Service {
  icon: string
  label: string
  image: string
}

export interface TrustBadge {
  color: string
  label: string
}

export interface Feature {
  icon: string
  title: string
  sub: string
}

export interface FAQ {
  q: string
  a: string
}

// ─── Booking flow vehicle types ───────────────────────────────────────────────

export interface Vehicle {
  id: number
  name: string
  model: string
  type: string
  passengers: number
  luggage: number
  image: string
  pricePerKm: number
  basePrice: number
  features: string[]
  tag: string
  tagColor: string
}

export interface AllFleetItem {
  id: number
  name: string
  type: string
  image: string
  passengers: number
  luggage: number
  tag: string
  tagColor: string
  features: string[]
  pricePerHour: number
  pricePerDay: number
}

// ─── Route state shapes ───────────────────────────────────────────────────────

export interface PassengerForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  passengers: string
  flightNumber: string
  specialRequests: string
}

export interface ValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export interface BookingState {
  from?: string
  to?: string
  datetime?: string
  type?: 'transfer' | 'hourly'
  vehicle?: Vehicle
  price?: string | number
  distance?: number
  duration?: number
  passenger?: PassengerForm
}
