import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data - in a real app, this would come from an API
const giftPackages = [
  { id: '1', name: 'Birthday Surprise', price: 49.99, image: '/placeholder.svg?height=300&width=400', description: 'A perfect package to surprise your loved ones on their special day. Includes a birthday cake, balloons, and a personalized card.' },
  { id: '2', name: 'Anniversary Special', price: 79.99, image: '/placeholder.svg?height=300&width=400', description: 'Celebrate your love with this romantic package. Includes a bottle of champagne, chocolate-covered strawberries, and a bouquet of roses.' },
  { id: '3', name: 'Graduation Celebration', price: 59.99, image: '/placeholder.svg?height=300&width=400', description: 'Congratulate the graduate with this thoughtful package. Includes a customized diploma frame, a gift card, and a inspirational book.' },
]

export default function GiftPackagePage({ params }: { params: { id: string } }) {
  const giftPackage = giftPackages.find(pkg => pkg.id === params.id)

  if (!giftPackage) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{giftPackage.name}</CardTitle>
          <CardDescription>Gift Package Details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Image
            src={giftPackage.image}
            alt={giftPackage.name}
            width={400}
            height={300}
            className="w-full h-auto rounded-lg"
          />
          <p className="text-lg">{giftPackage.description}</p>
          <p className="text-2xl font-bold text-primary">${giftPackage.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">Add to Cart</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

