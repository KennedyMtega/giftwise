/**
 * Generates the site's photo assets from free/open image sources.
 *
 * Usage:
 *   bun scripts/fetch-images.mjs hero
 *   bun scripts/fetch-images.mjs types
 *   bun scripts/fetch-images.mjs categories
 *   bun scripts/fetch-images.mjs products [start] [end]
 *
 * Sources (in order): Openverse (CC) → Wikimedia Commons → picsum.photos.
 * Credits for every downloaded photo are appended to public/images/credits.json.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

import { products } from '../data/products.ts'
import { categories, giftTypes } from '../data/categories.ts'

const ROOT = path.join(import.meta.dir, '..', 'public', 'images')
const UA = 'GiftWiseImageFetcher/1.0 (educational demo project)'

const TYPE_QUERIES = {
  personalized: 'engraved wooden gift',
  flowers: 'flower bouquet',
  sweets: 'chocolate truffles box',
  candles: 'scented candle jar',
  jewelry: 'gold necklace jewellery',
  tech: 'wireless headphones gadget',
  toys: 'teddy bear toy',
  gourmet: 'cheese board food platter',
  beauty: 'spa skincare cosmetics',
  books: 'stack of books',
  decor: 'interior decor vase',
  experiences: 'gift voucher card',
  accessories: 'wrist watch accessory',
}

const CATEGORY_QUERIES = {
  birthday: 'birthday cake candles',
  anniversary: 'romantic anniversary dinner',
  wedding: 'wedding present gift',
  graduation: 'graduation cap',
  holiday: 'holiday presents box',
  housewarming: 'new home plant interior',
  'baby-shower': 'baby clothes blanket',
  retirement: 'retirement celebration toast',
  'thank-you': 'thank you card flowers',
  'get-well': 'get well soon flowers',
  corporate: 'business gift box',
  'self-care': 'spa relaxation candles',
  valentines: 'romantic red roses gift',
  'mothers-day': 'mothers day flowers bouquet',
  'fathers-day': 'fathers day gift',
  christmas: 'christmas gifts tree',
  engagement: 'engagement ring',
  teacher: 'teacher desk apple books',
}

const isJpeg = (b) => b[0] === 0xff && b[1] === 0xd8
const isPng = (b) => b[0] === 0x89 && b[1] === 0x50
const isWebp = (b) => b[8] === 0x57 && b[9] === 0x45
const isImage = (b) => isJpeg(b) || isPng(b) || isWebp(b)

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' })
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 8000 || !isImage(buf)) return null
  return buf
}

function score(title, query) {
  const words = query.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
  const t = (title || '').toLowerCase()
  return words.filter((w) => t.includes(w)).length
}

async function fromOpenverse(query, wide) {
  const params = new URLSearchParams({ q: query, page_size: '10' })
  if (wide) params.set('aspect_ratio', 'wide')
  const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
    headers: { 'User-Agent': UA },
  })
  if (!res.ok) return null
  const data = await res.json()
  const results = (data.results || [])
    .filter((r) => r.url && !r.url.endsWith('.svg'))
    .sort((a, b) => score(b.title, query) - score(a.title, query))
  for (const r of results.slice(0, 5)) {
    const buf = await download(r.url)
    if (buf) {
      return {
        buf,
        credit: { source: 'openverse', title: r.title, creator: r.creator, license: r.license, page: r.foreign_landing_url },
      }
    }
  }
  return null
}

async function fromCommons(query) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: '6',
    gsrlimit: '8',
    prop: 'imageinfo',
    iiprop: 'url|mime',
    iiurlwidth: '1280',
    format: 'json',
    origin: '*',
  })
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': UA },
  })
  if (!res.ok) return null
  const data = await res.json()
  const pages = Object.values(data.query?.pages ?? {}).sort((a, b) => (b.index ?? 0) - (a.index ?? 0))
  for (const p of pages) {
    const info = p.imageinfo?.[0]
    if (!info?.thumburl || (info.mime && !/jpeg|png|webp/.test(info.mime))) continue
    const buf = await download(info.thumburl)
    if (buf) {
      return {
        buf,
        credit: { source: 'commons', title: p.title, creator: 'Wikimedia Commons', license: 'see source', page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}` },
      }
    }
  }
  return null
}

async function fromPicsum(key) {
  const buf = await download(`https://picsum.photos/seed/${encodeURIComponent(key)}/1200/1200`)
  return buf ? { buf, credit: { source: 'picsum', title: key, creator: 'picsum.photos', license: 'random', page: 'https://picsum.photos' } } : null
}

const creditsPath = path.join(ROOT, 'credits.json')
const credits = JSON.parse(await readFile(creditsPath, 'utf8').catch(() => '{}'))

async function fetchInto(relDir, fileName, queries, wide = false) {
  const dir = path.join(ROOT, relDir)
  await mkdir(dir, { recursive: true })
  const out = path.join(dir, fileName)
  for (const q of queries) {
    const hit = (await fromOpenverse(q, wide)) || (await fromCommons(q))
    if (hit) {
      await writeFile(out, hit.buf)
      credits[`${relDir}/${fileName}`] = { ...hit.credit, query: q }
      console.log(`ok   ${relDir}/${fileName}  <- "${q}" (${hit.credit.source}, ${hit.buf.length}B)`)
      return true
    }
  }
  const fb = await fromPicsum(`${relDir}-${fileName}`)
  await writeFile(out, fb.buf)
  credits[`${relDir}/${fileName}`] = { ...fb.credit, query: queries[0] }
  console.log(`fb   ${relDir}/${fileName}  <- picsum fallback`)
  return false
}

async function main() {
  const [group, startArg, endArg] = process.argv.slice(2)
  const plan = {
    hero: async () => {
      await fetchInto('hero', 'gifting.jpg', ['gift wrapping presents ribbons', 'wrapped gifts celebration'], true)
    },
    types: async () => {
      for (const t of giftTypes) await fetchInto('types', `${t.id}.jpg`, [TYPE_QUERIES[t.id] || t.name, `${t.name} gift`])
    },
    categories: async () => {
      for (const c of categories) await fetchInto('categories', `${c.id}.jpg`, [CATEGORY_QUERIES[c.id] || c.name, `${c.name} gift`])
    },
    products: async () => {
      const start = Number(startArg ?? 0)
      const end = Number(endArg ?? products.length)
      for (const p of products.slice(start, end)) {
        const q = TYPE_QUERIES[p.type] || 'gift'
        await fetchInto('products', `${p.id}.jpg`, [p.name, `${p.name} ${q}`, q])
      }
    },
  }
  if (!plan[group]) {
    console.error(`Unknown group "${group}". Use: ${Object.keys(plan).join(' | ')}`)
    process.exit(1)
  }
  await plan[group]()
  await mkdir(ROOT, { recursive: true })
  await writeFile(creditsPath, JSON.stringify(credits, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
