import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLastAnalysisAttributes } from "@/lib/getLastAnalysis";
import { generateWorkoutPlan } from "@/lib/recommendations";
import { GlassCard } from "@/components/ui/GlassCard";
import { WorkoutLocationTabs } from "@/components/dashboard/WorkoutLocationTabs";

export default async function WorkoutPage() {
  const session = await getServerSession(authOptions);
  const attributes = await getLastAnalysisAttributes(session!.user.id);

  const homePlan = generateWorkoutPlan(attributes, "casa");
  const gymPlan = generateWorkoutPlan(attributes, "academia");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Rotina de Treino</h1>
      <p className="mt-1 text-white/45">
        Nível estimado: <span className="text-neon-blue-bright">{homePlan.level}</span>
        {!attributes && " (faça uma análise para personalizar ainda mais)"}
      </p>

      <GlassCard className="mt-6">
        <p className="text-sm text-white/60">{homePlan.progression}</p>
      </GlassCard>

      <WorkoutLocationTabs homePlan={homePlan} gymPlan={gymPlan} />
    </div>
  );
}
