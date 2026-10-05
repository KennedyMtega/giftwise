import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'

const mostPurchasedItems = [
  { id: 1, name: 'Birthday Cake', count: 5, image: '/images/types/sweets.jpg' },
  { id: 2, name: 'Flower Bouquet', count: 4, image: '/images/types/flowers.jpg' },
  { id: 3, name: 'Chocolate Box', count: 3, image: '/images/products/g2.jpg' },
  { id: 4, name: 'Gift Card', count: 3, image: '/images/types/experiences.jpg' },
  { id: 5, name: 'Scented Candles', count: 2, image: '/images/products/g5.jpg' },
]

export function MostPurchased() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Purchased</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {mostPurchasedItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 mb-4">
              <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md" />
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-muted-foreground">Purchased {item.count} times</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

