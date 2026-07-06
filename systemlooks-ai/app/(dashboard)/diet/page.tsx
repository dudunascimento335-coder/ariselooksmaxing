import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLastAnalysisAttributes } from "@/lib/getLastAnalysis";
import { generateDietPlan } from "@/lib/recommendations";
import { GlassCard } from "@/components/ui/GlassCard";

export default async function DietPage() {
  const session = await getServerSession(authOptions);
  const attributes = await getLastAnalysisAttributes(session!.user.id);
  const plan = generateDietPlan(attributes);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dieta</h1>
      <p className="mt-1 text-white/45">Objetivo estimado: {plan.goal}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard>
          <p className="text-xs uppercase text-white/40">Calorias</p>
          <p className="mt-1 font-display text-xl font-bold text-neon-blue-bright">{plan.calories}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase text-white/40">Macros</p>
          <p className="mt-1 text-sm text-white/70">
            P {plan.macros.protein} · C {plan.macros.carbs} · G {plan.macros.fat}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase text-white/40">Água</p>
          <p className="mt-1 font-display text-xl font-bold text-neon-purple-bright">{plan.water}</p>
        </GlassCard>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-white/50">
          Horários sugeridos
        </h2>
        <div className="space-y-2">
          {plan.meals.map((m) => (
            <div key={m.time} className="glass flex items-center justify-between rounded-lg p-4">
              <div className="flex items-center gap-4">
                <span className="font-display text-sm font-bold text-neon-blue-bright">{m.time}</span>
                <span className="text-sm font-medium text-white/80">{m.meal}</span>
              </div>
              <span className="text-sm text-white/40">{m.suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-white/50">
          Suplementação (sugestões)
        </h2>
        <ul className="space-y-2">
          {plan.supplementation.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-white/60">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-neon-blue-bright" />
              {s}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/30">
          Sugestões gerais e não substituem orientação de nutricionista ou médico.
        </p>
      </div>
    </div>
  );
}
