import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlanSelector } from "@/components/dashboard/PlanSelector";

export default async function PlansPage() {
  const session = await getServerSession(authOptions);

  const currentSubscription = await prisma.subscription.findFirst({
    where: { userId: session!.user.id, status: "ACTIVE" },
    include: { plan: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Planos</h1>
      <p className="mt-1 text-white/45">Escolha o plano ideal para continuar sua evolução.</p>

      <PlanSelector currentTier={currentSubscription?.plan.tier ?? null} />
    </div>
  );
}
