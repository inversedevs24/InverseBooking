// All service tab definitions are hardcoded here.
// `shopifyLabel` must exactly match the `service_type` metafield value on Shopify products.
// `whatsappFlow` = true → submit sends a WhatsApp enquiry instead of navigating to /vehicles.

export type ServiceKey =
    | 'transfer'
    | 'city-to-city'
    | 'airport'
    | 'city-tour'
    | 'hourly'
    | 'desert-safari'
    | 'office-pickup'
    | 'school-pickup'

export interface ServiceConfig {
    label: string
    shopifyLabel: string
    showTo: boolean
    showReturn: boolean
    showHours: boolean
    showPassengers: boolean
    fromPlaceholder: string
    toPlaceholder: string
    /** If true, submitting sends a WhatsApp enquiry instead of navigating to /vehicles */
    whatsappFlow: boolean
}

export const WHATSAPP_NUMBER = '971504579068' //need to take from env

export const SERVICE_CONFIG: Record<ServiceKey, ServiceConfig> = {
    transfer: {
        label: 'Private Transfer',
        shopifyLabel: 'Private Transfer',
        showTo: true, showReturn: true, showHours: false, showPassengers: true,
        fromPlaceholder: 'Enter pickup location',
        toPlaceholder: 'Enter drop-off location',
        whatsappFlow: false,
    },
    'city-to-city': {
        label: 'City to City',
        shopifyLabel: 'City to City',
        showTo: true, showReturn: true, showHours: false, showPassengers: true,
        fromPlaceholder: 'Departure city (e.g. Dubai)',
        toPlaceholder: 'Destination city (e.g. Abu Dhabi)',
        whatsappFlow: false,
    },
    airport: {
        label: 'Airport Rides',
        shopifyLabel: 'Airport Rides',
        showTo: true, showReturn: true, showHours: false, showPassengers: true,
        fromPlaceholder: 'Airport name or terminal',
        toPlaceholder: 'Hotel / home / office address',
        whatsappFlow: false,
    },
    'city-tour': {
        label: 'City Tour',
        shopifyLabel: 'City Tour',
        showTo: false, showReturn: false, showHours: true, showPassengers: true,
        fromPlaceholder: 'Your hotel / starting point',
        toPlaceholder: '',
        whatsappFlow: false,
    },
    hourly: {
        label: 'Hourly Hire',
        shopifyLabel: 'Hourly Hire',
        showTo: false, showReturn: false, showHours: true, showPassengers: true,
        fromPlaceholder: 'Your pickup location',
        toPlaceholder: '',
        whatsappFlow: true,
    },
    'desert-safari': {
        label: 'Desert Safari',
        shopifyLabel: 'Desert Safari',
        showTo: false, showReturn: true, showHours: false, showPassengers: true,
        fromPlaceholder: 'Hotel / pickup address',
        toPlaceholder: '',
        whatsappFlow: false,
    },
    'office-pickup': {
        label: 'Office Pick-up & Drop',
        shopifyLabel: 'Office Pick-up and Drop',
        showTo: true, showReturn: false, showHours: false, showPassengers: true,
        fromPlaceholder: 'Your pickup location',
        toPlaceholder: 'Office address',
        whatsappFlow: true,
    },
    'school-pickup': {
        label: 'School Pick-up & Drop',
        shopifyLabel: 'School Pick-up and Drop',
        showTo: true, showReturn: false, showHours: false, showPassengers: true,
        fromPlaceholder: 'Your pickup location',
        toPlaceholder: 'School address',
        whatsappFlow: true,
    },
}

export const DEFAULT_SERVICE: ServiceKey = 'transfer'

/** Maps Shopify `service_type` metafield value → local ServiceKey */
export const SHOPIFY_LABEL_TO_KEY: Record<string, ServiceKey> = Object.fromEntries(
    (Object.entries(SERVICE_CONFIG) as [ServiceKey, ServiceConfig][]).map(([k, v]) => [v.shopifyLabel, k])
) as Record<string, ServiceKey>
