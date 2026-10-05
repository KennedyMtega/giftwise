'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

export interface Session {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer'
  phone?: string
  address?: string
}

interface AuthContextType {
  session: Session | null
  /** true once the stored session has been read (guards wait for this) */
  ready: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  updateSession: (patch: Partial<Session>) => void
}

const STORAGE_KEY = 'gw_session'
const AuthContext = createContext<AuthContextType | undefined>(undefined)

const readStored = (): Session | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setSession(readStored())
    setReady(true)
  }, [])

  const persist = useCallback((next: Session | null) => {
    setSession(next)
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Sign in failed')
      }
      persist((await res.json()) as Session)
    },
    [persist]
  )

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Sign up failed')
      }
      persist((await res.json()) as Session)
    },
    [persist]
  )

  const signOut = useCallback(() => persist(null), [persist])

  const updateSession = useCallback(
    (patch: Partial<Session>) => {
      setSession((current) => {
        const next = current ? { ...current, ...patch } : current
        if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    []
  )

  return (
    <AuthContext.Provider
      value={{
        session,
        ready,
        isAdmin: session?.role === 'admin',
        signIn,
        signUp,
        signOut,
        updateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
