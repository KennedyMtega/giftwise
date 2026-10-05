'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FolderTree, Plus, Trash2, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GiftCategory } from '@/data/categories'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<GiftCategory[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [editing, setEditing] = useState<GiftCategory | null>(null)
  const [form, setForm] = useState({ name: '', short: '', description: '', image: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = () =>
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ])
      .then(([cats, prods]) => {
        setCategories(cats)
        const tally: Record<string, number> = {}
        for (const p of prods) tally[p.category] = (tally[p.category] ?? 0) + 1
        setCounts(tally)
      })
      .catch(() => {})

  useEffect(() => {
    load()
  }, [])

  const startEdit = (category: GiftCategory) => {
    setEditing(category)
    setForm({
      name: category.name,
      short: category.short,
      description: category.description,
      image: category.image ?? '',
    })
    setError('')
  }

  const reset = () => {
    setEditing(null)
    setForm({ name: '', short: '', description: '', image: '' })
    setError('')
  }

  const uploadImage = async (file: File) => {
    const data = new FormData()
    data.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: data })
    const body = await res.json()
    if (res.ok) setForm((prev) => ({ ...prev, image: body.url }))
    else setError(body.error || 'Upload failed')
  }

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        short: form.short.trim() || form.name.trim(),
        description: form.description,
        image: form.image || undefined,
      }
      if (!payload.name) throw new Error('Name is required')
      const res = await fetch(editing ? `/api/categories/${editing.id}` : '/api/categories', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
      reset()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (category: GiftCategory) => {
    const count = counts[category.name] ?? 0
    if (count > 0) {
      alert(`Cannot delete “${category.name}” — ${count} product(s) still use it.`)
      return
    }
    if (!confirm(`Delete category “${category.name}”?`)) return
    const res = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' })
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== category.id))
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Occasions shown on the storefront. Products reference these by name.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Short</th>
                  <th className="p-3">Products</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b last:border-0">
                    <td className="p-3">
                      <span className="relative block h-10 w-14 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={category.image || `/images/categories/${category.id}.jpg`}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </span>
                    </td>
                    <td className="p-3 font-medium">{category.name}</td>
                    <td className="p-3 text-muted-foreground">{category.short}</td>
                    <td className="p-3">{counts[category.name] ?? 0}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(category)}>
                          Edit
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete ${category.name}`}
                          onClick={() => remove(category)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{editing ? `Edit ${editing.short}` : 'New category'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {error ? (
              <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Name</Label>
              <Input id="c-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Eid Gifts" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-short">Short label</Label>
              <Input id="c-short" value={form.short} onChange={(e) => setForm((p) => ({ ...p, short: e.target.value }))} placeholder="Eid" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-desc">Description</Label>
              <textarea
                id="c-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Cover image</Label>
              <div className="flex items-center gap-2">
                <span className="relative h-12 w-16 overflow-hidden rounded-md border bg-muted">
                  {form.image || `/images/categories/${editing?.id ?? ''}.jpg` ? (
                    <Image
                      src={form.image || `/images/categories/${editing?.id ?? ''}.jpg`}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <FolderTree className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                  )}
                </span>
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm transition-colors hover:border-primary/50">
                  <Upload className="h-4 w-4" aria-hidden /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadImage(file)
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={save} disabled={busy} className="flex-1">
                {busy ? 'Saving…' : editing ? 'Save' : 'Create'}
              </Button>
              {editing ? (
                <Button variant="outline" onClick={reset}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
