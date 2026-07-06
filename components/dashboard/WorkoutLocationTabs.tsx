'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/ui/GlassCard'

type WorkoutPlan = {
  level: string
  progression: string
  days: { name: string; exercises: string[] }[]
}

export function WorkoutLocationTabs({
  homePlan,
  gymPlan,
}: {
  homePlan: WorkoutPlan
  gymPlan: WorkoutPlan
}) {
  const [location, setLocation] = useState<'casa' | 'academia'>('casa')
  const plan = location === 'casa' ? homePlan : gymPlan

  return (
    <div className="mt-6">
      <div className="flex gap-2 rounded-lg bg-white/5 p-1">
        {(['casa', 'academia'] as const).map((loc) => (
          <button
            key={loc}
            onClick={() => setLocation(loc)}
            className={cn(
              'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
              location === loc
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                : 'text-white/60 hover:text-white'
            )}
          >
            {loc === 'casa' ? 'Em Casa' : 'Academia'}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {plan.days.map((day) => (
          <GlassCard key={day.name}>
            <p className="font-display font-bold text-neon-blue-bright">{day.name}</p>
            <ul className="mt-2 space-y-1">
              {day.exercises.map((ex) => (
                <li key={ex} className="text-sm text-white/60">
                  {ex}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
