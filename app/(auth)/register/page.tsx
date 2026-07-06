"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader as Loader2, CircleCheck as CheckCircle2 } from "lucide-react";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setServerError(json.error ?? "Erro ao criar conta.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <AuthShell title="Quase lá!" subtitle="Confirme seu email para ativar o Sistema.">
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          <p className="text-sm text-white/60">
            Enviamos um link de confirmação para o seu email. Clique nele para liberar sua
            análise gratuita.
          </p>
          <Link href="/login" className="btn-primary mt-2 w-full">
            Ir para o login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Ative seu Sistema" subtitle="Crie sua conta e comece com 1 análise gratuita.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-white/60">Nome</label>
          <input className="input-field" placeholder="Seu nome" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/60">Email</label>
          <input type="email" className="input-field" placeholder="voce@email.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/60">Senha</label>
          <input type="password" className="input-field" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
          <p className="mt-1 text-xs text-white/30">
            Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/60">Confirmar senha</label>
          <input type="password" className="input-field" placeholder="••••••••" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-rose-400">{serverError}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-neon-blue-bright hover:underline">
          Fazer login
        </Link>
      </p>
    </AuthShell>
  );
}
