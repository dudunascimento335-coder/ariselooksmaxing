import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrencyBRL, xpForLevel } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [user, subscription, lastAnalysis, analysisCount] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.analysis.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.analysis.count({ where: { userId } }),
  ]);

  const planName = subscription?.plan.name ?? "Gratuito";
  const remaining = subscription
    ? subscription.plan.analysisLimit === -1
      ? "Ilimitadas"
      : Math.max(0, subscription.plan.analysisLimit - subscription.analysesUsedThisCycle)
    : user.freeAnalysisUsed
    ? 0
    : 1;

  const xpNeeded = xpForLevel(user.level);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Olá, {user.name.split(" ")[0]}.</h1>
      <p className="mt-1 text-white/45">Bem-vindo ao seu Sistema.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-white/40">Nível</p>
          <p className="mt-2 font-display text-3xl font-bold text-neon-blue-bright">{user.level}</p>
          <div className="mt-3">
            <ProgressBar value={(user.xp / xpNeeded) * 100} />
            <p className="mt-1 text-xs text-white/30">{user.xp} / {xpNeeded} XP</p>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-white/40">Plano atual</p>
          <p className="mt-2 font-display text-2xl font-bold">{planName}</p>
          {subscription && (
            <p className="mt-1 text-xs text-white/30">
              {formatCurrencyBRL(subscription.plan.priceInCents)}/mês
            </p>
          )}
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-white/40">Análises restantes</p>
          <p className="mt-2 font-display text-2xl font-bold text-neon-purple-bright">{remaining}</p>
          <p className="mt-1 text-xs text-white/30">{analysisCount} realizadas no total</p>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-white/40">Última análise</p>
          <p className="mt-2 font-display text-2xl font-bold">
            {lastAnalysis ? `${lastAnalysis.overallScore}/100` : "—"}
          </p>
          <p className="mt-1 text-xs text-white/30">
            {lastAnalysis ? new Date(lastAnalysis.createdAt).toLocaleDateString("pt-BR") : "Nenhuma ainda"}
          </p>
        </GlassCard>
      </div>

      <div className="mt-10">
        <Link
          href="/system"
          className="glass-strong flex items-center justify-between rounded-2xl border-neon-blue/30 p-6 transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-display font-bold">Nova Análise</p>
              <p className="text-sm text-white/45">Envie uma foto e ative seu Sistema.</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-white/40" />
        </Link>
      </div>
    </div>
  );
}
