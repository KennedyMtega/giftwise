import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'

const mostPurchasedItems = [
  { id: 1, name: 'Birthday Cake', count: 5, image: '/placeholder.svg?height=50&width=50' },
  { id: 2, name: 'Flower Bouquet', count: 4, image: '/placeholder.svg?height=50&width=50' },
  { id: 3, name: 'Chocolate Box', count: 3, image: '/placeholder.svg?height=50&width=50' },
  { id: 4, name: 'Gift Card', count: 3, image: '/placeholder.svg?height=50&width=50' },
  { id: 5, name: 'Scented Candles', count: 2, image: '/placeholder.svg?height=50&width=50' },
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

