'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type MissionData = {
  id: string
  title: string
  description: string
  xpReward: number
  completed: boolean
}

export function MissionsBoard({ initialMissions }: { initialMissions: MissionData[] }) {
  const [missions, setMissions] = useState(initialMissions)

  async function toggleMission(id: string) {
    const res = await fetch('/api/missions/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId: id }),
    })
    if (res.ok) {
      setMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
      )
    }
  }

  return (
    <div className="mt-6 space-y-3">
      {missions.map((m) => (
        <motion.button
          key={m.id}
          onClick={() => toggleMission(m.id)}
          className={cn(
            'glass flex w-full items-center justify-between rounded-xl p-4 text-left transition-all',
            m.completed && 'border-emerald-500/30 bg-emerald-500/5'
          )}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border',
                m.completed
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-white/20'
              )}
            >
              {m.completed && <Check className="h-3 w-3" />}
            </div>
            <div>
              <p className={cn('font-medium', m.completed && 'text-white/60')}>{m.title}</p>
              <p className="text-xs text-white/40">{m.description}</p>
            </div>
          </div>
          <span className="text-sm font-bold text-neon-purple-bright">+{m.xpReward} XP</span>
        </motion.button>
      ))}
    </div>
  )
}
