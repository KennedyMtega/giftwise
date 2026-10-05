'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/context/AuthContext'

const PREFS_KEY = 'gw_prefs'

const defaultPrefs = {
  orderEmails: true,
  newsletter: true,
  priceDrops: false,
  reducedMotion: false,
}

export default function DashboardSettingsPage() {
  const { session, signOut } = useAuth()
  const router = useRouter()
  const [prefs, setPrefs] = useState(defaultPrefs)
  const [userId, setUserId] = useState<string | null>(null)
  const [passwords, setPasswords] = useState({ next: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY)
      if (raw) setPrefs({ ...defaultPrefs, ...JSON.parse(raw) })
    } catch {}
    if (session) {
      fetch(`/api/users?email=${encodeURIComponent(session.email)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((user) => user && setUserId(user.id))
        .catch(() => {})
    }
  }, [session])

  const toggle = (key: keyof typeof defaultPrefs, value: boolean) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(PREFS_KEY, JSON.stringify(next))
      return next
    })
  }

  const changePassword = async () => {
    setMessage('')
    setError('')
    if (passwords.next.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (passwords.next !== passwords.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!userId) {
      setError('Could not locate your account record.')
      return
    }
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwords.next }),
    })
    if (!res.ok) {
      setError('Could not update the password.')
      return
    }
    setPasswords({ next: '', confirm: '' })
    setMessage('Password updated.')
  }

  const deleteAccount = async () => {
    if (!session || !userId) return
    if (!confirm('Delete your account? Your profile will be removed (orders stay for the record).')) {
      return
    }
    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    if (res.ok) {
      signOut()
      router.push('/')
    } else {
      setError('Could not delete the account.')
    }
  }

  if (!session) return null

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              ['orderEmails', 'Order updates', 'Email me when an order ships or is delivered.'],
              ['newsletter', 'Newsletter', 'Seasonal drops and gifting ideas.'],
              ['priceDrops', 'Price drops', 'Tell me when wishlist items go on sale.'],
              ['reducedMotion', 'Reduce motion', 'Minimize animations across the store.'],
            ] as const
          ).map(([key, label, description]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor={key} className="text-sm font-medium">
                  {label}
                </Label>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Switch
                id={key}
                checked={prefs[key]}
                onCheckedChange={(value) => toggle(key, value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {message ? (
              <p className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
                {message}
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwords.next}
                onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              />
            </div>
            <Button onClick={changePassword}>Update password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                signOut()
                router.push('/')
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
            <Button variant="destructive" onClick={deleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
