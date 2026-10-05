'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Gift,
  Heart,
  Pencil,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/context/CartContext'
import { categories, giftTypeById } from '@/data/categories'
import type { Gift as Product, Variation } from '@/data/products'
import { cn } from '@/lib/utils'

const assurances = [
  { icon: Truck, label: 'Same-day dispatch before 2pm' },
  { icon: Gift, label: 'Free wrapping and gift note' },
  { icon: ShieldCheck, label: '30-day free returns' },
]

const defaultSelection = (variations?: Variation[]) =>
  Object.fromEntries((variations ?? []).map((v) => [v.id, v.options[0]?.label ?? '']))

export default function GiftItemPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [missing, setMissing] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [custom, setCustom] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/products/${params.id}`)
      .then(async (res) => {
        if (cancelled) return
        if (res.status === 404) {
          setMissing(true)
          return
        }
        const data = (await res.json()) as Product
        setProduct(data)
        setSelected(defaultSelection(data.variations))
      })
      .catch(() => !cancelled && setMissing(true))
    return () => {
      cancelled = true
    }
  }, [params.id])

  const gallery = useMemo(() => {
    if (!product) return []
    const list = product.images?.length ? product.images : [product.image]
    return list
  }, [product])

  const price = useMemo(() => {
    if (!product) return 0
    let delta = 0
    for (const variation of product.variations ?? []) {
      const chosen = variation.options.find((o) => o.label === selected[variation.id])
      delta += chosen?.priceDelta ?? 0
    }
    return product.price + delta
  }, [product, selected])

  if (missing) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <h1 className="text-2xl font-bold">Gift not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed by the store admin.</p>
        <Button asChild className="mt-4">
          <Link href="/gifts">Browse all gifts</Link>
        </Button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-xl border p-12 text-center text-muted-foreground">Loading gift…</div>
    )
  }

  const type = giftTypeById(product.type)
  const categorySlug = categories.find((c) => c.name === product.category)?.id
  const stock = product.stock ?? 0
  const outOfStock = stock <= 0

  const buildItem = () => ({
    id: product.id,
    name: product.name,
    price,
    image: product.image,
    variations: Object.fromEntries(
      (product.variations ?? [])
        .map((v) => [v.name, selected[v.id]] as const)
        .filter(([, value]) => !!value)
    ),
    customization: Object.fromEntries(
      (product.customization ?? [])
        .map((f) => [f.label, (custom[f.id] ?? '').trim()] as const)
        .filter(([, value]) => !!value)
    ),
  })

  const validate = () => {
    const missingField = (product.customization ?? []).find(
      (f) => f.required && !(custom[f.id] ?? '').trim()
    )
    if (missingField) {
      setError(`Please fill in: ${missingField.label}`)
      return false
    }
    const overField = (product.customization ?? []).find(
      (f) => (custom[f.id] ?? '').length > (f.maxLength ?? 999)
    )
    if (overField) {
      setError(`${overField.label} is too long`)
      return false
    }
    setError('')
    return true
  }

  const handleAddToCart = () => {
    if (!validate()) return
    addToCart(buildItem())
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const handleBuyNow = () => {
    if (!validate()) return
    addToCart(buildItem())
    router.push('/checkout')
  }

  return (
    <div className="space-y-6">
      <Link
        href="/gifts"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all gifts
      </Link>

      <Card className="mx-auto max-w-5xl overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2">
          {/* Image preview gallery */}
          <div className="border-b p-4 md:border-b-0 md:border-r">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setOrigin(
                  `${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`
                )
              }}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <Image
                src={gallery[activeImage] ?? product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className={cn(
                  'object-cover transition-transform duration-200 ease-out',
                  zoom && 'scale-[1.6]'
                )}
                style={{ transformOrigin: origin }}
              />
              <Badge className="absolute left-3 top-3 border-transparent bg-background/90 text-foreground shadow-sm">
                {zoom ? 'Zoomed — move cursor' : 'Hover to zoom'}
              </Badge>
            </div>
            <div className="mt-3 flex gap-2">
              {gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  className={cn(
                    'relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors sm:h-20 sm:w-20',
                    index === activeImage ? 'border-primary' : 'border-border hover:border-primary/50'
                  )}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {product.tag ? (
                <Badge className="border-transparent bg-primary text-primary-foreground">
                  {product.tag}
                </Badge>
              ) : null}
              <Badge variant="secondary">{type?.name}</Badge>
              <span className="text-xs text-muted-foreground">
                {stock > 10 ? 'In stock' : stock > 0 ? `Only ${stock} left` : 'Out of stock'}
              </span>
            </div>

            <h1 className="mt-3 text-2xl leading-tight sm:text-3xl">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {categorySlug ? (
                <Link
                  href={`/categories/${categorySlug}`}
                  className="hover:text-primary hover:underline"
                >
                  {product.category}
                </Link>
              ) : (
                product.category
              )}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {product.description}
            </p>

            <p className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
              ${price.toFixed(2)}
              {(product.variations ?? []).some((v) =>
                v.options.some((o) => (o.priceDelta ?? 0) !== 0)
              ) && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  base ${product.price.toFixed(2)}
                </span>
              )}
            </p>

            {/* Variations */}
            {(product.variations ?? []).map((variation) => (
              <div key={variation.id} className="mt-5">
                <p className="text-sm font-semibold">
                  {variation.name}
                  <span className="ml-2 font-normal text-muted-foreground">
                    {selected[variation.id]}
                  </span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {variation.options.map((option) => {
                    const active = selected[variation.id] === option.label
                    return (
                      <button
                        key={option.label}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          setSelected((prev) => ({ ...prev, [variation.id]: option.label }))
                        }
                        className={cn(
                          'inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background hover:border-primary/50'
                        )}
                      >
                        {option.swatch ? (
                          <span
                            className="h-3.5 w-3.5 rounded-full ring-1 ring-border"
                            style={{ backgroundColor: option.swatch }}
                            aria-hidden
                          />
                        ) : null}
                        {option.label}
                        {option.priceDelta ? (
                          <span className="text-xs opacity-80">+${option.priceDelta}</span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Customization */}
            {(product.customization ?? []).length > 0 ? (
              <div className="mt-5 rounded-xl border bg-accent/40 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Pencil className="h-4 w-4 text-primary" aria-hidden />
                  Personalize your gift
                </p>
                <div className="mt-3 space-y-4">
                  {product.customization!.map((field) => (
                    <div key={field.id}>
                      <Label htmlFor={field.id} className="text-xs font-medium">
                        {field.label}
                        {field.required ? <span className="text-destructive"> *</span> : null}
                      </Label>
                      {field.type === 'choice' ? (
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {(field.options ?? []).map((option) => (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={custom[field.id] === option}
                              onClick={(e) =>
                                setCustom((prev) => ({ ...prev, [field.id]: option }))
                              }
                              className={cn(
                                'h-10 rounded-full border px-3.5 text-sm transition-colors',
                                custom[field.id] === option
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border bg-background hover:border-primary/50'
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={field.id}
                          rows={3}
                          maxLength={field.maxLength}
                          value={custom[field.id] ?? ''}
                          onChange={(e) =>
                            setCustom((prev) => ({ ...prev, [field.id]: e.target.value }))
                          }
                          placeholder="Write your message…"
                          className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      ) : (
                        <div className="mt-1.5 flex items-center gap-2">
                          <Input
                            id={field.id}
                            maxLength={field.maxLength}
                            value={custom[field.id] ?? ''}
                            onChange={(e) =>
                              setCustom((prev) => ({ ...prev, [field.id]: e.target.value }))
                            }
                            placeholder="e.g. For Grandma, with love"
                          />
                          {field.maxLength ? (
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {(custom[field.id] ?? '').length}/{field.maxLength}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {error ? (
              <p role="alert" className="mt-4 text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 flex-1"
                disabled={outOfStock}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 flex-1"
                disabled={outOfStock}
                onClick={handleBuyNow}
              >
                <Zap className="mr-2 h-4 w-4" /> Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-12 shrink-0 px-0"
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wishlisted}
                onClick={() => setWishlisted((w) => !w)}
              >
                <Heart className={cn('h-5 w-5', wishlisted && 'fill-current text-destructive')} />
              </Button>
            </div>

            <ul className="mt-5 space-y-2 border-t pt-4">
              {assurances.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
