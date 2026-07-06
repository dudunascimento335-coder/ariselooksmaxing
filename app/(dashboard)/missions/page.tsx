import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MissionsBoard } from "@/components/dashboard/MissionsBoard";

function todayNormalized() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function MissionsPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const today = todayNormalized();

  const [missions, userMissions] = await Promise.all([
    prisma.mission.findMany({ where: { isDaily: true }, orderBy: { xpReward: "asc" } }),
    prisma.userMission.findMany({ where: { userId, date: today } }),
  ]);

  const completedIds = new Set(userMissions.filter((m) => m.completed).map((m) => m.missionId));

  const data = missions.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    xpReward: m.xpReward,
    completed: completedIds.has(m.id),
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Missões Diárias</h1>
      <p className="mt-1 text-white/45">Complete hábitos saudáveis todos os dias e ganhe XP para subir de nível.</p>

      <MissionsBoard initialMissions={data} />
    </div>
  );
}
