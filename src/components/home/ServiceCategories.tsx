import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import { SERVICE_ROUTE_MAP } from '../../data'

export default function ServiceCategories() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products, initialized } = useAppSelector(s => s.shopify)

  useEffect(() => {
    dispatch(fetchTaxiProducts())
  }, [dispatch])

  // One card per unique serviceType — first product with a bannerImage wins
  const seen = new Set<string>()
  const services = products
    .filter(p => {
      if (!p.serviceType || seen.has(p.serviceType)) return false
      seen.add(p.serviceType)
      return true
    })
    .map(p => ({
      label: p.serviceType,
      image: p.bannerImage,
      to: SERVICE_ROUTE_MAP[p.serviceType] ?? '/book',
    }))

  if (!initialized || services.length === 0) return null

  return (
    <div className="max-w-container mx-auto px-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[14px] mb-12">
        {services.map(s => (
          <div
            key={s.label}
            onClick={() => navigate(s.to)}
            className="flex flex-col rounded-card bg-white border border-border cursor-pointer transition-all hover:-translate-y-[3px] hover:shadow-card hover:border-secondary overflow-hidden group"
          >
            <div className="relative w-full h-28 overflow-hidden">
              {s.image && (
                <img
                  src={s.image}
                  alt={s.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                />
              )}
            </div>
            <div className="p-3 text-center">
              <span className="text-label font-semibold text-primary">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
