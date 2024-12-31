import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

const mockGiftPackages = [
  { id: '1', name: 'Birthday Surprise', price: 49.99, image: '/placeholder.svg?height=200&width=300' },
  { id: '2', name: 'Anniversary Special', price: 79.99, image: '/placeholder.svg?height=200&width=300' },
  { id: '3', name: 'Graduation Celebration', price: 59.99, image: '/placeholder.svg?height=200&width=300' },
]

const FeaturedGiftPackages = () => {
  const { addToCart } = useCart()
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured Gift Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGiftPackages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <Image
                src={pkg.image}
                alt={pkg.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent>
              <CardTitle>{pkg.name}</CardTitle>
              <p className="text-2xl font-bold text-primary mt-2">${pkg.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => addToCart({ id: pkg.id, name: pkg.name, price: pkg.price, quantity: 1, image: pkg.image })}
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default FeaturedGiftPackages

