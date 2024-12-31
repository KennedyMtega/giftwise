import FeaturedGiftPackages from '@/components/FeaturedGiftPackages'
import UpcomingEvents from '@/components/UpcomingEvents'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Welcome to GiftWise</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6">Find the perfect gift for any occasion</p>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/categories">Explore Gift Categories</Link>
        </Button>
      </section>
      <FeaturedGiftPackages />
      <UpcomingEvents />
    </div>
  )
}

