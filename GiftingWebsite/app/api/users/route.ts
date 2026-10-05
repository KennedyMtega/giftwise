import { NextResponse, type NextRequest } from 'next/server'

import { newId, readDb, writeDb, type StoreUser } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

/** GET /api/users — list, optional ?email= lookup */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const db = await readDb()
  if (email) {
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(user)
  }
  return NextResponse.json(db.users.map(({ password: _password, ...u }) => u))
}

/** POST /api/users — create (sign-up) or authenticate with { email, password } */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<StoreUser> & { password?: string }
  const db = await readDb()

  // Sign-in: { email, password } returns the matching user
  if (body.email && body.password && !body.name) {
    const user = db.users.find(
      (u) => u.email.toLowerCase() === body.email!.toLowerCase() && u.password === body.password
    )
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    const { password: _password, ...safe } = user
    return NextResponse.json(safe)
  }

  if (!body.email || !body.password || !body.name) {
    return NextResponse.json({ error: 'name, email and password are required' }, { status: 400 })
  }
  if (db.users.some((u) => u.email.toLowerCase() === body.email!.toLowerCase())) {
    return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 })
  }
  const user: StoreUser = {
    id: newId('u'),
    name: body.name,
    email: body.email,
    password: body.password,
    role: body.role === 'admin' ? 'admin' : 'customer',
    phone: body.phone ?? '',
    address: body.address ?? '',
    joined: new Date().toISOString().slice(0, 10),
  }
  db.users.push(user)
  await writeDb(db)
  const { password: _password, ...safe } = user
  return NextResponse.json(safe, { status: 201 })
}
