import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  getCustomer,
  ShopifyCustomer,
  AuthError,
} from '../services/shopifyAuthService'

// ─── Storage keys ────────────────────────────────────────────────────────────

const TOKEN_KEY = 'sb_access_token'
const EXPIRY_KEY = 'sb_token_expiry'

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  customer: ShopifyCustomer | null
  accessToken: string | null
  isLoggedIn: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<AuthError[]>
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<AuthError[]>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount: restore session from localStorage
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY)
      const expiry = localStorage.getItem(EXPIRY_KEY)
      if (token && expiry && new Date(expiry) > new Date()) {
        try {
          const c = await getCustomer(token)
          setCustomer(c)
          setAccessToken(token)
        } catch {
          clearTokens()
        }
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  function clearTokens() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EXPIRY_KEY)
  }

  async function login(email: string, password: string): Promise<AuthError[]> {
    const { token, errors } = await loginCustomer(email, password)
    if (token) {
      localStorage.setItem(TOKEN_KEY, token.accessToken)
      localStorage.setItem(EXPIRY_KEY, token.expiresAt)
      const c = await getCustomer(token.accessToken)
      setCustomer(c)
      setAccessToken(token.accessToken)
    }
    return errors
  }

  async function register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<AuthError[]> {
    const { errors } = await registerCustomer(firstName, lastName, email, password)
    if (errors.length === 0) {
      // Auto-login after successful registration
      const loginErrors = await login(email, password)
      return loginErrors
    }
    return errors
  }

  async function logout(): Promise<void> {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      try { await logoutCustomer(token) } catch { /* ignore */ }
    }
    clearTokens()
    setCustomer(null)
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ customer, accessToken, isLoggedIn: !!customer, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
