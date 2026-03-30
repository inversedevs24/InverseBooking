import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Building2, PlaneLanding, MapPinned, Clock3, Sunset } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'

// Maps service URL key → the Shopify serviceType metafield value
const SERVICE_TYPE_LABEL: Record<string, string> = {
  transfer: 'Private Transfer',
  'city-to-city': 'City to City',
  airport: 'Airport Rides',
  'city-tour': 'City Tour',
  hourly: 'Hourly Hire',
  'desert-safari': 'Desert Safari',
}

const SERVICES = [
  {
    Icon: Car,
    label: 'Private Transfer',
    sub: 'Door-to-door rides with a professional chauffeur at a fixed, transparent price.',
    to: '/book?service=transfer',
    serviceKey: 'transfer',
  },
  {
    Icon: Building2,
    label: 'City to City',
    sub: 'Comfortable intercity journeys between Dubai, Abu Dhabi, Sharjah and beyond.',
    to: '/book?service=city-to-city',
    serviceKey: 'city-to-city',
  },
  {
    Icon: PlaneLanding,
    label: 'Airport Rides',
    sub: 'Meet & greet, real-time flight tracking, and free waiting time — stress-free every time.',
    to: '/book?service=airport',
    serviceKey: 'airport',
  },
  {
    Icon: MapPinned,
    label: 'City Tour',
    sub: 'Explore iconic landmarks at your own pace with a knowledgeable private chauffeur.',
    to: '/book?service=city-tour',
    serviceKey: 'city-tour',
  },
  {
    Icon: Clock3,
    label: 'Hourly Hire',
    sub: 'Book a chauffeur by the hour — perfect for business meetings, events or errands.',
    to: '/book?service=hourly',
    serviceKey: 'hourly',
  },
  {
    Icon: Sunset,
    label: 'Desert Safari',
    sub: 'Luxury transfers to the dunes and back — sunrise or sunset, in total comfort.',
    to: '/book?service=desert-safari',
    serviceKey: 'desert-safari',
  },
]

export default function FeaturesBar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products, initialized } = useAppSelector(s => s.shopify)

  useEffect(() => {
    dispatch(fetchTaxiProducts())
  }, [dispatch])

  // Count vehicles matching each service type
  function getVehicleCount(serviceKey: string): number | null {
    if (!initialized || products.length === 0) return null
    const label = SERVICE_TYPE_LABEL[serviceKey]
    return products.filter(p => !p.serviceType || p.serviceType === label).length
  }

  // Get lowest starting price across first distance band for matching vehicles
  function getStartingPrice(serviceKey: string): string | null {
    if (!initialized || products.length === 0) return null
    const label = SERVICE_TYPE_LABEL[serviceKey]
    const matching = products.filter(p => !p.serviceType || p.serviceType === label)
    let minPrice = Infinity
    for (const p of matching) {
      const lowestVariant = p.variants
        .filter(v => /^\d+-\d+\s*miles?$/i.test(v.title))
        .sort((a, b) => a.kmRangeMin - b.kmRangeMin)[0]
      if (lowestVariant) {
        const price = parseFloat(lowestVariant.price.amount)
        if (price < minPrice) minPrice = price
      }
    }
    if (minPrice === Infinity) return null
    const currency = products[0]?.variants[0]?.price.currencyCode ?? 'GBP'
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency === 'AED' ? 'AED ' : currency
    return `From ${symbol}${minPrice.toFixed(0)}`
  }

  return (
    <section className="py-10 md:py-[20px]">
      <div className="max-w-container mx-auto px-6">

        <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2 text-center">
          What We Offer
        </p>
        <h2 className="font-head text-heading text-primary text-center leading-none mb-10">
          Our Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(({ Icon, label, sub, to, serviceKey }) => {
            const startingPrice = getStartingPrice(serviceKey)
            const vehicleCount = getVehicleCount(serviceKey)

            return (
              <div
                key={label}
                onClick={() => navigate(to)}
                className="group bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)] flex items-start gap-4 cursor-pointer transition-all hover:-translate-y-[3px] hover:shadow-[0_6px_20px_rgba(15,23,42,0.11)] hover:border-secondary border border-transparent"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary"
                  style={{ backgroundColor: '#BDD9BF' }}
                >
                  <Icon
                    size={20}
                    className="transition-colors group-hover:text-white"
                    style={{ color: '#2E4052' }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[15px] font-bold font-head text-primary leading-tight">{label}</h4>
                    {startingPrice && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
                      >
                        {startingPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-muted font-body mt-1 leading-snug">{sub}</p>
                  {initialized && vehicleCount !== null && vehicleCount > 0 && (
                    <p className="text-[11px] font-semibold mt-2" style={{ color: 'rgba(46,64,82,0.45)' }}>
                      {vehicleCount} {vehicleCount === 1 ? 'vehicle' : 'vehicles'} available
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
