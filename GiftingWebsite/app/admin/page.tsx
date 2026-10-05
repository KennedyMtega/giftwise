'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Coins, Receipt, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Gift } from '@/data/products'
import type { StoreOrder, StoreUser } from '@/lib/server/store'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Gift[]>([])
  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [users, setUsers] = useState<StoreUser[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/users').then((r) => r.json()),
    ])
      .then(([p, o, u]) => {
        setProducts(p)
        setOrders(o)
        setUsers(u)
      })
      .finally(() => setLoaded(true))
  }, [])

  const revenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0)
  const lowStock = products.filter((p) => (p.stock ?? 0) <= 10).slice(0, 6)

  const stats = [
    { label: 'Products', value: products.length, icon: Box, href: '/admin/products' },
    { label: 'Orders', value: orders.length, icon: Receipt, href: '/admin/orders' },
    { label: 'Customers', value: users.filter((u) => u.role === 'customer').length, icon: Users, href: '/admin/users' },
    { label: 'Revenue', value: `$${revenue.toFixed(2)}`, icon: Coins, href: '/admin/orders' },
  ]

  if (!loaded) {
    return <div className="rounded-xl border p-12 text-center text-muted-foreground">Loading store data…</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Store overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage products, variations, categories, orders and customers.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.slice(0, 6).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{order.number} · {order.customer}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.date} · {order.items.length} item(s)
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="secondary">{order.status}</Badge>
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low stock (≤ 10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-3 text-sm">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="min-w-0 truncate font-medium hover:text-primary hover:underline"
                >
                  {product.name}
                </Link>
                <Badge variant={product.stock === 0 ? 'destructive' : 'secondary'}>
                  {product.stock ?? 0} left
                </Badge>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="text-sm text-muted-foreground">All products are well stocked.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
