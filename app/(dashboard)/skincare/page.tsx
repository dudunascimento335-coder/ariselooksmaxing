import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLastAnalysisAttributes } from "@/lib/getLastAnalysis";
import { generateSkincareRoutine } from "@/lib/recommendations";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sun, Moon } from "lucide-react";

export default async function SkincarePage() {
  const session = await getServerSession(authOptions);
  const attributes = await getLastAnalysisAttributes(session!.user.id);
  const routine = generateSkincareRoutine(attributes);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Skincare</h1>
      <p className="mt-1 text-white/45">Rotina completa para manhã e noite.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-amber-300">
            <Sun className="h-4 w-4" /> <span className="font-display text-sm font-bold">Manhã</span>
          </div>
          <ol className="space-y-2">
            {routine.morning.map((step, i) => (
              <li key={step} className="flex gap-2 text-sm text-white/70">
                <span className="text-white/30">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-neon-purple-bright">
            <Moon className="h-4 w-4" /> <span className="font-display text-sm font-bold">Noite</span>
          </div>
          <ol className="space-y-2">
            {routine.night.map((step, i) => (
              <li key={step} className="flex gap-2 text-sm text-white/70">
                <span className="text-white/30">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </GlassCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <GlassCard>
          <p className="mb-2 font-display text-sm font-bold text-emerald-400">Hábitos bons</p>
          <ul className="space-y-1.5">
            {routine.goodHabits.map((h) => (
              <li key={h} className="text-sm text-white/60">✓ {h}</li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <p className="mb-2 font-display text-sm font-bold text-rose-400">Hábitos ruins</p>
          <ul className="space-y-1.5">
            {routine.badHabits.map((h) => (
              <li key={h} className="text-sm text-white/60">✕ {h}</li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
