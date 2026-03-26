import { brandEmail, brandPhone } from '../env'

export default function PrivacyPage() {
  return (
    <div className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        <h1 className="font-head text-heading text-center mb-2 text-primary leading-none">Privacy Policy</h1>
        <div className="bg-white border border-border rounded-card-lg p-10 max-w-[900px] mx-auto mt-10">
          {[
            { h: 'Information We Collect', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Full name, phone number, email address</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Booking history and ride preferences</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Payment method and transaction records</li><li className="text-label text-muted mb-[6px] leading-[1.6]">Device type, operating system, IP address</li></ul> },
            { h: 'How We Use Your Information', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Facilitate bookings and ride fulfillment</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Provide customer support</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Process payments and send receipts</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Prevent fraud, abuse, or unauthorized activity</li></ul> },
            { h: 'Sharing Your Information', content: <><ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Drivers and service partners to complete bookings</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Payment processors for secure transactions</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Regulatory authorities when legally required</li></ul><p className="text-label text-muted mb-2 leading-[1.7]">We do not sell or rent your personal data to third parties.</p></> },
            { h: 'Data Security', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Secure encryption measures</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Limited access controls</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Continuous system monitoring</li></ul> },
            { h: 'Your Privacy Rights', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Access or update account information</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Request data deletion (subject to legal limitations)</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Withdraw location tracking consent via device settings</li></ul> },
            { h: 'Contact Us', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Email: {brandEmail}</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Phone: {brandPhone}</li></ul> },
          ].map(({ h, content }) => (
            <div key={h}>
              <h3 className="font-head text-span font-bold text-primary mt-6 mb-[10px]">{h}</h3>
              {content}
            </div>
          ))}
          <p className="text-label text-muted mt-4">Last Updated: 05 May 2025</p>
        </div>
      </div>
    </div>
  )
}
