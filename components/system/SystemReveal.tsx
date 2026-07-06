'use client'

import { motion } from 'framer-motion'
import { AttributeResult } from '@/lib/attributes'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { GlassCard } from '@/components/ui/GlassCard'

export function SystemReveal({
  overallScore,
  attributes,
}: {
  overallScore: number
  attributes: AttributeResult[]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-white/40">Pontuação Geral</p>
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mt-4 font-display text-6xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent"
        >
          {overallScore}
          <span className="text-2xl text-white/40">/100</span>
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {attributes.map((attr) => (
          <GlassCard key={attr.name}>
            <div className="flex items-center justify-between">
              <p className="font-medium">{attr.name}</p>
              <p className="font-display font-bold text-neon-blue-bright">{attr.score}</p>
            </div>
            <ProgressBar value={attr.score} className="mt-3" />
            <ul className="mt-3 space-y-1">
              {attr.tips.map((tip) => (
                <li key={tip} className="text-xs text-white/50">• {tip}</li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  )
}
