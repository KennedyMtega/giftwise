import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

// Mock data - in a real app, this would come from an API
const events = [
  { id: '1', name: "Mom's Birthday", date: '2023-05-15', description: "Celebrate mom's special day with love and appreciation." },
  { id: '2', name: "Wedding Anniversary", date: '2023-06-22', description: "Commemorate another year of love and partnership." },
  { id: '3', name: "Father's Day", date: '2023-06-18', description: "Honor dad and show gratitude for all he does." },
]

export default function EventPage({ params }: { params: { id: string } }) {
  const event = events.find(e => e.id === params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{event.name}</CardTitle>
          <CardDescription>Event Details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <p className="text-lg">{event.description}</p>
          <p className="text-2xl font-bold">Date: {event.date}</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" size="lg">
            <Link href="/gifts">Find a Gift</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

