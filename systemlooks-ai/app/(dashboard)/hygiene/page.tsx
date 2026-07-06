import { generateHygieneChecklist } from "@/lib/recommendations";
import { GlassCard } from "@/components/ui/GlassCard";

export default function HygienePage() {
  const checklist = generateHygieneChecklist();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Higiene</h1>
      <p className="mt-1 text-white/45">Hábitos essenciais para manter sua melhor versão.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {checklist.map((c) => (
          <GlassCard key={c.item}>
            <p className="font-semibold text-white/85">{c.item}</p>
            <p className="mt-1 text-sm text-white/45">{c.detail}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
