const STEPS = [
  {
    icon: '📅',
    title: 'Book Your Chauffeur Online',
    desc: 'Enter your pickup details, choose your chauffeur, and customize your ride. You can cancel or change your ride up to 24 hours before the pickup.',
    bgColor: 'rgba(203,161,53,0.1)',
  },
  {
    icon: '👤',
    title: 'Meet Your Driver',
    desc: "Your driver will be waiting at the meeting spot with a signboard. They'll track your flight and be there even if your flight is delayed.",
    bgColor: 'rgba(203,161,53,0.12)',
  },
  {
    icon: '🎯',
    title: 'Enjoy a Comfortable Ride',
    desc: 'Skip the taxi lines and crowded buses. InverseRide will get you to your destination on time, stress-free.',
    bgColor: 'rgba(74,144,226,0.1)',
  },
]

const FLOW = [
  { step: 'Book Online',             icon: '💻', color: '#CBA135' },
  { step: 'Instant Confirmation',    icon: '✅', color: '#CBA135' },
  { step: 'Meet your driver',        icon: '🧑‍✈️', color: '#CBA135' },
  { step: 'Get to Your Destination', icon: '📍', color: '#CBA135' },
  { step: 'Enjoy your trip',         icon: '🎉', color: '#CBA135' },
]

export default function HowItWorks() {
  return (
    <section className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        {/* Promo strip */}
        <div className="bg-secondary rounded-2xl px-8 py-6 mb-12 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-white font-head text-[22px] font-extrabold">BOOK YOUR TRANSFER NOW</div>
            <div className="text-white font-semibold">BOOK NOW, RIDE LATER</div>
            <div className="text-white/70 text-label">No Last-Minute Hassles</div>
          </div>
          <div className="bg-black/20 px-5 py-3 rounded-[10px]">
            <div className="text-white font-bold text-label">✅ Secure Payments</div>
            <div className="text-white/70 text-[11px]">Book with Confidence</div>
          </div>
        </div>

        <h2 className="font-head text-heading text-primary text-center mb-2">Go Anywhere, Anytime</h2>
        <p className="text-center text-muted text-span mb-10">Instant booking, smooth travel — no delays, no hassle.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[60px] items-center">
          {/* Steps */}
          <div>
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-4 mb-7">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
                  style={{ background: s.bgColor }}
                >
                  {s.icon}
                </div>
                <div>
                  <h4 className="font-bold text-span mb-1">{s.title}</h4>
                  <p className="text-muted text-label leading-[1.6]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flow diagram */}
          <div className="bg-secondaryBg rounded-card-lg p-8">
            <div className="font-bold text-span font-head mb-4 text-center">How it works?</div>
            {FLOW.map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base flex-shrink-0"
                  style={{ background: item.color }}
                >
                  {item.icon}
                </div>
                <span className="font-semibold text-label">{item.step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
