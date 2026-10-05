import { promises as fs } from 'node:fs'
import path from 'node:path'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const MAX_BYTES = 8 * 1024 * 1024

/** POST /api/upload — multipart form upload, field name "file" */
export async function POST(request: NextRequest) {
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: 'unsupported file type' }, { status: 415 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file too large (max 8MB)' }, { status: 413 })
  }
  const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1]
  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()))
  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 })
}

/** DELETE /api/upload?path=/uploads/name.jpg — removes an uploaded file (validated) */
export async function DELETE(request: NextRequest) {
  const target = new URL(request.url).searchParams.get('path') ?? ''
  const base = '/uploads/'
  if (!target.startsWith(base) || target.includes('..')) {
    return NextResponse.json({ error: 'invalid path' }, { status: 400 })
  }
  const filePath = path.join(process.cwd(), 'public', target)
  try {
    await fs.unlink(filePath)
  } catch {
    return NextResponse.json({ error: 'file not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
