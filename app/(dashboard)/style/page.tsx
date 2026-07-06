import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLastAnalysisFull } from "@/lib/getLastAnalysis";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export default async function StylePage() {
  const session = await getServerSession(authOptions);
  const analysis = await getLastAnalysisFull(session!.user.id);
  const style = analysis?.styleSuggestions as { palette: string[]; pieces: string[]; accessories: string[] } | null;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Estilo</h1>
      <p className="mt-1 text-white/45">Paleta de cores, peças e acessórios sugeridos.</p>

      {!style ? (
        <div className="glass mt-8 rounded-2xl p-10 text-center">
          <p className="text-white/50">Faça uma análise para receber sugestões de estilo.</p>
          <Link href="/system" className="btn-primary mt-4 inline-flex">Nova Análise</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <GlassCard>
            <p className="mb-2 font-display text-sm font-bold text-white/70">Paleta de cores</p>
            <ul className="space-y-1.5">
              {style.palette.map((c) => (
                <li key={c} className="text-sm text-white/60">{c}</li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard>
            <p className="mb-2 font-display text-sm font-bold text-white/70">Peças recomendadas</p>
            <ul className="space-y-1.5">
              {style.pieces.map((p) => (
                <li key={p} className="text-sm text-white/60">{p}</li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard>
            <p className="mb-2 font-display text-sm font-bold text-white/70">Acessórios</p>
            <ul className="space-y-1.5">
              {style.accessories.map((a) => (
                <li key={a} className="text-sm text-white/60">{a}</li>
              ))}
            </ul>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
