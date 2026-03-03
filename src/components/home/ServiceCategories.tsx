import { SERVICES } from '../../data'

export default function ServiceCategories() {
  return (
    <div className="max-w-container mx-auto px-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[14px] mb-12">
        {SERVICES.map((s, i) => (
          <div
            key={i}
            className="flex flex-col rounded-card bg-white border border-border cursor-pointer transition-all hover:-translate-y-[3px] hover:shadow-card hover:border-secondary overflow-hidden"
          >
            <img src={s.image} alt={s.label} className="w-full h-20 object-cover" />
            <div className="p-2 text-center">
              <span className="text-label font-semibold text-primary">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
