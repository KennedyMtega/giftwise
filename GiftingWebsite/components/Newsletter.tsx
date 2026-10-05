'use client'

import { useState } from 'react'
import { Check, Gift, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <section className="rounded-2xl bg-[#000068] p-5 text-white shadow-sm sm:p-8">
      <div className="grid gap-5 md:grid-cols-2 md:items-center md:gap-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            <Gift className="h-3.5 w-3.5" /> GiftWise Club
          </span>
          <h2 className="mt-3 text-xl font-bold sm:text-2xl">
            Get $10 off your first gift
          </h2>
          <p className="mt-2 text-sm text-white/75 sm:text-base">
            Seasonal drop alerts, wrapping ideas and members-only offers. No spam, unsubscribe
            any time.
          </p>
        </div>

        {subscribed ? (
          <div
            role="status"
            className="flex min-h-12 items-center gap-2 rounded-md bg-white/10 px-4 text-sm font-medium sm:text-base"
          >
            <Check className="h-5 w-5 shrink-0 text-gold" aria-hidden />
            You&apos;re on the list — check your inbox for your code.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="h-12 w-full border-0 bg-background pl-9 text-base"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full bg-gold font-semibold text-[#000068] shadow-none hover:bg-gold/90 sm:w-auto"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Newsletter
