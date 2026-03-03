export default function PromoBanners() {
  return (
    <div className="max-w-container mx-auto px-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Banner 1 */}
        <div
          className="rounded-2xl px-8 py-7 relative overflow-hidden min-h-[140px] flex items-center"
          style={{ background: 'linear-gradient(135deg, #0F172A, #1e2d4a)' }}
        >
          <div>
            <span className="bg-secondary text-primary font-extrabold text-[26px] px-3 py-[3px] rounded-[6px] inline-block mb-2">
              50% OFF
            </span>
            <div className="text-white/80 text-label">Book Your Ride at Half Price!</div>
          </div>
          <div className="absolute right-5 bottom-0 text-[90px] opacity-20">🚗</div>
        </div>

        {/* Banner 2 */}
        <div
          className="rounded-2xl px-8 py-7 relative overflow-hidden min-h-[140px]"
          style={{ background: 'linear-gradient(135deg, #0F172A, #1e2d4a)' }}
        >
          <div>
            <div className="font-head text-white text-[22px] font-bold">YOUR CAR.</div>
            <div className="font-head text-white text-[22px] font-bold">YOUR TIME!</div>
            <div className="text-white/60 text-[11px] mt-1">Hire a Chauffeur By The Hour</div>
          </div>
          <div className="absolute right-4 top-4 text-[60px] opacity-30">🧑‍✈️</div>
        </div>
      </div>
    </div>
  )
}
