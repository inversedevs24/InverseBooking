import { brandName, brandEmail, brandPhone, brandAddress } from '../env'

export default function TermsPage() {
  return (
    <div className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        <h1 className="font-head text-heading text-center mb-2 text-primary leading-none">Terms &amp; Conditions</h1>
        <div className="bg-white border border-border rounded-card-lg p-10 max-w-[900px] mx-auto mt-10">
          <p className="text-label text-muted mb-2 leading-[1.7]">
            These Terms of Use ("Terms") govern your access to and use of the {brandName} platform, services, and website. By accessing or using our services, you agree to be legally bound by these Terms.
          </p>

          {[
            { h: 'Overview of Services', content: <><p className="text-label text-muted mb-2 leading-[1.7]">{brandName} provides technology-enabled access to the following transportation services:</p><ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Transfers: Fixed-point rides (e.g., airport, hotel, intercity)</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Hourly Chauffeur: Time-based vehicle hire with a professional driver</li></ul></> },
            { h: 'Legal Entity Details', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]"><strong>Legal Name:</strong> Inverse RIDE PASSENGERS TRANSPORT – L.L.C – O.P.C</li><li className="text-label text-primary mb-[6px] leading-[1.6]"><strong>Trade License:</strong> CN-1234567</li><li className="text-label text-primary mb-[6px] leading-[1.6]"><strong>Email:</strong> {brandEmail}</li><li className="text-label text-primary mb-[6px] leading-[1.6]"><strong>Contact Number:</strong> {brandPhone}</li></ul> },
            { h: 'Eligibility to Use the Platform', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Be at least 18 years of age</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Have the legal capacity to enter into contracts</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Provide accurate and up-to-date account information</li></ul> },
            { h: 'Pricing & Payments', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Prices are fixed, transparent, and shown before confirmation</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Includes tolls, VAT, fuel, and basic waiting time</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Accepted payment methods: cash, card, or approved digital wallets</li></ul> },
            { h: 'Cancellations & Refunds', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">Urgent Rides: Free if cancelled within 5 minutes and driver not dispatched</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Scheduled Rides: Free if cancelled more than 24 hours before pickup</li><li className="text-label text-primary mb-[6px] leading-[1.6]">Refunds processed to the original payment method within 15 working days</li></ul> },
            { h: 'Contact Us', content: <ul className="pl-5 my-2"><li className="text-label text-primary mb-[6px] leading-[1.6]">📍 {brandAddress}</li><li className="text-label text-primary mb-[6px] leading-[1.6]">✉ {brandEmail}</li><li className="text-label text-primary mb-[6px] leading-[1.6]">📞 {brandPhone}</li></ul> },
          ].map(({ h, content }) => (
            <div key={h}>
              <h3 className="font-head text-span font-bold text-primary mt-6 mb-[10px]">{h}</h3>
              {content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
