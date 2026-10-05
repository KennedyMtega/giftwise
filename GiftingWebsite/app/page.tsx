import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Gift, RefreshCcw, ShieldCheck, Star, Truck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CategoryCard } from '@/components/CategoryCard'
import { TypeCard } from '@/components/TypeCard'
import FeaturedGiftPackages from '@/components/FeaturedGiftPackages'
import { Newsletter } from '@/components/Newsletter'
import { SectionHeading } from '@/components/SectionHeading'
import { categories, giftTypes } from '@/data/categories'
import { categoryCounts } from '@/data/products'

const perks = [
  { icon: Gift, title: 'Free Gift Wrapping', copy: 'Ribbon, tissue and a handwritten note.' },
  { icon: Truck, title: 'Same-Day Delivery', copy: 'Order before 2pm, seven days a week.' },
  { icon: ShieldCheck, title: 'Secure Payment', copy: 'Encrypted checkout on every order.' },
  { icon: RefreshCcw, title: '30-Day Returns', copy: 'Changed your mind? Send it back free.' },
]

const stats = [
  { value: '60+', label: 'Gifts in stock' },
  { value: '18', label: 'Occasions' },
  { value: '13', label: 'Gift types' },
  { value: '12k+', label: 'Happy gifters' },
]

const reviewers = ['AR', 'JM', 'PS', 'LK']

export default function Home() {
  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Hero + trust strip */}
      <section className="overflow-hidden rounded-3xl bg-[#000068] text-white">
        <div className="px-4 pb-8 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pb-10 lg:pt-20">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium sm:text-sm">
                <Star className="h-3.5 w-3.5 fill-current text-gold" aria-hidden /> 4.8 average from
                3,200 reviews
              </span>

              <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                The Right Gift,
                <br />
                <span className="text-gold">Every Single Time.</span>
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base lg:mx-0">
                Sixty curated gifts across eighteen occasions and thirteen types — wrapped by
                hand and delivered the same day, so you never show up empty handed again.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full bg-gold px-7 text-base font-semibold text-[#000068] shadow-none hover:bg-gold/90 sm:w-auto"
                >
                  <Link href="/gifts">
                    Shop Now <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-white/40 bg-transparent px-7 text-base font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  <Link href="/categories">Explore Occasions</Link>
                </Button>
              </div>

              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {reviewers.map((initials) => (
                    <span
                      key={initials}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#000068] bg-white text-xs font-bold text-[#000068]"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-0.5 text-gold sm:justify-start">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-xs text-white/75 sm:text-sm">
                    12k+ happy gifters worldwide
                  </p>
                </div>
              </div>
            </div>

            {/* Gift type collage */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {giftTypes.slice(0, 6).map((type) => (
                <Link
                  key={type.id}
                  href={`/gifts?type=${type.id}`}
                  className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-white/15 p-3 transition-colors hover:border-gold/60 sm:p-4"
                >
                  <Image
                    src={type.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 16vw, 40vw"
                    className="object-cover"
                  />
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-[#000068]/90 via-[#000068]/30 to-transparent"
                    aria-hidden
                  />
                  <span className="relative text-xs font-semibold leading-tight text-white sm:text-sm">
                    {type.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 lg:mt-12 lg:grid-cols-4 lg:gap-6">
            {perks.map((perk) => (
              <div key={perk.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 sm:h-10 sm:w-10">
                  <perk.icon className="h-4 w-4 text-gold sm:h-5 sm:w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold sm:text-sm">{perk.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-white/70">
                    {perk.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by occasion */}
      <section>
        <SectionHeading
          title="Shop by Occasion"
          subtitle="Eighteen ways to say it — pick the moment and we will narrow the rest."
          href="/categories"
          linkLabel="View all categories"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.slice(0, 12).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Shop by gift type */}
      <section>
        <SectionHeading
          title="Shop by Gift Type"
          subtitle="What the present actually is — keepsakes, flowers, gadgets, hampers and more."
          href="/gifts"
          linkLabel="Browse the catalog"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {giftTypes.map((type) => (
            <TypeCard key={type.id} type={type} />
          ))}
        </div>
      </section>

      {/* Promo / stats banner */}
      <section className="rounded-2xl bg-[#000068] p-5 text-white sm:p-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              GiftWise Studio
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Wrapped by hand,
              <br />
              remembered for years.
            </h2>
            <p className="mt-3 max-w-lg text-sm text-white/75 sm:text-base">
              Every order leaves our studio tissue-wrapped, ribbon-tied and boxed with a card you
              can write yourself. Order before 2pm for same-day dispatch.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-5 h-12 w-full bg-gold px-7 text-base font-semibold text-[#000068] shadow-none hover:bg-gold/90 sm:w-auto"
            >
              <Link href="/gifts">
                Start Gifting <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>

            <dl className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/10 p-3 text-center">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-xl font-bold text-gold sm:text-2xl">{stat.value}</dd>
                  <p className="mt-0.5 text-xs text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {giftTypes.slice(6, 12).map((type) => (
              <Link
                key={type.id}
                href={`/gifts?type=${type.id}`}
                className="relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl border border-white/15 p-2.5 text-left transition-colors hover:border-gold/60 sm:p-3"
              >
                <Image
                  src={type.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw"
                  className="object-cover"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-[#000068]/90 via-[#000068]/25 to-transparent"
                  aria-hidden
                />
                <span className="relative text-xs font-semibold leading-tight text-white">
                  {type.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <FeaturedGiftPackages />

      {/* Newsletter */}
      <Newsletter />

      {/* Occasions footer strip */}
      <section className="border-t border-border pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Popular searches
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:text-sm"
            >
              {category.short} · {categoryCounts[category.name] ?? 0}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
