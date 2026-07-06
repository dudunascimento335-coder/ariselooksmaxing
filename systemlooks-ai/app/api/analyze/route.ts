import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rateLimit";
import { analyzePhotoWithAI, analyzePhotoMock } from "@/lib/ai-analysis";
import { grantXp } from "@/lib/xp";

const ALLOWED_IMAGE_HOSTS = ["utfs.io", "ufs.sh"]; // ajuste conforme seu provedor de upload

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const limit = await consumeRateLimit("analyze", session.user.id);
    if (!limit.allowed) {
      return NextResponse.json({ error: limit.message }, { status: 429 });
    }

    const { imageUrl } = await req.json();
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
    }

    // Upload seguro: só aceita URLs do nosso provedor de upload confiável
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return NextResponse.json({ error: "URL de imagem inválida." }, { status: 400 });
    }
    const hostAllowed = ALLOWED_IMAGE_HOSTS.some((h) => parsedUrl.hostname.endsWith(h));
    if (!hostAllowed) {
      return NextResponse.json({ error: "Origem da imagem não permitida." }, { status: 400 });
    }

    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Confirme seu email antes de usar o Sistema." },
        { status: 403 }
      );
    }

    // Verifica direito a análise: 1 grátis, depois exige assinatura ativa com saldo
    const activeSubscription = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    if (!activeSubscription) {
      if (user.freeAnalysisUsed) {
        return NextResponse.json(
          { error: "Você já usou sua análise gratuita. Assine um plano para continuar." },
          { status: 402 }
        );
      }
    } else {
      const limitReached =
        activeSubscription.plan.analysisLimit !== -1 &&
        activeSubscription.analysesUsedThisCycle >= activeSubscription.plan.analysisLimit;

      if (limitReached) {
        return NextResponse.json(
          { error: "Limite de análises do seu plano atingido neste ciclo." },
          { status: 402 }
        );
      }
    }

    const photo = await prisma.photo.create({
      data: { userId: user.id, url: imageUrl },
    });

    const result =
      process.env.OPENAI_API_KEY ? await analyzePhotoWithAI(imageUrl) : await analyzePhotoMock();

    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        photoId: photo.id,
        overallScore: result.overallScore,
        attributes: result.attributes as any,
        haircutSuggestions: result.haircutSuggestions as any,
        beardSuggestions: result.beardSuggestions as any,
        styleSuggestions: result.styleSuggestions as any,
      },
    });

    // Consome o crédito de análise
    if (!activeSubscription) {
      await prisma.user.update({ where: { id: user.id }, data: { freeAnalysisUsed: true } });
    } else {
      await prisma.subscription.update({
        where: { id: activeSubscription.id },
        data: { analysesUsedThisCycle: { increment: 1 } },
      });
    }

    await grantXp(user.id, 25, "Análise do Sistema concluída");

    return NextResponse.json({ analysis }, { status: 201 });
  } catch (error) {
    console.error("[ANALYZE_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao processar a análise. Tente novamente." },
      { status: 500 }
    );
  }
}
