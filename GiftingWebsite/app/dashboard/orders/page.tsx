'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PackageOpen } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import type { StoreOrder } from '@/lib/server/store'

const statusVariant = (status: string) =>
  status === 'Delivered'
    ? 'default'
    : status === 'Cancelled'
      ? 'destructive'
      : 'secondary'

export default function DashboardOrdersPage() {
  const { session } = useAuth()
  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [loaded, setLoaded] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    fetch(`/api/orders?email=${encodeURIComponent(session.email)}`)
      .then((r) => r.json())
      .then((list: StoreOrder[]) => setOrders(list))
      .finally(() => setLoaded(true))
  }, [session])

  if (!session) return null

  if (!loaded) {
    return <div className="rounded-xl border p-10 text-center text-muted-foreground">Loading orders…</div>
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <PackageOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden />
        <h2 className="text-lg font-semibold">No orders yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          When you place an order it will show up here with full tracking.
        </p>
        <Button asChild className="mt-4">
          <Link href="/gifts">Start shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="text-left"
                aria-expanded={openId === order.id}
                onClick={() => setOpenId(openId === order.id ? null : order.id)}
              >
                <p className="font-semibold">
                  {order.number}{' '}
                  <Badge variant={statusVariant(order.status)} className="ml-1 align-middle">
                    {order.status}
                  </Badge>
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.date} · {order.items.length} item(s) · ${order.total.toFixed(2)} — click
                  to {openId === order.id ? 'hide' : 'view'} details
                </p>
              </button>
              <Button size="sm" variant="outline" asChild>
                <Link href={order.items[0] ? `/gifts/${order.items[0].id}` : '/gifts'}>
                  Buy again
                </Link>
              </Button>
            </div>

            {openId === order.id ? (
              <div className="mt-4 space-y-3 border-t pt-3">
                {order.items.map((item) => (
                  <div key={`${item.id}-${item.name}`} className="flex items-center gap-3">
                    <Link
                      href={`/gifts/${item.id}`}
                      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted"
                    >
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/gifts/${item.id}`} className="block truncate text-sm font-medium hover:text-primary hover:underline">
                        {item.name} × {item.quantity}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {Object.entries(item.variations ?? {})
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' · ') || 'No variations'}
                      </p>
                      {Object.entries(item.customization ?? {}).length > 0 ? (
                        <p className="text-xs italic text-primary">
                          {Object.entries(item.customization ?? {})
                            .map(([k, v]) => `${k}: “${v}”`)
                            .join(' · ')}
                        </p>
                      ) : null}
                    </div>
                    <span className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                {order.address ? (
                  <p className="text-xs text-muted-foreground">Ship to: {order.address}</p>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
