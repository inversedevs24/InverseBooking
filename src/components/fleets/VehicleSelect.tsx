import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Vehicle, BookingState } from '../../types'

const vehicles: Vehicle[] = [
  { id: 1, name: 'Luxury SUV',     model: 'Escalade / Range Rover',  type: 'SUV',   passengers: 6,  luggage: 6,  image: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=300&q=80', pricePerKm: 4.5, basePrice: 45, features: ['WiFi', 'Leather', 'Climate'],        tag: 'Popular', tagColor: '#f59e0b' },
  { id: 2, name: 'Family Ride',    model: 'Prado / Chrysler C4',     type: 'Van',   passengers: 7,  luggage: 7,  image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&q=80', pricePerKm: 3.2, basePrice: 35, features: ['Child Seats', 'USB', 'Spacious'],     tag: 'Value',   tagColor: '#10b981' },
  { id: 3, name: 'Elite Van',      model: 'Mercedes V-Class',        type: 'Van',   passengers: 8,  luggage: 9,  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', pricePerKm: 5.2, basePrice: 55, features: ['Executive', 'Minibar', 'Tinted'],      tag: 'Premium', tagColor: '#8b5cf6' },
  { id: 4, name: 'Mini Bus',       model: 'Mercedes Sprinter',       type: 'Bus',   passengers: 14, luggage: 14, image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&q=80', pricePerKm: 6.0, basePrice: 80, features: ['PA System', 'Luggage Bay', 'Reclining'],tag: 'Group',   tagColor: '#3b82f6' },
  { id: 5, name: 'Economy Sedan',  model: 'Toyota Camry / Skoda',    type: 'Sedan', passengers: 3,  luggage: 3,  image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&q=80', pricePerKm: 2.1, basePrice: 20, features: ['A/C', 'Clean', 'Punctual'],           tag: 'Budget',  tagColor: '#6b7280' },
  { id: 6, name: 'Business Class', model: 'BMW 7 / Mercedes S',      type: 'Sedan', passengers: 3,  luggage: 3,  image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&q=80', pricePerKm: 7.0, basePrice: 90, features: ['Champagne', 'Chauffeur', 'Privacy'],   tag: 'Ultra',   tagColor: '#ec4899' },
]

const TEST_DISTANCE_KM = 24
const TEST_DURATION_MIN = 38

export default function VehicleSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking: BookingState = location.state || {
    from: 'Dubai Mall', to: 'Dubai Airport (DXB)',
    datetime: '2026-02-27T15:12', type: 'transfer',
  }

  const [selected, setSelected] = useState<number | null>(null)

  const getPrice = (v: Vehicle) => (v.basePrice + TEST_DISTANCE_KM * v.pricePerKm).toFixed(0)

  const handleSelect = (v: Vehicle) => {
    setSelected(v.id)
    setTimeout(() => {
      navigate('/booking-details', {
        state: { ...booking, vehicle: v, price: getPrice(v), distance: TEST_DISTANCE_KM, duration: TEST_DURATION_MIN },
      })
    }, 350)
  }

  const formatDt = (dt?: string) => {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-[#0c1a13] flex flex-col font-body text-white">
      {/* Topbar */}
      <div className="flex items-center gap-[14px] px-6 py-[13px] bg-[#0f1f19] border-b border-white/[0.07] sticky top-0 z-10">
        <button
          className="bg-white/[0.07] border border-white/10 rounded-[7px] text-white/65 px-[13px] py-[6px] cursor-pointer text-[11px] font-semibold transition-all hover:bg-white/12 hover:text-white font-body"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <span className="font-head text-[17px] font-bold text-white">Choose Your Vehicle</span>
        <span className="ml-auto text-[11px] text-white/35">{vehicles.length} options available</span>
      </div>

      {/* Body split */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] flex-1 min-h-[calc(100vh-50px)]">

        {/* LEFT: vehicle list */}
        <div className="overflow-y-auto border-r border-white/[0.06] px-[14px] py-4 scrollbar-dark bg-[#0f1f19]">
          <div className="flex items-center justify-between mb-3 px-[2px]">
            <span className="text-[10px] font-bold text-white/30 tracking-[1.5px] uppercase">Available Vehicles</span>
            <span className="text-[11px] text-white/25">{vehicles.length} results</span>
          </div>

          {vehicles.map(v => {
            const isSelected = selected === v.id
            return (
              <div
                key={v.id}
                className={`group relative flex items-center bg-[#1a3028] border-[1.5px] rounded-[11px] overflow-hidden cursor-pointer transition-all mb-2 ${
                  isSelected
                    ? 'border-secondary bg-[#1e3a2e] shadow-[0_0_0_1px_rgba(203,161,53,0.25),4px_0_20px_rgba(0,0,0,0.3)]'
                    : 'border-transparent hover:border-secondary/35 hover:bg-[#1e352b] hover:translate-x-[3px]'
                }`}
                onClick={() => handleSelect(v)}
              >
                {/* Selected indicator bar */}
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary" />}

                {/* Image */}
                <div className="w-[100px] h-[72px] flex-shrink-0 overflow-hidden relative">
                  <img
                    src={v.image} alt={v.name}
                    className="w-full h-full object-cover transition-transform duration-[350ms] group-hover:scale-[1.08]"
                  />
                  <div
                    className="absolute top-[5px] left-[5px] text-[8px] font-extrabold px-[6px] py-[2px] rounded text-white uppercase tracking-[0.4px]"
                    style={{ background: v.tagColor }}
                  >
                    {v.tag}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 px-3 py-[10px] min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-[5px]">
                    <div className="min-w-0">
                      <div className="font-head text-label font-bold text-white truncate">{v.name}</div>
                      <div className="text-[10px] text-white/35 mt-[1px] truncate">{v.model}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="font-head text-[17px] font-bold text-secondary whitespace-nowrap">${getPrice(v)}</div>
                      <span className="text-[9px] font-medium text-white/30 block text-right mt-[1px]">est. total</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[6px] flex-wrap">
                    <span className="text-[10px] font-semibold text-white/50 bg-white/[0.07] px-[7px] py-[2px] rounded-full">👥 {v.passengers}</span>
                    <span className="text-[10px] font-semibold text-white/50 bg-white/[0.07] px-[7px] py-[2px] rounded-full">🧳 {v.luggage}</span>
                    {v.features.slice(0, 2).map(f => (
                      <span key={f} className="text-[9px] text-secondary/85 bg-secondary/10 border border-secondary/20 px-[6px] py-[1px] rounded font-semibold">{f}</span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className={`px-3 text-label flex-shrink-0 transition-all ${isSelected ? 'text-secondary' : 'text-white/15 group-hover:text-secondary group-hover:translate-x-[2px]'}`}>
                  {isSelected ? '✓' : '›'}
                </div>
              </div>
            )
          })}
        </div>

        {/* RIGHT: trip summary */}
        <div className="overflow-y-auto px-5 py-5 bg-[#0c1a13] flex flex-col gap-4 scrollbar-dark">
          {/* Route summary */}
          <div className="bg-[#1a3028] border border-white/[0.07] rounded-[14px] p-[18px]">
            <div className="text-[10px] font-bold text-white/30 tracking-[1.5px] uppercase mb-[14px]">Trip Summary</div>

            <div className="flex flex-col gap-0">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0 mt-[3px]">
                  <div className="w-[9px] h-[9px] rounded-full bg-secondary" />
                  <div className="w-px h-7 my-[3px]" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.03))' }} />
                </div>
                <div className="pb-3">
                  <div className="text-[9px] text-white/30 uppercase tracking-[0.8px] mb-[1px]">Pickup</div>
                  <div className="text-label font-semibold text-white">{booking.from || 'Dubai Mall'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-[3px]">
                  <div className="w-[9px] h-[9px] rounded-full bg-red-500" />
                </div>
                <div>
                  <div className="text-[9px] text-white/30 uppercase tracking-[0.8px] mb-[1px]">Drop-off</div>
                  <div className="text-label font-semibold text-white">{booking.to || 'Dubai Airport (DXB)'}</div>
                </div>
              </div>
            </div>

            <div className="mt-[14px] pt-[14px] border-t border-white/[0.06]">
              <div className="text-[9px] text-white/30 uppercase tracking-[0.8px] mb-1">Date &amp; Time</div>
              <div className="text-[11px] font-semibold text-white">{formatDt(booking.datetime)}</div>
            </div>

            <div className="grid grid-cols-3 gap-[10px] mt-[14px]">
              {[
                { val: TEST_DISTANCE_KM, lbl: 'km' },
                { val: TEST_DURATION_MIN, lbl: 'mins' },
                { val: booking.type === 'hourly' ? 'Hrly' : 'Fix', lbl: 'rate' },
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-[9px] p-[10px] text-center">
                  <div className="font-head text-lg font-bold text-secondary leading-none">{s.val}</div>
                  <div className="text-[9px] text-white/35 mt-1 uppercase tracking-[0.8px]">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-[#1a3028] border border-white/[0.07] rounded-[14px] p-[18px]">
            <div className="text-[10px] font-bold text-white/30 tracking-[1.5px] uppercase mb-[14px]">Route Preview</div>
            <div className="relative h-[260px] rounded-[11px] overflow-hidden border border-white/[0.07]">
              <iframe
                title="map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=55.1304931640625%2C25.0657305%2C55.4162597%2C25.2769055&layer=mapnik"
                className="w-full h-full border-none"
                style={{ filter: 'invert(0.88) hue-rotate(140deg) saturate(0.65) brightness(0.82)' }}
                allowFullScreen
              />
              <div className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0c1a13)' }} />
              <div className="absolute bottom-[10px] left-3 text-[10px] font-bold text-white/50 bg-black/40 px-[9px] py-1 rounded-[6px] backdrop-blur-[6px]">
                📍 Dubai, UAE
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-secondary/[0.06] border border-secondary/15 rounded-[10px] px-[14px] py-3 text-[11px] text-white/45 leading-[1.6]">
            💡 Prices include base fare + {TEST_DISTANCE_KM}km distance. Free cancellation up to 1 hour before pickup.
          </div>
        </div>
      </div>
    </div>
  )
}
