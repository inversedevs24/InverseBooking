import { SHOPIFY_CONFIG, SHOPIFY_GRAPHQL_URL, METAFIELD_NAMESPACES, METAFIELD_KEYS } from '../config/shopifyConfig'
import type { TaxiOption, TaxiVariant } from '../types'

// ─── GraphQL Query ─────────────────────────────────────────────────────────────

const GET_PRODUCTS_QUERY = `
  query GetTaxiProducts {
    products(first: 250) {
      edges {
        node {
          id
          title
          productType
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 200) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "taxi_details", key: "vehicle_type" },
            { namespace: "taxi_details", key: "passengers" },
            { namespace: "taxi_details", key: "luggage" },
            { namespace: "taxi_details", key: "rating" },
            { namespace: "taxi_details", key: "reviews" },
            { namespace: "taxi_details", key: "base_fare" },
            { namespace: "taxi_details", key: "per_km_rate" },
            { namespace: "taxi_details", key: "estimated_arrival" },
            { namespace: "taxi_details", key: "popular" },
            { namespace: "features", key: "features_list" },
            { namespace: "taxi_details", key: "service_type" },
            { namespace: "custom", key: "banner_image" },
            { namespace: "custom", key: "service_description" }
          ]) {
            namespace
            key
            value
            type
            reference {
              ... on MediaImage {
                image {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface RawMetafield {
  namespace: string
  key: string
  value: string
  type: string
  reference?: { image?: { url: string } }
}

export function getMetafieldValue(
  metafields: RawMetafield[],
  namespace: string,
  key: string,
  defaultValue: unknown,
): unknown {
  const field = metafields.find(m => m.namespace === namespace && m.key === key)
  if (!field || field.value == null) return defaultValue

  try {
    switch (field.type) {
      case 'number_integer':
        return parseInt(field.value, 10)
      case 'number_decimal':
        return parseFloat(field.value)
      case 'boolean':
        return field.value === 'true'
      case 'json':
      case 'list.single_line_text_field':
        return JSON.parse(field.value)
      default: {
        // Strip surrounding quotes from plain string metafields
        const v = field.value
        if (v.startsWith('"') && v.endsWith('"')) {
          return v.slice(1, -1)
        }
        return v
      }
    }
  } catch {
    return defaultValue
  }
}

// Matches both "0-10 km" and "0-10 miles" variant titles
const BAND_REGEX = /^\d+-\d+\s*(km|miles?)$/i

export function parseVariants(edges: any[]): TaxiVariant[] {
  return edges.map((edge: any) => {
    const node = edge.node
    const title: string = node.title ?? ''
    const match = title.match(/^(\d+)-(\d+)\s*(km|miles?)$/i)
    return {
      id: node.id as string,
      title,
      price: {
        amount: node.price?.amount ?? '0',
        currencyCode: node.price?.currencyCode ?? 'GBP',
      },
      kmRangeMin: match ? parseInt(match[1], 10) : 0,
      kmRangeMax: match ? parseInt(match[2], 10) : 0,
    }
  })
}

function transformProduct(node: any): TaxiOption {
  console.log("node", node);

  const metafields: RawMetafield[] = (node.metafields ?? []).filter(Boolean)
  const getMeta = (ns: string, key: string, def: unknown) =>
    getMetafieldValue(metafields, ns, key, def)

  const variants = parseVariants(node.variants?.edges ?? [])
  const numericId = parseInt((node.id as string).split('/').pop() ?? '0', 10)
  const firstVariantId = variants[0]?.id ?? ''

  const vehicleType = getMeta(
    METAFIELD_NAMESPACES.TAXI_DETAILS,
    METAFIELD_KEYS.VEHICLE_TYPE,
    node.title,
  ) as string

  const estimatedArrival = getMeta(
    METAFIELD_NAMESPACES.TAXI_DETAILS,
    METAFIELD_KEYS.ESTIMATED_ARRIVAL,
    '',
  ) as string

  const bannerImageField = metafields.find(
    m => m.namespace === METAFIELD_NAMESPACES.CUSTOM && m.key === METAFIELD_KEYS.BANNER_IMAGE
  )
  const bannerImage = bannerImageField?.reference?.image?.url ?? ''

  return {
    id: numericId,
    shopifyId: firstVariantId,
    shopifyProductId: node.id as string,
    name: node.title as string,
    vehicleType,
    type: vehicleType,
    displayName: node.title as string,
    image: node.images?.edges?.[0]?.node?.url ?? '',
    rating: getMeta(METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.RATING, 0) as number,
    reviews: getMeta(METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.REVIEWS, 0) as number,
    passengers: getMeta(METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.PASSENGERS, 0) as number,
    luggage: getMeta(METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.LUGGAGE, 0) as number,
    features: getMeta(METAFIELD_NAMESPACES.FEATURES, METAFIELD_KEYS.FEATURES_LIST, []) as string[],
    baseFare: getMeta(METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.BASE_FARE, 0) as number,
    perKmRate: getMeta(METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.PER_KM_RATE, 0) as number,
    estimatedArrival,
    eta: estimatedArrival,
    popular: getMeta(METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.POPULAR, false) as boolean,
    serviceType: getMeta(METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.SERVICE_TYPE, '') as string,
    bannerImage,
    serviceDescription: getMeta(METAFIELD_NAMESPACES.CUSTOM, METAFIELD_KEYS.SERVICE_DESCRIPTION, '') as string,
    variants,
  }
}

// ─── Variant Matching ─────────────────────────────────────────────────────────

/**
 * Returns the Shopify variant GID that covers distanceKm.
 * Matches variant titles in either "0-10 km" or "0-10 miles" format.
 * Exact match first; falls back to nearest band.
 */
export function getVariantIdForDistance(
  variants: TaxiVariant[],
  distanceKm: number,
): string | null {
  const valid = variants.filter(v => BAND_REGEX.test(v.title))
  if (valid.length === 0) return null

  // Exact match
  const exact = valid.find(
    v => distanceKm >= v.kmRangeMin && distanceKm <= v.kmRangeMax,
  )
  if (exact) return exact.id

  // Sort ascending by range start for fallback
  const sorted = [...valid].sort((a, b) => a.kmRangeMin - b.kmRangeMin)

  if (distanceKm < sorted[0].kmRangeMin) return sorted[0].id
  if (distanceKm > sorted[sorted.length - 1].kmRangeMax) return sorted[sorted.length - 1].id

  // Closest midpoint
  let nearest = sorted[0]
  let minDiff = Infinity
  for (const v of sorted) {
    const mid = (v.kmRangeMin + v.kmRangeMax) / 2
    const diff = Math.abs(distanceKm - mid)
    if (diff < minDiff) {
      minDiff = diff
      nearest = v
    }
  }
  return nearest.id
}

// ─── Price Utility ────────────────────────────────────────────────────────────

/** Normalise a variant price (object or number/string) to a display string. */
export function parsePrice(price: TaxiVariant['price'] | number | string): string {
  if (typeof price === 'object' && price !== null && 'amount' in price) {
    return parseFloat(price.amount).toFixed(2)
  }
  return parseFloat(String(price)).toFixed(2)
}

// ─── Homepage Slides Metafield Query ──────────────────────────────────────────

// Collection handles for metafield-driven image slides
const HOMEPAGE_COLLECTION_HANDLE = 'homepage'
const CHAUFFEUR_COLLECTION_HANDLE = 'hourly-chauffeur'

const GET_HOMEPAGE_SLIDES_QUERY = `
  query GetHomepageSlides($handle: String!) {
    collection(handle: $handle) {
      metafield(namespace: "custom", key: "homepage_slides") {
        references(first: 10) {
          nodes {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`

export async function fetchHomepageImages(): Promise<string[]> {
  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({
      query: GET_HOMEPAGE_SLIDES_QUERY,
      variables: { handle: HOMEPAGE_COLLECTION_HANDLE },
    }),
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`)
  }

  const json = await response.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  const nodes = json.data?.collection?.metafield?.references?.nodes ?? []

  return nodes
    .map((node: any) => node?.image?.url)
    .filter(Boolean)
}

// ─── Service Images Query ──────────────────────────────────────────────────────

const GET_SERVICE_IMAGES_QUERY = `
  query GetServiceImages {
    collection(handle: "services") {
      hourly_chauffeur: metafield(namespace: "custom", key: "hourly_chauffeur") {
        reference { ... on MediaImage { image { url } } }
      }
      private_transfer: metafield(namespace: "custom", key: "private_transfer") {
        reference { ... on MediaImage { image { url } } }
      }
      desert_safari: metafield(namespace: "custom", key: "desert_safari") {
        reference { ... on MediaImage { image { url } } }
      }
      city_to_city: metafield(namespace: "custom", key: "city_to_city") {
        reference { ... on MediaImage { image { url } } }
      }
      city_tour: metafield(namespace: "custom", key: "city_tour") {
        reference { ... on MediaImage { image { url } } }
      }
      hourly_hire: metafield(namespace: "custom", key: "hourly_hire") {
        reference { ... on MediaImage { image { url } } }
      }
    }
  }
`

export async function fetchServiceImages(): Promise<Record<string, string>> {
  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({ query: GET_SERVICE_IMAGES_QUERY }),
  })

  if (!response.ok) throw new Error(`Shopify API error: ${response.status}`)

  const json = await response.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)

  const col = json.data?.collection ?? {}
  const result: Record<string, string> = {}
  for (const key of ['hourly_chauffeur', 'private_transfer', 'desert_safari', 'city_to_city', 'city_tour', 'hourly_hire']) {
    const url = col[key]?.reference?.image?.url
    if (url) result[key] = url
  }
  return result
}

export async function fetchChauffeurImages(): Promise<string[]> {
  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({
      query: GET_HOMEPAGE_SLIDES_QUERY,
      variables: { handle: CHAUFFEUR_COLLECTION_HANDLE },
    }),
  })

  if (!response.ok) throw new Error(`Shopify API error: ${response.status}`)

  const json = await response.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)

  const nodes = json.data?.collection?.metafield?.references?.nodes ?? []
  return nodes.map((node: any) => node?.image?.url).filter(Boolean)
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchTaxiProducts(): Promise<TaxiOption[]> {
  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({ query: GET_PRODUCTS_QUERY }),
  })
  console.log("response", response);

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  console.log("json", json);


  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  const edges: any[] = json.data?.products?.edges ?? []
  console.log("edges", edges);

  const nodes = edges.map((edge: any) => edge.node)
  console.log('productTypes:', nodes.map((n: any) => n.productType))
  const filtered = nodes.filter((node: any) => node.productType !== 'Parking Fee')
  console.log('after filter:', filtered.length)
  return filtered.map(transformProduct)
}
