import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token inválido." }, { status: 400 });
    }

    const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Link de verificação inválido ou expirado." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: "Email verificado com sucesso." });
  } catch (error) {
    console.error("[VERIFY_EMAIL_ERROR]", error);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
