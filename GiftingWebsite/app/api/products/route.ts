import { NextResponse, type NextRequest } from 'next/server'

import { newId, readDb, writeDb } from '@/lib/server/store'
import type { Gift } from '@/data/products'

export const dynamic = 'force-dynamic'

/** GET /api/products — list, with optional ?q= ?type= ?category= ?featured=1 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase().trim()
  const type = searchParams.get('type')
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  const db = await readDb()
  let products = db.products
  if (q) products = products.filter((p) => p.name.toLowerCase().includes(q))
  if (type) products = products.filter((p) => p.type === type)
  if (category) products = products.filter((p) => p.category === category)
  if (featured) {
    products = products.filter((p) => ['Bestseller', 'New', 'Premium'].includes(p.tag ?? ''))
  }
  return NextResponse.json(products)
}

/** POST /api/products — create a product */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Gift>
  if (!body.name || body.price === undefined) {
    return NextResponse.json({ error: 'name and price are required' }, { status: 400 })
  }
  const db = await readDb()
  const product: Gift = {
    id: body.id || newId('p'),
    name: body.name,
    price: Number(body.price),
    image: body.image || '/images/types/decor.jpg',
    images: body.images?.length ? body.images : [body.image || '/images/types/decor.jpg'],
    category: body.category || db.categories[0]?.name || 'Birthday Gifts',
    type: body.type || 'decor',
    tag: body.tag,
    description: body.description || '',
    variations: body.variations ?? [],
    customization: body.customization ?? [],
    stock: body.stock ?? 0,
  }
  db.products.unshift(product)
  await writeDb(db)
  return NextResponse.json(product, { status: 201 })
}
