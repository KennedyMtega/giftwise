import { promises as fs } from 'node:fs'
import path from 'node:path'

import { products as seedProducts, type Gift } from '@/data/products'
import { categories as seedCategories, type GiftCategory } from '@/data/categories'

export interface StoreUser {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'customer'
  phone?: string
  address?: string
  joined: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variations?: Record<string, string>
  customization?: Record<string, string>
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

export interface StoreOrder {
  id: string
  number: string
  email: string
  customer: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  date: string
  address?: string
}

export interface StoreDb {
  products: Gift[]
  categories: GiftCategory[]
  users: StoreUser[]
  orders: StoreOrder[]
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

const DEMO_USERS: StoreUser[] = [
  {
    id: 'u-admin',
    name: 'GiftWise Admin',
    email: 'admin@giftwise.test',
    password: 'admin123',
    role: 'admin',
    phone: '+1 (555) 000-0001',
    address: '1 Studio Lane, Gift City',
    joined: '2025-01-01',
  },
  {
    id: 'u-demo',
    name: 'Demo Shopper',
    email: 'demo@giftwise.test',
    password: 'demo123',
    role: 'customer',
    phone: '+1 (555) 123-4567',
    address: '42 Celebration Ave, Brightown',
    joined: '2025-02-14',
  },
]

const DEMO_ORDERS: StoreOrder[] = [
  {
    id: 'o-1001',
    number: 'GW-1001',
    email: 'demo@giftwise.test',
    customer: 'Demo Shopper',
    items: [
      {
        id: 'g1',
        name: 'Personalized Photo Album',
        price: 29.99,
        quantity: 1,
        image: '/images/products/g1.jpg',
        variations: { Finish: 'Natural' },
        customization: { engraving: 'For Grandma, with love', monogram: 'Script' },
      },
    ],
    total: 29.99,
    status: 'Delivered',
    date: '2026-09-12',
    address: '42 Celebration Ave, Brightown',
  },
  {
    id: 'o-1002',
    number: 'GW-1002',
    email: 'demo@giftwise.test',
    customer: 'Demo Shopper',
    items: [
      {
        id: 'g5',
        name: 'Luxury Scented Candle Set',
        price: 42.99,
        quantity: 2,
        image: '/images/products/g5.jpg',
        variations: { Colour: 'Amber', Size: 'Medium' },
      },
    ],
    total: 85.98,
    status: 'Processing',
    date: '2026-10-01',
    address: '42 Celebration Ave, Brightown',
  },
  {
    id: 'o-1003',
    number: 'GW-1003',
    email: 'admin@giftwise.test',
    customer: 'GiftWise Admin',
    items: [
      {
        id: 'g30',
        name: 'Engraved Heart Locket',
        price: 79.99,
        quantity: 1,
        image: '/images/products/g30.jpg',
        variations: { Metal: 'Rose Gold' },
      },
    ],
    total: 79.99,
    status: 'Shipped',
    date: '2026-10-03',
    address: '1 Studio Lane, Gift City',
  },
]

const freshDb = (): StoreDb => ({
  products: seedProducts,
  categories: seedCategories,
  users: DEMO_USERS,
  orders: DEMO_ORDERS,
})

/** Read the store from disk (seeding it on first run). Always reads fresh. */
export async function readDb(): Promise<StoreDb> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8')
    return JSON.parse(raw) as StoreDb
  } catch {
    const db = freshDb()
    await writeDb(db)
    return db
  }
}

export async function writeDb(db: StoreDb): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8')
}

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
