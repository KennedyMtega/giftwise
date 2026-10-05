import { NextResponse, type NextRequest } from 'next/server'

import { newId, readDb, writeDb, type OrderStatus, type StoreOrder } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

/** GET /api/orders — all orders, or ?email= for one customer */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const db = await readDb()
  const orders = email
    ? db.orders.filter((o) => o.email.toLowerCase() === email.toLowerCase())
    : db.orders
  return NextResponse.json(orders.sort((a, b) => b.date.localeCompare(a.date)))
}

/** POST /api/orders — place an order */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<StoreOrder>
  if (!body.email || !body.items?.length) {
    return NextResponse.json({ error: 'email and items are required' }, { status: 400 })
  }
  const db = await readDb()
  const id = newId('o')
  const order: StoreOrder = {
    id,
    number: `GW-${1000 + db.orders.length + 1}`,
    email: body.email,
    customer: body.customer || body.email,
    items: body.items,
    total: Number(body.total ?? 0),
    status: 'Processing',
    date: new Date().toISOString().slice(0, 10),
    address: body.address ?? '',
  }
  db.orders.unshift(order)
  await writeDb(db)
  return NextResponse.json(order, { status: 201 })
}

/** PUT /api/orders — batch-free admin status update: { id, status } */
export async function PUT(request: NextRequest) {
  const body = (await request.json()) as { id?: string; status?: OrderStatus }
  if (!body.id || !body.status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
  }
  const db = await readDb()
  const order = db.orders.find((o) => o.id === body.id)
  if (!order) return NextResponse.json({ error: 'not found' }, { status: 404 })
  order.status = body.status
  await writeDb(db)
  return NextResponse.json(order)
}
