import { SHOPIFY_GRAPHQL_URL, SHOPIFY_CONFIG } from '../config/shopifyConfig'

const headers = {
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
}

async function gql(query: string, variables: Record<string, unknown>) {
  const res = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`)
  return res.json()
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ShopifyCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
}

export interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

export interface AuthError {
  field: string[] | null
  message: string
  code: string
}

// ─── Register ────────────────────────────────────────────────────────────────

const CUSTOMER_CREATE = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`

export async function registerCustomer(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ customer: ShopifyCustomer | null; errors: AuthError[] }> {
  const { data } = await gql(CUSTOMER_CREATE, {
    input: { firstName, lastName, email, password },
  })
  const { customer, customerUserErrors } = data.customerCreate
  return { customer: customer ?? null, errors: customerUserErrors ?? [] }
}

// ─── Login ───────────────────────────────────────────────────────────────────

const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`

export async function loginCustomer(
  email: string,
  password: string
): Promise<{ token: CustomerAccessToken | null; errors: AuthError[] }> {
  const { data } = await gql(CUSTOMER_ACCESS_TOKEN_CREATE, {
    input: { email, password },
  })
  const { customerAccessToken, customerUserErrors } = data.customerAccessTokenCreate
  return { token: customerAccessToken ?? null, errors: customerUserErrors ?? [] }
}

// ─── Logout ──────────────────────────────────────────────────────────────────

const CUSTOMER_ACCESS_TOKEN_DELETE = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        field
        message
      }
    }
  }
`

export async function logoutCustomer(accessToken: string): Promise<void> {
  await gql(CUSTOMER_ACCESS_TOKEN_DELETE, { customerAccessToken: accessToken })
}

// ─── Get Customer ─────────────────────────────────────────────────────────────

const GET_CUSTOMER = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
    }
  }
`

export async function getCustomer(
  accessToken: string
): Promise<ShopifyCustomer | null> {
  const { data } = await gql(GET_CUSTOMER, { customerAccessToken: accessToken })
  return data.customer ?? null
}

// ─── Customer Orders ──────────────────────────────────────────────────────────

export interface ShopifyOrderLineItem {
  title: string
  quantity: number
  variant: {
    id: string
    title: string
    price: { amount: string; currencyCode: string }
    image: { url: string } | null
  } | null
  customAttributes: { key: string; value: string }[]
}

export interface ShopifyOrder {
  id: string
  orderNumber: number
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  totalPrice: { amount: string; currencyCode: string }
  lineItems: {
    edges: { node: ShopifyOrderLineItem }[]
  }
  driver: { value: string } | null
  driverPhone: { value: string } | null
}

const GET_CUSTOMER_ORDERS = `
  query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 20) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                  }
                  customAttributes {
                    key
                    value
                  }
                }
              }
            }
            driver: metafield(namespace: "order", key: "driver") {
              value
            }
            driverPhone: metafield(namespace: "order", key: "driver_phone") {
              value
            }
          }
        }
      }
    }
  }
`

export async function getCustomerOrders(
  accessToken: string
): Promise<ShopifyOrder[]> {
  const { data } = await gql(GET_CUSTOMER_ORDERS, { customerAccessToken: accessToken })
  return data.customer?.orders?.edges?.map((e: { node: ShopifyOrder }) => e.node) ?? []
}
