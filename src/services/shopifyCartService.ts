import { SHOPIFY_CONFIG, SHOPIFY_GRAPHQL_URL } from '../config/shopifyConfig'
import type { CartItem } from '../types'

// ─── Airport Detection ────────────────────────────────────────────────────────

const AIRPORT_POSTCODES = [
  // London
  'TW6',  // Heathrow
  'RH6',  // Gatwick
  'CM24', // Stansted
  'LU2',  // Luton
  'SS11', // Southend
  // Regional
  'M90',  // Manchester
  'BS48', // Bristol
  'LS19', // Leeds Bradford
  'BH23', // Bournemouth
  'EH12', // Edinburgh
  'G77',  // Glasgow
  'BT3',  // Belfast City
  'BT29', // Belfast International
  'CF62', // Cardiff
  'AB21', // Aberdeen
  'EX5',  // Exeter
  'NE13', // Newcastle
  'BHX',
]

const AIRPORT_KEYWORDS = [
  'airport',
  'terminal',
  'heathrow',
  'gatwick',
  'stansted',
  'luton',
  'manchester',
  'bristol',
  'edinburgh',
  'glasgow',
  'belfast',
  'cardiff',
  'newcastle',
  'birmingham',
  'leeds bradford',
  'east midlands',
  'southend',
]

export function isAirportLocation(location: string): boolean {
  if (!location) return false
  const upper = location.toUpperCase()
  const lower = location.toLowerCase()

  // Postcode check
  const postcodeMatch = AIRPORT_POSTCODES.some(pc => upper.includes(pc))
  if (postcodeMatch) return true

  // Keyword check
  return AIRPORT_KEYWORDS.some(kw => lower.includes(kw))
}

// ─── Parking Fee Variant Lookup ───────────────────────────────────────────────

export function getParkingFeeVariantId(passengers: number): string | null {
  if (passengers <= 8) {
    return import.meta.env.VITE_PARKING_FEE_SMALL as string || null
  }
  if (passengers <= 16) {
    return import.meta.env.VITE_PARKING_FEE_MEDIUM as string || null
  }
  return import.meta.env.VITE_PARKING_FEE_LARGE as string || null
}

// ─── Line Item Builder ────────────────────────────────────────────────────────

interface ShopifyLineInput {
  merchandiseId: string
  quantity: number
  attributes: { key: string; value: string }[]
}

export function cartItemToLineInput(cartItem: CartItem): ShopifyLineInput {
  const { taxi, search } = cartItem
  const isReturn = search.tripType === 'return'
  const quantity = isReturn ? 2 : 1

  const attributes: { key: string; value: string }[] = [
    { key: 'Vehicle', value: taxi.name },
    { key: 'Trip Type', value: isReturn ? 'Return' : 'One-Way' },
    { key: 'From', value: search.from },
    { key: 'To', value: search.to },
    { key: 'Distance', value: `${search.distance.toFixed(1)} miles` },
    { key: 'Duration', value: search.duration },
    { key: 'Pickup Date', value: search.date },
    { key: 'Pickup Time', value: search.time },
  ]

  if (isReturn && search.returnDate) {
    attributes.push({ key: 'Return Date', value: search.returnDate })
  }
  if (isReturn && search.returnTime) {
    attributes.push({ key: 'Return Time', value: search.returnTime })
  }

  const isAirport =
    isAirportLocation(search.from) || isAirportLocation(search.to)
  if (isAirport && search.flightNumber) {
    attributes.push({ key: 'Flight Number', value: search.flightNumber })
  }

  return {
    merchandiseId: taxi.shopifyId,
    quantity,
    attributes,
  }
}

// ─── Cart Mutation ────────────────────────────────────────────────────────────

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`

export async function createCart(cartItem: CartItem, email?: string): Promise<string> {
  const mainLine = cartItemToLineInput(cartItem)
  const lines: ShopifyLineInput[] = [mainLine]

  // Auto-add parking fee for airport trips
  const isAirportTrip =
    isAirportLocation(cartItem.search.from) || isAirportLocation(cartItem.search.to)

  if (isAirportTrip) {
    const parkingVariantId = getParkingFeeVariantId(cartItem.taxi.passengers)
    if (parkingVariantId) {
      lines.push({
        merchandiseId: parkingVariantId,
        quantity: mainLine.quantity,
        attributes: [{ key: 'Type', value: 'Airport Parking Fee' }],
      })
    }
  }

  const input: Record<string, unknown> = { lines }
  if (email) {
    input.buyerIdentity = { email }
  }

  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({ query: CART_CREATE_MUTATION, variables: { input } }),
  })

  if (!response.ok) {
    throw new Error(`Shopify cart API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  const userErrors = json.data?.cartCreate?.userErrors ?? []
  if (userErrors.length) {
    throw new Error(userErrors[0].message)
  }

  const checkoutUrl: string | undefined = json.data?.cartCreate?.cart?.checkoutUrl
  if (!checkoutUrl) {
    throw new Error('No checkout URL returned from Shopify')
  }

  return checkoutUrl
}
