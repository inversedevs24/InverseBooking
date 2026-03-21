import { brandEmail, brandPhone } from '../env'

export default function RefundPage() {
  const sections = [
    {
      h: 'User Cancellations',
      items: [
        'Urgent Rides: Free if cancelled within 5 minutes and driver not dispatched',
        'Scheduled Rides: Free if cancelled more than 24 hours before pickup',
        'Cancellations after driver dispatch may incur charges',
      ],
    },
    {
      h: 'InverseRide Cancellations',
      items: ['If we are unable to fulfill your booking, it will be cancelled and fully refunded'],
    },
    {
      h: 'Refund Processing',
      items: [
        'Any approved refunds will be processed and settled within 15 working days from the date of confirmation, in accordance with our refund policy',
        'Cancellations made within 24 hours of pickup are non-refundable',
        'No refund if cancellation is due to incorrect flight details provided by the customer',
        'No refund for weather conditions or forecasts',
        'No refund for any reasons beyond our control (airline issues, delays, force majeure)',
        'Processed to the original payment method',
        'No refunds for no-shows or cancellations outside allowed windows',
        'Disputes must be reported within 48 hours of the ride',
      ],
    },
    {
      h: 'How to Request a Refund',
      items: [
        `Contact us at ${brandEmail} with your booking ID`,
        'Explain the reason for your cancellation or refund request',
        'Our team will review and respond within 2 business days',
      ],
    },
    {
      h: 'Dispute Resolution',
      items: [
        'All disputes must be reported within 48 hours of the completed or cancelled ride',
        'Provide booking reference and relevant details when contacting support',
        "InverseRide's decision on disputes is final, subject to applicable laws",
      ],
    },
    {
      h: 'Contact Us',
      items: [`Email: ${brandEmail}`, `Phone: ${brandPhone}`],
    },
  ]

  return (
    <div className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        <h1 className="font-head text-heading text-center mb-2 text-primary leading-none">
          Cancellation &amp; Refund Policy
        </h1>
        <div className="bg-white border border-border rounded-card-lg p-10 max-w-[900px] mx-auto mt-10">
          {sections.map(({ h, items }) => (
            <div key={h}>
              <h3 className="font-head text-span font-bold text-secondary mt-6 mb-[10px]">{h}</h3>
              <ul className="pl-5 my-2">
                {items.map(item => (
                  <li key={item} className="text-label text-primary mb-[6px] leading-[1.6]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
