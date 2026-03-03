export default function RideSmileBanner() {
  return (
    <div className="max-w-container mx-auto px-6 mb-12">
      <div className="bg-primary rounded-card-lg px-8 md:px-12 py-8 flex items-center justify-between relative overflow-hidden">
        <div className="font-head text-heading md:text-display font-extrabold text-white z-[1]">
          RIDE.{' '}
          <span className="text-secondary">SMILE</span>
          <br />
          <span className="text-secondary">REPEAT.</span>
        </div>
        <div className="absolute right-[180px] top-1/2 -translate-y-1/2 text-[120px] opacity-[0.08]">
          🚗
        </div>
        <div className="bg-white/10 rounded-xl px-6 py-4 text-center z-[1]">
          <div className="text-white font-head text-xl">InverseRide</div>
          <div className="text-white/50 text-[11px]">Premium Ride Partner UAE</div>
        </div>
      </div>
    </div>
  )
}
