import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import { TaxiOption } from '../../types'

function deriveServiceCards(products: TaxiOption[]) {
  const seen = new Map<string, { serviceType: string; description: string; bannerUrl: string }>()

  for (const product of products) {
    if (!product.serviceType || seen.has(product.serviceType)) continue
    seen.set(product.serviceType, {
      serviceType: product.serviceType,
      description: product.serviceDescription,
      bannerUrl: product.bannerImage,
    })
  }

  return Array.from(seen.values())
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)] flex items-start gap-4 border border-transparent animate-pulse">
      <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-gray-200" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 w-2/5 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-4/5 rounded bg-gray-100" />
      </div>
    </div>
  )
}

export default function FeaturesBar() {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector(s => s.shopify)

  useEffect(() => { dispatch(fetchTaxiProducts()) }, [dispatch])

  const services = deriveServiceCards(products)

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
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : services.map(({ serviceType, description, bannerUrl }) => (
              <div
                key={serviceType}
                className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)] flex items-start gap-4 border border-transparent"
              >
                {/* {bannerUrl && (
                  <img
                    src={bannerUrl}
                    alt={serviceType}
                    className="w-12 h-12 rounded-xl flex-shrink-0 object-cover"
                  />
                )} */}
                <div className="min-w-0">
                  <h4 className="text-[15px] font-bold font-head text-primary leading-tight">
                    {serviceType}
                  </h4>
                  {description && (
                    <p className="text-[13px] text-muted font-body mt-1 leading-snug">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            ))
          }
        </div>

      </div>
    </section>
  )
}