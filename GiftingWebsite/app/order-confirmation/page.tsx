'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { StoreOrder } from '@/lib/server/store'

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<StoreOrder | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gw_last_order')
      if (raw) setOrder(JSON.parse(raw))
    } catch {}
  }, [])

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-primary" aria-hidden />
          <CardTitle className="text-center">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <p>
            Thank you for your purchase
            {order ? (
              <>
                {' '}
                — order <span className="font-semibold">{order.number}</span>
              </>
            ) : null}
            . Your gift is being prepared.
          </p>
          {order ? (
            <div className="rounded-lg border bg-accent/40 p-3 text-left text-sm">
              {order.items.map((item) => (
                <div key={`${item.id}-${item.name}`} className="flex justify-between py-0.5">
                  <span className="truncate pr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground">
            A confirmation has been sent to your email address.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button asChild>
            <Link href="/dashboard/orders">Track order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/gifts">Keep shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
