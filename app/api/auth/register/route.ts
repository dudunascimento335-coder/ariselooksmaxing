import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { consumeRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = await consumeRateLimit("auth", ip);
    if (!limit.allowed) {
      return NextResponse.json({ error: limit.message }, { status: 429 });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Prisma usa queries parametrizadas nativamente -> já protege contra SQL Injection.
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Mensagem genérica para não confirmar quais emails existem no sistema
      return NextResponse.json(
        { error: "Não foi possível concluir o cadastro com esses dados." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name, // React/Next escapam JSX automaticamente -> mitiga XSS na renderização
        email,
        passwordHash,
      },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      },
    });

    const verifyLink = `${process.env.APP_URL}/verify-email?token=${token}`;
    await sendVerificationEmail(user.email, user.name, verifyLink);

    return NextResponse.json(
      { message: "Conta criada. Verifique seu email para ativar o Sistema." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
