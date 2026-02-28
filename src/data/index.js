// Fleet data
export const FLEET = [
  { name: 'Executive',   pax: '4', lug: '3', models: 'Mercedes-Benz E-Class, Lexus ES, Tesla Model 3',                   icon: '🚗' },
  { name: 'First Class', pax: '3', lug: '3', models: 'Mercedes-Benz S-Class, Audi A8, BMW 7 Series',                     icon: '🚙' },
  { name: 'Urban SUV',   pax: '5', lug: '2', models: 'Toyota Highlander, Ford Edge, Mitsubishi Outlander',                icon: '🚐' },
  { name: 'Luxury SUV',  pax: '6', lug: '6', models: 'Cadillac Escalade, GMC Yukon, Range Rover Vogue',                   icon: '🚖' },
  { name: 'Family Ride', pax: '6', lug: '6', models: 'Chrysler Grand C4 SpaceTourer, Toyota Prado',                      icon: '🚐' },
  { name: 'Elite Van',   pax: '7', lug: '9', models: 'Mercedes-Benz V-Class',                                             icon: '🚌' },
  { name: 'Mini Bus',    pax: '8', lug: '14', models: 'Mercedes-Benz Sprinter',                                           icon: '🚎' },
]

export const FLEET_HOME = FLEET.slice(3, 7)

// Service categories
export const SERVICES = [
  { icon: '🚗', label: 'Private Transfer' },
  { icon: '🏙️', label: 'City to City' },
  { icon: '✈️', label: 'Airport Rides' },
  { icon: '🏛️', label: 'City Tour' },
  { icon: '🧑‍✈️', label: 'Hourly Hire' },
  { icon: '🏜️', label: 'Desert Safari' },
]

// Trust badges
export const TRUST_BADGES = [
  { color: 'var(--accent)', label: 'Secure Travel' },
  { color: 'var(--gold)',   label: 'Door to Door' },
  { color: '#4a90e2',       label: 'Extra Free Waiting Time' },
  { color: 'var(--accent)', label: 'Free Cancellation' },
]

// Features bar
export const FEATURES = [
  { icon: '🧳', title: 'Free Cancellation',    sub: 'Upto 24 hrs before travel' },
  { icon: '✈️', title: 'Flight Tracking',       sub: 'Driver will monitor your flight' },
  { icon: '👨‍✈️', title: 'Licensed Chauffeurs', sub: 'Maximum Comfort and Safety' },
  { icon: '🕐', title: '24/7 Support',           sub: 'Dedicated Customer Service' },
]

// FAQ data
export const HOME_FAQS = [
  { q: '1. How do I book a ride on InverseRide?',
    a: 'Simply select your pickup and drop-off locations, choose your vehicle type, set the date and time, and confirm your booking — all in just a few clicks.' },
  { q: '2. Can I book both immediate and scheduled rides?',
    a: 'Yes! You can book an Urgent Ride for immediate pickup (30-60 min arrival) or schedule a ride in advance.' },
  { q: '3. What vehicle types can I choose from during booking?',
    a: 'We offer Executive, First Class, Urban SUV, Luxury SUV, Family Ride, Elite Van, and Mini Bus vehicles to suit every need and group size.' },
  { q: '4. Is there a minimum booking time for hourly rides?',
    a: 'Yes, the minimum booking for Hourly Chauffeur service is 3 hours, with a maximum of 14 hours per booking.' },
  { q: '5. Are intercity rides (e.g., Dubai to Abu Dhabi) available?',
    a: 'Yes, we offer intercity transfers between major UAE cities including Dubai, Abu Dhabi, Sharjah, and more.' },
  { q: '6. Can I modify or cancel a ride after booking?',
    a: 'Scheduled rides can be modified or cancelled up to 24 hours before pickup without penalty. Urgent bookings cannot be modified after confirmation.' },
  { q: '7. Are prices fixed or will they change during the trip?',
    a: 'All prices are fixed and transparent, shown before confirmation. They include tolls, VAT, fuel, and basic waiting time.' },
  { q: '8. How do I get support if I face issues while booking?',
    a: 'You can reach us at info@InverseRide.com or call +971 66 666 6666. Our support team is available 24/7.' },
]

export const CONTACT_FAQS = [
  { q: 'How can I get in touch with InverseRide?',
    a: 'You can reach us via email at info@InverseRide.com or call our support line at +971 66 666 6666. You can also fill out the contact form on this page.' },
  { q: 'What are your customer service hours?',
    a: 'Our customer service team is available 24/7 to assist you with bookings, inquiries, and support.' },
  { q: 'How soon can I expect a response?',
    a: 'We typically respond within 1-2 hours during business hours and within 4 hours at other times.' },
  { q: 'Can I make a booking through the contact form?',
    a: 'The contact form is for general inquiries. For bookings, please use the booking section on our Home page or the app.' },
  { q: 'I have an urgent issue. What should I do?',
    a: 'For urgent issues, please call us directly at +971 66 666 6666. This ensures the fastest response.' },
  { q: 'Where are you located?',
    a: 'Floor 1, Office no. 127, AlHisn Baskin Robins Building, Kulaib Bin Abdullah Al Hameli Street, Abu Dhabi.' },
  { q: 'Can I visit your office in person?',
    a: "Yes, you're welcome to visit during business hours (Mon-Sat, 9am-6pm). Please call ahead to schedule an appointment." },
  { q: 'How can I provide feedback or suggestions?',
    a: 'We love hearing from you! Use the contact form above or email us at feedback@InverseRide.com.' },
]

export const PARTNER_FAQS = [
  { q: 'Who can become a partner with InverseRide?',
    a: 'We welcome partnerships with licensed chauffeur services, limousine companies, and professional drivers who are committed to delivering high-quality transportation services.' },
  { q: 'What are the benefits of partnering with InverseRide?',
    a: 'Partners receive steady ride bookings, on-time payments, fair commissions, flexible working hours, dedicated support, and access to premium clients in UAE & UK.' },
  { q: 'How do I apply to become a partner?',
    a: 'Simply fill out the partner registration form above with your contact details, partner type, and we will review your application and get in touch.' },
  { q: 'Is there a registration or setup fee?',
    a: 'No, there are no registration or setup fees to join the InverseRide partner network.' },
  { q: 'What documents are required to apply?',
    a: "You will need a valid driving license (for chauffeurs), vehicle registration documents, trade license (for companies), and proof of insurance." },
  { q: 'How long does the approval process take?',
    a: 'The approval process typically takes 3-5 business days after we receive all required documents.' },
  { q: 'Can individual drivers apply, or is it only for companies?',
    a: 'Both individual drivers and companies can apply. We welcome Individual Chauffeurs, Fleet Owners, Limousine Companies, and Transport Agencies.' },
  { q: 'Who do I contact for support or questions about the partnership?',
    a: 'Reach our partner support team at info@InverseRide.com or call +971 66 666 6666.' },
]
