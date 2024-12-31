import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const settingsOptions = [
  { id: 'emailNotifications', label: 'Email Notifications' },
  { id: 'pushNotifications', label: 'Push Notifications' },
  { id: 'giftReminders', label: 'Gift Reminders' },
  { id: 'publicProfile', label: 'Public Profile' },
  { id: 'twoFactorAuth', label: 'Two-Factor Authentication' },
]

export function Settings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {settingsOptions.map((option) => (
          <div key={option.id} className="flex items-center justify-between py-2">
            <Label htmlFor={option.id}>{option.label}</Label>
            <Switch id={option.id} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

