import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLastAnalysisFull } from "@/lib/getLastAnalysis";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export default async function BeardPage() {
  const session = await getServerSession(authOptions);
  const analysis = await getLastAnalysisFull(session!.user.id);
  const beard = analysis?.beardSuggestions as { fits: boolean; style: string; howToGrow: string[] } | null;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Barba</h1>
      <p className="mt-1 text-white/45">Se combina com você, qual estilo e como crescer.</p>

      {!beard ? (
        <div className="glass mt-8 rounded-2xl p-10 text-center">
          <p className="text-white/50">Faça uma análise para receber recomendações sobre barba.</p>
          <Link href="/system" className="btn-primary mt-4 inline-flex">Nova Análise</Link>
        </div>
      ) : (
        <GlassCard className="mt-6">
          <p className="text-sm text-white/40">Combina com você?</p>
          <p className={`mt-1 font-display text-lg font-bold ${beard.fits ? "text-emerald-400" : "text-amber-400"}`}>
            {beard.fits ? "Sim, combina bem" : "Estilo mais discreto recomendado"}
          </p>

          <p className="mt-4 text-sm text-white/40">Estilo sugerido</p>
          <p className="font-semibold text-white/85">{beard.style}</p>

          <p className="mt-4 mb-2 text-sm text-white/40">Como crescer</p>
          <ul className="space-y-1.5">
            {beard.howToGrow.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-white/60">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-neon-blue-bright" /> {tip}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
