import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTaxiProducts } from '../../store/slices/shopifySlice'
import { SERVICE_ROUTE_MAP } from '../../data'

export default function ServiceCategories() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { products, initialized } = useAppSelector(s => s.shopify)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

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

  // Drag to scroll functionality for large screens
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      startX.current = e.pageX - container.offsetLeft
      scrollLeft.current = container.scrollLeft
      container.style.cursor = 'grabbing'
      container.style.userSelect = 'none'
    }

    const handleMouseLeave = () => {
      isDragging.current = false
      if (container) {
        container.style.cursor = 'grab'
        container.style.userSelect = 'auto'
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
      if (container) {
        container.style.cursor = 'grab'
        container.style.userSelect = 'auto'
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      e.preventDefault()
      const x = e.pageX - container.offsetLeft
      const walk = (x - startX.current) * 1.5
      container.scrollLeft = scrollLeft.current - walk
    }

    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!initialized || services.length === 0) return null

  return (
    <div className="max-w-container mx-auto px-6">
      {/* Mobile: Grid layout (2-3 columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[14px] mb-12 lg:hidden">
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

      {/* Large screen: Horizontal scroll with swipe */}
      <div className="hidden lg:block mb-12">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="flex gap-[14px]">
            {services.map(s => (
              <div
                key={s.label}
                onClick={() => navigate(s.to)}
                className="flex flex-col rounded-card bg-white border border-border cursor-pointer transition-all hover:-translate-y-[3px] hover:shadow-card hover:border-secondary overflow-hidden group flex-shrink-0 w-[180px]"
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
                  <span className="text-label font-semibold text-primary whitespace-nowrap overflow-hidden text-ellipsis block">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optional: Scroll hint indicator */}
        {services.length > 4 && (
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-6 h-[2px] bg-secondary rounded-full opacity-60"></div>
            <div className="w-2 h-[2px] bg-gray-300 rounded-full"></div>
            <div className="w-2 h-[2px] bg-gray-300 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
}
