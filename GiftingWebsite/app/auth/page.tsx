'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ShieldCheck, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/context/AuthContext'

export default function AuthPage() {
  const router = useRouter()
  const { session, ready, signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [returnTo, setReturnTo] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setReturnTo(params.get('returnTo') || '')
  }, [])

  const destination = (role?: string) =>
    returnTo || (role === 'admin' ? '/admin' : '/dashboard')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
      router.push(destination())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setBusy(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signUp(name, email, password)
      router.push(destination())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setBusy(false)
    }
  }

  if (ready && session) {
    return (
      <div className="flex min-h-[60vh] justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>You&apos;re signed in</CardTitle>
            <CardDescription>
              {session.name} · {session.email} ({session.role})
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => router.push(destination(session.role))}>
              Continue to {session.role === 'admin' ? 'admin panel' : 'your dashboard'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-8">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to GiftWise</CardTitle>
            <CardDescription>Sign in or create an account to start gifting</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <p
                role="alert"
                className="mb-3 flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </p>
            ) : null}
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={busy}>
                    {busy ? 'Signing in…' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      placeholder="Enter your email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      placeholder="Create a password (min 6 characters)"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={busy}>
                    {busy ? 'Creating account…' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Demo accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors hover:border-primary/50"
              onClick={() => {
                setEmail('admin@giftwise.test')
                setPassword('admin123')
              }}
            >
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>
                <span className="font-medium text-foreground">Admin</span> — admin@giftwise.test /
                admin123
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors hover:border-primary/50"
              onClick={() => {
                setEmail('demo@giftwise.test')
                setPassword('demo123')
              }}
            >
              <User className="h-4 w-4 text-primary" />
              <span>
                <span className="font-medium text-foreground">Customer</span> — demo@giftwise.test /
                demo123
              </span>
            </button>
            <p className="text-xs">Tap a demo account to fill the sign-in form.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
