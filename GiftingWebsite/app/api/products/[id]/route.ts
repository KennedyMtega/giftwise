import { NextResponse, type NextRequest } from 'next/server'

import { readDb, writeDb } from '@/lib/server/store'
import type { Gift } from '@/data/products'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

export async function GET(_request: NextRequest, { params }: Params) {
  const db = await readDb()
  const product = db.products.find((p) => p.id === params.id)
  if (!product) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(product)
}

/** PUT /api/products/[id] — full update (admin edit form) */
export async function PUT(request: NextRequest, { params }: Params) {
  const body = (await request.json()) as Partial<Gift>
  const db = await readDb()
  const index = db.products.findIndex((p) => p.id === params.id)
  if (index === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const existing = db.products[index]
  const updated: Gift = {
    ...existing,
    ...body,
    id: existing.id,
    price: Number(body.price ?? existing.price),
    stock: Number(body.stock ?? existing.stock ?? 0),
    images: body.images?.length ? body.images : existing.images,
  }
  db.products[index] = updated
  await writeDb(db)
  return NextResponse.json(updated)
}

/** DELETE /api/products/[id] */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const db = await readDb()
  const before = db.products.length
  db.products = db.products.filter((p) => p.id !== params.id)
  if (db.products.length === before) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  await writeDb(db)
  return NextResponse.json({ ok: true })
}
