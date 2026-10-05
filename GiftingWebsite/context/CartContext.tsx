'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  /** Unique per product + variation + customization combo */
  key: string
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variations?: Record<string, string>
  customization?: Record<string, string>
}

export type AddToCartInput = Omit<CartItem, 'key' | 'quantity'> & {
  key?: string
  quantity?: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: AddToCartInput) => void
  removeFromCart: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const cartKey = (
  id: string,
  variations?: Record<string, string>,
  customization?: Record<string, string>
) =>
  [
    id,
    Object.entries(variations ?? {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|'),
    Object.entries(customization ?? {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|'),
  ].join('::')

const normalize = (raw: string | null): CartItem[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as CartItem[]
    return parsed.map((item) => ({
      ...item,
      key: item.key ?? cartKey(item.id, item.variations, item.customization),
    }))
  } catch {
    return []
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setCartItems(normalize(localStorage.getItem('cart')))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
    const newTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(newTotal)
  }, [cartItems])

  const addToCart = (item: AddToCartInput) => {
    const key = item.key ?? cartKey(item.id, item.variations, item.customization)
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.key === key)
      if (existingItem) {
        return prevItems.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
        )
      }
      return [...prevItems, { ...item, key, quantity: item.quantity ?? 1 }]
    })
  }

  const removeFromCart = (key: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.key !== key))
  }

  const updateQuantity = (key: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => (item.key === key ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
