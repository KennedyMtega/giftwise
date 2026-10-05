'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Star, Trash2, Upload, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { GiftCategory, GiftType } from '@/data/categories'
import { categories as seedCategories, giftTypes } from '@/data/categories'
import type { CustomizationField, Gift, Variation } from '@/data/products'
import { cn } from '@/lib/utils'

const slug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'option'

/** "Silver, Gold, Rose Gold|15" → [{label:'Silver'}, … {label:'Rose Gold', priceDelta:15}] */
const parseOptions = (text: string) =>
  text
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [label, delta] = part.split('|')
      const priceDelta = delta !== undefined ? Number(delta) : undefined
      return {
        label: label.trim(),
        priceDelta: Number.isFinite(priceDelta) && priceDelta ? priceDelta : undefined,
      }
    })

const optionsToText = (options: Variation['options']) =>
  options.map((o) => (o.priceDelta ? `${o.label}|${o.priceDelta}` : o.label)).join(', ')

export function ProductForm({ product }: { product?: Gift }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<GiftCategory[]>(seedCategories)
  const [name, setName] = useState(product?.name ?? '')
  const [price, setPrice] = useState(String(product?.price ?? ''))
  const [stock, setStock] = useState(String(product?.stock ?? '20'))
  const [description, setDescription] = useState(product?.description ?? '')
  const [category, setCategory] = useState(product?.category ?? seedCategories[0]?.name ?? '')
  const [type, setType] = useState(product?.type ?? 'decor')
  const [tag, setTag] = useState(product?.tag ?? '')
  const [images, setImages] = useState<string[]>(product?.images ?? (product?.image ? [product.image] : []))
  const [variations, setVariations] = useState(
    (product?.variations ?? []).map((v) => ({
      id: v.id,
      name: v.name,
      optionsText: optionsToText(v.options),
    }))
  )
  const [customization, setCustomization] = useState<CustomizationField[]>(product?.customization ?? [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((list: GiftCategory[]) => list?.length && setCategories(list))
      .catch(() => {})
  }, [])

  const uploadImage = async (file: File) => {
    setBusy(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Upload failed')
      setImages((prev) => [...prev, body.url])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  const removeImage = async (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url))
    if (url.startsWith('/uploads/')) {
      await fetch(`/api/upload?path=${encodeURIComponent(url)}`, { method: 'DELETE' }).catch(() => {})
    }
  }

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      if (!name.trim()) throw new Error('Product name is required')
      const payload = {
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        description,
        category,
        type,
        tag: tag || undefined,
        images: images.length ? images : undefined,
        image: images[0],
        variations: variations
          .filter((v) => v.name.trim() && v.optionsText.trim())
          .map((v): Variation => ({ id: slug(v.name), name: v.name.trim(), options: parseOptions(v.optionsText) })),
        customization: customization.filter((f) => f.label.trim()),
      }
      const res = await fetch(product ? `/api/products/${product.id}` : '/api/products', {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const typeInfo = giftTypes.find((t) => t.id === type)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          {product ? 'Edit product' : 'New product'}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/products')}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy}>
            {busy ? 'Saving…' : product ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Name</Label>
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Engraved Oak Serving Board" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-desc">Description</Label>
              <textarea
                id="p-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is it, who is it for, what makes it special?"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-price">Price (USD)</Label>
                <Input id="p-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-stock">Stock</Label>
                <Input id="p-stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Occasion / category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Gift type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {giftTypes.map((t: GiftType) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Badge</Label>
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger>
                  <SelectValue placeholder="No badge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No badge</SelectItem>
                  {['Bestseller', 'New', 'Premium', 'Eco', 'Limited'].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {typeInfo ? (
                <p className="text-xs text-muted-foreground">Type artwork: {typeInfo.name}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((url, index) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
                  <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                  {index === 0 && (
                    <Badge className="absolute left-1 top-1 border-transparent bg-primary text-primary-foreground">
                      Main
                    </Badge>
                  )}
                  <div className="absolute right-1 top-1 flex gap-1">
                    {index > 0 && (
                      <button
                        type="button"
                        title="Make main image"
                        aria-label="Make main image"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-primary shadow-sm transition-opacity hover:bg-background"
                        onClick={() =>
                          setImages((prev) => [prev[index], ...prev.filter((_, i) => i !== index)])
                        }
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      title="Remove image"
                      aria-label="Remove image"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-destructive shadow-sm transition-opacity hover:bg-background"
                      onClick={() => removeImage(url)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Upload className="h-5 w-5" aria-hidden />
                Upload
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) uploadImage(file)
                e.target.value = ''
              }}
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP or GIF up to 8MB. The first image is the main product photo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Variations</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setVariations((prev) => [...prev, { id: `v${prev.length + 1}`, name: '', optionsText: '' }])
              }
            >
              <Plus className="mr-1 h-4 w-4" /> Add variation
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Options are comma-separated; append <code className="rounded bg-muted px-1">|amount</code> for a
              price increase, e.g. <code className="rounded bg-muted px-1">Standard, Deluxe|15</code>.
            </p>
            {variations.length === 0 && (
              <p className="text-sm text-muted-foreground">No variations — the product sells as-is.</p>
            )}
            {variations.map((variation, index) => (
              <div key={variation.id} className="space-y-2 rounded-lg border p-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Variation name (e.g. Colour)"
                    value={variation.name}
                    onChange={(e) =>
                      setVariations((prev) =>
                        prev.map((v, i) => (i === index ? { ...v, name: e.target.value } : v))
                      )
                    }
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Remove variation"
                    onClick={() => setVariations((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Input
                  placeholder="Options: Navy, Gold, Rose Gold|10"
                  value={variation.optionsText}
                  onChange={(e) =>
                    setVariations((prev) =>
                      prev.map((v, i) => (i === index ? { ...v, optionsText: e.target.value } : v))
                    )
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customization options</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setCustomization((prev) => [
                  ...prev,
                  { id: `c${prev.length + 1}`, label: '', type: 'text', maxLength: 30 },
                ])
              }
            >
              <Plus className="mr-1 h-4 w-4" /> Add field
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Fields buyers can personalize: engraving text, gift notes, monogram choices…
            </p>
            {customization.length === 0 && (
              <p className="text-sm text-muted-foreground">No customization fields.</p>
            )}
            {customization.map((field, index) => (
              <div key={field.id} className="space-y-2 rounded-lg border p-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Field label (e.g. Engraving text)"
                    value={field.label}
                    onChange={(e) =>
                      setCustomization((prev) =>
                        prev.map((f, i) => (i === index ? { ...f, label: e.target.value } : f))
                      )
                    }
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Remove field"
                    onClick={() => setCustomization((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={field.type}
                    onValueChange={(value) =>
                      setCustomization((prev) =>
                        prev.map((f, i) =>
                          i === index ? { ...f, type: value as CustomizationField['type'] } : f
                        )
                      )
                    }
                  >
                    <SelectTrigger aria-label="Field type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Short text</SelectItem>
                      <SelectItem value="textarea">Long text</SelectItem>
                      <SelectItem value="choice">Choice chips</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Max length"
                    aria-label="Max length"
                    value={field.maxLength ?? ''}
                    onChange={(e) =>
                      setCustomization((prev) =>
                        prev.map((f, i) =>
                          i === index ? { ...f, maxLength: Number(e.target.value) || undefined } : f
                        )
                      )
                    }
                  />
                </div>
                {field.type === 'choice' && (
                  <Input
                    placeholder="Options: Classic Serif, Modern Sans, Script"
                    aria-label="Choice options"
                    value={(field.options ?? []).join(', ')}
                    onChange={(e) =>
                      setCustomization((prev) =>
                        prev.map((f, i) =>
                          i === index
                            ? {
                                ...f,
                                options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              }
                            : f
                        )
                      )
                    }
                  />
                )}
                <label className={cn('flex items-center gap-2 text-xs text-muted-foreground')}>
                  <input
                    type="checkbox"
                    checked={!!field.required}
                    onChange={(e) =>
                      setCustomization((prev) =>
                        prev.map((f, i) => (i === index ? { ...f, required: e.target.checked } : f))
                      )
                    }
                  />
                  Required
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push('/admin/products')}>
          Cancel
        </Button>
        <Button onClick={save} disabled={busy}>
          {busy ? 'Saving…' : product ? 'Save changes' : 'Create product'}
        </Button>
      </div>
    </div>
  )
}

export default ProductForm
