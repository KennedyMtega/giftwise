import { NextResponse, type NextRequest } from 'next/server'

import { newId, readDb, writeDb } from '@/lib/server/store'
import type { GiftCategory } from '@/data/categories'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = await readDb()
  return NextResponse.json(db.categories)
}

/** POST /api/categories — create an occasion/category */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<GiftCategory>
  if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 })
  const db = await readDb()
  const category: GiftCategory = {
    id: body.id || newId('c'),
    name: body.name,
    short: body.short || body.name,
    description: body.description || '',
  }
  db.categories.push(category)
  await writeDb(db)
  return NextResponse.json(category, { status: 201 })
}
