import { CategoryCard } from '@/components/CategoryCard'
import { TypeCard } from '@/components/TypeCard'
import { SectionHeading } from '@/components/SectionHeading'
import { giftTypes } from '@/data/categories'
import { readDb } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const db = await readDb()
  const categories = db.categories
  const counts: Record<string, number> = db.products.reduce(
    (acc, product) => ({ ...acc, [product.category]: (acc[product.category] ?? 0) + 1 }),
    {} as Record<string, number>
  )
  const typeCounts = (typeId: string) =>
    db.products.filter((product) => product.type === typeId).length

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="rounded-2xl bg-[#000068] px-5 py-8 text-white sm:px-8 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {categories.length} occasions · {db.products.length} gifts
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Shop by Occasion
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
          Every moment worth celebrating, from first birthdays to final farewells. Pick the
          occasion and we will show you gifts that fit it.
        </p>
      </header>

      <section>
        <SectionHeading
          title="All occasions"
          subtitle="Tap a card to see every gift we have for that moment."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} count={counts[category.name] ?? 0} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title="All gift types"
          subtitle="Browse by what the gift is, not just who it is for."
          href="/gifts"
          linkLabel="Browse all gifts"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {giftTypes.map((type) => (
            <TypeCard key={type.id} type={type} count={typeCounts(type.id)} />
          ))}
        </div>
      </section>
    </div>
  )
}
