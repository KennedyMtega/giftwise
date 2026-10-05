'use client'

import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'

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
import type { StoreUser } from '@/lib/server/store'

const EMPTY = { name: '', email: '', password: '', role: 'customer', phone: '', address: '' }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StoreUser[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = () =>
    fetch('/api/users')
      .then((r) => r.json())
      .then((list: StoreUser[]) => setUsers(list))
      .catch(() => {})

  useEffect(() => {
    load()
  }, [])

  const startEdit = (user: StoreUser) => {
    setEditingId(user.id)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone ?? '',
      address: user.address ?? '',
    })
    setError('')
  }

  const reset = () => {
    setEditingId(null)
    setForm(EMPTY)
    setError('')
  }

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      if (!form.name.trim() || !form.email.trim()) throw new Error('Name and email are required')
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        phone: form.phone,
        address: form.address,
      }
      if (form.password) payload.password = form.password
      if (editingId) {
        const res = await fetch(`/api/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
      } else {
        if (!form.password) throw new Error('Password is required for new users')
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Create failed')
      }
      reset()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (user: StoreUser) => {
    if (!confirm(`Delete user ${user.name} (${user.email})?`)) return
    const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== user.id))
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Customer and staff accounts. Roles control dashboard vs admin access.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-muted-foreground">{user.email}</td>
                    <td className="p-3">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{user.joined}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" aria-label={`Edit ${user.name}`} onClick={() => startEdit(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" aria-label={`Delete ${user.name}`} onClick={() => remove(user)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      <Users className="mx-auto mb-2 h-8 w-8" aria-hidden />
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit user' : 'New user'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {error ? (
              <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="u-name">Name</Label>
              <Input id="u-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-email">Email</Label>
              <Input id="u-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-password">{editingId ? 'New password (optional)' : 'Password'}</Label>
              <Input id="u-password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(value) => setForm((p) => ({ ...p, role: value }))}>
                <SelectTrigger aria-label="Role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-phone">Phone</Label>
              <Input id="u-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-address">Address</Label>
              <Input id="u-address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={save} disabled={busy} className="flex-1">
                {busy ? 'Saving…' : editingId ? 'Save' : 'Create'}
              </Button>
              {editingId ? (
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
