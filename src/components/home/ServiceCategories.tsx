import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import { SERVICES } from '../../data'

const SERVICE_ROUTES: Record<string, string> = {
  'Private Transfer': '/book?service=transfer',
  'City to City':     '/book?service=city-to-city',
  'Airport Rides':    '/book?service=airport',
  'City Tour':        '/book?service=city-tour',
  'Hourly Hire':      '/book?service=hourly',
  'Desert Safari':    '/book?service=desert-safari',
}

export default function ServiceCategories() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products, initialized } = useAppSelector(s => s.shopify)

  useEffect(() => {
    dispatch(fetchTaxiProducts())
  }, [dispatch])

  // Derive active service types from Shopify product metafields
  const activeTypes = new Set(products.map(p => p.serviceType).filter(Boolean))

  // Once initialized, show only services present in the catalog; before that show all
  const visibleServices = initialized && activeTypes.size > 0
    ? SERVICES.filter(s => activeTypes.has(s.label))
    : SERVICES

  return (
    <div className="max-w-container mx-auto px-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[14px] mb-12">
        {visibleServices.map((s, i) => (
          <div
            key={i}
            onClick={() => navigate(SERVICE_ROUTES[s.label] ?? '/book')}
            className="flex flex-col rounded-card bg-white border border-border cursor-pointer transition-all hover:-translate-y-[3px] hover:shadow-card hover:border-secondary overflow-hidden group"
          >
            <div className="relative w-full h-20 overflow-hidden">
              <img
                src={s.image}
                alt={s.label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
              />
            </div>
            <div className="p-2 text-center">
              <span className="text-label font-semibold text-primary">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
