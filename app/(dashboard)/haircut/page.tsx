import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLastAnalysisFull } from "@/lib/getLastAnalysis";
import { GlassCard } from "@/components/ui/GlassCard";
import { Scissors } from "lucide-react";
import Link from "next/link";

export default async function HaircutPage() {
  const session = await getServerSession(authOptions);
  const analysis = await getLastAnalysisFull(session!.user.id);
  const suggestions = (analysis?.haircutSuggestions as { name: string; explanation: string }[]) ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Corte de Cabelo</h1>
      <p className="mt-1 text-white/45">Sugestões baseadas no formato do seu rosto.</p>

      {suggestions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {suggestions.map((s) => (
            <GlassCard key={s.name}>
              <Scissors className="h-5 w-5 text-neon-blue-bright" />
              <p className="mt-3 font-display font-bold">{s.name}</p>
              <p className="mt-1 text-sm text-white/50">{s.explanation}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass mt-8 rounded-2xl p-10 text-center">
      <p className="text-white/50">Faça uma análise para receber sugestões personalizadas de corte.</p>
      <Link href="/system" className="btn-primary mt-4 inline-flex">Nova Análise</Link>
    </div>
  );
}
