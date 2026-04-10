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

// ─── Shopify / Booking types ──────────────────────────────────────────────────

export interface TaxiVariant {
  id: string                                     // full Shopify GID
  title: string                                  // e.g. "11-20 miles"
  price: { amount: string; currencyCode: string } // raw object — do NOT flatten
  kmRangeMin: number
  kmRangeMax: number
}

export interface TaxiOption {
  id: number
  shopifyId: string           // first variant GID (legacy / display only — NOT for checkout)
  shopifyProductId: string    // product GID
  name: string
  vehicleType: string         // metafield vehicle_type
  type: string                // alias for vehicleType
  displayName: string
  image: string
  images: string[]
  description: string
  rating: number
  reviews: number
  passengers: number
  luggage: number
  features: string[]
  baseFare: number
  perKmRate: number
  estimatedArrival: string
  eta: string                 // alias for estimatedArrival
  popular: boolean
  serviceType: string         // metafield service_type (e.g. "Airport Rides")
  bannerImage: string         // metafield banner_image (file) — CDN URL
  serviceDescription: string  // metafield service_description — short description
  bannerHeadline: string      // metafield banner_headline — multi-line text, \n = line break
  bannerSub: string           // metafield banner_sub — subtitle/tagline
  variants: TaxiVariant[]     // full array of distance-band variants
}

export interface SearchDetails {
  tripType?: 'one-way' | 'return'
  from: string
  to: string
  fromCoords?: { lat: number; lng: number }
  toCoords?: { lat: number; lng: number }
  distance: number            // km (Google Maps metres ÷ 1000)
  duration: string
  date: string
  time: string
  passengers: number
  returnDate?: string
  returnTime?: string
  flightNumber?: string
}

export interface CartItem {
  taxi: TaxiOption
  search: SearchDetails
  totalPrice: number
  quantity: number
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
  type?: 'transfer' | 'hourly' | 'return'
  serviceType?: string          // Shopify metafield value e.g. "Hourly Hire", "Airport Rides"
  vehicle?: Vehicle
  price?: string | number
  distance?: number
  duration?: number
  passenger?: PassengerForm
}
