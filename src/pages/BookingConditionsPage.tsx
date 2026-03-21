import { brandEmail, brandPhone } from '../env'

export default function BookingConditionsPage() {
  return (
    <div className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        <h1 className="font-head text-heading text-center mb-2 text-primary leading-none">Booking Conditions</h1>
        <div className="bg-white border border-border rounded-card-lg p-10 max-w-[900px] mx-auto mt-10">
          {[
            { h: 'Booking Types', items: ['Urgent Rides – For immediate pickup', 'Scheduled Rides – Reserved in advance for specific date/time'] },
            { h: 'How to Book', items: ['InverseRide mobile application', 'Official website (www.InverseRide.com)', 'Provide accurate pickup/drop-off locations', 'Choose vehicle type and confirm fare'] },
            { h: 'Driver Arrival & Waiting Time', items: ['Urgent Rides: 30-60 minute estimated arrival', 'Scheduled Rides: Arrival around booked time', '15 minutes — standard pickups', '60 minutes — airport pickups'] },
            { h: 'Passenger Responsibilities', items: ['Arrive on time at the pickup location', 'Keep phone available for driver contact', 'Provide clear access for pickup/drop-off', 'Ensure all information provided is accurate'] },
            { h: 'Modifications', items: ['Scheduled rides may be modified up to 24 hours before pickup', 'Urgent rides cannot be modified once confirmed', 'Modifications subject to vehicle availability'] },
            { h: 'Support & Assistance', items: [`Email: ${brandEmail}`, `Phone: ${brandPhone}`, 'Available 24/7 for urgent booking issues'] },
          ].map(({ h, items }) => (
            <div key={h}>
              <h3 className="font-head text-span font-bold text-secondary mt-6 mb-[10px]">{h}</h3>
              <ul className="pl-5 my-2">
                {items.map(item => <li key={item} className="text-label text-primary mb-[6px] leading-[1.6]">{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
