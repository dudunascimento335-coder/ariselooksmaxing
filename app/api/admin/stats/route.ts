import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const [
    totalUsers,
    activeSubscriptions,
    totalAnalyses,
    revenueAgg,
    usersByPlan,
    recentPayments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.analysis.count(),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amountInCents: true },
    }),
    prisma.subscription.groupBy({
      by: ["planId"],
      where: { status: "ACTIVE" },
      _count: { _all: true },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return NextResponse.json({
    totalUsers,
    activeSubscriptions,
    totalAnalyses,
    totalRevenueInCents: revenueAgg._sum.amountInCents ?? 0,
    usersByPlan,
    recentPayments,
  });
}
