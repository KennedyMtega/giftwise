'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Receipt } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { OrderStatus, StoreOrder } from '@/lib/server/store'

const STATUSES: OrderStatus[] = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [loaded, setLoaded] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((list: StoreOrder[]) => setOrders(list))
      .finally(() => setLoaded(true))
  }, [])

  const setStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => {})
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          {orders.length} order(s) · revenue $
          {orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0).toFixed(2)}
        </p>
      </div>

      {!loaded ? (
        <div className="rounded-xl border p-10 text-center text-muted-foreground">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          <Receipt className="mx-auto mb-2 h-8 w-8" aria-hidden />
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    className="text-left"
                    onClick={() => setOpenId(openId === order.id ? null : order.id)}
                    aria-expanded={openId === order.id}
                  >
                    <p className="font-semibold">
                      {order.number} · {order.customer}{' '}
                      <span className="font-normal text-muted-foreground">({order.email})</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.date} · {order.items.length} item(s) · click to {openId === order.id ? 'hide' : 'view'} details
                    </p>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                    <Select value={order.status} onValueChange={(value) => setStatus(order.id, value as OrderStatus)}>
                      <SelectTrigger className="h-10 w-36" aria-label={`Status for ${order.number}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {openId === order.id ? (
                  <div className="mt-4 space-y-3 border-t pt-3">
                    {order.address ? (
                      <p className="text-xs text-muted-foreground">Ship to: {order.address}</p>
                    ) : null}
                    {order.items.map((item) => (
                      <div key={`${item.id}-${item.name}`} className="flex items-center gap-3">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.name} × {item.quantity}
                          </p>
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
                    <div className="flex justify-end">
                      <Badge variant="secondary">{order.status}</Badge>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
