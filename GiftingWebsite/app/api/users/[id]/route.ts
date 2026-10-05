import { NextResponse, type NextRequest } from 'next/server'

import { readDb, writeDb, type StoreUser } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

export async function PUT(request: NextRequest, { params }: Params) {
  const body = (await request.json()) as Partial<StoreUser>
  const db = await readDb()
  const index = db.users.findIndex((u) => u.id === params.id)
  if (index === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
  db.users[index] = {
    ...db.users[index],
    ...body,
    id: db.users[index].id,
    role: body.role === 'admin' ? 'admin' : body.role === 'customer' ? 'customer' : db.users[index].role,
  }
  await writeDb(db)
  const { password: _password, ...safe } = db.users[index]
  return NextResponse.json(safe)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const db = await readDb()
  const before = db.users.length
  db.users = db.users.filter((u) => u.id !== params.id)
  if (db.users.length === before) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  await writeDb(db)
  return NextResponse.json({ ok: true })
}
