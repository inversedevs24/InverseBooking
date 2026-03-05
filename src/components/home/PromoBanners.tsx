export default function PromoBanners() {
  return (
    <div className="pb-10 md:pb-[60px]">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Banner 1 — promo offer */}
          <div
            className="rounded-2xl p-7 relative overflow-hidden min-h-[200px] flex flex-col justify-between"
            style={{ backgroundColor: '#d5e0de' }}
          >
            {/* Decorative rings */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-[0.12]" style={{ backgroundColor: '#0F172A' }} />
            <div className="absolute -top-2 right-6 w-28 h-28 rounded-full opacity-[0.07]" style={{ backgroundColor: '#0F172A' }} />

            <div className="relative">
              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-3">Limited Offer</p>
              <div className="flex items-end gap-3 mb-2">
                <span className="font-head text-[52px] font-bold text-primary leading-none">50%</span>
                <span
                  className="text-[13px] font-bold text-white px-3 py-1.5 rounded-lg mb-2"
                  style={{ background: '#CBA135' }}
                >
                  OFF
                </span>
              </div>
              <p className="text-[14px] text-primary/70 font-body">Book your first ride at half price.</p>
            </div>

            <button
              className="relative mt-5 self-start text-[13px] font-bold text-white px-5 py-2.5 rounded-full border-none cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: '#0F172A' }}
            >
              Book Now →
            </button>
          </div>

          {/* Banner 2 — hourly hire */}
          <div
            className="rounded-2xl p-7 relative overflow-hidden min-h-[200px] flex flex-col justify-between"
            style={{ background: '#0F172A' }}
          >
            {/* Decorative rings */}
            <div className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full opacity-[0.10]" style={{ backgroundColor: '#CBA135' }} />
            <div className="absolute -bottom-2 right-4 w-32 h-32 rounded-full opacity-[0.06]" style={{ backgroundColor: '#CBA135' }} />

            <div className="relative">
              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-3">Hourly Hire</p>
              <h3 className="font-head text-[28px] font-bold text-white leading-tight mb-2">
                Your Car.<br />Your Time.
              </h3>
              <p className="text-[14px] text-white/70 font-body">Hire a chauffeur by the hour, on your schedule.</p>
            </div>

            <button
              className="relative mt-5 self-start text-[13px] font-bold text-primary px-5 py-2.5 rounded-full border-none cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: '#CBA135' }}
            >
              Explore →
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
