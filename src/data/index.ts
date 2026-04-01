import type { FleetItem, Service, TrustBadge, Feature, FAQ } from '../types'
import { brandName, brandEmail, brandPhone } from '../env'

export const FLEET: FleetItem[] = [
  { name: 'Executive',   pax: '4', lug: '3', models: 'Mercedes-Benz E-Class, Lexus ES, Tesla Model 3',        icon: '🚗', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&q=80' },
  { name: 'First Class', pax: '3', lug: '3', models: 'Mercedes-Benz S-Class, Audi A8, BMW 7 Series',          icon: '🚙', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80' },
  { name: 'Urban SUV',   pax: '5', lug: '2', models: 'Toyota Highlander, Ford Edge, Mitsubishi Outlander',     icon: '🚐', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80' },
  { name: 'Luxury SUV',  pax: '6', lug: '6', models: 'Cadillac Escalade, GMC Yukon, Range Rover',        icon: '🚖', image: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=400&q=80' },
  { name: 'Family Ride', pax: '6', lug: '6', models: 'Chrysler Grand C4 SpaceTourer, Toyota Prado',            icon: '🚐', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80' },
  { name: 'Elite Van',   pax: '7', lug: '9', models: 'Mercedes-Benz V-Class',                                  icon: '🚌', image: 'https://tse4.mm.bing.net/th/id/OIP._zi2WAWjqIooEa4GYawMBQHaEH?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { name: 'Mini Bus',    pax: '8', lug: '14', models: 'Mercedes-Benz Sprinter',                                icon: '🚎', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80' },
]

export const FLEET_HOME = FLEET.slice(3, 7)

// Maps Shopify serviceType label → booking route — shared across Footer, PromoBanners, ServiceCategories
export const SERVICE_ROUTE_MAP: Record<string, string> = {
  'Private Transfer': '/book?service=transfer',
  'City to City':     '/book?service=city-to-city',
  'Airport Rides':    '/book?service=airport',
  'City Tour':        '/book?service=city-tour',
  'Hourly Hire':      '/book?service=hourly',
  'Desert Safari':    '/book?service=desert-safari',
}

export const SERVICES: Service[] = [
  { icon: '🚗',    label: 'Private Transfer', image: 'https://images.pexels.com/photos/36377058/pexels-photo-36377058.jpeg' },
  { icon: '🏙️',  label: 'City to City',      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&q=80' },
  { icon: '✈️',   label: 'Airport Rides',     image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80' },
  { icon: '🏛️',  label: 'City Tour',          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&q=80' },
  { icon: '🧑‍✈️', label: 'Hourly Hire',     image: 'https://cdn.prod.website-files.com/656e39bd8b07a811ace24224/656e39bd8b07a811ace2462a_falt.webp' },
  { icon: '🏜️',  label: 'Desert Safari',      image: 'https://images.pexels.com/photos/5604852/pexels-photo-5604852.jpeg' },
]

export const TRUST_BADGES: TrustBadge[] = [
  { color: '#CBA135', label: 'Secure Travel' },
  { color: '#CBA135', label: 'Door to Door' },
  { color: '#4a90e2', label: 'Extra Free Waiting Time' },
  { color: '#CBA135', label: 'Free Cancellation' },
]

export const FEATURES: Feature[] = [
  { icon: '🧳', title: 'Free Cancellation',    sub: 'Upto 24 hrs before travel' },
  { icon: '✈️', title: 'Flight Tracking',       sub: 'Driver will monitor your flight' },
  { icon: '👨‍✈️', title: 'Licensed Chauffeurs', sub: 'Maximum Comfort and Safety' },
  { icon: '🕐', title: '24/7 Support',           sub: 'Dedicated Customer Service' },
]

export const HOME_FAQS: FAQ[] = [
  { q: `1. How do I book a ride on ${brandName}?`,
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
    a: `You can reach us at ${brandEmail} or call ${brandPhone}. Our support team is available 24/7.` },
]

export const CONTACT_FAQS: FAQ[] = [
  { q: `How can I get in touch with ${brandName}?`,
    a: `You can reach us via email at ${brandEmail} or call our support line at ${brandPhone}. You can also fill out the contact form on this page.` },
  { q: 'What are your customer service hours?',
    a: 'Our customer service team is available 24/7 to assist you with bookings, inquiries, and support.' },
  { q: 'How soon can I expect a response?',
    a: 'We typically respond within 1-2 hours during business hours and within 4 hours at other times.' },
  { q: 'Can I make a booking through the contact form?',
    a: 'The contact form is for general inquiries. For bookings, please use the booking section on our Home page or the app.' },
  { q: 'I have an urgent issue. What should I do?',
    a: `For urgent issues, please call us directly at ${brandPhone}. This ensures the fastest response.` },
  { q: 'Where are you located?',
    a: 'Floor 1, Office no. 127, AlHisn Baskin Robins Building, Kulaib Bin Abdullah Al Hameli Street, Abu Dhabi.' },
  { q: 'Can I visit your office in person?',
    a: "Yes, you're welcome to visit during business hours (Mon-Sat, 9am-6pm). Please call ahead to schedule an appointment." },
  { q: 'How can I provide feedback or suggestions?',
    a: `We love hearing from you! Use the contact form above or email us at ${brandEmail}.` },
]

export const PARTNER_FAQS: FAQ[] = [
  { q: `Who can become a partner with ${brandName}?`,
    a: 'We welcome partnerships with licensed chauffeur services, limousine companies, and professional drivers who are committed to delivering high-quality transportation services.' },
  { q: `What are the benefits of partnering with ${brandName}?`,
    a: 'Partners receive steady ride bookings, on-time payments, fair commissions, flexible working hours, dedicated support, and access to premium clients across the UAE.' },
  { q: 'How do I apply to become a partner?',
    a: 'Simply fill out the partner registration form above with your contact details, partner type, and we will review your application and get in touch.' },
  { q: 'Is there a registration or setup fee?',
    a: `No, there are no registration or setup fees to join the ${brandName} partner network.` },
  { q: 'What documents are required to apply?',
    a: "You will need a valid driving license (for chauffeurs), vehicle registration documents, trade license (for companies), and proof of insurance." },
  { q: 'How long does the approval process take?',
    a: 'The approval process typically takes 3-5 business days after we receive all required documents.' },
  { q: 'Can individual drivers apply, or is it only for companies?',
    a: 'Both individual drivers and companies can apply. We welcome Individual Chauffeurs, Fleet Owners, Limousine Companies, and Transport Agencies.' },
  { q: 'Who do I contact for support or questions about the partnership?',
    a: `Reach our partner support team at ${brandEmail} or call ${brandPhone}.` },
]
