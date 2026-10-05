import { NextResponse, type NextRequest } from 'next/server'

import { readDb, writeDb } from '@/lib/server/store'
import type { GiftCategory } from '@/data/categories'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

export async function PUT(request: NextRequest, { params }: Params) {
  const body = (await request.json()) as Partial<GiftCategory>
  const db = await readDb()
  const index = db.categories.findIndex((c) => c.id === params.id)
  if (index === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
  db.categories[index] = { ...db.categories[index], ...body, id: db.categories[index].id }
  await writeDb(db)
  return NextResponse.json(db.categories[index])
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const db = await readDb()
  const before = db.categories.length
  db.categories = db.categories.filter((c) => c.id !== params.id)
  if (db.categories.length === before) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  await writeDb(db)
  return NextResponse.json({ ok: true })
}
