import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <p className="text-center mb-4">
            An email confirmation has been sent to your email address.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

