import { MostPurchased } from '@/components/MostPurchased'

export default function MostPurchasedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Most Purchased Items</h1>
      <MostPurchased />
    </div>
  )
}

