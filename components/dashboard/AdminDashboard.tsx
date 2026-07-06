'use client'

import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { formatCurrencyBRL } from '@/lib/utils'

type Stats = {
  totalUsers: number
  activeSubscriptions: number
  totalAnalyses: number
  totalRevenueInCents: number
  recentPayments: { user: { name: string; email: string }; amountInCents: number; createdAt: string }[]
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="mt-6 text-white/50">Carregando estatísticas...</p>
  }

  if (!stats) {
    return <p className="mt-6 text-rose-400">Erro ao carregar estatísticas.</p>
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-xs uppercase text-white/40">Usuários</p>
          <p className="mt-2 font-display text-2xl font-bold">{stats.totalUsers}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase text-white/40">Assinaturas Ativas</p>
          <p className="mt-2 font-display text-2xl font-bold text-neon-blue-bright">{stats.activeSubscriptions}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase text-white/40">Análises Totais</p>
          <p className="mt-2 font-display text-2xl font-bold">{stats.totalAnalyses}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase text-white/40">Receita Total</p>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-400">{formatCurrencyBRL(stats.totalRevenueInCents)}</p>
        </GlassCard>
      </div>

      <GlassCard>
        <p className="mb-4 font-display font-bold">Pagamentos Recentes</p>
        <div className="space-y-2">
          {stats.recentPayments.map((p, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <div>
                <p className="font-medium">{p.user.name}</p>
                <p className="text-xs text-white/40">{p.user.email}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400">{formatCurrencyBRL(p.amountInCents)}</p>
                <p className="text-xs text-white/40">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
