'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Coins, Package, Receipt } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import type { StoreOrder } from '@/lib/server/store'

export default function DashboardOverview() {
  const { session } = useAuth()
  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch(`/api/orders?email=${encodeURIComponent(session.email)}`)
      .then((r) => r.json())
      .then((list: StoreOrder[]) => setOrders(list))
      .finally(() => setLoaded(true))
  }, [session])

  const spent = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0)
  const active = orders.filter((o) => o.status === 'Processing' || o.status === 'Shipped').length

  const stats = [
    { label: 'Orders placed', value: orders.length, icon: Receipt },
    { label: 'On the way', value: active, icon: Package },
    { label: 'Total spent', value: `$${spent.toFixed(2)}`, icon: Coins },
    {
      label: 'Items gifted',
      value: orders.reduce(
        (sum, order) => sum + order.items.reduce((a, item) => a + item.quantity, 0),
        0
      ),
      icon: Box,
    },
  ]

  if (!loaded) {
    return <div className="rounded-xl border p-10 text-center text-muted-foreground">Loading…</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
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
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent orders</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/orders">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium">{order.number}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {order.date} · {order.items.map((i) => i.name).join(', ')}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary">{order.status}</Badge>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">No orders yet — time to go gifting!</p>
              <Button asChild className="mt-3">
                <Link href="/gifts">Browse gifts</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Update your details and addresses.{' '}
            <Link href="/dashboard/profile" className="text-primary hover:underline">
              Edit profile
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Notifications, privacy and account controls.{' '}
            <Link href="/dashboard/settings" className="text-primary hover:underline">
              Manage
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shop</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Find something perfect for any occasion.{' '}
            <Link href="/gifts" className="text-primary hover:underline">
              Browse gifts
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
