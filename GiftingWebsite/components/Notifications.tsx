import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Gift, CreditCard, Calendar } from 'lucide-react'

const notifications = [
  { id: 1, type: 'gift', message: "Your gift for Mom's birthday has been shipped!", date: '2023-05-15' },
  { id: 2, type: 'payment', message: 'Payment received from John for group gift', date: '2023-05-14' },
  { id: 3, type: 'reminder', message: "Don't forget Dad's anniversary next week!", date: '2023-05-13' },
  { id: 4, type: 'gift', message: 'New gift suggestions for your wishlist', date: '2023-05-12' },
  { id: 5, type: 'payment', message: 'Your monthly gift budget report is ready', date: '2023-05-11' },
]

const getIcon = (type: string) => {
  switch (type) {
    case 'gift': return <Gift className="h-4 w-4" />
    case 'payment': return <CreditCard className="h-4 w-4" />
    case 'reminder': return <Calendar className="h-4 w-4" />
    default: return <Bell className="h-4 w-4" />
  }
}

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-4 mb-4">
              <div className="mt-1">{getIcon(notification.type)}</div>
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.date}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

