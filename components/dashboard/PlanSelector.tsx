'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrencyBRL } from '@/lib/utils'

const PLANS = [
  {
    tier: 'STARTER',
    name: 'Starter',
    price: 2900,
    description: 'Para começar sua jornada',
    features: ['5 análises/mês', 'Recomendações básicas', 'Suporte por email'],
  },
  {
    tier: 'PRO',
    name: 'Pro',
    price: 5900,
    description: 'Para evolução séria',
    features: ['20 análises/mês', 'Todas as recomendações', 'Missões diárias + XP', 'Suporte prioritário'],
    popular: true,
  },
  {
    tier: 'ELITE',
    name: 'Elite',
    price: 9900,
    description: 'Acesso total ao Sistema',
    features: ['Análises ilimitadas', 'API dedicada', 'Consultoria mensal', 'Suporte 24/7'],
  },
]

export function PlanSelector({ currentTier }: { currentTier: string | null }) {
  const [loading, setLoading] = useState<string | null>(null)

  async function selectPlan(tier: string) {
    setLoading(tier)
    await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier }),
    })
    setLoading(null)
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      {PLANS.map((plan) => (
        <motion.div
          key={plan.tier}
          className={cn(
            'glass-strong relative rounded-2xl p-6 transition-transform hover:scale-[1.02]',
            plan.popular && 'border-neon-blue/50'
          )}
        >
          {plan.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-3 py-1 text-xs font-bold">
              Mais Popular
            </span>
          )}

          <p className="font-display text-lg font-bold">{plan.name}</p>
          <p className="mt-1 text-sm text-white/50">{plan.description}</p>

          <p className="mt-4 font-display text-3xl font-bold">
            {formatCurrencyBRL(plan.price)}
            <span className="text-base font-normal text-white/40">/mês</span>
          </p>

          <ul className="mt-6 space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                <Check className="h-4 w-4 text-neon-blue-bright" />
                {f}
              </li>
            ))}
          </ul>

          <button
            disabled={loading !== null || currentTier === plan.tier}
            onClick={() => selectPlan(plan.tier)}
            className={cn(
              'mt-6 w-full rounded-lg py-3 font-semibold transition-all',
              currentTier === plan.tier
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'btn-primary'
            )}
          >
            {currentTier === plan.tier
              ? 'Plano Atual'
              : loading === plan.tier
                ? 'Processando...'
                : 'Assinar'}
          </button>
        </motion.div>
      ))}
    </div>
  )
}
