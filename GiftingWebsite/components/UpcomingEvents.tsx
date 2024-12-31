import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const mockEvents = [
  { id: '1', name: "Mom's Birthday", date: '2023-05-15' },
  { id: '2', name: "Wedding Anniversary", date: '2023-06-22' },
  { id: '3', name: "Father's Day", date: '2023-06-18' },
]

const UpcomingEvents = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
      <div className="grid gap-4">
        {mockEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Link href={`/events/${event.id}`} className="hover:underline">
                  {event.name}
                </Link>
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{event.date}</div>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/gifts">Find a Gift</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default UpcomingEvents

