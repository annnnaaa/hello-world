import { format } from 'date-fns'
import { Sun, CloudSun, Moon } from 'lucide-react'
import { Card } from '@/components/ui/Card'

function getGreeting(): { text: string; Icon: React.ElementType } {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', Icon: Sun }
  if (hour < 18) return { text: 'Good afternoon', Icon: CloudSun }
  return { text: 'Good evening', Icon: Moon }
}

interface TodayCardProps {
  name?: string
  tasksToday: number
  completedToday: number
}

export function TodayCard({ name, tasksToday, completedToday }: TodayCardProps) {
  const { text, Icon } = getGreeting()
  const today = format(new Date(), 'EEEE, MMMM d')

  return (
    <Card className="bg-gradient-to-br from-brand-500 to-brand-700 border-0 text-white" padding="lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4 text-brand-200" />
            <span className="text-sm text-brand-200">{today}</span>
          </div>
          <h2 className="text-xl font-bold">
            {text}{name ? `, ${name.split(' ')[0]}` : ''}
          </h2>
          <p className="text-brand-200 text-sm mt-1">
            {tasksToday === 0
              ? 'Your slate is clear today'
              : completedToday === tasksToday
              ? `All ${tasksToday} tasks done — great work!`
              : `${completedToday}/${tasksToday} tasks done today`}
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold">{tasksToday > 0 ? `${completedToday}` : '✓'}</div>
          {tasksToday > 0 && <div className="text-xs text-brand-200">of {tasksToday}</div>}
        </div>
      </div>

      {tasksToday > 0 && (
        <div className="mt-4">
          <div className="h-1.5 bg-brand-400/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${(completedToday / tasksToday) * 100}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
