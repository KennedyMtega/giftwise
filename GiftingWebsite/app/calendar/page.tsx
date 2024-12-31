'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil, Trash2, Share2 } from 'lucide-react'

interface Event {
  id: string
  name: string
  date: Date
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([
    { id: '1', name: "Mom's Birthday", date: new Date(2023, 4, 15) },
    { id: '2', name: "Wedding Anniversary", date: new Date(2023, 5, 22) },
    { id: '3', name: "Father's Day", date: new Date(2023, 5, 18) },
  ])
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Event>({ id: '', name: '', date: new Date() })
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const selectedDateEvents = events.filter(
    (event) => event.date.toDateString() === date?.toDateString()
  )

  const handleAddEvent = () => {
    if (newEvent.name && newEvent.date) {
      if (editingEvent) {
        setEvents(events.map(event => event.id === editingEvent.id ? { ...newEvent, id: editingEvent.id } : event))
        setEditingEvent(null)
      } else {
        setEvents([...events, { ...newEvent, id: Date.now().toString() }])
      }
      setNewEvent({ id: '', name: '', date: new Date() })
      setIsAddEventOpen(false)
    }
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id))
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setNewEvent(event)
    setIsAddEventOpen(true)
  }

  const handleShareEvent = (event: Event) => {
    // In a real app, this would open a share dialog or copy a link to clipboard
    alert(`Sharing event: ${event.name} on ${event.date.toDateString()}`)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold text-primary mb-8">Gift Calendar</h1>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <Button onClick={() => {setIsAddEventOpen(true); setEditingEvent(null)}} className="mt-4">
          Add Event
        </Button>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Events on {date?.toDateString()}</h2>
        {selectedDateEvents.length > 0 ? (
          <div className="space-y-4">
            {selectedDateEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {event.name}
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleShareEvent(event)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Date: {event.date.toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No events on this date.</p>
        )}
      </div>

      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-name" className="text-right">
                Name
              </Label>
              <Input
                id="event-name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-date" className="text-right">
                Date
              </Label>
              <Input
                id="event-date"
                type="date"
                value={newEvent.date.toISOString().split('T')[0]}
                onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddEvent}>{editingEvent ? 'Update Event' : 'Add Event'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

