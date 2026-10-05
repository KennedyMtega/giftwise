'use client'

import { useEffect, useState } from 'react'
import { Check, Save } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'

export default function DashboardProfilePage() {
  const { session, updateSession } = useAuth()
  const [userId, setUserId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) return
    setForm({
      name: session.name,
      email: session.email,
      phone: '',
      address: session.address ?? '',
    })
    fetch(`/api/users?email=${encodeURIComponent(session.email)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((user) => {
        if (user) {
          setUserId(user.id)
          setForm((prev) => ({
            ...prev,
            phone: user.phone ?? '',
            address: user.address ?? prev.address,
          }))
        }
      })
      .catch(() => {})
  }, [session])

  const save = async () => {
    if (!userId) {
      setError('Could not locate your account record.')
      return
    }
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
      updateSession(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  if (!session) return null

  const initials = session.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
      <Card className="h-fit">
        <CardContent className="flex flex-col items-center gap-3 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/images/profile/me.jpg" alt={session.name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold">{session.name}</p>
            <p className="text-sm text-muted-foreground">{session.email}</p>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs font-medium capitalize">
            {session.role}
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pf-name">Full name</Label>
              <Input id="pf-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-email">Email</Label>
              <Input id="pf-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-phone">Phone</Label>
              <Input id="pf-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-address">Default address</Label>
              <Input id="pf-address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="Street, City, Country" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={save} disabled={busy}>
              {saved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              {busy ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Your email is used to match orders to your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
